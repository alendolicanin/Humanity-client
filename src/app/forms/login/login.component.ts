import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CustomValidator } from './email.validators';
import { CustomValidatorP } from './password.validators';
import { MatDialog } from '@angular/material/dialog';
import { CategorySelectionDialogComponent } from 'src/app/dialog/category-selection-dialog/category-selection-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // Promenljive za praćenje stanja prijave
  errorMessage: string = ''; // Poruka greške
  success = false; // Da li je registracija uspešno obavljena
  loading = false; // Da li je prijava u toku
  role: number | null = null; // Role korisnika

  constructor(
    private userService: UserService,
    @Inject(Router) private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Provera da li je registracija uspešno obavljena
    this.route.queryParams.subscribe((params) => {
      const registered = params['registered']; // Dohvatanje parametra 'registered'
      if (registered === 'success') {
        this.success = true; // Prikaz poruke za čekanje odobrenja
      }
    });
  }

  // Forma za prijavu sa poljima za email i lozinku
  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      CustomValidator.cannotContaintSpace,
      CustomValidator.email,
    ]), // Email polje sa validatorom
    password: new FormControl('', [
      Validators.required,
      CustomValidatorP.cannotContaintSpace,
    ]), // Polje lozinke sa validatorom
  });

  // Getter metode za pristup formi
  get Email() {
    return this.form.get('email');
  }

  get Password() {
    return this.form.get('password');
  }

  // Metoda za prijavu korisnika
  login() {
    // Provera validnosti forme
    if (this.form.invalid) {
      this.errorMessage = 'Molimo unesite sve podatke ispravno.';
      return;
    }

    const credentials = this.form.value;

    this.loading = true;
    this.errorMessage = ''; // Resetovanje poruke greške

    this.userService.login(credentials).subscribe(
      (response: any) => {
        // Ako prijava uspe, čuvamo podatke i preusmeravamo korisnika
        if (response && response.token) {
          localStorage.setItem('token', response.token); // Sačuvanje tokena u lokalnom skladištu
          localStorage.setItem('user', JSON.stringify(response.user)); // Sačuvanje korisnika
          this.userService.setCurrentUser(response.user); // Postavljanje trenutnog korisnika u servisu

          this.role = response.user.role; // Postavi trenutnu ulogu korisnika

          // Proveri da li je korisnik primalac i nema postavljene kategorije
          if (
            this.role === 1 && // Proveri da li je korisnik primalac
            (!response.user.registeredCategories ||
              response.user.registeredCategories.length === 0)
          ) {
            this.router.navigate(['']);
            // Prikaži pop-up prozor
            this.openCategorySelectionPopup(response.user);
          } else {
            // Ako nije primalac ili već ima kategorije, idi na početnu stranicu
            this.router.navigate(['']);
          }
        }
        this.loading = false;
      },
      (err) => {
        // Prikaz odgovarajuće greške na osnovu statusa ili poruke sa servera
        this.errorMessage =
          err.error?.message || 'Došlo je do greške. Pokušajte ponovo.';
        this.loading = false;
      }
    );
  }

  openCategorySelectionPopup(user: any) {
    const dialogRef = this.dialog.open(CategorySelectionDialogComponent, {
      data: { user: user }, // Prosleđujemo podatke korisnika
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Ako su izabrane kategorije, ažuriraj korisnika
        this.userService
          .updateUser(user.id, {
            firstName: user.firstName,
            lastName: user.lastName,
            city: user.city,
            age: user.age,
            isAnonymous: user.isAnonymous,
            image: user.image,
            registeredCategories: result, // Prosleđujemo nove kategorije
          })
          .subscribe(() => {
            this.router.navigate(['']); // Nakon uspešnog ažuriranja, idi na početnu
          });
      } else {
        this.router.navigate(['']); // Ako je zatvoreno bez izbora
      }
    });
  }
}
