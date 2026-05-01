import type {
  College,
  Combination,
  CourseOffering,
  District
} from "./types";

export const DISTRICTS: District[] = [
  "Shimla",
  "Kangra",
  "Mandi",
  "Solan",
  "Kullu",
  "Chamba",
  "Una",
  "Hamirpur",
  "Bilaspur",
  "Sirmaur",
  "Kinnaur",
  "Lahaul & Spiti"
];

export const COLLEGES: College[] = [
  {
    id: "gcs-shimla",
    code: "GCS",
    name: { en: "Government College Sanjauli", hi: "राजकीय महाविद्यालय संजौली" },
    district: "Shimla",
    type: "government",
    aishe: "C-1102",
    contactPhone: "0177-2640146",
    contactEmail: "principal@gcsanjauli.ac.in",
    established: 1976
  },
  {
    id: "rkmv-shimla",
    code: "RKMV",
    name: { en: "Rajkiya Kanya Mahavidyalaya, Shimla", hi: "राजकीय कन्या महाविद्यालय, शिमला" },
    district: "Shimla",
    type: "government",
    aishe: "C-1108",
    contactPhone: "0177-2658007",
    contactEmail: "principal@rkmv.ac.in",
    established: 1958
  },
  {
    id: "gc-dharamshala",
    code: "GCD",
    name: { en: "Government College Dharamshala", hi: "राजकीय महाविद्यालय धर्मशाला" },
    district: "Kangra",
    type: "government",
    aishe: "C-2031",
    contactPhone: "01892-224085",
    contactEmail: "principal@gcdharamshala.ac.in",
    established: 1926
  },
  {
    id: "gc-mandi",
    code: "GCM",
    name: { en: "Vallabh Government College, Mandi", hi: "वल्लभ राजकीय महाविद्यालय, मंडी" },
    district: "Mandi",
    type: "government",
    aishe: "C-3014",
    contactPhone: "01905-222348",
    contactEmail: "principal@vgcmandi.ac.in",
    established: 1948
  },
  {
    id: "gc-solan",
    code: "GCSL",
    name: { en: "Government College Solan", hi: "राजकीय महाविद्यालय सोलन" },
    district: "Solan",
    type: "government",
    aishe: "C-4002",
    contactPhone: "01792-223368",
    contactEmail: "principal@gcsolan.ac.in",
    established: 1969
  },
  {
    id: "gc-kullu",
    code: "GCK",
    name: { en: "Government College Kullu", hi: "राजकीय महाविद्यालय कुल्लू" },
    district: "Kullu",
    type: "government",
    aishe: "C-5005",
    contactPhone: "01902-222234",
    contactEmail: "principal@gckullu.ac.in",
    established: 1971
  },
  {
    id: "gc-chamba",
    code: "GCC",
    name: { en: "Government College Chamba", hi: "राजकीय महाविद्यालय चंबा" },
    district: "Chamba",
    type: "government",
    aishe: "C-6011",
    contactPhone: "01899-222263",
    contactEmail: "principal@gcchamba.ac.in",
    established: 1956
  },
  {
    id: "gc-una",
    code: "GCU",
    name: { en: "Government College Una", hi: "राजकीय महाविद्यालय ऊना" },
    district: "Una",
    type: "government",
    aishe: "C-7008",
    contactPhone: "01975-226102",
    contactEmail: "principal@gcuna.ac.in",
    established: 1977
  },
  {
    id: "gc-hamirpur",
    code: "GCH",
    name: { en: "Government College Hamirpur", hi: "राजकीय महाविद्यालय हमीरपुर" },
    district: "Hamirpur",
    type: "government",
    aishe: "C-8003",
    contactPhone: "01972-222290",
    contactEmail: "principal@gchamirpur.ac.in",
    established: 1965
  },
  {
    id: "gc-bilaspur",
    code: "GCB",
    name: { en: "Government College Bilaspur", hi: "राजकीय महाविद्यालय बिलासपुर" },
    district: "Bilaspur",
    type: "government",
    aishe: "C-9006",
    contactPhone: "01978-222135",
    contactEmail: "principal@gcbilaspur.ac.in",
    established: 1963
  },
  {
    id: "gc-nahan",
    code: "GCN",
    name: { en: "Government College Nahan", hi: "राजकीय महाविद्यालय नाहन" },
    district: "Sirmaur",
    type: "government",
    aishe: "C-1015",
    contactPhone: "01702-223054",
    contactEmail: "principal@gcnahan.ac.in",
    established: 1959
  },
  {
    id: "gc-reckong-peo",
    code: "GCRP",
    name: { en: "Government College Reckong Peo", hi: "राजकीय महाविद्यालय रिकांगपिओ" },
    district: "Kinnaur",
    type: "government",
    aishe: "C-1124",
    contactPhone: "01786-222229",
    contactEmail: "principal@gcrp.ac.in",
    established: 1996
  }
];

