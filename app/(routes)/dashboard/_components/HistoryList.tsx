'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import AddNewSession from './AddNewSession'
import axios from 'axios'
import HistoryTable from './HistoryTable'

const HistoryList = () => {
    const [historyList,setHistoryList] = useState([])
    useEffect(()=>{
      fetchHistory();
    },[])

    const fetchHistory = async ()=>{
      const result = await axios.get('/api/session-chat?sessionid=all')
      setHistoryList(result.data);
    }
  return (
    <div className='mt-10' >
      {historyList.length == 0 ? (
        <div className='flex items-center justify-center flex-col border-dashed rounded-2xl border-2 p-7 '>
          <Image src="/medical-assistance.png" alt="Logo" width={150} height={150} />
          <h2 className='font-bold text-xl mt-2'>No Recent Consultations</h2>
          <p>It looks like you  haven't consulted with any doctors yet</p>
         <AddNewSession/>
        </div>
      ) : (
        <div><HistoryTable historyList={historyList}/></div>
      )}
    </div>
  )
}

export default HistoryList
