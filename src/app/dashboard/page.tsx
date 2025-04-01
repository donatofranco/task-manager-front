'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchTasks, addTask, deleteTask } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Task } from '@/types';
import { Trash2, Plus, Check, X } from 'lucide-react';
import { Modal } from '../components/modal/page';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(false);
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
      {error && <p className="text-red-500">{error}</p>}
      {/* <div className="flex items-center justify-center"> */}
        <button onClick={() => setIsModalOpen(true)}
        className="group relative bg-cyan-500/75 text-white p-2 mb-4
        rounded-4xl text-center transition-all duration-300 hover:scale-120 hover:bg-cyan-300/75 
        hover:shadow-md hover:shadow-cyan-200 hover:cursor-pointer">
          <Plus />
          <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 px-2 py-1
            bg-gray-800 text-white text-sm rounded scale-80 translate-y-3">
            Agregar tarea
          </span>
        </button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleAddTask} className="w-[95dvw] lg:max-w-[40dvw] p-5 mb-6 rounded-md 
          shadow-xl shadow-cyan-200 bg-black">
            <input
              type="text"
              placeholder="Título nueva tarea"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200"
              required
            />
            <textarea
              placeholder="Descripción nueva tarea"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200 max-h-[20dvh] min-h-[5dvh]"
              required
            />
            <button type="submit" className="group relative text-white p-2 
            rounded-4xl text-center transition-all duration-300 hover:scale-120 
            hover:shadow-md hover:shadow-cyan-200 hover:cursor-pointer">
              <Check  className='text-green-500'/>
              <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 px-2 py-1
              bg-gray-800 text-white text-sm rounded scale-80 translate-y-3">
                Agregar tarea
              </span>
            </button>
            <button onClick={() => setIsModalOpen(false)} className="group relative text-white p-2 
            rounded-4xl text-center transition-all duration-300 hover:scale-120 
            hover:shadow-md hover:shadow-cyan-200 hover:cursor-pointer">
              <X  className='text-red-500'/>
              <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 px-2 py-1
              bg-gray-800 text-white text-sm rounded scale-80 translate-y-3">
                Agregar tarea
              </span>
            </button>
          </form>
        </Modal>
      {/* </div> */}
      {/* <h1 className="text-3xl mb-4 text-cyan-400">Dashboard</h1> */}
      

      <ul className="w-[95dvw] lg:max-w-[40dvw] p-5 space-y-4 overflow-y-scroll rounded-md shadow-xs 
      shadow-cyan-200 scrollbar-custom">
        {tasks.map((task: Task) => (
          <li key={task.id} className="p-4 rounded-2xl shadow-sm shadow-cyan-200">
            <h2 className="text-2xl text-cyan-400 underline"><strong>{task.title}</strong></h2>
            <p className='break-words text-cyan-200'>{task.description}</p>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="group relative text-red-500 mt-2"
            >
              {/* Sombra */}
              <Trash2 className="absolute text-red-600 opacity-0 filter transition-all duration-300 
              group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
              {/* Ícono Principal */}
              <Trash2 className="relative text-red-600 transition-all duration-300 group-hover:scale-120 
              group-hover:cursor-pointer" />
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
