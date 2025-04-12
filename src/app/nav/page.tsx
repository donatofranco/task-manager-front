'use client';
import { LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Nav() {

    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    return (
        <nav className="backdrop-blur-xs h-[5dvh] shadow-sm shadow-cyan-300/25 flex justify-around">
            <div className="p-3 flex w-full justify-start relative group">
              <h1><strong className='absolute text-cyan-400 blur-[4px] hover:cursor-pointer'><Link href='/'>Task Manger</Link></strong></h1>
              <h1><strong className='absolute text-cyan-400 hover:cursor-pointer'><Link href='/'>Task Manger</Link></strong></h1>
            </div>
            {isAuthenticated ?
                <button
                    onClick={() => {logout(); router.push('/login');}}
                    className="p-4 mr-2 relative group"
                >
                    <LogIn className="absolute inset-0 w-full h-full text-cyan-600 filter transition-all duration-1000 opacity-100 blur-[4px] group-hover:opacity-0"/>
                    <LogIn className="absolute inset-0 w-full h-full text-cyan-600 transition-all duration-1000 group-hover:opacity-0"/>
                    <LogOut className="absolute inset-0 w-full h-full text-red-600 opacity-0 filter transition-all duration-1000 group-hover:opacity-100 group-hover:blur-[4px]" />
                    <LogOut className="absolute inset-0 w-full h-full text-red-600 opacity-0 transition-all duration-1000 group-hover:opacity-100 group-hover:cursor-pointer"/>
                </button>
            :
                <></>
            }
          </nav>
    )
}