import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail, MedicalReport } from "@/types/medical";
import moment from "moment";
import { Badge } from "@/components/ui/badge";

type props ={
    record:SessionDetail
}

function ViewReportDialog({record}:props) {
  const report = record.report as MedicalReport;
  const hasReport = report && Object.keys(report).length > 0;

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={'link'} size={'sm'} disabled={!hasReport}>
            {hasReport ? 'View Report' : 'No Report'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-blue-600">
              Medical Consultation Report
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-6 space-y-6">
                {/* Session Info */}
                <div className="border-b pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Doctor:</span>
                      <p className="text-gray-600">{record.selectedDoctor.specialist}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Date:</span>
                      <p className="text-gray-600">{moment(new Date(record.createdOn)).format('MMMM Do, YYYY')}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Status:</span>
                      <Badge variant={hasReport ? "default" : "secondary"}>
                        {hasReport ? "Report Available" : "No Report Generated"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Report Content */}
                {hasReport ? (
                  <div className="space-y-6">
                    {/* Chief Complaint */}
                    {report.chiefComplaint && (
                      <div>
                        <h3 className="font-bold text-lg text-blue-600 mb-2">Chief Complaint</h3>
                        <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{report.chiefComplaint}</p>
                      </div>
                    )}

                    {/* History of Present Illness */}
                    {report.historyOfPresentIllness && (
                      <div>
                        <h3 className="font-bold text-lg text-blue-600 mb-2">History of Present Illness</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{report.historyOfPresentIllness}</p>
                      </div>
                    )}

                    {/* Assessment */}
                    {report.assessment && (
                      <div>
                        <h3 className="font-bold text-lg text-blue-600 mb-2">Clinical Assessment</h3>
                        <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg whitespace-pre-wrap">{report.assessment}</p>
                      </div>
                    )}

                    {/* Diagnosis */}
                    {report.diagnosis && (
                      <div>
                        <h3 className="font-bold text-lg text-red-600 mb-2">Diagnosis</h3>
                        <p className="text-gray-700 bg-red-50 p-3 rounded-lg font-medium whitespace-pre-wrap">{report.diagnosis}</p>
                      </div>
                    )}

                    {/* Recommendations */}
                    {report.recommendations && (
                      <div>
                        <h3 className="font-bold text-lg text-green-600 mb-2">Treatment Recommendations</h3>
                        <p className="text-gray-700 bg-green-50 p-3 rounded-lg whitespace-pre-wrap">{report.recommendations}</p>
                      </div>
                    )}

                    {/* Follow-up */}
                    {report.followUp && (
                      <div>
                        <h3 className="font-bold text-lg text-purple-600 mb-2">Follow-up Instructions</h3>
                        <p className="text-gray-700 bg-purple-50 p-3 rounded-lg whitespace-pre-wrap">{report.followUp}</p>
                      </div>
                    )}

                    {/* Summary */}
                    {report.summary && (
                      <div>
                        <h3 className="font-bold text-lg text-gray-700 mb-2">Summary</h3>
                        <p className="text-gray-700 bg-gray-100 p-3 rounded-lg italic whitespace-pre-wrap">{report.summary}</p>
                      </div>
                    )}

                    {/* Report Metadata */}
                    {report.generatedAt && (
                      <div className="border-t pt-4 text-xs text-gray-500">
                        <p>Report generated on: {moment(report.generatedAt).format('MMMM Do, YYYY [at] h:mm A')}</p>
                        {report.conversationLength && (
                          <p>Based on {report.conversationLength} conversation exchanges</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Report Available</h3>
                    <p className="text-gray-500">
                      This consultation session hasn't generated a medical report yet. 
                      Reports are automatically created after completing a voice consultation.
                    </p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ViewReportDialog;
