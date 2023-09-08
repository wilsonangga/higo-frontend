"use client"
import Navbar from './components/Navbar'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import clipboardCopy from 'clipboard-copy';

const Modal = ({ isOpen, onClose, typeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeModal, setTypeModal] = useState("add")
  const [question, setQuestion] = useState("")
  const [listQuestion, setListQuestion] = useState()
  const [selectedQuestionId, setSelectedQuestionId] = useState()

  const openModal = () => {
    setQuestion("")
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const copyToClipboard = () => {
    const linkToCopy = 'http://localhost:3001/user-survey';

    clipboardCopy(linkToCopy)
      .then(() => {
        alert('Link telah berhasil disalin');
      })
      .catch((error) => {
        console.error('Link gagal disalin:', error);
      });
  };

  const addQuestion = () => {
    axios.post("http://localhost:3000/question", {
      question: question
    }, {
      headers: {
        'Content-Type': 'application/json', // Set the appropriate content type for your API
        // You may need to include other headers as required by your API
      },
    }).then(() => {
      setIsModalOpen(false);
      getQuestion();
      Swal.fire({
        icon: 'success',
        title: 'Sukses',
        text: 'Pertanyaan berhasil ditambah',
      });
    }).catch((err) => console.log(err))
  }

  const editQuestion = (id) => {
    setSelectedQuestionId(id)
    axios.get(`http://localhost:3000/question/${id}`).then((res) => {
      openModal();
      setQuestion(res.data.question);
      setTypeModal('edit');
    })
  }

  const updateQuestion = () => {
    axios.put(`http://localhost:3000/question/${selectedQuestionId}`, { question: question }).then(() => {
      closeModal();
      getQuestion();
      Swal.fire({
        icon: 'success',
        title: 'Sukses',
        text: 'Pertanyaan berhasil diubah',
      });
    })
  }

  const deleteQuestion = (id) => {
    Swal.fire({
      title: 'Apakah kamu yakin untuk hapus?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batalkan',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/question/${id}`).then(() => {
          Swal.fire('Terhapus', 'Pertanyaan berhasil dihapus.', 'success');
          getQuestion();
        })
      } else {
        // The user clicked "Cancel" or closed the dialog
        Swal.fire('Batal', 'Pertanyaan batal dihapus.', 'info');
      }
    });
  }

  const getQuestion = () => {
    axios.get("http://localhost:3000/question").then((res) => { setListQuestion(res.data); })
  }

  useEffect(() => { getQuestion() }, [])

  return (
    <main className="flex min-h-screen">
      <Navbar />
      <Modal isOpen={isModalOpen} onClose={closeModal} typeModal={typeModal}>
        <h2 className='text-xl font-semibold mb-4'>{typeModal === "add" ? "Tambah" : "Ubah"} Pertanyaan</h2>
        <p className='text-sm font-medium mb-4'>Pertanyaan</p>
        <textarea rows="8" className='w-full border outline-none text-sm p-2 rounded-sm' onChange={(e) => setQuestion(e.target.value)} value={question}>{question}</textarea>
        {
          typeModal === 'add' ?
            <button className='text-sm w-full bg-[#008CFF] rounded-sm text-white font-semibold py-2.5 mt-2 disabled:bg-slate-200 disabled:cursor-not-allowed' onClick={addQuestion} disabled={question === ""}>Simpan</button> :
            <button className='text-sm w-full bg-[#008CFF] rounded-sm text-white font-semibold py-2.5 mt-2 disabled:bg-slate-200 disabled:cursor-not-allowed' onClick={updateQuestion} disabled={question === ""}>Simpan</button>
        }

      </Modal>

      <div className='px-4 py-6 w-full'>
        <div className="flex justify-between">
          <h1 className='font-bold text-xl'>Daftar Pertanyaan</h1>
          <div className="flex gap-4">
            <button className='border border-[#008CFF] text-[#008CFF] px-4 py-2 text-sm font-semibold' onClick={() => copyToClipboard()}>Bagikan Link</button>
            <button className='bg-[#008CFF] text-white px-4 py-2 text-sm font-semibold' onClick={() => { openModal(); setTypeModal("add") }}>Tambah</button>
          </div>
        </div>

        <div className='table w-full mt-5'>
          <div className='flex border-b w-full table-head py-2'>
            <div className='flex-[0.2] font-medium text-sm'>No</div>
            <div className='flex-[0.6] font-medium text-sm'>Pertanyaan</div>
            <div className='flex-[0.2] font-medium text-sm'>Aksi</div>
          </div>
          {listQuestion?.map((item, index) => {
            return (
              <div className="flex table-body py-2" key={index}>
                <div className='flex-[0.2] font-medium text-sm'>{index + 1}</div>
                <div className='flex-[0.6] font-medium text-sm'>{item?.question}</div>
                <div className="flex flex-[0.2] gap-2">
                  <div className='font-medium text-sm text-[#008CFF] cursor-pointer' onClick={() => { editQuestion(item?._id) }}>Ubah</div>
                  <div className='font-medium text-sm text-red-600 cursor-pointer' onClick={() => { deleteQuestion(item?._id) }}>Hapus</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
