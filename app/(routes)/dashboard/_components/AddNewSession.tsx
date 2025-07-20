"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { DoctorAgent } from "./DoctorAgent";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";

const AddNewSession = () => {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<DoctorAgent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent>();
  const router = useRouter();

  const OnClickNext = async () => {
    setLoading(true);
    const result = await axios.post("/api/suggest-doctors", {
      notes: note,
    });

    setSuggestedDoctors(result.data);
    console.log(result.data);

    setLoading(false);
  };

  const onStartConsultation = async () => {
    setLoading(true);
    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctor: selectedDoctor,
    });
    console.log(result.data);

    if (result.data?.sessionid) {
      console.log(result.data.sessionid);
      router.push('/dashboard/medical-agent/' + result.data.sessionid);
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">Start a Consultation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            {suggestedDoctors.length === 0 ? (
              <div>
                <h2>Add Symptoms or Any Other Details</h2>
                <Textarea
                  className="h-[240px] "
                  placeholder="Describe your symptoms or concerns"
                  onChange={(e) => setNote(e.target.value)}
                ></Textarea>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-5">
                <h2>Select the doctor</h2>
                {Array.isArray(suggestedDoctors) &&suggestedDoctors.map((doctor, index) => (
                  <SuggestedDoctorCard
                    doctorAgent={doctor}
                    key={index}
                    setSelectedDoctor={() => setSelectedDoctor(doctor)}
                    selectedDoctor={selectedDoctor}
                  />
                ))}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>

          {suggestedDoctors.length === 0 ? (
            <Button disabled={!note || loading} onClick={OnClickNext}>
              {" "}
              Next
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </Button>
          ) : (
            <Button
              disabled={loading ||!selectedDoctor}
              onClick={onStartConsultation}
            >
              
              Start Consultation
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSession;
