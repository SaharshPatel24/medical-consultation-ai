"use client"

import React, { useEffect, useState } from 'react'
import DoctorAgentCard , {doctorAgent} from './DoctorAgentCard'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Loader2, Stethoscope, FileText, Users, Plus, AlertCircle } from 'lucide-react'
import axios from 'axios'
import SuggestedDoctorCard from './SuggestedDoctorCard'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'


export type SessionDetail = {
    id: number,
    notes: string,
    sessionId: string,
    report: JSON,
    selectedDoctor: doctorAgent,
    createdOn: string,
    voiceId? : string,
}

function AddNewSessionDialog() {
    const [note,setNote] = useState<string>();
    const [loading,setLoading] = useState(false);
    const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([])
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent | null>(null);
    const [error, setError] = useState<string>('');
    const router = useRouter();
    const [historyList,setHistoryList] = useState<SessionDetail[]>([])
    const {has} = useAuth();
    const paidUser = has && has({plan:'pro'})

    useEffect(()=>{
        GetHistoryList();
    },[])

    const GetHistoryList = async()=>{
        const result = await axios.get('/api/session-chat?sessionId=all')
        console.log(result.data);
        setHistoryList(result.data);
    }

    const OnClickNext = async ()=> {
        if (!note?.trim()) {
            setError('Please describe your symptoms before proceeding.');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const result = await axios.post('/api/suggest-doctors', {
                notes: note.trim()
            });
            
            console.log('API Response:', result.data);
            
            // Handle different possible response formats from the AI
            let doctorsArray: any[] = [];
            
            if (Array.isArray(result.data)) {
                // Direct array response
                doctorsArray = result.data;
            } else if (result.data && typeof result.data === 'object') {
                // Object response - try common property names
                doctorsArray = result.data.doctors || 
                              result.data.suggested_doctors || 
                              result.data.recommendations ||
                              result.data.specialists ||
                              result.data.data ||
                              [];
                
                // If still not found, check if there's any array property
                if (!Array.isArray(doctorsArray)) {
                    const arrayProps = Object.values(result.data).filter(Array.isArray);
                    if (arrayProps.length > 0) {
                        doctorsArray = arrayProps[0] as any[];
                    }
                }
            }
            
            console.log('Extracted doctors array:', doctorsArray);
            
            if (!Array.isArray(doctorsArray)) {
                throw new Error('Could not find valid doctors array in API response');
            }
            
            // Filter and validate doctor objects
            const validDoctors = doctorsArray.filter((doctor: any) => 
                doctor && 
                typeof doctor === 'object' && 
                (doctor.id || doctor.ID) && 
                (doctor.specialist || doctor.specialty || doctor.specialization) && 
                (doctor.description || doctor.desc)
            ).map((doctor: any) => ({
                // Normalize the doctor object structure
                id: doctor.id || doctor.ID,
                specialist: doctor.specialist || doctor.specialty || doctor.specialization,
                description: doctor.description || doctor.desc,
                image: doctor.image || '/doctor1.png', // fallback image
                agentPrompt: doctor.agentPrompt || `You are a ${doctor.specialist || doctor.specialty} AI assistant.`,
                voiceId: doctor.voiceId || 'will',
                subscriptionRequired: doctor.subscriptionRequired || false
            }));
            
            console.log('Valid doctors after processing:', validDoctors);
            
            if (validDoctors.length > 0) {
                setSuggestedDoctors(validDoctors);
            } else {
                throw new Error('No valid doctors found in the response. Please try describing your symptoms differently.');
            }
        } catch (error: any) {
            console.error('Error suggesting doctors:', error);
            
            // Handle API error responses
            let errorMessage = 'Failed to get doctor suggestions. Please try again.';
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const onStartConsultation = async()=>{
        if (!selectedDoctor) {
            setError('Please select a doctor before starting consultation.');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const result = await axios.post('/api/session-chat', {
                notes: note,
                selectedDoctor: selectedDoctor
            });

            if (result.data?.sessionId) {
                console.log('Session created:', result.data.sessionId);
                router.push('/dashboard/medical-agent/' + result.data.sessionId);
            } else {
                throw new Error('Failed to create consultation session');
            }
        } catch (error: any) {
            console.error('Error starting consultation:', error);
            setError(
                error.response?.data?.message || 
                error.message || 
                'Failed to start consultation. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    const resetDialog = () => {
        setNote('');
        setSuggestedDoctors([]);
        setSelectedDoctor(null);
        setError('');
        setLoading(false);
    }

    return (
        <Dialog onOpenChange={(open) => !open && resetDialog()}>
            <DialogTrigger asChild>
                <Button className='mt-3 flex items-center gap-2' disabled={!paidUser && historyList.length>1}>
                    <Plus className="h-4 w-4" />
                    Start a Consultation
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                        Start Medical Consultation
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        {!suggestedDoctors.length ? 
                            "Please provide your symptoms and medical concerns to get matched with the right specialist." :
                            "Select a specialist doctor based on your symptoms for personalized consultation."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {!suggestedDoctors.length ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold">Describe Your Symptoms</h3>
                            </div>
                            
                            <div className="space-y-3">
                                <label htmlFor="symptoms" className="text-sm font-medium text-gray-700">
                                    Please describe your symptoms, medical concerns, or any other relevant details:
                                </label>
                                <Textarea 
                                    id="symptoms"
                                    placeholder="E.g., I've been experiencing headaches for the past 3 days, along with fever and fatigue. The pain is mostly on the right side of my head..."
                                    className="min-h-[200px] resize-none border-2 focus:border-blue-500 transition-colors" 
                                    value={note || ""}
                                    onChange={(e) => {
                                        setNote(e.target.value);
                                        if (error) setError(''); // Clear error when user types
                                    }}
                                />
                                <p className="text-xs text-gray-500">
                                    Be as detailed as possible to help us match you with the right specialist.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold">Choose Your Specialist</h3>
                                <span className="text-sm text-gray-500">({suggestedDoctors.length} suggested)</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {suggestedDoctors.map((doctor, index) => (
                                    <SuggestedDoctorCard 
                                        doctorAgent={doctor} 
                                        key={index} 
                                        setSelectedDoctor={setSelectedDoctor} 
                                        selectedDoctor={selectedDoctor}
                                    />
                                ))}
                            </div>

                            {selectedDoctor && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Selected:</strong> {selectedDoctor.specialist}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">{selectedDoctor.description}</p>
                                </div>
                            )}

                            {/* Back to edit symptoms */}
                            <div className="pt-4 border-t">
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setSuggestedDoctors([]);
                                        setSelectedDoctor(null);
                                        setError('');
                                    }}
                                    className="text-sm"
                                >
                                    ← Edit Symptoms
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                    <DialogClose asChild>
                        <Button variant="outline" className="flex-1 sm:flex-none">
                            Cancel
                        </Button>
                    </DialogClose>

                    {!suggestedDoctors.length ? (
                        <Button 
                            disabled={!note?.trim() || loading} 
                            onClick={OnClickNext}
                            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Finding Specialists...
                                </>
                            ) : (
                                <>
                                    Find Specialists
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button 
                            disabled={loading || !selectedDoctor} 
                            onClick={onStartConsultation}
                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Starting Consultation...
                                </>
                            ) : (
                                <>
                                    Start Consultation
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewSessionDialog