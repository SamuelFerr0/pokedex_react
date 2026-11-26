package com.pokedex.controller;

import com.pokedex.service.FavoritosService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritosController {
  private final FavoritosService favoritos;

  public FavoritosController(FavoritosService favoritos) {
    this.favoritos = favoritos;
  }

  @GetMapping
  public List<Integer> listar(@RequestHeader("X-Pokedex-Token") UUID token) {
    return favoritos.listar(token);
  }

  @PutMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void adicionar(@RequestHeader("X-Pokedex-Token") UUID token, @PathVariable int id) {
    favoritos.adicionar(token, id);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void remover(@RequestHeader("X-Pokedex-Token") UUID token, @PathVariable int id) {
    favoritos.remover(token, id);
  }
}
