package com.pokedex.repository;

import com.pokedex.model.Treinador;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TreinadorRepository extends MongoRepository<Treinador, Integer> {}
