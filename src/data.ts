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
  47: "[Kr] 4d10 5s1", 50: "[Kr] 4d10 5s2 5p2", 79: "[Xe] 4f14 5d10 6s1", 80: "[Xe] 4f14 5d10 6s2", 82: "[Xe] 4f14 5d10 6s2 6p2", 92: "[Rn] 5f3 6d1 7s2"
};

const electronegativities: Record<number, string> = {
  1: "2.20", 2: "-", 3: "0.98", 4: "1.57", 5: "2.04", 6: "2.55", 7: "3.04", 8: "3.44", 9: "3.98", 10: "-",
  11: "0.93", 12: "1.31", 13: "1.61", 14: "1.90", 15: "2.19", 16: "2.58", 17: "3.16", 18: "-",
  19: "0.82", 20: "1.00", 26: "1.83", 29: "1.90", 30: "1.65", 47: "1.93", 50: "1.96", 79: "2.54", 80: "2.00", 82: "2.33", 92: "1.38"
};

const oxidationStates: Record<number, string> = {
  1: "+1, -1", 2: "0", 3: "+1", 4: "+2", 5: "+3", 6: "+4, +2, -4", 7: "+5, +4, +3, +2, +1, -3", 8: "-2", 9: "-1", 10: "0",
  11: "+1", 12: "+2", 13: "+3", 14: "+4, -4", 15: "+5, +3, -3", 16: "+6, +4, +2, -2", 17: "+7, +5, +3, +1, -1", 18: "0",
  19: "+1", 20: "+2", 26: "+3, +2", 29: "+2, +1", 30: "+2", 47: "+1", 50: "+4, +2", 79: "+3, +1", 80: "+2, +1", 82: "+4, +2", 92: "+6, +5, +4, +3"
};

const meltingPoints: Record<number, string> = {
  1: "-259.16 °C", 2: "-272.2 °C", 3: "180.5 °C", 4: "1287 °C", 5: "2076 °C", 6: "3550 °C", 7: "-210.1 °C", 8: "-218.79 °C", 9: "-219.67 °C", 10: "-248.59 °C",
  11: "97.72 °C", 12: "650 °C", 13: "660.32 °C", 14: "1414 °C", 15: "44.15 °C", 16: "115.21 °C", 17: "-101.5 °C", 18: "-189.35 °C",
  19: "63.38 °C", 20: "842 °C", 26: "1538 °C", 29: "1084.62 °C", 30: "419.53 °C", 47: "961.78 °C", 50: "231.93 °C", 79: "1064.18 °C", 80: "-38.83 °C", 82: "327.46 °C", 92: "1132.2 °C"
};

const boilingPoints: Record<number, string> = {
  1: "-252.87 °C", 2: "-268.93 °C", 3: "1342 °C", 4: "2470 °C", 5: "3927 °C", 6: "4827 °C", 7: "-195.79 °C", 8: "-182.95 °C", 9: "-188.12 °C", 10: "-246.08 °C",
  11: "883 °C", 12: "1090 °C", 13: "2519 °C", 14: "3265 °C", 15: "280.5 °C", 16: "444.6 °C", 17: "-34.04 °C", 18: "-185.85 °C",
  19: "759 °C", 20: "1484 °C", 26: "2862 °C", 29: "2562 °C", 30: "907 °C", 47: "2162 °C", 50: "2602 °C", 79: "2856 °C", 80: "356.73 °C", 82: "1749 °C", 92: "4131 °C"
};

const characteristics: Record<number, string> = {
  1: "Khí, không màu", 2: "Khí, không màu", 3: "Rắn, trắng bạc", 4: "Rắn, xám bạc", 5: "Rắn, đen/nâu", 6: "Rắn, đen (than) hoặc trong suốt (kim cương)",
  7: "Khí, không màu", 8: "Khí, không màu", 9: "Khí, vàng nhạt", 10: "Khí, không màu", 11: "Rắn, trắng bạc", 12: "Rắn, trắng bạc",
  13: "Rắn, trắng bạc", 14: "Rắn, xám xanh", 15: "Rắn, trắng/đỏ/đen", 16: "Rắn, vàng chanh", 17: "Khí, vàng lục", 18: "Khí, không màu",
  19: "Rắn, trắng bạc", 20: "Rắn, xám bạc", 26: "Rắn, xám bóng", 29: "Rắn, đỏ đồng", 30: "Rắn, xám xanh", 47: "Rắn, trắng bóng",
  50: "Rắn, trắng bạc", 79: "Rắn, vàng ánh kim", 80: "Lỏng, trắng bạc", 82: "Rắn, xám xanh", 92: "Rắn, trắng bạc"
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
