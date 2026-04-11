import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, X, Info, Beaker, GraduationCap, PlayCircle, Trophy, Gamepad2, ArrowRight, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { elements, categories, Element } from './data';
import { generateQuiz, Question } from './quizService';

export default function App() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Quiz State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

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
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
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

      utterance.rate = 0.9;
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

  const renderGrid = () => {
    const grid = [];
    // Main Table (Periods 1-7, Groups 1-18)
    for (let p = 1; p <= 7; p++) {
      // Add Period Label at the start of each row
      grid.push(
        <div key={`period-label-${p}`} className="flex items-center justify-center text-[10px] font-bold text-slate-500 pr-2">
          {p}
        </div>
      );

      for (let g = 1; g <= 18; g++) {
        // Special cases for Lanthanides (57-71) and Actinides (89-103) placeholders in main table
        if (p === 6 && g === 3) {
          grid.push(
            <div key="lanthanides-placeholder" className="flex items-center justify-center border border-slate-700 rounded-md bg-slate-800/50 text-[10px] text-slate-500 font-bold">
              57-71
            </div>
          );
          continue;
        }
        if (p === 7 && g === 3) {
          grid.push(
            <div key="actinides-placeholder" className="flex items-center justify-center border border-slate-700 rounded-md bg-slate-800/50 text-[10px] text-slate-500 font-bold">
              89-103
            </div>
          );
          continue;
        }

        const element = elements.find(e => e.period === p && e.group === g && !((e.number >= 57 && e.number <= 71) || (e.number >= 89 && e.number <= 103)));
        
        if (element) {
          const isDimmed = activeCategory && element.category !== activeCategory;
          grid.push(
            <motion.div
              key={element.number}
              layoutId={`element-${element.number}`}
              onClick={() => handleElementClick(element)}
              className={`relative flex flex-col items-center justify-center p-1 border border-slate-400/30 rounded-md cursor-pointer hover:scale-110 transition-all shadow-md text-gray-900 w-full aspect-square sm:h-20 ${isDimmed ? 'opacity-20 grayscale scale-95' : 'opacity-100'}`}
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
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] rotate-180 text-[10px] font-bold text-pink-400 uppercase tracking-widest whitespace-nowrap">
           Lanthanes
          </div>
          {lanthanides.map(element => {
            const isDimmed = activeCategory && element.category !== activeCategory;
            return (
              <motion.div
                key={element.number}
                onClick={() => handleElementClick(element)}
                className={`relative flex flex-col items-center justify-center p-1 border border-slate-400/30 rounded-md cursor-pointer hover:scale-110 transition-all shadow-md text-gray-900 w-[calc(100%/19-4px)] h-20 ${isDimmed ? 'opacity-20 grayscale scale-95' : 'opacity-100'}`}
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
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] rotate-180 text-[10px] font-bold text-rose-400 uppercase tracking-widest whitespace-nowrap">
           Actinides
          </div>
          {actinides.map(element => {
            const isDimmed = activeCategory && element.category !== activeCategory;
            return (
              <motion.div
                key={element.number}
                onClick={() => handleElementClick(element)}
                className={`relative flex flex-col items-center justify-center p-1 border border-slate-400/30 rounded-md cursor-pointer hover:scale-110 transition-all shadow-md text-gray-900 w-[calc(100%/19-4px)] h-20 ${isDimmed ? 'opacity-20 grayscale scale-95' : 'opacity-100'}`}
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
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              BẢNG TUẦN HOÀN THÔNG MINH
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startQuiz}
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
        {/* Legend */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {Object.entries(categories).map(([key, label]) => {
            const color = elements.find(e => e.category === key)?.color || '#334155';
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(isActive ? null : key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all shadow-sm ${isActive ? 'bg-blue-600 border-blue-400 text-white scale-105' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
              </button>
            );
          })}
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
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
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={`group-${i + 1}`} className="text-center text-[10px] font-bold text-slate-500 pb-2">
                Nhóm {groupRomanMapping[i + 1]}
              </div>
            ))}
            
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
              <h3 className="font-bold text-lg">Hướng dẫn</h3>
            </div>
            <ul className="text-slate-400 text-sm space-y-2 list-disc pl-4">
              <li>Nhấn vào nguyên tố để xem thông tin chi tiết.</li>
              <li>Nhấn nút "Nghe đọc" trong bảng thông tin để nghe miêu tả bằng tiếng Việt.</li>
              <li>Bảng bao gồm đầy đủ 118 nguyên tố hóa học.</li>
              <li className="text-blue-300 font-medium">Hỗ trợ cài đặt trên Android và iOS.</li>
            </ul>
          </div>
          <div className="md:col-span-2 bg-gradient-to-br from-blue-600/20 to-teal-600/20 p-6 rounded-2xl border border-blue-500/20 flex items-center justify-center text-center">
            <div>
              <h2 className="text-xl font-bold mb-2">Dự án Hóa học 7</h2>
              <p className="text-slate-300 max-w-lg">
                Ứng dụng giúp học sinh dễ dàng tiếp cận và ghi nhớ các nguyên tố hóa học thông qua hình ảnh và âm thanh trực quan.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 p-8 border-t border-slate-800 text-center text-slate-500">
        <p className="text-sm">Nhóm thực hiện: <span className="text-blue-400 font-bold uppercase tracking-wider">Lớp 7A3 - THCS Xuân Hòa</span></p>
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
              className="bg-slate-900 border-0 sm:border sm:border-slate-700 w-full h-full sm:h-auto sm:max-w-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
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

              <div className="flex flex-col md:flex-row h-full overflow-y-auto sm:overflow-visible">
                {/* Image Section */}
                <div className="md:w-2/5 h-64 md:h-auto relative">
                  <img
                    src={selectedElement.image}
                    alt={selectedElement.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className={`absolute bottom-6 left-6 p-5 rounded-2xl ${selectedElement.color} text-slate-900 shadow-xl`}>
                    <div className="text-sm font-bold opacity-70">#{selectedElement.number}</div>
                    <div className="text-5xl font-black">{selectedElement.symbol}</div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="md:w-3/5 p-8 max-h-[80vh] overflow-y-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-slate-800 text-blue-400 text-xs font-bold px-2 py-1 rounded border border-slate-700">
                          Số hiệu: {selectedElement.number}
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
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10" />
                        {getShells(selectedElement.number).map((count, i) => (
                          <motion.div
                            key={i}
                            className="absolute border border-blue-500/30 rounded-full"
                            style={{
                              width: `${(i + 1) * 30 + 20}px`,
                              height: `${(i + 1) * 30 + 20}px`,
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10 / (i + 1), repeat: Infinity, ease: "linear" }}
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

                  <div className="space-y-6">
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

      {/* Quiz Modal */}
      <AnimatePresence>
        {isQuizOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative"
            >
              {!showResult ? (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500 rounded-lg">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-slate-300">Câu {currentQuestionIndex + 1} / 15</span>
                    </div>
                    <button
                      onClick={() => setIsQuizOpen(false)}
                      className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                      {quizQuestions[currentQuestionIndex]?.text}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {quizQuestions[currentQuestionIndex]?.options.map((option, idx) => {
                      const labels = ['A', 'B', 'C', 'D'];
                      const isCorrect = option === quizQuestions[currentQuestionIndex].correctAnswer;
                      const isSelected = option === selectedAnswer;
                      
                      let buttonClass = "bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500/50 hover:bg-slate-800/80";
                      if (isAnswered) {
                        if (isCorrect) buttonClass = "bg-green-500/20 border-green-500 text-green-400";
                        else if (isSelected) buttonClass = "bg-red-500/20 border-red-500 text-red-400";
                        else buttonClass = "bg-slate-800/50 border-slate-700 text-slate-500 opacity-50";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleAnswerSelect(option)}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group ${buttonClass}`}
                        >
                          <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold shrink-0 ${isAnswered && isCorrect ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-blue-500 group-hover:text-white'}`}>
                            {labels[idx]}
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
                      <span>{currentQuestionIndex === 14 ? 'Xem kết quả' : 'Câu tiếp theo'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-12 h-12 text-amber-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Hoàn thành thử thách!</h2>
                  <p className="text-slate-400 mb-8">Bạn đã trả lời đúng được</p>
                  
                  <div className="text-6xl font-black text-blue-400 mb-8">
                    {score} <span className="text-2xl text-slate-500">/ 15</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={startQuiz}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Chơi lại</span>
                    </button>
                    <button
                      onClick={() => setIsQuizOpen(false)}
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
