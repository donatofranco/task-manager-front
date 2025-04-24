'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { fetchTasks, addTask, deleteTask, updateTask, fetchCategories, addCategory, updateCategory, deleteCategory } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Task, Category } from '@/types';
import { Trash2, Plus, Check, X, Pencil, Square, SquareCheckBig, Calendar, History, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from '@/components/Modal';
import Loading from '../loading/page';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskCategoryId, setNewTaskCategoryId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editTask, setEditTask] = useState<Task>({
    id: -1, 
    title: '', 
    description: '', 
    completed: false, 
    createdAt: new Date(), 
    updatedAt: new Date()
  });
  const [editTaskCategoryId, setEditTaskCategoryId] = useState<number | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Modales para categorías desde dashboard
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#00d3f3');
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryColor, setEditCategoryColor] = useState('#00d3f3');

  // Eliminar categoría desde dashboard
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

  async function validateAuth(auth: boolean) {
    if (!auth) {
      router.push('/login'); // Redirige al login si no está autenticado
      return;
    }
  }

  // Verificamos si ya está autenticado antes de cargar los datos
  useEffect(() => {
    validateAuth(isAuthenticated);

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

    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error: any) {
        // No es crítico, solo loguear
        console.error(error.message);
      }
    };
    fetchCategoriesData();

    if (isEditModalOpen && descriptionRef.current) {
      // Hacer focus y mover el cursor al final
      const el = descriptionRef.current;
      el.focus();
      const length = el.value.length;
      el.setSelectionRange(length, length);
    }
  }, [isAuthenticated, router, isEditModalOpen]); // Dependemos de isAuthenticated para no hacer llamadas innecesarias

  validateAuth(isAuthenticated);

  if (loading) {
    return <Loading></Loading>;
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle || !newTaskDescription) return;
    try {
      const newTask = await addTask(newTaskTitle, newTaskDescription, newTaskCategoryId);
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskCategoryId(null);
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
        t.id === task.id ? { ...t, completed: !t.completed, updatedAt: new Date() } : t
      ));
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editTask.id === -1) return;
    try {
      await updateTask(editTask.id, editTask.title, editTask.description, editTask.completed, editTaskCategoryId);
      setTasks(tasks.map(t => 
        t.id === editTask.id ? { ...editTask, categoryId: editTaskCategoryId } : t
      ));
      setEditTask({id: -1, title: '', description: '', completed: false, createdAt: new Date(), updatedAt: new Date()});
      setEditTaskCategoryId(null);
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // Crear categoría desde dashboard
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cat = await addCategory(newCategoryName, newCategoryColor);
      setCategories([...categories, cat]);
      setNewCategoryName('');
      setNewCategoryColor('#00d3f3');
      setIsCreateCategoryModalOpen(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Editar categoría desde dashboard
  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategoryId) return;
    try {
      const updated = await updateCategory(editCategoryId, editCategoryName, editCategoryColor);
      setCategories(categories.map(c => c.id === updated.id ? updated : c));
      setIsEditCategoryModalOpen(false);
      setEditCategoryId(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  // handleDeleteCategory debe eliminar la categoría y cerrar el modal
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      setDeleteCategoryId(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Componente SelectCategoria personalizado
  function SelectCategoria({ value, onChange, categories, ...props }: {
    value: number | null;
    onChange: (id: number | null) => void;
    categories: Category[];
    [key: string]: any;
  }) {
    const [open, setOpen] = useState(false);
    const selected = categories.find(c => c.id === value);
  
    // Acciones para editar/eliminar desde el select
    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (selected) {
        setEditCategoryId(selected.id);
        setEditCategoryName(selected.name);
        setEditCategoryColor(selected.color);
        setIsEditCategoryModalOpen(true);
      }
    };
    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (selected) {
        setEditCategoryId(null);
        setDeleteCategoryId(selected.id);
      }
    };

    return (
      <div className="relative w-full mb-4">
        <button
          type="button"
          className="p-2 rounded-2xl w-full shadow-sm shadow-cyan-200 text-center flex items-center justify-between"
          style={{ background: selected ? hexToRgba(selected.color, 0.7) : 'transparent', color: selected ? getContrastColor(selected.color) : '#ededed' }}
          onClick={() => setOpen(o => !o)}
        >
          <span className="flex-1 text-left">{selected ? selected.name : 'Sin categoría'}</span>
          <span className="flex items-center gap-1 ml-2">
            {selected && (
              <>
                <Pencil className="w-4 h-4 hover:text-cyan-300 cursor-pointer" onClick={handleEdit} />
                <Trash2 className="w-4 h-4 hover:text-red-400 cursor-pointer" onClick={handleDelete} />
              </>
            )}
            {open ? <ChevronUp className="w-4 h-4 cursor-pointer" /> : <ChevronDown className="w-4 h-4 cursor-pointer" />}
          </span>
        </button>
        {open && (
          <ul className="absolute z-50 w-full mt-1 rounded-2xl shadow-lg bg-black/80 backdrop-blur p-1 max-h-48 overflow-y-auto">
            <li
              className="p-2 rounded cursor-pointer hover:bg-cyan-800 text-foreground"
              style={{ background: 'transparent', color: '#ededed' }}
              onClick={() => { onChange(null); setOpen(false); }}
            >
              Sin categoría
            </li>
            <li
              className="p-2 rounded cursor-pointer hover:bg-cyan-700 text-cyan-300 font-bold border-b border-cyan-700"
              style={{ background: 'rgba(0,212,243,0.15)' }}
              onClick={() => { setOpen(false); setIsCreateCategoryModalOpen(true); }}
            >
              + Nueva categoría
            </li>
            {categories.map(cat => (
              <li
                key={cat.id}
                className="p-2 rounded cursor-pointer hover:brightness-110"
                style={{
                  background: hexToRgba(cat.color, 0.7),
                  color: getContrastColor(cat.color)
                }}
                onClick={() => { onChange(cat.id); setOpen(false); }}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Agregar función utilitaria para contraste
  function getContrastColor(hex: string) {
    // Quitar # si existe
    hex = hex.replace('#', '');
    // Convertir a RGB
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    // Calcular luminancia
    const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
    return luminance > 0.5 ? '#222' : '#fff';
  }

  // Utilidad para convertir hex a rgba con alpha
  function hexToRgba(hex: string, alpha: number) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  return (
    <main className="text-center flex flex-col self-center items-center h-[90dvh] w-[100dvw]">
      {!(isCreateModalOpen || isEditModalOpen) ?
        <>
          {error && <p className="text-red-500">{error}</p>}
          <div className='absolute lg:static lg:w-full h-[5dvh] mt-4 flex justify-center items-center 
          top-[85dvh] left-[90dvw] w-[5dvw] z-10'>
            <button onClick={() => setIsCreateModalOpen(true)}
            className="relative group hover:cursor-pointer border-2 border-red-600">
              <Plus className="rounded-2xl w-10 h-10 absolute animate-pulse translate-x-[-50%] 
              translate-y-[-50%] text-green-600 filter transition-all duration-300 group-hover:opacity-100 
              backdrop-blur-sm blur-[3px] scale-140 group-hover:scale-180" />
              <Plus className="rounded-2xl w-10 h-10 absolute translate-x-[-50%] translate-y-[-50%] 
              text-green-600 opacity-100 filter transition-all duration-300 group-hover:scale-140" />
            </button>
          </div>
          {tasks.length > 0 ?
            <>
              <ul className="w-[100dvw] lg:max-w-[60vw] 2xl:max-w-[40dvw] mt-2 p-2 space-y-8 overflow-y-scroll 
              scrollbar-custom">
                {tasks.map((task: Task) => {
                  const category = categories.find(c => c.id === task.categoryId);
                  return (
                    <li key={task.id} className="backdrop-blur-xs p-2 rounded-2xl shadow-xs shadow-cyan-200">
                      <h2 className="text-2xl text-cyan-400 underline"><strong>{task.title}</strong></h2>
                      <p className='break-words text-cyan-200 p-6'>{task.description}</p>
                      {category && (
                        <span
                          className="inline-block px-2 py-1 rounded text-xs mb-2"
                          style={{
                            background: hexToRgba(category.color, 0.7),
                            color: getContrastColor(category.color)
                          }}
                        >
                          {category.name}
                        </span>
                      )}
                      <div className='flex justify-center gap-4'>
                        <p className='flex justify-center items-center gap-0.5 text-muted-foreground 
                        text-cyan-200/50 text-xs'>
                          <Calendar className='w-3.5 h-3.5'></Calendar>
                          {new Date(task.createdAt).toLocaleDateString(navigator.language, {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}</p>
                        <p className='flex justify-center items-center gap-0.5 text-muted-foreground 
                        text-cyan-200/50 text-xs'>
                          <History className='w-3.5 h-3.5'></History>
                          {new Date(task.updatedAt).toLocaleDateString(navigator.language, {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}</p>
                      </div>
                      <div className='p-1 w-full flex justify-evenly align-middle items-center'>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="group relative text-red-500 mt-2"
                        >
                          {/* Sombra */}
                          <Trash2 className="absolute text-red-600 opacity-0 filter transition-all duration-300 
                          group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
                          {/* Ícono Principal */}
                          <Trash2 className="relative text-red-600 transition-all duration-300 
                          group-hover:scale-120 group-hover:cursor-pointer" />
                        </button>
                        <button
                          onClick={() => 
                            {
                              setEditTask(task);
                              setEditTaskCategoryId(task.categoryId ?? null);
                              setIsEditModalOpen(true);
                            }}
                          className="group relative text-cyan-500 mt-2"
                        >
                          {/* Sombra */}
                          <Pencil  className="absolute text-cyan-600 opacity-0 filter transition-all 
                          duration-300 group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
                          {/* Ícono Principal */}
                          <Pencil  className="relative text-cyan-600 transition-all duration-300 
                          group-hover:scale-120 group-hover:cursor-pointer" />
                        </button>
                        <button
                          onClick={() => handleCompleteTask(task)}
                          className="group relative text-cyan-500 mt-2"
                        >
                          {
                            task.completed ?
                              <>
                                {/* Sombra */}
                                <Square   className="absolute text-yellow-600 opacity-0 filter transition-all 
                                duration-300 group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
                                <Square   className="absolute text-yellow-600 opacity-0 filter transition-all 
                                duration-300 group-hover:opacity-100 group-hover:scale-120" />
                                {/* Ícono Principal */}
                                <SquareCheckBig  className="relative text-green-600 transition-all duration-300 
                                group-hover:scale-120 group-hover:cursor-pointer group-hover:opacity-0" />
                              </>
                            :
                              <>
                                {/* Sombra */}
                                <SquareCheckBig   className="absolute text-green-600 opacity-0 filter 
                                transition-all duration-300 group-hover:opacity-100 group-hover:blur-[4px] 
                                group-hover:scale-120" />
                                <SquareCheckBig   className="absolute text-green-600 opacity-0 filter 
                                transition-all duration-300 group-hover:opacity-100 group-hover:scale-120" />
                                {/* Ícono Principal */}
                                <Square  className="relative text-yellow-600 transition-all duration-300 
                                group-hover:scale-120 group-hover:cursor-pointer group-hover:opacity-0" />
                              </>
                          }
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
            :
            <></>
          }
        </>
        :
        <>
        <Modal isOpen={isCreateModalOpen && !isCreateCategoryModalOpen && !isEditCategoryModalOpen && !deleteCategoryId} onClose={() => setIsCreateModalOpen(false)}>
            <form onSubmit={handleAddTask} className=" lg:max-w-[40dvw] p-5 rounded-md 
            shadow-2xl shadow-cyan-900 backdrop-blur-xs">
              <h2 className="text-2xl mb-4 text-cyan-400">Agregar nueva tarea</h2>
              <input
                type="text"
                placeholder="Título nueva tarea"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200 text-center"
                required
                autoFocus
              />
              <textarea
                placeholder="Descripción nueva tarea"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200 max-h-[20dvh] 
                min-h-[5dvh] text-center"
                required
              />
              <SelectCategoria
                value={newTaskCategoryId}
                onChange={setNewTaskCategoryId}
                categories={categories}
              />
              <div className='flex justify-evenly'>
                <button type="submit" 
                className="p-4 mr-2 relative group hover:cursor-pointer">
                  <Check className='absolute inset-0 w-full h-full text-green-600 filter transition-all 
                  duration-300 opacity-100 blur-[4px] group-hover:scale-150'/>
                  <Check className='absolute inset-0 w-full h-full text-green-600 transition-all 
                  duration-300 group-hover:scale-150'/>
                </button>
                <button onClick={() => setIsCreateModalOpen(false)} 
                className="p-4 mr-2 relative group hover:cursor-pointer">
                  <X className='absolute inset-0 w-full h-full text-red-600 filter transition-all 
                  duration-300 opacity-100 blur-[4px] group-hover:scale-150'/>
                  <X className='absolute inset-0 w-full h-full text-red-600 transition-all 
                  duration-300 group-hover:scale-150'/>
                </button>
              </div>
            </form>
          </Modal>
          <Modal isOpen={isEditModalOpen && !isCreateCategoryModalOpen && !isEditCategoryModalOpen && !deleteCategoryId} onClose={() => setIsEditModalOpen(false)}>
            <form onSubmit={handleUpdateTask} className=" lg:max-w-[40dvw] p-5 rounded-md 
            shadow-2xl shadow-cyan-900 backdrop-blur-xs">
              <h2 className="text-2xl mb-4 text-cyan-400">Editar tarea</h2>
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
                ref={descriptionRef}
              />
              <SelectCategoria
                value={editTaskCategoryId}
                onChange={setEditTaskCategoryId}
                categories={categories}
              />
              <div className='flex justify-evenly'>
                <button type="submit" 
                className="p-4 mr-2 relative group hover:cursor-pointer">
                  <Check className='absolute inset-0 w-full h-full text-green-600 filter transition-all 
                  duration-300 opacity-100 blur-[4px] group-hover:scale-150'/>
                  <Check className='absolute inset-0 w-full h-full text-green-600 transition-all 
                  duration-300 group-hover:scale-150'/>
                </button>
                <button onClick={() => setIsEditModalOpen(false)} 
                className="p-4 mr-2 relative group hover:cursor-pointer">
                  <X className='absolute inset-0 w-full h-full text-red-600 filter transition-all 
                  duration-300 opacity-100 blur-[4px] group-hover:scale-150'/>
                  <X className='absolute inset-0 w-full h-full text-red-600 transition-all 
                  duration-300 group-hover:scale-150'/>
                </button>
              </div>
            </form>
          </Modal>
        </>
      }
      {/* Modal crear categoría desde dashboard */}
      <Modal isOpen={isCreateCategoryModalOpen} onClose={() => setIsCreateCategoryModalOpen(false)}>
        <form onSubmit={handleCreateCategory} className="p-5 rounded-md shadow-2xl shadow-cyan-900 backdrop-blur-xs">
          <h2 className="text-2xl mb-4 text-cyan-400">Nueva Categoría</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200 text-center"
            required
            autoFocus
          />
          <input
            type="color"
            value={newCategoryColor}
            onChange={e => setNewCategoryColor(e.target.value)}
            className="w-16 h-10 mb-4 mx-auto block border-none"
          />
          <div className="flex justify-evenly">
            <button type="submit" className="p-4 mr-2 relative group hover:cursor-pointer">
              <Check className="absolute inset-0 w-full h-full text-green-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <Check className="absolute inset-0 w-full h-full text-green-600 transition-all duration-300 group-hover:scale-150" />
            </button>
            <button onClick={() => setIsCreateCategoryModalOpen(false)} type="button" className="p-4 mr-2 relative group hover:cursor-pointer">
              <X className="absolute inset-0 w-full h-full text-red-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <X className="absolute inset-0 w-full h-full text-red-600 transition-all duration-300 group-hover:scale-150" />
            </button>
          </div>
        </form>
      </Modal>
      {/* Modal editar categoría desde dashboard */}
      <Modal isOpen={isEditCategoryModalOpen} onClose={() => setIsEditCategoryModalOpen(false)}>
        <form onSubmit={handleEditCategory} className="p-5 rounded-md shadow-2xl shadow-cyan-900 backdrop-blur-xs">
          <h2 className="text-2xl mb-4 text-cyan-400">Editar Categoría</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={editCategoryName}
            onChange={e => setEditCategoryName(e.target.value)}
            className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200 text-center"
            required
            autoFocus
          />
          <input
            type="color"
            value={editCategoryColor}
            onChange={e => setEditCategoryColor(e.target.value)}
            className="w-16 h-10 mb-4 mx-auto block border-none"
          />
          <div className="flex justify-evenly">
            <button type="submit" className="p-4 mr-2 relative group hover:cursor-pointer">
              <Check className="absolute inset-0 w-full h-full text-green-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <Check className="absolute inset-0 w-full h-full text-green-600 transition-all duration-300 group-hover:scale-150" />
            </button>
            <button onClick={() => setIsEditCategoryModalOpen(false)} type="button" className="p-4 mr-2 relative group hover:cursor-pointer">
              <X className="absolute inset-0 w-full h-full text-red-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <X className="absolute inset-0 w-full h-full text-red-600 transition-all duration-300 group-hover:scale-150" />
            </button>
          </div>
        </form>
      </Modal>
      {/* Modal eliminar categoría desde dashboard */}
      <Modal isOpen={deleteCategoryId !== null} onClose={() => setDeleteCategoryId(null)}>
        <div className="p-5 rounded-md shadow-2xl shadow-cyan-900 backdrop-blur-xs">
          <h2 className="text-xl mb-4 text-cyan-400">¿Eliminar esta categoría?</h2>
          <div className="flex justify-evenly">
            <button onClick={() => deleteCategoryId && handleDeleteCategory(deleteCategoryId)} className="p-4 mr-2 relative group hover:cursor-pointer">
              <Trash2 className="absolute inset-0 w-full h-full text-red-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <Trash2 className="absolute inset-0 w-full h-full text-red-600 transition-all duration-300 group-hover:scale-150" />
            </button>
            <button onClick={() => setDeleteCategoryId(null)} className="p-4 mr-2 relative group hover:cursor-pointer">
              <X className="absolute inset-0 w-full h-full text-cyan-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
              <X className="absolute inset-0 w-full h-full text-cyan-600 transition-all duration-300 group-hover:scale-150" />
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
