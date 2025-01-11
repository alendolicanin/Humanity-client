import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from './email.validators';
import { CustomValidatorP } from './password.validators';
import { RegisterDto, UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  // Stanje komponente
  errorMessage: string = ''; // Poruka greške
  loading = false; // Promenljiva za praćenje stanja učitavanja (loading)

  constructor(private userService: UserService, private router: Router) {}

  form = new FormGroup(
    {
      // Definicija forme sa poljima i validatorima
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        CustomValidator.cannotContaintSpace,
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        CustomValidator.cannotContaintSpace,
      ]),
      city: new FormControl('', [Validators.required, Validators.minLength(2)]),
      age: new FormControl('', [
        Validators.required,
        Validators.min(18),
        Validators.max(65),
      ]),
      role: new FormControl('', Validators.required),
      isAnonymous: new FormControl(false),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        CustomValidator.cannotContaintSpace,
        CustomValidator.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        CustomValidatorP.cannotContaintSpace,
        CustomValidatorP.number,
        CustomValidatorP.specialCaracter,
        CustomValidatorP.upperCase,
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ]),
    },
    {
      validators: CustomValidatorP.passwordMismatch,
    }
  );

  // Getters za pristup kontrolama forme
  get Fname() {
    return this.form.get('firstName');
  }
  get Lname() {
    return this.form.get('lastName');
  }
  get City() {
    return this.form.get('city');
  }
  get Age() {
    return this.form.get('age');
  }
  get Role() {
    return this.form.get('role');
  }
  get IsAnonymous() {
    return this.form.get('isAnonymous');
  }
  get Email() {
    return this.form.get('email');
  }
  get Password() {
    return this.form.get('password');
  }
  get ConfirmPassword() {
    return this.form.get('confirmPassword');
  }

  register() {
    if (this.form.invalid) {
      // Prikaz poruke za nevalidnu formu
      this.errorMessage = 'Molimo unesite sve podatke ispravno.';
      return;
    }

    // Provera da li je forma validna
    const dto: RegisterDto = {
      // Kreiranje DTO objekta na osnovu unetih vrednosti
      firstName: this.Fname?.value ?? '',
      lastName: this.Lname?.value ?? '',
      city: this.City?.value ?? '',
      age: Number(this.Age?.value) ?? 18,
      role: Number(this.Role?.value),
      isAnonymous: this.IsAnonymous?.value ?? false,
      email: this.Email?.value ?? '',
      password: this.Password?.value ?? '',
    };

    this.loading = true; // Postavljanje loading na true tokom zahteva
    this.errorMessage = ''; // Resetovanje poruke greške

    this.userService.register(dto).subscribe({
      // Pozivanje servisa za registraciju
      next: (data: any) => {
        console.log('User registered successfully:', data);
        this.router.navigate(['/login'], {
          // Navigacija na login stranicu
          queryParams: { registered: 'success' },
        });
        this.loading = false;
      },
      error: (error: any) => {
        // Prikazivanje greške sa servera
        this.errorMessage =
          error.error?.message || 'Došlo je do greške. Pokušajte ponovo.';
        this.loading = false;
      },
    });
  }

  get isDonor() {
    return this.form.get('role')?.value === '0'; // Assuming '0' is the value for Donor
  }
}
