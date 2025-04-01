'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { KeyRound, Mail } from 'lucide-react'

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
    <main className="h-[90dvh] w-[100dvw] flex justify-center items-center align-middle self-center">
      <form
        onSubmit={handleSubmit}
        className="w-[90dvw] md:w-[50dvw] xl:w-[30dvw] flex flex-col self-center justify-center items-center bg-black p-6 rounded-md 
                   shadow-2xl shadow-cyan-900 text-center"
      >
        <h2 className="text-2xl mb-4 text-cyan-400">Registrar Cuenta</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className='flex justify-center items-center align-middle mb-4 pl-6 pr-6'>
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

        <div className='flex justify-center items-center align-middle mb-4 pl-6 pr-6'>
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

        <div className='flex justify-center items-center align-middle mb-4 pl-6 pr-6'>
          <KeyRound className='m-2 text-cyan-400' />
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full pl-4 pt-1 pb-1 shadow-sm shadow-cyan-200 rounded-2xl focus:shadow-md"
          />
          </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-500 text-white p-2 rounded-2xl hover:bg-cyan-700 
                     hover:shadow-md hover:shadow-cyan-900 hover:cursor-pointer"
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </main>
  )
}
