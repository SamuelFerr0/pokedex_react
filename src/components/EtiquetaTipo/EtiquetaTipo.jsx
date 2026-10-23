function EtiquetaTipo({ nome }) {
  return (
    <span className={`badge type-${nome.toLowerCase()}`}>
      {nome}
    </span>
  );
}

export default EtiquetaTipo;
