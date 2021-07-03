import React from "react";
import Pomodoro from "../pomodoro/Pomodoro";
import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Pomodoro Timer", () => {
  beforeEach(() => {
    // Playing audio is not supported in jsdom
    window.HTMLMediaElement.prototype.load = jest.fn();
    window.HTMLMediaElement.prototype.play = jest.fn();
    window.HTMLMediaElement.prototype.pause = jest.fn();
    jest.useFakeTimers();
  });

  describe("play button", () => {
    test("changes to pause button when clicked", async () => {
      const { getByTestId } = render(<Pomodoro />);

      const playPauseButton = getByTestId("play-pause");

      expect(playPauseButton.firstChild).toHaveClass("oi-media-play");
      expect(playPauseButton.firstChild).not.toHaveClass("oi-media-pause");

      userEvent.click(playPauseButton);

      expect(playPauseButton.firstChild).not.toHaveClass("oi-media-play");
      expect(playPauseButton.firstChild).toHaveClass("oi-media-pause");
    });
  });

  describe("stop button", () => {
    test("is disabled by default", async () => {
      const { getByTestId } = render(<Pomodoro />);

      const stopButton = getByTestId("stop");
      expect(stopButton).toBeDisabled();
    });
    test("stops focus session when clicked", async () => {
      const { getByTestId, queryByTestId } = render(<Pomodoro />);

      const stopButton = getByTestId("stop");
      const playPauseButton = getByTestId("play-pause");

      userEvent.click(playPauseButton);

      expect(stopButton).toBeEnabled();

      // Fast-forward 15 seconds
      act(() => jest.advanceTimersByTime(15000));

      expect(getByTestId("session-title")).toBeDefined();
      expect(getByTestId("session-sub-title")).toBeDefined();

      userEvent.click(stopButton); // Stop timer

      expect(stopButton).toBeDisabled();

      // Fast-forward 15 seconds
      act(() => jest.advanceTimersByTime(15000));

      expect(queryByTestId("session-title")).toBeNull();
      expect(queryByTestId("session-sub-title")).toBeNull();
    });
    test("stops break session when clicked", async () => {
      const { getByTestId, queryByTestId } = render(<Pomodoro />);

      const stopButton = getByTestId("stop");
      const playPauseButton = getByTestId("play-pause");
      const decreaseFocus = getByTestId("decrease-focus");

      Array(10)
        .fill(0)
        .forEach(() => {
          userEvent.click(decreaseFocus);
        });

      userEvent.click(getByTestId("play-pause"));

      expect(stopButton).toBeEnabled();

      // Fast-forward 5.5 minutes to be in break session
      act(() => jest.advanceTimersByTime(330000));

      expect(getByTestId("session-title")).toBeDefined();
      expect(getByTestId("session-sub-title")).toBeDefined();

      userEvent.click(stopButton); // Stop timer

      expect(stopButton).toBeDisabled();

      // Fast-forward 15 seconds
      act(() => jest.advanceTimersByTime(15000));

      expect(queryByTestId("session-title")).toBeNull();
      expect(queryByTestId("session-sub-title")).toBeNull();
    });
  });

  describe("Focus duration", () => {
    test("displays 25:00 by default", () => {
      const { getByTestId } = render(<Pomodoro />);
      expect(getByTestId("duration-focus")).toHaveTextContent(
        "Focus Duration: 25:00"
      );
    });
    test("increases by 5 minutes when clicking + button", () => {
      const { getByTestId } = render(<Pomodoro />);

      const increaseFocus = getByTestId("increase-focus");

      userEvent.click(increaseFocus);

      expect(getByTestId("duration-focus")).toHaveTextContent(
        "Focus Duration: 30:00"
      );

      userEvent.click(increaseFocus);

      expect(getByTestId("duration-focus")).toHaveTextContent(
        "Focus Duration: 35:00"
      );
    });

    test("cannot increase above 60", () => {
      const { getByTestId } = render(<Pomodoro />);

      const increaseFocus = getByTestId("increase-focus");

      Array(10)
        .fill(0)
        .forEach(() => userEvent.click(increaseFocus));

      expect(getByTestId("duration-focus")).toHaveTextContent(
        "Focus Duration: 60:00"
      );
    });

    test("decreases when clicking - button", () => {
      const { getByTestId } = render(<Pomodoro />);

      const decreaseFocus = getByTestId("decrease-focus");

      userEvent.click(decreaseFocus);

      expect(getByTestId("duration-focus")).toHaveTextContent(
        "Focus Duration: 20:00"
      );

      userEvent.click(decreaseFocus);

      expect(getByTestId("duration-focus")).toHaveTextContent(
        "Focus Duration: 15:00"
      );
    });

    test("cannot decrease below 5", () => {
      const { getByTestId } = render(<Pomodoro />);

      const decreaseFocus = getByTestId("decrease-focus");

      Array(10)
        .fill(0)
        .forEach(() => userEvent.click(decreaseFocus));

      expect(getByTestId("duration-focus")).toHaveTextContent(
        "Focus Duration: 05:00"
      );
    });
  });

  describe("Break duration", () => {
    test("displays 05:00 by default", () => {
      const { getByTestId } = render(<Pomodoro />);
      expect(getByTestId("duration-break")).toHaveTextContent(
        "Break Duration: 05:00"
      );
    });
    test("increases by 1 when clicking + button", () => {
      const { getByTestId } = render(<Pomodoro />);

      const increaseBreak = getByTestId("increase-break");

      userEvent.click(increaseBreak);

      expect(getByTestId("duration-break")).toHaveTextContent(
        "Break Duration: 06:00"
      );

      userEvent.click(increaseBreak);

      expect(getByTestId("duration-break")).toHaveTextContent(
        "Break Duration: 07:00"
      );
    });

    test("cannot increase above 15", () => {
      const { getByTestId } = render(<Pomodoro />);

      const increaseBreak = getByTestId("increase-break");

      Array(10)
        .fill(0)
        .forEach(() => userEvent.click(increaseBreak));

      expect(getByTestId("duration-break")).toHaveTextContent(
        "Break Duration: 15:00"
      );
    });

    test("decreases by 1 when clicking - button", () => {
      const { getByTestId } = render(<Pomodoro />);

      const decreaseBreak = getByTestId("decrease-break");

      userEvent.click(decreaseBreak);

      expect(getByTestId("duration-break")).toHaveTextContent(
        "Break Duration: 04:00"
      );

      userEvent.click(decreaseBreak);

      expect(getByTestId("duration-break")).toHaveTextContent(
        "Break Duration: 03:00"
      );
    });

    test("cannot decrease below 1", () => {
      const { getByTestId } = render(<Pomodoro />);

      const decreaseBreak = getByTestId("decrease-break");

      Array(10)
        .fill(0)
        .forEach(() => userEvent.click(decreaseBreak));

      expect(getByTestId("duration-break")).toHaveTextContent(
        "Break Duration: 01:00"
      );
    });
  });

  describe("Session title", () => {
    test("is not displayed when stopped", () => {
      const { queryByTestId } = render(<Pomodoro />);

      expect(queryByTestId("session-title")).toBeNull();
    });

    test('displays "Focusing for 25:00 minutes" by default', () => {
      const { getByTestId } = render(<Pomodoro />);

      userEvent.click(getByTestId("play-pause"));

      expect(getByTestId("session-title")).toHaveTextContent(
        "Focusing for 25:00 minutes"
      );
    });
    test('displays "On Break for 05:00 minutes" after focus session expires', () => {
      const { getByTestId } = render(<Pomodoro />);

      // Set the times to the minimums
      const decreaseFocus = getByTestId("decrease-focus");

      Array(10)
        .fill(0)
        .forEach(() => {
          userEvent.click(decreaseFocus);
        });

      userEvent.click(getByTestId("play-pause"));

      // Fast-forward 5.5 minutes so 5:00 focus timer expires
      act(() => jest.advanceTimersByTime(330000));

      expect(getByTestId("session-title")).toHaveTextContent(
        "On Break for 05:00 minutes"
      );
    });
    test('displays "Focusing for 05:00 minutes" after focus duration is decreased session is started', () => {
      const { getByTestId } = render(<Pomodoro />);

      // Set the times to the minimums
      const decreaseFocus = getByTestId("decrease-focus");

      Array(10)
        .fill(0)
        .forEach(() => {
          userEvent.click(decreaseFocus);
        });

      userEvent.click(getByTestId("play-pause"));

      expect(getByTestId("session-title")).toHaveTextContent(
        "Focusing for 05:00 minutes"
      );
    });
    test('displays "On Break for 01:00 minutes" after break duration is decreased and focus session expires', () => {
      const { getByTestId } = render(<Pomodoro />);

      // Set the times to the minimums
      const decreaseFocus = getByTestId("decrease-focus");
      const decreaseBreak = getByTestId("decrease-break");

      Array(10)
        .fill(0)
        .forEach(() => {
          userEvent.click(decreaseFocus);
          userEvent.click(decreaseBreak);
        });

      userEvent.click(getByTestId("play-pause"));

      // Fast-forward 5.5 minutes so default 5:00 focus timer expires
      act(() => jest.advanceTimersByTime(330000));

      expect(getByTestId("session-title")).toHaveTextContent(
        "On Break for 01:00 minutes"
      );
    });
    test("starts a new focus session after break session expires", () => {
      const { getByTestId } = render(<Pomodoro />);

      // Set the times to the minimums
      const decreaseFocus = getByTestId("decrease-focus");
      const decreaseBreak = getByTestId("decrease-break");

      Array(10)
        .fill(0)
        .forEach(() => {
          userEvent.click(decreaseFocus);
          userEvent.click(decreaseBreak);
        });

      userEvent.click(getByTestId("play-pause"));

      // Fast-forward 6.5 minutes so first focus and break sessions expire
      act(() => jest.advanceTimersByTime(390000));

      expect(getByTestId("session-title")).toHaveTextContent(
        "Focusing for 05:00 minutes"
      );
    });
  });

  describe("Session sub-title", () => {
    test("is not displayed when stopped", () => {
      const { queryByTestId } = render(<Pomodoro />);

      expect(queryByTestId("session-sub-title")).toBeNull();
    });

    test('displays "25:00 remaining" by default', () => {
      const { getByTestId } = render(<Pomodoro />);

      // start the session
      userEvent.click(getByTestId("play-pause"));
      // pause the session
      userEvent.click(getByTestId("play-pause"));

      expect(getByTestId("session-sub-title")).toHaveTextContent(
        "25:00 remaining"
      );
    });
    test('displays "24:45 minutes" after 15 seconds have elapsed', () => {
      const { getByTestId } = render(<Pomodoro />);

      const playPauseButton = getByTestId("play-pause");

      userEvent.click(playPauseButton);

      // Fast-forward 15 seconds
      act(() => jest.advanceTimersByTime(15000));

      expect(getByTestId("session-sub-title")).toHaveTextContent(
        "24:45 remaining"
      );
    });

    test("pauses timer by clicking pause button", () => {
      const { getByTestId } = render(<Pomodoro />);

      const playPauseButton = getByTestId("play-pause");

      userEvent.click(playPauseButton);

      // Fast-forward 15 seconds
      act(() => jest.advanceTimersByTime(15000));

      expect(getByTestId("session-sub-title")).toHaveTextContent(
        "24:45 remaining"
      );

      userEvent.click(playPauseButton); // Pause timer

      // Fast-forward 15 seconds
      act(() => jest.advanceTimersByTime(15000));

      expect(getByTestId("session-sub-title")).toHaveTextContent(
        "24:45 remaining"
      );
    });
  });

  describe("Progress bar", () => {
    test("is not displayed when stopped", () => {
      const { queryByTestId } = render(<Pomodoro />);

      expect(queryByTestId("progressbar")).toBeNull();
    });
    test("displays 0% progress by default", () => {
      const { getByRole, getByTestId } = render(<Pomodoro />);
      // start the session
      userEvent.click(getByTestId("play-pause"));
      // pause the session
      userEvent.click(getByTestId("play-pause"));
      expect(getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
    });
    test("aria-valuenow is 20 after 5 minutes", () => {
      const { getByRole, getByTestId } = render(<Pomodoro />);

      const playPauseButton = getByTestId("play-pause");
      userEvent.click(playPauseButton);

      act(() => jest.advanceTimersByTime(300000));

      const valueNow = Number(
        getByRole("progressbar").getAttribute("aria-valuenow")
      );
      expect(valueNow).toBeGreaterThan(19);
      expect(valueNow).toBeLessThan(21);
    });
    test("increases progress as break timer runs", () => {
      const { getByRole, getByTestId } = render(<Pomodoro />);

      const playPauseButton = getByTestId("play-pause");
      userEvent.click(playPauseButton);

      // Fast-forward 26:01 minutes so default 25:00 focus timer expires and 1:00 of break is consumed
      act(() => jest.advanceTimersByTime(1561000));

      const valueNow = Number(
        getByRole("progressbar").getAttribute("aria-valuenow")
      );
      expect(valueNow).toBeGreaterThan(19);
      expect(valueNow).toBeLessThan(21);
    });
  });
});
