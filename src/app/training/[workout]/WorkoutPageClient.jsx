"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Timer } from "@/components/ui/Timer";
import { openYouTubeSearch } from "@/utils/openYouTubeSearch";
import { ExerciseService } from "@/services/ExerciseService";
import { FeedbackPopup } from "@/components/common/FeedbackPopup";

export default function WorkoutPageClient({ workout }) {
  // Convert hyphens back to spaces
  const decodedSlug = decodeURIComponent(workout);
  const workoutName = ExerciseService.getTrainingBySlug(decodedSlug) || decodedSlug;
  const router = useRouter();

  // State for routines and groups
  const [combinedRoutine, setCombinedRoutine] = useState([]);
  const [warmUpCount, setWarmUpCount] = useState(0);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentSideIndex, setCurrentSideIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [defaultExerciseTime, setDefaultExerciseTime] = useState(60);
  const [defaultRestTime, setDefaultRestTime] = useState(15);

  // Ref for the current exercise card
  const currentGroupRef = useRef(null);

  // Load default times from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDefaultExerciseTime(parseInt(localStorage.getItem("exerciseTime")) || 60);
      setDefaultRestTime(parseInt(localStorage.getItem("restTime")) || 15);
    }
  }, []);

  // Pause timer if user leaves the page (visibility change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsRunning(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Load routine on mount
  useEffect(() => {
    async function fetchRoutine() {
      await ExerciseService.loadTrainings();
      const warmUps = ExerciseService.getGroupedWarmUpExercises(workoutName, 5, 10);
      const mainGroups = ExerciseService.getGroupedExercises(workoutName, 10);
      setWarmUpCount(warmUps.length);
      const combined = [...warmUps, ...mainGroups];
      setCombinedRoutine(combined);
      setCurrentGroupIndex(0);
      setCurrentSideIndex(0);
      if (combined.length > 0 && combined[0][0]) {
        setTime(combined[0][0].time || defaultExerciseTime);
      }
      window.dataLayer.push({
        event: "event_routine_loaded",
        workoutName,
        warmUpCount: warmUps.length,
        trainingCount: mainGroups.length,
      });
    }
    fetchRoutine();
  }, [workoutName, defaultExerciseTime]);

  // Scroll the current exercise card into view when currentGroupIndex changes
  useEffect(() => {
    if (currentGroupRef.current) {
      currentGroupRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentGroupIndex]);

  // Timer effect
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

  const handleTimerFinish = () => {
    const currentGroup = combinedRoutine[currentGroupIndex] || [];
    if (!isResting) {
      // If it's a doubled exercise and we are on the first side
      if (currentGroup.length === 2 && currentSideIndex === 0) {
        setIsResting(true);
        setTime(defaultRestTime);
        window.dataLayer.push({
          event: "event_doubled_exercise_rest",
          groupIndex: currentGroupIndex,
          side: currentSideIndex,
        });
      } else {
        // Move to the next group or end the workout
        if (currentGroupIndex < combinedRoutine.length - 1) {
          setIsResting(true);
          setTime(defaultRestTime);
          window.dataLayer.push({
            event: "event_exercise_completed",
            groupIndex: currentGroupIndex,
          });
        } else {
          setIsRunning(false);
          setShowFeedback(true);
          window.dataLayer.push({ event: "event_workout_completed", workoutName });
        }
      }
    } else {
      // If we were resting
      if (currentGroup.length === 2 && currentSideIndex === 0) {
        // Move to the second side
        setIsResting(false);
        setCurrentSideIndex(1);
        setTime(currentGroup[1].time || defaultExerciseTime);
        window.dataLayer.push({
          event: "event_doubled_exercise_switched",
          groupIndex: currentGroupIndex,
          side: 1,
        });
      } else {
        // Move to the next group
        setIsResting(false);
        setCurrentSideIndex(0);
        if (currentGroupIndex + 1 < combinedRoutine.length) {
          setCurrentGroupIndex(currentGroupIndex + 1);
          const nextGroup = combinedRoutine[currentGroupIndex + 1];
          setTime(nextGroup[0].time || defaultExerciseTime);
        } else {
          setIsRunning(false);
          setShowFeedback(true);
          window.dataLayer.push({ event: "event_workout_completed", workoutName });
        }
      }
    }
  };

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
    window.dataLayer.push({ event: "event_timer_start_pause", isRunning: !isRunning });
  };

  const switchGroup = (globalIndex) => {
    const currentGroup = combinedRoutine[globalIndex];
    let alternative = null;
    // Use warming_up check to decide which alternative method to use
    if (currentGroup[0]?.warming_up) {
      alternative = ExerciseService.getAlternativeWarmUpGroup(workoutName, currentGroup);
    } else {
      alternative = ExerciseService.getAlternativeGroup(workoutName, currentGroup);
    }
    if (alternative) {
      const newRoutine = [...combinedRoutine];
      newRoutine[globalIndex] = alternative;
      setCombinedRoutine(newRoutine);
      if (globalIndex === currentGroupIndex) {
        setCurrentSideIndex(0);
        setTime(alternative[0].time || defaultExerciseTime);
      }
      window.dataLayer.push({ event: "event_exercise_switched", groupIndex: globalIndex });
    } else {
      alert("No alternative exercise available.");
    }
  };

  const currentGroup = combinedRoutine[currentGroupIndex] || [];
  const currentExercise = currentGroup[currentSideIndex] || null;

  // Render mini-cards using combinedRoutine
  const renderMiniCards = () => {
    // Split the routine based on the stored warmUpCount
    const warmUpRoutine = combinedRoutine.slice(0, warmUpCount);
    const trainingRoutine = combinedRoutine.slice(warmUpCount);

    return (
      <div className="w-full max-w-2xl">
        {warmUpRoutine.length > 0 && (
          <>
            {/* Warm-Up Title: center text */}
            <h3 className="text-xl font-bold mb-2 text-center">Warm-Up</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {warmUpRoutine.map((group, idx) => {
                const globalIndex = idx; // global index in combinedRoutine
                return (
                  <div
                    key={`warm-${idx}`}
                    ref={globalIndex === currentGroupIndex ? currentGroupRef : null}
                    className={`p-4 border rounded cursor-pointer text-center ${
                      currentGroupIndex === globalIndex ? "bg-green-700" : "bg-gray-800"
                    }`}
                    onClick={() => {
                      setCurrentGroupIndex(globalIndex);
                      setCurrentSideIndex(0);
                      setTime(group[0].time || defaultExerciseTime);
                    }}
                  >
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        switchGroup(globalIndex);
                      }}
                      className="mt-2 text-xl text-gray-300 hover:text-white"
                      title="Switch this group"
                    >
                      ↻
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {trainingRoutine.length > 0 && (
          <>
            {/* Training Title: center text */}
            <h3 className="text-xl font-bold mb-2 text-center">Training</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingRoutine.map((group, idx) => {
                const globalIndex = warmUpCount + idx;
                return (
                  <div
                    key={`train-${idx}`}
                    ref={globalIndex === currentGroupIndex ? currentGroupRef : null}
                    className={`p-4 border rounded cursor-pointer text-center ${
                      currentGroupIndex === globalIndex ? "bg-green-700" : "bg-gray-800"
                    }`}
                    onClick={() => {
                      setCurrentGroupIndex(globalIndex);
                      setCurrentSideIndex(0);
                      setTime(group[0].time || defaultExerciseTime);
                    }}
                  >
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        switchGroup(globalIndex);
                      }}
                      className="mt-2 text-xl text-gray-300 hover:text-white"
                      title="Switch this group"
                    >
                      ↻
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    // Use flex-col and h-screen to create three vertical sections
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Top Section: header, current exercise, timer */}
      <div className="h-1/4 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">{workoutName}</h1>
        <div className="flex items-center justify-center mb-2">
          <div className="p-2 bg-blue-600 rounded text-white text-xl text-center">
            {isResting ? (
              <div>
                Resting...
                {!(currentGroup.length === 2 && currentSideIndex === 0) &&
                  combinedRoutine[currentGroupIndex + 1] && (
                    <span
                      onClick={() =>
                        openYouTubeSearch(combinedRoutine[currentGroupIndex + 1][0].name)
                      }
                      className="underline cursor-pointer ml-1"
                    >
                      Next: {combinedRoutine[currentGroupIndex + 1][0].name}
                    </span>
                  )}
              </div>
            ) : (
              <div>
                {currentExercise && (
                  <span
                    onClick={() => openYouTubeSearch(currentExercise.name)}
                    className="underline cursor-pointer"
                  >
                    {currentExercise.name}
                    {currentExercise.note ? ` (${currentExercise.note})` : ""}
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => switchGroup(currentGroupIndex)}
            className="ml-4 text-3xl text-gray-300 hover:text-white"
            title="Switch this exercise group"
          >
            ↻
          </button>
        </div>
        <Timer time={time} setTime={setTime} isRunning={isRunning} onFinish={handleTimerFinish} />
        <Button className="bg-green-500 hover:bg-green-600 mt-2" onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </Button>
      </div>

      {/* Middle Section: scrollable exercises */}
      <div className="h-2/4 overflow-y-auto p-4 flex justify-center">
        {renderMiniCards()}
      </div>

      {/* Bottom Section: button(s) */}
      <div className="h-1/4 flex items-center justify-center">
        <Button onClick={() => router.push("/")} className="bg-blue-500 hover:bg-blue-600">
          Back to Home
        </Button>
      </div>

      {showFeedback && (
        <FeedbackPopup
          workoutType={workoutName}
          onFeedback={(fb) => {
            window.dataLayer.push({
              event: "event_workout_feedback",
              feedback: fb,
              workoutName,
            });
            setShowFeedback(false);
            router.push("/");
          }}
        />
      )}
    </div>
  );
}
