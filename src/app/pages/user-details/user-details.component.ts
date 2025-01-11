import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent {
  userDetails: any = {}; // Objekat za čuvanje podataka o korisniku
  id: string = ''; // ID korisnika koji će se dohvatiti
  user: any = []; // Trenutno prijavljeni korisnik
  errorMessage: string = ''; // Poruka o grešci koja će se prikazati ako korisnik ne može biti obrisan

  constructor(
    private router: ActivatedRoute, // Za pristup parametrima rute (npr. ID korisnika)
    public UserService: UserService, // Servis za rad sa korisnicima
    public Router: Router, // Angularov Router za navigaciju
    public dialog: MatDialog // Servis za otvaranje dijaloga
  ) {}

  ngOnInit(): void {
    // Pretplaćivanje na parametre rute kako bi se dobio ID korisnika
    this.router.paramMap.subscribe((params) => {
      this.id = String(params.get('id') ?? ''); // Dohvata ID iz parametara rute
      this.UserService.getUserById(this.id).subscribe(
        (data) => {
          this.userDetails = data; // Čuva podatke korisnika dohvaćene sa servera
        },
        (err) => {
          console.log(err); // Loguje greške ako dođe do problema sa API pozivom
        }
      );
    });

    // Proverava da li postoji podatak o trenutno prijavljenom korisniku u localStorage
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      this.user = JSON.parse(userJSON); // Parsira JSON u objekat i čuva ga u `user`
    }
  }

  // Otvara dijalog za potvrdu brisanja korisnika
  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationComponent); // Otvara komponentu za potvrdu

    // Nakon što se dijalog zatvori, proverava rezultat
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Ako je korisnik potvrdio akciju, poziva metodu `delete` za brisanje korisnika
        this.delete();
      }
    });
  }

  // Metoda za brisanje korisnika sa servera
  delete() {
    this.UserService.deleteUser(this.id).subscribe(
      (res) => {
        console.log(res); // Loguje odgovor servera nakon brisanja korisnika
        this.Router.navigate(['/']); // Navigira nazad na početnu stranicu nakon uspešnog brisanja
      },
      (err) => {
        console.log(err); // Loguje grešku ako dođe do problema sa brisanjem
        this.errorMessage =
          'Korisnik ne može biti obrisan jer ima već distribuisane donacije i zahvalnice.';
      }
    );
  }
}
