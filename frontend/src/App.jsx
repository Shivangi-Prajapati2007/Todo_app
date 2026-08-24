import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import { apiRequest } from "./api";

function ProtectedRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="brand">Alfido Tasks</Link>
        {user && (
          <div>
            <span className="welcome">Hi, {user.name}</span>
            <button onClick={logout} className="small-btn">Logout</button>
          </div>
        )}
      </nav>
      {children}
    </>
  );
}

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-card">
      <h1>Login</h1>
      <p>Login to manage your tasks.</p>
      {error && <div className="error">{error}</div>}

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="primary-btn">Login</button>
      </form>

      <p>New user? <Link to="/register">Create account</Link></p>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(form)
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-card">
      <h1>Create Account</h1>
      <p>Register for the task manager.</p>
      {error && <div className="error">{error}</div>}

      <form onSubmit={submit}>
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password (minimum 6 characters)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength="6"
          required
        />
        <button className="primary-btn">Register</button>
      </form>

      <p>Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      const data = await apiRequest("/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();

    if (!form.title.trim()) return;

    try {
      const task = await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setTasks([task, ...tasks]);
      setForm({ title: "", description: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(task) {
    try {
      const updated = await apiRequest(`/tasks/${task._id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !task.completed })
      });

      setTasks(tasks.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeTask(id) {
    try {
      await apiRequest(`/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <section className="hero">
        <h1>Task Manager</h1>
        <p>MERN Stack project for Alfido Tech Tasks 1</p>
      </section>

      {error && <div className="error">{error}</div>}

      <form className="task-form" onSubmit={addTask}>
        <input
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="primary-btn">Add Task</button>
      </form>

      <section className="task-list">
        {tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add your first task.</p>
        ) : (
          tasks.map((task) => (
            <article className={`task ${task.completed ? "done" : ""}`} key={task._id}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <div className="actions">
                <button onClick={() => toggleTask(task)}>
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button className="danger" onClick={() => removeTask(task._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;