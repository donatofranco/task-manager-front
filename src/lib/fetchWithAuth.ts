import { logout } from '@/context/AuthContext';

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = localStorage.getItem('token');

  if (!token) {
    logout(); // Si no hay token, cerramos sesión directamente
    throw new Error('No hay token');
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Asumimos JSON, podés cambiarlo si hace falta
    },
  });

  // Si el token expiró o es inválido
  if (res.status === 401) {
    const data = await res.json();

    if (data.error === 'Token expirado' || data.error === 'Token inválido') {
      logout(); // Cerramos sesión y redirigimos
      throw new Error(data.error);
    }

    throw new Error('No autorizado');
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Algo salió mal');
  }

  // Si todo va bien
  return res.json();
};
