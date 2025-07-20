"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import  BentoGrid  from "./_components/FeatureBentoGrid";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function HeroSectionOne() {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <Navbar />
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Transform Healthcare with AI Medical Voice Agents"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10   py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Deliver instant, accurate medical assistance throught natural voice
          conversations Automate appointment scheduling , symptom triage , and
          follow-up care-24/7{" "}
        </motion.p>
        <Link href={'/sign-in'}>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button className="w-60 transform rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-cyan-500 dark:bg-gradient-to-r dark:from-blue-400 dark:to-cyan-300 dark:text-black dark:hover:from-blue-500 dark:hover:to-cyan-400">
            Get Started
          </button>
        </motion.div>
        </Link>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-32 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900 w-[75%] mx-auto"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <img
              src="https://cdn.pixabay.com/photo/2019/05/07/22/12/doctor-4187242_1280.jpg"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div>
      </div>
      <BentoGrid />
    </div>
  );
}

const Navbar = () => {
  const user = useUser();
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        {/* <div className="size-7 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="2" />
            <path d="M10 5V15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5 10H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div> */}
        <Image src="/logo.svg" alt="Logo" width={60} height={39} />
        <h1 className="text-base font-bold md:text-2xl">Medical Consultation</h1>
      </div>
     {user ? 
      <div className="flex items-center gap-4">
        <UserButton/>
        <Link href={"/dashboard"}>
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-700 hover:to-cyan-500 dark:from-blue-400 dark:to-cyan-300 dark:text-black dark:hover:from-blue-500 dark:hover:to-cyan-400">
          Dashboard
        </Button>
        </Link>
      </div>:<Link href={"/sign-in"}>
      <button className="w-24 transform rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-cyan-500 md:w-32 dark:from-blue-400 dark:to-cyan-300 dark:text-black dark:hover:from-blue-500 dark:hover:to-cyan-400">
        Login
      </button>
      </Link>} 
    </nav>
  );
};
