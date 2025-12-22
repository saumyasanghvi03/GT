import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-terminal-bg text-terminal-text font-sans selection:bg-terminal-accent selection:text-white overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-terminal-bg/80 backdrop-blur border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">⬛</div>
                        <span className="font-bold tracking-tight text-xl">BlockVista Atlas</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-sm text-terminal-text-muted">
                        <a href="#capability" className="hover:text-white transition-colors">Capabilities</a>
                        <a href="#modes" className="hover:text-white transition-colors">Modes</a>
                        <a href="#philosophy" className="hover:text-white transition-colors">Philosophy</a>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                        Access Terminal
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex items-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_40%)] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="inline-block px-3 py-1 border border-terminal-accent/30 rounded-full bg-terminal-accent/10 text-terminal-accent text-xs font-mono font-bold tracking-wider">
                            INSTITUTIONAL INTELLIGENCE LAYER
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                            Decision Intelligence for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                India’s Asset Ecosystem.
                            </span>
                        </h1>
                        <p className="text-xl text-terminal-text-muted max-w-lg leading-relaxed">
                            BlockVista Atlas is a non-trading governance layer that sits <strong>above</strong> existing CRM and portfolio systems—answering the questions they cannot.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-terminal-accent text-white font-bold rounded hover:bg-blue-600 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                                Request Institutional Demo
                            </button>
                            <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded hover:bg-white/5 transition-colors">
                                Explore Architecture
                            </button>
                        </div>
                    </div>

                    {/* Abstract Visualization */}
                    <div className="relative h-[500px] w-full bg-terminal-surface border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]"></div>

                        {/* Mock UI Elements */}
                        <div className="absolute top-10 left-10 right-10 bottom-10 border border-white/10 bg-black/40 backdrop-blur rounded p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <div className="h-2 w-24 bg-white/20 rounded"></div>
                                <div className="h-2 w-8 bg-green-500 rounded"></div>
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded border border-white/5 p-4 space-y-2">
                                    <div className="h-1.5 w-12 bg-white/10 rounded"></div>
                                    <div className="h-6 w-20 bg-emerald-500/20 text-emerald-500 text-xs flex items-center justify-center rounded border border-emerald-500/30">COMPLIANT</div>
                                </div>
                                <div className="bg-white/5 rounded border border-white/5 p-4 space-y-2">
                                    <div className="h-1.5 w-12 bg-white/10 rounded"></div>
                                    <div className="h-6 w-20 bg-amber-500/20 text-amber-500 text-xs flex items-center justify-center rounded border border-amber-500/30">DRIFT DETECTED</div>
                                </div>
                            </div>
                            <div className="h-24 bg-white/5 rounded border border-white/5 mt-auto p-4 flex gap-2 items-end">
                                <div className="w-1/5 h-[40%] bg-blue-500/50 rounded-t"></div>
                                <div className="w-1/5 h-[70%] bg-blue-500/50 rounded-t"></div>
                                <div className="w-1/5 h-[50%] bg-blue-500/50 rounded-t"></div>
                                <div className="w-1/5 h-[90%] bg-blue-500 rounded-t shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                <div className="w-1/5 h-[60%] bg-blue-500/50 rounded-t"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Gap Section */}
            <section className="py-24 bg-black border-y border-white/10">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
                    <h2 className="text-3xl font-bold">The Governance Gap</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="p-6 border border-white/10 rounded hover:border-terminal-accent/50 transition-colors">
                            <div className="text-terminal-text-muted text-sm mb-2">Current Stack</div>
                            <div className="font-bold text-xl mb-4 text-white">CRM & Sales</div>
                            <p className="text-sm text-terminal-text-muted leading-relaxed">
                                Great at tracking relationships and pipelines, but blind to portfolio suitability risks and mandate drift beneath the surface.
                            </p>
                        </div>
                        <div className="p-6 border border-white/10 rounded hover:border-terminal-accent/50 transition-colors">
                            <div className="text-terminal-text-muted text-sm mb-2">Current Stack</div>
                            <div className="font-bold text-xl mb-4 text-white">Accounting</div>
                            <p className="text-sm text-terminal-text-muted leading-relaxed">
                                Accurate at reporting "what exists" and performance history, but offers zero forward-looking governance intelligence.
                            </p>
                        </div>
                        <div className="p-6 border border-terminal-accent bg-blue-900/10 rounded shadow-[0_0_30px_rgba(37,99,235,0.1)] scale-105">
                            <div className="text-terminal-accent text-sm mb-2 font-bold tracking-wider">THE BLOCKVISTA LAYER</div>
                            <div className="font-bold text-xl mb-4 text-white">Decision Intelligence</div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Atlas injects governance, risk, and suitability intelligence <strong>above</strong> your stack. It answers: "Should this exist?" not just "Does it exist?"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modes Section */}
            <section id="modes" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-4">One Brain. Four Modes.</h2>
                    <p className="text-terminal-text-muted max-w-2xl">
                        Atlas adapts its intelligence engine to the specific fiduciary responsibilities of your role in the ecosystem.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "AMC Mode", sub: "Internal Intelligence", target: "CIOs & Risk Heads", desc: "Mandate drift, liquidity stress, and cannibalization insights for fund houses." },
                        { title: "Wealth Mode", sub: "Governance Overlay", target: "Advisory Desks", desc: "Household-level lookthrough and suitability monitoring across multiple AMCs." },
                        { title: "Advisor Mode", sub: "Fiduciary Guide", target: "IFAs & MFDs", desc: "Client health scores, SIP discipline tracking, and suitability alerts." },
                        { title: "Trustee Mode", sub: "Oversight", target: "Boards & Committees", desc: "Systemic risk, compliance scoring, and transparency governance." },
                    ].map((mode, i) => (
                        <div key={i} className="group p-6 bg-terminal-surface border border-white/5 rounded-xl hover:bg-white/5 transition-all cursor-default">
                            <div className="h-1 w-12 bg-terminal-accent mb-6 group-hover:w-full transition-all duration-500"></div>
                            <h3 className="text-xl font-bold text-white mb-1">{mode.title}</h3>
                            <div className="text-xs text-terminal-accent font-mono mb-4 uppercase tracking-wider">{mode.sub}</div>
                            <p className="text-sm text-terminal-text-muted mb-4">{mode.desc}</p>
                            <div className="text-xs text-white/40 border-t border-white/5 pt-4">Designed for: <span className="text-white/70">{mode.target}</span></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 text-center text-terminal-text-muted text-sm">
                <p className="mb-4">BlockVista Atlas &copy; 2025</p>
                <div className="flex justify-center gap-6">
                    <a href="#" className="hover:text-white">Privacy</a>
                    <a href="#" className="hover:text-white">Legal Disclaimer</a>
                    <a href="#" className="hover:text-white">Contact Sales</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
