import { Dices, Star, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import BarraBusca from "./components/BarraBusca/BarraBusca";
import Cabecalho from "./components/Cabecalho/Cabecalho";
import DetalhesPokemon from "./components/DetalhesPokemon/DetalhesPokemon";
import FiltroTipos from "./components/FiltroTipos/FiltroTipos";
import ListaPokemon from "./components/ListaPokemon/ListaPokemon";
import ListaTreinadores from "./components/ListaTreinadores/ListaTreinadores";
import { ORDENACOES } from "./config/tiposConfig";
import useFavoritos from "./hooks/useFavoritos";
import useFiltrosDaUrl from "./hooks/useFiltrosDaUrl";
import useTema from "./hooks/useTema";
import {
  filtrarPokemons,
  listarPokemons,
  listarTipos,
  listarTreinadores,
} from "./services/pokedexService";
import "./App.css";

const NOMES_FILTROS = ["busca", "tipo", "ordem"];
const tipos = listarTipos();
const treinadores = listarTreinadores();

function App() {
  const [tela, setTela] = useState("pokedex");
  const [selecionado, setSelecionado] = useState(null);
  const [apenasFavoritos, setApenasFavoritos] = useState(false);

  const { filtros, alterarFiltro, limparFiltros } =
    useFiltrosDaUrl(NOMES_FILTROS);
  const { favoritos, alternarFavorito, habilitado, erro } = useFavoritos();
  const { escuro, alternarTema } = useTema();

  const pokemons = useMemo(
    () =>
      filtrarPokemons({
        busca: filtros.busca,
        tipoId: filtros.tipo,
        ordem: filtros.ordem,
        favoritos,
        apenasFavoritos,
      }),
    [filtros, favoritos, apenasFavoritos],
  );

  const sortear = () => {
    const todos = listarPokemons();
    setSelecionado(todos[Math.floor(Math.random() * todos.length)]);
  };

  const navegar = useCallback(
    (direcao) =>
      setSelecionado((atual) => {
        if (!atual) return atual;
        const lista = pokemons.length ? pokemons : listarPokemons();
        const i = lista.findIndex((p) => p.id === atual.id);
        if (i === -1) return lista[0];
        return lista[(i + direcao + lista.length) % lista.length];
      }),
    [pokemons],
  );

  const filtrosAtivos =
    filtros.busca || filtros.tipo || filtros.ordem || apenasFavoritos;

  return (
    <>
      <Cabecalho
        tela={tela}
        onTrocarTela={setTela}
        escuro={escuro}
        onAlternarTema={alternarTema}
      />

      <main className="container">
        {!habilitado && (
          <p className="aviso">
            Favoritos desativados: preencha o .env.local com os dados do Supabase.
          </p>
        )}
        {erro && <p className="aviso aviso--erro">{erro}</p>}
        {tela === "pokedex" ? (
          <>
            <div className="toolbar">
              <BarraBusca
                valor={filtros.busca}
                onChange={(v) => alterarFiltro("busca", v)}
              />
              <select
                value={filtros.ordem || "id"}
                onChange={(e) => alterarFiltro("ordem", e.target.value)}
              >
                {Object.entries(ORDENACOES).map(([chave, rotulo]) => (
                  <option key={chave} value={chave}>
                    Ordenar: {rotulo}
                  </option>
                ))}
              </select>
              <button
                className={`btn ${apenasFavoritos ? "on" : ""}`}
                onClick={() => setApenasFavoritos((v) => !v)}
              >
                <Star className="icone" size={16} fill={apenasFavoritos ? "currentColor" : "none"} /> Favoritos ({favoritos.length})
              </button>
              <button className="btn" onClick={sortear}>
                <Dices className="icone" size={16} /> Aleatório
              </button>
              {filtrosAtivos && (
                <button
                  className="btn"
                  onClick={() => {
                    limparFiltros();
                    setApenasFavoritos(false);
                  }}
                >
                  <X className="icone" size={16} /> Limpar
                </button>
              )}
            </div>

            <FiltroTipos
              tipos={tipos}
              selecionado={filtros.tipo}
              onSelecionar={(id) => alterarFiltro("tipo", id)}
            />

            <p className="count">
              <strong>{pokemons.length}</strong> Pokémon encontrado(s)
            </p>
            <ListaPokemon
              pokemons={pokemons}
              favoritos={favoritos}
              onFavoritar={alternarFavorito}
              onSelecionar={setSelecionado}
            />
          </>
        ) : (
          <ListaTreinadores
            treinadores={treinadores}
            onSelecionar={setSelecionado}
          />
        )}
      </main>

      {selecionado && (
        <DetalhesPokemon
          pokemon={selecionado}
          onFechar={() => setSelecionado(null)}
          onNavegar={navegar}
        />
      )}
    </>
  );
}

export default App;
