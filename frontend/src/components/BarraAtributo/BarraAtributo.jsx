function BarraAtributo({ rotulo, valor }) {
  const classeCor = valor >= 100 ? "high" : valor >= 60 ? "medium" : "low";

  return (
    <div className="stat">
      <span className="stat__label">{rotulo}</span>
      <b>{valor}</b>
      <div className="stat__bar">
        <progress className={`stat__fill stat__fill--${classeCor}`} max="150" value={valor} />
      </div>
    </div>
  );
}

export default BarraAtributo;
