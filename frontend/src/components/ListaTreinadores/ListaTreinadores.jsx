import { User } from "lucide-react";
import { urlImagem } from "../../services/pokedexService";
import "./ListaTreinadores.css";

const MAX_INSIGNIAS = 8;

function ListaTreinadores({ treinadores, onSelecionar }) {
  return (
    <div className="trainers">
      {treinadores.map((t) => (
        <section className="trainer" key={t.id}>
          <h3><User className="icone" size={18} /> {t.nome}</h3>
          <div className="trainer__badges">
            {Array.from({ length: MAX_INSIGNIAS }, (_, i) => (
              <span key={i} className={`dot ${i < t.insignias ? "" : "off"}`} />
            ))}{" "}
            {t.insignias} insígnia(s)
          </div>
          <div className="team">
            {t.pokemons.map((p) => (
              <button key={p.id} onClick={() => onSelecionar(p)}>
                <img src={urlImagem(p.id)} alt="" loading="lazy" /> {p.name}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default ListaTreinadores;
