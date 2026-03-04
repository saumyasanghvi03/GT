import {
  DevvandanSequence,
  BhavaYatraStation,
  NavpadDay,
  PujaSubstance,
  ShatrunjayaName,
} from "@/types/ritual";

export const chaitriPunamDevvandans: DevvandanSequence[] = [
  {
    id: 1,
    nameEn: "First Devvandan",
    nameGu: "પ્રથમ દેવવંદન",
    descriptionEn:
      "The day initiates with the recitation of the Santikaram Stotra, a powerful hymn designed to invoke universal peace and dispel spiritual and physical afflictions.",
    descriptionGu:
      "દિવસ સાંતિકરમ સ્તોત્રના પઠન સાથે શરૂ થાય છે, જે સાર્વત્રિક શાંતિ પ્રાપ્ત કરવા અને આધ્યાત્મિક તથા શારીરિક કષ્ટોને દૂર કરવા માટેનું શક્તિશાળી સ્તોત્ર છે.",
  },
  {
    id: 2,
    nameEn: "Second Devvandan",
    nameGu: "બીજું દેવવંદન",
    descriptionEn:
      "Focuses entirely on the Namiun Stotra, acting as a deep veneration of the Tirthankaras and an acknowledgment of their supreme spiritual supremacy.",
    descriptionGu:
      "સંપૂર્ણ રીતે નમિઉણ સ્તોત્ર પર કેન્દ્રિત, જે તીર્થંકરોની ગહન પૂજા અને તેમની સર્વોચ્ચ આધ્યાત્મિક શ્રેષ્ઠતાની સ્વીકૃતિ છે.",
  },
  {
    id: 3,
    nameEn: "Third Devvandan",
    nameGu: "ત્રીજું દેવવંદન",
    descriptionEn:
      "Centered on the recitation of the Jai Tihuan Stotra.",
    descriptionGu: "જય તિહુઅણ સ્તોત્રના પઠન પર કેન્દ્રિત.",
  },
  {
    id: 4,
    nameEn: "Fourth Devvandan",
    nameGu: "ચોથું દેવવંદન",
    descriptionEn:
      "The most time-intensive sequence, revolving around the complete, uninterrupted recitation of the 44-verse Bhaktamar Stotra, praising the virtues of Lord Adinath.",
    descriptionGu:
      "સૌથી વધુ સમય લેતો ક્રમ, જેમાં ભગવાન આદિનાથના ગુણોની સ્તુતિ કરતા ૪૪ શ્લોકના ભક્તામર સ્તોત્રનું સંપૂર્ણ, અખંડ પઠન કરવામાં આવે છે.",
  },
  {
    id: 5,
    nameEn: "Fifth Devvandan",
    nameGu: "પાંચમું દેવવંદન",
    descriptionEn:
      "A full, traditional Chaityavandan procedure performed in front of the Jina's idol. Following the five Devvandans, the practitioner performs 150 Kausagg pad and administers the Upvas Pachkhan (vow of complete fasting) and its subsequent Parna (breaking of the fast).",
    descriptionGu:
      "જિનની મૂર્તિ સામે સંપૂર્ણ, પરંપરાગત ચૈત્યવંદન વિધિ. પાંચ દેવવંદન પછી, સાધક ૧૫૦ કૌસગ્ગ પદ કરે છે અને ઉપવાસ પચ્ચખાણ (સંપૂર્ણ ઉપવાસનો સંકલ્પ) અને ત્યારબાદ પારણું (ઉપવાસ તોડવો) કરે છે.",
  },
];

export const chaitriPunamSignificanceEn =
  "Chaitri Punam, occurring on the 15th day of the bright half of the Gujarati month of Chaitra, signifies the conclusion of the Ayambil Oli fast. On this day, Pundarik Swami — the First Gandhar and grandson of Adinatha Bhagwan — attained liberation on Mount Shatrunjay alongside 50 million monks. This is why Mount Shatrunjay is also called Pundarikgiri. It also commemorates the liberation of Nami and Vinami with 20 million ascetics.";

