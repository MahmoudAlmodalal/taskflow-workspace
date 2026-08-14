// Quiet Command Center: editorial modernism, warm paper, ink hierarchy, and saffron momentum.
// This page keeps the next action central while making progress feel visible and human.

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import {
  Archive,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Download,
  FileText,
  Filter,
  Flame,
  LayoutDashboard,
  ListFilter,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

type Priority = "high" | "medium" | "low";
type Task = {
  id: string;
  title: string;
  project: string;
  priority: Priority;
  done: boolean;
  due: string;
};
type FilterKey = "all" | "today" | "open" | "done";

const starterTasks: Task[] = [
  { id: "brief", title: "Shape the launch brief", project: "Northstar", priority: "high", done: false, due: "Today" },
  { id: "review", title: "Review the onboarding notes", project: "Northstar", priority: "medium", done: false, due: "Today" },
  { id: "assets", title: "Send the final asset list", project: "Studio", priority: "medium", done: true, due: "Today" },
  { id: "metrics", title: "Pull last week’s activation numbers", project: "Studio", priority: "low", done: false, due: "Tomorrow" },
  { id: "sync", title: "Book a 30-minute team sync", project: "Operations", priority: "low", done: true, due: "Friday" },
];

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All tasks" },
  { key: "today", label: "Today" },
  { key: "open", label: "Open" },
  { key: "done", label: "Completed" },
];

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

