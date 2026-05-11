export interface Element {
  number: number;
  symbol: string;
  name: string;
  latinName: string;
  phonetic: string;
  atomicMass: string;
  category: string;
  block: string;
  isRadioactive: boolean;
  group: number;
  period: number;
  description: string;
  image: string;
  color: string;
  discoverer: string;
  state: string;
  summary: string;
  electronConfiguration: string;
  electronegativity: string;
  oxidationStates: string;
  meltingPoint: string;
  boilingPoint: string;
  characteristics: string;
}

export const categories = {
  "metal": "Kim loại",
  "nonmetal": "Phi kim",
  "noble-gas": "Khí hiếm",
  "alkali-metal": "Kim loại kiềm",
  "alkaline-earth": "Kim loại kiềm thổ",
  "halogen": "Nhóm Halogen",
  "actinide": "Họ Actinides",
  "lanthanide": "Họ Lanthanides",
  "block-s": "Nguyên tố s",
  "block-p": "Nguyên tố p",
  "block-d": "Nguyên tố d",
  "block-f": "Nguyên tố f"
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
  1: "Henry Cavendish (Anh)", 2: "Pierre Janssen (Pháp), Norman Lockyer (Anh)", 3: "Johan August Arfwedson (Thụy Điển)", 4: "Louis Nicolas Vauquelin (Pháp)",
  5: "Joseph Louis Gay-Lussac (Pháp), Louis Jacques Thénard (Pháp)", 6: "Người cổ đại", 7: "Daniel Rutherford (Scotland)", 8: "Carl Wilhelm Scheele (Thụy Điển), Joseph Priestley (Anh)",
  9: "Henri Moissan (Pháp)", 10: "William Ramsay (Scotland), Morris Travers (Anh)", 11: "Humphry Davy (Anh)", 12: "Joseph Black (Scotland)",
  13: "Hans Christian Ørsted (Đan Mạch)", 14: "Jöns Jacob Berzelius (Thụy Điển)", 15: "Hennig Brand (Đức)", 16: "Người cổ đại",
  17: "Carl Wilhelm Scheele (Thụy Điển)", 18: "Lord Rayleigh (Anh), William Ramsay (Scotland)", 19: "Humphry Davy (Anh)", 20: "Humphry Davy (Anh)",
  21: "Lars Fredrik Nilson (Thụy Điển)", 22: "William Gregor (Anh)", 23: "Andrés Manuel del Río (Tây Ban Nha)", 24: "Louis Nicolas Vauquelin (Pháp)",
  25: "Carl Wilhelm Scheele (Thụy Điển)", 26: "Người cổ đại", 27: "Georg Brandt (Thụy Điển)", 28: "Axel Fredrik Cronstedt (Thụy Điển)",
  29: "Người cổ đại", 30: "Người Ấn Độ (Cổ đại)", 31: "Paul-Émile Lecoq de Boisbaudran (Pháp)", 32: "Clemens Winkler (Đức)",
  33: "Albertus Magnus (Đức)", 34: "Jöns Jacob Berzelius (Thụy Điển)", 35: "Antoine Jérôme Balard (Pháp), Leopold Gmelin (Đức)", 36: "William Ramsay (Scotland), Morris Travers (Anh)",
  37: "Robert Bunsen (Đức), Gustav Kirchhoff (Đức)", 38: "Adair Crawford (Scotland)", 39: "Johan Gadolin (Phần Lan)", 40: "Martin Heinrich Klaproth (Đức)",
  41: "Charles Hatchett (Anh)", 42: "Carl Wilhelm Scheele (Thụy Điển)", 43: "Carlo Perrier (Ý), Emilio Segrè (Ý)", 44: "Karl Ernst Claus (Nga)",
  45: "William Hyde Wollaston (Anh)", 46: "William Hyde Wollaston (Anh)", 47: "Người cổ đại", 48: "Friedrich Stromeyer (Đức)",
  49: "Ferdinand Reich (Đức), Hieronymous Theodor Richter (Đức)", 50: "Người cổ đại", 51: "Người cổ đại", 52: "Franz-Joseph Müller von Reichenstein (Áo)",
  53: "Bernard Courtois (Pháp)", 54: "William Ramsay (Scotland), Morris Travers (Anh)", 55: "Robert Bunsen (Đức), Gustav Kirchhoff (Đức)", 56: "Humphry Davy (Anh)",
  57: "Carl Gustaf Mosander (Thụy Điển)", 58: "Martin Heinrich Klaproth (Đức), Jöns Jacob Berzelius (Thụy Điển), Wilhelm Hisinger (Thụy Điển)", 59: "Carl Auer von Welsbach (Áo)", 60: "Carl Auer von Welsbach (Áo)",
  61: "Berkeley Lab (Hoa Kỳ)", 62: "Paul-Émile Lecoq de Boisbaudran (Pháp)", 63: "Eugène-Anatole Demarçay (Pháp)", 64: "Jean Charles Galissard de Marignac (Thụy Sĩ)",
  65: "Carl Gustaf Mosander (Thụy Điển)", 66: "Paul-Émile Lecoq de Boisbaudran (Pháp)", 67: "Jacques-Louis Soret (Thụy Sĩ)", 68: "Carl Gustaf Mosander (Thụy Điển)",
  69: "Per Teodor Cleve (Thụy Điển)", 70: "Jean Charles Galissard de Marignac (Thụy Sĩ)", 71: "Georges Urbain (Pháp), Carl Auer von Welsbach (Áo)", 72: "Dirk Coster (Hà Lan), George de Hevesy (Hungary)",
  73: "Anders Gustaf Ekeberg (Thụy Điển)", 74: "Carl Wilhelm Scheele (Thụy Điển)", 75: "Masataka Ogawa (Nhật Bản)", 76: "Smithson Tennant (Anh)",
  77: "Smithson Tennant (Anh)", 78: "Antonio de Ulloa (Tây Ban Nha)", 79: "Người cổ đại", 80: "Người cổ đại",
  81: "William Crookes (Anh)", 82: "Người cổ đại", 83: "Claude François Geoffroy (Pháp)", 84: "Marie Curie (Ba Lan), Pierre Curie (Pháp)",
  85: "Dale R. Corson, Kenneth MacKenzie, Emilio Segrè (Hoa Kỳ)", 86: "Friedrich Ernst Dorn (Đức)", 87: "Marguerite Perey (Pháp)", 88: "Marie Curie (Ba Lan), Pierre Curie (Pháp)",
  89: "André-Louis Debierne (Pháp)", 90: "Jöns Jacob Berzelius (Thụy Điển)", 91: "Friedrich Oskar Giesel (Đức)", 92: "Martin Heinrich Klaproth (Đức)",
  93: "Emilio Segrè (Ý), Glenn T. Seaborg (Hoa Kỳ)", 94: "Glenn T. Seaborg (Hoa Kỳ)", 95: "Glenn T. Seaborg (Hoa Kỳ)", 96: "Glenn T. Seaborg (Hoa Kỳ)",
  97: "Glenn T. Seaborg (Hoa Kỳ)", 98: "Albert Ghiorso (Hoa Kỳ)", 99: "Albert Ghiorso (Hoa Kỳ)", 100: "Albert Ghiorso (Hoa Kỳ)",
  101: "Albert Ghiorso (Hoa Kỳ)", 102: "Albert Ghiorso (Hoa Kỳ)", 103: "Albert Ghiorso (Hoa Kỳ)", 104: "Viện Nghiên cứu Hạt nhân Liên hợp (Nga)",
  105: "Viện Nghiên cứu Hạt nhân Liên hợp (Nga)", 106: "Viện Nghiên cứu Hạt nhân Liên hợp (Nga)", 107: "Viện Nghiên cứu Hạt nhân Liên hợp (Nga)", 108: "Trung tâm Nghiên cứu Ion nặng GSI (Đức)",
  109: "Trung tâm Nghiên cứu Ion nặng GSI (Đức)", 110: "Trung tâm Nghiên cứu Ion nặng GSI (Đức)", 111: "Trung tâm Nghiên cứu Ion nặng GSI (Đức)", 112: "Trung tâm Nghiên cứu Ion nặng GSI (Đức)",
  113: "RIKEN (Nhật Bản)", 114: "Viện Nghiên cứu Hạt nhân Liên hợp (Nga), LLNL (Hoa Kỳ)", 115: "Viện Nghiên cứu Hạt nhân Liên hợp (Nga), LLNL (Hoa Kỳ)", 116: "Viện Nghiên cứu Hạt nhân Liên hợp (Nga), LLNL (Hoa Kỳ)",
  117: "Viện Nghiên cứu Hạt nhân Liên hợp (Nga), LLNL (Hoa Kỳ)", 118: "Viện Nghiên cứu Hạt nhân Liên hợp (Nga), LLNL (Hoa Kỳ)"
};

