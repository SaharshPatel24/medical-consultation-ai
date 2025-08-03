// Medical consultation type definitions

export interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp?: string;
}

export interface MedicalReport {
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  assessment?: string;
  diagnosis?: string;
  recommendations?: string;
  followUp?: string;
  summary?: string;
  generatedAt?: string;
  doctorSpecialist?: string;
  sessionId?: string;
  conversationLength?: number;
}

export interface Doctor {
  id: string | number;
  specialist: string;
  description: string;
  image?: string;
  agentPrompt?: string;
  voiceId?: string;
  subscriptionRequired?: boolean;
}

export interface SessionDetail {
  id: number;
  sessionId: string;
  notes?: string;
  selectedDoctor: Doctor;
  conversation?: Message[];
  report?: MedicalReport;
  createdBy?: string;
  createdOn: string;
}

export interface ReportGenerationRequest {
  sessionId: string;
  conversation: Message[];
  doctor: Doctor;
  initialNotes?: string;
}

export interface ReportGenerationResponse {
  success: boolean;
  report?: MedicalReport;
  message: string;
  error?: string;
  details?: string;
}

export interface SessionUpdateRequest {
  sessionId: string;
  notes?: string;
  conversation?: Message[];
  report?: MedicalReport;
}

export interface SessionUpdateResponse {
  success: boolean;
  result?: any;
  error?: string;
} 
