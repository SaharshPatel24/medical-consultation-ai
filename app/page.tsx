"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

// Dynamically import BentoGrid with SSR disabled to avoid hydration mismatch
const BentoGrid = dynamic(() => import("./_components/FeatureBentoGrid"), {
  ssr: false,
});

export default function HeroSectionOne() {
  // Ensure all client-only code runs after mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-neutral-900 dark:via-black dark:to-neutral-900">
      <Navbar />
      {/* Decorative vertical and horizontal lines */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-y-0 left-0 w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
      </div>
      <main className="relative z-10 w-full max-w-5xl px-6 py-16 md:py-28 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-6 text-center font-extrabold text-3xl md:text-5xl lg:text-7xl text-slate-800 dark:text-slate-200 tracking-tight leading-tight"
        >
          <span className="bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            AI Medical Consultation
          </span>
          <br />
          <span className="block text-lg md:text-2xl font-medium text-slate-600 dark:text-slate-400 mt-2">
            Your 24/7 Voice-Powered Healthcare Assistant
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 max-w-2xl text-center text-lg md:text-xl text-neutral-700 dark:text-neutral-300"
        >
          Instantly connect with an AI medical agent for accurate, confidential, and natural voice consultations. 
          Automate appointment scheduling, symptom triage, and follow-up care—anytime, anywhere.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-12 items-center justify-center"
        >
          <Link href="/sign-in" passHref>
            <button className="w-56 sm:w-60 rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-pink-600 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Get Started
            </button>
          </Link>
          <Link href="#features" passHref>
            <button className="w-56 sm:w-60 rounded-lg border border-blue-500 px-8 py-3 font-semibold text-blue-600 bg-white shadow transition-all duration-300 hover:bg-blue-50 dark:bg-black dark:text-blue-400 dark:border-blue-400 dark:hover:bg-neutral-900">
              Learn More
            </button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="w-full rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900 mb-16"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <img
              src="https://media.gettyimages.com/id/1442319694/vector/robot-pushing-wheelchair.jpg?s=612x612&w=0&k=20&c=0oJCcBsKrh2aVDcr-EeeINBKUMnB6mcpeM0Do-m9kCQ="
              alt="AI Medical Consultation Preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={320}
              width={640}
            />
          </div>
        </motion.div>
        {/* Only render BentoGrid on client to avoid hydration mismatch */}
        <section id="features" className="w-full">
          {mounted && <BentoGrid />}
        </section>
      </main>
    </div>
  );
}

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-5 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm mb-4">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 shadow" />
        <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
          AI Consultation
        </span>
      </div>
    </nav>
  );
};
