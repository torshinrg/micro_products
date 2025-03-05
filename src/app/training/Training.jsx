"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Popup } from "@/components/common/Popup";
import { ExerciseService } from "@/services/ExerciseService";

export default function Training() {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [routine, setRoutine] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    async function fetchTrainings() {
      await ExerciseService.loadTrainings();
      setTrainings(ExerciseService.getTrainingTypes());
      
    }
    fetchTrainings();
  }, []);

  const startTraining = async (trainingType) => {
    window.dataLayer.push({ event: "event_training_type_selected", trainingType });
    await ExerciseService.loadTrainings();
    const exercises = ExerciseService.getRandomExercises(trainingType, 5);
    
    if (exercises.length === 0) {
      alert("No exercises found for this training. Check API.");
      return;
    }

    setRoutine(exercises);
    setSelectedTraining(trainingType);
    setIsPopupOpen(true);
  };

  return (
    <div className="p-6 flex flex-col items-center text-center bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">Choose Your Training</h1>

      {trainings.length === 0 ? (
        <p className="text-gray-400">Loading training options...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainings.map((training, idx) => (
            <Button key={idx} onClick={() => startTraining(training)} className="w-full p-4 text-xl">
              {training}
            </Button>
          ))}
        </div>
      )}

      {isPopupOpen && (
        <Popup onClose={() => setIsPopupOpen(false)}>
          <h2 className="text-3xl font-bold mb-4">{selectedTraining}</h2>
          {routine.length === 0 ? (
            <p className="text-gray-400">Loading exercises...</p>
          ) : (
            routine.map((exercise, index) => (
              <Card key={index} className="mb-2 p-2 bg-gray-800 text-white">
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-blue-400">
                      <a onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name)}`, "_blank")} className="underline cursor-pointer">
                        {exercise.name}{exercise.note ? ` (${exercise.note})` : ""}
                      </a>
                    </p>
                    <p className="text-sm text-gray-400">{exercise.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </Popup>
      )}
    </div>
  );
}
