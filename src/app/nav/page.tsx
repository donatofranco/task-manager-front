'use client';
import { LogOut, LogIn, Rocket } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Nav() {

    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    return (
        <nav className="backdrop-blur-xs h-[5dvh] min-h-[5dvh] shadow-sm shadow-cyan-300/25 ">
            <section className="flex justify-center group">
              <div onClick={() => router.push('/')} 
              className='flex absolute text-cyan-400 blur-[4px] font-bold hover:cursor-pointer'>
                <p className='text-[clamp(5vdh,5vdh,5vdh)]'>TASKRONAUT</p>
                <Rocket className="max-h-[5dvh] h-[3dvh] aspect-[1/1]"></Rocket>
              </div>
              <div onClick={() => router.push('/')}
              className='flex absolute text-cyan-400 font-bold hover:cursor-pointer'>
                <p className='text-[clamp(5vdh,5vdh,5vdh)]'>TASKRONAUT</p>
                <Rocket className="max-h-[5dvh] h-[3dvh] aspect-[1/1]"></Rocket>
              </div>
            </section>
            {isAuthenticated ?
                <section className='absolute top-[0.5dvh] right-[4dvh]'>
                    <button
                        onClick={() => {logout(); router.push('/login');}}
                        className="h-[4dvh] w-[4dvh] relative group"
                    >
                        <LogIn className="absolute inset-0 w-full h-full text-cyan-600 filter transition-all duration-1000 opacity-100 blur-[4px] group-hover:opacity-0"/>
                        <LogIn className="absolute inset-0 w-full h-full text-cyan-600 transition-all duration-1000 group-hover:opacity-0"/>
                        <LogOut className="absolute inset-0 w-full h-full text-red-600 opacity-0 filter transition-all duration-1000 group-hover:opacity-100 group-hover:blur-[4px]" />
                        <LogOut className="absolute inset-0 w-full h-full text-red-600 opacity-0 transition-all duration-1000 group-hover:opacity-100 group-hover:cursor-pointer"/>
                    </button>
                </section>
            :
                <></>
            }
          </nav>
    )
}