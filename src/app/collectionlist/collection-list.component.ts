import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css']
})
export class CollectionListComponent implements OnInit {
  collections = signal<string[]>([]);
  selectedCollection = signal<string>('');
  loading = signal(false);
  error = signal('');

  constructor(private http: HttpClient, private router: Router) {}

ngOnInit(): void {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    this.error.set('Utente non autenticato');
    return;
  }

  this.loading.set(true);

  user.getIdToken().then(token => {
    this.http.get<string[]>(
      'https://getocollectionfirstlevel-565624036400.europe-west1.run.app',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (data: any) => {
        const keys = Object.keys(data); // 🔑 Estrai le chiavi
        console.log('JSON ricevuto:', data);
        this.collections.set(data.collections);
        },
      error: (err) => this.error.set('Errore nel recupero: ' + err.message),
      complete: () => this.loading.set(false)
    });
  }).catch(err => {
    this.error.set('Errore nel recupero del token: ' + err.message);
    this.loading.set(false);
  });
}
  chooseCollection(): void {
    const collection = this.selectedCollection();
    if (collection) {
      this.router.navigate(['/documents-list', collection]);
    }
  }
}
