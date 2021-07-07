import React from "react";
import { minutesToDuration } from "../utils/duration";


function Focus({
  focusDuration,
  handleIncrementClick,
  handleDecrementClick,
  disabled,
}) {
  //Allow the user to adjust the focus and break duration.

  return (
    <div className="col">
      <div className="input-group input-group-lg mb-2">
        <span className="input-group-text" data-testid="duration-focus">
          {/* TODO: Update this text to display the current focus session duration */}
          Focus Duration: {minutesToDuration(focusDuration)}
        </span>
        <div className="input-group-append">
          {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
          <button
            id="decrease-focus"
            type="button"
            className="btn btn-secondary"
            data-testid="decrease-focus"
            onClick={handleDecrementClick}
            disabled={disabled}
          >
            <span className="oi oi-minus" />
          </button>
          {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
          <button
            id="increase-focus"
            type="button"
            className="btn btn-secondary"
            data-testid="increase-focus"
            onClick={handleIncrementClick}
            disabled={disabled}
          >
            <span className="oi oi-plus" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Focus;
