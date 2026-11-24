package com.pokedex.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class Atributos {
  @NotNull
  @Min(1)
  @Max(255)
  private Integer hp;

  @NotNull
  @Min(1)
  @Max(255)
  private Integer attack;

  @NotNull
  @Min(1)
  @Max(255)
  private Integer defense;

  @NotNull
  @Min(1)
  @Max(255)
  private Integer specialAttack;

  @NotNull
  @Min(1)
  @Max(255)
  private Integer specialDefense;

  @NotNull
  @Min(1)
  @Max(255)
  private Integer speed;

  public Atributos() {}

  public Atributos(
      Integer hp,
      Integer attack,
      Integer defense,
      Integer specialAttack,
      Integer specialDefense,
      Integer speed) {
    this.hp = hp;
    this.attack = attack;
    this.defense = defense;
    this.specialAttack = specialAttack;
    this.specialDefense = specialDefense;
    this.speed = speed;
  }

  public Integer getHp() {
    return hp;
  }

  public void setHp(Integer hp) {
    this.hp = hp;
  }

  public Integer getAttack() {
    return attack;
  }

  public void setAttack(Integer attack) {
    this.attack = attack;
  }

  public Integer getDefense() {
    return defense;
  }

  public void setDefense(Integer defense) {
    this.defense = defense;
  }

  public Integer getSpecialAttack() {
    return specialAttack;
  }

  public void setSpecialAttack(Integer specialAttack) {
    this.specialAttack = specialAttack;
  }

  public Integer getSpecialDefense() {
    return specialDefense;
  }

  public void setSpecialDefense(Integer specialDefense) {
    this.specialDefense = specialDefense;
  }

  public Integer getSpeed() {
    return speed;
  }

  public void setSpeed(Integer speed) {
    this.speed = speed;
  }
}
