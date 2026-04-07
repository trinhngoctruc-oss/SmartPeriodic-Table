export interface Element {
  number: number;
  symbol: string;
  name: string;
  latinName: string;
  phonetic: string;
  atomicMass: string;
  category: string;
  group: number;
  period: number;
  description: string;
  image: string;
  color: string;
  discoverer: string;
  state: "Rắn" | "Lỏng" | "Khí" | "Chưa xác định";
  summary: string;
}

export const categories = {
  "nonmetal": "Phi kim",
  "noble-gas": "Khí hiếm",
  "alkali-metal": "Kim loại kiềm",
  "alkaline-earth-metal": "Kim loại kiềm thổ",
  "metalloid": "Á kim",
  "halogen": "Halogen",
  "post-transition-metal": "Kim loại sau chuyển tiếp",
  "transition-metal": "Kim loại chuyển tiếp",
  "lanthanide": "Họ Lanthan",
  "actinide": "Họ Actinid"
};

const allSymbols = [
  "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca",
  "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr",
  "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd",
  "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg",
  "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm",
  "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"
];

const allNames = [
  "Hydrogen", "Helium", "Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Neon",
  "Sodium", "Magnesium", "Aluminium", "Silicon", "Phosphorus", "Sulfur", "Chlorine", "Argon", "Potassium", "Calcium",
  "Scandium", "Titanium", "Vanadium", "Chromium", "Manganese", "Iron", "Cobalt", "Nickel", "Copper", "Zinc",
  "Gallium", "Germanium", "Arsenic", "Selenium", "Bromine", "Krypton", "Rubidium", "Strontium", "Yttrium", "Zirconium",
  "Niobium", "Molybdenum", "Technetium", "Ruthenium", "Rhodium", "Palladium", "Silver", "Cadmium", "Indium", "Tin",
  "Antimony", "Tellurium", "Iodine", "Xenon", "Caesium", "Barium", "Lanthanum", "Cerium", "Praseodymium", "Neodymium",
  "Promethium", "Samarium", "Europium", "Gadolinium", "Terbium", "Dysprosium", "Holmium", "Erbium", "Thulium", "Ytterbium",
  "Lutetium", "Hafnium", "Tantalum", "Tungsten", "Rhenium", "Osmium", "Iridium", "Platinum", "Gold", "Mercury",
  "Thallium", "Lead", "Bismuth", "Polonium", "Astatine", "Radon", "Francium", "Radium", "Actinium", "Thorium",
  "Protactinium", "Uranium", "Neptunium", "Plutonium", "Americium", "Curium", "Berkelium", "Californium", "Einsteinium", "Fermium",
  "Mendelevium", "Nobelium", "Lawrencium", "Rutherfordium", "Dubnium", "Seaborgium", "Bohrium", "Hassium", "Meitnerium", "Darmstadtium",
  "Roentgenium", "Copernicium", "Nihonium", "Flerovium", "Moscovium", "Livermorium", "Tennessine", "Oganesson"
];

const atomicMasses = [
  "1.008", "4.0026", "6.94", "9.0122", "10.81", "12.011", "14.007", "15.999", "18.998", "20.180",
  "22.990", "24.305", "26.982", "28.085", "30.974", "32.06", "35.45", "39.948", "39.098", "40.078",
  "44.956", "47.867", "50.942", "51.996", "54.938", "55.845", "58.933", "58.693", "63.546", "65.38",
  "69.723", "72.630", "74.922", "78.971", "79.904", "83.798", "85.468", "87.62", "88.906", "91.224",
  "92.906", "95.95", "98", "101.07", "102.91", "106.42", "107.87", "112.41", "114.82", "118.71",
  "121.76", "127.60", "126.90", "131.29", "132.91", "137.33", "138.91", "140.12", "140.91", "144.24",
  "145", "150.36", "151.96", "157.25", "158.93", "162.50", "164.93", "167.26", "168.93", "173.05",
  "174.97", "178.49", "180.95", "183.84", "186.21", "190.23", "192.22", "195.08", "196.97", "200.59",
  "204.38", "207.2", "208.98", "209", "210", "222", "223", "226", "227", "232.04",
  "231.04", "238.03", "237", "244", "243", "247", "247", "251", "252", "257",
  "258", "259", "262", "267", "268", "271", "270", "269", "278", "281",
  "281", "285", "286", "289", "290", "293", "294", "294"
];