// Combinations
export const COMBINATIONS: Combination[] = [
  // BA combinations
  {
    id: "ba-eco-pol-eng",
    label: { en: "Economics + Political Science + English", hi: "अर्थशास्त्र + राजनीति विज्ञान + अंग्रेज़ी" },
    subjects: ["Economics", "Political Science", "English"],
    stream: "arts"
  },
  {
    id: "ba-his-pol-hin",
    label: { en: "History + Political Science + Hindi", hi: "इतिहास + राजनीति विज्ञान + हिन्दी" },
    subjects: ["History", "Political Science", "Hindi"],
    stream: "arts"
  },
  {
    id: "ba-soc-eng-his",
    label: { en: "Sociology + English + History", hi: "समाजशास्त्र + अंग्रेज़ी + इतिहास" },
    subjects: ["Sociology", "English", "History"],
    stream: "arts"
  },
  {
    id: "ba-eco-math-eng",
    label: { en: "Economics + Mathematics + English", hi: "अर्थशास्त्र + गणित + अंग्रेज़ी" },
    subjects: ["Economics", "Mathematics", "English"],
    stream: "arts"
  },
  {
    id: "ba-pub-pol-his",
    label: { en: "Public Administration + Political Science + History", hi: "लोक प्रशासन + राजनीति विज्ञान + इतिहास" },
    subjects: ["Public Administration", "Political Science", "History"],
    stream: "arts"
  },
  {
    id: "ba-psy-eng-soc",
    label: { en: "Psychology + English + Sociology", hi: "मनोविज्ञान + अंग्रेज़ी + समाजशास्त्र" },
    subjects: ["Psychology", "English", "Sociology"],
    stream: "arts"
  },
  {
    id: "ba-geo-his-eng",
    label: { en: "Geography + History + English", hi: "भूगोल + इतिहास + अंग्रेज़ी" },
    subjects: ["Geography", "History", "English"],
    stream: "arts"
  },
  {
    id: "ba-mus-hin-his",
    label: { en: "Music + Hindi + History", hi: "संगीत + हिन्दी + इतिहास" },
    subjects: ["Music", "Hindi", "History"],
    stream: "arts"
  },
  // BSc PCM
  {
    id: "bsc-pcm",
    label: { en: "Physics + Chemistry + Mathematics", hi: "भौतिकी + रसायन + गणित" },
    subjects: ["Physics", "Chemistry", "Mathematics"],
    stream: "science-pcm"
  },
  {
    id: "bsc-cs-math",
    label: { en: "Computer Science + Mathematics + Physics", hi: "कंप्यूटर विज्ञान + गणित + भौतिकी" },
    subjects: ["Computer Science", "Mathematics", "Physics"],
    stream: "science-pcm"
  },
  // BSc PCB
  {
    id: "bsc-pcb",
    label: { en: "Physics + Chemistry + Biology", hi: "भौतिकी + रसायन + जीव विज्ञान" },
    subjects: ["Physics", "Chemistry", "Biology"],
    stream: "science-pcb"
  },
  {
    id: "bsc-bio-chem-bot",
    label: { en: "Botany + Zoology + Chemistry", hi: "वनस्पति विज्ञान + प्राणि विज्ञान + रसायन" },
    subjects: ["Botany", "Zoology", "Chemistry"],
    stream: "science-pcb"
  },
  // Commerce (BCom uses single combination)
  {
    id: "bcom-acc-eco-bus",
    label: { en: "Accountancy + Economics + Business Studies", hi: "लेखाशास्त्र + अर्थशास्त्र + व्यवसाय अध्ययन" },
    subjects: ["Accountancy", "Economics", "Business Studies"],
    stream: "commerce"
  }
];

