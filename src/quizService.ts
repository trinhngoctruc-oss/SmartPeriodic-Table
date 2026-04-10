import { Element } from './data';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  elementSymbol: string;
}

export const generateQuiz = (elements: Element[], count: number = 15): Question[] => {
  const shuffled = [...elements].sort(() => 0.5 - Math.random());
  const selectedElements = shuffled.slice(0, count);

  return selectedElements.map((el, index) => {
    const questionTypes = [
      `Nguyên tố nào có ký hiệu hóa học là "${el.symbol}"?`,
      `Nguyên tố nào có số hiệu nguyên tử là ${el.number}?`,
      `Nguyên tố nào có tên gọi là "${el.name}"?`,
      `Nguyên tố nào có khối lượng nguyên tử khoảng ${el.atomicMass} u?`,
      `Nguyên tố nào thuộc nhóm ${el.group} và chu kỳ ${el.period}?`,
      `Dựa vào mô tả: "${el.summary}", đây là nguyên tố nào?`
    ];

    const text = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    // Generate 3 wrong options
    const otherElements = elements.filter(e => e.number !== el.number);
    const wrongOptions = [...otherElements]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(e => e.name);

    const options = [el.name, ...wrongOptions].sort(() => 0.5 - Math.random());

    return {
      id: `q-${index}`,
      text,
      options,
      correctAnswer: el.name,
      elementSymbol: el.symbol
    };
  });
};
