"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SearchBox({ defaultValue = "" }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form className="search-box" onSubmit={submit}>
      <Search size={19} />
      <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Tim truyen, tac gia, the loai..." />
      <button className="btn btn-coral" type="submit">
        Tim
      </button>
    </form>
  );
}
