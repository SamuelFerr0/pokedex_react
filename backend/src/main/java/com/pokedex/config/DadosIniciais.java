package com.pokedex.config;

import com.pokedex.model.*;
import com.pokedex.repository.*;
import org.bson.Document;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

@Component
@ConditionalOnProperty(name = "app.seed", havingValue = "true")
public class DadosIniciais implements CommandLineRunner {
  private final MongoTemplate mongo;
  private final PokemonRepository pokemons;
  private final TipoRepository tipos;
  private final TreinadorRepository treinadores;

  public DadosIniciais(
      MongoTemplate mongo,
      PokemonRepository pokemons,
      TipoRepository tipos,
      TreinadorRepository treinadores) {
    this.mongo = mongo;
    this.pokemons = pokemons;
    this.tipos = tipos;
    this.treinadores = treinadores;
  }

  @Override
  public void run(String... args) throws Exception {
    if (mongo.collectionExists("importacoes")
        && mongo.getCollection("importacoes").find(new Document("_id", "script-pokedex-v1")).first()
            != null) return;
    JsonMapper mapper = new JsonMapper();
    try (var in = new ClassPathResource("data/pokedex-data.json").getInputStream()) {
      var dados = mapper.readTree(in);
      for (Tipo t : mapper.treeToValue(dados.get("types"), Tipo[].class))
        if (!tipos.existsById(t.getId())) tipos.insert(t);
      for (Pokemon p : mapper.treeToValue(dados.get("pokemon"), Pokemon[].class))
        if (!pokemons.existsById(p.getId())) pokemons.insert(p);
      for (Treinador t : mapper.treeToValue(dados.get("trainers"), Treinador[].class))
        if (!treinadores.existsById(t.getId())) treinadores.insert(t);
    }
    mongo.getCollection("importacoes").insertOne(new Document("_id", "script-pokedex-v1"));
  }
}
