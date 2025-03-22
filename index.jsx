export const command = "";
export const refreshFrequency = 1000;

let timerState = {
  minutes: 25,
  seconds: 0,
  isRunning: false,
  intervalId: null,
  totalSeconds: 25 * 60,
};

export const render = ({ output }, dispatch) => {
  const formatTime = (num) => (num < 10 ? `0${num}` : num);

  const startTimer = () => {
    if (!timerState.isRunning) {
      timerState.isRunning = true;
      timerState.intervalId = setInterval(() => {
        if (timerState.minutes === 0 && timerState.seconds === 0) {
          clearInterval(timerState.intervalId);
          timerState.isRunning = false;
          timerState.minutes = 25;
          timerState.seconds = 0;
          dispatch({ type: "updateUI" });
          return;
        }

        if (timerState.seconds === 0) {
          timerState.minutes -= 1;
          timerState.seconds = 59;
        } else {
          timerState.seconds -= 1;
        }

        dispatch({ type: "updateUI" });
      }, 1000);
    } else {
      clearInterval(timerState.intervalId);
      timerState.isRunning = false;
    }
    dispatch({ type: "updateUI" });
  };

  const resetTimer = () => {
    clearInterval(timerState.intervalId);
    timerState.isRunning = false;
    timerState.minutes = 25;
    timerState.seconds = 0;
    dispatch({ type: "updateUI" });
  };

  const width = 110;
  const height = 60;
  const borderRadius = 10;
  const strokeWidth = 3;

  // Calculate the perimeter of the rounded rectangle
  const perimeter =
    2 * (width - strokeWidth) +
    2 * (height - strokeWidth) -
    8 * borderRadius +
    2 * Math.PI * borderRadius;

  // Calculate the current time in seconds and the progress
  const currentSeconds = timerState.minutes * 60 + timerState.seconds;
  const totalSeconds = timerState.totalSeconds;
  const dashOffset = timerState.isRunning
    ? perimeter * (1 - currentSeconds / totalSeconds)
    : 0;

  const getStrokeColor = () => {
    const progress = (dashOffset / perimeter) * 100;

    if (window.vibeBG) {
      return `rgb(${window.vibeBG})`;
    } else if (progress < 33) {
      return "#f87171";
    } else if (progress < 66) {
      return "#facc15";
    } else {
      return "#4ade80";
    }
  };

  return (
    <div
      className={`container`}
      id="pomodoro"
    >
      <div
        className="timer-rect-container"
        onClick={startTimer}
        onDoubleClick={resetTimer}
      >
        <svg className="timer-rect" width={width} height={height}>
          {/* Progress rounded rectangle */}
          <rect
            className="timer-rect-progress"
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={width - strokeWidth}
            height={height - strokeWidth}
            rx={borderRadius}
            ry={borderRadius}
            fill="transparent"
            stroke={timerState.isRunning ? getStrokeColor() : "#ffffff10"}
            strokeWidth={strokeWidth}
            strokeDasharray={perimeter}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 0.5s ease, stroke 0.5s ease",
            }}
          />
        </svg>
        <div
          className="timer-display"
          style={{
            opacity: `${timerState.isRunning ? "1" : "0.5"}`,
          }}
        >
          {formatTime(timerState.minutes)}:{formatTime(timerState.seconds)}
        </div>
      </div>
    </div>
  );
};

export const className = `
  color: white;
  font-family: JetBrains Mono;
  user-select: none;
  cursor: default;
  font-weight: 200;
  position: absolute;
  top: 828px;
  left: 1045px;
  border-radius: 15px;
  width: 120px;
  height: 70px;
  background: #19191910;
  -webkit-backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
  }
  .timer-rect-container {
    position: relative;
    width: 110px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .timer-rect {
    position: absolute;
    top: 0;
    left: 0;
  }
  .timer-display {
    letter-spacing: 1px;
    z-index: 10;
    transition: 200ms;
    font-size: 20px;
  }
`;

export const updateState = (event, previousState) => {
  if (event.type === "updateUI") {
    return { ...previousState };
  }
  return previousState;
};
