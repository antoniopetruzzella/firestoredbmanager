import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { getAuth } from 'firebase/auth';

export const AuthGuard: CanActivateFn = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return !!user; // true se autenticato, false altrimenti
};
