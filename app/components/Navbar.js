'use client'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className='flex flex-col bg-[#F8F9FA] h-100vh w-52'>
            <div className='tex-sm font-bold pl-5 py-3'>Dashboard</div>
            <div className={`text-sm px-10 py-2 cursor-pointer ${pathname === '/' && 'font-semibold'}`} onClick={() => router.push('/')} >Pertanyaan</div>
            <div className={`text-sm px-10 py-2 cursor-pointer ${pathname === '/survei' && 'font-semibold'}`} onClick={() => router.push('/survei')}>Hasil Survei</div>
        </div>
    )
}

export default Navbar