// File: src/hooks/useSplitTraining.js
import { useState, useEffect } from "react";
import { ExerciseService } from "@/services/ExerciseService";

export function useSplitTraining({ warmUpExercises, trainingExercises, initialWarmUp = [], initialTraining = [] }) {
  const [warmUpRoutine, setWarmUpRoutine] = useState(initialWarmUp);
  const [trainingRoutine, setTrainingRoutine] = useState(initialTraining);
  const [globalTimer, setGlobalTimer] = useState(initialWarmUp[0]?.time || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(initialWarmUp[0] || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [hasStarted, setHasStarted] = useState(initialWarmUp.length > 0);

  useEffect(() => {
    let interval;
    if (isRunning && globalTimer > 0) {
      interval = setInterval(() => {
        setGlobalTimer((prev) => prev - 1);
      }, 1000);
    } else if (globalTimer === 0 && isRunning) {
      handleNextExercise();
    }
    return () => clearInterval(interval);
  }, [isRunning, globalTimer]);

  const handleNextExercise = () => {
    const allExercises = [...warmUpRoutine, ...trainingRoutine];
    const nextIndex = currentIndex + 1;
    if (nextIndex >= allExercises.length) {
      // End routine – stop the timer.
      setIsRunning(false);
      return;
    }
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

  const startPauseTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const generateRoutine = () => {
    const newWarmUp = ExerciseService.getRandomExercises(warmUpExercises, 3, true);
    const newTraining = ExerciseService.getRandomExercises(trainingExercises, 5, true);
    setWarmUpRoutine(newWarmUp);
    setTrainingRoutine(newTraining);
    setCurrentIndex(0);
    setIsRunning(false);
    setIsResting(false);
    setCurrentExercise(newWarmUp[0]);
    setGlobalTimer(newWarmUp[0]?.time || 0);
    setHasStarted(true);
  };

  return {
    warmUpRoutine,
    trainingRoutine,
    globalTimer,
    isRunning,
    currentExercise,
    currentIndex,
    isResting,
    hasStarted,
    startPauseTimer,
    handleNextExercise,
    generateRoutine,
  };
}
