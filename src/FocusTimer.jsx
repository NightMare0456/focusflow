
import React, { useEffect, useState } from "react";

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function FocusTimer() {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const totalSeconds =
    mode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS;

  useEffect(() => {
    if (!isRunning || secondsLeft === 0) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);

          if (mode === "focus") {
            setSessionsCompleted((count) => count + 1);
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, secondsLeft, mode]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  function resetTimer() {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  }

  function changeMode(nextMode) {
    setIsRunning(false);
    setMode(nextMode);
    setSecondsLeft(
      nextMode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS
    );
  }

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>YOUR PERSONAL WORKSPACE</p>
          <h2 style={styles.heading}>Focus Timer</h2>
          <p style={styles.subtitle}>
            One thing at a time. You've got this.
          </p>
        </div>
        <span style={styles.icon}>✳</span>
      </div>

      <div style={styles.tabs}>
        <button
          style={mode === "focus" ? styles.activeTab : styles.tab}
          onClick={() => changeMode("focus")}
        >
          Focus · 25 min
        </button>

        <button
          style={mode === "break" ? styles.activeTab : styles.tab}
          onClick={() => changeMode("break")}
        >
          Break · 5 min
        </button>
      </div>

      <div style={styles.timerArea}>
        <div
          style={{
            ...styles.progressRing,
            background: `conic-gradient(#8B78DF ${progress}%, #EEE9FC ${progress}%)`,
          }}
        >
          <div style={styles.timerInner}>
            <span style={styles.modeLabel}>
              {mode === "focus" ? "TIME TO FOCUS" : "TAKE A BREATHER"}
            </span>

            <div style={styles.time}>
              {minutes}:{seconds}
            </div>

            <span style={styles.smallText}>
              {isRunning ? "You're doing great" : "Ready when you are"}
            </span>
          </div>
        </div>

        <div style={styles.controls}>
          <button
            style={styles.startButton}
            onClick={() => {
              if (secondsLeft === 0) {
                setSecondsLeft(totalSeconds);
              }
              setIsRunning((running) => !running);
            }}
          >
            {isRunning ? "Ⅱ  Pause" : secondsLeft === 0 ? "▶  Start again" : "▶  Start"}
          </button>

          <button style={styles.resetButton} onClick={resetTimer}>
            ↻ Reset
          </button>
        </div>

        <p style={styles.sessionCount}>
          ✦ Focus sessions completed: <strong>{sessionsCompleted}</strong>
        </p>
      </div>

      <div style={styles.tip}>
        <span>🌱</span>
        <p>
          <strong>Little reminder</strong>
          <br />
          Silence distractions and focus on just one task.
        </p>
      </div>
    </section>
  );
}

const styles = {
  card: {
    width: "100%",
    maxWidth: "720px",
    boxSizing: "border-box",
    padding: "28px",
    background: "#FFFFFF",
    border: "1px solid #EEEAF7",
    borderRadius: "20px",
    color: "#30294F",
    fontFamily: "inherit",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "24px",
  },
  eyebrow: {
    color: "#9586C7",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1.5px",
  },
  heading: {
    fontSize: "25px",
    margin: "8px 0",
  },
  subtitle: {
    color: "#89849F",
    fontSize: "13px",
  },
  icon: {
    display: "grid",
    placeItems: "center",
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "#F0EBFF",
    color: "#8B78DF",
    fontSize: "25px",
  },
  tabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "28px",
  },
  tab: {
    border: "1px solid #EEEAF7",
    background: "#FFFFFF",
    color: "#77718F",
    padding: "11px 16px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  activeTab: {
    border: "1px solid #8B78DF",
    background: "#F0EBFF",
    color: "#725DC7",
    padding: "11px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },
  timerArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px 0 24px",
  },
  progressRing: {
    width: "230px",
    height: "230px",
    maxWidth: "75vw",
    maxHeight: "75vw",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
  },
  timerInner: {
    width: "84%",
    height: "84%",
    borderRadius: "50%",
    background: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  modeLabel: {
    fontSize: "10px",
    letterSpacing: "1.3px",
    color: "#9586C7",
    fontWeight: 700,
  },
  time: {
    fontSize: "clamp(38px, 8vw, 48px)",
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    color: "#30294F",
  },
  smallText: {
    color: "#89849F",
    fontSize: "12px",
  },
  controls: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "12px",
    marginTop: "28px",
  },
  startButton: {
    background: "#8B78DF",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    padding: "13px 24px",
    cursor: "pointer",
    fontWeight: 600,
  },
  resetButton: {
    background: "#F3F0FC",
    color: "#6859A1",
    border: "none",
    borderRadius: "12px",
    padding: "13px 24px",
    cursor: "pointer",
  },
  sessionCount: {
    marginTop: "20px",
    color: "#89849F",
    fontSize: "13px",
  },
  tip: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#F7F3FF",
    padding: "14px",
    borderRadius: "12px",
    color: "#71658F",
    fontSize: "12px",
    lineHeight: 1.7,
  },
};

export default FocusTimer;
