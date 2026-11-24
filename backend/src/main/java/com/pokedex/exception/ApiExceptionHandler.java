package com.pokedex.exception;

import java.util.Map;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(RegraException.class)
  ResponseEntity<?> regra(RegraException ex) {
    return ResponseEntity.status(ex.getStatus()).body(Map.of("mensagem", ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<?> validar(MethodArgumentNotValidException ex) {
    String campo = ex.getBindingResult().getFieldErrors().get(0).getField();
    return ResponseEntity.badRequest().body(Map.of("mensagem", "Confira o campo: " + campo));
  }

  @ExceptionHandler({
    HttpMessageNotReadableException.class,
    org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class
  })
  ResponseEntity<?> formato(Exception ex) {
    return ResponseEntity.badRequest().body(Map.of("mensagem", "Dados em formato inválido."));
  }

  @ExceptionHandler(DuplicateKeyException.class)
  ResponseEntity<?> duplicado() {
    return ResponseEntity.status(409).body(Map.of("mensagem", "Já existe um Pokémon com esse ID."));
  }
}
