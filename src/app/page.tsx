'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
      if (isAuthenticated) {
        router.push('/dashboard'); // Redirige al dashboard si está autenticado
        return;
      } else {
        router.push('/login'); // Redirige al login si no está autenticado
        return;
      }
    });

  return (
    <main className='h-[90dvh]'>
    </main>
  );
}