const phonetics: Record<number, string> = {
  1: "/ˈhaɪdrədʒən/", 2: "/ˈhiːliəm/", 3: "/ˈlɪθiəm/", 4: "/bəˈrɪliəm/", 5: "/ˈbɔːrɒn/",
  6: "/ˈkɑːrbən/", 7: "/ˈnaɪtrədʒən/", 8: "/ˈɒksɪdʒən/", 9: "/ˈflɔːriːn/", 10: "/ˈniːɒn/",
  11: "/ˈsoʊdiəm/", 12: "/mæɡˈniːziəm/", 13: "/ˌæljəˈmɪniəm/", 14: "/ˈsɪlɪkən/", 15: "/ˈfɒsfərəs/",
  16: "/ˈsʌlfər/", 17: "/ˈklɔːriːn/", 18: "/ˈɑːrɡɒn/", 19: "/pəˈtæsiəm/", 20: "/ˈkælsiəm/",
  21: "/ˈskændiəm/", 22: "/taɪˈteɪniəm/", 23: "/vəˈneɪdiəm/", 24: "/ˈkroʊmiəm/", 25: "/ˈmæŋɡəniːz/",
  26: "/ˈaɪərn/", 27: "/ˈkoʊbɔːlt/", 28: "/ˈnɪkəl/", 29: "/ˈkɒpər/", 30: "/zɪŋk/",
  31: "/ˈɡæliəm/", 32: "/dʒərˈmeɪniəm/", 33: "/ˈɑːrsənɪk/", 34: "/səˈliːniəm/", 35: "/ˈbroʊmiːn/",
  36: "/ˈkrɪptɒn/", 37: "/ruːˈbɪdiəm/", 38: "/ˈstrɒntiəm/", 39: "/ˈɪtriəm/", 40: "/zərˈkoʊniəm/",
  41: "/naɪˈoʊbiəm/", 42: "/məˈlɪbdənəm/", 43: "/tɛkˈniːʃiəm/", 44: "/ruːˈθiːniəm/", 45: "/ˈroʊdiəm/",
  46: "/pəˈleɪdiəm/", 47: "/ˈsɪlvər/", 48: "/ˈkædmiəm/", 49: "/ˈɪndiəm/", 50: "/tɪn/",
  51: "/ˈæntɪmoʊni/", 52: "/tɛˈlʊəriəm/", 53: "/ˈaɪədaɪn/", 54: "/ˈziːnɒn/", 55: "/ˈsiːziəm/",
  56: "/ˈbɛəriəm/", 57: "/ˈlænθənəm/", 58: "/ˈsɪəriəm/", 59: "/ˌpreɪziəˈdɪmiəm/", 60: "/ˌniːoʊˈdɪmiəm/",
  61: "/prəˈmiːθiəm/", 62: "/səˈmɛəriəm/", 63: "/jʊˈroʊpiəm/", 64: "/ˌɡædəˈlɪniəm/", 65: "/ˈtɜːrbiəm/",
  66: "/dɪsˈproʊziəm/", 67: "/ˈhoʊlmiəm/", 68: "/ˈɜːrbiəm/", 69: "/ˈθjuːliəm/", 70: "/ɪˈtɜːrbiəm/",
  71: "/luːˈtiːʃiəm/", 72: "/ˈhæfniəm/", 73: "/ˈtæntələm/", 74: "/ˈtʌŋstən/", 75: "/ˈriːniəm/",
  76: "/ˈɒzmiəm/", 77: "/ɪˈrɪdiəm/", 78: "/ˈplætɪnəm/", 79: "/ɡoʊld/", 80: "/ˈmɜːrkjəri/",
  81: "/ˈθæliəm/", 82: "/lɛd/", 83: "/ˈbɪzməθ/", 84: "/pəˈloʊniəm/", 85: "/ˈæstətiːn/",
  86: "/ˈreɪdɒn/", 87: "/ˈfrænsiəm/", 88: "/ˈreɪdiəm/", 89: "/ækˈtɪniəm/", 90: "/ˈθɔːriəm/",
  91: "/ˌproʊtækˈtɪniəm/", 92: "/jʊˈreɪniəm/", 93: "/nɛpˈtjuːniəm/", 94: "/pluːˈtoʊniəm/", 95: "/ˌæməˈrɪʃiəm/",
  96: "/ˈkjʊəriəm/", 97: "/bərˈkiːliəm/", 98: "/ˌkælɪˈfɔːrniəm/", 99: "/aɪnˈstaɪniəm/", 100: "/ˈfɜːrmiəm/",
  101: "/ˌmɛndəˈliːviəm/", 102: "/noʊˈbiːliəm/", 103: "/lɔːˈrɛnsiəm/", 104: "/ˌrʌðərˈfɔːrdiəm/", 105: "/ˈdʌbniəm/",
  106: "/siːˈbɔːrɡiəm/", 107: "/ˈbɔːriəm/", 108: "/ˈhæsiəm/", 109: "/maɪtˈnɛəriəm/", 110: "/ˌdɑːrmˈʃtætiəm/",
  111: "/rɛntˈɡɛniəm/", 112: "/ˌkoʊpərˈnɪsiəm/", 113: "/niˈhoʊniəm/", 114: "/flɛˈroʊviəm/", 115: "/mɒsˈkoʊviəm/",
  116: "/ˌlɪvərˈmɔːriəm/", 117: "/ˌtɛnəˈsiːn/", 118: "/ˌɒɡəˈnɛsɒn/"
};