const discoverers: Record<number, string> = {
  1: "Henry Cavendish", 2: "Pierre Janssen, Norman Lockyer", 3: "Johan August Arfwedson", 4: "Louis Nicolas Vauquelin",
  5: "Joseph Louis Gay-Lussac, Louis Jacques Thénard", 6: "Người cổ đại", 7: "Daniel Rutherford", 8: "Carl Wilhelm Scheele, Joseph Priestley",
  9: "Henri Moissan", 10: "William Ramsay, Morris Travers", 11: "Humphry Davy", 12: "Joseph Black",
  13: "Hans Christian Ørsted", 14: "Jöns Jacob Berzelius", 15: "Hennig Brand", 16: "Người cổ đại",
  17: "Carl Wilhelm Scheele", 18: "Lord Rayleigh, William Ramsay", 19: "Humphry Davy", 20: "Humphry Davy",
  21: "Lars Fredrik Nilson", 22: "William Gregor", 23: "Andrés Manuel del Río", 24: "Louis Nicolas Vauquelin",
  25: "Carl Wilhelm Scheele", 26: "Người cổ đại", 27: "Georg Brandt", 28: "Axel Fredrik Cronstedt",
  29: "Người cổ đại", 30: "Người Ấn Độ", 31: "Paul-Émile Lecoq de Boisbaudran", 32: "Clemens Winkler",
  33: "Albertus Magnus", 34: "Jöns Jacob Berzelius", 35: "Antoine Jérôme Balard, Leopold Gmelin", 36: "William Ramsay, Morris Travers",
  37: "Robert Bunsen, Gustav Kirchhoff", 38: "Adair Crawford", 39: "Johan Gadolin", 40: "Martin Heinrich Klaproth",
  41: "Charles Hatchett", 42: "Carl Wilhelm Scheele", 43: "Carlo Perrier, Emilio Segrè", 44: "Karl Ernst Claus",
  45: "William Hyde Wollaston", 46: "William Hyde Wollaston", 47: "Người cổ đại", 48: "Karl Samuel Leberecht Hermann, Friedrich Stromeyer",
  49: "Ferdinand Reich, Hieronymous Theodor Richter", 50: "Người cổ đại", 51: "Người cổ đại", 52: "Franz-Joseph Müller von Reichenstein",
  53: "Bernard Courtois", 54: "William Ramsay, Morris Travers", 55: "Robert Bunsen, Gustav Kirchhoff", 56: "Humphry Davy",
  57: "Carl Gustaf Mosander", 58: "Martin Heinrich Klaproth, Jöns Jacob Berzelius, Wilhelm Hisinger", 59: "Carl Auer von Welsbach", 60: "Carl Auer von Welsbach",
  61: "Chulalongkorn University", 62: "Paul-Émile Lecoq de Boisbaudran", 63: "Eugène-Anatole Demarçay", 64: "Jean Charles Galissard de Marignac",
  65: "Carl Gustaf Mosander", 66: "Paul-Émile Lecoq de Boisbaudran", 67: "Jacques-Louis Soret", 68: "Carl Gustaf Mosander",
  69: "Per Teodor Cleve", 70: "Jean Charles Galissard de Marignac", 71: "Georges Urbain, Carl Auer von Welsbach", 72: "Dirk Coster, George de Hevesy",
  73: "Anders Gustaf Ekeberg", 74: "Carl Wilhelm Scheele", 75: "Masataka Ogawa", 76: "Smithson Tennant",
  77: "Smithson Tennant", 78: "Antonio de Ulloa", 79: "Người cổ đại", 80: "Người cổ đại",
  81: "William Crookes", 82: "Người cổ đại", 83: "Claude François Geoffroy", 84: "Marie Curie, Pierre Curie",
  85: "Dale R. Corson, Kenneth MacKenzie, Emilio Segrè", 86: "Friedrich Ernst Dorn", 87: "Marguerite Perey", 88: "Marie Curie, Pierre Curie",
  89: "André-Louis Debierne", 90: "Jöns Jacob Berzelius", 91: "Friedrich Oskar Giesel", 92: "Martin Heinrich Klaproth",
  93: "Emilio Segrè, Glenn T. Seaborg", 94: "Glenn T. Seaborg", 95: "Glenn T. Seaborg", 96: "Glenn T. Seaborg",
  97: "Glenn T. Seaborg", 98: "Albert Ghiorso", 99: "Albert Ghiorso", 100: "Albert Ghiorso",
  101: "Albert Ghiorso", 102: "Albert Ghiorso", 103: "Albert Ghiorso", 104: "Joint Institute for Nuclear Research",
  105: "Joint Institute for Nuclear Research", 106: "Joint Institute for Nuclear Research", 107: "Joint Institute for Nuclear Research", 108: "GSI Helmholtz Centre for Heavy Ion Research",
  109: "GSI Helmholtz Centre for Heavy Ion Research", 110: "GSI Helmholtz Centre for Heavy Ion Research", 111: "GSI Helmholtz Centre for Heavy Ion Research", 112: "GSI Helmholtz Centre for Heavy Ion Research",
  113: "RIKEN", 114: "Joint Institute for Nuclear Research", 115: "Joint Institute for Nuclear Research", 116: "Joint Institute for Nuclear Research",
  117: "Joint Institute for Nuclear Research", 118: "Joint Institute for Nuclear Research"
};

