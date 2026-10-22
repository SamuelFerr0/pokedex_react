import { useEffect, useState } from "react";

export default function useTema() {
  const [escuro, setEscuro] = useState(() => localStorage.getItem("pokedex:tema") === "escuro");

  useEffect(() => {
    document.documentElement.dataset.theme = escuro ? "dark" : "light";
    localStorage.setItem("pokedex:tema", escuro ? "escuro" : "claro");
  }, [escuro]);

  return { escuro, alternarTema: () => setEscuro((e) => !e) };
}
