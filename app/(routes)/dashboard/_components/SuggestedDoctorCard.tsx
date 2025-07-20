import React from 'react'
import { DoctorAgent } from './DoctorAgent'
import Image from 'next/image'
type props={
    doctorAgent: DoctorAgent,
    setSelectedDoctor:any,
    selectedDoctor:any
}
const SuggestedDoctorCard = ({ doctorAgent , setSelectedDoctor,selectedDoctor}: props) => {
  return (
    <div className={`flex flex-col items-center border-2 rounded-2xl shadow p-5
    hover:border-blue-500 cursor-pointer ${
      selectedDoctor && selectedDoctor.id === doctorAgent.id ? 'border-blue-500' : ''
    }`}
  onClick={() => setSelectedDoctor(doctorAgent)}
>
        <Image src={doctorAgent.image} alt={doctorAgent.specialist} width={70} height={70} className='w-[50px] h-[50px] rounded-4xl'/>
      <h2 className='font-bold'>{doctorAgent.specialist}</h2>
      <p className='text-xs text-center'>{doctorAgent.description}</p>
    </div>
  )
}

export default SuggestedDoctorCard