const detailedDescriptions: Record<number, string> = {
  1: "Khí nhẹ nhất, không màu, không mùi, dễ cháy. Là thành phần chính của nước và các hợp chất hữu cơ.",
  2: "Khí hiếm nhẹ thứ hai, không cháy, dùng trong khinh khí cầu và làm lạnh siêu dẫn.",
  3: "Kim loại kiềm nhẹ nhất, dùng trong pin sạc (lithium-ion), hợp kim hàng không.",
  4: "Kim loại cứng, màu xám, nhẹ, độc tính cao, dùng trong linh kiện điện tử và hàng không vũ trụ.",
  5: "Á kim cứng, chịu nhiệt tốt, dùng trong thủy tinh chịu nhiệt (Pyrex) và nông nghiệp.",
  6: "Cơ sở của mọi sự sống, tồn tại dưới dạng kim cương, than chì và các vật liệu nano.",
  7: "Chiếm 78% khí quyển Trái Đất, dùng trong sản xuất phân bón và bảo quản thực phẩm lạnh.",
  8: "Cần thiết cho sự hô hấp của sinh vật và quá trình cháy, chiếm 21% khí quyển.",
  9: "Phi kim hoạt động hóa học mạnh nhất, dùng trong kem đánh răng và sản xuất nhựa Teflon.",
  10: "Khí hiếm phát ra ánh sáng đỏ cam rực rỡ trong ống phóng điện, dùng trong biển quảng cáo.",
  11: "Kim loại kiềm mềm, phản ứng mãnh liệt với nước, là thành phần của muối ăn (NaCl).",
  12: "Kim loại nhẹ, cháy với ánh sáng trắng chói, dùng trong hợp kim bền nhẹ cho máy ảnh, máy bay.",
  13: "Kim loại phổ biến, nhẹ, chống ăn mòn tốt, dùng trong bao bì, xây dựng và ngành điện.",
  14: "Á kim quan trọng nhất trong ngành điện tử, dùng làm chip máy tính và pin mặt trời.",
  15: "Có hai dạng chính là trắng và đỏ, dùng trong sản xuất diêm, phân bón và thuốc trừ sâu.",
  16: "Phi kim màu vàng, dùng trong sản xuất axit sunfuric, lưu hóa cao su và thuốc súng.",
  17: "Khí màu vàng lục, mùi hắc, dùng để khử trùng nước sinh hoạt và sản xuất nhựa PVC.",
  18: "Khí hiếm phổ biến nhất, dùng làm môi trường trơ trong hàn kim loại và bóng đèn sợi đốt.",
  19: "Kim loại kiềm rất hoạt động, cần thiết cho chức năng thần kinh và cân bằng chất lỏng.",
  20: "Kim loại kiềm thổ, thành phần chính của xương, răng, vỏ sò và các loại đá vôi.",
  21: "Kim loại chuyển tiếp hiếm, dùng trong hợp kim nhôm để tăng độ bền và sản xuất đèn cao áp.",
  22: "Kim loại bền như thép nhưng nhẹ hơn 45%, chống ăn mòn cực tốt, dùng trong hàng không và y tế.",
  23: "Kim loại cứng, dùng chủ yếu trong sản xuất thép hợp kim siêu bền cho động cơ phản lực.",
  24: "Kim loại cứng, màu trắng bạc, dùng để mạ trang trí và sản xuất thép không gỉ (inox).",
  25: "Kim loại quan trọng trong sản xuất thép, giúp tăng độ cứng và chống mài mòn.",
  26: "Kim loại quan trọng nhất trong kỹ thuật, dùng để chế tạo thép và các cấu trúc xây dựng.",
  27: "Kim loại dùng trong sản xuất nam châm vĩnh cửu và pin sạc hiệu suất cao.",
  28: "Kim loại chống ăn mòn tốt, dùng để mạ bảo vệ và chế tạo tiền xu, thép không gỉ.",
  29: "Kim loại màu đỏ đặc trưng, dẫn điện và dẫn nhiệt cực tốt, dùng làm dây điện và ống nước.",
  30: "Kim loại dùng để mạ chống gỉ cho sắt thép (tôn mạ kẽm) và chế tạo hợp kim đồng thau.",
  31: "Kim loại có nhiệt độ nóng chảy thấp (29.76°C), có thể tan chảy ngay trên lòng bàn tay.",
  32: "Chất bán dẫn quan trọng, dùng trong sợi quang học, thấu kính hồng ngoại và pin mặt trời.",
  33: "Á kim nổi tiếng với độc tính cao, dùng trong thuốc trừ sâu và một số hợp kim đặc biệt.",
  34: "Phi kim cần thiết cho cơ thể ở lượng nhỏ, dùng trong tế bào quang điện và máy photocopy.",
  35: "Phi kim duy nhất ở dạng lỏng ở nhiệt độ thường, có mùi hắc, dùng trong dược phẩm và phim ảnh.",
  36: "Khí hiếm dùng trong đèn flash máy ảnh tốc độ cao và một số loại đèn laser y tế.",
  37: "Kim loại kiềm cực kỳ hoạt động, tự cháy trong không khí, dùng trong đồng hồ nguyên tử.",
  38: "Kim loại kiềm thổ, hợp chất của nó cháy với ngọn lửa màu đỏ rực, dùng trong pháo hoa.",
  39: "Kim loại màu trắng bạc, dùng trong sản xuất đèn LED, màn hình tivi và hợp kim siêu bền.",
  40: "Kim loại chống ăn mòn cực tốt, dùng trong vỏ thanh nhiên liệu hạt nhân và đồ trang sức giả kim cương.",
  41: "Kim loại dùng trong sản xuất thép không gỉ cho đường ống dẫn khí và nam châm siêu dẫn.",
  42: "Kim loại có nhiệt độ nóng chảy rất cao, dùng trong hợp kim thép chịu lực và dầu bôi trơn.",
  43: "Nguyên tố nhân tạo đầu tiên, dùng rộng rãi trong y học hạt nhân để chẩn đoán hình ảnh.",
  44: "Kim loại quý hiếm, dùng làm chất xúc tác và tăng độ cứng cho các hợp kim bạch kim.",
  45: "Kim loại quý cực kỳ đắt đỏ, dùng trong bộ chuyển đổi xúc tác ô tô để giảm khí thải độc hại.",
  46: "Kim loại quý dùng trong bộ lọc khí thải ô tô, nha khoa và các thiết bị điện tử.",
  47: "Kim loại quý có độ dẫn điện cao nhất, dùng trong trang sức, nha khoa và gương soi.",
  48: "Kim loại dùng trong pin Ni-Cd, mạ bảo vệ và làm thanh điều khiển trong lò phản ứng hạt nhân.",
  49: "Kim loại mềm, dùng để sản xuất màn hình cảm ứng LCD và các lớp phủ gương chống chói.",
  50: "Kim loại mềm, màu trắng bạc, dùng để mạ hộp đựng thực phẩm và chế tạo hợp kim thiếc.",
  51: "Á kim dùng trong sản xuất vật liệu chống cháy, ắc quy chì và các linh kiện bán dẫn.",
  52: "Á kim hiếm, dùng trong sản xuất pin mặt trời màng mỏng và đĩa quang học có thể ghi xóa.",
  53: "Phi kim cần thiết cho tuyến giáp, dùng làm chất sát trùng và trong nhiếp ảnh.",
  54: "Khí hiếm dùng trong đèn pha ô tô cường độ cao, đèn diệt khuẩn và gây mê y tế.",
  55: "Kim loại mềm nhất, dùng trong đồng hồ nguyên tử có độ chính xác cực cao.",
  56: "Kim loại kiềm thổ, hợp chất của nó dùng trong chẩn đoán X-quang hệ tiêu hóa và pháo hoa xanh lá.",
  57: "Kim loại đất hiếm, dùng trong sản xuất kính quang học chất lượng cao và tác nhân cracking dầu mỏ.",
  58: "Kim loại đất hiếm phổ đứng nhất, dùng trong đá lửa máy quẹt và bộ chuyển đổi xúc tác.",
  59: "Kim loại dùng để tạo màu vàng cho thủy tinh và là thành phần của nam châm mạnh.",
  60: "Thành phần quan trọng nhất của nam châm vĩnh cửu mạnh nhất thế giới (nam châm Neodymium).",
  61: "Nguyên tố phóng xạ nhân tạo, dùng trong pin nguyên tử siêu nhỏ và thiết bị đo độ dày.",
  62: "Dùng trong sản xuất nam châm chịu nhiệt độ cao và trong điều trị ung thư xương.",
  63: "Kim loại đất hiếm dùng để tạo màu đỏ rực rỡ trong màn hình tivi và đèn huỳnh quang.",
  64: "Dùng làm chất tương phản trong chụp cộng hưởng từ (MRI) và trong các thiết bị lưu trữ dữ liệu.",
  65: "Dùng trong sản xuất đèn huỳnh quang xanh lá và các thiết bị sonar (sóng âm).",
  66: "Dùng trong nam châm vĩnh cửu và các thiết bị laser, có khả năng hấp thụ neutron tốt.",
  67: "Kim loại có từ tính mạnh nhất, dùng trong các thiết bị tạo từ trường cực mạnh.",
  68: "Dùng làm chất khuếch đại trong sợi cáp quang và tạo màu hồng cho thủy tinh, trang sức.",
  69: "Kim loại hiếm nhất trong các nguyên tố đất hiếm, dùng trong các thiết bị X-quang di động.",
  70: "Dùng trong sản xuất thép không gỉ và làm chất xúc tác trong các phản ứng hóa học.",
  71: "Kim loại đất hiếm đắt đỏ, dùng làm chất xúc tác trong lọc dầu và trong y học hạt nhân.",
  72: "Kim loại chịu nhiệt và ăn mòn tốt, dùng trong thanh điều khiển của tàu ngầm hạt nhân.",
  73: "Kim loại cực kỳ chống ăn mòn, dùng sản xuất tụ điện cho điện thoại di động và máy tính.",
  74: "Kim loại có nhiệt độ nóng chảy cao nhất (3422°C), dùng làm dây tóc bóng đèn và dụng cụ cắt.",
  75: "Kim loại cực hiếm, dùng trong hợp kim chịu nhiệt cho động cơ phản lực và chất xúc tác.",
  76: "Nguyên tố có mật độ cao nhất (nặng nhất), dùng trong các hợp kim siêu cứng cho đầu bút bi.",
  77: "Kim loại chống ăn mòn tốt nhất, dùng trong bugi ô tô cao cấp và các thiết bị chịu nhiệt.",
  78: "Kim loại quý dùng làm đồ trang sức, chất xúc tác hóa học và trong điều trị ung thư.",
  79: "Kim loại quý hiếm, không bị oxy hóa, dùng làm trang sức, tiền tệ và trong điện tử cao cấp.",
  80: "Kim loại duy nhất ở dạng lỏng ở nhiệt độ thường, dùng trong nhiệt kế và áp kế.",
  81: "Kim loại rất độc, dùng trong các thiết bị cảm biến hồng ngoại và kính quang học đặc biệt.",
  82: "Kim loại nặng, mềm, dùng trong ắc quy xe máy, ô tô và làm tấm chắn ngăn tia phóng xạ.",
  83: "Kim loại duy nhất không độc trong nhóm kim loại nặng, dùng trong dược phẩm dạ dày.",
  84: "Nguyên tố phóng xạ cực độc, dùng làm nguồn nhiệt trong các tàu vũ trụ.",
  85: "Nguyên tố hiếm nhất trên vỏ Trái Đất, có tính phóng xạ mạnh, dùng trong điều trị ung thư.",
  86: "Khí phóng xạ tự nhiên, có thể tích tụ trong nhà và gây ung thư phổi nếu hít phải lâu ngày.",
  87: "Kim loại cực hiếm và phóng xạ mạnh, chỉ tồn tại trong thời gian rất ngắn.",
  88: "Kim loại phóng xạ, từng được dùng trong sơn phát quang đồng hồ, nay dùng trong trị liệu ung thư.",
  89: "Nguyên tố phóng xạ mạnh, phát ra ánh sáng xanh lam trong bóng tối.",
  90: "Kim loại phóng xạ có thể dùng làm nhiên liệu hạt nhân thay thế cho Uranium trong tương lai.",
  91: "Nguyên tố phóng xạ hiếm, cực độc, là sản phẩm trung gian trong quá trình phân rã Uranium.",
  92: "Kim loại nặng, có tính phóng xạ, dùng làm nhiên liệu cho các nhà máy điện hạt nhân.",
  93: "Nguyên tố phóng xạ nhân tạo đầu tiên nặng hơn Uranium, dùng trong các thiết bị phát hiện neutron.",
  94: "Nguyên tố phóng xạ dùng trong vũ khí hạt nhân và làm nguồn năng lượng cho tàu vũ trụ.",
  95: "Nguyên tố nhân tạo dùng trong hầu hết các thiết bị báo cháy ion hóa trong gia đình.",
  96: "Nguyên tố phóng xạ mạnh, dùng làm nguồn năng lượng cho các thiết bị trên mặt trăng.",
  97: "Nguyên tố nhân tạo được tìm thấy lần đầu tại Đại học California, Berkeley.",
  98: "Nguyên tố phóng xạ mạnh, dùng làm nguồn phát neutron trong kiểm tra vật liệu.",
  99: "Được phát hiện trong bụi từ vụ thử bom khinh khí đầu tiên vào năm 1952.",
  100: "Nguyên tố nặng nhất có thể tạo ra bằng cách bắn phá các nguyên tố nhẹ hơn bằng neutron.",
  101: "Được đặt tên theo nhà hóa học Dmitri Mendeleev, người tạo ra bảng tuần hoàn.",
  102: "Nguyên tố phóng xạ nhân tạo, được đặt tên theo Alfred Nobel.",
  103: "Nguyên tố cuối cùng trong họ Actinid, được đặt tên theo Ernest Lawrence.",
  104: "Nguyên tố siêu nặng đầu tiên sau họ Actinid, có đời sống cực ngắn.",
  105: "Nguyên tố nhân tạo, được đặt tên theo thành phố Dubna ở Nga.",
  106: "Đặt tên theo Glenn Seaborg, người có công lớn trong việc khám phá các nguyên tố siêu nặng.",
  107: "Nguyên tố siêu nặng, được đặt tên theo nhà vật lý Niels Bohr.",
  108: "Nguyên tố siêu nặng, được đặt tên theo bang Hesse của Đức.",
  109: "Đặt tên theo Lise Meitner, người đồng khám phá ra hiện tượng phân hạch hạt nhân.",
  110: "Đặt tên theo thành phố Darmstadt của Đức, nơi nó được tổng hợp lần đầu.",
  111: "Đặt tên theo Wilhelm Röntgen, người đã khám phá ra tia X.",
  112: "Đặt tên theo Nicolaus Copernicus, nhà thiên văn học vĩ đại.",
  113: "Nguyên tố đầu tiên được khám phá tại châu Á (Nhật Bản), Nihon nghĩa là Nhật Bản.",
  114: "Đặt tên theo phòng thí nghiệm Flerov tại Nga, chuyên nghiên cứu phản ứng hạt nhân.",
  115: "Đặt tên theo vùng Moscow của Nga, nơi có viện nghiên cứu hạt nhân Dubna.",
  116: "Đặt tên theo phòng thí nghiệm quốc gia Lawrence Livermore tại Hoa Kỳ.",
  117: "Đặt tên theo tiểu bang Tennessee của Hoa Kỳ, nơi có các viện nghiên cứu hạt nhân.",
  118: "Nguyên tố cuối cùng của bảng tuần hoàn hiện tại, đặt tên theo Yuri Oganessian."
};

