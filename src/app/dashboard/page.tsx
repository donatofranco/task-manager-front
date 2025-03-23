'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchTasks, addTask, deleteTask } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Task } from '@/types';

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
    <div className="p-6">
      <h1 className="text-3xl mb-4">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleAddTask} className="mb-6">
        <input
          type="text"
          placeholder="Título de la tarea"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="p-2 border rounded w-full mb-4"
          required
        />
        <textarea
          placeholder="Descripción de la tarea"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          className="p-2 border rounded w-full mb-4"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Agregar tarea
        </button>
      </form>

      <ul className="space-y-4">
        {tasks.map((task: Task) => (
          <li key={task.id} className="p-4 border rounded">
            <h3 className="text-lg">{task.title}</h3>
            <p>{task.description}</p>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-red-500 mt-2"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
