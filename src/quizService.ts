import { Element } from './data';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  elementSymbol: string;
}

export const generateQuiz = (elements: Element[], count: number = 15): Question[] => {
  // Filter to first 20 elements
  const first20 = elements.filter(e => e.number <= 20);
  const shuffled = [...first20].sort(() => 0.5 - Math.random());
  const selectedElements = shuffled.slice(0, count);

  const groupRomanMapping: Record<number, string> = {
    1: "IA", 2: "IIA", 3: "IIIB", 4: "IVB", 5: "VB", 6: "VIB", 7: "VIIB", 8: "VIIIB", 9: "VIIIB", 10: "VIIIB",
    11: "IB", 12: "IIB", 13: "IIIA", 14: "IVA", 15: "VA", 16: "VIA", 17: "VIIA", 18: "VIIIA"
  };

  return selectedElements.map((el, index) => {
    const questionTypes = [
      {
        text: `Nguyên tố nào có ký hiệu hóa học là "${el.symbol}"?`,
        correct: el.name,
        getWrong: () => first20.filter(e => e.number !== el.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(e => e.name)
      },
      {
        text: `Ký hiệu hóa học của nguyên tố "${el.name}" là gì?`,
        correct: el.symbol,
        getWrong: () => first20.filter(e => e.number !== el.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(e => e.symbol)
      },
      {
        text: `Nguyên tố nào có số hiệu nguyên tử (số proton) là ${el.number}?`,
        correct: el.name,
        getWrong: () => first20.filter(e => e.number !== el.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(e => e.name)
      },
      {
        text: `Nguyên tố "${el.name}" nằm ở chu kỳ ${el.period} và nhóm nào?`,
        correct: `Nhóm ${groupRomanMapping[el.group]}`,
        getWrong: () => {
          const groups = [1, 2, 13, 14, 15, 16, 17, 18].filter(g => g !== el.group);
          return groups.sort(() => 0.5 - Math.random()).slice(0, 3).map(g => `Nhóm ${groupRomanMapping[g]}`);
        }
      },
      {
        text: `Nguyên tố nào có cấu hình electron là "${el.electronConfiguration}"?`,
        correct: el.name,
        getWrong: () => first20.filter(e => e.number !== el.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(e => e.name)
      },
      {
        text: `Cấu hình electron của nguyên tố "${el.name}" là gì?`,
        correct: el.electronConfiguration,
        getWrong: () => first20.filter(e => e.number !== el.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(e => e.electronConfiguration)
      },
      {
        text: `Nguyên tố nào có tính chất đặc trưng là: "${el.characteristics}"?`,
        correct: el.name,
        getWrong: () => first20.filter(e => e.number !== el.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(e => e.name)
      },
      {
        text: `Khối lượng nguyên tử của nguyên tố "${el.name}" xấp xỉ bao nhiêu?`,
        correct: `${el.atomicMass} u`,
        getWrong: () => first20.filter(e => e.number !== el.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(e => `${e.atomicMass} u`)
      }
    ];

    const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const options = [qType.correct, ...qType.getWrong()].sort(() => 0.5 - Math.random());

    return {
      id: `q-${index}`,
      text: qType.text,
      options,
      correctAnswer: qType.correct,
      elementSymbol: el.symbol
    };
  });
};
