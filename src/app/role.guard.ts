import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Definiše servis kao dostupan u celom modulu (root modulu)
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {} // U konstruktoru se injektuje Angular Router, koji omogućava navigaciju

  // canActivate metoda je glavna logika koja odlučuje da li korisnik može pristupiti ruti
  canActivate(
    route: ActivatedRouteSnapshot, // Sadrži informacije o trenutnoj ruti i njenim parametrima
    state: RouterStateSnapshot // Sadrži informacije o trenutnom stanju rute
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const jwtHelper = new JwtHelperService(); // Kreira se instanca JwtHelperService koji pomaže u analizi i validaciji JWT tokena
    const token = localStorage.getItem('token'); // Dohvata JWT token iz localStorage (lokalno skladište u pretraživaču)

    // Proverava da li token postoji i da li je istekao
    if (!token || jwtHelper.isTokenExpired(token)) {
      this.router.navigate(['/login']); // Ako token ne postoji ili je istekao, korisnik se preusmerava na stranicu za prijavu
      return false; // Zabranjuje pristup ruti
    }

    // Ako token postoji i nije istekao, proverava se uloga korisnika
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Učitava se objekat korisnika iz localStorage
    const userRole = user.role; // Pretpostavlja se da korisnik ima ulogu definisanu u polju 'role'

    // Proverava dozvoljenu ulogu za pristup ruti, koja je definisana u 'data' objektu rute
    const allowedRole = route.data['allowedRole']; // Dozvoljena uloga se definiše u konfiguraciji rute (npr. u app-routing.module.ts)

    // Proverava da li je korisnik aktivan
    if (!user.IsActive) {
      this.router.navigate(['/login']);
      return false;
    }

    // Proverava da li je uloga korisnika dozvoljena za ovu rutu
    if (userRole === allowedRole) {
      return true; // Ako uloga odgovara dozvoljenoj, pristup se odobrava
    } else {
      // Ako korisnik nema odgovarajuću ulogu, preusmerava se na stranicu za prijavu (ili neku drugu, po želji)
      return this.router.navigate(['/login']);
    }
  }
}
