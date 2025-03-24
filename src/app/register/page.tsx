'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard'); // Redirige al dashboard si está autenticado
      return;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    const res = await registerUser({ email, password })
    setLoading(false)

    if (res.ok) {
      router.push('/login')  // Redirigir al login si el registro es exitoso
    } else {
      setError(res.message || 'Error en el registro')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen text-center">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-6 rounded-2xl shadow-lg shadow-cyan-200 w-90"
      >
        <h2 className="text-2xl mb-4">Registrar Cuenta</h2>
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

        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full mb-4 p-2 shadow-sm shadow-cyan-200 rounded-2xl focus:shadow-md"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500/75 text-white py-2 rounded-2xl hover:bg-cyan-300/75 hover:shadow-md hover:shadow-cyan-200 hover:cursor-pointer"
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  )
}
