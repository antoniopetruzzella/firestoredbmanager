import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <span class="title">firestoredbmanager</span>
      <a routerLink="/collections" *ngIf="isLoggedIn()">Collezioni</a>
      <a routerLink="/login" *ngIf="!isLoggedIn()">Login</a>
      <button (click)="logout()" *ngIf="isLoggedIn()">Logout</button>
       <span  *ngIf="loginMessage()">{{ loginMessage() }}</span>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      background: #f5f5f5;
    }
    .title {
      font-weight: bold;
      margin-right: auto;
    }
  `]
})
export class NavbarComponent {
    
 private authService = inject(AuthService);
  loginMessage = this.authService.loginMessage;
  isLoggedIn = signal(false);

  constructor() {
    const auth = getAuth();
    auth.onAuthStateChanged(user => this.isLoggedIn.set(!!user));
  }

  logout() {
    this.loginMessage.set('');
    const auth = getAuth();
    signOut(auth);
  }
}
