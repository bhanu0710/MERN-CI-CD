import React, { useEffect, useMemo, useState } from "react";
import { createTodo, deleteTodo, getTodos, toggleTodo } from "./api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState({ kind: "idle", message: "" });

  const remaining = useMemo(
    () => todos.filter((t) => !t.done).length,
    [todos]
  );

  async function refresh() {
    setStatus({ kind: "loading", message: "Loading..." });
    try {
      const items = await getTodos();
      setTodos(items);
      setStatus({ kind: "idle", message: "" });
    } catch (e) {
      setStatus({ kind: "error", message: e.message || "Failed to load" });
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setStatus({ kind: "loading", message: "Adding..." });
    try {
      const created = await createTodo(t);
      setTodos((prev) => [created, ...prev]);
      setText("");
      setStatus({ kind: "idle", message: "" });
    } catch (e2) {
      setStatus({ kind: "error", message: e2.message || "Failed to add" });
    }
  }

  async function onToggle(item) {
    setStatus({ kind: "loading", message: "Updating..." });
    try {
      const updated = await toggleTodo(item._id, !item.done);
      setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setStatus({ kind: "idle", message: "" });
    } catch (e) {
      setStatus({ kind: "error", message: e.message || "Failed to update" });
    }
  }

  async function onDelete(item) {
    setStatus({ kind: "loading", message: "Deleting..." });
    try {
      await deleteTodo(item._id);
      setTodos((prev) => prev.filter((t) => t._id !== item._id));
      setStatus({ kind: "idle", message: "" });
    } catch (e) {
      setStatus({ kind: "error", message: e.message || "Failed to delete" });
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="title">MERN on EKS</div>
        <div className="subtitle">
          GitOps (ArgoCD) • CI/CD (Jenkins) • SonarQube • OWASP
        </div>
      </header>

      <main className="card">
        <form className="row" onSubmit={onAdd}>
          <input
            className="input"
            placeholder="Add a todo..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn" type="submit">
            Add
          </button>
          <button className="btn secondary" type="button" onClick={refresh}>
            Refresh
          </button>
        </form>

        <div className="meta">
          <span>Remaining: {remaining}</span>
          {status.kind !== "idle" ? (
            <span className={status.kind === "error" ? "err" : ""}>
              {status.message}
            </span>
          ) : null}
        </div>

        <ul className="list">
          {todos.map((t) => (
            <li key={t._id} className="item">
              <label className="check">
                <input
                  type="checkbox"
                  checked={!!t.done}
                  onChange={() => onToggle(t)}
                />
                <span className={t.done ? "done" : ""}>{t.text}</span>
              </label>
              <button className="btn danger" onClick={() => onDelete(t)}>
                Delete
              </button>
            </li>
          ))}
          {todos.length === 0 ? (
            <li className="empty">No todos yet. Add one above.</li>
          ) : null}
        </ul>
      </main>

      <footer className="footer">
        <span>
          API base: <code>{import.meta.env.VITE_API_BASE_URL || "/api"}</code>
        </span>
      </footer>
    </div>
  );
}

