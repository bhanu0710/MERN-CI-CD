const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function getTodos() {
  const res = await fetch(`${API_BASE_URL}/todos`);
  if (!res.ok) throw new Error("failed to load todos");
  return await res.json();
}

export async function createTodo(text) {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("failed to create todo");
  return await res.json();
}

export async function toggleTodo(id, done) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ done }),
  });
  if (!res.ok) throw new Error("failed to update todo");
  return await res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("failed to delete todo");
}

