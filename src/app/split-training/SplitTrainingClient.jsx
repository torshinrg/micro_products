"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Maximize, Minimize, X } from "lucide-react"; // Fullscreen & Close Icons

// Utility function to get exercises, including "double" ones
function getRandomExercises(list, count) {
  return [...list]
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .flatMap((exercise) =>
      exercise.double
        ? [exercise, { ...exercise, name: `${exercise.name} (Other Side)` }]
        : [exercise]
    ); // Duplicate "double" exercises
}

export default function SplitTrainingClient({
  initialWarmUp,
  initialTraining,
}) {
  const [warmUpRoutine, setWarmUpRoutine] = useState([]);
  const [trainingRoutine, setTrainingRoutine] = useState([]);
  const [timers, setTimers] = useState({});
  const [globalTimer, setGlobalTimer] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Load sound effect
  const beepSound =
    typeof window !== "undefined" ? new Audio("/sounds/beep.mp3") : null;

  const generateRoutine = () => {
    const newWarmUp = getRandomExercises(initialWarmUp, 3);
    const newTraining = getRandomExercises(initialTraining, 5);

    setWarmUpRoutine(newWarmUp);
    setTrainingRoutine(newTraining);
    setTimers({});
    setCurrentIndex(0);
    setIsRunning(false);
    setIsResting(false);
    setCurrentExercise(newWarmUp[0]);
    setGlobalTimer(newWarmUp[0]?.time || 0);
    setHasStarted(true);
  };

  const startPauseTimer = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (isRunning && globalTimer > 0) {
      const interval = setInterval(() => {
        setGlobalTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (globalTimer === 0 && isRunning) {
      handleNextExercise();
    }
  }, [isRunning, globalTimer]);

  const handleNextExercise = () => {
    if (beepSound) beepSound.play();

    const allExercises = [...warmUpRoutine, ...trainingRoutine];
    const nextIndex = currentIndex + 1;

    if (isResting) {
      setIsResting(false);
      setCurrentExercise(allExercises[nextIndex]);
      setGlobalTimer(allExercises[nextIndex]?.time || 0);
      setCurrentIndex(nextIndex);
    } else {
      const restTime = nextIndex < warmUpRoutine.length ? 15 : 30;
      setIsResting(true);
      setGlobalTimer(restTime);
    }
  };

  // Open YouTube search
  const openYouTubeSearch = (exerciseName) => {
    const query = encodeURIComponent(exerciseName);
    const url = `https://www.youtube.com/results?search_query=${query}`;
    window.open(url, "_blank");
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get next exercise
  const allExercises = [...warmUpRoutine, ...trainingRoutine];
  const nextExercise = allExercises[currentIndex + 1];

  return (
    <div className="p-6 flex flex-col items-center text-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">Random Split Training</h1>
      <Button
        onClick={generateRoutine}
        className="mb-4 bg-green-500 text-black hover:bg-green-400"
      >
        Generate Routine
      </Button>

      {/* GLOBAL TIMER SECTION - Only Show If Routine Has Started */}
      {hasStarted && currentExercise && (
        <div className="relative w-full max-w-lg mb-4 p-6 bg-gray-800 rounded-lg shadow-md">
          {/* Fullscreen Toggle Button */}
          <button
            className="absolute top-2 right-2 text-white"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>

          <h2 className="text-2xl font-bold">
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                currentExercise.name
              )}`}
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              {isResting ? "Resting..." : currentExercise.name}
            </a>
          </h2>
          <p className="text-6xl font-bold text-green-400">{globalTimer}s</p>
          <Button
            onClick={startPauseTimer}
            className="mt-4 bg-blue-500 text-white"
          >
            {isRunning ? "Pause Timer" : "Start Timer"}
          </Button>

          {/* Show next exercise below timer with opacity */}
          {nextExercise && (
            <p className="mt-4 text-lg text-gray-400 opacity-70">
              Next:{" "}
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  nextExercise.name
                )}`}
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                {nextExercise.name}
              </a>
            </p>
          )}
        </div>
      )}

      {/* FULLSCREEN POPUP TIMER */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-6">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700 w-full max-w-2xl text-center">
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white"
              onClick={toggleFullscreen}
            >
              <X size={30} />
            </button>

            <h2 className="text-3xl font-bold">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  currentExercise.name
                )}`}
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                {isResting ? "Resting..." : currentExercise.name}
              </a>
            </h2>
            <p className="text-8xl font-bold text-green-400 mt-4">
              {globalTimer}s
            </p>
            <Button
              onClick={startPauseTimer}
              className="mt-6 bg-blue-500 text-white text-xl px-6 py-3"
            >
              {isRunning ? "Pause Timer" : "Start Timer"}
            </Button>

            {nextExercise && (
              <p className="mt-6 text-2xl text-gray-300">
                Next:{" "}
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    nextExercise.name
                  )}`}
                  target="_blank"
                  className="text-blue-400 hover:underline"
                >
                  {nextExercise.name}
                </a>
              </p>
            )}
          </div>
        </div>
      )}
      {/* Only Show Exercises If Routine Has Started */}
      {hasStarted && (
        <div className="w-full max-w-lg">
          {/* Warm-up Section */}
          {warmUpRoutine.length > 0 && (
            <h2 className="text-lg font-bold mt-4 mb-2">Warm-up</h2>
          )}
          {warmUpRoutine.map((exercise, index) => {
            const key = `warmup_${index}`;
            return (
              <Card
                key={key}
                className={`mb-2 p-2 ${
                  currentExercise === exercise ? "bg-green-700" : "bg-gray-800"
                } text-white`}
              >
                <CardContent className="flex justify-between items-center text-left">
                  <div>
                    <p
                      className="font-semibold text-blue-400 cursor-pointer hover:underline"
                      onClick={() => openYouTubeSearch(exercise.name)}
                    >
                      {exercise.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {exercise.description}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-green-400 cursor-pointer">
                    {exercise.time}s
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
              <Card
                key={key}
                className={`mb-2 p-2 ${
                  currentExercise === exercise ? "bg-green-700" : "bg-gray-800"
                } text-white`}
              >
                <CardContent className="flex justify-between items-center text-left">
                  <div>
                    <p
                      className="font-semibold text-blue-400 cursor-pointer hover:underline"
                      onClick={() => openYouTubeSearch(exercise.name)}
                    >
                      {exercise.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {exercise.description}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-green-400 cursor-pointer">
                    {exercise.time}s
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
