"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function Training() {
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const selectedWorkouts = JSON.parse(localStorage.getItem("todaysWorkouts")) || [];
    setTodaysWorkouts(selectedWorkouts);
  }, []);

  const startWorkout = (workoutName) => {
    const formattedWorkout = workoutName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/training/${encodeURIComponent(formattedWorkout)}`);
  };

  const handleSelectAll = () => {
    const storedPreferred = JSON.parse(localStorage.getItem("preferredWorkouts")) || [];
    setTodaysWorkouts(storedPreferred);
  };

  return (
    <main className="p-6 flex flex-col items-center text-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">Today's Training Plan</h1>
      <button onClick={handleSelectAll} className="text-sm text-blue-400 underline mb-4">
        Select All
      </button>
      {todaysWorkouts.length === 0 ? (
        <p>No workouts selected for today.</p>
      ) : (
        <div className="w-full max-w-lg">
          {todaysWorkouts.map((workout, idx) => (
            <Button key={idx} className="w-full p-4 text-xl mb-4" onClick={() => startWorkout(workout)}>
              {workout}
            </Button>
          ))}
        </div>
      )}
    </main>
  );
}
