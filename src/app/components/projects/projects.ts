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
  ];
}