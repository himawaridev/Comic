"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type AppTheme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<AppTheme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("app-theme") as AppTheme | null;
    const next = saved === "light" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("app-theme", next);
    document.documentElement.dataset.theme = next;
  }

  return (
    <button className="icon-button" type="button" onClick={toggle} aria-label={theme === "dark" ? "Bat giao dien sang" : "Bat giao dien toi"}>
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
