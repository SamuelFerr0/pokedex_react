const CHAVE = "pokedex:token";
let emMemoria = null;

function lerSalvo() {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

function guardar(token) {
  try {
    localStorage.setItem(CHAVE, token);
  } catch {
    return false;
  }
  return true;
}

export function tokenDoNavegador() {
  if (!emMemoria) {
    emMemoria = lerSalvo() || crypto.randomUUID();
    guardar(emMemoria);
  }
  return emMemoria;
}
