import { Task, Category } from '@/types';
import { Calendar, History, Trash2, Pencil, Square, SquareCheckBig } from 'lucide-react';
import React from 'react';
import { getContrastColor, hexToRgba } from '@/utils/color';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onComplete: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, categories, onDelete, onEdit, onComplete }) => (
  <ul className="w-[100dvw] lg:max-w-[60vw] 2xl:max-w-[40dvw] mt-2 p-2 space-y-8 overflow-y-scroll scrollbar-custom">
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
            <p className='flex justify-center items-center gap-0.5 text-muted-foreground text-cyan-200/50 text-xs'>
              <Calendar className='w-3.5 h-3.5'></Calendar>
              {new Date(task.createdAt).toLocaleDateString(navigator.language, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </p>
            <p className='flex justify-center items-center gap-0.5 text-muted-foreground text-cyan-200/50 text-xs'>
              <History className='w-3.5 h-3.5'></History>
              {new Date(task.updatedAt).toLocaleDateString(navigator.language, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </p>
          </div>
          <div className='p-1 w-full flex justify-evenly align-middle items-center'>
            <button
              onClick={() => onDelete(task.id)}
              className="group relative text-red-500 mt-2"
            >
              <Trash2 className="absolute text-red-600 opacity-0 filter transition-all duration-300 group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
              <Trash2 className="relative text-red-600 transition-all duration-300 group-hover:scale-120 group-hover:cursor-pointer" />
            </button>
            <button
              onClick={() => onEdit(task)}
              className="group relative text-cyan-500 mt-2"
            >
              <Pencil className="absolute text-cyan-600 opacity-0 filter transition-all duration-300 group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
              <Pencil className="relative text-cyan-600 transition-all duration-300 group-hover:scale-120 group-hover:cursor-pointer" />
            </button>
            <button
              onClick={() => onComplete(task)}
              className="group relative text-cyan-500 mt-2"
            >
              {task.completed ? (
                <>
                  <Square className="absolute text-yellow-600 opacity-0 filter transition-all duration-300 group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
                  <Square className="absolute text-yellow-600 opacity-0 filter transition-all duration-300 group-hover:opacity-100 group-hover:scale-120" />
                  <SquareCheckBig className="relative text-green-600 transition-all duration-300 group-hover:scale-120 group-hover:cursor-pointer group-hover:opacity-0" />
                </>
              ) : (
                <>
                  <SquareCheckBig className="absolute text-green-600 opacity-0 filter transition-all duration-300 group-hover:opacity-100 group-hover:blur-[4px] group-hover:scale-120" />
                  <SquareCheckBig className="absolute text-green-600 opacity-0 filter transition-all duration-300 group-hover:opacity-100 group-hover:scale-120" />
                  <Square className="relative text-yellow-600 transition-all duration-300 group-hover:scale-120 group-hover:cursor-pointer group-hover:opacity-0" />
                </>
              )}
            </button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default TaskList;
