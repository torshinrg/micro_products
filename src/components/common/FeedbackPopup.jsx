"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Popup } from "@/components/common/Popup";
import { FireworkAnimation } from "@/components/common/FireworkAnimation";

export function FeedbackPopup({ workoutType, onFeedback }) {
  const [playFireworks, setPlayFireworks] = useState(false);

  useEffect(() => {
    // Play fanfare sound
    const fanfare = new Audio("/sounds/fanfare.mp3");
    fanfare.play().catch((err) => console.error("Failed to play sound:", err));

    // Trigger fireworks
    setPlayFireworks(true);
  }, []);

  return (
    <>
      {/* Fireworks overlay OUTSIDE the Popup */}
      {playFireworks && (
        <FireworkAnimation
          duration={3000}
          onComplete={() => setPlayFireworks(false)}
        />
      )}

      {/* Your popup container, which is narrower */}
      <Popup onClose={() => {}} className="max-w-md">
        <h2 className="text-xl font-bold mb-4">
          How was your {workoutType ? `${workoutType} workout` : "workout"}?
        </h2>
        <div className="flex flex-col gap-4">
          <Button onClick={() => onFeedback("easy")}>Too Easy</Button>
          <Button onClick={() => onFeedback("right")}>Just Right</Button>
          <Button onClick={() => onFeedback("hard")}>Too Hard</Button>
        </div>
      </Popup>
    </>
  );
}
