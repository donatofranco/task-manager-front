import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        className="absolute top-2 right-2 text-cyan-400 hover:text-cyan-200 hover:cursor-pointer"
        onClick={onClose}
      >
        ✖
      </button>
      {children}
    </div>
  );
};

export default Modal;