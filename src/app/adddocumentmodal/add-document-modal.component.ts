import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { getAuth } from 'firebase/auth';
import { NgxEditorModule, NgxEditorComponent, NgxEditorMenuComponent,Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-add-document-modal',
  standalone: true,
  templateUrl: './add-document-modal.component.html',
  imports: [CommonModule, FormsModule,NgxEditorModule,NgxEditorMenuComponent,NgxEditorComponent],
})
export class AddDocumentModalComponent implements OnInit, OnDestroy{
  @Input() collectionId = '';
  @Output() chiudi = new EventEmitter<void>();
  @Output() documentoCreato = new EventEmitter<void>();
  editor!:Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link']
  ];
  documentId = '';
  campi: { chiave: string; valore: string }[] = [];

  constructor(private http: HttpClient) {}
 ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
  aggiungiCampo() {
    this.campi.push({ chiave: '', valore: '' });
  }

  caricaDocumento() {
    const auth = getAuth();
    const user = auth.currentUser;
    //console.log("auth funzionante",auth);
    if (!user || !this.documentId || !this.collectionId) return;

    user.getIdToken().then(token => {
      const formData = new FormData();
      const headers = {
        Authorization: `Bearer ${token}`,
        'documento-id': this.documentId,
        'collezione-padre-id': this.collectionId,
        'Content-Type': 'application/json'
      };
      const payload: Record<string, string> = {};
      
      console.log('✅ Vecchio headers:', headers);
      console.log('✅ Vecchio payload:', payload);
      
      this.campi.forEach(campo => {
        if (campo.chiave && campo.valore) {
          payload[campo.chiave] = campo.valore;
        }
      });

      const url = 'https://aggiungidocumento-565624036400.europe-west1.run.app';
      this.http.post(url, payload, { headers }).subscribe({
        next: () => {
          alert('✅ Documento caricato con successo');
          this.documentoCreato.emit();
          this.chiudi.emit();
        },
        error: err => alert('❌ Errore: ' + err.message)
      });
    });
  }
}
