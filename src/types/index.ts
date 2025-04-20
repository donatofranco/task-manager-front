export type Task = {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    categoryId?: number | null;
};

export type Category = {
    id: number;
    name: string;
    color: string;
    createdAt: Date;
    userId: number;
};

export type AuthContextType = {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
};