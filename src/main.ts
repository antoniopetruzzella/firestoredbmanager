import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter, Routes } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './environments/firebase-config'
import { AppShellComponent } from './app/appshell.component';
import { AuthGuard } from './app/auth/auth.guard';

const routes: Routes = [
  { path: 'login', loadComponent: () => import('./app/auth/login.component').then(m => m.LoginComponent) },
  { path: 'collections', loadComponent: () => import('./app/collectionlist/collection-list.component').then(m => m.CollectionListComponent), canActivate: [AuthGuard] },
  { path: 'documents-list/:collectionId', loadComponent: () => import('./app/documentslist/documents-list.component').then(m => m.DocumentsListComponent), canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
const firebaseApp = initializeApp(firebaseConfig); // ✅ inizializza l'app
bootstrapApplication(AppShellComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
});