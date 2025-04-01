import { ReactNode } from "react";
export type Task = {
    id: number;
    title: string;
    description: string;
    completed: boolean;
};

export type AuthContextType = {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
};


export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
  }