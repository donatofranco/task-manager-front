import Modal from './Modal';
import { Trash2, X } from 'lucide-react';
import React from 'react';

interface CategoryDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmModal: React.FC<CategoryDeleteModalProps> = ({ isOpen, onClose, onConfirm: onDelete, message }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-5 rounded-md shadow-2xl shadow-cyan-900 backdrop-blur-xs">
      <h2 className="text-xl mb-4 text-cyan-400">{message}</h2>
      <div className="flex justify-evenly">
        <button onClick={onDelete} className="p-4 mr-2 relative group hover:cursor-pointer">
          <Trash2 className="absolute inset-0 w-full h-full text-red-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
          <Trash2 className="absolute inset-0 w-full h-full text-red-600 transition-all duration-300 group-hover:scale-150" />
        </button>
        <button onClick={onClose} className="p-4 mr-2 relative group hover:cursor-pointer">
          <X className="absolute inset-0 w-full h-full text-cyan-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:scale-150" />
          <X className="absolute inset-0 w-full h-full text-cyan-600 transition-all duration-300 group-hover:scale-150" />
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
