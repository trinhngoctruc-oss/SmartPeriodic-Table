import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, X, Info, Beaker, GraduationCap, PlayCircle, Trophy, Gamepad2, ArrowRight, CheckCircle2, XCircle, RotateCcw, LayoutGrid, Search, Users, Copy, Loader2, UserCircle2 } from 'lucide-react';
import { elements, categories, Element, blockColors, categoryColors } from './data';
import { generateQuiz, Question } from './quizService';
import { useAuth, registerUser, createRoom, joinRoom, updateScore, finishGame, startGame, GameRoom, Player, setPlayerFinished } from './lib/gameService';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function App() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<number | null>(null);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth & Multiplayer State
  const { user, authError } = useAuth();
  const [displayName, setDisplayName] = useState(localStorage.getItem('periodic_app_display_name') || '');
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const [gameMode, setGameMode] = useState<'single' | 'multi' | null>(null);
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [nameInput, setNameInput] = useState('');
  const prevStatusRef = useRef<string | null>(null);

  // Quiz State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const scoreRef = useRef(0);

  // Removed redundant scoreRef sync useEffect as it's now updated directly in handleAnswerSelect

  const startQuiz = () => {
    const newQuiz = generateQuiz(elements, 15);
    setQuizQuestions(newQuiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowResult(false);
    setIsQuizOpen(true);
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(prev => {
        const newScore = prev + 1;
        scoreRef.current = newScore;
        return newScore;
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      if (gameMode === 'multi' && room && user) {
        setPlayerFinished(room.roomId, user.uid, scoreRef.current).catch(console.error);
      } else {
        setShowResult(true);
      }
    }
  };

  useEffect(() => {
    if (gameMode === 'multi' && room && user) {
      updateScore(room.roomId, user.uid, score);
    }
  }, [score, gameMode, room?.roomId, user?.uid]);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    if (roomCode && gameMode === 'multi') {
      unsub = onSnapshot(doc(db, 'rooms', roomCode), (snap) => {
        if (snap.exists()) {
          const roomData = snap.data() as GameRoom;
          setRoom(roomData);

          // Sync quiz questions
          if (roomData.questions) {
            // Check if questions are actually different (important for new games in same room)
            const questionsChanged = JSON.stringify(roomData.questions) !== JSON.stringify(quizQuestions);
            if (questionsChanged) {
              setQuizQuestions(roomData.questions);
            }
          }

          // Reset local state if we transitioned from waiting/finished to playing
          if (roomData.status === 'playing' && prevStatusRef.current !== 'playing') {
            resetGameState();
          }
          
          // Auto-finish logic: transitioned to finished if both players are done or hard timeout reached
          const players = Object.values(roomData.players) as Player[];
          const allFinished = players.length >= 2 && players.every(p => p.hasFinished);
          
          const startTime = (roomData.startTime as any)?.toMillis?.() || (typeof roomData.startTime === 'number' ? roomData.startTime : Date.now());
          const isHardTimedOut = Date.now() > (startTime + (roomData.duration + 5) * 1000); // 5s grace period

          if (roomData.status === 'playing' && (allFinished || isHardTimedOut)) {
            // Both finished or hard timeout, can show results immediately locally
            setShowResult(true);
            // Host also updates the global status
            if (roomData.hostId === user?.uid) {
              finishGame(roomData.roomId);
            }
          }

          if (roomData.status === 'finished') {
            setShowResult(true);
          }
          
          prevStatusRef.current = roomData.status;
        }
      }, (err) => {
        console.error("Room Snapshot Error:", err);
        if (err.code === 'permission-denied') {
          setError("Bạn không có quyền truy cập phòng này hoặc quyền hạn của bạn đã bị từ chối.");
          setRoom(null);
          setIsQuizOpen(false);
          setGameMode(null);
        } else if (err.code === 'resource-exhausted') {
          setError("Hạn mức hệ thống đã tạm thời hết (Quota exceeded). Vui lòng thử lại sau.");
        }
      });
    }
    return () => {
      if (unsub) unsub();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roomCode, gameMode]);

  // Single-player Timer Effect
  useEffect(() => {
    if (gameMode === 'single' && isQuizOpen && !showResult) {
      const startTime = Date.now();
      const duration = 300;
      setTimeLeft(duration);
      
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, duration - elapsed);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          setShowResult(true);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameMode, isQuizOpen, showResult]);

  // Multi-player Timer Sync Effect
  useEffect(() => {
    if (gameMode === 'multi' && room?.status === 'playing' && room.startTime) {
      const startMillis = (room.startTime as any).toMillis?.() || (typeof room.startTime === 'number' ? room.startTime : Date.now());
      
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startMillis) / 1000);
        const remaining = Math.max(0, room.duration - elapsed);
        
        setTimeLeft(remaining);

        if (remaining <= 0 && !showResult) {
          // Time is up
          if (user && room.roomId) {
            setPlayerFinished(room.roomId, user.uid, scoreRef.current).catch(console.error);
          }
          // In multi-player, we wait for the onSnapshot auto-finish logic 
          // to trigger setShowResult(true) for everyone simultaneously
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameMode, room?.status, room?.startTime, room?.duration, user?.uid, showResult, room?.roomId]);

  const resetGameState = () => {
    console.log("Resetting Game State...");
    setCurrentQuestionIndex(0);
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(300);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setError(null);
  };

  const handleCreateRoom = async () => {
    if (!user || !displayName) return;
    try {
      resetGameState();
      const questions = generateQuiz(elements, 15);
      const code = await createRoom(user.uid, displayName, questions);
      setRoomCode(code);
      setQuizQuestions(questions);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleJoinRoom = async (code: string) => {
    if (!user || !displayName || !code) return;
    setIsJoining(true);
    resetGameState();
    try {
      await joinRoom(code.toUpperCase(), user.uid, displayName);
      const snap = await getDoc(doc(db, 'rooms', code.toUpperCase()));
      if (snap.exists()) {
        const data = snap.data() as GameRoom;
        setQuizQuestions(data.questions as Question[]);
        setRoomCode(code.toUpperCase());
        setRoom(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsJoining(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speak = (element: Element) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${element.name}`;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Force English pronunciation
      utterance.lang = 'en-US';
      
      // Try to find an English voice explicitly
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleElementClick = (element: Element) => {
    setSelectedElement(element);
  };

  const groupRomanMapping: Record<number, string> = {
    1: "IA", 2: "IIA", 3: "IIIB", 4: "IVB", 5: "VB", 6: "VIB", 7: "VIIB", 8: "VIIIB", 9: "VIIIB", 10: "VIIIB",
    11: "IB", 12: "IIB", 13: "IIIA", 14: "IVA", 15: "VA", 16: "VIA", 17: "VIIA", 18: "VIIIA"
  };

  const getShells = (num: number) => {
    const shells = [];
    let remaining = num;
    const capacities = [2, 8, 18, 32, 32, 18, 8];
    for (const cap of capacities) {
      if (remaining <= 0) break;
      const count = Math.min(remaining, cap);
      shells.push(count);
      remaining -= count;
    }
    return shells;
  };

  const isElementInCategory = (element: Element, categoryKey: string | null) => {
    if (!categoryKey) return true;
    if (categoryKey === 'metal') {
      return ['alkali-metal', 'alkaline-earth', 'transition-metal', 'post-transition-metal', 'lanthanide', 'actinide'].includes(element.category);
    }
    if (categoryKey === 'nonmetal') {
      return ['nonmetal', 'hydrogen', 'halogen', 'metalloid'].includes(element.category);
    }
    return element.category === categoryKey || element.block === categoryKey;
  };

  const renderGrid = () => {
    const grid = [];
    // Main Table (Periods 1-7, Groups 1-18)
    for (let p = 1; p <= 7; p++) {
      // Add Period Label at the start of each row
      grid.push(
        <button 
          key={`period-label-${p}`} 
          onClick={() => {
            setActivePeriod(activePeriod === p ? null : p);
            setActiveGroup(null);
            setActiveCategory(null);
          }}
          className={`flex items-center justify-center text-[10px] font-bold pr-2 transition-colors hover:text-blue-400 ${activePeriod === p ? 'text-blue-400' : 'text-slate-500'}`}
        >
         Chu kỳ {p}
        </button>
      );

      for (let g = 1; g <= 18; g++) {
        // Special cases for Lanthanides (57-71) and Actinides (89-103) placeholders in main table
        if (p === 6 && g === 3) {
          grid.push(
            <div key="lanthanides-placeholder" className="flex items-center justify-center border border-slate-700 rounded-md bg-slate-800/50 text-[8px] text-slate-500 font-bold p-1 text-center">
             57-71 <br/>Họ Lanthanides
            </div>
          );
          continue;
        }
        if (p === 7 && g === 3) {
          grid.push(
            <div key="actinides-placeholder" className="flex items-center justify-center border border-slate-700 rounded-md bg-slate-800/50 text-[8px] text-slate-500 font-bold p-1 text-center">
              89-103 <br/>Họ Actinides
            </div>
          );
          continue;
        }

        const element = elements.find(e => e.period === p && e.group === g && !((e.number >= 57 && e.number <= 71) || (e.number >= 89 && e.number <= 103)));
        
        if (element) {
          const isSearchMatch = searchQuery && (
            element.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            element.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
            element.number.toString().includes(searchQuery)
          );
          const isFilterMatch = (
            isElementInCategory(element, activeCategory) &&
            (!activePeriod || element.period === activePeriod) &&
            (!activeGroup || element.group === activeGroup)
          );
          
          const hasActiveFilters = activeCategory || activePeriod || activeGroup || searchQuery;
          const isDimmed = hasActiveFilters && !(
            (!searchQuery || isSearchMatch) && 
            isFilterMatch
          );

          grid.push(
            <motion.div
              key={element.number}
              layoutId={`element-${element.number}`}
              onClick={() => handleElementClick(element)}
              className={`relative flex flex-col items-center justify-center p-1 border border-slate-400/30 rounded-md cursor-pointer hover:scale-110 transition-all shadow-md w-full aspect-square sm:h-20 text-gray-900 ${isDimmed ? 'opacity-20 grayscale scale-95' : 'opacity-100 ring-2 ring-blue-400/0 shadow-[0_0_15px_rgba(96,165,250,0)]'} ${!isDimmed && searchQuery ? 'ring-blue-400 ring-offset-2 ring-offset-slate-900 shadow-[0_0_20px_rgba(96,165,250,0.5)] z-10' : ''}`}
              style={{ backgroundColor: element.color }}
              whileHover={{ zIndex: 10 }}
            >
              <span className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-bold">{element.number}</span>
              <span className="text-sm sm:text-xl font-bold leading-none">{element.symbol}</span>
              <span className="text-[9px] font-medium truncate w-full text-center px-1 leading-tight mb-1">{element.name}</span>
              <span className="absolute bottom-0.5 left-0 w-full text-center text-[8px] sm:text-[10px] font-bold opacity-70">{element.atomicMass}</span>
            </motion.div>
          );
        } else {
          grid.push(<div key={`empty-${p}-${g}`} className="w-full h-20" />);
        }
      }
    }
    return grid;
  };

  const renderBottomRows = () => {
    const lanthanides = elements.filter(e => e.number >= 57 && e.number <= 71).sort((a, b) => a.number - b.number);
    const actinides = elements.filter(e => e.number >= 89 && e.number <= 103).sort((a, b) => a.number - b.number);

    return (
      <div className="mt-8 space-y-2">
        <div className="flex gap-1 ml-[calc((100%/19)*3)] relative">
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] rotate-180 text-[10px] font-bold text-blue-400 uppercase tracking-widest whitespace-nowrap">
            Họ Lanthanides
          </div>
          {lanthanides.map(element => {
            const isSearchMatch = searchQuery && (
              element.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              element.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
              element.number.toString().includes(searchQuery)
            );
            const isFilterMatch = (
              isElementInCategory(element, activeCategory) &&
              (!activePeriod || element.period === activePeriod) &&
              (!activeGroup || element.group === activeGroup)
            );
            
            const hasActiveFilters = activeCategory || activePeriod || activeGroup || searchQuery;
            const isDimmed = hasActiveFilters && !(
              (!searchQuery || isSearchMatch) && 
              isFilterMatch
            );

            return (
              <motion.div
                key={element.number}
                onClick={() => handleElementClick(element)}
                className={`relative flex flex-col items-center justify-center p-1 border border-slate-400/30 rounded-md cursor-pointer hover:scale-110 transition-all shadow-md w-[calc(100%/19-4px)] h-20 text-gray-900 ${isDimmed ? 'opacity-20 grayscale scale-95' : 'opacity-100 ring-2 ring-blue-400/0 shadow-[0_0_15px_rgba(96,165,250,0)]'} ${!isDimmed && searchQuery ? 'ring-blue-400 ring-offset-2 ring-offset-slate-900 shadow-[0_0_20px_rgba(96,165,250,0.5)] z-10' : ''}`}
                style={{ backgroundColor: element.color }}
              >
                <span className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-bold">{element.number}</span>
                <span className="text-sm sm:text-xl font-bold leading-none">{element.symbol}</span>
                <span className="text-[9px] font-medium truncate w-full text-center px-1 leading-tight mb-1">{element.name}</span>
                <span className="absolute bottom-0.5 left-0 w-full text-center text-[8px] sm:text-[10px] font-bold opacity-70">{element.atomicMass}</span>
              </motion.div>
            );
          })}
        </div>
        <div className="flex gap-1 ml-[calc((100%/19)*3)] relative">
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] rotate-180 text-[10px] font-bold text-emerald-400 uppercase tracking-widest whitespace-nowrap">
            Họ Actinides
          </div>
          {actinides.map(element => {
            const isSearchMatch = searchQuery && (
              element.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              element.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
              element.number.toString().includes(searchQuery)
            );
            const isFilterMatch = (
              isElementInCategory(element, activeCategory) &&
              (!activePeriod || element.period === activePeriod) &&
              (!activeGroup || element.group === activeGroup)
            );
            
            const hasActiveFilters = activeCategory || activePeriod || activeGroup || searchQuery;
            const isDimmed = hasActiveFilters && !(
              (!searchQuery || isSearchMatch) && 
              isFilterMatch
            );

            return (
              <motion.div
                key={element.number}
                onClick={() => handleElementClick(element)}
                className={`relative flex flex-col items-center justify-center p-1 border border-slate-400/30 rounded-md cursor-pointer hover:scale-110 transition-all shadow-md w-[calc(100%/19-4px)] h-20 text-gray-900 ${isDimmed ? 'opacity-20 grayscale scale-95' : 'opacity-100 ring-2 ring-blue-400/0 shadow-[0_0_15px_rgba(96,165,250,0)]'} ${!isDimmed && searchQuery ? 'ring-blue-400 ring-offset-2 ring-offset-slate-900 shadow-[0_0_20px_rgba(96,165,250,0.5)] z-10' : ''}`}
                style={{ backgroundColor: element.color }}
              >
                <span className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-bold">{element.number}</span>
                <span className="text-sm sm:text-xl font-bold leading-none">{element.symbol}</span>
                <span className="text-[9px] font-medium truncate w-full text-center px-1 leading-tight mb-1">{element.name}</span>
                <span className="absolute bottom-0.5 left-0 w-full text-center text-[8px] sm:text-[10px] font-bold opacity-70">{element.atomicMass}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };
;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="p-6 text-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              BẢNG TUẦN HOÀN THÔNG MINH - SMART PERIODIC TABLE
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsGameMenuOpen(true)}
              className="relative group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full font-bold text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>GAME TÌM NGUYÊN TỐ</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </motion.button>

            <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
              <GraduationCap className="w-5 h-5" />
              <span>Lớp 7A3 - THCS Xuân Hòa</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 sm:p-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, ký hiệu hoặc số hiệu nguyên tử..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500 text-slate-100 backdrop-blur-sm shadow-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center max-w-5xl mx-auto p-4 bg-slate-800/20 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
          {Object.entries(categories).map(([key, label]) => {
            const color = categoryColors[key] || blockColors[key] || '#334155';
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(isActive ? null : key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all shadow-sm ${isActive ? 'bg-blue-600 border-blue-400 text-white scale-105' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-bold tracking-wider">{label}</span>
              </button>
            );
          })}
          {(activeCategory || activePeriod || activeGroup || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory(null);
                setActivePeriod(null);
                setActiveGroup(null);
                setSearchQuery('');
              }}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4 px-2"
            >
              Xóa lọc
            </button>
          )}
        </div>

        {/* Periodic Table Grid */}
        <div className="relative overflow-x-auto pb-8 scrollbar-hide">
          <div className="grid grid-cols-[3rem_repeat(18,minmax(0,1fr))] gap-1 min-w-[1250px]">
            {/* Empty corner for Period/Group labels intersection */}
            <div className="w-12 h-8" />
            
            {/* Group Numbers */}
            {Array.from({ length: 18 }).map((_, i) => {
              const groupNum = i + 1;
              return (
                <button 
                  key={`group-${groupNum}`} 
                  onClick={() => {
                    setActiveGroup(activeGroup === groupNum ? null : groupNum);
                    setActivePeriod(null);
                    setActiveCategory(null);
                  }}
                  className={`text-center text-[10px] font-bold pb-2 transition-colors hover:text-blue-400 ${activeGroup === groupNum ? 'text-blue-400' : 'text-slate-500'}`}
                >
                  Nhóm {groupRomanMapping[groupNum]}
                </button>
              );
            })}
            
            {/* The Grid */}
            {renderGrid()}
          </div>

          {/* Bottom Rows (Lanthanides & Actinides) */}
          <div className="min-w-[1250px]">
            {renderBottomRows()}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Info className="w-6 h-6" />
              <h3 className="font-bold text-lg">Hướng dẫn sử dụng</h3>
            </div>
            <ul className="text-slate-400 text-sm space-y-2 list-disc pl-4">
              <li>Tra cứu nguyên tố bằng cách nhấn vào nguyên tố để xem thông tin chi tiết.</li>
              <li>Nhấn nút "Nghe đọc" để luyện đọc tên nguyên tố.</li>
              <li>Bảng bao gồm đầy đủ 118 nguyên tố hóa học.</li>
              <li className="text-blue-300 font-medium">Hỗ trợ cài đặt trên Android và iOS.</li>
            </ul>
          </div>
          <div className="md:col-span-2 bg-gradient-to-br from-blue-600/20 to-teal-600/20 p-6 rounded-2xl border border-blue-500/20 flex items-center justify-center text-center">
            <div>
              <h2 className="text-xl font-bold mb-2">Dự án Bảng tuần hoàn thông minh - Học sinh lớp 7A3 Trường THCS Xuân Hòa</h2>
              <p className="text-slate-300">
                Ứng dụng giúp học sinh dễ dàng tiếp cận và ghi nhớ các nguyên tố hóa học thông qua hình ảnh và âm thanh trực quan. Đồng thời có thể trải nghiệm GAME TÌM NGUYÊN TỐ để hỗ trợ ghi nhớ thêm các nguyên tố hóa học
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 p-8 border-t border-slate-800 text-center text-slate-500">
        <p className="text-sm">Nhóm thực hiện: <span className="text-blue-400 font-bold uppercase tracking-wider">Học sinh Lớp 7A3 - Trường THCS Xuân Hòa</span></p>
        <p className="text-xs mt-2">© 2026 Ứng dụng Giáo dục Hóa học - Phiên bản 2.0</p>
      </footer>

      {/* Element Detail Modal */}
      <AnimatePresence>
        {selectedElement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/95 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border-0 sm:border sm:border-slate-700 w-full h-full sm:h-[90vh] sm:max-w-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
            >
              <button
                onClick={() => {
                  setSelectedElement(null);
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }}
                className="absolute top-10 right-6 sm:top-6 sm:right-6 p-3 bg-slate-800/90 hover:bg-slate-700 rounded-full text-white transition-colors z-[60] shadow-2xl border border-slate-600/50 backdrop-blur-md active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="h-full overflow-y-auto">
                {/* Content Section */}
                <div className="p-8">
                  {/* Image Section - Moved to top */}
                  <div className="relative rounded-2xl overflow-hidden h-48 sm:h-64 border border-slate-700 mb-8">
                    <img
                      src={selectedElement.image}
                      alt={selectedElement.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-lg ${selectedElement.color} text-slate-900 shadow-xl`}>
                      <div className="text-[10px] font-bold opacity-70">Hình ảnh minh họa</div>
                      <div className="text-xl font-black">{selectedElement.name}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-slate-800 text-blue-400 text-xs font-bold px-2 py-1 rounded border border-slate-700">
                          Số hiệu nguyên tử: {selectedElement.number}
                        </span>
                        <h2 className="text-3xl font-bold text-white">{selectedElement.name}</h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <p className="text-blue-400 font-mono text-sm">{selectedElement.latinName}</p>
                        <p className="text-teal-400 font-mono text-sm bg-teal-400/10 px-2 py-0.5 rounded border border-teal-400/20">
                          Phiên âm: {selectedElement.phonetic}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => speak(selectedElement)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all self-start sm:self-center ${isSpeaking ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-blue-400 border border-slate-700'}`}
                    >
                      <PlayCircle className="w-5 h-5" />
                      <span>{isSpeaking ? 'Đang đọc...' : 'Nghe đọc'}</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Ký hiệu hóa học</h4>
                      <p className="text-2xl font-black text-blue-400">{selectedElement.symbol}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Khối lượng nguyên tử trung bình</h4>
                      <p className="text-xs sm:text-sm text-white">{selectedElement.atomicMass} (Đơn vị Amu)</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Nhóm / Chu kỳ</h4>
                      <p className="text-xs sm:text-sm text-white">Nhóm {groupRomanMapping[selectedElement.group]} / Chu kỳ {selectedElement.period}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Loại nguyên tố</h4>
                      <p className="text-xs sm:text-sm text-white">{categories[selectedElement.category as keyof typeof categories]}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 col-span-2">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Tính chất đặc trưng</h4>
                      <p className="text-xs sm:text-sm text-white">{selectedElement.characteristics}</p>
                    </div>
                  </div>

                  {/* Electron Shell Visualization */}
                  <div className="mb-6 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Mô hình Electron</h4>
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                      <div className="relative w-32 h-32 flex items-center justify-center" style={{ perspective: '800px' }}>
                        <div className="absolute w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10" />
                        {getShells(selectedElement.number).map((count, i) => (
                          <motion.div
                            key={i}
                            className="absolute border border-blue-500/30 rounded-full"
                            style={{
                              width: `${(i + 1) * 30 + 20}px`,
                              height: `${(i + 1) * 30 + 20}px`,
                              transformStyle: 'preserve-3d'
                            }}
                            animate={{ 
                              rotateZ: 360,
                              rotateX: [0, 20, 0],
                              rotateY: [0, 20, 0]
                            }}
                            transition={{ 
                              rotateZ: { duration: 25 / (i + 1), repeat: Infinity, ease: "linear" },
                              rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                              rotateY: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                            }}
                          >
                            {Array.from({ length: count }).map((_, j) => (
                              <div
                                key={j}
                                className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_5px_rgba(96,165,250,0.5)]"
                                style={{
                                  top: '50%',
                                  left: '50%',
                                  transform: `rotate(${(j * 360) / count}deg) translate(${(i * 15) + 10 + 15}px) rotate(-${(j * 360) / count}deg)`,
                                  marginTop: '-4px',
                                  marginLeft: '-4px',
                                }}
                              />
                            ))}
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-bold text-slate-300">Cấu hình lớp:</p>
                        <div className="flex flex-wrap gap-2">
                          {getShells(selectedElement.number).map((count, i) => (
                            <div key={i} className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg">
                              <span className="text-[10px] text-blue-400 font-bold block">Lớp {i + 1}</span>
                              <span className="text-lg font-black text-white">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-blue-900/20 p-3 rounded-xl border border-blue-500/20 col-span-2">
                        <h4 className="text-[10px] font-bold text-blue-400 uppercase mb-1">Cấu hình electron</h4>
                        <p className="text-xs sm:text-sm text-blue-100 font-mono">
                          {selectedElement.electronConfiguration.split(' ').map((part, idx) => {
                            const match = part.match(/([1-7][spdf])(\d+)/);
                            if (match) {
                              return <span key={idx}>{match[1]}<sup>{match[2]}</sup> </span>;
                            }
                            return <span key={idx}>{part} </span>;
                          })}
                        </p>
                      </div>
                      <div className="bg-teal-900/20 p-3 rounded-xl border border-teal-500/20">
                        <h4 className="text-[10px] font-bold text-teal-400 uppercase mb-1">Độ âm điện & Số oxi hóa</h4>
                        <p className="text-xs sm:text-sm text-teal-100">
                          {selectedElement.electronegativity} | {selectedElement.oxidationStates}
                        </p>
                      </div>
                      <div className="bg-orange-900/20 p-3 rounded-xl border border-orange-500/20">
                        <h4 className="text-[10px] font-bold text-orange-400 uppercase mb-1">Nhiệt độ nóng chảy/Nhiệt độ sôi</h4>
                        <p className="text-xs sm:text-sm text-orange-100">
                          {selectedElement.meltingPoint} / {selectedElement.boilingPoint}
                        </p>
                      </div>
                      <div className="bg-purple-900/20 p-3 rounded-xl border border-purple-500/20 col-span-2">
                        <h4 className="text-[10px] font-bold text-purple-400 uppercase mb-1">Người tìm ra</h4>
                        <p className="text-xs sm:text-sm text-purple-100">{selectedElement.discoverer}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2">Ứng dụng</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedElement.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Game Choice Menu */}
      <AnimatePresence>
        {isGameMenuOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsGameMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Chọn chế độ chơi</h2>
                <p className="text-slate-400">Thử thách kiến thức hóa học của bạn</p>
              </div>

              {!displayName ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Nhập tên của bạn để bắt đầu</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Tên của bạn..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = nameInput.trim();
                            if (val && user) {
                              setDisplayName(val);
                              registerUser(user.uid, val);
                            }
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          const val = nameInput.trim();
                          if (val && user) {
                            setDisplayName(val);
                            registerUser(user.uid, val);
                          }
                        }}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                      >
                        LƯU
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">Tên này sẽ hiển thị thi đấu với người khác</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  <button 
                    onClick={() => {
                      setGameMode('single');
                      setIsGameMenuOpen(false);
                      startQuiz();
                    }}
                    className="flex flex-col items-start gap-1 p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-2 text-white font-bold">
                      <UserCircle2 className="w-5 h-5 text-blue-400" />
                      <span>Chơi đơn</span>
                    </div>
                    <span className="text-sm text-slate-400">Trả lời 15 câu hỏi trong thời gian sớm nhất</span>
                  </button>

                  <button 
                    onClick={() => {
                      setGameMode('multi');
                      setIsGameMenuOpen(false);
                      setIsQuizOpen(true); // Open the lobby/MP UI
                    }}
                    className="flex flex-col items-start gap-1 p-6 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 rounded-2xl transition-all"
                  >
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <Users className="w-5 h-5" />
                      <span>Chơi đối kháng</span>
                    </div>
                    <span className="text-sm text-slate-400">Tạo phòng và thách đấu với bạn bè qua mã phòng</span>
                  </button>

                  <div className="pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <UserCircle2 className="w-3 h-3" />
                      Đang đăng nhập: {displayName}
                    </span>
                    <button 
                      onClick={() => setDisplayName('')}
                      className="hover:text-white transition-colors"
                    >
                      Đổi tên
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quiz / Multiplayer Lobby Modal */}
      <AnimatePresence>
        {isQuizOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative"
            >
              {error && (
                <div className="absolute top-4 left-4 right-4 z-[70] p-4 bg-red-500/90 backdrop-blur-md border border-red-400/50 rounded-2xl text-white text-sm flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {gameMode === 'multi' && !room ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Chế độ Đối kháng</h2>
                  <p className="text-slate-400 mb-8">Tạo phòng mới hoặc nhập mã để tham gia</p>

                  {authError && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm">
                      <p className="font-bold mb-1">Lỗi kết nối:</p>
                      <p>{authError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                      <h3 className="font-bold text-white mb-4">Bạn có mã phòng?</h3>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="MÃ PHÒNG"
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono uppercase text-center"
                          value={roomCode}
                          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        />
                        <button 
                          onClick={() => handleJoinRoom(roomCode)}
                          disabled={!roomCode || isJoining}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
                        >
                          {isJoining ? <Loader2 className="w-5 h-5 animate-spin" /> : 'VÀO'}
                        </button>
                      </div>
                      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Hoặc</span></div>
                    </div>

                    <button 
                      onClick={handleCreateRoom}
                      className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-5 h-5 text-blue-400" />
                      Tạo phòng mới
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      setIsQuizOpen(false);
                      setGameMode(null);
                    }}
                    className="mt-8 text-slate-500 hover:text-white transition-colors"
                  >
                    Quay lại
                  </button>
                </div>
              ) : gameMode === 'multi' && room?.status === 'waiting' ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">Đang đợi đối thủ...</h2>
                  <p className="text-slate-400 mb-8">Chia sẻ mã bên dưới để mời bạn bè</p>

                  <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 mb-8">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Mã phòng</div>
                    <div className="text-5xl font-black text-blue-400 font-mono tracking-widest flex items-center justify-center gap-4">
                      {room.roomId}
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(room.roomId);
                          alert('Đã chép mã phòng!');
                        }}
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-8 mb-8">
                    {(Object.values(room.players) as Player[]).map((p, idx) => {
                      const isHost = room.hostId === p.userId;
                      return (
                        <div key={p.userId} className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ring-4 ${p.userId === user?.uid ? 'bg-blue-500 ring-blue-500/20' : 'bg-amber-500 ring-amber-500/20'}`}>
                              {p.name?.[0] || '?'}
                            </div>
                            {isHost && (
                              <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[8px] font-black px-1 rounded-sm border border-slate-900 shadow-sm">
                                HOST
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-bold text-white flex items-center gap-1">
                             {p.name || 'Người chơi'} {p.userId === user?.uid && <span className="text-[10px] text-blue-400">(Bạn)</span>}
                          </span>
                          <span className="text-[10px] text-green-400 font-bold uppercase">Sẵn sàng</span>
                        </div>
                      );
                    })}
                    
                    {Object.keys(room.players).length < 2 && (
                      <>
                        <div className="h-px w-12 bg-slate-800" />
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 border border-slate-700 border-dashed">
                            ?
                          </div>
                          <span className="text-sm font-bold text-slate-600">Đang đợi...</span>
                        </div>
                      </>
                    )}
                  </div>

                  {Object.keys(room.players).length >= 2 && (() => {
                    // Host is either specifically set, or the one with the earliest activity (fallback)
                    const isHost = room.hostId ? room.hostId === user?.uid : 
                      (Object.values(room.players) as Player[]).sort((a, b) => a.lastActive - b.lastActive)[0]?.userId === user?.uid;
                    
                    return isHost && (
                      <button 
                        onClick={() => startGame(room.roomId, room.players)}
                        className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-green-900/20 mb-6 transition-all transform hover:scale-[1.02]"
                      >
                        BẮT ĐẦU NGAY
                      </button>
                    );
                  })()}

                  <button 
                    onClick={() => {
                      setIsQuizOpen(false);
                      setRoomCode('');
                      setRoom(null);
                    }}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    Hủy phòng
                  </button>
                </div>
              ) : (!showResult && quizQuestions.length > 0 && quizQuestions[currentQuestionIndex]) ? (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500 rounded-lg">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Thử thách</span>
                        <span className="text-sm font-bold text-slate-300">Câu {currentQuestionIndex + 1} / 15</span>
                      </div>
                    </div>

                    {gameMode === 'multi' && (
                      <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-2xl border border-slate-700">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-slate-300">
                          {(() => {
                            const playersArr = Object.values(room?.players || {});
                            const me = playersArr.find(p => p.userId === user?.uid);
                            const opponent = playersArr.find(p => p.userId !== user?.uid);
                            return `${me?.name || 'Bạn'} vs ${opponent?.name || '...'}`;
                          })()}
                        </span>
                      </div>
                    )}
                    {gameMode === 'multi' && (
                      <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
                         <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                         <span className="font-mono font-bold text-blue-400">{formatTime(timeLeft)}</span>
                      </div>
                    )}
                    <button
                      onClick={() => setIsQuizOpen(false)}
                      className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {gameMode === 'multi' && room && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {(Object.values(room.players) as Player[]).map(p => (
                        <div key={p.userId} className={`p-3 rounded-xl border ${p.userId === user?.uid ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-800/40 border-slate-700'}`}>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase truncate">
                                {p.name || 'Người chơi'} {p.userId === user?.uid && '(Bạn)'}
                                {p.hasFinished && <span className="ml-2 text-[10px] text-green-500 font-black">XUẤT SẮC ✓</span>}
                            </span>
                            <span className="text-xl font-black text-blue-400">{p.userId === user?.uid ? score : p.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {gameMode === 'multi' && room?.players[user?.uid]?.hasFinished ? (
                    <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                      <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Đang đợi đối thủ...</h3>
                      <p className="text-slate-400">Bạn đã hoàn thành 15/15 câu hỏi. <br/>Kết quả sẽ hiển thị ngay khi đối thủ hoàn thành hoặc hết giờ.</p>
                      <div className="mt-8 px-6 py-3 bg-blue-600/10 inline-block rounded-xl border border-blue-500/20">
                         <span className="text-blue-400 font-bold uppercase tracking-widest text-sm">Điểm của bạn: {score}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                          {quizQuestions[currentQuestionIndex]?.text}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {quizQuestions[currentQuestionIndex]?.options?.map((option, idx) => {
                          const labels = ['A', 'B', 'C', 'D'];
                          const isCorrect = option === quizQuestions[currentQuestionIndex]?.correctAnswer;
                          const isSelected = option === selectedAnswer;
                          
                          let buttonClass = "bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500/50 hover:bg-slate-800/80";
                          if (isAnswered) {
                            if (isCorrect) buttonClass = "bg-green-500/20 border-green-500 text-green-400";
                            else if (isSelected) buttonClass = "bg-red-500/20 border-red-500 text-red-400";
                            else buttonClass = "bg-slate-800/50 border-slate-700 text-slate-500 opacity-50";
                          }

                          if (!option) return null;

                          return (
                            <button
                              key={idx}
                              disabled={isAnswered}
                              onClick={() => handleAnswerSelect(option)}
                              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group ${buttonClass}`}
                            >
                              <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold shrink-0 ${isAnswered && isCorrect ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-blue-500 group-hover:text-white'}`}>
                                {labels[idx] || '?'}
                              </span>
                              <span className="font-medium">{option}</span>
                              {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 ml-auto text-green-500" />}
                              {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-auto text-red-500" />}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-end">
                        <button
                          disabled={!isAnswered}
                          onClick={nextQuestion}
                          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${isAnswered ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                        >
                          <span>{currentQuestionIndex === 14 ? 'Hoàn thành' : 'Câu tiếp theo'}</span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : !showResult ? (
                <div className="p-12 text-center py-24">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  </div>
                  <p className="text-slate-400 font-medium animate-pulse">Đang khởi tạo thử thách...</p>
                </div>
              ) : (
                <div className="p-12 text-center">
                  {gameMode === 'multi' && room ? (() => {
                    const players = Object.values(room.players) as Player[];
                    const me = players.find(p => p.userId === user?.uid);
                    const opponent = players.find(p => p.userId !== user?.uid);
                    
                    // Final outcome score for local parity
                    const myFinalScore = me?.score ?? score;
                    const opponentScore = opponent?.score ?? 0;
                    
                    const myName = me?.name || displayName || 'Bạn';
                    const opponentName = opponent?.name || 'Đối thủ';
                    
                    const STABLE_MAX_TIME = 9999999999999;
                    const myFinishTime = me?.finishTime || STABLE_MAX_TIME;
                    const opponentFinishTime = opponent?.finishTime || STABLE_MAX_TIME;

                    let isWin = false;
                    let isDraw = false;

                    if (opponent) {
                      if (myFinalScore > opponentScore) {
                        isWin = true;
                      } else if (myFinalScore < opponentScore) {
                        isWin = false;
                      } else {
                        // Tied score -> check finish time
                        if (myFinishTime < opponentFinishTime) {
                          isWin = true;
                        } else if (myFinishTime > opponentFinishTime) {
                          isWin = false;
                        } else {
                          isDraw = true;
                        }
                      }
                    } else {
                      isWin = true;
                    }

                    return (
                      <>
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 ${isWin ? 'bg-amber-500/20 border-amber-500/50' : 'bg-red-500/20 border-red-500/50'}`}>
                          {isWin ? (
                            <Trophy className="w-12 h-12 text-amber-500" />
                          ) : (
                            <XCircle className="w-12 h-12 text-red-500" />
                          )}
                        </div>
                        
                        <h2 className={`text-4xl font-black mb-2 ${isWin ? 'text-amber-400' : 'text-red-400'}`}>
                          {isWin ? 'Chúc mừng bạn đã thắng!' : isDraw ? 'Kết quả Hòa!' : 'Tiếc quá, bạn đã thua cuộc!'}
                        </h2>
                        
                        {opponent && myFinalScore === opponentScore && !isDraw && (
                          <div className="inline-block px-4 py-1 bg-slate-800 rounded-full border border-slate-700 text-[10px] text-amber-500 font-black uppercase tracking-widest mb-4">
                            {isWin ? 'Thắng nhờ hoàn thành sớm hơn' : 'Thua do hoàn thành chậm hơn'}
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-6 my-10 max-w-sm mx-auto">
                           <div className={`relative p-6 rounded-3xl border-2 shadow-xl ${isWin ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-800/80 border-slate-700'}`}>
                              {isWin && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full">Hạng 1</div>}
                              {!isWin && !isDraw && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-700 text-slate-400 text-[10px] font-black rounded-full">Hạng 2</div>}
                              
                              <div className="text-xs uppercase text-slate-400 mb-2 font-black truncate tracking-tighter">{myName}</div>
                              <div className={`text-5xl font-black ${isWin ? 'text-amber-400' : 'text-white'}`}>{myFinalScore}</div>
                           </div>
                           
                           <div className={`relative p-6 rounded-3xl border-2 shadow-xl ${!isWin && !isDraw ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-800/80 border-slate-700'}`}>
                              {!isWin && !isDraw && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full">Hạng 1</div>}
                              {(isWin || isDraw) && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-700 text-slate-400 text-[10px] font-black rounded-full">Hạng 2</div>}
                              
                              <div className="text-xs uppercase text-slate-400 mb-2 font-black truncate tracking-tighter">{opponentName}</div>
                              <div className={`text-5xl font-black ${!isWin && !isDraw ? 'text-amber-400' : 'text-slate-200'}`}>{opponentScore}</div>
                           </div>
                        </div>
                      </>
                    );
                  })() : (
                    <>
                      <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-12 h-12 text-amber-500" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">Hoàn thành thử thách!</h2>
                      <p className="text-slate-400 mb-8">Bạn đã trả lời đúng được</p>
                      
                      <div className="text-6xl font-black text-blue-400 mb-8">
                        {score} <span className="text-2xl text-slate-500">/ 15</span>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        if (gameMode === 'multi') {
                          setIsQuizOpen(false);
                          setRoom(null);
                          setRoomCode('');
                        } else {
                          startQuiz();
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>{gameMode === 'multi' ? 'Về menu' : 'Chơi lại'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsQuizOpen(false);
                        setRoom(null);
                        setRoomCode('');
                      }}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold transition-all border border-slate-700"
                    >
                      <span>Đóng</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
