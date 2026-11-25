package com.pokedex.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.pokedex.exception.*;
import com.pokedex.model.*;
import com.pokedex.service.PokemonService;
import java.util.List;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
@DisplayName("API de Pokémon")
class PokemonControllerTest {
  @Mock private PokemonService service;
  @InjectMocks private PokemonController controller;
  private MockMvc mvc;
  Pokemon p =
      new Pokemon(
          25, "Pikachu", new Atributos(35, 55, 30, 50, 40, 90), List.of(new Tipo(5, "Electric")));
  String json =
      """
      {"id":25,"name":"Pikachu","stats":{"hp":35,"attack":55,"defense":30,"specialAttack":50,"specialDefense":40,"speed":90},"typeIds":[5]}
      """;

  @BeforeEach
  void preparar() {
    mvc =
        MockMvcBuilders.standaloneSetup(controller)
            .setControllerAdvice(new ApiExceptionHandler())
            .build();
  }

  @Test
  void lista() throws Exception {
    when(service.listar(null, null)).thenReturn(List.of(p));
    mvc.perform(get("/api/pokemons"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("Pikachu"));
  }

  @Test
  void detalhe() throws Exception {
    when(service.buscar(25)).thenReturn(p);
    mvc.perform(get("/api/pokemons/25"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.stats.hp").value(35));
  }

  @Test
  void cadastra() throws Exception {
    when(service.criar(any())).thenReturn(p);
    mvc.perform(post("/api/pokemons").contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location", "/api/pokemons/25"));
  }

  @Test
  void atualiza() throws Exception {
    when(service.atualizar(eq(25), any())).thenReturn(p);
    mvc.perform(put("/api/pokemons/25").contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk());
  }

  @Test
  void exclui() throws Exception {
    mvc.perform(delete("/api/pokemons/25")).andExpect(status().isNoContent());
    verify(service).excluir(25);
  }

  @Test
  void inexistente() throws Exception {
    when(service.buscar(999))
        .thenThrow(new RegraException(HttpStatus.NOT_FOUND, "Pokémon não encontrado."));
    mvc.perform(get("/api/pokemons/999"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.mensagem").exists());
  }

  @Test
  void rejeitaNomeVazio() throws Exception {
    mvc.perform(
            post("/api/pokemons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.replace("Pikachu", " ")))
        .andExpect(status().isBadRequest());
    verifyNoInteractions(service);
  }

  @Test
  void rejeitaAtributoInvalido() throws Exception {
    mvc.perform(
            post("/api/pokemons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.replace("35", "0")))
        .andExpect(status().isBadRequest());
    verifyNoInteractions(service);
  }

  @Test
  void rejeitaTipoNulo() throws Exception {
    mvc.perform(
            post("/api/pokemons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.replace("[5]", "[null]")))
        .andExpect(status().isBadRequest());
    verifyNoInteractions(service);
  }

  @Test
  void rejeitaJsonInvalido() throws Exception {
    mvc.perform(post("/api/pokemons").contentType(MediaType.APPLICATION_JSON).content("{"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void rejeitaIdTexto() throws Exception {
    mvc.perform(get("/api/pokemons/abc")).andExpect(status().isBadRequest());
  }
}
