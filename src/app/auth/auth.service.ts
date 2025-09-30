import { Injectable, signal } from "@angular/core";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

@Injectable({ providedIn: 'root' })
export class AuthService {
  loginMessage = signal('');  
  login(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then(user => this.loginMessage.set('✅ Login riuscito:'+ user.user.email))
      .catch(err => this.loginMessage.set('❌ Errore login:'+ err.code));
  }
}