export const chaitriPunamSignificanceGu =
  "ચૈત્રી પૂનમ, ગુજરાતી ચૈત્ર મહિનાની શુક્લ પક્ષની ૧૫મી તિથિએ આવે છે, જે આયંબિલ ઓળીના ઉપવાસના સમાપનનું પ્રતીક છે. આ દિવસે, પુંડરીક સ્વામી — પ્રથમ ગણધર અને આદિનાથ ભગવાનના પૌત્ર — એ શત્રુંજય પર્વત પર ૫ કરોડ મુનિઓ સાથે મોક્ષ પ્રાપ્ત કર્યો. આ જ કારણે શત્રુંજયને પુંડરીકગિરિ પણ કહેવામાં આવે છે. આ દિવસ નમિ અને વિનામિના ૨ કરોડ સાધુઓ સાથે મોક્ષનું પણ સ્મરણ કરાવે છે.";

// ---------------------------------------------------------------------------
// Bhava Yatra — Five Chaityavandan Stations
// ---------------------------------------------------------------------------
export const bhavaYatraStations: BhavaYatraStation[] = [
  {
    id: 1,
    nameEn: "Jay Taleti",
    nameGu: "જય તળેટી",
    focusEn: "Threshold of the Lord — where the ascent begins with deep humility",
    focusGu: "પ્રભુ-ચરણ — જ્યાં નમ્રતા સાથે પર્વતારોહણનો પ્રારંભ થાય છે",
    verseEn:
      "Shree Shatrunjaya Siddhakshetra… the very dust of this path has liberated millions.",
    verseGu:
      "શ્રી શત્રુંજય સિદ્ધક્ષેત્ર… આ પથની રજકણ પણ કરોડોને મુક્ત કરનારી છે.",
    actionsEn: ["Nisihi × 3 (Mental renunciation)", "Khamasana to the Hill", "Logassa Recitation"],
    actionsGu: ["નિસીહિ × ૩ (આંતરિક ત્યાગ)", "ગિરિરાજને ખમાસમણ", "લોગસ્સ પાઠ"],
  },
  {
    id: 2,
    nameEn: "Shree Shantinath (Babu nu Deru)",
    nameGu: "શ્રી શાંતિનાથ (બાબુ નું ડેરું)",
    focusEn: "The Aura of Peace — 16th Tirthankara's sacred site of tranquility",
    focusGu: "શાંતિનો પુંજ — ૧૬મા તીર્થંકરનું પવિત્ર શાંતિ સ્થળ",
    actionsEn: ["Chaityavandan", "Visualizing life-sized golden carvings", "Peace prayers"],
    actionsGu: ["ચૈત્યવંદન", "શાંત મુદ્રા અને સુવર્ણ કલાકૃતિનું સ્મરણ", "શાંતિ પ્રાર્થના"],
  },
  {
    id: 3,
    nameEn: "Rayan Pagla",
    nameGu: "રાયણ પગલાં",
    focusEn: "The Eternal Tree — site of Lord's footprints and first divine sermon",
    focusGu: "શાશ્વત રાયણ — પ્રભુ-પગલાં અને પ્રથમ દેશનાનું સ્થળ",
    verseEn: "Beneath the Rayan tree, find the feet that lead to liberation.",
    verseGu: "રાયણ હેઠે પ્રભુ પગલે, ભવ-બંધન કાપો.",
    actionsEn: [
      "Khamasana at footprints",
      "Special Chaityavandan — focusing on 99 visits of Adinath Bhagwan",
    ],
    actionsGu: [
      "પગલે ખમાસમણ",
      "વિશેષ ચૈત્યવંદન — આદિનાથ ભગવાનના ૯૯ પ્રવાસ પર ધ્યાન",
    ],
  },
  {
    id: 4,
    nameEn: "Pundarik Swami (The Principal Disciple)",
    nameGu: "પુંડરીક સ્વામી (પ્રથમ ગણધર)",
    focusEn:
      "The Master of Chaitri Punam — first Gandhar of Adinath who attained Moksha here with 5 crore monks",
    focusGu: "ચૈત્રી પૂનમ-નાયક — આદિનાથના પ્રથમ ગણધર જેમણે ૫ કરોડ મુનિ સાથે મોક્ષ મેળવ્યો",
    actionsEn: [
      "Chaityavandan dedicated to Pundarikgiri",
      "Venerating the 50 million liberated monks",
      "Kausagg of 150 counts (optional station focus)",
    ],
    actionsGu: ["પુંડરીકગિરિને સમર્પિત ચૈત્યવંદન", "૫ કરોડ મુનિઓને વંદન", "૧૫૦ કૌસગ્ગ (વૈકલ્પિક ધ્યાન)"],
  },
  {
    id: 5,
    nameEn: "Adinath Dahshur — Main Temple Sanctuary",
    nameGu: "આદિનાથ ભગવાન — મૂળ નાયક જીનલય",
    focusEn: "Divine Communion — The ultimate goal where Adinath's presence fills the soul",
    focusGu: "પ્રભુ સાક્ષાત્કાર — જ્યાં આદિનાથની ઉપસ્થિતિ આત્માને તરબોળ કરે છે",
    verseEn: "Infinite, eternal, the Lord of all Jinas, Shree Adinath…",
    verseGu: "અનંત, અક્ષય, સર્વ જિનોના સ્વામી, શ્રી આદિનાથ ભગવાન…",
    actionsEn: [
      "Traditional Shwetambar Chaityavandan",
      "Bhava Ashtaprakari Puja (Offering inner Jal, Chandan, etc.)",
      "Parikrama (Circumambulation of the sanctum)",
    ],
    actionsGu: [
      "પરંપરાગત શ્વેતાંબર ચૈત્યવંદન",
      "ભાવ અષ્ટપ્રકારી પૂજા (આંતરિક અર્પણ)",
      "જિનમંદિરની પરિક્રમા (પ્રદક્ષિણા)",
    ],
  },
];

