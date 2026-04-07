import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, X, Info, Beaker, GraduationCap, PlayCircle } from 'lucide-react';
import { elements, categories, Element } from './data';

export default function App() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (element: Element) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Refined, concise introduction
      const text = `${element.name}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleElementClick = (element: Element) => {
    setSelectedElement(element);
  };

  const renderGrid = () => {
    const grid = [];
    // Main Table (Periods 1-7, Groups 1-18)
    for (let p = 1; p <= 7; p++) {
      for (let g = 1; g <= 18; g++) {
        // Special cases for Lanthanides (57-71) and Actinides (89-103) placeholders in main table
        if (p === 6 && g === 3) {
          grid.push(
            <div key="lanthanides-placeholder" className="flex items-center justify-center border border-slate-500 rounded-md bg-slate-700 text-[10px] text-slate-300 font-bold shadow-inner">
              57-71
            </div>
          );
          continue;
        }
        if (p === 7 && g === 3) {
          grid.push(
            <div key="actinides-placeholder" className="flex items-center justify-center border border-slate-500 rounded-md bg-slate-700 text-[10px] text-slate-300 font-bold shadow-inner">
              89-103
            </div>
          );
          continue;
        }

        const element = elements.find(e => e.period === p && e.group === g && !((e.number >= 57 && e.number <= 71) || (e.number >= 89 && e.number <= 103)));
        
        if (element) {
          grid.push(
            <motion.div
              key={element.number}
              layoutId={`element-${element.number}`}
              onClick={() => handleElementClick(element)}
              className={`relative flex flex-col items-center justify-center p-1 border border-slate-400 rounded-md cursor-pointer hover:scale-110 transition-transform shadow-md ${element.color} text-gray-900 w-full aspect-square sm:h-16`}
              whileHover={{ zIndex: 10 }}
            >
              <span className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-bold">{element.number}</span>
              <span className="text-sm sm:text-xl font-bold">{element.symbol}</span>
              <span className="hidden sm:block text-[8px] truncate w-full text-center px-1">{element.name}</span>
            </motion.div>
          );
        } else {
          grid.push(<div key={`empty-${p}-${g}`} className="w-full h-16" />);
        }
      }
    }
    return grid;
  };

  const renderBottomRows = () => {
    const lanthanides = elements.filter(e => e.number >= 57 && e.number <= 71).sort((a, b) => a.number - b.number);
    const actinides = elements.filter(e => e.number >= 89 && e.number <= 103).sort((a, b) => a.number - b.number);

    return (
      <div className="mt-8 space-y-1">
        <div className="flex gap-1 ml-[calc((100%/18)*3)]">
          {lanthanides.map(element => (
            <motion.div
              key={element.number}
              onClick={() => handleElementClick(element)}
              className={`relative flex flex-col items-center justify-center p-1 border border-slate-400 rounded-md cursor-pointer hover:scale-110 transition-transform shadow-md ${element.color} text-gray-900 w-[calc(100%/18-4px)] h-16`}
            >
              <span className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-bold">{element.number}</span>
              <span className="text-sm sm:text-xl font-bold">{element.symbol}</span>
              <span className="hidden sm:block text-[8px] truncate w-full text-center px-1">{element.name}</span>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-1 ml-[calc((100%/18)*3)]">
          {actinides.map(element => (
            <motion.div
              key={element.number}
              onClick={() => handleElementClick(element)}
              className={`relative flex flex-col items-center justify-center p-1 border border-slate-400 rounded-md cursor-pointer hover:scale-110 transition-transform shadow-md ${element.color} text-gray-900 w-[calc(100%/18-4px)] h-16`}
            >
              <span className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-bold">{element.number}</span>
              <span className="text-sm sm:text-xl font-bold">{element.symbol}</span>
              <span className="hidden sm:block text-[8px] truncate w-full text-center px-1">{element.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

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
              Bảng Tuần Hoàn (CT GDPT 2018)
            </h1>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <GraduationCap className="w-5 h-5" />
            <span>Lớp 7A3 - THCS Xuân Hòa</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 sm:p-8">
        {/* Legend */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {Object.entries(categories).map(([key, label]) => {
            const color = elements.find(e => e.category === key)?.color || 'bg-slate-700';
            return (
              <div key={key} className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700 shadow-sm">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-xs font-medium text-slate-300">{label}</span>
              </div>
            );
          })}
        </div>

        {/* Periodic Table Grid */}
        <div className="relative overflow-x-auto pb-8 scrollbar-hide">
          <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1 min-w-[1200px]">
            {/* Group Numbers */}
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={`group-${i + 1}`} className="text-center text-[10px] font-bold text-slate-500 pb-2">
                Nhóm {i + 1}
              </div>
            ))}
            
            {/* The Grid */}
            {renderGrid()}
          </div>

          {/* Bottom Rows (Lanthanides & Actinides) */}
          <div className="min-w-[1200px]">
            {renderBottomRows()}
          </div>
          
          {/* Period Numbers (Left side) */}
          <div className="absolute top-6 -left-10 flex flex-col gap-1 h-full">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={`period-${i + 1}`} className="h-16 flex items-center justify-center text-[10px] font-bold text-slate-500">
                Chu kỳ {i + 1}
              </div>
            ))}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setSelectedElement(null);
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col md:flex-row">
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
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">{selectedElement.name}</h2>
                      <p className="text-blue-400 font-mono text-sm">{selectedElement.latinName} • {selectedElement.phonetic}</p>
                    </div>
                    <button
                      onClick={() => speak(selectedElement)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${isSpeaking ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-blue-400 border border-slate-700'}`}
                    >
                      <PlayCircle className="w-5 h-5" />
                      <span>{isSpeaking ? 'Đang đọc...' : 'Nghe đọc'}</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {selectedElement.discoverer !== "Đang cập nhật" && (
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Người tìm ra</h4>
                        <p className="text-sm text-white">{selectedElement.discoverer}</p>
                      </div>
                    )}
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Trạng thái</h4>
                      <p className="text-sm text-white">{selectedElement.state}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Khối lượng</h4>
                      <p className="text-sm text-white">{selectedElement.atomicMass} u</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Phân loại</h4>
                      <p className="text-sm text-white">{categories[selectedElement.category as keyof typeof categories]}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Tóm tắt</h4>
                      <p className="text-slate-200 text-sm italic border-l-2 border-blue-500 pl-4">
                        "{selectedElement.summary}"
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2">Mô tả chi tiết</h4>
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
    </div>
  );
}
