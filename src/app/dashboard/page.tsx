'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchTasks, addTask, deleteTask } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Task } from '@/types';
import { Trash2, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // Verificamos si ya está autenticado antes de cargar los datos
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirige al login si no está autenticado
      return;
    }

    const fetchData = async () => {
      try {
        const tasksData = await fetchTasks();
        setTasks(tasksData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router]); // Dependemos de isAuthenticated para no hacer llamadas innecesarias

  if (!isAuthenticated || loading) {
    return <div>Loading...</div>;
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle || !newTaskDescription) return;
    try {
      const newTask = await addTask(newTaskTitle, newTaskDescription);
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <main className="p-4 text-center flex flex-col self-center items-center h-[90dvh]">
      <h1 className="text-3xl mb-4 text-cyan-400">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleAddTask} className="mb-6 w-8/12">
        <input
          type="text"
          placeholder="Título de la tarea"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200"
          required
        />
        <textarea
          placeholder="Descripción de la tarea"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200"
          required
        />
        <button type="submit" className="group relative bg-cyan-500/75 text-white p-2 rounded-4xl text-center transition-all duration-300 hover:scale-120 hover:bg-cyan-300/75 hover:shadow-md hover:shadow-cyan-200 hover:cursor-pointer">
          <Plus />
          <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 px-2 py-1 bg-gray-800 text-white text-sm rounded scale-80 translate-y-3">
            Agregar tarea
          </span>
        </button>
      </form>

      <ul className="p-5 space-y-4 w-8/12 overflow-y-scroll">
        {tasks.map((task: Task) => (
          <li key={task.id} className="p-4 rounded-2xl shadow-sm shadow-cyan-200">
            <h2 className="text-2xl text-cyan-400 underline"><strong>{task.title}</strong></h2>
            <p className='break-words text-cyan-200'>{task.description}</p>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="group relative text-red-500 mt-2"
            >
              {/* Sombra */}
              <Trash2 className="absolute text-red-600 opacity-0 filter transition-all duration-300 group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
              {/* Ícono Principal */}
              <Trash2 className="relative text-red-600 transition-all duration-300 group-hover:scale-120 group-hover:cursor-pointer" />
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
