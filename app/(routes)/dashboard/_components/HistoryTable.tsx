import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {SessionDetail} from '../medical-agent/[sessionid]/page';
import moment from "moment";
import ViewReportDialog from "./ViewReportDialog";

type props={
    historyList:SessionDetail[],
    
}
const HistoryTable = ({historyList}:props) => {
  return (
    <div>
      <Table>
        <TableCaption>Previous Consultation Reports</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">AI Medical Specialist</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {historyList.map((record:SessionDetail,index:number) => (
                <TableRow key={index} className="hover:bg-gray-100">
                <TableCell className="font-medium">{record.selectedDoctor.specialist}</TableCell>
                <TableCell>{record.notes}</TableCell>
                <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
                <TableCell className="text-right">
                    <ViewReportDialog record={record} />
                </TableCell>
                </TableRow>
            ))}
          
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoryTable;