const electronConfigs: Record<number, string> = {
  1: "1s1", 2: "1s2", 3: "[He] 2s1", 4: "[He] 2s2", 5: "[He] 2s2 2p1", 6: "[He] 2s2 2p2", 7: "[He] 2s2 2p3", 8: "[He] 2s2 2p4", 9: "[He] 2s2 2p5", 10: "[He] 2s2 2p6",
  11: "[Ne] 3s1", 12: "[Ne] 3s2", 13: "[Ne] 3s2 3p1", 14: "[Ne] 3s2 3p2", 15: "[Ne] 3s2 3p3", 16: "[Ne] 3s2 3p4", 17: "[Ne] 3s2 3p5", 18: "[Ne] 3s2 3p6",
  19: "[Ar] 4s1", 20: "[Ar] 4s2", 21: "[Ar] 3d1 4s2", 22: "[Ar] 3d2 4s2", 23: "[Ar] 3d3 4s2", 24: "[Ar] 3d5 4s1", 25: "[Ar] 3d5 4s2", 26: "[Ar] 3d6 4s2", 27: "[Ar] 3d7 4s2", 28: "[Ar] 3d8 4s2", 29: "[Ar] 3d10 4s1", 30: "[Ar] 3d10 4s2",
  31: "[Ar] 3d10 4s2 4p1", 32: "[Ar] 3d10 4s2 4p2", 33: "[Ar] 3d10 4s2 4p3", 34: "[Ar] 3d10 4s2 4p4", 35: "[Ar] 3d10 4s2 4p5", 36: "[Ar] 3d10 4s2 4p6",
  37: "[Kr] 5s1", 38: "[Kr] 5s2", 39: "[Kr] 4d1 5s2", 40: "[Kr] 4d2 5s2", 41: "[Kr] 4d4 5s1", 42: "[Kr] 4d5 5s1", 43: "[Kr] 4d5 5s2", 44: "[Kr] 4d7 5s1", 45: "[Kr] 4d8 5s1", 46: "[Kr] 4d10", 47: "[Kr] 4d10 5s1", 48: "[Kr] 4d10 5s2",
  49: "[Kr] 4d10 5s2 5p1", 50: "[Kr] 4d10 5s2 5p2", 51: "[Kr] 4d10 5s2 5p3", 52: "[Kr] 4d10 5s2 5p4", 53: "[Kr] 4d10 5s2 5p5", 54: "[Kr] 4d10 5s2 5p6",
  55: "[Xe] 6s1", 56: "[Xe] 6s2", 57: "[Xe] 5d1 6s2", 58: "[Xe] 4f1 5d1 6s2", 59: "[Xe] 4f3 6s2", 60: "[Xe] 4f4 6s2", 61: "[Xe] 4f5 6s2", 62: "[Xe] 4f6 6s2", 63: "[Xe] 4f7 6s2", 64: "[Xe] 4f7 5d1 6s2", 65: "[Xe] 4f9 6s2",
  66: "[Xe] 4f10 6s2", 67: "[Xe] 4f11 6s2", 68: "[Xe] 4f12 6s2", 69: "[Xe] 4f13 6s2", 70: "[Xe] 4f14 6s2", 71: "[Xe] 4f14 5d1 6s2", 72: "[Xe] 4f14 5d2 6s2", 73: "[Xe] 4f14 5d3 6s2", 74: "[Xe] 4f14 5d4 6s2", 75: "[Xe] 4f14 5d5 6s2",
  76: "[Xe] 4f14 5d6 6s2", 77: "[Xe] 4f14 5d7 6s2", 78: "[Xe] 4f14 5d9 6s1", 79: "[Xe] 4f14 5d10 6s1", 80: "[Xe] 4f14 5d10 6s2", 81: "[Xe] 4f14 5d10 6s2 6p1", 82: "[Xe] 4f14 5d10 6s2 6p2", 83: "[Xe] 4f14 5d10 6s2 6p3", 84: "[Xe] 4f14 5d10 6s2 6p4", 85: "[Xe] 4f14 5d10 6s2 6p5", 86: "[Xe] 4f14 5d10 6s2 6p6",
  87: "[Rn] 7s1", 88: "[Rn] 7s2", 89: "[Rn] 6d1 7s2", 90: "[Rn] 6d2 7s2", 91: "[Rn] 5f2 6d1 7s2", 92: "[Rn] 5f3 6d1 7s2", 93: "[Rn] 5f4 6d1 7s2", 94: "[Rn] 5f6 7s2", 95: "[Rn] 5f7 7s2", 96: "[Rn] 5f7 6d1 7s2", 97: "[Rn] 5f9 7s2",
  98: "[Rn] 5f10 7s2", 99: "[Rn] 5f11 7s2", 100: "[Rn] 5f12 7s2", 101: "[Rn] 5f13 7s2", 102: "[Rn] 5f14 7s2", 103: "[Rn] 5f14 7s2 7p1", 104: "[Rn] 5f14 6d2 7s2", 105: "[Rn] 5f14 6d3 7s2", 106: "[Rn] 5f14 6d4 7s2", 107: "[Rn] 5f14 6d5 7s2", 108: "[Rn] 5f14 6d6 7s2",
  109: "[Rn] 5f14 6d7 7s2", 110: "[Rn] 5f14 6d8 7s2", 111: "[Rn] 5f14 6d10 7s1", 112: "[Rn] 5f14 6d10 7s2", 113: "[Rn] 5f14 6d10 7s2 7p1", 114: "[Rn] 5f14 6d10 7s2 7p2", 115: "[Rn] 5f14 6d10 7s2 7p3", 116: "[Rn] 5f14 6d10 7s2 7p4", 117: "[Rn] 5f14 6d10 7s2 7p5", 118: "[Rn] 5f14 6d10 7s2 7p6"
};

