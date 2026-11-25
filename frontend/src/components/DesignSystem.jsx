import { PALETA, POKEMON_EXEMPLO } from "../config/designSystem";
import { CORES_TIPOS } from "../config/tiposConfig";
import EtiquetaTipo from "./EtiquetaTipo/EtiquetaTipo";
import BarraAtributo from "./BarraAtributo/BarraAtributo";
import CardPokemon from "./CardPokemon/CardPokemon";
export default function DesignSystem() {
  return (
    <section className="design-page">
      <h2>Design da Pokédex</h2>
      <p>
        Referência visual dos componentes usados na aplicação. Alterne o tema no
        cabeçalho para comparar.
      </p>
      <section>
        <h3>Cores da interface</h3>
        <ul className="design-paleta">
          {PALETA.map(({ variavel, uso }) => (
            <li key={variavel}>
              <span
                style={{ background: `var(${variavel})` }}
                aria-hidden="true"
              />
              <div>
                <code>{variavel}</code>
                <p>{uso}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Tipografia</h3>
        <h1>Título da Pokédex</h1>
        <h2>Título de seção</h2>
        <p>Texto de leitura: Segoe UI e fontes do sistema.</p>
        <small>Texto auxiliar e numeração dos Pokémon.</small>
      </section>
      <section>
        <h3>Botões e campos</h3>
        <div className="form-actions">
          <button className="btn primary">Ação principal</button>
          <button className="btn">Ação secundária</button>
          <button className="btn danger">Excluir</button>
          <button className="btn" disabled>
            Indisponível
          </button>
        </div>
        <label>
          Exemplo de campo
          <input placeholder="Nome do Pokémon" />
        </label>
      </section>
      <section>
        <h3>Tipos</h3>
        <div className="type-options">
          {Object.keys(CORES_TIPOS).map((name) => (
            <EtiquetaTipo key={name} nome={name} />
          ))}
        </div>
      </section>
      <section>
        <h3>Estados e atributos</h3>
        <p className="aviso">Operação concluída.</p>
        <p className="aviso aviso--erro">Confira os campos informados.</p>
        <BarraAtributo rotulo="Ataque" valor={80} />
      </section>
      <section>
        <h3>Card de Pokémon</h3>
        <div style={{ maxWidth: 280 }}>
          <CardPokemon
            pokemon={POKEMON_EXEMPLO}
            favorito={false}
            onFavoritar={() => {}}
            onSelecionar={() => {}}
          />
        </div>
      </section>
    </section>
  );
}