// ---------------------------------------------------------------------------
// Navpad Ayambil Oli — 9-day fasting cycle
// ---------------------------------------------------------------------------
export const navpadOliDays: NavpadDay[] = [
  {
    day: 1,
    entityEn: "Arihant",
    entityGu: "અરિહંત",
    focusEn: "Conquered inner enemies",
    focusGu: "અંતર-શત્રુ વિજેતા",
  },
  {
    day: 2,
    entityEn: "Siddha",
    entityGu: "સિદ્ધ",
    focusEn: "Liberated souls",
    focusGu: "મુક્ત આત્માઓ",
  },
  {
    day: 3,
    entityEn: "Acharya",
    entityGu: "આચાર્ય",
    focusEn: "Spiritual leadership",
    focusGu: "આધ્યાત્મિક નેતૃત્વ",
  },
  {
    day: 4,
    entityEn: "Upadhyay",
    entityGu: "ઉપાધ્યાય",
    focusEn: "Scriptural mastery",
    focusGu: "શાસ્ત્ર-નિપુણ",
  },
  {
    day: 5,
    entityEn: "Sadhu",
    entityGu: "સાધુ",
    focusEn: "Renunciation",
    focusGu: "ત્યાગ",
  },
  {
    day: 6,
    entityEn: "Samyag Darshan",
    entityGu: "સમ્યગ્ દર્શન",
    focusEn: "Right Faith",
    focusGu: "સમ્યક્ શ્રદ્ધા",
  },
  {
    day: 7,
    entityEn: "Samyag Gyan",
    entityGu: "સમ્યગ્ જ્ઞાન",
    focusEn: "Right Knowledge",
    focusGu: "સમ્યક્ જ્ઞાન",
  },
  {
    day: 8,
    entityEn: "Samyag Charitra",
    entityGu: "સમ્યગ્ ચારિત્ર",
    focusEn: "Right Conduct",
    focusGu: "સમ્યક્ આચરણ",
  },
  {
    day: 9,
    entityEn: "Samyag Tap",
    entityGu: "સમ્યગ્ તપ",
    focusEn: "Right Penance — Chaitra Purnima",
    focusGu: "સમ્યક્ તપ — ચૈત્રી પૂર્ણિમા",
    isToday: true,
  },
];

export const ayambilForbiddenEn = [
  "Dairy products",
  "Oil or ghee",
  "Sugar or jaggery",
  "Spices",
  "Fried foods",
  "Raw green vegetables",
];
export const ayambilAllowedEn = [
  "Plain boiled rice",
  "Mung (plain, unseasoned)",
  "Plain wheat / roti (no salt or spices)",
];
export const ayambilPurposeEn =
  "Conquer the tongue → conquer the senses → weaken karmic influx (āsrava).";

