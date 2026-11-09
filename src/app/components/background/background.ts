import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { SnakeService } from '../../services/snake.service';
import { ConwayService } from '../../services/conway.service';
import { CtxSquare } from '../../models/ctx-square/ctx-square-model';

const ANIMACION_SNAKE = 0;
const ANIMACION_LIFE = 1;
const TOTAL_ANIMACIONES = 2;

@Component({
  selector: 'app-background',
  standalone: true,
  templateUrl: './background.html',
  styleUrls: ['./background.css'],
})
export class Background implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // Se elige una al azar cada vez que se carga el componente
  animation: number = Math.floor(Math.random() * TOTAL_ANIMACIONES);

  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  private rafId = 0;

  // para el responsive del dibujado
  escala: number = Math.min(window.innerWidth, window.innerHeight) / 1920;

  // Snake 
  serpientes: CtxSquare[] = [];
  velocidadBase: number = 5;
  tamaño = 20 * this.escala;
  velocidad = this.velocidadBase * this.escala;
  cantidad = Math.ceil(this.escala * 35);

  // Game of Life
  tamañoCelda = Math.max(8, Math.round(20 * this.escala));
  msPorGeneracion = 120;
  acumulado = 0;

  // Loop 
  fps: number = 30;
  interval: number = 1000 / this.fps;
  lastTime: number = 0;

  constructor(
    private readonly snakeService: SnakeService,
    private readonly conwayService: ConwayService,
  ) {}

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.iniciarAnimacion();
    this.rafId = requestAnimationFrame((t) => this.animar(t));
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rafId);
  }

  @HostListener('window:resize')
  onResize() {
    this.iniciarAnimacion();
  }

  private iniciarAnimacion() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // fondo negro inicial
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.animation) {
      case ANIMACION_SNAKE:
        this.animationSnake();
        break;
      case ANIMACION_LIFE:
        this.animationGameOfLife();
        break;
    }
  }

  private animationSnake() {
    this.serpientes = this.snakeService.crearSerpientes(this.cantidad, this.velocidad, this.canvas);
  }

  private animationGameOfLife() {
    this.acumulado = 0;
    this.conwayService.crearMundo(this.canvas, this.tamañoCelda);
  }

  private animar(timestamp: number) {
    this.rafId = requestAnimationFrame((t) => this.animar(t));
    const delta = timestamp - this.lastTime;
    if (delta < this.interval) return;

    this.lastTime = timestamp - (delta % this.interval);

    switch (this.animation) {
      case ANIMACION_SNAKE:
        this.frameSnake();
        break;
      case ANIMACION_LIFE:
        this.frameLife();
        break;
    }
  }

  // snake
  private frameSnake() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const serpiente of this.serpientes) {
      this.snakeService.moverSerpiente(serpiente, this.canvas);
      this.dibujarSerpiente(serpiente);
    }
  }

  private dibujarSerpiente(serpiente: CtxSquare) {
    this.ctx.fillStyle = serpiente.color;
    this.ctx.shadowColor = serpiente.color;
    this.ctx.shadowBlur = 15;
    this.ctx.fillRect(serpiente.x, serpiente.y, 20, 20);

    for (const parte of serpiente.posicionesStela) {
      this.ctx.fillStyle = parte.color;
      this.ctx.fillRect(parte.x, parte.y, 20, 20);
    }
  }

  // Game of Life
  private frameLife() {
    // La simulacion avanza a su propio ritmo, independiente del render
    this.acumulado += this.interval;
    if (this.acumulado >= this.msPorGeneracion) {
      this.conwayService.siguienteGeneracion();
      this.acumulado = 0;
    }

    // Fondo semitransparente las celdas que mueren dejan estela
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#00bf63';
    const lado = this.tamañoCelda - 2;

    for (let y = 0; y < this.conwayService.filas; y++) {
      for (let x = 0; x < this.conwayService.columnas; x++) {
        if (this.conwayService.estaViva(x, y)) {
          this.ctx.fillRect(x * this.tamañoCelda + 1, y * this.tamañoCelda + 1, lado, lado);
        }
      }
    }
  }
}