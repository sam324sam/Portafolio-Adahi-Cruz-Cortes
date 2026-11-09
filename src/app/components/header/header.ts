import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class Header {

  enlaces = [
    { texto: 'Conóceme', href: '#bienvenida' },
    { texto: 'Lenguajes', href: '#habilidades' },
    { texto: 'Proyectos', href: '#proyectos' },
  ];

  menuAbierto = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  // Cierra el menú si se hace clic fuera
  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.barra')) {
      this.menuAbierto = false;
    }
  }
}
