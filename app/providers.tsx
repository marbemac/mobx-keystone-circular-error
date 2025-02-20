import { createContext, useContext, useEffect } from "react";
import { makeAutoObservable } from "mobx";
import { makeLoggable } from "mobx-log";

class TextStore {
  showText: boolean = false;

  constructor() {
    makeAutoObservable(this);
    makeLoggable(this);
  }

  setShowText = (value: boolean) => {
    this.showText = value;
    localStorage.setItem("show-text", value.toString());
  };

  loadFromStorage = () => {
    const storedValue = localStorage.getItem("show-text");
    if (storedValue !== null) {
      this.showText = storedValue === "true";
    }
  };
}

const textStore = new TextStore();

const TextContext = createContext<TextStore | undefined>(undefined);

export const useTextContext = () => {
  const context = useContext(TextContext);
  if (!context) {
    throw new Error("useTextContext must be used within a TextProvider");
  }
  return context;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  console.log("Providers.render");

  useEffect(() => {
    console.log("Providers.mount");
    textStore.loadFromStorage();
  }, []);

  return (
    <TextContext.Provider value={textStore}>{children}</TextContext.Provider>
  );
};
