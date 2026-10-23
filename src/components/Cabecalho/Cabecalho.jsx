function Cabecalho({ tela, onTrocarTela, escuro, onAlternarTema }) {
  return (
    <header className="header">
      <div className="header__row">
        <h1> Pokédex</h1>
        <nav className="nav">
          <button className={tela === "pokedex" ? "active" : ""} onClick={() => onTrocarTela("pokedex")}>
             Pokédex
          </button>
          <button className={tela === "treinadores" ? "active" : ""} onClick={() => onTrocarTela("treinadores")}>
             Treinadores
          </button>
          <button onClick={onAlternarTema}>{escuro ? " Claro" : " Escuro"}</button>
        </nav>
      </div>
    </header>
  );
}

export default Cabecalho;
