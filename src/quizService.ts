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

  return selectedElements.map((el, index) => {
    const questionTypes = [
      {
        text: `Ký hiệu hóa học của nguyên tố "${el.name}" là gì?`,
        correct: el.symbol,
        getWrong: () => first20.filter(e => e.number !== el.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(e => e.symbol)
      },
      {
        text: `Nguyên tố nào có ký hiệu hóa học là "${el.symbol}"?`,
        correct: el.name,
        getWrong: () => first20.filter(e => e.number !== el.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(e => e.name)
      },
      {
        text: `Nguyên tố "${el.name}" có bao nhiêu electron (ở trạng thái trung hòa)?`,
        correct: el.number.toString(),
        getWrong: () => {
          const nums = new Set<string>();
          while(nums.size < 3) {
            const n = Math.floor(Math.random() * 20) + 1;
            if (n !== el.number) nums.add(n.toString());
          }
          return Array.from(nums);
        }
      },
      {
        text: `Nguyên tố nào có tổng số electron là ${el.number}?`,
        correct: el.name,
        getWrong: () => first20.filter(e => e.number !== el.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(e => e.name)
      },
      {
        text: `Tính chất đặc trưng (trạng thái, màu sắc) của "${el.name}" là gì?`,
        correct: el.characteristics,
        getWrong: () => {
          // Get unique characteristics from first 20
          const allChars = Array.from(new Set(first20.map(e => e.characteristics))).filter(c => c !== el.characteristics);
          return allChars.sort(() => 0.5 - Math.random()).slice(0, 3);
        }
      },
      {
        text: `Nguyên tố nào có tính chất đặc trưng là: "${el.characteristics}"?`,
        correct: el.name,
        getWrong: () => first20.filter(e => e.number !== el.number).sort(() => 0.5 - Math.random()).slice(0, 3).map(e => e.name)
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
