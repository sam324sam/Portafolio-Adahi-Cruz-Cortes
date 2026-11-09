import { Component, signal } from '@angular/core';
import { Background } from './components/background/background';
import { Header } from './components/header/header';
import { Projects } from './components/projects/projects';
import { Welcome } from "./components/welcome/welcome";
import { Skills } from "./components/skills/skills";

@Component({
  selector: 'app-root',
  imports: [Background, Header, Projects, Welcome, Skills],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Portafolio-Adahi-Cruz-Cortes');
}
