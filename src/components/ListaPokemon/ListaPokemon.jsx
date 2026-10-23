import CardPokemon from "../CardPokemon/CardPokemon";

function ListaPokemon({ pokemons, favoritos, onFavoritar, onSelecionar }) {
  if (pokemons.length === 0) {
    return (
      <div className="empty">
        <span></span>
        Nenhum Pokémon encontrado. Tente outra pesquisa ou filtro.
      </div>
    );
  }

  return (
    <div className="grid">
      {pokemons.map((p) => (
        <CardPokemon
          key={p.id}
          pokemon={p}
          favorito={favoritos.includes(p.id)}
          onFavoritar={onFavoritar}
          onSelecionar={onSelecionar}
        />
      ))}
    </div>
  );
}

export default ListaPokemon;
