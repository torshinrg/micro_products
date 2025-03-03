"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Popup } from "@/components/common/Popup";
import { ExerciseService } from "@/services/ExerciseService";
import { TestFanfare } from "@/components/common/TestFanfare";
import { FireworkAnimation } from "@/components/common/FireworkAnimation";

export default function HomePage() {
  const [workoutLevel, setWorkoutLevel] = useState(null);
  const [preferredWorkouts, setPreferredWorkouts] = useState([]);
  const [showLevelPopup, setShowLevelPopup] = useState(false);
  const [showWorkoutPopup, setShowWorkoutPopup] = useState(false);
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [trainingOptions, setTrainingOptions] = useState([]);
  const router = useRouter();
  

  useEffect(() => {
    async function loadTrainings() {
      await ExerciseService.loadTrainings();
      setTrainingOptions(ExerciseService.getTrainingTypes());
    }
    loadTrainings();
  }, []);

  useEffect(() => {
    const storedLevel = localStorage.getItem("workoutLevel");
    const storedWorkouts = JSON.parse(localStorage.getItem("preferredWorkouts")) || [];

    if (!storedLevel) {
      setShowLevelPopup(true);
    } else {
      setWorkoutLevel(parseInt(storedLevel));
    }

    if (storedWorkouts.length === 0) {
      setShowWorkoutPopup(true);
    } else {
      setPreferredWorkouts(storedWorkouts);
    }
  }, []);

  const saveWorkoutLevel = (level) => {
    localStorage.setItem("workoutLevel", level);
    setWorkoutLevel(level);
    setShowLevelPopup(false);
    setShowWorkoutPopup(true);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "event_workout_level_chosen", level });
  };

  const savePreferredWorkouts = () => {
    localStorage.setItem("preferredWorkouts", JSON.stringify(preferredWorkouts));
    // For each preferred workout, if there’s no specific level, copy the overall level
    preferredWorkouts.forEach((workout) => {
      const key = `workoutLevel_${workout}`;
      if (!localStorage.getItem(key) && workoutLevel) {
        localStorage.setItem(key, workoutLevel);
      }
    });
    setShowWorkoutPopup(false);
    window.dataLayer.push({ event: "event_preferred_workouts_set", workouts: preferredWorkouts });
  
  };
  

  const startTrainingPlan = () => {
    localStorage.setItem("todaysWorkouts", JSON.stringify(todayWorkouts));
    let todaysWorkouts = JSON.stringify(todayWorkouts);
    window.dataLayer.push({ event: "event_training_plan_started", todaysWorkouts });
    router.push("/training");
  };

  const [playFireworks, setPlayFireworks] = useState(false);

  return (
    
    
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-xl font-bold mb-4">Welcome to Your Training Planner</h1>
      
      {workoutLevel && preferredWorkouts.length > 0 ? (
        <>
          <h2 className="text-lg mb-4">What workouts do you want to do today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preferredWorkouts.map((workout, idx) => (
              <button
                key={idx}
                className={`p-4 border rounded ${
                  todayWorkouts.includes(workout) ? "bg-blue-500" : "bg-gray-700"
                }`}
                onClick={() =>
                  setTodayWorkouts((prev) =>
                    prev.includes(workout)
                      ? prev.filter((w) => w !== workout)
                      : [...prev, workout]
                  )
                }
              >
                {workout}
              </button>
            ))}
          </div>
          <Button className="mt-6" onClick={startTrainingPlan}>
            Start My Training Plan
          </Button>
        </>
      ) : (
        <p>Loading...</p>
      )}

      {showLevelPopup && (
        <Popup onClose={() => setShowLevelPopup(false)}>
          <h2 className="text-xl mb-4">Select Your Workout Level (1-10)</h2>
          <div className="grid grid-cols-5 gap-2">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                className="p-3 border rounded bg-gray-700 hover:bg-gray-500"
                onClick={() => saveWorkoutLevel(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </Popup>
      )}

      {showWorkoutPopup && (
        <Popup onClose={savePreferredWorkouts}>
          <h2 className="text-xl mb-4">Select Your Preferred Workouts</h2>
          <div className="grid grid-cols-2 gap-2">
            {trainingOptions.map((workout) => (
              <button
                key={workout}
                className={`p-3 border rounded ${
                  preferredWorkouts.includes(workout) ? "bg-blue-500" : "bg-gray-700"
                }`}
                onClick={() =>
                  setPreferredWorkouts((prev) =>
                    prev.includes(workout)
                      ? prev.filter((w) => w !== workout)
                      : [...prev, workout]
                  )
                }
              >
                {workout}
              </button>
            ))}
          </div>
          <Button className="mt-6" onClick={savePreferredWorkouts}>
            Save Workouts
          </Button>
        </Popup>
      )}
    </main>
    
  );
}
