function BarraBusca({ valor, onChange }) {
  return (
    <div className="search">
      <input
        type="search"
        placeholder="Pesquisar Pokémon por nome ou ID..."
        value={valor}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default BarraBusca;
