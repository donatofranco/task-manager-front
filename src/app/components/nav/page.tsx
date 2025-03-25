'use client';
import { PowerOff, Power } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Nav() {

    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    return (
        <nav className="h-[5vh] shadow-sm shadow-cyan-300/25 flex justify-around">
            <div className="p-3 flex w-full justify-start relative group">
              <h1><strong className='absolute text-cyan-400 blur-[4px] hover:cursor-pointer'><a>Task Manger</a></strong></h1>
              <h1><strong className='absolute text-cyan-400 hover:cursor-pointer'><a href='/'>Task Manger</a></strong></h1>
            </div>
            {isAuthenticated ?
                <button
                    onClick={() => {logout(); router.push('/login');}}
                    className="p-4 mr-2 relative group"
                >
                    <Power className="absolute inset-0 w-full h-full text-green-600 filter transition-all duration-300 opacity-100 blur-[4px] group-hover:opacity-0"/>
                    <Power className="absolute inset-0 w-full h-full text-green-600 transition-opacity duration-300 group-hover:opacity-0"/>
                    <PowerOff className="absolute inset-0 w-full h-full text-red-600 opacity-0 filter transition-all duration-300 group-hover:opacity-100 group-hover:blur-[4px]" />
                    <PowerOff className="absolute inset-0 w-full h-full text-red-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:cursor-pointer"/>
                </button>
            :
                <></>
            }
          </nav>
    )
}