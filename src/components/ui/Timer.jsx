"use client";

import { useEffect } from "react";

/**
 * Timer Component (Controlled)
 * 
 * @param {number} time        - Current time (in seconds)
 * @param {function} setTime   - Setter for the parent's time state
 * @param {boolean} isRunning  - Whether the timer is counting down
 * @param {function} onFinish  - Callback when time hits 0
 */
export function Timer({ time, setTime, isRunning, onFinish }) {
  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      // Time finished
      if (onFinish) onFinish();
    }

    return () => clearInterval(interval);
  }, [isRunning, time, setTime, onFinish]);

  return (
    <div className="text-4xl font-bold my-4">
      {time}s
    </div>
  );
}
