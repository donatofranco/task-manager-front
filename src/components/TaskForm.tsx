import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import SelectCategoria from './SelectCategoria';
import { Category } from '@/types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  taskTitle: string;
  setTaskTitle: (title: string) => void;
  taskDescription: string;
  setTaskDescription: (desc: string) => void;
  categoryId: number | null;
  setCategoryId: (id: number | null) => void;
  categories: Category[];
  setEditCategoryId: (id: number | null) => void;
  setEditCategoryName: (name: string) => void;
  setEditCategoryColor: (color: string) => void;
  setIsEditCategoryModalOpen: (open: boolean) => void;
  setDeleteCategoryId: (id: number | null) => void;
  setIsCreateCategoryModalOpen: (open: boolean) => void;
  autoFocus?: boolean;
  descriptionRef?: React.RefObject<HTMLTextAreaElement>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  categoryId,
  setCategoryId,
  categories,
  setEditCategoryId,
  setEditCategoryName,
  setEditCategoryColor,
  setIsEditCategoryModalOpen,
  setDeleteCategoryId,
  setIsCreateCategoryModalOpen,
  autoFocus = true,
  descriptionRef
}) => {
  // Focus textarea al abrir modal de editar
  useEffect(() => {
    if (isOpen && descriptionRef && descriptionRef.current) {
      descriptionRef.current.focus();
      const length = descriptionRef.current.value.length;
      descriptionRef.current.setSelectionRange(length, length);
    }
  }, [isOpen, descriptionRef]);

  return (
    <form onSubmit={onSubmit} className="lg:max-w-[40dvw] p-5 rounded-md shadow-2xl shadow-cyan-900 backdrop-blur-xs">
      <h2 className="text-2xl mb-4 text-cyan-400">{title}</h2>
      <input
        type="text"
        placeholder="Título"
        value={taskTitle}
        onChange={e => setTaskTitle(e.target.value)}
        className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200 text-center"
        required
        autoFocus={autoFocus}
      />
      <textarea
        placeholder="Descripción"
        value={taskDescription}
        onChange={e => setTaskDescription(e.target.value)}
        className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200 max-h-[20dvh] min-h-[5dvh] text-center"
        required
        ref={descriptionRef}
      />
      <SelectCategoria
        value={categoryId}
        onChange={setCategoryId}
        categories={categories}
        setEditCategoryId={setEditCategoryId}
        setEditCategoryName={setEditCategoryName}
        setEditCategoryColor={setEditCategoryColor}
        setIsEditCategoryModalOpen={setIsEditCategoryModalOpen}
        setDeleteCategoryId={setDeleteCategoryId}
        setIsCreateCategoryModalOpen={setIsCreateCategoryModalOpen}
      />
      <div className='flex justify-evenly'>
        <button type="submit" className="p-4 mr-2 relative group hover:cursor-pointer">
          <Check className='absolute inset-0 w-full h-full text-green-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150'/>
          <Check className='absolute inset-0 w-full h-full text-green-600 transition-all duration-300 group-hover:scale-150'/>
        </button>
        <button onClick={onClose} type="button" className="p-4 mr-2 relative group hover:cursor-pointer">
          <X className='absolute inset-0 w-full h-full text-red-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150'/>
          <X className='absolute inset-0 w-full h-full text-red-600 transition-all duration-300 group-hover:scale-150'/>
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
