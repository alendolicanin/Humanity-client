import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'; // Biblioteka za rad sa JWT tokenima
import { UserService } from './services/user.service'; // Servis za rad sa korisnicima (koji uključuje logout funkcionalnost)

@Injectable({
  providedIn: 'root', // Definiše servis kao globalno dostupan u aplikaciji
})
export class AuthGuard implements CanActivate {
  // U konstruktoru se injektuju Router i UserService
  constructor(private router: Router, private userService: UserService) {}

  // canActivate metoda definiše logiku za proveru da li korisnik može pristupiti ruti
  canActivate(
    route: ActivatedRouteSnapshot, // Sadrži informacije o trenutnoj ruti, njenim parametrima i dodatnim podacima
    state: RouterStateSnapshot // Sadrži informacije o trenutnom stanju rute
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const jwtHelper = new JwtHelperService(); // Kreira se instanca JwtHelperService-a za rad sa JWT tokenom
    const token = localStorage.getItem('token'); // Dohvata token iz localStorage (lokalno skladište u pretraživaču)

    // Ako token ne postoji, korisnik nije prijavljen
    if (!token) {
      this.router.navigate(['/login']); // Preusmerava korisnika na login stranicu
      return false; // Zabranjuje pristup ruti
    }

    // Provera da li je token istekao
    const isExpired = jwtHelper.isTokenExpired(token);

    // Ako je token istekao, odjavljujemo korisnika i preusmeravamo ga na početnu stranicu
    if (isExpired) {
      this.userService.logout(); // Poziva logout funkciju iz UserService-a
      this.router.navigate(['']); // Preusmerava korisnika na početnu stranicu
      return false; // Zabranjuje pristup ruti
    }

    // Ako token nije istekao, korisniku je dozvoljen pristup
    return !isExpired; // Vraća true ako je token validan (nije istekao)
  }
}
