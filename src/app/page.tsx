"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-terminal-bg">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-gray-400">Loading Prediction Edge Terminal...</p>
      </div>
    </div>
  );
}