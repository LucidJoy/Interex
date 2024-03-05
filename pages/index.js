import Image from "next/image";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { SparklesCore } from "@/components/Sparkles";
import { AnimatedButton } from "@/components/AnimatedButton";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  return (
    <div className='h-[600px] w-full bg-transparent flex flex-col items-center justify-center overflow-hidden'>
      <h1 className='md:text-7xl text-3xl lg:text-8xl font-bold text-center text-white relative z-20'>
        Interex
      </h1>

      <div className='w-[40rem] h-60 relative bg-transparent'>
        <div className='absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm' />
        <div className='absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4' />
        <div className='absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm' />
        <div className='absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4' />

        <SparklesCore
          background='transparent'
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className='w-full h-full'
          particleColor='#FFFFFF'
        />

        <div className='absolute inset-0 w-full h-full bg-[#09090B] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]'></div>
      </div>

      <div
        className='absolute bottom-[100px]'
        onClick={() => router.push("/home")}
      >
        <AnimatedButton btnName='Launch app' />
      </div>
    </div>
  );
}
