import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../app/navbar/navbar.component';
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
     <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
})
export class AppShellComponent {}
