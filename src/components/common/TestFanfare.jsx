"use client";
import { useState } from "react";
import { FeedbackPopup } from "@/components/common/FeedbackPopup";

export function TestFanfare() {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="p-6">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setShowFeedback(true)}
      >
        Test Fanfare
      </button>
      {showFeedback && (
        <FeedbackPopup
          onFeedback={(feedback) => {
            console.log("Feedback received:", feedback);
            setShowFeedback(false);
          }}
        />
      )}
    </div>
  );
}