const electronegativities: Record<number, string> = {
  1: "2.20", 2: "-", 3: "0.98", 4: "1.57", 5: "2.04", 6: "2.55", 7: "3.04", 8: "3.44", 9: "3.98", 10: "-",
  11: "0.93", 12: "1.31", 13: "1.61", 14: "1.90", 15: "2.19", 16: "2.58", 17: "3.16", 18: "-",
  19: "0.82", 20: "1.00", 21: "1.36", 22: "1.54", 23: "1.63", 24: "1.66", 25: "1.55", 26: "1.83", 27: "1.88", 28: "1.91", 29: "1.90", 30: "1.65",
  31: "1.81", 32: "2.01", 33: "2.18", 34: "2.55", 35: "2.96", 36: "3.00", 37: "0.82", 38: "0.95", 39: "1.22", 40: "1.33",
  41: "1.6", 42: "2.16", 43: "1.9", 44: "2.2", 45: "2.28", 46: "2.20", 47: "1.93", 48: "1.69", 49: "1.78", 50: "1.96",
  51: "2.05", 52: "2.1", 53: "2.66", 54: "2.6", 55: "0.79", 56: "0.89", 57: "1.1", 58: "1.12", 59: "1.13", 60: "1.14",
  61: "1.13", 62: "1.17", 63: "1.2", 64: "1.2", 65: "1.1", 66: "1.22", 67: "1.23", 68: "1.24", 69: "1.25", 70: "1.1",
  71: "1.27", 72: "1.3", 73: "1.5", 74: "2.36", 75: "1.9", 76: "2.2", 77: "2.2", 78: "2.28", 79: "2.54", 80: "2.00",
  81: "1.62", 82: "2.33", 83: "2.02", 84: "2.0", 85: "2.2", 86: "2.2", 87: "0.7", 88: "0.9", 89: "1.1", 90: "1.3",
  91: "1.5", 92: "1.38", 93: "1.36", 94: "1.28", 95: "1.13", 96: "1.28", 97: "1.3", 98: "1.3", 99: "1.3", 100: "1.3",
  101: "1.3", 102: "1.3", 103: "1.3", 104: "-", 105: "-", 106: "-", 107: "-", 108: "-", 109: "-", 110: "-",
  111: "-", 112: "-", 113: "-", 114: "-", 115: "-", 116: "-", 117: "-", 118: "-"
};

