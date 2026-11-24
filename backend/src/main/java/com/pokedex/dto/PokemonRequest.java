package com.pokedex.dto;

import com.pokedex.model.Atributos;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record PokemonRequest(
    @NotNull @Min(1) @Max(99999) Integer id,
    @NotBlank @Size(max = 80) String name,
    @NotNull @Valid Atributos stats,
    @NotNull @Size(min = 1, max = 2) List<@NotNull @Min(0) @Max(17) Integer> typeIds) {}
