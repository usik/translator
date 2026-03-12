import { create } from "zustand";

interface TranslatorState {
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  translatedText: string;
  isTranslating: boolean;
  activeTab: "text" | "files";

  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  setSourceText: (text: string) => void;
  setTranslatedText: (text: string) => void;
  setIsTranslating: (isTranslating: boolean) => void;
  swapLanguages: () => void;
  setActiveTab: (tab: "text" | "files") => void;
}

export const useTranslatorStore = create<TranslatorState>((set) => ({
  sourceLang: "auto",
  targetLang: "ko",
  sourceText: "",
  translatedText: "",
  isTranslating: false,
  activeTab: "text",

  setSourceLang: (lang) => set({ sourceLang: lang }),
  setTargetLang: (lang) => set({ targetLang: lang }),
  setSourceText: (text) => set({ sourceText: text }),
  setTranslatedText: (text) => set({ translatedText: text }),
  setIsTranslating: (isTranslating) => set({ isTranslating }),
  swapLanguages: () =>
    set((state) => {
      if (state.sourceLang === "auto") return state;
      return {
        sourceLang: state.targetLang,
        targetLang: state.sourceLang,
        sourceText: state.translatedText,
        translatedText: state.sourceText,
      };
    }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
