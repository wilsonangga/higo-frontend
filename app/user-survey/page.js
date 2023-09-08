"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [name, setName] = useState("")
    const [listQuestion, setListQuestion] = useState([])
    const [answerList, setAnswerList] = useState([""])

    const getQuestion = () => {
        axios.get("http://localhost:3000/question").then((res) => { setListQuestion(res.data); })
    }

    const nextStep = () => {
        if (step < listQuestion.length) {
            setStep((prev) => prev += 1)
        }
    }

    const prevStep = () => {
        if (step > 1) {
            setStep((prev) => prev -= 1)
        }
    }

    const addAnswer = (e, index) => {
        const updatedAnswer = [...answerList]
        updatedAnswer[index] = e

        setAnswerList(updatedAnswer)
    }

    const submitAnswer = () => {
        axios.post("http://localhost:3000/answer", {
            name: name,
            answer: answerList
        }, {
            headers: {
                'Content-Type': 'application/json', // Set the appropriate content type for your API
                // You may need to include other headers as required by your API
            },
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Sukses',
                text: 'Survei selesai',
            }).then(() => window.location.reload());
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        getQuestion()
    }, [])

    return (
        <div className='flex justify-center items-center min-h-screen w-1/3 mx-auto'>
            {step === 0 ?
                <div className='flex flex-col gap-2 w-full'>
                    <p className='text-sm font-medium'>Nama</p>
                    <input type="text" className='bg-slate-100 outline-none py-2 px-4 text-sm rounded-sm' placeholder='Masukkan nama' value={name} onChange={(e) => setName(e.target.value)} />
                    <button className='text-sm bg-[#008CFF] text-white font-medium py-2 rounded-sm disabled:bg-slate-200 disabled:cursor-not-allowed' disabled={name === ""} onClick={() => setStep((prev) => prev += 1)}>Lanjut</button>
                </div>
                :
                <>
                    <div className="flex flex-col gap-2 w-full">
                        {step > 1 && <div className='text-xs text-[#008CFF] cursor-pointer' onClick={() => prevStep()}>&lt; Back</div>}
                        <div className='flex flex-col gap-2 w-full'>
                            <p className='text-sm font-bold'>Jawab pertanyaan</p>
                            <p className='text-xs font-semibold text-slate-400'>{step} dari {listQuestion.length}</p>
                            <p className='text-xs font-medium'>{listQuestion?.[step - 1]?.question}</p>
                            <input className='w-full outline-none bg-slate-100 text-sm px-4 py-2' value={answerList[step - 1] || ""} onChange={(e) => addAnswer(e.target.value, step - 1)} />
                            {step !== listQuestion.length ?
                                <button className='text-sm bg-[#008CFF] text-white font-medium py-2 rounded-sm disabled:bg-slate-200 disabled:cursor-not-allowed' onClick={() => nextStep()} disabled={answerList[step - 1] === "" || answerList[step - 1] === undefined}>Lanjut</button> :
                                <button className='text-sm bg-[#008CFF] text-white font-medium py-2 rounded-sm disabled:bg-slate-200 disabled:cursor-not-allowed' onClick={() => submitAnswer()} disabled={answerList[step - 1] === "" || answerList[step - 1] === undefined}>Kirim</button>}

                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Page