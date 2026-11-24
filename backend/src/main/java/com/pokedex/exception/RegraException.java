package com.pokedex.exception;

import org.springframework.http.HttpStatus;

public class RegraException extends RuntimeException {
  private final HttpStatus status;

  public RegraException(HttpStatus status, String message) {
    super(message);
    this.status = status;
  }

  public HttpStatus getStatus() {
    return status;
  }
}
