'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from "react"

const BASE_URL = "http://localhost:8080/api"

interface Todo {
  id: number
  content: string
  completed: boolean
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoContent, setNewTodoContent] = useState<string>("")
  const [updateTodo, setUpdateTodo] = useState<Todo>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchTodos = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/todos`)
      if (!res.ok) throw Error()
      const todos = await res.json()
      setTodos(todos)
    } catch (error) {
      console.log(error)
      alert("Fetch todos failed")
    }
    setIsLoading(false)
  }

  const handleNewTodoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodoContent(e.target.value);
  };

  const handleUpdateTodoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateTodo(prev => 
      prev ? {...prev, [e.target.name]: e.target.value } : prev
    );
  };

  const handleSelectUpdateTodo = (todo: Todo) => {
    setUpdateTodo(todo)
  }

  const handleCancelUpdate = () => {
    setUpdateTodo(undefined)
  }

  const handleAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newTodoContent === "") return
    try {
      const res = await fetch(`${BASE_URL}/todos`,{
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newTodoContent.trim()
        }),
      })
      if (!res.ok) throw Error()
      const todo = await res.json()
      setTodos(prevTodos => [...prevTodos, todo]);
      setNewTodoContent("")
      console.log("add success")
    } catch (error) {
      console.log(error)
      alert("Add failed")
    }
  }

  const handleUpdateTodo = async (id: number, data: Todo) => {
    try {
      const res = await fetch(`${BASE_URL}/todos/${id}`,{
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw Error()
      const updatedTodo = await res.json()
      setTodos(todos.map(todo => todo.id == id ? updatedTodo : todo))
      handleCancelUpdate()
      console.log("update success")
    } catch (error) {
      console.log(error)
      alert("Update failed")
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/todos/${id}`,{
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw Error()
      setTodos(todos.filter(todo => todo.id != id))
      console.log("remove success")
    } catch (error) {
      console.log(error)
      alert("Delete failed")
    }
  }

  const handleChckedTodo = async (todo: Todo) => {
    todo.completed = !todo.completed
    await handleUpdateTodo(todo.id, todo)
  }

  useEffect(()=>{
    fetchTodos()
  }, [])

  return (
    <section className="max-w-3xl shadow-xl rounded-xl p-4 mx-auto">
      <h2 className="text-2xl font-bold text-center border-b-2 border-neutral-100">Todo List</h2>
      {/* Add todo */}
      <form className="flex gap-3" onSubmit={handleAddTodo}>
        <input 
          id={"new-todo-input"}
          type="text"
          className="w-full border p-2 border-neutral-300"
          placeholder="Add todos" 
          name="content"
          value={newTodoContent}
          onChange={handleNewTodoChange}
        />
        <button 
          id={"new-todo-btn"}
          type="submit"
          className="btn bg-green-500 !px-4"
          disabled={newTodoContent.trim() === ""}
        >
          Add
        </button>
      </form>

      {/* Loading */}
      {isLoading ? (
        <div className="font-bold text-3xl text-center text-gray-200 p-3">
          Loading..
        </div>
      // No Content
      ): todos.length == 0 ? (
        <div className="font-bold text-3xl text-center text-gray-200 p-3">
          There is no Todo..
        </div>
      // Have Content
      ) : (
        <div className="flex flex-col divide-y divide-neutral-400">
        {todos.map((todo) => (
          <div className="todo-item flex items-center justify-between gap-3 p-3 " key={todo.id}>
            {updateTodo?.id == todo.id ? (
              <>
                <input 
                  type="text" 
                  className="p-1 w-full border border-neutral-300"
                  name="content"
                  value={updateTodo?.content}
                  onChange={handleUpdateTodoChange} 
                />
                <div className="flex gap-3">
                  <button 
                    className="btn bg-blue-500" 
                    onClick={handleCancelUpdate}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn bg-green-500" 
                    disabled={updateTodo?.content === todo.content}
                    onClick={()=> handleUpdateTodo(updateTodo.id, updateTodo)}
                  > 
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>{ todo.content }</p>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    checked={todo.completed}
                    onChange={()=> handleChckedTodo(todo)}
                    className="size-5"
                  />
                  <button 
                    className="btn bg-blue-500" 
                    onClick={()=> handleSelectUpdateTodo(todo)}
                  >
                    Update
                  </button>
                  <button 
                    className="btn bg-red-500" 
                    onClick={()=>handleDeleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
            
          </div>
        ))}
      </div>
      )}
    </section>
  )
}
export default TodoList