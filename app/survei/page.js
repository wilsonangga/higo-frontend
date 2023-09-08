"use client"
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Survei = () => {
    const router = useRouter();
    const [answerList, setAnswerList] = useState([])

    const getAnswer = () => {
        axios.get("http://localhost:3000/answer").then((res) => setAnswerList(res.data)).catch((err) => console.log(err))
    }

    useEffect(() => {
        getAnswer()
    }, [])

    return (
        <main className="flex min-h-screen">
            <Navbar />
            <div className='px-4 py-6 w-full'>
                <h1 className='font-bold text-xl'>Hasil Survei</h1>

                <div className='table w-full mt-5'>
                    <div className='flex border-b w-full table-head py-2'>
                        <div className='flex-[0.2] font-medium text-sm'>No</div>
                        <div className='flex-[0.6] font-medium text-sm'>Nama</div>
                        <div className='flex-[0.2] font-medium text-sm'>Aksi</div>
                    </div>
                    {answerList?.map((item, index) => {
                        return (
                            <div className="flex table-body py-2" key={index}>
                                <div className='flex-[0.2] font-medium text-sm'>{index + 1}</div>
                                <div className='flex-[0.6] font-medium text-sm'>{item?.name}</div>
                                <div className='flex-[0.2] font-medium text-sm text-[#008CFF] cursor-pointer' onClick={() => router.push(`/survei/${item?._id}`)}>Lihat</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}

export default Survei;
