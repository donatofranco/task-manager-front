'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { fetchTasks, addTask, deleteTask, updateTask, fetchCategories, addCategory, updateCategory, deleteCategory } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Task, Category } from '@/types';
import Modal from '@/components/Modal';
import Loading from '../loading/page';
import CategoryModalForm from '@/components/CategoryModalForm';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import { Plus } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

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
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

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
    setDeleteTaskId(id);
  };
  const confirmDeleteTask = async () => {
    if (deleteTaskId === null) return;
    try {
      await deleteTask(deleteTaskId);
      setTasks(tasks.filter(task => task.id !== deleteTaskId));
      setDeleteTaskId(null);
    } catch (error: any) {
      setError(error.message);
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

  return (
    <main className="text-center flex flex-col self-center items-center h-[90dvh] w-[100dvw]">
      {!(isCreateModalOpen || isEditModalOpen || deleteTaskId) ?
        <>
          {error && <p className="text-red-500">{error}</p>}
          <div className='absolute lg:static lg:w-full h-[5dvh] mt-4 flex justify-center items-center top-[85dvh] left-[90dvw] w-[5dvw] z-10'>
            <button onClick={() => setIsCreateModalOpen(true)}
              className="relative group hover:cursor-pointer border-2 border-red-600">
              <Plus className="rounded-2xl w-10 h-10 absolute animate-pulse translate-x-[-50%] translate-y-[-50%] text-green-600 filter transition-all duration-300 group-hover:opacity-100 backdrop-blur-sm blur-[3px] scale-140 group-hover:scale-180" />
              <Plus className="rounded-2xl w-10 h-10 absolute translate-x-[-50%] translate-y-[-50%] text-green-600 opacity-100 filter transition-all duration-300 group-hover:scale-140" />
            </button>
          </div>
          {tasks.length > 0 && (
            <TaskList
              tasks={tasks}
              categories={categories}
              onDelete={handleDeleteTask}
              onEdit={(task) => {
                setEditTask(task);
                setEditTaskCategoryId(task.categoryId ?? null);
                setIsEditModalOpen(true);
              }}
              onComplete={handleCompleteTask}
            />
          )}
        </>
        :
        <>
          <Modal isOpen={isCreateModalOpen && !isCreateCategoryModalOpen && !isEditCategoryModalOpen && !deleteCategoryId} onClose={() => setIsCreateModalOpen(false)}>
            <TaskForm
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleAddTask}
              title="Agregar nueva tarea"
              taskTitle={newTaskTitle}
              setTaskTitle={setNewTaskTitle}
              taskDescription={newTaskDescription}
              setTaskDescription={setNewTaskDescription}
              categoryId={newTaskCategoryId}
              setCategoryId={setNewTaskCategoryId}
              categories={categories}
              setEditCategoryId={setEditCategoryId}
              setEditCategoryName={setEditCategoryName}
              setEditCategoryColor={setEditCategoryColor}
              setIsEditCategoryModalOpen={setIsEditCategoryModalOpen}
              setDeleteCategoryId={setDeleteCategoryId}
              setIsCreateCategoryModalOpen={setIsCreateCategoryModalOpen}
            />
          </Modal>
          <Modal isOpen={isEditModalOpen && !isCreateCategoryModalOpen && !isEditCategoryModalOpen && !deleteCategoryId} onClose={() => setIsEditModalOpen(false)}>
            <TaskForm
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={handleUpdateTask}
              title="Editar tarea"
              taskTitle={editTask.title}
              setTaskTitle={title => setEditTask({ ...editTask, title })}
              taskDescription={editTask.description}
              setTaskDescription={desc => setEditTask({ ...editTask, description: desc })}
              categoryId={editTaskCategoryId}
              setCategoryId={setEditTaskCategoryId}
              categories={categories}
              setEditCategoryId={setEditCategoryId}
              setEditCategoryName={setEditCategoryName}
              setEditCategoryColor={setEditCategoryColor}
              setIsEditCategoryModalOpen={setIsEditCategoryModalOpen}
              setDeleteCategoryId={setDeleteCategoryId}
              setIsCreateCategoryModalOpen={setIsCreateCategoryModalOpen}
            />
          </Modal>
        </>
      }
      {/* Modal crear categoría desde dashboard */}
      <CategoryModalForm
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
        title="Nueva Categoría"
        name={newCategoryName}
        setName={setNewCategoryName}
        color={newCategoryColor}
        setColor={setNewCategoryColor}
      />
      {/* Modal editar categoría desde dashboard */}
      <CategoryModalForm
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        onSubmit={handleEditCategory}
        title="Editar Categoría"
        name={editCategoryName}
        setName={setEditCategoryName}
        color={editCategoryColor}
        setColor={setEditCategoryColor}
      />
      {/* Modal eliminar categoría desde dashboard */}
      <ConfirmModal
        isOpen={deleteCategoryId !== null}
        onClose={() => setDeleteCategoryId(null)}
        onConfirm={() => deleteCategoryId && handleDeleteCategory(deleteCategoryId)}
        message='¿Eliminar esta categoría?'
      />
      <ConfirmModal
        isOpen={deleteTaskId !== null}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={confirmDeleteTask}
        message="¿Eliminar esta tarea?"
      />
    </main>
  );
}
