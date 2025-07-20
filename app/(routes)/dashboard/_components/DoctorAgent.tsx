import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'


export type DoctorAgent = {
  id:number,
  specialist:string,
  description:string,
  image:string,
  agentPrompt:string,
  voiceId: string;
}
type props={
  doctorAgent: DoctorAgent
}
const DoctorAgent = ({ doctorAgent }: props) => {
  return (
    <div >
        <Image src={doctorAgent.image} alt={doctorAgent.specialist} width={200} height={300} 
        className='w-full object-cover h-[250px] rounded-xl'/>
        <h2 className='font-semibold'>{doctorAgent.specialist }</h2>
        <p className='text-sm text-gray-500'>{doctorAgent.description}</p>
        <Button className='mt-4 w-full'>Start Consultation </Button>
    </div>
  )
}

export default DoctorAgent