const oxidationStates: Record<number, string> = {
  1: "+1, -1", 2: "0", 3: "+1", 4: "+2", 5: "+3", 6: "+4, +2, -4", 7: "+5, +4, +3, +2, +1, -3", 8: "-2", 9: "-1", 10: "0",
  11: "+1", 12: "+2", 13: "+3", 14: "+4, -4", 15: "+5, +3, -3", 16: "+6, +4, +2, -2", 17: "+7, +5, +3, +1, -1", 18: "0",
  19: "+1", 20: "+2", 21: "+3", 22: "+4, +3, +2", 23: "+5, +4, +3, +2", 24: "+6, +3, +2", 25: "+7, +6, +4, +3, +2", 26: "+3, +2", 27: "+3, +2", 28: "+3, +2", 29: "+2, +1", 30: "+2",
  31: "+3", 32: "+4", 33: "+5, +3, -3", 34: "+6, +4, -2", 35: "+5, +3, +1, -1", 36: "0", 37: "+1", 38: "+2", 39: "+3", 40: "+4",
  41: "+5, +3", 42: "+6", 43: "+7, +4", 44: "+3", 45: "+3", 46: "+2", 47: "+1", 48: "+2", 49: "+3", 50: "+4, +2",
  51: "+5, +3, -3", 52: "+6, +4, -2", 53: "+7, +5, +1, -1", 54: "+8, +6, +4, +2", 55: "+1", 56: "+2", 57: "+3", 58: "+4, +3", 59: "+3", 60: "+3",
  61: "+3", 62: "+3, +2", 63: "+3, +2", 64: "+3", 65: "+4, +3", 66: "+3", 67: "+3", 68: "+3", 69: "+3, +2", 70: "+3, +2",
  71: "+3", 72: "+4", 73: "+5", 74: "+6", 75: "+7, +4", 76: "+4", 77: "+4, +3", 78: "+4, +2", 79: "+3, +1", 80: "+2, +1",
  81: "+3, +1", 82: "+4, +2", 83: "+3", 84: "+4, +2", 85: "+1, -1", 86: "0", 87: "+1", 88: "+2", 89: "+3", 90: "+4",
  91: "+5, +4", 92: "+6, +5, +4, +3", 93: "+6, +5, +4, +3", 94: "+6, +5, +4, +3", 95: "+6, +5, +4, +3", 96: "+3", 97: "+4, +3", 98: "+3", 99: "+3", 100: "+3",
  101: "+3, +2", 102: "+3, +2", 103: "+3", 104: "+4", 105: "+5", 106: "+6", 107: "+7", 108: "+8", 109: "+9", 110: "+8",
  111: "+5, +3, +1", 112: "+2", 113: "+3, +1", 114: "+4, +2", 115: "+3, +1", 116: "+4, +2", 117: "+5, +3, +1, -1", 118: "0"
};

