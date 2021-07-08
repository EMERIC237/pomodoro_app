import React from "react";
import { secondsToDuration } from "../utils/duration";
import { minutesToDuration } from "../utils/duration";

function RunningSession({ session, duration, isTimerRunning }) {

  const widthPercentage = 100 - (session.timeRemaining / (60*duration)) * 100;
  return (
    <div>
      {/* This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
      <div className="row mb-2">
        <div className="col">
          {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
          <h2 data-testid="session-title">
            {session?.label} for {minutesToDuration(duration)} minutes
          </h2>
          {/* TODO: Update message below correctly format the time remaining in the current session */}
          <p className="lead" data-testid="session-sub-title">
            {secondsToDuration(session?.timeRemaining)} remaining
          </p>
          <h2 style={{ display: `${isTimerRunning ? "none" : "block"}` }}>
            PAUSED
          </h2>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col">
          <div className="progress" style={{ height: "20px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={widthPercentage}// Increase aria-valuenow as elapsed time increases
              style={{ width: `${widthPercentage}%` }} // Increase width % as elapsed time increases
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RunningSession;
