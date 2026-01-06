import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete
        });
      }
    });

    // Initial State
    setLogs(['> INITIALIZING SENTINEL KERNEL...', '> CHECKING INTEGRITY...']);

    // Animate Progress Bar
    tl.to(progressRef.current, {
      width: '100%',
      duration: 2.5,
      ease: 'power1.inOut',
      onUpdate: () => {
        // Randomly add logs during progress
        if (Math.random() > 0.92) {
            const newLogs = [
                '> LOADING MODULES...',
                '> ESTABLISHING UPLINK...', 
                '> DECRYPTING STREAMS...',
                '> OPTIMIZING MESH...',
                '> VERIFYING PEERS...',
                '> SYNCING LEDGER...'
            ];
            setLogs(prev => [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]]);
        }
      }
    });

    // Blink effect on text
    gsap.to(textRef.current, {
        opacity: 0.5,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)'
    });
    
    // Final Success Message
    tl.add(() => {
        setLogs(prev => [...prev, '> SYSTEM ONLINE. WELCOME, COMMANDER.']);
    });

    tl.to({}, { duration: 0.8 }); // Wait a bit before fading out

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black text-green-500 font-mono flex flex-col items-center justify-center select-none"
    >
        <div className="w-96 max-w-[90vw] space-y-4">
            <div className="flex justify-between items-end border-b border-green-500/30 pb-2 mb-4">
                <h1 className="text-2xl font-bold tracking-widest">SENTINEL_OS</h1>
                <span className="text-xs animate-pulse">v2.4.0-RC1</span>
            </div>

            <div className="h-64 overflow-hidden text-xs md:text-sm opacity-80 font-mono leading-relaxed p-4 border border-green-500/20 bg-green-900/5 rounded">
                <div className="flex flex-col justify-end h-full">
                    {logs.map((log, i) => (
                        <div key={i} className="truncate">{log}</div>
                    ))}
                    <div ref={textRef} className="w-2 h-4 bg-green-500 mt-1 inline-block" />
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase opacity-60">
                    <span>System Load</span>
                    <span>Encrypting</span>
                </div>
                <div className="h-1 w-full bg-green-900/30 rounded-full overflow-hidden">
                    <div 
                        ref={progressRef}
                        className="h-full bg-green-500 w-0 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                    />
                </div>
            </div>
        </div>

        {/* Decode Effect Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ 
                 backgroundImage: 'linear-gradient(0deg, transparent 24%, #22c55e 25%, #22c55e 26%, transparent 27%, transparent 74%, #22c55e 75%, #22c55e 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #22c55e 25%, #22c55e 26%, transparent 27%, transparent 74%, #22c55e 75%, #22c55e 76%, transparent 77%, transparent)',
                 backgroundSize: '50px 50px'
             }} 
        />
    </div>
  );
};
