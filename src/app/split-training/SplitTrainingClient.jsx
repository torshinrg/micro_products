"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Utility function to select random exercises
function getRandomExercises(list, count) {
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function SplitTrainingClient({ initialWarmUp, initialTraining }) {
  const [warmUpRoutine, setWarmUpRoutine] = useState(initialWarmUp || []);
  const [trainingRoutine, setTrainingRoutine] = useState(initialTraining || []);
  const [timers, setTimers] = useState({}); // Ensure timers is an object

  const generateRoutine = () => {
    setWarmUpRoutine(getRandomExercises(initialWarmUp, 3));
    setTrainingRoutine(getRandomExercises(initialTraining, 7));
    setTimers({}); // Reset timers on new routine generation
  };

  const startTimer = (type, index, time) => {
    const key = `${type}_${index}`; // Ensure unique key (e.g., "warmup_0", "training_1")

    setTimers((prevTimers) => ({ ...prevTimers, [key]: time }));

    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        if (!prevTimers[key] || prevTimers[key] <= 0) {
          clearInterval(interval);
          return { ...prevTimers, [key]: 0 };
        }
        return { ...prevTimers, [key]: prevTimers[key] - 1 };
      });
    }, 1000);
  };

  return (
    <div className="p-6 flex flex-col items-center text-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">Random Split Training</h1>
      <Button
        onClick={generateRoutine}
        className="mb-4 bg-green-500 text-black hover:bg-green-400"
      >
        Generate Routine
      </Button>

      <div className="w-full max-w-lg">
        {/* Warm-up Section */}
        {warmUpRoutine.length > 0 && (
          <h2 className="text-lg font-bold mt-4 mb-2">Warm-up</h2>
        )}
        {warmUpRoutine.map((exercise, index) => {
          const key = `warmup_${index}`;
          return (
            <Card key={key} className="mb-2 p-2 bg-gray-800 text-white">
              <CardContent className="flex justify-between items-center text-left">
                <div>
                  <p className="font-semibold">{exercise.name}</p>
                  <p className="text-sm text-gray-400">{exercise.description}</p>
                </div>
                <p
                  className="text-sm font-bold text-green-400 cursor-pointer"
                  onClick={() => startTimer("warmup", index, exercise.time)}
                >
                  {timers[key] !== undefined ? timers[key] : exercise.time}s
                </p>
              </CardContent>
            </Card>
          );
        })}

        {/* Training Section */}
        {trainingRoutine.length > 0 && (
          <h2 className="text-lg font-bold mt-4 mb-2">Training</h2>
        )}
        {trainingRoutine.map((exercise, index) => {
          const key = `training_${index}`;
          return (
            <Card key={key} className="mb-2 p-2 bg-gray-800 text-white">
              <CardContent className="flex justify-between items-center text-left">
                <div>
                  <p className="font-semibold">{exercise.name}</p>
                  <p className="text-sm text-gray-400">{exercise.description}</p>
                </div>
                <p
                  className="text-sm font-bold text-green-400 cursor-pointer"
                  onClick={() => startTimer("training", index, exercise.time)}
                >
                  {timers[key] !== undefined ? timers[key] : exercise.time}s
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