const baAllSubjects = [
  "ba-eco-pol-eng",
  "ba-his-pol-hin",
  "ba-soc-eng-his",
  "ba-eco-math-eng",
  "ba-pub-pol-his",
  "ba-psy-eng-soc",
  "ba-geo-his-eng",
  "ba-mus-hin-his"
];

const bscPcm = ["bsc-pcm", "bsc-cs-math"];
const bscPcb = ["bsc-pcb", "bsc-bio-chem-bot"];
const bscAll = [...bscPcm, ...bscPcb];

const baCommon = (collegeId: string, codePrefix: string, seats: number, fee: number, minMarks: number): CourseOffering => ({
  id: `${collegeId}-ba`,
  collegeId,
  courseType: "BA",
  courseCode: `${codePrefix}-BA`,
  name: { en: "Bachelor of Arts (Honours)", hi: "कला स्नातक (ऑनर्स)" },
  stream: "arts",
  durationYears: 3,
  totalSeats: seats,
  feeAmount: fee,
  minMarks,
  combinations: baAllSubjects,
  maxPreferences: 6,
  description: {
    en: "A flexible undergraduate programme covering humanities, social sciences and language electives.",
    hi: "मानविकी, सामाजिक विज्ञान और भाषा वैकल्पिक विषयों को कवर करने वाला एक लचीला स्नातक कार्यक्रम।"
  }
});

const bscCommon = (collegeId: string, codePrefix: string, seats: number, fee: number, minMarks: number, kind: "pcm" | "pcb" | "both"): CourseOffering => ({
  id: `${collegeId}-bsc`,
  collegeId,
  courseType: "BSc",
  courseCode: `${codePrefix}-BSc`,
  name: { en: "Bachelor of Science", hi: "विज्ञान स्नातक" },
  stream: kind === "pcm" ? "science-pcm" : kind === "pcb" ? "science-pcb" : "any",
  durationYears: 3,
  totalSeats: seats,
  feeAmount: fee,
  minMarks,
  combinations: kind === "pcm" ? bscPcm : kind === "pcb" ? bscPcb : bscAll,
  maxPreferences: 3,
  description: {
    en: "Three-year science programme with mathematics or biology specialisations and laboratory work.",
    hi: "गणित या जीव विज्ञान विशेषज्ञता एवं प्रयोगशाला कार्य के साथ तीन वर्षीय विज्ञान कार्यक्रम।"
  }
});

const bcomCommon = (collegeId: string, codePrefix: string, seats: number, fee: number, minMarks: number): CourseOffering => ({
  id: `${collegeId}-bcom`,
  collegeId,
  courseType: "BCom",
  courseCode: `${codePrefix}-BCom`,
  name: { en: "Bachelor of Commerce", hi: "वाणिज्य स्नातक" },
  stream: "commerce",
  durationYears: 3,
  totalSeats: seats,
  feeAmount: fee,
  minMarks,
  combinations: ["bcom-acc-eco-bus"],
  maxPreferences: 1,
  description: {
    en: "Three-year commerce programme with focus on accountancy, business and economics.",
    hi: "लेखाशास्त्र, व्यवसाय और अर्थशास्त्र पर केंद्रित तीन वर्षीय वाणिज्य कार्यक्रम।"
  }
});

