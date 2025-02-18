import { useState } from 'react';
import './App.css';
import supabase from "./supabase-client";
import { useEffect } from 'react';

function App() {
  const [todosList, setTodosList] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    fectTodos()
  }, [])

  const fectTodos = async () => {
    const { data, error } = await supabase.from('TodoList').select('*')
    if (error) {
      console.log("Error fecthing: ", error)
    } else {
      setTodosList(data);
    }
  }

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isComplated: false,
    }
    const { data, error } = await supabase
      .from('TodoList')
      .insert([newTodoData])
      .single()

    if (error) {
      console.log('Error adding todo: ', error)
    } else {
      setTodosList((prev) => [...prev, data])
      setNewTodo('')
    }
  }

  const complateTask = async (id, isComplated) => {
    const { data, error } = await supabase
      .from('TodoList')
      .update({ isComplated: !isComplated })
      .eq("id", id)

    if (error) {
      console.log("error toggling task: ", error)
    } else {
      const updatedTodoList = todosList.map((todo) =>
        todo.id === id ? { ...todo, isComplated: !isComplated } : todo
      )
      setTodosList(updatedTodoList);
    }
  }

  const deleteTask = async (id) => {
    const { data, error } = await supabase
      .from('TodoList')
      .delete()
      .eq("id", id)

    if (error) {
      console.log("error delete task: ", error)
    } else {
      setTodosList((prev) => prev.filter((todo) => todo.id !== id));
    }
  }

  return (
    <div>
      {" "}
      <h1>Todo</h1>
      <div>
        <input
          type='text'
          placeholder='new todo...'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add todo item</button>
      </div>
      <ul>
        {todosList.map((todo) => (
          <li>
            <p>{todo.name}</p>
            <button
              onClick={() => complateTask(todo.id, todo.isComplated)}
            >
              {todo.isComplated ? "Undo" : "Complate Task"}
            </button>
            <button
              onClick={() => deleteTask(todo.id)}
            >
              Delete Task
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
