// File: src/app/split-training/SplitTrainingClient.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Define the same exercise lists for generating new routines on the client
const warmUpExercises = [
  {
    name: "Leg Swings (Front-to-Back)",
    description: "Stand near a wall for balance and swing each leg forward and backward in a controlled motion.",
    time: 30,
  },
  {
    name: "Leg Swings (Side-to-Side)",
    description: "Face the wall and swing each leg laterally to open up your hips.",
    time: 30,
  },
  {
    name: "Hip Circles",
    description: "Place your hands on your hips and rotate them in circles.",
    time: 30,
  },
  // ... add any additional warm-up exercises you want
];

const trainingExercises = [
  {
    name: "Seated Forward Fold",
    description: "Sit with your legs extended and hinge at the hips to reach for your feet.",
    time: 60,
  },
  {
    name: "Kneeling Hamstring Stretch",
    description: "Kneel on one knee with the other leg extended forward; lean into the stretch.",
    time: 60,
  },
  {
    name: "Deep Runner’s Lunge",
    description: "From a lunge position, drop the back knee and press your hips forward.",
    time: 60,
  },
  // ... add any additional training exercises you want
];

// Utility function to select random exercises
function getRandomExercises(list, count) {
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function SplitTrainingClient({ initialWarmUp, initialTraining }) {
  const [warmUpRoutine, setWarmUpRoutine] = useState(initialWarmUp);
  const [trainingRoutine, setTrainingRoutine] = useState(initialTraining);

  const generateRoutine = () => {
    setWarmUpRoutine(getRandomExercises(warmUpExercises, 3));
    setTrainingRoutine(getRandomExercises(trainingExercises, 5));
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
        {warmUpRoutine.length > 0 && (
          <h2 className="text-lg font-bold mt-4 mb-2">Warm-up</h2>
        )}
        {warmUpRoutine.map((exercise, index) => (
          <Card key={index} className="mb-2 p-2 bg-gray-800 text-white">
            <CardContent className="flex justify-between items-center text-left">
              <div>
                <p className="font-semibold">{exercise.name}</p>
                <p className="text-sm text-gray-400">{exercise.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {trainingRoutine.length > 0 && (
          <h2 className="text-lg font-bold mt-4 mb-2">Training</h2>
        )}
        {trainingRoutine.map((exercise, index) => (
          <Card
            key={index + warmUpRoutine.length}
            className="mb-2 p-2 bg-gray-800 text-white"
          >
            <CardContent className="flex justify-between items-center text-left">
              <div>
                <p className="font-semibold">{exercise.name}</p>
                <p className="text-sm text-gray-400">{exercise.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
