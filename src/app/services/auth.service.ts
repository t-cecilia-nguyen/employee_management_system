import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';

  // Save token to storage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Retrieve token from storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Clear token from storage
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}