export const ayambilForbiddenGu = [
  "દૂધ-દહીં",
  "તેલ-ઘી",
  "ખાંડ-ગોળ",
  "મસાલા",
  "તળેલા પદાર્થ",
  "કાચી લીલી શાકભાજી",
];
export const ayambilAllowedGu = [
  "સાદો ઉકળેલ ભાત",
  "સાદો મગ (મસાલા વગર)",
  "સાદી ઘઉં-ચપાટી (મીઠા-મસાલા વગર)",
];
export const ayambilPurposeGu =
  "જીભ જીતો → ઇન્દ્રિયો જીતો → આસ્રવ (કર્મ-આગમ) ઘટાડો.";

// ---------------------------------------------------------------------------
// Ashtaprakari Puja — 8 substances
// ---------------------------------------------------------------------------
export const ashtaprakariPuja: PujaSubstance[] = [
  {
    id: 1,
    nameEn: "Jal",
    nameGu: "જળ",
    meaningEn: "Cleansing karmas",
    meaningGu: "કર્મ-શુદ્ધિ",
  },
  {
    id: 2,
    nameEn: "Chandan",
    nameGu: "ચંદન",
    meaningEn: "Cooling the passions",
    meaningGu: "કષાયો ઠંડા",
  },
  {
    id: 3,
    nameEn: "Pushpa",
    nameGu: "પુષ્પ",
    meaningEn: "Blossoming faith",
    meaningGu: "શ્રદ્ધા ખીલે",
  },
  {
    id: 4,
    nameEn: "Dhup",
    nameGu: "ધૂપ",
    meaningEn: "Self-sacrifice",
    meaningGu: "આત્મ-ત્યાગ",
  },
  {
    id: 5,
    nameEn: "Deep",
    nameGu: "દીપ",
    meaningEn: "Light of omniscience",
    meaningGu: "સર્વજ્ઞ-પ્રકાશ",
  },
  {
    id: 6,
    nameEn: "Akshat",
    nameGu: "અક્ષત",
    meaningEn: "Ending karmic rebirth",
    meaningGu: "ભવ-અંત",
  },
  {
    id: 7,
    nameEn: "Naivedya",
    nameGu: "નૈવૈદ્ય",
    meaningEn: "Renouncing taste",
    meaningGu: "રસ-ત્યાગ",
  },
  {
    id: 8,
    nameEn: "Fal",
    nameGu: "ફળ",
    meaningEn: "Moksha",
    meaningGu: "મોક્ષ",
  },
];

// ---------------------------------------------------------------------------
// Parna — Breaking the fast
// ---------------------------------------------------------------------------
export const parnaInfoEn =
  "The morning after Chaitra Purnima the 9-day Ayambil fast is formally broken. The transition is stepwise: begin with sugar water, then mung water, then a light meal. Traditional Parna foods include mung, papad, methi, sheera, and khakhra. This disciplined re-entry into normal eating embodies the Jain principle that even the end of austerity must be mindful.";
export const parnaInfoGu =
  "ચૈત્રી પૂર્ણિમા પછીની સવારે ૯ દિવસના આયંબિલ ઉપવાસ ઔપચારિક રીતે છૂટે છે. ઉત્ક્રમ ધીમો છે: પ્રથમ ખાંડ-પાણી, પછી મગ-પાણી, ત્યારબાદ હળવો ભોજન. પારણાની પરંપરાગત વાનગીઓ: મગ, પાપડ, મેથી, શીરો, ખાખરા. આ સજ્ઞ ક્રમ ભોજન ફરી ગ્રહણ એ જૈન સિદ્ધાંત દર્શાવે છે: તપ-સમાપ્તિ પણ સજાગ હોવી જોઈએ.";

