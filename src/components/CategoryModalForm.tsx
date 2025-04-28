import { Check, X } from 'lucide-react';
import React from 'react';
import Modal from './Modal';

interface CategoryModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  name: string;
  setName: (name: string) => void;
  color: string;
  setColor: (color: string) => void;
  autoFocus?: boolean;
}

const CategoryModalForm: React.FC<CategoryModalFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  name,
  setName,
  color,
  setColor,
  autoFocus = true
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <form onSubmit={onSubmit} className="p-5 rounded-md shadow-2xl shadow-cyan-900 backdrop-blur-xs">
      <h2 className="text-2xl mb-4 text-cyan-400">{title}</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        className="p-2 rounded-2xl w-full mb-4 shadow-sm shadow-cyan-200 text-center"
        required
        autoFocus={autoFocus}
      />
      <input
        type="color"
        value={color}
        onChange={e => setColor(e.target.value)}
        className="w-16 h-10 mb-4 mx-auto block border-none"
      />
      <div className="flex justify-evenly">
        <button type="submit" className="p-4 mr-2 relative group hover:cursor-pointer">
          <Check className="absolute inset-0 w-full h-full text-green-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
          <Check className="absolute inset-0 w-full h-full text-green-600 transition-all duration-300 group-hover:scale-150" />
        </button>
        <button onClick={onClose} type="button" className="p-4 mr-2 relative group hover:cursor-pointer">
          <X className="absolute inset-0 w-full h-full text-red-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
          <X className="absolute inset-0 w-full h-full text-red-600 transition-all duration-300 group-hover:scale-150" />
        </button>
      </div>
    </form>
  </Modal>
);

export default CategoryModalForm;
