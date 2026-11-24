package com.pokedex.service;

import com.pokedex.dto.PokemonRequest;
import com.pokedex.exception.RegraException;
import com.pokedex.model.Pokemon;
import com.pokedex.model.Tipo;
import com.pokedex.repository.PokemonRepository;
import com.pokedex.repository.TipoRepository;
import java.util.HashSet;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class PokemonService {
  private final PokemonRepository pokemons;
  private final TipoRepository tipos;

  public PokemonService(PokemonRepository pokemons, TipoRepository tipos) {
    this.pokemons = pokemons;
    this.tipos = tipos;
  }

  public List<Pokemon> listar(String nome, Integer tipo) {
    boolean temNome = nome != null && !nome.isBlank();

    if (temNome && tipo != null) {
      return pokemons.findByNameContainingIgnoreCaseAndTypes_IdOrderByIdAsc(nome.trim(), tipo);
    }
    if (temNome) {
      return pokemons.findByNameContainingIgnoreCaseOrderByIdAsc(nome.trim());
    }
    if (tipo != null) {
      return pokemons.findByTypes_IdOrderByIdAsc(tipo);
    }
    return pokemons.findAll(Sort.by("id"));
  }

  public Pokemon buscar(Integer id) {
    return pokemons
        .findById(id)
        .orElseThrow(() -> new RegraException(HttpStatus.NOT_FOUND, "Pokémon não encontrado."));
  }

  public Pokemon criar(PokemonRequest dados) {
    if (pokemons.existsById(dados.id()))
      throw new RegraException(HttpStatus.CONFLICT, "Já existe um Pokémon com esse ID.");
    return pokemons.insert(montar(dados));
  }

  public Pokemon atualizar(Integer id, PokemonRequest dados) {
    buscar(id);
    if (!id.equals(dados.id()))
      throw new RegraException(HttpStatus.UNPROCESSABLE_CONTENT, "O ID não pode ser alterado.");
    return pokemons.save(montar(dados));
  }

  public void excluir(Integer id) {
    Pokemon pokemon = buscar(id);
    pokemons.delete(pokemon);
  }

  private Pokemon montar(PokemonRequest dados) {
    if (new HashSet<>(dados.typeIds()).size() != dados.typeIds().size())
      throw new RegraException(HttpStatus.UNPROCESSABLE_CONTENT, "Não repita o tipo.");
    if (dados.typeIds().contains(0) && dados.typeIds().size() > 1)
      throw new RegraException(
          HttpStatus.UNPROCESSABLE_CONTENT, "Typeless deve ser usado sozinho.");
    List<Tipo> selecionados =
        dados.typeIds().stream()
            .map(
                id ->
                    tipos
                        .findById(id)
                        .orElseThrow(
                            () ->
                                new RegraException(
                                    HttpStatus.UNPROCESSABLE_CONTENT, "Tipo não encontrado.")))
            .toList();
    return new Pokemon(dados.id(), dados.name().trim(), dados.stats(), selecionados);
  }
}
