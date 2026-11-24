package com.pokedex.repository;

import com.pokedex.model.Tipo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TipoRepository extends MongoRepository<Tipo, Integer> {}
