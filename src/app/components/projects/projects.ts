import { Component } from '@angular/core';

interface Proyecto {
  titulo: string;
  descripcion: string;
  imagen: string;
  web: string;
  repo: string;
  tecnologias?: string[];
}

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  proyectos: Proyecto[] = [
    {
      titulo: 'Orbital Burn',
      descripcion: 'Proyecto desarrollado en Unity para una Game Jam, creado en 4 días por un equipo de 4 personas.',
      imagen: 'assets/img_proyectos/Orbital-Burn.gif',
      web: 'https://sam324sam.itch.io/orbital-burn',
      repo: '',
      tecnologias: ['Unity', 'C#', 'Game Jam'],
    },
    {
      titulo: 'Generacion De Terreno TFG',
      descripcion: 'El objetivo del proyecto es la generación mediante el uso de las mallas de vertices en Unity de un mundo de gran tamaño que se encuentre cargado en todo momento mediante un sistema de carga de LoDs adaptativo.',
      imagen: 'assets/img_proyectos/generacion-de-terreno-tfg.webp',
      web: '',
      repo: 'https://github.com/Artlak/GeneracionGestionTerreno_TFG',
      tecnologias: ['Unity', 'C#', 'TFG'],
    },
    {
      titulo: 'Crippled Wheels',
      descripcion: 'Juego radical de carreras en silla de ruedas creado para una game jam',
      imagen: 'assets/img_proyectos/crippled-wheels.webp',
      web: 'https://artlak04.itch.io/crippled-wheels',
      repo: '',
      tecnologias: ['Unity', 'C#', 'Game Jam'],
    },
  ];
}