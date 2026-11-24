function FiltroTipos({ tipos, selecionado, onSelecionar }) {
  return (
    <div className="filters">
      <button className={`chip all ${selecionado === "" ? "active" : ""}`} onClick={() => onSelecionar("")}>
        Todos
      </button>
      {tipos.map((tipo) => {
        const ativo = selecionado === String(tipo.id);
        return (
          <button
            key={tipo.id}
            className={`chip type-${tipo.name.toLowerCase()} ${ativo ? "active" : ""}`}
            onClick={() => onSelecionar(ativo ? "" : String(tipo.id))}
          >
            {tipo.name}
          </button>
        );
      })}
    </div>
  );
}

export default FiltroTipos;
