export default function GenrePill({ label, active = false }: { label: string; active?: boolean }) {
  return <span className={`pill ${active ? "is-active" : ""}`}>{label}</span>;
}
