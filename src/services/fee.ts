import type { Bilingual } from "@/domain/types";

export function applicationFee(): number {
  return 250;
}

export function feeBreakup(total: number): { label: Bilingual; amount: number }[] {
  // Five representative heads
  const tuition = Math.round(total * 0.62);
  const exam = Math.round(total * 0.12);
  const dev = Math.round(total * 0.10);
  const lib = Math.round(total * 0.08);
  const misc = total - (tuition + exam + dev + lib);
  return [
    { label: { en: "Tuition fee", hi: "ट्यूशन शुल्क" }, amount: tuition },
    { label: { en: "Examination fee", hi: "परीक्षा शुल्क" }, amount: exam },
    { label: { en: "Development fund", hi: "विकास निधि" }, amount: dev },
    { label: { en: "Library and lab", hi: "पुस्तकालय एवं प्रयोगशाला" }, amount: lib },
    { label: { en: "Student welfare", hi: "छात्र कल्याण" }, amount: misc }
  ];
}

export function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}
