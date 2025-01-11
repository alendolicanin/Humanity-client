import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, Pass } from 'src/app/services/user.service';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidatorP } from './password.validators';

@Component({
  selector: 'app-changepw',
  templateUrl: './changepw.component.html',
  styleUrls: ['./changepw.component.css'],
})
export class ChangepwComponent {
  id: string = ''; // ID korisnika preuzet iz URL-a
  successMessage: string = ''; // Poruka uspeha
  errorMessage: string = ''; // Poruka greške

  constructor(
    private router: ActivatedRoute,
    public userService: UserService,
    public dialog: MatDialog,
    public Router: Router
  ) {}

  // Definisanje reactive forme sa poljima i validatorima
  form = new FormGroup(
    {
      oldPassword: new FormControl('', [Validators.required]), // Polje za staru lozinku
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8), // Minimalna dužina nove lozinke
        Validators.maxLength(16), // Maksimalna dužina nove lozinke
        CustomValidatorP.cannotContaintSpace, // Validacija da lozinka ne sadrži razmake
        CustomValidatorP.number, // Validacija da sadrži broj
        CustomValidatorP.specialCaracter, // Validacija za specijalni znak
        CustomValidatorP.upperCase, // Validacija za veliko slovo
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: CustomValidatorP.passwordsMustMatch() }
  );

  ngOnInit(): void {
    // Dohvata ID korisnika iz URL parametara
    this.router.paramMap.subscribe((params) => {
      this.id = String(params.get('id') ?? ''); // Čita ID iz URL-a
    });
  }

  // Metoda za otvaranje dijaloga za potvrdu akcije
  async openConfirmationDialog(): Promise<void> {
    this.clearMessages();

    if (this.form.invalid) {
      this.errorMessage = 'Forma nije validna. Proverite unesene podatke.';
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationComponent); // Otvara dijalog

    try {
      // Čeka da se dijalog zatvori i dobija rezultat
      const result = await dialogRef.afterClosed().toPromise();

      if (result) {
        await this.changePass(); // Ako je potvrđeno, poziva funkciju za promenu lozinke
      }
    } catch (error) {
      this.errorMessage = 'Došlo je do greške prilikom potvrde.';
    }
  }

  // Getteri za pristup form kontrolama
  get oldPassword() {
    return this.form.get('oldPassword');
  }
  get newPassword() {
    return this.form.get('newPassword');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  // Metoda za promenu lozinke korisnika
  async changePass(): Promise<void> {
    this.clearMessages(); // Briše prethodne poruke

    try {
      // Kreira DTO objekat sa podacima za promenu lozinke
      const d: Pass = {
        CurrentPassword: this.oldPassword?.value ?? '',
        NewPassword: this.newPassword?.value ?? '',
        ConfirmNewPassword: this.confirmPassword?.value ?? '',
      };

      // Poziva servis za promenu lozinke i čeka da se završi
      const response = await this.userService
        .changePassword(this.id, d)
        .toPromise();

      if (response && response.message === 'Password changed successfully') {
        this.successMessage = 'Lozinka je uspešno promenjena.';
        this.resetForm();
      } else {
        this.errorMessage = 'Došlo je do greške. Pokušajte ponovo.';
        this.resetForm();
      }
    } catch (error: any) {
      this.errorMessage =
        error.error?.message || 'Došlo je do greške. Pokušajte ponovo.';
      this.resetForm();
    }
  }

  resetForm(): void {
    // Resetuj svako polje pojedinačno
    this.oldPassword?.setValue('');
    this.oldPassword?.markAsPristine();
    this.oldPassword?.markAsUntouched();

    this.newPassword?.setValue('');
    this.newPassword?.markAsPristine();
    this.newPassword?.markAsUntouched();

    this.confirmPassword?.setValue('');
    this.confirmPassword?.markAsPristine();
    this.confirmPassword?.markAsUntouched();

    // Ažuriraj validaciju
    this.form.updateValueAndValidity();
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
