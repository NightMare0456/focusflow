import { useEffect, useMemo, useState } from "react";
import "./index.css";
import React from "react";
const starterTasks = [
  { id: 1, title: "Review data structures", category: "Study", priority: "High", done: false },
  { id: 2, title: "Build FocusFlow dashboard", category: "Project", priority: "High", done: false },
  { id: 3, title: "Practice JavaScript", category: "Learning", priority: "Medium", done: true },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("focusflow-tasks");
      return saved ? JSON.parse(saved) : starterTasks;
    } catch {
      return starterTasks;
    }
  });

  const [taskInput, setTaskInput] = useState("");
  const [category, setCategory] = useState("Study");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [activeNav, setActiveNav] = useState("Overview");
  const [showForm, setShowForm] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [greetingName, setGreetingName] = useState("there");

  useEffect(() => {
    localStorage.setItem("focusflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!timerRunning) return undefined;

    const timer = setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          clearInterval(timer);
          setTimerRunning(false);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning]);

  const completedTasks = tasks.filter((task) => task.done).length;
  const progress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const visibleTasks = useMemo(() => {
    if (filter === "Completed") return tasks.filter((task) => task.done);
    if (filter === "Pending") return tasks.filter((task) => !task.done);
    return tasks;
  }, [tasks, filter]);

  const addTask = (event) => {
    event.preventDefault();
    const title = taskInput.trim();

    if (!title) return;

    setTasks((current) => [
      {
        id: Date.now(),
        title,
        category,
        priority,
        done: false,
      },
      ...current,
    ]);

    setTaskInput("");
    setShowForm(false);
  };

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const changeFocusDuration = (minutes) => {
    setFocusMinutes(minutes);
    setSecondsLeft(minutes * 60);
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(focusMinutes * 60);
  };

  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
    secondsLeft % 60
  ).padStart(2, "0")}`;

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">✳</div>
          <div>
            <h2>FocusFlow</h2>
            <p>Make room for focus</p>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="nav-menu">
          {[
            ["Overview", "⌂"],
            ["My Tasks", "☷"],
            ["Focus Timer", "◷"],
          ].map(([label, symbol]) => (
            <button
              key={label}
              className={`nav-item ${activeNav === label ? "active" : ""}`}
              onClick={() => setActiveNav(label)}
            >
              <span className="nav-symbol">{symbol}</span>
              {label}
              {label === "My Tasks" && (
                <span className="nav-count">{tasks.filter((t) => !t.done).length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="quote-card">
            <span className="quote-icon">✿</span>
            <p className="quote-title">A little reminder</p>
            <p className="quote-text">
              Progress is progress, no matter how small.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">F</div>
            <div className="profile-info">
              <strong>FocusFlow User</strong>
              <span>Free workspace</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activeNav}</strong>
          </div>
          <div className="topbar-right">
            <span className="today-label">☀ {currentDate}</span>
            <div className="top-avatar">F</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-section">
            <div>
              <p className="eyebrow">YOUR PERSONAL PRODUCTIVITY SPACE</p>
              <h1>
                A little progress, <span>a lot of growth.</span> ✨
              </h1>
              <p className="welcome-subtitle">
                One step at a time. You’re doing better than you think.
              </p>
            </div>

            <button className="primary-button" onClick={() => setShowForm(true)}>
              <span>＋</span> Add a task
            </button>
          </section>

          {activeNav === "Focus Timer" && (
            <section className="focus-panel">
              <div className="section-heading">
                <div>
                  <h2>Your focus corner</h2>
                  <p>Give one thing your full attention.</p>
                </div>
                <span className="soft-badge">✦ Deep work</span>
              </div>

              <div className="timer-content">
                <div className="timer-ring">
                  <div className="timer-inner">
                    <span className="timer-leaf">✿</span>
                    <strong>{formattedTime}</strong>
                    <span>minutes of focus</span>
                  </div>
                </div>

                <div className="timer-controls">
                  <p className="eyebrow">CHOOSE YOUR SESSION</p>
                  <div className="duration-options">
                    {[15, 25, 45].map((minutes) => (
                      <button
                        key={minutes}
                        className={focusMinutes === minutes ? "selected" : ""}
                        onClick={() => changeFocusDuration(minutes)}
                      >
                        {minutes} min
                      </button>
                    ))}
                  </div>

                  <div className="timer-buttons">
                    <button
                      className="primary-button"
                      onClick={() => {
                        if (secondsLeft === 0) setSecondsLeft(focusMinutes * 60);
                        setTimerRunning(!timerRunning);
                      }}
                    >
                      {timerRunning ? "Ⅱ Pause session" : "▶ Start focusing"}
                    </button>
                    <button className="secondary-button" onClick={resetTimer}>
                      ↻ Reset
                    </button>
                  </div>
                  <p className="timer-tip">
                    ☕ Tip: silence notifications and take a short break after
                    your session.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeNav !== "Focus Timer" && (
            <>
              <section className="stats-grid">
                <div className="stat-card lavender">
                  <div className="stat-top">
                    <span className="stat-label">Total tasks</span>
                    <span className="stat-icon">☷</span>
                  </div>
                  <strong className="stat-number">{tasks.length}</strong>
                  <span className="stat-foot">Your plans, all in one place</span>
                </div>

                <div className="stat-card mint">
                  <div className="stat-top">
                    <span className="stat-label">Completed</span>
                    <span className="stat-icon">✓</span>
                  </div>
                  <strong className="stat-number">{completedTasks}</strong>
                  <span className="stat-foot">Little wins count too</span>
                </div>

                <div className="stat-card peach">
                  <div className="stat-top">
                    <span className="stat-label">Still to do</span>
                    <span className="stat-icon">◷</span>
                  </div>
                  <strong className="stat-number">
                    {tasks.length - completedTasks}
                  </strong>
                  <span className="stat-foot">Take them one by one</span>
                </div>

                <div className="stat-card blue">
                  <div className="stat-top">
                    <span className="stat-label">Your progress</span>
                    <span className="stat-icon">↗</span>
                  </div>
                  <strong className="stat-number">{progress}%</strong>
                  <div className="mini-progress">
                    <div style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </section>

              <section className="dashboard-grid">
                <div className="panel tasks-panel">
                  <div className="section-heading">
                    <div>
                      <h2>{activeNav === "My Tasks" ? "All your tasks" : "Today's tasks"}</h2>
                      <p>A clear mind starts with a clear list.</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setActiveNav("My Tasks")}
                    >
                      View all →
                    </button>
                  </div>

                  <div className="task-filters">
                    {["All", "Pending", "Completed"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setFilter(item)}
                        className={filter === item ? "filter-active" : ""}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="task-list">
                    {visibleTasks.length === 0 ? (
                      <div className="empty-state">
                        <span>🌱</span>
                        <h3>Nothing here just yet</h3>
                        <p>Add a task and give your day a little direction.</p>
                        <button
                          className="text-button"
                          onClick={() => setShowForm(true)}
                        >
                          Create your first task →
                        </button>
                      </div>
                    ) : (
                      visibleTasks.map((task) => (
                        <div className={`task-row ${task.done ? "task-done" : ""}`} key={task.id}>
                          <button
                            className={`task-checkbox ${task.done ? "checked" : ""}`}
                            aria-label={task.done ? "Mark task incomplete" : "Complete task"}
                            onClick={() => toggleTask(task.id)}
                          >
                            {task.done ? "✓" : ""}
                          </button>

                          <div className="task-details">
                            <strong>{task.title}</strong>
                            <div className="task-meta">
                              <span className={`category-tag ${task.category.toLowerCase()}`}>
                                {task.category}
                              </span>
                              <span className={`priority ${task.priority.toLowerCase()}`}>
                                {task.priority} priority
                              </span>
                            </div>
                          </div>

                          <button
                            className="delete-task"
                            aria-label={`Delete ${task.title}`}
                            onClick={() => deleteTask(task.id)}
                            title="Delete task"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <button className="add-task-row" onClick={() => setShowForm(true)}>
                    <span>＋</span> Add another task
                  </button>
                </div>

                <div className="right-column">
                  <div className="panel progress-panel">
                    <div className="section-heading">
                      <div>
                        <h2>Your daily progress</h2>
                        <p>Every small win adds up.</p>
                      </div>
                      <span className="progress-sparkle">✧</span>
                    </div>

                    <div className="progress-visual">
                      <div
                        className="progress-circle"
                        style={{ "--progress": `${progress}%` }}
                      >
                        <div className="circle-inner">
                          <strong>{progress}%</strong>
                          <span>completed</span>
                        </div>
                      </div>
                    </div>

                    <p className="progress-message">
                      {progress === 100 && tasks.length > 0
                        ? "Amazing! You completed everything. 🌟"
                        : progress >= 50
                        ? "You're making lovely progress. Keep going! 🌷"
                        : "Start small. You're building momentum. 🌱"}
                    </p>

                    <div className="progress-legend">
                      <span><i className="legend-dot done-dot" /> Completed ({completedTasks})</span>
                      <span><i className="legend-dot todo-dot" /> Remaining ({tasks.length - completedTasks})</span>
                    </div>
                  </div>

                  <div className="focus-promo">
                    <div className="promo-decoration">☾</div>
                    <div className="promo-content">
                      <span className="promo-label">A MOMENT FOR YOU</span>
                      <h3>Make time for deep focus.</h3>
                      <p>One task. One session. One step forward.</p>
                      <button onClick={() => setActiveNav("Focus Timer")}>
                        Open focus timer <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          <footer className="footer">
            <span>Made with care <span className="footer-heart">♥</span> and a little focus.</span>
            <span>FocusFlow · Your pace, your progress.</span>
          </footer>
        </div>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div
            className="task-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">ONE STEP AT A TIME</span>
                <h2 id="modal-title">Create a new task</h2>
                <p>Make it small, make it doable.</p>
              </div>
              <button className="close-modal" onClick={() => setShowForm(false)}>
                ×
              </button>
            </div>

            <form onSubmit={addTask}>
              <label htmlFor="task-title">Task name</label>
              <input
                id="task-title"
                value={taskInput}
                onChange={(event) => setTaskInput(event.target.value)}
                placeholder="What would you like to get done?"
                autoFocus
                required
              />

              <div className="form-row">
                <div>
                  <label htmlFor="task-category">Category</label>
                  <select
                    id="task-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option>Study</option>
                    <option>Project</option>
                    <option>Learning</option>
                    <option>Personal</option>
                    <option>Work</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  ＋ Create task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;