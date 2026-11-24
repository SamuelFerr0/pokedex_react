import { useCallback, useEffect, useState } from "react";

export default function useFiltrosDaUrl(nomes) {
  const lerDaUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(nomes.map((nome) => [nome, params.get(nome) ?? ""]));
  }, [nomes]);

  const [filtros, setFiltros] = useState(lerDaUrl);

  useEffect(() => {
    const aoNavegar = () => setFiltros(lerDaUrl());
    window.addEventListener("popstate", aoNavegar);
    return () => window.removeEventListener("popstate", aoNavegar);
  }, [lerDaUrl]);

  const alterarFiltro = useCallback(
    (nome, valor) => {
      const params = new URLSearchParams(window.location.search);
      if (String(valor).trim() === "") params.delete(nome);
      else params.set(nome, valor);
      const busca = params.toString();
      window.history.replaceState(null, "", busca ? `?${busca}` : window.location.pathname);
      setFiltros(lerDaUrl());
    },
    [lerDaUrl]
  );

  const limparFiltros = useCallback(() => {
    window.history.pushState(null, "", window.location.pathname);
    setFiltros(lerDaUrl());
  }, [lerDaUrl]);

  return { filtros, alterarFiltro, limparFiltros };
}
