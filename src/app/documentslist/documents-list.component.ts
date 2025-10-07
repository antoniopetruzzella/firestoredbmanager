import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { AddDocumentModalComponent } from "../adddocumentmodal/add-document-modal.component";
import { UploadImageModalComponent } from "../updateimagemodal/update-image-modal.component";

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, AddDocumentModalComponent, UploadImageModalComponent],
  templateUrl: './documents-list.component.html',
  //styleUrls: ['./documents-list.component.css']
})
export class DocumentsListComponent implements OnInit {
  collectionId = '';
  documents = signal<any[]>([]);
  loading = signal(false);
  error = signal('');
  editingDocId = signal<string | null>(null);
  newDocName = signal<string>('');
  Object: any;
  showModalNewDoc = signal(false);
  showModalLoadPict=signal(false);
 newFieldKeyMap = signal<{ [docId: string]: string }>({});
  newFieldValueMap = signal<{ [docId: string]: string }>({});
  j!: number;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.collectionId = this.route.snapshot.paramMap.get('collectionId') || '';
    if (!this.collectionId) {
      this.error.set('Collezione non specificata');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      this.error.set('Utente non autenticato');
      return;
    }

    this.loading.set(true);

    user.getIdToken().then(token => {
      const url = `https://getcollectiondocuments-565624036400.europe-west1.run.app?collezione=${this.collectionId}`;
      this.http.get<any[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe({
        next: (data: any) => {
          console.log('Documenti ricevuti:', data);
          this.documents.set(data.dati);
        },
        error: (err) => this.error.set('Errore nel recupero: ' + err.message),
        complete: () => this.loading.set(false)
      });
    }).catch(err => {
      this.error.set('Errore nel recupero del token: ' + err.message);
      this.loading.set(false);
    });
  }

  editDocumentName(docId: string): void {
    console.log('Modifica nome documento:', docId);
    this.editingDocId.set(docId);
    this.newDocName.set(docId); // inizializza con il nome attuale
  }

  editRecord(docId: string): void {
    console.log('Modifica record:', docId);
    // Da implementare
  }

  addDocument(): void {
    this.showModalNewDoc.set(true);
    console.log('Aggiungi documento');
    // Da implementare
  }
  loadPicture() {
  this.showModalLoadPict.set(true);
    console.log('Carica immagine');
}
  saveDocumentName(docId: string): void {
  const nuovoID = this.newDocName();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    this.error.set('Utente non autenticato');
    return;
  }

  this.loading.set(true);

  user.getIdToken().then(token => {
    const url = 'https://modificanomedocumento-565624036400.europe-west1.run.app';
    const headers = {
      Authorization: `Bearer ${token}`,
      
    };

const body = {
  collezionePadreID: this.collectionId,
  documentoDaModificareID: docId,
  nuovoID: nuovoID
};

this.http.post(url, body, {
  headers: {
    Authorization: `Bearer ${token}`
  }
}).subscribe({
  next: () => {
    console.log(`✅ Documento ${docId} rinominato in ${nuovoID}`);
    const updated = this.documents().map(doc =>
      doc.id === docId ? { ...doc, id: nuovoID } : doc
    );
    this.documents.set(updated);
    this.editingDocId.set(null);
  },
  error: (err) => this.error.set('Errore nella modifica: ' + err.message),
  complete: () => this.loading.set(false)
});
  }).catch(err => {
    this.error.set('Errore nel recupero del token: ' + err.message);
    this.loading.set(false);
  });
}

deleteDocument(docId: string): void {
  const conferma = confirm(`Sei sicuro di voler cancellare il documento "${docId}"?`);
  if (!conferma) return;

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    this.error.set('Utente non autenticato');
    return;
  }

  this.loading.set(true);

  user.getIdToken().then(token => {
    const url = 'https://cancelladocumento-565624036400.europe-west1.run.app';
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const body = {
      'collezionePadreID': this.collectionId,
      'documentoDaCancellareID': docId
    };

    this.http.post(url, body, { headers }).subscribe({
      next: () => {
        console.log(`🗑️ Documento ${docId} cancellato`);
        const updated = this.documents().filter(doc => doc.id !== docId);
        this.documents.set(updated);
        alert(`Documento "${docId}" cancellato con successo.`);
      },
      error: (err) => this.error.set('Errore nella cancellazione: ' + err.message),
      complete: () => this.loading.set(false)
    });
  }).catch(err => {
    this.error.set('Errore nel recupero del token: ' + err.message);
    this.loading.set(false);
  });
}

addFieldToDocument(docId: string): void {
  const chiave = this.newFieldKeyMap()[docId];
  const valore = this.newFieldValueMap()[docId];

  if (!chiave || valore === undefined || valore === null) {
    alert('Inserisci sia la chiave che il valore');
    return;
  }

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    this.error.set('Utente non autenticato');
    return;
  }

  this.loading.set(true);

  user.getIdToken().then(token => {
    const url = 'https://aggiungicampo-565624036400.europe-west1.run.app';
    const body = {
      collezionePadreID: this.collectionId,
      documentoID: docId,
      nuovoCampo: {
        chiave: chiave,
        valore: valore
      }
    };

    this.http.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        console.log(`✅ Campo aggiunto a ${docId}: ${chiave} = ${valore}`);
        const updated = this.documents().map(doc =>
          doc.id === docId
            ? { ...doc, [chiave]: valore }
            : doc
        );
        this.documents.set(updated);
        this.newFieldKeyMap.update(obj => ({ ...obj, [docId]: '' }));
        this.newFieldValueMap.update(obj => ({ ...obj, [docId]: '' }));
      },
      error: (err) => this.error.set('Errore nell\'aggiunta del campo: ' + err.message),
      complete: () => this.loading.set(false)
    });
  }).catch(err => {
    this.error.set('Errore nel recupero del token: ' + err.message);
    this.loading.set(false);
  });
}

getKey(docId: string) {
  return this.newFieldKeyMap()[docId] || '';
}

getValue(docId: string) {
  return this.newFieldValueMap()[docId] || '';
}
updateKey(docId: string, value: string) {
  this.newFieldKeyMap.update(map => ({ ...map, [docId]: value }));
}

updateValue(docId: string, value: string) {
  this.newFieldValueMap.update(map => ({ ...map, [docId]: value }));
}

deleteRecord(docId: string, chiave: string, valore: string): void {
  const conferma = confirm(`Vuoi davvero cancellare il campo "${chiave}" dal documento "${docId}"?`);
  if (!conferma) return;

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    this.error.set('Utente non autenticato');
    return;
  }

  this.loading.set(true);

  user.getIdToken().then(token => {
    const url = 'https://cancellacampo-565624036400.europe-west1.run.app';
    const body = {
      collezionePadreID: this.collectionId,
      documentoID: docId,
      campoDaCancellare: { chiave, valore }
    };

    this.http.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        console.log(`🗑️ Campo "${chiave}" cancellato da ${docId}`);
        const updated = this.documents().map(doc =>
          doc.id === docId
            ? { ...doc, dati: doc.dati.filter((c: { chiave: string; valore: string; }) => !(c.chiave === chiave && c.valore === valore)) }
            : doc
        );
        this.documents.set(updated);
      },
      error: (err) => this.error.set('Errore nella cancellazione del campo: ' + err.message),
      complete: () => this.loading.set(false)
    });
  }).catch(err => {
    this.error.set('Errore nel recupero del token: ' + err.message);
    this.loading.set(false);
  });
}

}
