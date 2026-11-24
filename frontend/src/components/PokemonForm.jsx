import { useEffect, useRef, useState } from "react";
import { ATRIBUTOS } from "../config/tiposConfig";
import { salvarPokemon } from "../services/pokedexService";

export default function PokemonForm({ pokemon, tipos, onFechar, onSalvo }) {
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const modal = useRef(null);
  useEffect(() => {
    const el = modal.current;
    el.showModal();
    return () => el.close();
  }, []);
  async function enviar(e) {
    e.preventDefault();
    setErro("");
    const form = new FormData(e.currentTarget);
    const typeIds = form.getAll("typeIds").map(Number);
    if (!typeIds.length || typeIds.length > 2) {
      setErro("Selecione um ou dois tipos.");
      return;
    }
    setSalvando(true);
    try {
      await salvarPokemon(
        {
          id: Number(form.get("id")),
          name: form.get("name").trim(),
          stats: Object.fromEntries(
            ATRIBUTOS.map(([key]) => [key, Number(form.get(key))]),
          ),
          typeIds,
        },
        !!pokemon,
      );
      await onSalvo();
    } catch (ex) {
      setErro(ex.message);
    } finally {
      setSalvando(false);
    }
  }
  return (
    <dialog
      ref={modal}
      className="pokemon-form"
      onCancel={(e) => {
        e.preventDefault();
        if (!salvando) onFechar();
      }}
      aria-labelledby="form-title"
    >
      <form onSubmit={enviar}>
        <h2 id="form-title">
          {pokemon ? "Editar Pokémon" : "Cadastrar Pokémon"}
        </h2>
        <p>
          O ID identifica o Pokémon. Os atributos devem estar entre 1 e 255.
        </p>
        {erro && (
          <p className="aviso aviso--erro" role="alert">
            {erro}
          </p>
        )}
        <fieldset disabled={salvando}>
          <div className="form-grid">
            <label>
              ID
              <input
                name="id"
                type="number"
                min="1"
                max="99999"
                required
                readOnly={!!pokemon}
                defaultValue={pokemon?.id}
              />
            </label>
            <label>
              Nome
              <input
                name="name"
                maxLength="80"
                required
                defaultValue={pokemon?.name}
              />
            </label>
            {ATRIBUTOS.map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  name={key}
                  type="number"
                  min="1"
                  max="255"
                  required
                  defaultValue={pokemon?.stats[key] ?? 50}
                />
              </label>
            ))}
          </div>
          <fieldset>
            <legend>Tipos (selecione até dois)</legend>
            <div className="type-options">
              {tipos.map((t) => (
                <label key={t.id}>
                  <input
                    type="checkbox"
                    name="typeIds"
                    value={t.id}
                    defaultChecked={pokemon?.types.some((pt) => pt.id === t.id)}
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </fieldset>
        </fieldset>
        <div className="form-actions">
          <button
            type="button"
            className="btn"
            disabled={salvando}
            onClick={onFechar}
          >
            Cancelar
          </button>
          <button className="btn primary" disabled={salvando}>
            {salvando ? "Salvando…" : "Salvar Pokémon"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
