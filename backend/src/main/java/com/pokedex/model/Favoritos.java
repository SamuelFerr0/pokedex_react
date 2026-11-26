package com.pokedex.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("favoritos")
public record Favoritos(@Id String token, List<Integer> pokemonIds) {}