const meltingPoints: Record<number, string> = {
  1: "-259.16 °C", 2: "-272.2 °C", 3: "180.5 °C", 4: "1287 °C", 5: "2076 °C", 6: "3550 °C", 7: "-210.1 °C", 8: "-218.79 °C", 9: "-219.67 °C", 10: "-248.59 °C",
  11: "97.72 °C", 12: "650 °C", 13: "660.32 °C", 14: "1414 °C", 15: "44.15 °C", 16: "115.21 °C", 17: "-101.5 °C", 18: "-189.35 °C",
  19: "63.38 °C", 20: "842 °C", 21: "1541 °C", 22: "1668 °C", 23: "1910 °C", 24: "1907 °C", 25: "1246 °C", 26: "1538 °C", 27: "1495 °C", 28: "1455 °C", 29: "1084.62 °C", 30: "419.53 °C",
  31: "29.76 °C", 32: "938.25 °C", 33: "817 °C", 34: "221 °C", 35: "-7.2 °C", 36: "-157.36 °C", 37: "39.31 °C", 38: "777 °C", 39: "1526 °C", 40: "1855 °C",
  41: "2477 °C", 42: "2623 °C", 43: "2157 °C", 44: "2334 °C", 45: "1964 °C", 46: "1554.9 °C", 47: "961.78 °C", 48: "321.07 °C", 49: "156.6 °C", 50: "231.93 °C",
  51: "630.63 °C", 52: "449.51 °C", 53: "113.7 °C", 54: "-111.7 °C", 55: "28.44 °C", 56: "727 °C", 57: "920 °C", 58: "798 °C", 59: "931 °C", 60: "1021 °C",
  61: "1042 °C", 62: "1072 °C", 63: "822 °C", 64: "1313 °C", 65: "1356 °C", 66: "1412 °C", 67: "1474 °C", 68: "1529 °C", 69: "1545 °C", 70: "819 °C",
  71: "1663 °C", 72: "2233 °C", 73: "3017 °C", 74: "3422 °C", 75: "3186 °C", 76: "3033 °C", 77: "2446 °C", 78: "1768.3 °C", 79: "1064.18 °C", 80: "-38.83 °C",
  81: "304 °C", 82: "327.46 °C", 83: "271.3 °C", 84: "254 °C", 85: "302 °C", 86: "-71 °C", 87: "27 °C", 88: "700 °C", 89: "1050 °C", 90: "1750 °C",
  91: "1572 °C", 92: "1132.2 °C", 93: "644 °C", 94: "639.4 °C", 95: "1176 °C", 96: "1345 °C", 97: "986 °C", 98: "900 °C", 99: "860 °C", 100: "1527 °C",
  101: "827 °C", 102: "827 °C", 103: "1627 °C", 104: "2100 °C", 105: "Đang cập nhật", 106: "Đang cập nhật", 107: "Đang cập nhật", 108: "Đang cập nhật", 109: "Đang cập nhật", 110: "Đang cập nhật",
  111: "Đang cập nhật", 112: "Đang cập nhật", 113: "430 °C", 114: "67 °C", 115: "400 °C", 116: "437 °C", 117: "400 °C", 118: "80 °C"
};

const boilingPoints: Record<number, string> = {
  1: "-252.87 °C", 2: "-268.93 °C", 3: "1342 °C", 4: "2470 °C", 5: "3927 °C", 6: "4827 °C", 7: "-195.79 °C", 8: "-182.95 °C", 9: "-188.12 °C", 10: "-246.08 °C",
  11: "883 °C", 12: "1090 °C", 13: "2519 °C", 14: "3265 °C", 15: "280.5 °C", 16: "444.6 °C", 17: "-34.04 °C", 18: "-185.85 °C",
  19: "759 °C", 20: "1484 °C", 21: "2830 °C", 22: "3287 °C", 23: "3407 °C", 24: "2671 °C", 25: "2061 °C", 26: "2862 °C", 27: "2927 °C", 28: "2913 °C", 29: "2562 °C", 30: "907 °C",
  31: "2204 °C", 32: "2833 °C", 33: "614 °C", 34: "685 °C", 35: "58.8 °C", 36: "-153.22 °C", 37: "688 °C", 38: "1382 °C", 39: "3345 °C", 40: "4409 °C",
  41: "4744 °C", 42: "4639 °C", 43: "4265 °C", 44: "4150 °C", 45: "3695 °C", 46: "2963 °C", 47: "2162 °C", 48: "767 °C", 49: "2072 °C", 50: "2602 °C",
  51: "1587 °C", 52: "988 °C", 53: "184.3 °C", 54: "-108.1 °C", 55: "671 °C", 56: "1897 °C", 57: "3464 °C", 58: "3443 °C", 59: "3520 °C", 60: "3074 °C",
  61: "3000 °C", 62: "1794 °C", 63: "1529 °C", 64: "3273 °C", 65: "3230 °C", 66: "2567 °C", 67: "2700 °C", 68: "2868 °C", 69: "1950 °C", 70: "1196 °C",
  71: "3402 °C", 72: "4603 °C", 73: "5458 °C", 74: "5555 °C", 75: "5596 °C", 76: "5012 °C", 77: "4428 °C", 78: "3825 °C", 79: "2856 °C", 80: "356.73 °C",
  81: "1473 °C", 82: "1749 °C", 83: "1564 °C", 84: "962 °C", 85: "337 °C", 86: "-61.7 °C", 87: "677 °C", 88: "1140 °C", 89: "3197 °C", 90: "4788 °C",
  91: "4000 °C", 92: "4131 °C", 93: "3902 °C", 94: "3228 °C", 95: "2607 °C", 96: "3110 °C", 97: "2627 °C", 98: "1470 °C", 99: "996 °C", 100: "Đang cập nhật",
  101: "Đang cập nhật", 102: "Đang cập nhật", 103: "Đang cập nhật", 104: "5500 °C", 105: "Đang cập nhật", 106: "Đang cập nhật", 107: "Đang cập nhật", 108: "Đang cập nhật", 109: "Đang cập nhật", 110: "Đang cập nhật",
  111: "Đang cập nhật", 112: "Đang cập nhật", 113: "1130 °C", 114: "150 °C", 115: "1100 °C", 116: "800 °C", 117: "610 °C", 118: "180 °C"
};

