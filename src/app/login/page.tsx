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
        className="bg-black p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-4"
        >
          Entrar
        </button>
        <a href='/register'>Crear cuenta</a>
      </form>
    </main>
  )
}
