import { HttpClient } from '@angular/common/http'; // Koristi se za HTTP zahteve
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { env } from '../env';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = env.url;
  // BehaviorSubject je reaktivna promenljiva koja može emitovati vrednosti i zadržati zadnju emitovanu vrednost
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  // Čuva stanje da li je korisnik ulogovan
  private _isLoggedIn = new BehaviorSubject<boolean>(false);

  public userUpdated: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient) {} // Injektuje HttpClient za HTTP zahteve

  // Metoda za prijavu korisnika
  login_user(log: any) {
    const isLoggedIn = log && log.token; // Proverava da li postoji token (korisnik je prijavljen ako postoji)
    if (isLoggedIn) {
      this._isLoggedIn.next(true); // Ako postoji token, postavlja korisnika kao ulogovanog
    } else {
      this._isLoggedIn.next(false); // Ako ne postoji, korisnik nije prijavljen
    }
  }

  // Getter za isLoggedIn - emitovan status da li je korisnik ulogovan (Observable)
  get isLoggedIn(): Observable<boolean> {
    return this._isLoggedIn.asObservable(); // Vraća Observable koji emituje promene stanja ulogovanosti
  }

  // Getter za trenutnog korisnika
  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable(); // Observable za emitovanje trenutnog korisnika
  }

  // Postavljanje trenutnog korisnika
  setCurrentUser(user: any) {
    this.currentUserSubject.next(user); // Emituje novog korisnika kroz BehaviorSubject
  }

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.url}/Auth/register`, dto);
  }

  login(credentioalns: any): Observable<any> {
    return this.http.post(`${this.url}/Auth/login`, credentioalns);
  }

  changePassword(id: string, dto: Pass): Observable<any> {
    return this.http.post(`${this.url}/Auth/change-password/${id}`, dto);
  }

  // Odjava korisnika
  logout() {
    localStorage.removeItem('token'); // Uklanja token iz localStorage-a
    localStorage.removeItem('user'); // Uklanja korisnika iz localStorage-a
  }

  // Proverava da li je korisnik ulogovan na osnovu prisustva tokena u localStorage-u
  isLogedIn() {
    const token = localStorage.getItem('token');
    return !!token; // Vraća true ako token postoji, inače false
  }

  // Proverava da li korisnik ima profilnu sliku
  hasImage() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return !!user.image; // Vraća true ako korisnik ima sliku
  }

  // Proverava da li korisnik nema profilnu sliku (ako je `image` null)
  hasEImage() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.image === null; // Vraća true ako slika ne postoji (image je null)
  }

  isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 3) {
      return true;
    }
    return false;
  }

  isCourier() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 2) {
      return true;
    }
    return false;
  }

  isRecipient() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 1) {
      return true;
    }
    return false;
  }

  isDonor() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 0) {
      return true;
    }
    return false;
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.url}/User/get-by-id/${id}`);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.url}/User/all`);
  }

  updateUser(id: string, dto: UpdateDto): Observable<any> {
    return this.http.put(`${this.url}/User/update/${id}`, dto);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.url}/User/delete/${id}`);
  }

  approve(id: string): Observable<any> {
    return this.http.post(`${this.url}/User/approve/${id}`, null);
  }

  reject(id: string): Observable<any> {
    return this.http.post(`${this.url}/User/reject/${id}`, null);
  }

  getPendingApproval(): Observable<any> {
    return this.http.get(`${this.url}/User/pending-approval`);
  }
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  city: string;
  age: number;
  role: number;
  isAnonymous: boolean;
  email: string;
  password: string;
}

export interface UpdateDto {
  firstName: string;
  lastName: string;
  city: string;
  age: number;
  isAnonymous: boolean;
  image: string;
  registeredCategories?: number[];
}

export interface Pass {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmNewPassword: string;
}

export enum UserRole {
  Donor = 0,
  Recipient = 1,
  Courier = 2,
  Admin = 3,
}
