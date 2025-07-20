import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { SessionDetail } from '../medical-agent/[sessionid]/page'
import moment from 'moment'

type props = {
  record: SessionDetail
}

const ViewReportDialog = ({ record }: props) => {
  const report = record?.report as any; 

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"} size={"sm"}>View Report</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className='text-center text-2xl'>Medical AI Voice Agent Report</h2>
          </DialogTitle>
          <DialogDescription asChild>
            <div className='mt-6 space-y-4'>

              {/* Session Info */}
              <div>
                <h2 className='font-bold text-blue-500 text-lg'>Session Info</h2>
                <p><span className='font-bold'>Doctor</span>: {record.selectedDoctor.specialist}</p>
                <p><span className='font-bold'>Consulted On</span>: {moment(new Date(record?.createdOn)).format("LLL")}</p>
              </div>

              {/* Complaint */}
              <div>
                <h2 className='font-bold text-blue-500 text-lg'>Chief Complaint</h2>
                <p>{report?.chiefComplaint || "N/A"}</p>
              </div>

              {/* Summary */}
              <div>
                <h2 className='font-bold text-blue-500 text-lg'>Summary</h2>
                <p>{report?.summary || "N/A"}</p>
              </div>

              {/* Symptoms */}
              <div>
                <h2 className='font-bold text-blue-500 text-lg'>Symptoms</h2>
                <p>{report?.symptoms || "N/A"}</p>
              </div>

              {/* Duration & Severity */}
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <h2 className='font-bold text-blue-500 text-lg'>Duration</h2>
                  <p>{report?.duration || "N/A"}</p>
                </div>
                <div>
                  <h2 className='font-bold text-blue-500 text-lg'>Severity</h2>
                  <p>{report?.severity || "N/A"}</p>
                </div>
              </div>

              {/* Medications */}
              <div>
                <h2 className='font-bold text-blue-500 text-lg'>Medications Mentioned</h2>
                <ul className="list-disc list-inside">
                  {report?.medicationsMentioned?.map((med: string, idx: number) => (
                    <li key={idx}>{med}</li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h2 className='font-bold text-blue-500 text-lg'>Recommendations</h2>
                <ul className="list-disc list-inside">
                  {report?.recommendations?.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Timestamp */}
              <div>
                <p className='text-xs text-gray-500 text-right'>
                  Generated on: {moment(report?.timestamp).format("LLL")}
                </p>
              </div>

            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ViewReportDialog
