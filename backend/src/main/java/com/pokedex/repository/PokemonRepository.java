package com.pokedex.repository;

import com.pokedex.model.Pokemon;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PokemonRepository extends MongoRepository<Pokemon, Integer> {
  List<Pokemon> findByNameContainingIgnoreCaseOrderByIdAsc(String nome);

  List<Pokemon> findByTypes_IdOrderByIdAsc(Integer tipo);

  List<Pokemon> findByNameContainingIgnoreCaseAndTypes_IdOrderByIdAsc(String nome, Integer tipo);
}
