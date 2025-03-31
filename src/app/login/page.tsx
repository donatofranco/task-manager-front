'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Mail, KeyRound } from 'lucide-react';
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard'); // Redirige al dashboard si está autenticado
      return;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await loginUser({ email, password })

    if (res.ok) {
      login(res.token)
      router.push('/dashboard')
    } else {
      setError(res.message || 'Error en el login')
    }
  }

  return (
    <main className="h-[90vh] flex justify-center items-center text-center align-middle">
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center text-center align-middle flex-col bg-black p-2 rounded-2xl shadow-lg shadow-cyan-200 w-90"
      >
        <h2 className="text-2xl mb-4 text-cyan-400">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className='flex justify-center items-center align-middle mb-4 w-80'>
          <Mail className='m-2 text-cyan-400' />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-4 pt-1 pb-1 shadow-sm shadow-cyan-200 rounded-2xl focus:shadow-md"
          />
        </div>

        <div className='flex justify-center items-center align-middle mb-4 w-80'>
          <KeyRound className='m-2 text-cyan-400' />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-4 pt-1 pb-1 shadow-sm shadow-cyan-200 rounded-2xl focus:shadow-md"
          />
        </div>

        <button
          type="submit"
          className="w-25 bg-cyan-500/75 text-white py-2 rounded-2xl mb-4 hover:bg-cyan-300/75 hover:shadow-md hover:shadow-cyan-200 hover:cursor-pointer"
        >
          Entrar
        </button>
        <Link className='text-cyan-400 hover:text-cyan-200' href='/register'>Crear cuenta</Link>
      </form>
    </main>
  )
}
