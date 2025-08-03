'use client'
import React, {useEffect, useState} from 'react'
import {useParams} from "next/navigation";
import axios from "axios";
import {Circle, PhoneCall, PhoneOff} from "lucide-react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { type SessionDetail, type Message } from '@/types/medical'

function MedicalVoiceAgent() {
    const {sessionid} = useParams()
    const [sessionDetail, setSessionDetail] = useState<SessionDetail>()
    const [callStarted, setCallStarted] = useState(false);
    const [vapiInstance, setVapiInstance] = useState<any>();
    const [currentRole, setCurrentRole] = useState<string | null>();
    const [liveTranscript, setLiveTranscript] = useState<string>();
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
       sessionid && getSessionDetails();
    }, [sessionid]);

    const getSessionDetails = async() => {
        const result = await axios.get('/api/session-chat?sessionId=' + sessionid);
        setSessionDetail(result.data);
    }

    const updateNotes = async() => {
        try {
            // Save conversation data to database
            const result = await axios.put('/api/session-chat', {
                sessionId: sessionid,
                conversation: messages,
                notes: sessionDetail?.notes
            });
            console.log('Conversation saved:', result.data);
            
            // Generate report after saving conversation
            await generateReport();
        } catch (error) {
            console.error('Error updating session:', error);
        }
    }

    const generateReport = async() => {
        try {
            console.log('Generating report for session:', sessionid);
            const result = await axios.post('/api/generate-report', {
                sessionId: sessionid,
                conversation: messages,
                doctor: sessionDetail?.selectedDoctor,
                initialNotes: sessionDetail?.notes
            });
            console.log('Report generated:', result.data);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    }

    const startCall = () => {
        const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
        setVapiInstance(vapi);

        const VapiAgentConfig = {
            name: 'AI Medical Doctor Voice Agent',
            firstMessage: "Hi there! I'm your AI Medical Assistant. " +
                "I am here to help you with any health related questions or concerns you might have today." +
                "How are you feeling ?",
            transcriber: {
                provider: 'assembly-ai',
                language: 'en',

            },
            voice: {
                provider: 'playht',
                voiceId: sessionDetail?.selectedDoctor?.voiceId,
            },
            model: {
                provider: 'openai',
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: sessionDetail?.selectedDoctor?.agentPrompt,
                    }
                ]
            }
        }

        //@ts-ignore
        vapi.start(VapiAgentConfig);
        vapi.on('call-start', () => {
            setCallStarted(true);
            console.log('Call started');
        });
        vapi.on('call-end', () => {
            setCallStarted(false);
            console.log('Call end ed')
        });
        vapi.on('message', (message) => {
            if (message.type === 'transcript') {
                const { role, transcriptType, transcript } = message;
                console.log(`${message.role}: ${message.transcript}`);
                if(transcriptType === 'partial') {
                    setLiveTranscript(transcript);
                    setCurrentRole(role);
                } else if(transcriptType === 'final') {
                    setMessages((prev) => [...prev, {role: role, text: transcript}]);
                    setLiveTranscript('');
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
    }

    const endCall = () => {
        if (vapiInstance) {
            vapiInstance.stop();
            setCallStarted(false);
            setVapiInstance(null);
            updateNotes();
        }
    };


    return (
        <div className="p-5 border rounded-3xl bg-secondary">
            <div className='flex justify-between items-center'>
                <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'>
                    <Circle className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} />
                    {callStarted? 'Connected...' : 'Not Connected'}
                </h2>
                <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
            </div>
            {sessionDetail &&
            <div className="flex flex-col items-center mt-10">
                <Image
                    src={sessionDetail?.selectedDoctor?.image || ''}
                    alt={sessionDetail?.selectedDoctor?.specialist}
                    width={120}
                    height={120}
                    className='h-[100px] w-[100px] object-cover rounded-full'
                />
                <h2>{sessionDetail.selectedDoctor.specialist}</h2>
                <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

                <div className="mt-32 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72">
                    {messages.slice(-4).map((msg, index) => (
                            <h2 className='text-gray-400' key={index}>{msg.role} : {msg.text}</h2>
                    ))}

                    {liveTranscript && liveTranscript?.length > 0 && <h2 className='text-lg'>{currentRole} : {liveTranscript}</h2>}
                </div>

                {!callStarted
                    ? <Button className="mt-20" onClick={startCall}><PhoneCall/>Start Call</Button>
                    : <Button variant={'destructive'} onClick={endCall} className="mt-20"><PhoneOff/>Disconnect Call</Button>
                }
            </div> }
        </div>
    )
}

export default MedicalVoiceAgent
