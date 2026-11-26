package com.pokedex.service;

import com.pokedex.exception.RegraException;
import com.pokedex.model.Favoritos;
import java.util.List;
import java.util.UUID;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class FavoritosService {
  private final MongoTemplate mongo;
  private final PokemonService pokemons;

  public FavoritosService(MongoTemplate mongo, PokemonService pokemons) {
    this.mongo = mongo;
    this.pokemons = pokemons;
  }

  public List<Integer> listar(UUID token) {
    Favoritos favoritos = mongo.findById(token.toString(), Favoritos.class);
    return favoritos == null ? List.of() : favoritos.pokemonIds();
  }

  public void adicionar(UUID token, int pokemonId) {
    validarId(pokemonId);
    pokemons.buscar(pokemonId);
    mongo.upsert(filtro(token), new Update().addToSet("pokemonIds", pokemonId), Favoritos.class);
  }

  public void remover(UUID token, int pokemonId) {
    validarId(pokemonId);
    mongo.updateFirst(filtro(token), new Update().pull("pokemonIds", pokemonId), Favoritos.class);
  }

  private Query filtro(UUID token) {
    return Query.query(Criteria.where("token").is(token.toString()));
  }

  private void validarId(int pokemonId) {
    if (pokemonId < 1 || pokemonId > 99999) {
      throw new RegraException(HttpStatus.BAD_REQUEST, "ID do Pokémon inválido.");
    }
  }
}
