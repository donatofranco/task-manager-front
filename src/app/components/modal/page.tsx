import { ModalProps } from "@/types";

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* <div className="border-2 rounded-2xl p-6 shadow-xl w-full max-w-md"> */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✖
        </button>
        {children}
      {/* </div> */}
    </div>
  );
};
