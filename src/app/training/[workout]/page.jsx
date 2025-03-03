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

  // State for warm-up groups and main training groups
  const [warmUpGroups, setWarmUpGroups] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);
  // Combined routine = warm-up groups then training groups.
  const [combinedRoutine, setCombinedRoutine] = useState([]);

  // Timer and group switching states.
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentSideIndex, setCurrentSideIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Get timer settings from localStorage (or use defaults)
  const defaultExerciseTime = parseInt(localStorage.getItem("exerciseTime")) || 60;
  const defaultRestTime = parseInt(localStorage.getItem("restTime")) || 15;

  // Load routine on mount: load warm-up groups and main training groups separately, then combine.
  useEffect(() => {
    async function fetchRoutine() {
      await ExerciseService.loadTrainings();
      const warmUps = ExerciseService.getGroupedWarmUpExercises(workoutName, 5, 10);
      const mainGroups = ExerciseService.getGroupedExercises(workoutName, 10);
      setWarmUpGroups(warmUps);
      setTrainingGroups(mainGroups);
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

  // Timer effect – runs in Timer component.
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

  // Handle timer finish:
  // - For doubled groups: if on first side, rest then move to second side.
  // - Otherwise, if in rest then move to next group.
  const handleTimerFinish = () => {
    const currentGroup = combinedRoutine[currentGroupIndex] || [];
    if (!isResting) {
      if (currentGroup.length === 2 && currentSideIndex === 0) {
        // Rest between sides for a doubled group.
        setIsResting(true);
        setTime(defaultRestTime);
        window.dataLayer.push({
          event: "event_doubled_exercise_rest",
          groupIndex: currentGroupIndex,
          side: currentSideIndex,
        });
      } else {
        // Normal exercise end: start rest if there is a next group.
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
      // End of rest period.
      if (currentGroup.length === 2 && currentSideIndex === 0) {
        // Move from first side to second side in a doubled group.
        setIsResting(false);
        setCurrentSideIndex(1);
        setTime(currentGroup[1].time || defaultExerciseTime);
        window.dataLayer.push({
          event: "event_doubled_exercise_switched",
          groupIndex: currentGroupIndex,
          side: 1,
        });
      } else {
        // End rest after normal exercise or after second side.
        setIsResting(false);
        setCurrentSideIndex(0); // Reset side index for next group.
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

  // Switch current group with an alternative group that is not yet used.
  const switchGroup = (index) => {
    const alternative = ExerciseService.getAlternativeGroup(workoutName, combinedRoutine);
    if (alternative) {
      const newRoutine = [...combinedRoutine];
      newRoutine[index] = alternative;
      setCombinedRoutine(newRoutine);
      if (index === currentGroupIndex) {
        setCurrentSideIndex(0);
        setTime(alternative[0].time || defaultExerciseTime);
      }
      window.dataLayer.push({ event: "event_exercise_switched", groupIndex: index });
    } else {
      alert("No alternative exercise available.");
    }
  };

  // Determine current exercise group and current exercise.
  const currentGroup = combinedRoutine[currentGroupIndex] || [];
  const currentExercise = currentGroup[currentSideIndex] || null;

  // Helper to render mini-cards. We display warm-up and training sections with a divider.
  const renderMiniCards = () => {
    return (
      <div className="w-full max-w-2xl">
        {/* Warm-up section */}
        {warmUpGroups.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-2">Warm-Up</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {warmUpGroups.map((group, idx) => (
                <div
                  key={`warm-${idx}`}
                  className={`p-4 border rounded cursor-pointer ${
                    currentGroupIndex === idx ? "bg-green-700" : "bg-gray-800"
                  }`}
                  onClick={() => {
                    setCurrentGroupIndex(idx);
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
                      switchGroup(idx);
                    }}
                    className="mt-2 text-xl text-gray-300 hover:text-white"
                    title="Switch this group"
                  >
                    ↻
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        {warmUpGroups.length > 0 && trainingGroups.length > 0 && (
          <hr className="w-full my-4 border-gray-600" />
        )}

        {/* Training section */}
        {trainingGroups.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-2">Training</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingGroups.map((group, idx) => {
                // Offset index by warmUpGroups.length in combinedRoutine.
                const globalIdx = warmUpGroups.length + idx;
                return (
                  <div
                    key={`train-${idx}`}
                    className={`p-4 border rounded cursor-pointer ${
                      currentGroupIndex === globalIdx ? "bg-green-700" : "bg-gray-800"
                    }`}
                    onClick={() => {
                      setCurrentGroupIndex(globalIdx);
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
                        switchGroup(globalIdx);
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
    <div className="p-6 flex flex-col items-center text-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{workoutName}</h1>

      {/* Current exercise card */}
      <div className="flex items-center justify-center mb-4">
        <div className="p-4 bg-blue-600 rounded text-white text-xl">
          {isResting ? (
            <div>
              Resting...
              {!(currentGroup.length === 2 && currentSideIndex === 0) &&
                combinedRoutine[currentGroupIndex + 1] && (
                  <span
                    onClick={() =>
                      openYouTubeSearch(
                        combinedRoutine[currentGroupIndex + 1][0].name
                      )
                    }
                    className="underline cursor-pointer"
                  >
                    {" "}
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

      {/* Timer component */}
      <Timer time={time} setTime={setTime} isRunning={isRunning} onFinish={handleTimerFinish} />

      <Button className="bg-green-500 hover:bg-green-600 mt-4" onClick={handleStartPause}>
        {isRunning ? "Pause" : "Start"}
      </Button>

      {/* Render mini-cards for both warm-up and training groups */}
      <div className="mt-6">{renderMiniCards()}</div>

      <Button className="mt-6" onClick={() => router.push("/")}>
        Back to Home
      </Button>

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
