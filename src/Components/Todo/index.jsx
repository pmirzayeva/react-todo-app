import React, { useState, useEffect } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import style from "./todo.module.css";

export default function Todo() {
  const [task, setTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTask = (e) => {
    e.preventDefault();
    if (!canAddTask()) return;
    const newTask = { ...task, id: Date.now(), completed: false };
    setTasks([...tasks, newTask]);
    setTask({ title: "", description: "" });
  };

  const toggleCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const canAddTask = () => {
    return task.title.trim() !== '' && task.description.trim() !== '';
  };

  const filteredTasks = showCompleted ? tasks.filter(task => task.completed) : tasks.filter(task => !task.completed);

  return (
    <>
      <h1>My To-Do List</h1>
      <div className={style.container}>
        <form onSubmit={handleTask}>
          <div className={style.input}>
            <div className={style.inputItem}>
              <label>Title</label>
              <input
                type='text'
                placeholder='Title'
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
            </div>
            <div className={style.inputItem}>
              <label>Description</label>
              <textarea
                placeholder='Description'
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
              />
            </div>
            <button className={style.addBtn} type='submit' disabled={!canAddTask()}>
              Add
            </button>
          </div>
        </form>
        <div className={style.todoArea}>
          <button onClick={toggleCompleted} className={`${style.showCompleted} showCompleted && 'active'}`}>
            {showCompleted ? 'Back' : 'Completed'}
          </button>
        </div>
        <div className={style.list}>
          {filteredTasks.map(task => (
            <div key={task.id} className={style.listItem}>
              <div className={style.itemContent}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <div className={style.btns}>
                {!task.completed && (
                  <FaCheck
                    className={style.check}
                    onClick={() => handleCompleteTask(task.id)}
                  />
                )}
                <MdDeleteOutline
                  className={style.bin}
                  onClick={() => handleDeleteTask(task.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
