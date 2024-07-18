"use client"

import Link from "next/link";
import { useState, useEffect } from "react"
import Image from "next/image";

export default function Home() {

  const [menu, setMenu] = useState('showBook')


  //Update
  const [idbooks, setIdbooks] = useState('')
  async function getBookId(id) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/book/${id}`, {
        method: "GET",
        cache: "no-store"
      })
      if (!res.ok) {
        throw new Error("Failed to fetch api !")
      }
      const data = await res.json();
      setIdbooks(data.book_id);
      setMenu('updateBook')

    } catch (err) {
      console.log(err)
    }
  }
  const [newTitle,setNewTitle] = useState('')
  const [newDescription,setNewDescription] = useState('')
  const [newUrl,setNewUrl] = useState('')

  async function handleUpdate(id) {

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/book/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Appication/json"
        },body: JSON.stringify({ newTitle,newDescription,newUrl })
      })

      if(!res.ok){
        throw new Error("Failed to update Book")
      }
    

    } catch (err) {
      console.log(err)
    }
  }

  //Delete Books
  async function handleDelete(id) {
    const confirmed = confirm("Do you want to Delete Book ?")

    if (confirmed) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/book/${id}`, {
        method: "Delete"
      })
      if (res.ok) {
        window.location.reload();
      }
    }
  }

  //Read Books
  const [dataBooks, setDatabooks] = useState([])

  async function getBooks() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/book`, {
        method: "GET",
        cache: "no-store"
      })

      if (!res.ok) {
        throw Error("Error getBook from Api")
      }

      const data = await res.json();
      setDatabooks(data.books);

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getBooks();
  }, [])

  //Add Books
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')

  const [checkError,setCheckError] = useState(false)
  const [error,setError] = useState('')

  async function handleSubmitPost(e) {
    e.preventDefault();

    if(!title || !description || !url){
      setError('กรุณากรอกให้ครบทุกช่อง')
      setCheckError(true)
      return;
    }else{
      setCheckError(false)
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description, url })
      })

      if (res.ok) {
        setMenu('showBook')
      }
    } catch (err) {
      console.log("Error API : ", err);
    }
  }

  return (
    <div className="px-3 sm:px-10 md:px-15 lg:px-20">
      <div className=" m-auto py-3 flex justify-between">
        <Link href="/" onClick={() => setMenu('showBook')}>Book Shop</Link>
        <div className="flex ms-5">
          <Link href="#showBook" className="px-3" onClick={() => setMenu('showBook')}>หนังสือ</Link>
          <Link href="#addBook" className="px-3" onClick={() => setMenu('addBook')}>เพิ่มหนังสือ</Link>
        </div>
      </div>
      <hr className="mx-auto" />

      <div id="#showBook" style={{ display: menu === 'showBook' ? 'block' : 'none' }}>
        <div className="mx-auto mt-5 grid grid-flow-row grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {dataBooks.length === 0 ? (
            <div className="p-5 bg-gray-600 text-white text-center rounded-md">ไม่มีหนังสือ</div>
          ):(
            dataBooks.map((d) => (
              <div key={d._id} className="border rounded-md p-4 flex flex-col" style={{ height: "max-content" }}>
                <Image src={d.url} height={1000} width={1000} style={{ width: "100%", height: "60%" }} alt="photo" priority></Image>
                <h3 className="mt-5 font-bold uppercase">{d.title}</h3>
                <p className=" text-sm text-gray-400">{d.description}</p>
                <div className="mt-3 text-end flex justify-between">
                  <button onClick={() => getBookId(d._id)} className="p-2  px-3 shadow-xl rounded-md bg-blue-600 text-white" >อัพเดท</button>
                  <button onClick={() => handleDelete(d._id)} className="p-2 px-3 shadow-xl rounded-md bg-red-600 text-white">ลบ</button>
                </div>
              </div>
            ))
          )}
          
        </div>
      </div>

      <div id="#addBook" style={{ display: menu === 'addBook' ? 'block' : 'none' }}>
        <div className="container mx-auto mt-5">
          <form onSubmit={handleSubmitPost} className="border  p-3 mx-auto rounded-md" style={{ width: "max-content" }}>
            <h1 className="mb-5 px-2 rounded-md mx-auto " style={{ width: "max-content" }}>เพิ่มหนังสือ</h1>
            <div className="mt-3">
              <label>Title</label>
              <input type="text" className="mt-2 border rounded-md px-2 py-1 block" placeholder="หัวข้อ" onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="mt-3">
              <label>Description</label>
              <input type="text" className="mt-2 border rounded-md px-2 py-1 block" placeholder="รายละเอียด" onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="mt-3">
              <label>URL image</label>
              <input type="text" className="mt-2 border rounded-md px-2 py-1 block" placeholder="url image" onChange={(e) => setUrl(e.target.value)} />
            </div>
            {checkError ? (
              <div className="mt-1  text-red-500 p-1 rounded-md text-sm">*{error}</div>
            ): null}
            <div className="mt-3 text-end">
              <button type="submit" className="p-2 px-5 border rounded-md bg-green-600 text-white" >เพิ่ม</button>
            </div>
          </form>
        </div>
      </div>
      <div id="#updateBook" style={{ display: menu === 'updateBook' ? 'block' : 'none' }}>
        <div className="container mx-auto mt-5">
          <form onSubmit={()=>handleUpdate(idbooks._id)} className="border  p-3 mx-auto rounded-md" style={{ width: "max-content" }}>
            <h1 className="mb-5 px-2 rounded-md mx-auto " style={{ width: "max-content" }}>เพิ่มหนังสือ</h1>
            <div className="mt-3">
              <label>Title</label>
              <input onChange={(e) => setNewTitle(e.target.value)} type="text" className="mt-2 border rounded-md px-2 py-1 block" placeholder={idbooks.title} />
            </div>
            <div className="mt-3">
              <label>Description</label>
              <input onChange={(e) => setNewDescription(e.target.value)} type="text" className="mt-2 border rounded-md px-2 py-1 block" placeholder={idbooks.description} />
            </div>
            <div className="mt-3">
              <label>URL image</label>
              <input onChange={(e) => setNewUrl(e.target.value)} type="text" className="mt-2 border rounded-md px-2 py-1 block" placeholder={idbooks.url} />
            </div>
            <div className="mt-3 text-end flex justify-between">
              <p onClick={() => setMenu('showBook')} className=" cursor-pointer p-2 px-5 border rounded-md bg-gray-600 text-white">ย้อนกลับ</p>
              <button type="submit" className="p-2 px-5 border rounded-md bg-blue-600 text-white">อัพเดท</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
