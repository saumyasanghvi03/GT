
import React, { useState, useEffect } from 'react';

interface InitializationScreenProps {
    onComplete: () => void;
}

const InitializationScreen: React.FC<InitializationScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing BlockVista Terminal...');

    useEffect(() => {
        const steps = [
            { msg: 'Connecting to Secure Backend...', duration: 800 },
            { msg: 'Verifying System Integrity...', duration: 1000 },
            { msg: 'Loading AMC Intelligence Modules...', duration: 1200 },
            { msg: 'Hydrating Analytics Engine...', duration: 800 },
            { msg: 'Establishing Secure Session...', duration: 600 },
            { msg: 'Ready', duration: 400 }
        ];

        let currentStep = 0;

        // Simulate health check first
        const checkBackend = async () => {
            try {
                const res = await fetch('http://localhost:8000/health');
                if (!res.ok) throw new Error("Backend Unreachable");
            } catch (e) {
                console.warn("Backend check failed, continuing for demo...", e);
                // In a real app we might block here, but for now we continue
                // or we could show an error. Let's try to proceed to avoid permanent block.
            }
        };

        checkBackend();

        const timer = setInterval(() => {
            if (currentStep >= steps.length) {
                clearInterval(timer);
                setTimeout(onComplete, 500); // Small delay before unmounting
                return;
            }

            setStatus(steps[currentStep].msg);
            const stepProgress = ((currentStep + 1) / steps.length) * 100;
            setProgress(stepProgress);

            currentStep++;
        }, 800); // Average step time, overridden by specific durations in a real async queue

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] z-[9999] flex flex-col items-center justify-center text-white font-mono">
            {/* Logo Area */}
            <div className="mb-12 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center justify-center border border-white/10">
                    <span className="text-4xl">💠</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    BLOCKVISTA <span className="font-light">ATLAS</span>
                </h1>
                <p className="text-gray-500 text-xs tracking-[0.2em] mt-2 uppercase">Institutional Intelligence Terminal</p>
            </div>

            {/* Progress Section */}
            <div className="w-full max-w-md px-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase tracking-wide">
                    <span>{status}</span>
                    <span>{Math.round(progress)}%</span>
                </div>

                {/* Progress Bar Container */}
                <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                    {/* Progress Bar Fill */}
                    <div
                        className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Decorative Tech Lines */}
                <div className="mt-8 flex justify-center gap-1">
                    <div className="w-1 h-1 bg-gray-800 rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-gray-800 rounded-full animate-pulse delay-75" />
                    <div className="w-1 h-1 bg-gray-800 rounded-full animate-pulse delay-150" />
                </div>
            </div>

            <div className="absolute bottom-8 text-[10px] text-gray-700 font-mono">
                v0.1.0 • SECURE CONNECTION • ENCRYPTED
            </div>
        </div>
    );
};

export default InitializationScreen;
