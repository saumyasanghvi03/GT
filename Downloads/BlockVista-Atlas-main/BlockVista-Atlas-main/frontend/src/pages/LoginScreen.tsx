import { useState } from 'react';
import { useMode, AtlasMode } from '../context/ModeContext';
import { useNavigate } from 'react-router-dom';
import { AuthUtils, AtlasUser } from '../utils/AuthUtils';

type ScreenState = 'LOGIN' | 'REGISTER' | 'RECOVERY' | 'PIN_REVEAL';

const LoginScreen = () => {
    const [screen, setScreen] = useState<ScreenState>('LOGIN');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Global Loading State
    const [loading, setLoading] = useState(false);

    // Register State
    const [regName, setRegName] = useState('');
    const [regRole, setRegRole] = useState<AtlasMode>('AMC');
    const [regQuestion, setRegQuestion] = useState('What is your first pet name?');
    const [regAnswer, setRegAnswer] = useState('');
    const [generatedPin, setGeneratedPin] = useState('');

    // Recovery State
    const [recName, setRecName] = useState('');
    const [recQuestion, setRecQuestion] = useState(''); // Store question text locally
    const [recAnswer, setRecAnswer] = useState('');

    const { setMode, setIsAuthenticated, setUserName } = useMode();
    const navigate = useNavigate();

    const [sessionId, setSessionId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await AuthUtils.login(code);
        setLoading(false);

        if (result.success) {
            if (result.sessionId) setSessionId(result.sessionId); // Use backend session ID

            if (result.isAdmin) {
                setMode('AMC');
                setUserName('Administrator');
                setIsAuthenticated(true);
                navigate('/');
            } else if (result.user) {
                setMode(result.user.role);
                setUserName(result.user.name);
                setIsAuthenticated(true);
                navigate('/');
            }
        } else {
            setError(result.error || 'ACCESS DENIED: Invalid Terminal Code');
            setCode('');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!regName || !regAnswer) {
            setError('All fields are required');
            return;
        }
        setLoading(true);

        const result = await AuthUtils.register(regName, regRole, regQuestion, regAnswer);
        setLoading(false);

        if (result.success && result.pin) {
            setGeneratedPin(result.pin);
            setScreen('PIN_REVEAL');
            setError('');
        } else {
            setError(result.error || 'Registration Failed');
        }
    };

    const handleRecoveryLookup = async () => {
        setLoading(true);
        setError('');
        const result = await AuthUtils.findUserByName(recName);
        setLoading(false);

        if (result.success && result.question) {
            setRecQuestion(result.question);
            setError('');
        } else {
            setError(result.error || 'User not found');
        }
    };

    const handleRecoveryReset = async () => {
        if (!recName) return;
        setLoading(true);
        const result = await AuthUtils.resetPin(recName, recAnswer);
        setLoading(false);

        if (result.success && result.pin) {
            setGeneratedPin(result.pin);
            setScreen('PIN_REVEAL');
        } else {
            setError(result.error || 'Security Answer Incorrect');
        }
    };

    const securityQuestions = [
        "What is your first pet name?",
        "What city were you born in?",
        "What is your mother's maiden name?",
        "What is your favorite stock ticker?"
    ];

    return (
        <div className="min-h-screen bg-terminal-bg flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono text-terminal-text">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.9)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

            <div className="z-10 w-full max-w-md">
                <div className="mb-8 text-center animate-fade-in-down">
                    <div className="text-6xl mb-4">🏛️</div>
                    <h1 className="text-3xl font-bold tracking-widest uppercase">BlockVista Atlas</h1>
                    <p className="text-terminal-text-muted mt-2 text-sm">Restricted Access Terminal</p>
                </div>

                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-8 shadow-2xl relative overflow-hidden animate-fade-in-up">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-terminal-accent to-transparent opacity-50"></div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="mb-4 text-red-500 text-xs text-center font-bold animate-pulse bg-red-900/10 p-2 rounded border border-red-500/20 flex flex-col gap-1 items-center">
                            <span>⚠️ {error}</span>
                            {error.toLowerCase().includes('expired') && (
                                <button
                                    onClick={() => { setError(''); setScreen('RECOVERY'); }}
                                    className="bg-red-500 text-white px-2 py-1 rounded text-[10px] uppercase hover:bg-red-600 transition-colors"
                                >
                                    Reset Now
                                </button>
                            )}
                        </div>
                    )}

                    {/* LOADING OVERLAY */}
                    {loading && (
                        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                            <div className="w-8 h-8 border-2 border-terminal-accent border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* === LOGIN VIEW === */}
                    {screen === 'LOGIN' && (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-terminal-text-muted mb-2">
                                    Enter Access Code (6-Digit)
                                </label>
                                <input
                                    type="password"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full bg-terminal-bg border border-terminal-border rounded p-3 text-center text-2xl tracking-[0.5em] focus:border-terminal-accent focus:ring-1 focus:ring-terminal-accent outline-none transition-all placeholder-terminal-text-muted/30"
                                    placeholder="••••••"
                                    maxLength={6}
                                    autoFocus
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-terminal-accent text-white font-bold py-3 rounded hover:bg-terminal-accent/90 transition-all uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(234,179,8,0.3)] disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Verify Identity'}
                            </button>
                            <div className="flex justify-between text-xs text-terminal-text-muted mt-4">
                                <button type="button" onClick={() => { setError(''); setScreen('REGISTER'); }} className="hover:text-terminal-accent underline">Create Identity</button>
                                <button type="button" onClick={() => { setError(''); setScreen('RECOVERY'); }} className="hover:text-terminal-accent underline">Forgot Code?</button>
                            </div>
                        </form>
                    )}

                    {/* === REGISTER VIEW === */}
                    {screen === 'REGISTER' && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <h2 className="text-lg font-bold text-center mb-4">Create New Identity</h2>
                            <div>
                                <label className="block text-xs text-terminal-text-muted mb-1">Full Name</label>
                                <input value={regName} onChange={e => setRegName(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-sm focus:border-terminal-accent outline-none" placeholder="e.g. John Doe" disabled={loading} />
                            </div>
                            <div>
                                <label className="block text-xs text-terminal-text-muted mb-1">Role Permission</label>
                                <select title="Role" value={regRole} onChange={e => setRegRole(e.target.value as AtlasMode)} className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-sm focus:border-terminal-accent outline-none" disabled={loading}>
                                    <option value="AMC">AMC (Asset Manager)</option>
                                    <option value="Wealth">Wealth Manager</option>
                                    <option value="Advisor">Advisor</option>
                                    <option value="Institutional">Institutional</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-terminal-text-muted mb-1">Security Question</label>
                                <select title="Security Question" value={regQuestion} onChange={e => setRegQuestion(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-sm focus:border-terminal-accent outline-none" disabled={loading}>
                                    {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-terminal-text-muted mb-1">Security Answer</label>
                                <input value={regAnswer} onChange={e => setRegAnswer(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-sm focus:border-terminal-accent outline-none" placeholder="Is case insensitive" disabled={loading} />
                            </div>
                            <div className="pt-2 flex gap-2">
                                <button type="button" onClick={() => setScreen('LOGIN')} className="flex-1 bg-terminal-surface border border-terminal-border text-terminal-text py-2 rounded text-xs hover:bg-terminal-bg" disabled={loading}>Cancel</button>
                                <button type="submit" className="flex-1 bg-terminal-accent text-white py-2 rounded text-xs font-bold hover:bg-terminal-accent/90" disabled={loading}>{loading ? 'Generating...' : 'Generate Code'}</button>
                            </div>
                        </form>
                    )}

                    {/* === RECOVERY VIEW === */}
                    {screen === 'RECOVERY' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-center mb-4">Identity Recovery</h2>
                            {!recQuestion ? (
                                <>
                                    <div>
                                        <label className="block text-xs text-terminal-text-muted mb-1">Enter Registered Name</label>
                                        <input value={recName} onChange={e => setRecName(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-sm focus:border-terminal-accent outline-none" placeholder="Exact full name" disabled={loading} />
                                    </div>
                                    <div className="pt-2 flex gap-2">
                                        <button onClick={() => setScreen('LOGIN')} className="flex-1 bg-terminal-surface border border-terminal-border text-terminal-text py-2 rounded text-xs hover:bg-terminal-bg" disabled={loading}>Cancel</button>
                                        <button onClick={handleRecoveryLookup} className="flex-1 bg-terminal-accent text-white py-2 rounded text-xs font-bold hover:bg-terminal-accent/90" disabled={loading}>{loading ? 'Searching...' : 'Find Identity'}</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="p-3 bg-terminal-bg/50 border border-terminal-border rounded text-sm mb-2">
                                        <p className="text-xs text-terminal-text-muted">Security Question:</p>
                                        <p className="font-medium">{recQuestion}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-terminal-text-muted mb-1">Your Answer</label>
                                        <input value={recAnswer} onChange={e => setRecAnswer(e.target.value)} className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-sm focus:border-terminal-accent outline-none" placeholder="Answer..." disabled={loading} />
                                    </div>
                                    <div className="pt-2 flex gap-2">
                                        <button onClick={() => { setRecQuestion(''); setScreen('LOGIN'); }} className="flex-1 bg-terminal-surface border border-terminal-border text-terminal-text py-2 rounded text-xs hover:bg-terminal-bg" disabled={loading}>Cancel</button>
                                        <button onClick={handleRecoveryReset} className="flex-1 bg-terminal-accent text-white py-2 rounded text-xs font-bold hover:bg-terminal-accent/90" disabled={loading}>{loading ? 'Resetting...' : 'Reset Code'}</button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* === PIN REVEAL === */}
                    {screen === 'PIN_REVEAL' && (
                        <div className="text-center space-y-6">
                            <h2 className="text-xl font-bold text-green-500">Identity Secure</h2>
                            <p className="text-sm text-terminal-text-muted">Your new access code is below. <br />Memorize it immediately.</p>

                            <div className="bg-terminal-bg border-2 border-green-500/50 p-6 rounded-lg">
                                <span className="text-4xl font-mono tracking-[0.2em] font-bold text-white">{generatedPin}</span>
                            </div>

                            <button
                                onClick={() => {
                                    setScreen('LOGIN');
                                    // Reset States
                                    setRegQuestion('What is your first pet name?');
                                    setRegName(''); setRegAnswer(''); setRecName(''); setRecQuestion('');
                                }}
                                className="w-full bg-terminal-surface border border-terminal-border text-terminal-text py-3 rounded hover:bg-terminal-bg hover:text-white transition-colors"
                            >
                                Return to Login
                            </button>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-terminal-border text-center">
                        <div className="text-[10px] text-terminal-text-muted">
                            SECURE CONNECTION ESTABLISHED
                            <br />
                            IP: 192.168.0.1 • SESSION ID: {sessionId}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
