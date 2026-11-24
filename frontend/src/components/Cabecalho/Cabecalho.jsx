import { Moon, PawPrint, Sun, User, Zap } from "lucide-react";

function Cabecalho({ tela, onTrocarTela, escuro, onAlternarTema }) {
  return (
    <header className="header">
      <div className="header__row">
        <h1><Zap className="icone" /> Pokédex</h1>
        <nav className="nav">
          <button className={tela === "pokedex" ? "active" : ""} onClick={() => onTrocarTela("pokedex")}>
            <PawPrint className="icone" size={16} /> Pokédex
          </button>
          <button className={tela === "treinadores" ? "active" : ""} onClick={() => onTrocarTela("treinadores")}>
            <User className="icone" size={16} /> Treinadores
          </button>
          <button onClick={onAlternarTema}>{escuro ? <><Sun className="icone" size={16} /> Claro</> : <><Moon className="icone" size={16} /> Escuro</>}</button>
        </nav>
      </div>
    </header>
  );
}

export default Cabecalho;