export const OFFERINGS: CourseOffering[] = [
  // GCS Sanjauli
  baCommon("gcs-shimla", "GCS", 480, 1850, 45),
  bscCommon("gcs-shimla", "GCS", 240, 2400, 50, "both"),
  bcomCommon("gcs-shimla", "GCS", 180, 2200, 50),
  // RKMV
  baCommon("rkmv-shimla", "RKMV", 360, 1800, 45),
  bscCommon("rkmv-shimla", "RKMV", 180, 2300, 50, "pcb"),
  bcomCommon("rkmv-shimla", "RKMV", 120, 2100, 50),
  // Dharamshala
  baCommon("gc-dharamshala", "GCD", 540, 1750, 40),
  bscCommon("gc-dharamshala", "GCD", 240, 2350, 48, "both"),
  bcomCommon("gc-dharamshala", "GCD", 180, 2150, 48),
  // Mandi
  baCommon("gc-mandi", "GCM", 420, 1700, 40),
  bscCommon("gc-mandi", "GCM", 180, 2300, 48, "pcm"),
  bcomCommon("gc-mandi", "GCM", 150, 2100, 48),
  // Solan
  baCommon("gc-solan", "GCSL", 360, 1700, 40),
  bscCommon("gc-solan", "GCSL", 150, 2250, 45, "both"),
  // Kullu
  baCommon("gc-kullu", "GCK", 300, 1650, 40),
  bscCommon("gc-kullu", "GCK", 120, 2200, 45, "pcm"),
  // Chamba
  baCommon("gc-chamba", "GCC", 240, 1650, 40),
  bscCommon("gc-chamba", "GCC", 120, 2200, 45, "pcb"),
  // Una
  baCommon("gc-una", "GCU", 300, 1650, 40),
  bcomCommon("gc-una", "GCU", 120, 2050, 48),
  // Hamirpur
  baCommon("gc-hamirpur", "GCH", 300, 1650, 40),
  bscCommon("gc-hamirpur", "GCH", 120, 2200, 45, "pcm"),
  // Bilaspur
  baCommon("gc-bilaspur", "GCB", 240, 1600, 40),
  // Nahan
  baCommon("gc-nahan", "GCN", 240, 1600, 40),
  bscCommon("gc-nahan", "GCN", 120, 2150, 45, "both"),
  // Reckong Peo
  baCommon("gc-reckong-peo", "GCRP", 180, 1500, 35)
];

export const HP_DISTANCE_MOCK: Record<District, number> = {
  Shimla: 6,
  Kangra: 220,
  Mandi: 150,
  Solan: 50,
  Kullu: 180,
  Chamba: 290,
  Una: 175,
  Hamirpur: 130,
  Bilaspur: 100,
  Sirmaur: 90,
  Kinnaur: 240,
  "Lahaul & Spiti": 320
};

export const RECENT_UPDATES = [
  {
    id: "u1",
    titleKey: "updates.cycleClose.title",
    bodyKey: "updates.cycleClose.body",
    when: "2 days ago",
    tone: "info" as const
  },
  {
    id: "u2",
    titleKey: "updates.phaseOpen.title",
    bodyKey: "updates.phaseOpen.body",
    when: "5 days ago",
    tone: "success" as const
  },
  {
    id: "u3",
    titleKey: "updates.digilocker.title",
    bodyKey: "updates.digilocker.body",
    when: "1 week ago",
    tone: "info" as const
  },
  {
    id: "u4",
    titleKey: "updates.helpdesk.title",
    bodyKey: "updates.helpdesk.body",
    when: "2 weeks ago",
    tone: "info" as const
  },
  {
    id: "u5",
    titleKey: "updates.language.title",
    bodyKey: "updates.language.body",
    when: "3 weeks ago",
    tone: "info" as const
  }
];
