"use client";

import { AlignJustify, BookOpenText, Minus, Plus, Type, X } from "lucide-react";

export type ReaderSettings = {
  theme: "dark" | "light" | "sepia";
  font: "system" | "serif" | "sans";
  fontSize: number;
  lineHeight: number;
  width: "narrow" | "default" | "wide";
};

export const defaultReaderSettings: ReaderSettings = { theme: "dark", font: "serif", fontSize: 20, lineHeight: 1.8, width: "default" };

export default function ReaderSettingsPanel({ settings, onChange, onClose }: { settings: ReaderSettings; onChange: (settings: ReaderSettings) => void; onClose: () => void }) {
  function update<K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <aside className="reader-settings-panel" aria-label="Cai dat trinh doc">
      <header><div><span>Tuy chinh hien thi</span><h2>Cai dat doc</h2></div><button className="reader-icon-button" type="button" onClick={onClose} aria-label="Dong cai dat"><X size={19} /></button></header>

      <div className="reader-setting-group"><label>Giao dien</label><div className="reader-segments reader-theme-options">
        {(["dark", "light", "sepia"] as const).map((theme) => <button className={settings.theme === theme ? "is-active" : ""} type="button" onClick={() => update("theme", theme)} key={theme}><span className={`theme-dot theme-dot--${theme}`} />{theme === "dark" ? "Toi" : theme === "light" ? "Sang" : "Sepia"}</button>)}
      </div></div>

      <div className="reader-setting-group"><label><Type size={16} /> Kieu chu</label><div className="reader-segments">
        {(["system", "serif", "sans"] as const).map((font) => <button className={settings.font === font ? "is-active" : ""} type="button" onClick={() => update("font", font)} key={font}>{font === "system" ? "He thong" : font === "serif" ? "Co chan" : "Khong chan"}</button>)}
      </div></div>

      <div className="reader-setting-row"><label><Type size={16} /> Co chu <strong>{settings.fontSize}px</strong></label><div className="reader-stepper"><button type="button" onClick={() => update("fontSize", Math.max(16, settings.fontSize - 1))}><Minus size={17} /></button><input aria-label="Co chu" type="range" min="16" max="40" value={settings.fontSize} onChange={(event) => update("fontSize", Number(event.target.value))} /><button type="button" onClick={() => update("fontSize", Math.min(40, settings.fontSize + 1))}><Plus size={17} /></button></div></div>
      <div className="reader-setting-row"><label><AlignJustify size={16} /> Gian dong <strong>{settings.lineHeight.toFixed(1)}</strong></label><input aria-label="Gian dong" type="range" min="1.5" max="2.2" step="0.1" value={settings.lineHeight} onChange={(event) => update("lineHeight", Number(event.target.value))} /></div>

      <div className="reader-setting-group"><label><BookOpenText size={16} /> Chieu rong noi dung</label><div className="reader-segments">
        {(["narrow", "default", "wide"] as const).map((width) => <button className={settings.width === width ? "is-active" : ""} type="button" onClick={() => update("width", width)} key={width}>{width === "narrow" ? "Gon" : width === "default" ? "Vua" : "Rong"}</button>)}
      </div></div>
    </aside>
  );
}
