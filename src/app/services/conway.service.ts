import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConwayService {
  columnas = 0;
  filas = 0;

  private celdas = new Uint8Array(0);
  private siguiente = new Uint8Array(0);

  // Anti-estancamiento
  private generacionesEstancadas = 0;
  private readonly umbralCambios = 3;   // menos cambios que esto = "estancado"
  private readonly maxEstancadas = 30;  // generaciones estancadas antes de inyectar caos

  //  API pública 

  crearMundo(canvas: HTMLCanvasElement, tamañoCelda: number, densidad = 0.15) {
    this.columnas = Math.ceil(canvas.width / tamañoCelda);
    this.filas = Math.ceil(canvas.height / tamañoCelda);

    const total = this.columnas * this.filas;
    this.celdas = Uint8Array.from({ length: total }, () => (Math.random() < densidad ? 1 : 0));
    this.siguiente = new Uint8Array(total);
    this.generacionesEstancadas = 0;
  }

  estaViva(x: number, y: number): boolean {
    return this.celdas[this.indice(x, y)] === 1;
  }

  siguienteGeneracion() {
    const cambios = this.calcularSiguienteEstado();
    this.intercambiarBuffers();
    this.evitarEstancamiento(cambios);
  }

  //  Pasos de una generación 

  /** Rellena `siguiente` a partir de `celdas`. Devuelve cuántas celdas cambiaron. */
  private calcularSiguienteEstado(): number {
    let cambios = 0;

    for (let y = 0; y < this.filas; y++) {
      for (let x = 0; x < this.columnas; x++) {
        const idx = this.indice(x, y);
        const actual = this.celdas[idx];
        const nuevo = this.aplicarReglas(actual, this.contarVecinos(x, y));

        this.siguiente[idx] = nuevo;
        if (nuevo !== actual) cambios++;
      }
    }
    return cambios;
  }

  /** Reglas de Conway. */
  private aplicarReglas(viva: number, vecinos: number): number {
    if (vecinos === 3) return 1;            // nace o sigue viva
    return viva && vecinos === 2 ? 1 : 0;   // sobrevive solo con 2
  }

  private intercambiarBuffers() {
    [this.celdas, this.siguiente] = [this.siguiente, this.celdas];
  }

  /** Mundo toroidal: los bordes se conectan entre sí. */
  private contarVecinos(x: number, y: number): number {
    let total = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = this.envolver(x + dx, this.columnas);
        const ny = this.envolver(y + dy, this.filas);
        total += this.celdas[this.indice(nx, ny)];
      }
    }
    return total;
  }

  //  Anti-estancamiento 

  private evitarEstancamiento(cambios: number) {
    if (cambios >= this.umbralCambios) {
      this.generacionesEstancadas = 0;
      return;
    }

    this.generacionesEstancadas++;
    if (this.generacionesEstancadas >= this.maxEstancadas) {
      this.inyectarCaos();
      this.generacionesEstancadas = 0;
    }
  }

  private inyectarCaos(manchas = 4, radio = 6, densidad = 0.4) {
    for (let i = 0; i < manchas; i++) {
      const cx = Math.floor(Math.random() * this.columnas);
      const cy = Math.floor(Math.random() * this.filas);
      this.pintarMancha(cx, cy, radio, densidad);
    }
  }

  private pintarMancha(cx: number, cy: number, radio: number, densidad: number) {
    for (let dy = -radio; dy <= radio; dy++) {
      for (let dx = -radio; dx <= radio; dx++) {
        if (Math.random() > densidad) continue;
        const x = this.envolver(cx + dx, this.columnas);
        const y = this.envolver(cy + dy, this.filas);
        this.celdas[this.indice(x, y)] = 1;
      }
    }
  }

  //  Utilidades 

  private indice(x: number, y: number): number {
    return y * this.columnas + x;
  }

  /** Módulo que funciona también con negativos. */
  private envolver(valor: number, max: number): number {
    return ((valor % max) + max) % max;
  }
}