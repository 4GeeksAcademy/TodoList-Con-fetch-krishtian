import React, { useState, useEffect } from "react";
import "./index.css";

const USER_URL = "https://playground.4geeks.com/todo/users/York";
const TODOS_URL = "https://playground.4geeks.com/todo/todos/York";

const Home = () => {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");

  useEffect(() => {
    obtenerTareasDelServidor();
  }, []);

  const obtenerTareasDelServidor = async () => {
    try {
      const response = await fetch(USER_URL);
      if (!response.ok) throw new Error("Error al obtener tareas");

      const data = await response.json();
      const listaTareas = Array.isArray(data.todos) ? data.todos : [];
      setTareas(listaTareas);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const agregarTarea = async (e) => {
    if (e.key === "Enter" && nuevaTarea.trim() !== "") {
      const tarea = { label: nuevaTarea, is_done: false };
      try {
        setNuevaTarea("");
        await fetch(TODOS_URL, {
          method: "POST",
          body: JSON.stringify(tarea),
          headers: { "Content-Type": "application/json" },
        });
        obtenerTareasDelServidor();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const borrarTarea = async (id) => {
    try {
      const response = await fetch(
        `https://playground.4geeks.com/todo/todos/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Error al eliminar tarea");
      setTareas(tareas.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const borrarTodasLasTareas = async () => {
    try {
      const response = await fetch(USER_URL, {
        method: "DELETE", // ✅ este es el correcto para limpiar todo
      });

      if (!response.ok) throw new Error("Error al limpiar todas las tareas");

      setTareas([]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div>
        <h1>TODOS</h1>

        <div className="todoContainer">
          {/* Input */}
          <input
            className="todoInput"
            type="text"
            placeholder="Añadir tarea"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            onKeyDown={agregarTarea}
          />

          <ul className="todoList">
            {tareas.length === 0 ? (
              <p className="noTareas">No hay tareas pendientes</p>
            ) : (
              tareas.map((tarea) => (
                <li key={tarea.id} className="todoItem">
                  {tarea.label}
                  <span
                    className="deleteButton"
                    onClick={() => borrarTarea(tarea.id)}
                  >
                    &#10060;
                  </span>
                </li>
              ))
            )}
          </ul>

          {tareas.length > 0 && (
            <button className="buttonClearAll" onClick={borrarTodasLasTareas}>
              <em>Limpiar todas las tareas</em>
            </button>
          )}
        </div>
      </div>

      <div className="footer">
        {tareas.length > 0
          ? `${tareas.length} tarea${tareas.length > 1 ? "s" : ""} pendiente${
              tareas.length > 1 ? "s" : ""
            }`
          : null}
      </div>
    </>
  );
};

export default Home;
