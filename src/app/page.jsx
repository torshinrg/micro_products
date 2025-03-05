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
  const [averageLevel, setAverageLevel] = useState(null);
  const router = useRouter();

  // Load training options once
  useEffect(() => {
    async function loadTrainings() {
      await ExerciseService.loadTrainings();
      setTrainingOptions(ExerciseService.getTrainingTypes());
    }
    loadTrainings();
  }, []);

  // Load overall workout level and preferred workouts
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

  // Calculate the average training level from all keys starting with "workoutLevel"
  useEffect(() => {
    const levelKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("workoutLevel")
    );
    const levels = levelKeys
      .map((key) => parseInt(localStorage.getItem(key)))
      .filter((num) => !isNaN(num));
    if (levels.length > 0) {
      const avg = Math.round(levels.reduce((sum, num) => sum + num, 0) / levels.length);
      setAverageLevel(avg);
    }
  }, [workoutLevel, preferredWorkouts]);

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
    let todaysWorkoutsStr = JSON.stringify(todayWorkouts);
    window.dataLayer.push({ event: "event_training_plan_started", todaysWorkouts: todaysWorkoutsStr });
    router.push("/training");
  };

  return (
    <>
      <main className="flex flex-col h-screen bg-gray-900 text-white p-6">
        {/* Top Area: Title */}
        <div className="h-1/4 flex flex-col items-center justify-center">
          {averageLevel !== null && (
            <p className="mb-2 text-lg">
              Your Average Training Level: <strong>{averageLevel}</strong>
            </p>
          )}
          <h1 className="text-2xl font-bold">Welcome to Your Training Planner</h1>
        </div>

        {/* Middle Area: Scrollable Preferred Workouts */}
        <div className="h-2/4 overflow-y-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {preferredWorkouts.map((workout, idx) => (
              <button
                key={idx}
                className={`
          w-full p-4 border rounded 
          text-center text-sm leading-tight 
          whitespace-normal break-words
          ${todayWorkouts.includes(workout) ? "bg-blue-500" : "bg-gray-700"}
        `}
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
                onClick={() => {
                  // Your existing onClick logic...
                }}
              >
                {workout}
              </button>
            ))}
          </div>
        </div>
        {/* Bottom Area: Button */}
        <div className="h-1/4 flex items-center justify-center">
          <Button onClick={startTrainingPlan}>
            Start My Training Plan
          </Button>
        </div>
      </main>

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
          <h2 className="text-xl mb-4 text-center">Select Your Preferred Workouts</h2>
          <button
            onClick={() => setPreferredWorkouts(trainingOptions)}
            className="block mx-auto text-sm text-blue-400 underline mb-2"
          >
            Select All
          </button>
          {/* Wrapping grid in a scrollable container if needed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {trainingOptions.map((workout) => (
              <button
                key={workout}
                className={`
            p-3 border rounded text-center text-sm whitespace-normal break-words
            ${preferredWorkouts.includes(workout) ? "bg-blue-500" : "bg-gray-700"}
          `}
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
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
          <Button className="mt-6 w-full" onClick={savePreferredWorkouts}>
            Save Workouts
          </Button>
        </Popup>
      )}

    </>
  );
}