// ---------------------------------------------------------------------------
// Key Names of Shatrunjaya
// ---------------------------------------------------------------------------
export const shatrunjayaNames: ShatrunjayaName[] = [
  {
    nameEn: "Shatrunjaya",
    nameGu: "શત્રુંજય",
    meaningEn: "Conqueror of Inner Enemies",
    meaningGu: "અંતર-શત્રુ વિજેતા",
  },
  {
    nameEn: "Siddhakshetra",
    nameGu: "સિદ્ધક્ષેત્ર",
    meaningEn: "Field of Liberated Souls",
    meaningGu: "સિદ્ધ-ભૂમિ",
  },
  {
    nameEn: "Vimalachal",
    nameGu: "વિમળાચળ",
    meaningEn: "Stainless Mountain",
    meaningGu: "નિર્મળ ગિરિ",
  },
  {
    nameEn: "Pundarikgiri",
    nameGu: "પુંડરીક ગિરિ",
    meaningEn: "Named for Pundarik Swami",
    meaningGu: "પુંડરીક સ્વામીના નામ પરથી",
  },
  {
    nameEn: "Mahagiri",
    nameGu: "મહાગિરિ",
    meaningEn: "The Great Mountain",
    meaningGu: "મહા ગિરિ",
  },
  {
    nameEn: "Shashvatgiri",
    nameGu: "શાશ્વત ગિરિ",
    meaningEn: "Eternal Peak — survives all cosmic cycles",
    meaningGu: "શાશ્વત શિખર — સૃષ્ટિ ચક્ર પછી પણ અક્ષુણ્ણ",
  },
];

export const chaitriPunamVidhiPreparations = {
  en: "Bathe, wear clean white clothes, cover mouth with muhpatti, and sit on a clean asan facing Bhagwan (Adinath or Shatrunjaya photo). Prepare ashtaprakārī: jal, chandan, pushp/akshat, dhoop, deep, naivedya, fal, and mala.",
  gu: "સ્નાન કરી, શુદ્ધ સફેદ કપડાં પહેરો, મુહપત્તી બાંધો અને પ્રભુ (આદિનાથ અથવા શત્રુંજય ફોટો) સામે સ્વચ્છ આસન પર બેસો. અષ્ટપ્રકારી સામગ્રી તૈયાર કરો: જળ, ચંદન, પુષ્પ/અક્ષત, ધૂપ, દીપ, નૈવેદ્ય, ફળ અને માળા.",
};

