"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconStethoscope,
  IconMicrophone,
  IconReportMedical,
  IconHeartbeat,
  IconUserHeart,
} from "@tabler/icons-react";
import { motion } from "motion/react";

// Custom skeletons for medical context
const MedicalSkeletonOne = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center h-full w-full min-h-[6rem] bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl"
  >
    <IconMicrophone className="h-10 w-10 text-blue-500 mb-2" />
    <span className="text-blue-700 dark:text-blue-200 font-semibold text-lg">Voice Consultation</span>
  </motion.div>
);

const MedicalSkeletonTwo = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center h-full w-full min-h-[6rem] bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-xl"
  >
    <IconStethoscope className="h-10 w-10 text-green-500 mb-2" />
    <span className="text-green-700 dark:text-green-200 font-semibold text-lg">Symptom Checker</span>
  </motion.div>
);

const MedicalSkeletonThree = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center h-full w-full min-h-[6rem] bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl"
  >
    <IconReportMedical className="h-10 w-10 text-purple-500 mb-2" />
    <span className="text-purple-700 dark:text-purple-200 font-semibold text-lg">Instant Medical Reports</span>
  </motion.div>
);

const MedicalSkeletonFour = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-row items-center justify-between h-full w-full min-h-[6rem] bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 rounded-xl px-4"
  >
    <div className="flex flex-col items-center">
      <IconHeartbeat className="h-8 w-8 text-pink-500 mb-1" />
      <span className="text-pink-700 dark:text-pink-200 text-sm font-medium">Vitals Tracking</span>
    </div>
    <div className="flex flex-col items-center">
      <IconUserHeart className="h-8 w-8 text-pink-400 mb-1" />
      <span className="text-pink-700 dark:text-pink-200 text-sm font-medium">Personalized Care</span>
    </div>
  </motion.div>
);

const MedicalSkeletonFive = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center h-full w-full min-h-[6rem] bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-xl"
  >
    <IconReportMedical className="h-10 w-10 text-yellow-500 mb-2" />
    <span className="text-yellow-700 dark:text-yellow-200 font-semibold text-lg">Prescription Guidance</span>
  </motion.div>
);

const items = [
  {
    title: "AI Voice Consultation",
    description: (
      <span className="text-sm">
        Speak with our AI-powered medical agent for instant, accurate health advice—anytime, anywhere.
      </span>
    ),
    header: <MedicalSkeletonOne />,
    className: "md:col-span-1",
    icon: <IconMicrophone className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Symptom Checker",
    description: (
      <span className="text-sm">
        Describe your symptoms and receive a preliminary assessment and next steps, powered by advanced AI.
      </span>
    ),
    header: <MedicalSkeletonTwo />,
    className: "md:col-span-1",
    icon: <IconStethoscope className="h-4 w-4 text-green-500" />,
  },
  {
    title: "Instant Medical Reports",
    description: (
      <span className="text-sm">
        Get a summary of your consultation and actionable health reports, instantly generated for your records.
      </span>
    ),
    header: <MedicalSkeletonThree />,
    className: "md:col-span-1",
    icon: <IconReportMedical className="h-4 w-4 text-purple-500" />,
  },
  {
    title: "Vitals & Personalized Care",
    description: (
      <span className="text-sm">
        Track your vitals and receive personalized care recommendations tailored to your health profile.
      </span>
    ),
    header: <MedicalSkeletonFour />,
    className: "md:col-span-2",
    icon: <IconHeartbeat className="h-4 w-4 text-pink-500" />,
  },
  {
    title: "Prescription Guidance",
    description: (
      <span className="text-sm">
        Understand your prescriptions and get reminders, dosage info, and safe medication guidance.
      </span>
    ),
    header: <MedicalSkeletonFive />,
    className: "md:col-span-1",
    icon: <IconReportMedical className="h-4 w-4 text-yellow-500" />,
  },
];

export default function FeatureBentoGrid() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}
