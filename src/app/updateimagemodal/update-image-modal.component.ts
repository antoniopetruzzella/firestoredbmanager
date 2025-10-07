import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-upload-image-modal',
  standalone: true,
  templateUrl: './update-image-modal.component.html',
  imports: [CommonModule, FormsModule],
})
export class UploadImageModalComponent {
  @Input() collectionId = '';
  @Output() chiudi = new EventEmitter<void>();
  @Output() documentoCreato = new EventEmitter<void>();

  selectedFile: File | null = null;
  documentId = '';
  campi = [{ chiave: 'imgUrl', valore: '' }];
  loading = false;

  // 🔐 Inserisci qui la tua API key di ImgBB
  private readonly imgbbApiKey = '69c8027c3d859bdf597e4d08aed41eec';

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  caricaImmagine() {
    if (!this.selectedFile) return;

    this.loading = true;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]; // Rimuove il prefisso data:image/...

      const body = new HttpParams()
        .set('key', this.imgbbApiKey)
        .set('image', base64);

      this.http.post<any>('https://api.imgbb.com/1/upload', body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).subscribe({
        next: res => {
          this.campi[0].valore = res.data.url; // ✅ URL pubblico da usare
          this.loading = false;
          alert('✅ Immagine caricata su ImgBB!');
        },
        error: err => {
          console.error('❌ Errore upload ImgBB:', err);
          alert('Errore durante l’upload: ' + err.message);
          this.loading = false;
        }
      });
    };

    reader.readAsDataURL(this.selectedFile);
  }

caricaDocumento() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !this.documentId || !this.collectionId) return;

  user.getIdToken().then(token => {
    const payload: Record<string, string> = {};
    this.campi.forEach(campo => {
      if (campo.chiave && campo.valore) {
        payload[campo.chiave] = campo.valore;
      }
    });

    const headers = {
      Authorization: `Bearer ${token}`,
      'documento-id': this.documentId,
      'collezione-padre-id': this.collectionId,
      'Content-Type': 'application/json'
    };

    console.log('✅ Nuovo headers:', headers);
    console.log('✅ Nuovo payload:', payload);

    const url = 'https://aggiungidocumento-565624036400.europe-west1.run.app';
    this.http.post(url, payload, { headers }).subscribe({
      next: () => {
        alert('✅ Documento immagine salvato');
        this.documentoCreato.emit();
        this.chiudi.emit();
      },
      error: err => {
        console.error('❌ Errore salvataggio:', err);
        alert('❌ Errore salvataggio: ' + err.message);
      }
    });
  });
}


}