const characteristics: Record<number, string> = {
  1: "Khí, không màu", 2: "Khí, không màu", 3: "Rắn, trắng bạc", 4: "Rắn, xám bạc", 5: "Rắn, đen/nâu", 6: "Rắn, đen (than) hoặc trong suốt (kim cương)",
  7: "Khí, không màu", 8: "Khí, không màu", 9: "Khí, vàng nhạt", 10: "Khí, không màu", 11: "Rắn, trắng bạc", 12: "Rắn, trắng bạc",
  13: "Rắn, trắng bạc", 14: "Rắn, xám xanh", 15: "Rắn, trắng/đỏ/đen", 16: "Rắn, vàng chanh", 17: "Khí, vàng lục", 18: "Khí, không màu",
  19: "Rắn, trắng bạc", 20: "Rắn, xám bạc", 21: "Rắn, trắng bạc", 22: "Rắn, xám bạc", 23: "Rắn, xám bạc", 24: "Rắn, xám bạc", 25: "Rắn, xám bạc", 26: "Rắn, xám bóng", 27: "Rắn, xám bạc", 28: "Rắn, xám bạc", 29: "Rắn, đỏ đồng", 30: "Rắn, xám xanh",
  31: "Rắn, trắng bạc", 32: "Rắn, xám trắng", 33: "Rắn, xám kim loại", 34: "Rắn, xám bạc", 35: "Lỏng, đỏ nâu", 36: "Khí, không màu",
  37: "Rắn, trắng bạc", 38: "Rắn, vàng nhạt", 39: "Rắn, trắng bạc", 40: "Rắn, trắng bạc", 41: "Rắn, xám bạc", 42: "Rắn, xám bạc", 43: "Rắn, xám bạc", 44: "Rắn, xám bạc", 45: "Rắn, xám bạc", 46: "Rắn, trắng bạc", 47: "Rắn, trắng bóng", 48: "Rắn, xám bạc",
  49: "Rắn, trắng bạc", 50: "Rắn, trắng bạc", 51: "Rắn, xám bạc", 52: "Rắn, xám bạc", 53: "Rắn, tím đen", 54: "Khí, không màu",
  55: "Rắn, vàng nhạt", 56: "Rắn, trắng bạc", 57: "Rắn, trắng bạc", 58: "Rắn, trắng bạc", 59: "Rắn, trắng bạc", 60: "Rắn, trắng bạc",
  61: "Rắn, xám kim loại", 62: "Rắn, trắng bạc", 63: "Rắn, trắng bạc", 64: "Rắn, trắng bạc", 65: "Rắn, trắng bạc", 66: "Rắn, trắng bạc",
  67: "Rắn, trắng bạc", 68: "Rắn, trắng bạc", 69: "Rắn, trắng bạc", 70: "Rắn, trắng bạc", 71: "Rắn, trắng bạc", 72: "Rắn, xám bạc",
  73: "Rắn, xám xanh", 74: "Rắn, xám trắng", 75: "Rắn, trắng bạc", 76: "Rắn, xám xanh", 77: "Rắn, trắng bạc", 78: "Rắn, trắng bạc",
  79: "Rắn, vàng ánh kim", 80: "Lỏng, trắng bạc", 81: "Rắn, trắng bạc", 82: "Rắn, xám xanh", 83: "Rắn, trắng hồng", 84: "Rắn, xám bạc",
  85: "Rắn, đen kim loại", 86: "Khí, không màu", 87: "Rắn, trắng bạc", 88: "Rắn, trắng bạc", 89: "Rắn, trắng bạc", 90: "Rắn, trắng bạc",
  91: "Rắn, trắng bạc", 92: "Rắn, trắng bạc", 93: "Rắn, trắng bạc", 94: "Rắn, trắng bạc", 95: "Rắn, trắng bạc", 96: "Rắn, trắng bạc",
  97: "Rắn, trắng bạc", 98: "Rắn, trắng bạc", 99: "Rắn, trắng bạc", 100: "Rắn, trắng bạc", 101: "Rắn, trắng bạc", 102: "Rắn, trắng bạc",
  103: "Rắn, trắng bạc", 104: "Rắn, xám bạc", 105: "Rắn, xám bạc", 106: "Rắn, xám bạc", 107: "Rắn, xám bạc", 108: "Rắn, xám bạc",
  109: "Rắn, xám bạc", 110: "Rắn, xám bạc", 111: "Rắn, xám bạc", 112: "Rắn, xám bạc", 113: "Rắn, xám bạc", 114: "Rắn, xám bạc",
  115: "Rắn, xám bạc", 116: "Rắn, xám bạc", 117: "Rắn, xám bạc", 118: "Rắn, xám bạc"
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

  let cat = "post-transition-metal";
  let block = "";
  let isRadioactive = false;

  // Category Logic
  if (i === 1) cat = "nonmetal"; // Hydrogen is a nonmetal
  else if (g === 1 && p > 1) cat = "alkali-metal";
  else if (g === 2) cat = "alkaline-earth";
  else if (i >= 57 && i <= 71) cat = "lanthanide";
  else if (i >= 89 && i <= 103) cat = "actinide";
  else if (g >= 3 && g <= 12) cat = "transition-metal";
  else if (g === 18) cat = "noble-gas";
  else if ([7, 8, 9, 17].includes(i)) cat = "halogen"; // Reactive nonmetals
  else if ([5, 14, 33, 52].includes(i)) cat = "nonmetal"; 
  else if ([6, 15, 16, 34].includes(i)) cat = "nonmetal";
  else if (g === 17 && i !== 117) cat = "halogen"; // Halogens except Ts
  else if ([13, 31, 32, 49, 50, 51, 81, 82, 83, 84, 117].includes(i)) cat = "post-transition-metal"; // Added 117 (Ts) as metal

  // Block Logic
  if (g <= 2 || i === 2) block = "block-s";
  else if (g >= 13) block = "block-p";
  else if (g >= 3 && g <= 12) block = "block-d";
  if ((i >= 57 && i <= 71) || (i >= 89 && i <= 103)) block = "block-f";

  // Radioactive Logic (Z > 83 or Tc, Pm)
  if (i > 83 || i === 43 || i === 61) isRadioactive = true;

  let stateStr = "Rắn";
  if ([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86].includes(i)) stateStr = "Khí";
  else if ([35, 80].includes(i)) stateStr = "Lỏng";
  else if (i > 103) stateStr = "Chưa xác định";

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
    phonetic: phonetics[i] || "/.../",
    atomicMass: atomicMasses[i - 1],
    category: cat,
    block: block,
    isRadioactive: isRadioactive,
    group: g,
    period: p,
    description: detailedDescriptions[i] || `Nguyên tố ${name} là một phần quan trọng của bảng tuần hoàn hóa học.`,
    image: i <= 103 
      ? `https://images-of-elements.com/s/${imageName}.jpg`
      : `https://picsum.photos/seed/chemistry-${symbol}/400/400`,
    color: "bg-slate-200",
    discoverer: discoverers[i] || "Đang cập nhật",
    state: stateStr,
    summary: `Nguyên tố hóa học số hiệu ${i}`,
    electronConfiguration: electronConfigs[i] || "Đang cập nhật",
    electronegativity: electronegativities[i] || "Đang cập nhật",
    oxidationStates: oxidationStates[i] || "Đang cập nhật",
    meltingPoint: meltingPoints[i] || "Đang cập nhật",
    boilingPoint: boilingPoints[i] || "Đang cập nhật",
    characteristics: characteristics[i] || `${stateStr}, màu sắc đang cập nhật`
  });
}

export const categoryColors: Record<string, string> = {
  "metal": "#90CAF9",
  "nonmetal": "#F48FB1",
  "noble-gas": "#FFF176",
  "hydrogen": "#F48FB1",
  "alkali-metal": "#90CAF9",
  "alkaline-earth": "#90CAF9",
  "transition-metal": "#90CAF9",
  "post-transition-metal": "#90CAF9",
  "metalloid": "#F48FB1",
  "halogen": "#F48FB1",
  "lanthanide": "#90CAF9",
  "actinide": "#90CAF9"
};

elements.forEach(e => {
  const categoryColor = categoryColors[e.category] || "#E2E8F0";
  
  // If it's a gas, mix the category color with semi-transparent white 
  // to represent "colorless" but still show the category hint
  if (e.state === "Khí") {
    e.color = categoryColor; 
    // We can use a slightly alternative style in CSS if needed, 
    // but for now we'll stick to category colors to keep unification.
    return;
  }

  e.color = categoryColor;
});

export const blockColors: Record<string, string> = {
  "block-s": "#C5E1A5",
  "block-p": "#FFE082",
  "block-d": "#90CAF9",
  "block-f": "#F48FB1",
  "radioactive": "#FAD0C4"
};
