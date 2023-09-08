"use client"
import Navbar from "@/app/components/Navbar";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Detail = () => {
    const router = useRouter()
    const pathname = usePathname();
    const [answerList, setAnswerList] = useState()

    const getAnswer = () => {
        axios.get(`http://localhost:3000/answer/${pathname.split("/")[2]}`).then((res) => setAnswerList(res.data))
    }

    useEffect(() => {
        getAnswer()
    }, [])

    return (
        <main className="flex min-h-screen">
            <Navbar />
            <div className='px-4 py-6 w-full'>
                <div className="text-xs font-semibold text-[#008CFF] cursor-pointer mb-2" onClick={() => router.push('/survei')}>&lt; Kembali</div>
                <h1 className='font-bold text-xl mb-4'>Detail Survei</h1>
                <p className="text-sm font-semibold mb-2">Nama : {answerList?.name}</p>
                <ol className="list-decimal pl-4">
                    {answerList?.answer?.map((item, index) => {
                        return (
                            <li key={index}>
                                <p className="text-sm font-semibold">{answerList?.question?.[index]}</p>
                                <p className="text-sm font-semibold">{item}</p>
                            </li>
                        )
                    })}
                </ol>
            </div>
        </main>
    )
}

export default Detail;