export const detailedChaitriPunamSteps = [
  {
    id: 1,
    titleEn: "Śrut-Sāmayik (Morning Start)",
    titleGu: "શ્રુત-સામાયિક (પ્રભાત પ્રારંભ)",
    descEn: "Recite Icchhāmi Khamāsaman sutra. Enter 48-minute sāmayik: Navkār (9x), Logassa, Jai Viyarāyā, Jag Channam, full sequence up to Kausagg. Meditate on Pundarīk Swami's moksh with 5 crore munis at Shatrunjaya.",
    descGu: "ઈચ્છામી ખમાસમણ સૂત્રનો પાઠ કરો. ૪૮ મિનિટનું સામાયિક લો: નવકાર (૯ વાર), લોગસ્સ, જયવિયરાય, જગચિંતમણી, કૌસગ્ગ સુધીનો ક્રમ. શત્રુંજય પર ૫ કરોડ મુનિઓ સાથે પુંડરીક સ્વામીના મોક્ષનું ધ્યાન ધરો.",
  },
  {
    id: 2,
    titleEn: "Devvandan Vidhi (Round 1)",
    titleGu: "દેવવંદન વિધિ (પ્રથમ રાઉન્ડ)",
    descEn: "Offer ashtaprakārī pūjā. Recite full Devvandan sutras: Navkār (3–9x), Namutthunam, Vandittāu, etc. Sing 1 stavan (Santikaram or Shatrunjaya stuti).",
    descGu: "અષ્ટપ્રકારી પૂજા કરો. સંપૂર્ણ દેવવંદન સૂત્રો: નવકાર (૩-૯ વાર), નમુત્થુણં, વંદિત્તાુ વગેરે. ૧ સ્તવન (સાંતિકરમ અથવા શત્રુંજય સ્તુતિ) ગાઓ.",
  },
  {
    id: 3,
    titleEn: "Chaityavandan",
    titleGu: "ચૈત્યવંદન",
    descEn: "Complete daily Chaityavandan: Logassa, Chaturviṃśati-stava, Pañca-Parameṣṭhi. Do 11–21 swastik with akshat. Perform 3–7 pradakṣiṇā (circumambulations).",
    descGu: "દૈનિક ચૈત્યવંદન: લોગસ્સ, ચતુર્વિંશતિ-સ્તવ, પંચ-પરમેષ્ઠી વંદન. અક્ષતથી ૧૧-૨૧ સાથિયા (સ્વસ્તિક) કરો. ૩-૭ પ્રદક્ષિણા કરો.",
  },
  {
    id: 4,
    titleEn: "Moto Stotra and Extra Kriyā",
    titleGu: "મોટા સ્તોત્ર અને વિશેષ ક્રીયા",
    descEn: "Recite 5 moto stotra: Bhaktāmar, Uvasaggaharam, Logassa (multiple), Jitśatrurājā, Tijay Pahuttam. Add 150 Logassa kāyotsarg and 20 mālā of Navkār.",
    descGu: "૫ મોટા સ્તોત્ર: ભક્તામર, ઉવસગ્ગહરં, લોગસ્સ (બહુવિધ), જીતશત્રુરાજા, તિજય પહુત્તમ. ૧૫૦ લોગસ્સનો કૌસગ્ગ અને ૨૦ માળા ગણો.",
  },
  {
    id: 5,
    titleEn: "Follow-up Devvandan",
    titleGu: "અનુગામી દેવવંદન",
    descEn: "Repeat 2-5 devvandan blocks. Recite Namiun Stotra, Jai Tihuan, and short stavans between rounds.",
    descGu: "૨ થી ૫ દેવવંદન બ્લોક્સનું પુનરાવર્તન કરો. રાઉન્ડ વચ્ચે નમિઉણ સ્તોત્ર, જય તિહુઅણ અને ટૂંકા સ્તવનો ગાઓ.",
  },
  {
    id: 6,
    titleEn: "Devasi Pratikraman (Evening)",
    titleGu: "દેવસી પ્રતિક્રમણ (સાંજ)",
    descEn: "Full Tapāgacch Devasi Pratikraman: Sāmāyik, Chauvisattho, Vandittāu, Pratikraman, Kausagg, Khamāsaman. End with arti and maṅgal dīvo.",
    descGu: "સંપૂર્ણ તપગચ્છ દેવસી પ્રતિક્રમણ: સામાયિક, ચૌવીસત્થો, વંદિત્તાુ, પ્રતિક્રમણ, કૌસગ્ગ, ખમાસમણ. આરતી અને મંગળ દીવો સાથે સમાપન કરો.",
  },
  {
    id: 7,
    titleEn: "Pārṇā (Closing)",
    titleGu: "પારણું (સમાપ્તિ)",
    descEn: "Upvās paccakkhān vidhi: Navkār, paccakkhān sutra, sip water with bhāv. Recite duhā and mitchāmī dukkaḍaṃ.",
    descGu: "ઉપવાસ પચ્ચખાણ વિધિ: નવકાર, પચ્ચખાણ સૂત્ર, ભાવપૂર્વક જળ ગ્રહણ કરો. દુહા અને મિચ્છામી દુક્કડં કહો.",
  },
];

export const vidhiMaterials = [
  { item: "Jal", qty: "1 small kalash", purpose: "Pure water for bhāv abhiṣek" },
  { item: "Chandan", qty: "Small bowl", purpose: "Sandalwood paste for tilak" },
  { item: "Puṣp/Akṣat", qty: "Handful rice", purpose: "Symbolizes blossoms of faith" },
  { item: "Dhūp", qty: "1–3 sticks", purpose: "Incense for spiritual aura" },
  { item: "Dīpa", qty: "Ghee lamp", purpose: "Light of omniscience" },
  { item: "Naivedya", qty: "Sweets/Mishri", purpose: "Renouncing taste" },
  { item: "Phal", qty: "5–11 fruits", purpose: "Symbolizes Moksha (Final Fruit)" },
  { item: "Mala", qty: "1 garland", purpose: "For Jaymālā" },
];

export const recommendedFruits = [
  "Banana (Kela)", "Apple (Seb)", "Pomegranate (Seeds)", "Grapes (Anar)", "Sweet Lime", "Dates", "Figs"
];

