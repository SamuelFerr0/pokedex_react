import { Dices, Star, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import "./components/Gerenciamento.css";
import PokemonForm from "./components/PokemonForm";
import DesignSystem from "./components/DesignSystem";
import { buscarPokemon, excluirPokemon } from "./services/pokedexService";

const NOMES_FILTROS = ["busca", "tipo", "ordem"];

function App() {
  const [todos, setTodos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [dadosTreinadores, setDadosTreinadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const [formulario, setFormulario] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [removendo, setRemovendo] = useState(false);
  const carregar = useCallback(async () => {
    setCarregando(true);
    setErroApi("");
    try {
      const [ps, ts, trs] = await Promise.all([
        listarPokemons(),
        listarTipos(),
        listarTreinadores(),
      ]);
      setTodos(ps);
      setTipos(ts);
      setDadosTreinadores(trs);
    } catch (e) {
      setErroApi(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);
  useEffect(() => {
    let ativo = true;
    Promise.all([listarPokemons(), listarTipos(), listarTreinadores()])
      .then(([ps, ts, trs]) => {
        if (ativo) {
          setTodos(ps);
          setTipos(ts);
          setDadosTreinadores(trs);
        }
      })
      .catch((e) => {
        if (ativo) setErroApi(e.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);
  const treinadores = dadosTreinadores.map((t) => ({
    id: t.id,
    nome: t.name,
    insignias: t.badges,
    pokemons: t.pokemonIds
      .map((id) => todos.find((p) => p.id === id))
      .filter(Boolean),
  }));
  async function selecionar(pokemon) {
    try {
      setSelecionado(await buscarPokemon(pokemon.id));
      setErroApi("");
    } catch (e) {
      setErroApi(e.message);
    }
  }
  async function remover() {
    if (
      !window.confirm(
        `Excluir ${selecionado.name}? Essa ação não pode ser desfeita.`,
      )
    )
      return;
    setRemovendo(true);
    try {
      await excluirPokemon(selecionado.id);
      setSelecionado(null);
      setMensagem("Pokémon excluído.");
      await carregar();
    } catch (e) {
      setErroApi(e.message);
    } finally {
      setRemovendo(false);
    }
  }
  const [tela, setTela] = useState("pokedex");
  const [selecionado, setSelecionado] = useState(null);
  const [apenasFavoritos, setApenasFavoritos] = useState(false);

  const { filtros, alterarFiltro, limparFiltros } =
    useFiltrosDaUrl(NOMES_FILTROS);
  const { favoritos, alternarFavorito, habilitado, erro } = useFavoritos();
  const { escuro, alternarTema } = useTema();

  const pokemons = useMemo(
    () =>
      filtrarPokemons(todos, {
        busca: filtros.busca,
        tipoId: filtros.tipo,
        ordem: filtros.ordem,
        favoritos,
        apenasFavoritos,
      }),
    [todos, filtros, favoritos, apenasFavoritos],
  );

  const sortear = () => {
    if (todos.length)
      selecionar(todos[Math.floor(Math.random() * todos.length)]);
  };

  const navegar = useCallback(
    (direcao) =>
      setSelecionado((atual) => {
        if (!atual) return atual;
        const lista = pokemons.length ? pokemons : todos;
        const i = lista.findIndex((p) => p.id === atual.id);
        if (i === -1) return lista[0];
        return lista[(i + direcao + lista.length) % lista.length];
      }),
    [pokemons, todos],
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
            Favoritos desativados: preencha o .env.local com os dados do
            Supabase.
          </p>
        )}
        {erro && <p className="aviso aviso--erro">{erro}</p>}
        {erroApi && (
          <p className="aviso aviso--erro" role="alert">
            {erroApi}{" "}
            <button className="btn" onClick={carregar}>
              Tentar novamente
            </button>
          </p>
        )}
        {mensagem && (
          <p className="aviso" role="status">
            {mensagem}
          </p>
        )}
        {carregando && <p role="status">Carregando dados do MongoDB…</p>}
        {tela === "design" ? (
          <DesignSystem />
        ) : tela === "pokedex" ? (
          <>
            <div className="toolbar">
              <button
                className="btn"
                disabled={carregando || !!erroApi}
                onClick={() => setFormulario({})}
              >
                Cadastrar Pokémon
              </button>
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
                <Star
                  className="icone"
                  size={16}
                  fill={apenasFavoritos ? "currentColor" : "none"}
                />{" "}
                Favoritos ({favoritos.length})
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
              onSelecionar={selecionar}
            />
          </>
        ) : (
          <ListaTreinadores
            treinadores={treinadores}
            onSelecionar={selecionar}
          />
        )}
      </main>

      {formulario && (
        <PokemonForm
          pokemon={formulario.id ? formulario : null}
          tipos={tipos}
          onFechar={() => setFormulario(null)}
          onSalvo={async () => {
            setFormulario(null);
            setSelecionado(null);
            setMensagem("Pokémon salvo.");
            await carregar();
          }}
        />
      )}
      {selecionado && !formulario && (
        <DetalhesPokemon
          pokemon={selecionado}
          onFechar={() => setSelecionado(null)}
          onNavegar={navegar}
          onEditar={() => setFormulario(selecionado)}
          onExcluir={remover}
          removendo={removendo}
        />
      )}
    </>
  );
}

export default App;