function readTasks() {
  try {
    const saved = window.localStorage.getItem("taskflow-tasks");
    return saved ? (JSON.parse(saved) as Task[]) : starterTasks;
  } catch {
    return starterTasks;
  }
}

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  return (
    <article className={`task-row ${task.done ? "is-done" : ""}`}>
      <button className="task-check" onClick={onToggle} aria-label={task.done ? `Mark ${task.title} as open` : `Complete ${task.title}`}>
        {task.done ? <Check size={15} strokeWidth={3} /> : <Circle size={19} strokeWidth={1.7} />}
      </button>
      <div className="task-copy">
        <p className="task-title">{task.title}</p>
        <div className="task-meta">
          <span>{task.project}</span>
          <span className={`priority-dot ${task.priority}`} aria-label={`${task.priority} priority`} />
          <span>{task.due}</span>
        </div>
      </div>
      <span className={`priority-label ${task.priority}`}>{task.priority}</span>
      <button className="icon-button task-delete" onClick={onDelete} aria-label={`Delete ${task.title}`}>
        <Trash2 size={16} />
      </button>
    </article>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(readTasks);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    window.localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completed = tasks.filter((task) => task.done).length;
  const open = tasks.length - completed;
  const completion = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesFilter = filter === "all" || (filter === "today" && task.due === "Today") || (filter === "open" && !task.done) || (filter === "done" && task.done);
      const matchesSearch = !query || `${task.title} ${task.project}`.toLowerCase().includes(query);
      const matchesCompleted = showCompleted || !task.done;
      return matchesFilter && matchesSearch && matchesCompleted;
    });
  }, [filter, search, showCompleted, tasks]);

  const todayLabel = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  function addTask() {
    const title = newTask.trim();
    if (!title) return;
    setTasks((current) => [{ id: crypto.randomUUID(), title, project: "Personal", priority: "medium", done: false, due: "Today" }, ...current]);
    setNewTask("");
    toast.success("Task added to today");
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") addTask();
  }

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function deleteTask(id: string) {
    const task = tasks.find((item) => item.id === id);
    setTasks((current) => current.filter((item) => item.id !== id));
    if (task) toast(`Removed “${task.title}”`);
  }

  function exportTasks() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "taskflow-tasks.json";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Your task list is ready to save");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="Taskflow home">
          <span className="brand-mark"><img src={assetUrl("assets/taskflow-mark.png")} alt="" /></span>
          <span className="brand-name">taskflow<span>.</span></span>
        </a>
        <div className="topbar-actions">
          <span className="sync-status"><span className="status-pulse" /> Saved locally</span>
          <button className="icon-button" onClick={exportTasks} aria-label="Export tasks"><Download size={17} /></button>
          <button className="avatar" aria-label="Account menu">M</button>
        </div>
      </header>

      <div className="demo-notice" role="note">
        <span className="demo-notice-label">Experimental demo</span>
        <p>This GitHub Pages preview is independent from the original Laravel application.</p>
        <a href="https://github.com/MahmoudAlmodalal/taskflow-workspace" target="_blank" rel="noreferrer">View the original project <ArrowUpRight size={13} /></a>
      </div>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-intro">
            <p className="eyebrow">Your workspace</p>
            <h1>Good morning,<br /><em>Mahmoud.</em></h1>
            <p className="sidebar-date">{todayLabel}</p>
          </div>

          <nav className="side-nav" aria-label="Workspace navigation">
            <p className="nav-label">Navigate</p>
            <button className="nav-item active"><LayoutDashboard size={17} /> Overview <span className="nav-count">{open}</span></button>
            <button className="nav-item"><CalendarDays size={17} /> Calendar</button>
            <button className="nav-item"><Archive size={17} /> Archive</button>
          </nav>

          <div className="side-projects">
            <div className="section-heading"><p className="nav-label">Projects</p><button className="tiny-button" aria-label="Add project"><Plus size={15} /></button></div>
            <button className="project-item"><span className="project-swatch saffron" />Northstar<span className="project-count">3</span></button>
            <button className="project-item"><span className="project-swatch moss" />Studio<span className="project-count">2</span></button>
            <button className="project-item"><span className="project-swatch clay" />Operations<span className="project-count">1</span></button>
          </div>

          <div className="sidebar-footer">
            <div className="focus-note"><Sparkles size={16} /><span><strong>Focus mode</strong><small>One thing at a time.</small></span><ChevronDown size={15} /></div>
            <p className="version-line">Taskflow v1.0 · made for momentum</p>
          </div>
        </aside>

        <main className="main-content">
          <section className="hero-strip">
            <div className="hero-copy">
              <p className="eyebrow">Today’s focus</p>
              <h2>Make room for the work<br /><span>that matters.</span></h2>
              <p className="hero-description">A lighter way to see what is next, keep momentum, and close the loop.</p>
              <div className="hero-progress"><span style={{ width: `${completion}%` }} /><small>{completion}% of your list complete</small></div>
            </div>
            <div className="hero-art" style={{ backgroundImage: `url('${assetUrl("assets/taskflow-calm-desk.jpg")}')` }} aria-hidden="true"><span className="hero-art-label">A clear desk<br /><strong>clears the mind.</strong></span></div>
          </section>

          <section className="task-section" aria-labelledby="tasks-heading">
            <div className="section-header">
              <div><p className="eyebrow">Your list</p><h2 id="tasks-heading">Open loops <span>{open}</span></h2></div>
              <button className="text-button" onClick={() => setTasks((current) => current.filter((task) => !task.done))}>Clear completed <ArrowUpRight size={15} /></button>
            </div>

            <div className="composer">
              <button className="composer-add" onClick={addTask} aria-label="Add task"><Plus size={19} /></button>
              <input value={newTask} onChange={(event) => setNewTask(event.target.value)} onKeyDown={handleComposerKeyDown} placeholder="Add the next action…" aria-label="New task" />
              <span className="composer-hint">Press Enter</span>
            </div>

            <div className="task-toolbar">
              <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
                {filters.map((item) => <button key={item.key} className={filter === item.key ? "filter-tab active" : "filter-tab"} onClick={() => setFilter(item.key)} role="tab" aria-selected={filter === item.key}>{item.label}</button>)}
              </div>
              <div className="toolbar-actions">
                <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" aria-label="Search tasks" />{search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={14} /></button>}</label>
                <button className={`filter-button ${showCompleted ? "active" : ""}`} onClick={() => setShowCompleted((value) => !value)}><ListFilter size={15} /> {showCompleted ? "Showing all" : "Open only"}</button>
              </div>
            </div>

            <div className="task-list">
              {visibleTasks.length ? visibleTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} onDelete={() => deleteTask(task.id)} />) : (
                <div className="empty-state"><img src={assetUrl("assets/taskflow-focus.jpg")} alt="A paper path leading to a small spark" /><div><h3>No loops here.</h3><p>Try a new search or add the next action to your day.</p></div></div>
              )}
            </div>
            <div className="list-footer"><span><CheckCircle2 size={15} /> {completed} completed today</span><button className="more-button" aria-label="More task options"><MoreHorizontal size={18} /></button></div>
          </section>
        </main>

        <aside className="insight-column">
          <div className="insight-heading"><p className="eyebrow">A small read</p><button className="icon-button" aria-label="Filter insights"><Filter size={16} /></button></div>
          <section className="insight-card momentum-card"><div className="insight-card-top"><span className="insight-icon saffron-bg"><Flame size={17} /></span><span className="trend-tag">+12% this week</span></div><p className="metric-label">Momentum score</p><p className="metric-value">{Math.max(48, Math.min(98, 68 + completed * 5))}<small>/100</small></p><div className="momentum-bars"><i style={{ height: "36%" }} /><i style={{ height: "52%" }} /><i style={{ height: "48%" }} /><i style={{ height: "76%" }} /><i style={{ height: "66%" }} /><i className="today" style={{ height: `${Math.max(58, completion)}%` }} /></div><p className="insight-caption">You’re building a steady rhythm. Keep the next step small.</p></section>
          <section className="insight-card week-card"><div className="insight-card-top"><span className="insight-icon moss-bg"><CalendarDays size={17} /></span><button className="card-kebab" aria-label="More weekly options"><MoreHorizontal size={17} /></button></div><p className="metric-label">This week</p><div className="week-stat"><strong>{completed + 8}</strong><span>tasks closed</span></div><div className="mini-calendar" aria-label="Weekly task activity"><span className="calendar-label">M</span><span className="calendar-label">T</span><span className="calendar-label">W</span><span className="calendar-label">T</span><span className="calendar-label">F</span><span className="calendar-label">S</span><span className="calendar-label">S</span><i /><i className="filled" /><i className="filled" /><i className="filled" /><i className="today-dot" /><i /><i /></div><img className="week-art" src={assetUrl("assets/taskflow-calendar.jpg")} alt="Abstract weekly planner on paper" /></section>
          <section className="quote-card"><FileText size={18} /><p>“Clarity is not more information. It’s knowing what to do next.”</p><span>— Taskflow note</span></section>
        </aside>
      </div>
    </div>
  );
}
