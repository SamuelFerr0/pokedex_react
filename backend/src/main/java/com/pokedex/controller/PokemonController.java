package com.pokedex.controller;

import com.pokedex.dto.PokemonRequest;
import com.pokedex.model.Pokemon;
import com.pokedex.service.PokemonService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pokemons")
public class PokemonController {
  private final PokemonService service;

  public PokemonController(PokemonService service) {
    this.service = service;
  }

  @GetMapping
  public List<Pokemon> listar(
      @RequestParam(required = false) String nome, @RequestParam(required = false) Integer tipo) {
    return service.listar(nome, tipo);
  }

  @GetMapping("/{id}")
  public Pokemon buscar(@PathVariable Integer id) {
    return service.buscar(id);
  }

  @PostMapping
  public ResponseEntity<Pokemon> criar(@Valid @RequestBody PokemonRequest dados) {
    Pokemon p = service.criar(dados);
    return ResponseEntity.created(java.net.URI.create("/api/pokemons/" + p.getId())).body(p);
  }

  @PutMapping("/{id}")
  public Pokemon atualizar(@PathVariable Integer id, @Valid @RequestBody PokemonRequest dados) {
    return service.atualizar(id, dados);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void excluir(@PathVariable Integer id) {
    service.excluir(id);
  }
}
