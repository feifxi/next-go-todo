import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <div>
      <header className="border text-3xl p-3 bg-black text-white ">
        <h1>Nextjs + Golang</h1>
      </header>
      <main>
        <TodoList />  
      </main>
    </div>
  );
}
