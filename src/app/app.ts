import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../environments/firebase-config';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('firestoredbmanager');
   constructor() {
    const app = initializeApp(firebaseConfig);
    console.log('Firebase initialized:', app.name);
    const auth = getAuth();
signInWithEmailAndPassword(auth, 'xxx', 'xxx')
  .then((result) => {
    console.log('✅ Login riuscito:', result.user.email);
  })
  .catch((error) => {
    console.error('❌ Errore login:', error.code, error.message);
  });
  }
}
