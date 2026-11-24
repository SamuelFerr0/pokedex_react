package com.pokedex.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("pokemons")
public class Pokemon {
  @Id private Integer id;

  private String name;

  private Atributos stats;

  private List<Tipo> types;

  public Pokemon() {}

  public Pokemon(Integer id, String name, Atributos stats, List<Tipo> types) {
    this.id = id;
    this.name = name;
    this.stats = stats;
    this.types = types;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Atributos getStats() {
    return stats;
  }

  public void setStats(Atributos stats) {
    this.stats = stats;
  }

  public List<Tipo> getTypes() {
    return types;
  }

  public void setTypes(List<Tipo> types) {
    this.types = types;
  }
}
