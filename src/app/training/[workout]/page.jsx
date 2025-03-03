// File: src/app/split-training/[workout]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Timer } from "@/components/ui/Timer";
import { openYouTubeSearch } from "@/utils/openYouTubeSearch";
import { ExerciseService } from "@/services/ExerciseService";
import { FeedbackPopup } from "@/components/common/FeedbackPopup";

export default function WorkoutPage() {
  const { workout } = useParams();
  const router = useRouter();
  // Convert hyphens back to spaces
  const workoutName = decodeURIComponent(workout.replace(/-/g, " "));

  // Combined routine: an array of groups (each group is an array of one or two exercises)
  const [combinedRoutine, setCombinedRoutine] = useState([]);
  // Active group index
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  // Timer state
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Get user-set timer values from localStorage (or use defaults)
  const defaultExerciseTime = parseInt(localStorage.getItem("exerciseTime")) || 30;
  const defaultRestTime = parseInt(localStorage.getItem("restTime")) || 15;

  // Load the routine on mount: warm ups first then main exercises.
  useEffect(() => {
    async function fetchRoutine() {
      await ExerciseService.loadTrainings();
      const warmUpGroups = ExerciseService.getGroupedWarmUpExercises(workoutName, 5, 10);
      const mainGroups = ExerciseService.getGroupedExercises(workoutName, 10);
      const combined = [...warmUpGroups, ...mainGroups];
      setCombinedRoutine(combined);
      if (combined.length > 0 && combined[0][0]) {
        setTime(combined[0][0].time || defaultExerciseTime);
      }
    }
    fetchRoutine();
  }, [workoutName, defaultExerciseTime]);

  // Timer effect – count down and call handleTimerFinish when time reaches 0.
  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      handleTimerFinish();
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  // When timer finishes: if resting then move to next group; if exercise done then start rest.
  const handleTimerFinish = () => {
    if (isResting) {
      setIsResting(false);
      if (currentGroupIndex + 1 < combinedRoutine.length) {
        setCurrentGroupIndex(currentGroupIndex + 1);
        setTime(combinedRoutine[currentGroupIndex + 1][0].time || defaultExerciseTime);
      } else {
        setIsRunning(false);
        setShowFeedback(true);
      }
    } else {
      if (currentGroupIndex < combinedRoutine.length - 1) {
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

  // Switch the current group at the given index with an alternative that hasn't been chosen yet.
  const switchGroup = (index) => {
    const excludeGroups = combinedRoutine;
    const alternative = ExerciseService.getAlternativeGroup(workoutName, excludeGroups);
    if (alternative) {
      const newRoutine = [...combinedRoutine];
      newRoutine[index] = alternative;
      setCombinedRoutine(newRoutine);
      if (index === currentGroupIndex && alternative[0]) {
        setTime(alternative[0].time || defaultExerciseTime);
      }
    } else {
      alert("No alternative exercise available.");
    }
  };

  // Determine the active group and next group
  const currentGroup = combinedRoutine[currentGroupIndex] || [];
  const nextGroup = combinedRoutine[currentGroupIndex + 1] || null;

  return (
    <div className="p-6 flex flex-col items-center text-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{workoutName}</h1>

      {/* Current exercise card (only one switch button on right) */}
      <div className="flex items-center justify-center mb-4">
        <div className="p-4 bg-blue-600 rounded text-white text-xl">
          {isResting ? (
            <div>
              Resting...{" "}
              {nextGroup && (
                <span
                  onClick={() => openYouTubeSearch(nextGroup[0].name)}
                  className="underline cursor-pointer"
                >
                  Next: {nextGroup[0].name}
                </span>
              )}
            </div>
          ) : (
            <div>
              {currentGroup[0] && (
                <span
                  onClick={() => openYouTubeSearch(currentGroup[0].name)}
                  className="underline cursor-pointer"
                >
                  {currentGroup[0].name}
                  {currentGroup[0].note ? ` (${currentGroup[0].note})` : ""}
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => switchGroup(currentGroupIndex)}
          className="ml-4 text-3xl text-gray-300 hover:text-white"
          title="Switch this exercise"
        >
          ↻
        </button>
      </div>

      {/* Timer component */}
      <Timer time={time} setTime={setTime} isRunning={isRunning} onFinish={handleTimerFinish} />

      <Button className="bg-green-500 hover:bg-green-600 mt-4" onClick={handleStartPause}>
        {isRunning ? "Pause" : "Start"}
      </Button>

      {/* Mini-cards for all routine groups */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {combinedRoutine.map((group, idx) => (
          <div
            key={idx}
            className={`p-4 border rounded cursor-pointer ${idx === currentGroupIndex ? "bg-green-700" : "bg-gray-800"}`}
            onClick={() => setCurrentGroupIndex(idx)}
          >
            <div className="flex justify-between items-center">
              <div>
                {group.map((ex, jdx) => (
                  <div key={jdx}>
                    <h3
                      className="text-lg font-semibold text-blue-400 underline cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openYouTubeSearch(ex.name);
                      }}
                    >
                      {ex.name}
                      {ex.note ? ` (${ex.note})` : ""}
                    </h3>
                    <p className="text-sm text-gray-400">{ex.description}</p>
                  </div>
                ))}
              </div>
              {/* Only one switch icon per group */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  switchGroup(idx);
                }}
                className="ml-2 text-xl text-gray-300 hover:text-white"
                title="Switch this group"
              >
                ↻
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button className="mt-6" onClick={() => router.push("/")}>
        Back to Home
      </Button>

      {showFeedback && (
        <FeedbackPopup
          workoutType={workoutName}
          onFeedback={(fb) => {
            // Process feedback (update level/streak, etc.)
            setShowFeedback(false);
            router.push("/");
          }}
        />
      )}
    </div>
  );
}
