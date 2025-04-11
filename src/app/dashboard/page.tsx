'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchTasks, addTask, deleteTask, updateTask } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Task } from '@/types';
import { Trash2, Plus, Check, X, Pencil, Square, SquareCheckBig } from 'lucide-react';
import Modal from '@/components/Modal';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editTask, setEditTask] = useState<Task>({id: -1, title: '', description: '', completed: false});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Verificamos si ya está autenticado antes de cargar los datos
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirige al login si no está autenticado
      return;
    }

    const fetchData = async () => {
      try {
        const tasksData = await fetchTasks();
        setTasks(tasksData
          .sort((a: Task,b: Task) => {
            return  a.id - b.id;
        }));
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
      setIsCreateModalOpen(false);
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

  const handleCompleteTask = async (task: Task) => {
    try {
      await updateTask(task.id, task.title, task.description, !task.completed);
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editTask.id === -1) return;
    try {
      await updateTask(editTask.id, editTask.title, editTask.description, editTask.completed);
      setTasks(tasks.map(t => 
        t.id === editTask.id ? editTask : t
      ));
      setEditTask({id: -1, title: '', description: '', completed: false});
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <main className="text-center flex flex-col self-center items-center h-[90dvh] w-[100dvw]">
      {error && <p className="text-red-500">{error}</p>}
      <div className='absolute lg:static lg:w-full h-[5dvh] mt-4 flex justify-center items-center top-[85dvh] 
      left-[90dvw] w-[5dvw] z-10'>
        <button onClick={() => setIsCreateModalOpen(true)}
        className="relative group hover:cursor-pointer border-2 border-red-600">
          <Plus className="rounded-2xl w-10 h-10 absolute animate-pulse translate-x-[-50%] translate-y-[-50%] 
          text-green-600 filter transition-all duration-300 group-hover:opacity-100 backdrop-blur-sm
          blur-[3px] scale-140 group-hover:scale-180" />
          <Plus className="rounded-2xl w-10 h-10 absolute translate-x-[-50%] translate-y-[-50%] text-green-600 
          opacity-100 filter transition-all duration-300 group-hover:scale-140" />
        </button>
      </div>
      
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <form onSubmit={handleAddTask} className=" lg:max-w-[40dvw] p-6 rounded-md 
        shadow-2xl shadow-cyan-900 bg-black">
          <p className='text-cyan-400 p-2 text-xl'>Agregar nueva tarea</p>
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
          <div className='flex justify-evenly'>
            <button type="submit" 
            className="p-4 mr-2 relative group hover:cursor-pointer">
              <Check className='absolute inset-0 w-full h-full text-green-600 filter transition-all 
              duration-300 opacity-100 blur-[4px] group-hover:scale-150'/>
              <Check className='absolute inset-0 w-full h-full text-green-600 transition-all 
              duration-300 group-hover:scale-150'/>
              <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 px-2 py-1
              bg-gray-800 text-white text-sm rounded scale-80 translate-y-3">
                Agregar tarea
              </span>
            </button>
            <button onClick={() => setIsCreateModalOpen(false)} 
            className="p-4 mr-2 relative group hover:cursor-pointer">
              <X className='absolute inset-0 w-full h-full text-red-600 filter transition-all 
              duration-300 opacity-100 blur-[4px] group-hover:scale-150'/>
              <X className='absolute inset-0 w-full h-full text-red-600 transition-all 
              duration-300 group-hover:scale-150'/>
              <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 px-2 py-1
              bg-gray-800 text-white text-sm rounded scale-80 translate-y-3">
                Cancelar
              </span>
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <form onSubmit={handleUpdateTask} className=" lg:max-w-[40dvw] p-6 rounded-md 
        shadow-2xl shadow-cyan-900 bg-black">
          <p className='text-cyan-400 p-2 text-xl'>Editar tarea</p>
          <input
            type="text"
            placeholder="Título"
            value={editTask.title}
            onChange={(e) => setEditTask({...editTask, title: e.target.value})}
            className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200"
            required
          />
          <textarea
            placeholder="Descripción"
            value={editTask.description}
            onChange={(e) => setEditTask({...editTask, description: e.target.value})}
            className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200 max-h-[20dvh] min-h-[5dvh]"
            required
          />
          <div className='flex justify-evenly'>
            <button type="submit" 
            className="p-4 mr-2 relative group hover:cursor-pointer">
              <Check className='absolute inset-0 w-full h-full text-green-600 filter transition-all 
              duration-300 opacity-100 blur-[4px] group-hover:scale-150'/>
              <Check className='absolute inset-0 w-full h-full text-green-600 transition-all 
              duration-300 group-hover:scale-150'/>
              <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 px-2 py-1
              bg-gray-800 text-white text-sm rounded scale-80 translate-y-3">
                Agregar tarea
              </span>
            </button>
            <button onClick={() => setIsEditModalOpen(false)} 
            className="p-4 mr-2 relative group hover:cursor-pointer">
              <X className='absolute inset-0 w-full h-full text-red-600 filter transition-all 
              duration-300 opacity-100 blur-[4px] group-hover:scale-150'/>
              <X className='absolute inset-0 w-full h-full text-red-600 transition-all 
              duration-300 group-hover:scale-150'/>
              <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 px-2 py-1
              bg-gray-800 text-white text-sm rounded scale-80 translate-y-3">
                Cancelar
              </span>
            </button>
          </div>
        </form>
      </Modal>

      {tasks.length>0?
          <>
            <ul className="w-[100dvw] 2xl:max-w-[40dvw] mt-2 p-2 space-y-8 overflow-y-scroll scrollbar-custom">
              {tasks.map((task: Task) => (
                <li key={task.id} className="backdrop-blur-xs p-2 rounded-2xl shadow-xs shadow-cyan-200">
                  <h2 className="text-2xl text-cyan-400 underline"><strong>{task.title}</strong></h2>
                  <p className='break-words text-cyan-200'>{task.description}</p>
                  <div className='flex justify-center'>
                    
                  </div>
                  <div className='p-6 w-full flex justify-evenly align-middle items-center'>
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
                    <button
                      onClick={() => 
                        {
                          setEditTask(task);
                          setIsEditModalOpen(true);
                        }}
                      className="group relative text-cyan-500 mt-2"
                    >
                      {/* Sombra */}
                      <Pencil  className="absolute text-cyan-600 opacity-0 filter transition-all duration-300 
                      group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
                      {/* Ícono Principal */}
                      <Pencil  className="relative text-cyan-600 transition-all duration-300 group-hover:scale-120 
                      group-hover:cursor-pointer" />
                    </button>
                    <button
                      onClick={() => handleCompleteTask(task)}
                      className="group relative text-cyan-500 mt-2"
                    >
                      {
                        task.completed ?
                          <>
                            {/* Sombra */}
                            <Square   className="absolute text-yellow-600 opacity-0 filter transition-all duration-300 
                            group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
                            <Square   className="absolute text-yellow-600 opacity-0 filter transition-all duration-300 
                            group-hover:opacity-100 group-hover:scale-120" />
                            {/* Ícono Principal */}
                            <SquareCheckBig  className="relative text-green-600 transition-all duration-300 group-hover:scale-120 
                            group-hover:cursor-pointer group-hover:opacity-0" />
                          </>
                        :
                          <>
                            {/* Sombra */}
                            <SquareCheckBig   className="absolute text-green-600 opacity-0 filter transition-all duration-300 
                            group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
                            <SquareCheckBig   className="absolute text-green-600 opacity-0 filter transition-all duration-300 
                            group-hover:opacity-100 group-hover:scale-120" />
                            {/* Ícono Principal */}
                            <Square  className="relative text-yellow-600 transition-all duration-300 group-hover:scale-120 
                            group-hover:cursor-pointer group-hover:opacity-0" />
                          </>
                      }
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
          :
          <></>
      }
      
    </main>
  );
}
