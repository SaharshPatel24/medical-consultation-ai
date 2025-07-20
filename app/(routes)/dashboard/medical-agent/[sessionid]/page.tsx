"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DoctorAgent } from "../../_components/DoctorAgent";
import { Circle,  Loader,  PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";


export type MedicalReport = {
  agent: string;
  user: string;
  timestamp: string;
  chiefComplaint: string;
  summary: string[];
  symptoms: string;
  duration: string;
  severity: string;
  medicationsMentioned: string[];
  recommendations: string[];
}; 


export type SessionDetail = {
    id: number;
    notes: string;
    sessionId: string;
    report: MedicalReport;
    selectedDoctor: DoctorAgent;
    createdBy: string;
    createdOn: string;
  };



  
  type message={
    role:string,
    text:string,
  }
function MedicalVoiceAgent() {


  


  const { sessionid } = useParams();
  const [sessionDetails, setSessionDetails] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState<boolean>(false);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);  
  const [currentRole, setCurrentRole] = useState<string|null>();
  const [liveTranscripts, setLiveTranscripts] = useState<string>();
  const [messages, setMessages] = useState<message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  

  useEffect(() => {
    GetsessionDetails();
  }, [sessionid]);

  const GetsessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionid=" + sessionid);
    console.log(result.data);
    setSessionDetails(result.data);
  };

   const GenerateReport = async ()=> {
      const result = await axios.post('/api/medical-report',{
        messages:messages,
        sessionDetail: sessionDetails,
        sessionId:sessionid,
      })
      
      console.log(result.data);
    
    }

  const startCall = async () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || "");
    setVapiInstance(vapi);
     setCallStarted(true);

    const VapiAgentConfig = {
      name:'AI Medical Doctor Voice Agent',
      firstMessage: 'Hello, I am your AI Medical Voice Agent. How can I assist you today?',

      transcriber:{
        provider:'assembly-ai',
        language:'en'
      },
      voice:{
        provider:'playht',
        voiceId: sessionDetails?.selectedDoctor?.voiceId 
      },
      model:{
        provider:'openai',
        modelId:'gpt-4',
        messages:[
            {
                role:'system',
                content: sessionDetails?.selectedDoctor?.agentPrompt || "You are a medical assistant. Answer the user's questions in a friendly and professional manner."
            }
        ]
      }
    }

   

    //@ts-ignore
    vapi.start(VapiAgentConfig);
    vapi.on("call-start", () => {console.log("Call started"); setCallStarted(true)});
    vapi.on("call-end", () => {console.log("Call ended"); setCallStarted(false)});
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const {role,transcriptType,transcript} = message;
        console.log(`${message.role}: ${message.transcript}`);
        if (transcriptType === 'partial') {
          setLiveTranscripts(transcript);
          setCurrentRole(role);
        }
        else if(transcriptType=='final'){
          setMessages((prev: any)=>[...prev,{role:role,text:transcript}])
          setLiveTranscripts("");
          setCurrentRole(null);
        }
      }
    });
     vapi.on('speech-start', () => {
      console.log('Assistant started speaking');
      setCurrentRole('assistant');
    });
    vapi.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setCurrentRole('user');
    });
  };


   const endCall = async () => {
    setLoading(true);
    if (!vapiInstance) return;
    vapiInstance.stop();
   
   
    setCallStarted(false);
    setVapiInstance(null);
    const result = await  GenerateReport();
    console.log("Call ended and report generated", result);
    setLoading(false);
    toast.success("Your report is generated.");
    router.replace('/dashboard');

  };


  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className={`w-4 h-4  rounded-full ${callStarted?'bg-green-500':'bg-red-500'}`} />
          {callStarted ? 'Connected...':' Not Connected'}
         
        </h2>
        <h2>00:00</h2>
      </div>
      {sessionDetails?.selectedDoctor?.image &&
        sessionDetails?.selectedDoctor?.specialist && (
          <div className="flex items-center flex-col mt-10">
            <Image
              src={sessionDetails.selectedDoctor.image}
              alt={sessionDetails.selectedDoctor.specialist}
              width={100}
              height={100}
              className="h-[100px] w-[100px] object-cover rounded-full"
            />
            <h2 className="mt-2 text-lg">
              {sessionDetails?.selectedDoctor?.specialist}
            </h2>
            <p className="text-sm text-gray-400">AI Medical Voice Agent</p>


            <div className="mt-32 overflow-y-auto display-flex flex-col items-center px-10 md:px-28 lg:px-52">
              {
                messages.slice(-4)?.map((msg,index)=>(
                  <div key={index}>
                    <h2 className="text-gray-400 p-2">{msg.role}: {msg.text}</h2>
                  </div>
                ))
              }
              <h2 className="text-gray-400">Assistant Msg</h2>
              {liveTranscripts && liveTranscripts?.length > 0 && (
                <h2 className="text-lg">{currentRole}: {liveTranscripts}</h2>
              )}
            </div>

            {!callStarted ?
             <Button className="mt-10" onClick={startCall} disabled={loading}>
              {loading? <Loader className="animate-spin" />:<PhoneCall/>}
               Start Call
            </Button>:
            <Button className="mt-10" variant={"destructive"} onClick={endCall}  disabled={loading}>
              {loading? <Loader className="animate-spin" />:<PhoneOff/>}
              Disconnect
            </Button>}
          </div>
        )}
    </div>
  );
}

export default MedicalVoiceAgent;
