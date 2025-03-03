"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Timer } from "@/components/ui/Timer";
import { openYouTubeSearch } from "@/utils/openYouTubeSearch";
import { FeedbackPopup } from "@/components/common/FeedbackPopup";
import { ExerciseService } from "@/services/ExerciseService";

export default function WorkoutPage() {
  const params = useParams();
  const router = useRouter();
  
  // Guard if workout param is not available.
  if (!params || !params.workout) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Workout not defined</div>;
  }

  // Convert hyphens back to spaces for display and lookup.
  const workoutName = decodeURIComponent(params.workout.replace(/-/g, " "));

  const [warmUpList, setWarmUpList] = useState([]);
  const [mainList, setMainList] = useState([]);
  const [combinedRoutine, setCombinedRoutine] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const defaultExerciseTime = 30;
  const defaultRestTime = 15;

  useEffect(() => {
    async function fetchExercises() {
      await ExerciseService.loadTrainings();
      // Retrieve warm‑up and main routine exercises using your new keys
      const warmUps = ExerciseService.getRandomWarmUpExercises(workoutName, 5, 10);
      const mainEx = ExerciseService.getRandomExercises(workoutName, 5);

      const doubleHandler = (list) =>
        list.flatMap((ex) =>
          ex.double ? [{ ...ex, note: "first side" }, { ...ex, note: "second side" }] : [ex]
        );

      const warmUpFinal = doubleHandler(warmUps);
      const mainFinal = doubleHandler(mainEx);

      setWarmUpList(warmUpFinal);
      setMainList(mainFinal);

      // Combine routines (warm‑up first)
      const combined = [...warmUpFinal, ...mainFinal].slice(0, 10);
      setCombinedRoutine(combined);

      if (combined.length > 0) {
        setTime(combined[0].time || defaultExerciseTime);
      }
    }
    fetchExercises();
  }, [workoutName]);

  const currentExercise = combinedRoutine[currentIndex] || null;
  const nextExercise = combinedRoutine[currentIndex + 1] || null;

  const handleTimerFinish = () => {
    if (isResting) {
      setIsResting(false);
      const nextIndex = currentIndex + 1;
      if (nextIndex < combinedRoutine.length) {
        setCurrentIndex(nextIndex);
        setTime(combinedRoutine[nextIndex].time || defaultExerciseTime);
      } else {
        setIsRunning(false);
        setShowFeedback(true);
      }
    } else {
      if (currentIndex < combinedRoutine.length - 1) {
        setIsResting(true);
        setTime(defaultRestTime);
      } else {
        setIsRunning(false);
        setShowFeedback(true);
      }
    }
  };

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  // Pause timer on page visibility change.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsRunning(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Clicking on a card (except the title link) will jump to that exercise.
  const handleCardClick = (index) => {
    setCurrentIndex(index);
    setTime(combinedRoutine[index].time || defaultExerciseTime);
    setIsRunning(true);
  };

  const handleFeedback = (feedback) => {
    const workoutKey = `workoutLevel_${workoutName}`;
    let currentLevel =
      parseInt(localStorage.getItem(workoutKey)) ||
      parseInt(localStorage.getItem("workoutLevel")) ||
      5;
    if (feedback === "easy") currentLevel += 1;
    else if (feedback === "hard") currentLevel = Math.max(1, currentLevel - 1);
    localStorage.setItem(workoutKey, currentLevel);

    let streak = parseInt(localStorage.getItem("trainingStreak")) || 0;
    localStorage.setItem("trainingStreak", streak + 1);
    if (streak + 1 === 30) {
      alert("Congratulations! You've reached a 30-day training streak!");
    }
    setShowFeedback(false);
    router.push("/");
  };

  return (
    <div className="p-6 flex flex-col items-center text-center bg-gray-900 text-white min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">{workoutName}</h1>

      <Timer time={time} setTime={setTime} isRunning={isRunning} onFinish={handleTimerFinish} />

      <Button className="mt-4" onClick={handleStartPause}>
        {isRunning ? "Pause" : "Start"}
      </Button>

      <div className="space-y-2">
        {currentExercise && (
          <div className="text-xl">
            Current:{" "}
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                currentExercise.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline cursor-pointer text-blue-400"
            >
              {currentExercise.name}
              {currentExercise.note ? ` (${currentExercise.note})` : ""}
            </a>
          </div>
        )}
        {nextExercise && (
          <div className="text-lg text-gray-400">
            Next:{" "}
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                nextExercise.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline cursor-pointer"
            >
              {nextExercise.name}
              {nextExercise.note ? ` (${nextExercise.note})` : ""}
            </a>
          </div>
        )}
      </div>

      <div className="mt-6 w-full max-w-3xl space-y-4">
        {warmUpList.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Warm Up</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warmUpList.map((ex, idx) => (
                <div
                  key={idx}
                  className={`p-4 border rounded bg-gray-800 cursor-pointer ${
                    combinedRoutine.indexOf(ex) === currentIndex ? "bg-green-700" : ""
                  }`}
                  onClick={() => handleCardClick(combinedRoutine.indexOf(ex))}
                >
                  <h3 className="text-lg font-semibold text-blue-400">
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {ex.name}
                      {ex.note ? ` (${ex.note})` : ""}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-400">{ex.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {mainList.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Main Workout</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mainList.map((ex, idx) => (
                <div
                  key={idx}
                  className={`p-4 border rounded bg-gray-800 cursor-pointer ${
                    combinedRoutine.indexOf(ex) === currentIndex ? "bg-green-700" : ""
                  }`}
                  onClick={() => handleCardClick(combinedRoutine.indexOf(ex))}
                >
                  <h3 className="text-lg font-semibold text-blue-400">
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {ex.name}
                      {ex.note ? ` (${ex.note})` : ""}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-400">{ex.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button className="mt-6" onClick={() => router.push("/")}>
        Back to Home
      </Button>

      {showFeedback && (
        <FeedbackPopup workoutType={workoutName} onFeedback={handleFeedback} />
      )}
    </div>
  );
}
