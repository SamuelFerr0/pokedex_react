package com.pokedex.controller;

import com.pokedex.model.*;
import com.pokedex.repository.*;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CatalogoController {
  private final TipoRepository tipos;
  private final TreinadorRepository treinadores;

  public CatalogoController(TipoRepository tipos, TreinadorRepository treinadores) {
    this.tipos = tipos;
    this.treinadores = treinadores;
  }

  @GetMapping("/tipos")
  public List<Tipo> tipos() {
    return tipos.findAll(Sort.by("id"));
  }

  @GetMapping("/treinadores")
  public List<Treinador> treinadores() {
    return treinadores.findAll(Sort.by("id"));
  }
}