export const elements: Element[] = [];

for (let i = 1; i <= 118; i++) {
  let p = 1, g = 1;
  
  if (i === 1) { p = 1; g = 1; }
  else if (i === 2) { p = 1; g = 18; }
  else if (i >= 3 && i <= 4) { p = 2; g = i - 2; }
  else if (i >= 5 && i <= 10) { p = 2; g = i + 8; }
  else if (i >= 11 && i <= 12) { p = 3; g = i - 10; }
  else if (i >= 13 && i <= 18) { p = 3; g = i + 0; }
  else if (i >= 19 && i <= 36) { p = 4; g = i - 18; }
  else if (i >= 37 && i <= 54) { p = 5; g = i - 36; }
  else if (i >= 55 && i <= 86) { 
    p = 6; 
    if (i >= 57 && i <= 71) g = 3;
    else if (i < 57) g = i - 54;
    else g = i - 68;
  }
  else if (i >= 87 && i <= 118) { 
    p = 7; 
    if (i >= 89 && i <= 103) g = 3;
    else if (i < 89) g = i - 86;
    else g = i - 100;
  }

  let cat = "transition-metal";
  if (i === 1) cat = "nonmetal";
  else if ([2, 10, 18, 36, 54, 86, 118].includes(i)) cat = "noble-gas";
  else if ([3, 11, 19, 37, 55, 87].includes(i)) cat = "alkali-metal";
  else if ([4, 12, 20, 38, 56, 88].includes(i)) cat = "alkaline-earth-metal";
  else if ([5, 14, 32, 33, 51, 52].includes(i)) cat = "metalloid";
  else if ([9, 17, 35, 53, 85, 117].includes(i)) cat = "halogen";
  else if ([6, 7, 8, 15, 16, 34].includes(i)) cat = "nonmetal";
  else if ([13, 31, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116].includes(i)) cat = "post-transition-metal";
  else if (i >= 57 && i <= 71) cat = "lanthanide";
  else if (i >= 89 && i <= 103) cat = "actinide";

  let state: "Rắn" | "Lỏng" | "Khí" | "Chưa xác định" = "Rắn";
  if ([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86].includes(i)) state = "Khí";
  else if ([35, 80].includes(i)) state = "Lỏng";
  else if (i > 103) state = "Chưa xác định";

  const symbol = allSymbols[i - 1];
  const name = allNames[i - 1];
  let imageName = name.toLowerCase();
  if (imageName === "aluminium") imageName = "aluminum";
  if (imageName === "caesium") imageName = "cesium";
  
  elements.push({
    number: i,
    symbol: symbol,
    name: name,
    latinName: name + "um",
    phonetic: "/.../",
    atomicMass: atomicMasses[i - 1],
    category: cat,
    group: g,
    period: p,
    description: `Nguyên tố ${name} là một phần quan trọng của bảng tuần hoàn hóa học.`,
    image: i <= 103 
      ? `https://images-of-elements.com/s/${imageName}.jpg`
      : `https://picsum.photos/seed/chemistry-${symbol}/400/400`,
    color: "bg-slate-200",
    discoverer: discoverers[i] || "Đang cập nhật",
    state: state,
    summary: `Nguyên tố hóa học số hiệu ${i}`
  });
}

elements.forEach(e => {
  switch (e.category) {
    case "nonmetal": e.color = "bg-blue-200"; break;
    case "noble-gas": e.color = "bg-purple-200"; break;
    case "alkali-metal": e.color = "bg-red-200"; break;
    case "alkaline-earth-metal": e.color = "bg-orange-200"; break;
    case "metalloid": e.color = "bg-green-200"; break;
    case "halogen": e.color = "bg-teal-200"; break;
    case "post-transition-metal": e.color = "bg-gray-200"; break;
    case "transition-metal": e.color = "bg-yellow-200"; break;
    case "lanthanide": e.color = "bg-pink-200"; break;
    case "actinide": e.color = "bg-rose-200"; break;
  }
});
