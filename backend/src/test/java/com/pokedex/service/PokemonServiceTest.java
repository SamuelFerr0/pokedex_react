package com.pokedex.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pokedex.dto.PokemonRequest;
import com.pokedex.exception.RegraException;
import com.pokedex.model.*;
import com.pokedex.repository.*;
import java.util.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

@ExtendWith(MockitoExtension.class)
@DisplayName("Regras da Pokédex")
class PokemonServiceTest {
  @Mock private PokemonRepository repository;
  @Mock private TipoRepository tipos;
  @InjectMocks private PokemonService service;
  private Tipo electric = new Tipo(5, "Electric");
  private Atributos stats = new Atributos(35, 55, 30, 50, 40, 90);
  private Pokemon pokemon;

  @BeforeEach
  void preparar() {
    pokemon = new Pokemon(25, "Pikachu", stats, List.of(electric));
  }

  PokemonRequest dados() {
    return new PokemonRequest(25, " Pikachu ", stats, List.of(5));
  }

  @Nested
  @DisplayName("Consulta")
  class Consulta {
    @Test
    void listarOrdenados() {
      when(repository.findAll(Sort.by("id"))).thenReturn(List.of(pokemon));
      assertEquals(List.of(pokemon), service.listar(null, null));
    }

    @Test
    void nomeIgnoraMaiusculasEEspacos() {
      when(repository.findByNameContainingIgnoreCaseOrderByIdAsc("PIKA"))
          .thenReturn(List.of(pokemon));
      assertEquals(List.of(pokemon), service.listar(" PIKA ", null));
      verify(repository).findByNameContainingIgnoreCaseOrderByIdAsc("PIKA");
    }

    @Test
    void filtrarTipo() {
      when(repository.findByTypes_IdOrderByIdAsc(5)).thenReturn(List.of(pokemon));
      assertEquals(List.of(pokemon), service.listar(null, 5));
      verify(repository).findByTypes_IdOrderByIdAsc(5);
    }

    @Test
    void combinarFiltros() {
      when(repository.findByNameContainingIgnoreCaseAndTypes_IdOrderByIdAsc("Pika", 2))
          .thenReturn(List.of());
      assertTrue(service.listar("Pika", 2).isEmpty());
      verify(repository).findByNameContainingIgnoreCaseAndTypes_IdOrderByIdAsc("Pika", 2);
    }

    @Test
    void buscarExistente() {
      when(repository.findById(25)).thenReturn(Optional.of(pokemon));
      assertEquals(pokemon, service.buscar(25));
    }

    @Test
    void buscarAusente() {
      assertEquals(
          404, assertThrows(RegraException.class, () -> service.buscar(99)).getStatus().value());
    }
  }

  @Nested
  @DisplayName("Cadastro")
  class Cadastro {
    @Test
    void criarComTiposDoBancoENomeTratado() {
      when(tipos.findById(5)).thenReturn(Optional.of(electric));
      when(repository.insert(any(Pokemon.class))).thenAnswer(i -> i.getArgument(0));
      Pokemon result = service.criar(dados());
      assertEquals("Pikachu", result.getName());
      assertEquals(List.of(electric), result.getTypes());
      ArgumentCaptor<Pokemon> captor = ArgumentCaptor.forClass(Pokemon.class);
      verify(repository).insert(captor.capture());
      assertEquals(25, captor.getValue().getId());
    }

    @Test
    void idDuplicadoNaoInsere() {
      when(repository.existsById(25)).thenReturn(true);
      assertEquals(
          409,
          assertThrows(RegraException.class, () -> service.criar(dados())).getStatus().value());
      verify(repository, never()).insert(any(Pokemon.class));
    }

    @Test
    void tipoInexistenteNaoInsere() {
      assertThrows(RegraException.class, () -> service.criar(dados()));
      verify(repository, never()).insert(any(Pokemon.class));
    }

    @Test
    void tipoRepetidoNaoInsere() {
      assertThrows(
          RegraException.class,
          () -> service.criar(new PokemonRequest(25, "Pikachu", stats, List.of(5, 5))));
      verifyNoInteractions(tipos);
    }

    @Test
    void typelessNaoCombinaComOutroTipo() {
      assertThrows(
          RegraException.class,
          () -> service.criar(new PokemonRequest(25, "Pikachu", stats, List.of(0, 5))));
      verifyNoInteractions(tipos);
    }
  }

  @Nested
  @DisplayName("Alteração e exclusão")
  class Alteracao {
    @Test
    void atualizarExistente() {
      when(repository.findById(25)).thenReturn(Optional.of(pokemon));
      when(tipos.findById(5)).thenReturn(Optional.of(electric));
      when(repository.save(any(Pokemon.class))).thenAnswer(i -> i.getArgument(0));
      assertEquals("Pikachu", service.atualizar(25, dados()).getName());
      verify(repository).save(any(Pokemon.class));
    }

    @Test
    void naoMudarIdentificador() {
      when(repository.findById(25)).thenReturn(Optional.of(pokemon));
      assertThrows(
          RegraException.class,
          () -> service.atualizar(25, new PokemonRequest(26, "Raichu", stats, List.of(5))));
      verify(repository, never()).save(any());
    }

    @Test
    void naoAtualizarAusente() {
      assertThrows(RegraException.class, () -> service.atualizar(25, dados()));
      verify(repository, never()).save(any());
    }

    @Test
    void excluirExistente() {
      when(repository.findById(25)).thenReturn(Optional.of(pokemon));
      service.excluir(25);
      verify(repository).delete(pokemon);
    }

    @Test
    void naoExcluirAusente() {
      assertThrows(RegraException.class, () -> service.excluir(99));
      verify(repository, never()).delete(any());
    }
  }
}
