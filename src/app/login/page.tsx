'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

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
    <main className="flex justify-center items-center h-screen text-center">
      <form
        onSubmit={handleSubmit}
        className="bg-black-400/20 p-6 rounded-2xl shadow-lg shadow-cyan-200 w-90"
      >
        <h2 className="text-2xl mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-2 shadow-sm shadow-cyan-200 rounded-2xl focus:shadow-md"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-2 shadow-sm shadow-cyan-200 rounded-2xl focus:shadow-md"
        />

        <button
          type="submit"
          className="w-full bg-cyan-500/75 text-white py-2 rounded-2xl mb-4 hover:bg-cyan-300/75 hover:shadow-md hover:shadow-cyan-200 hover:cursor-pointer"
        >
          Entrar
        </button>
        <a href='/register'>Crear cuenta</a>
      </form>
    </main>
  )
}
