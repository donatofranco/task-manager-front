import { fetchWithAuth } from './fetchWithAuth';
import { Task } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

//logear usuario
export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  
  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      return { ok: false, message: data.message }
    }

    return { ok: true, token: data.token }
  } catch (error: any) {
    return { ok: false, message: error.message }
  }
}

//registrar usuario
export const registerUser = async ({ email, password }: { email: string; password: string }) => {
  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      return { ok: false, message: data.message }
    }

    return { ok: true }
  } catch (error: any) {
    return { ok: false, message: error.message }
  }
}

//obtener todas las tareas del usuario
export const fetchTasks = async () => {
  return await fetchWithAuth(`${API_URL}/tasks`);
};

// Agregar una nueva tarea
export const addTask = async (title: string, description: string): Promise<Task> => {
  return await fetchWithAuth(`${API_URL}/tasks`, {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  });
};

// Eliminar una tarea
export const deleteTask = async (id: number): Promise<void> => {
  return await fetchWithAuth(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
};

export const updateTask = async (id: number, title: string, description: string, completed: boolean): Promise<void> => {
  return await fetchWithAuth(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, description, completed }),
  });
};