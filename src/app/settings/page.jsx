"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ExerciseService } from "@/services/ExerciseService";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [exerciseTime, setExerciseTime] = useState(60);
  const [restTime, setRestTime] = useState(15);
  const [preferredWorkouts, setPreferredWorkouts] = useState([]);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [trainingOptions, setTrainingOptions] = useState([]);

  const router = useRouter();

  // Load stored settings and training options on mount
  useEffect(() => {
    const storedExerciseTime = localStorage.getItem("exerciseTime");
    const storedRestTime = localStorage.getItem("restTime");
    const storedPreferred = JSON.parse(localStorage.getItem("preferredWorkouts")) || [];
    const storedTodays = JSON.parse(localStorage.getItem("todaysWorkouts")) || [];

    if (storedExerciseTime) {
      setExerciseTime(parseInt(storedExerciseTime));
    }
    if (storedRestTime) {
      setRestTime(parseInt(storedRestTime));
    }
    setPreferredWorkouts(storedPreferred);
    setTodaysWorkouts(storedTodays);

    async function loadOptions() {
      await ExerciseService.loadTrainings();
      setTrainingOptions(ExerciseService.getTrainingTypes());
    }
    loadOptions();
  }, []);

  const togglePreferredWorkout = (workout) => {
    setPreferredWorkouts((prev) =>
      prev.includes(workout)
        ? prev.filter((w) => w !== workout)
        : [...prev, workout]
    );
  };

  const toggleTodaysWorkout = (workout) => {
    setTodaysWorkouts((prev) =>
      prev.includes(workout)
        ? prev.filter((w) => w !== workout)
        : [...prev, workout]
    );
  };

  const handleSaveSettings = () => {
    localStorage.setItem("exerciseTime", exerciseTime);
    localStorage.setItem("restTime", restTime);
    localStorage.setItem("preferredWorkouts", JSON.stringify(preferredWorkouts));
    localStorage.setItem("todaysWorkouts", JSON.stringify(todaysWorkouts));
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const selectAllPreferred = () => {
    setPreferredWorkouts(trainingOptions);
  };

  const selectAllTodays = () => {
    setTodaysWorkouts(trainingOptions);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <div className="w-full max-w-lg">
        {/* Training Time Input */}
        <div className="mb-4">
          <label className="block mb-1">Training Time (seconds):</label>
          <input
            type="number"
            value={exerciseTime}
            onChange={(e) => setExerciseTime(parseInt(e.target.value))}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>

        {/* Rest Time Input */}
        <div className="mb-4">
          <label className="block mb-1">Rest Time (seconds):</label>
          <input
            type="number"
            value={restTime}
            onChange={(e) => setRestTime(parseInt(e.target.value))}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>

        {/* Preferred Workouts */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold mb-2">Preferred Workouts</h2>
            <button onClick={selectAllPreferred} className="text-sm text-blue-400 underline">
              Select All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {trainingOptions.map((workout) => (
              <button
                key={workout}
                className={`p-2 border rounded ${
                  preferredWorkouts.includes(workout) ? "bg-blue-500" : "bg-gray-700"
                }`}
                onClick={() => togglePreferredWorkout(workout)}
              >
                {workout}
              </button>
            ))}
          </div>
        </div>

        {/* Today's Workout */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold mb-2">Today's Workout</h2>
            <button onClick={selectAllTodays} className="text-sm text-blue-400 underline">
              Select All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {trainingOptions.map((workout) => (
              <button
                key={workout}
                className={`p-2 border rounded ${
                  todaysWorkouts.includes(workout) ? "bg-green-500" : "bg-gray-700"
                }`}
                onClick={() => toggleTodaysWorkout(workout)}
              >
                {workout}
              </button>
            ))}
          </div>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-between mt-6">
          <Button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-400">
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} className="ml-4">
            Save Settings
          </Button>
        </div>
      </div>
    </main>
  );
}
