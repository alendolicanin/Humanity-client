import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateDto, UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent {
  user: any = {}; // Objekat koji čuva podatke o korisniku.
  id: string = ''; // ID korisnika preuzet iz URL parametra.
  imageData: string = ''; // Drži podatke o selektovanoj slici u Base64 formatu.
  error: boolean = false; // Indikator greške prilikom ažuriranja korisnika.
  success: boolean = false; // Indikator uspešnog ažuriranja korisnika.
  missingDataError: boolean = false; // Indikator da forma nije popunjena.
  image: string = ''; // URL slike korisnika.
  showAnonymous: boolean = false; // Kontrola za prikaz polja `isAnonymous`.

  categories: any[] = []; // Lista dostupnih kategorija
  selectedCategories: number[] = []; // Odabrane kategorije korisnika

  constructor(
    private router: ActivatedRoute,
    public UserService: UserService,
    public dialog: MatDialog,
    public Router: Router
  ) {}

  // Definicija reactive forme sa poljima.
  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    surname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    city: new FormControl('', [Validators.required, Validators.minLength(2)]),
    age: new FormControl('', [
      Validators.required,
      Validators.min(18),
      Validators.max(65),
    ]),
    isAnonymous: new FormControl(false),
    image: new FormControl(''),
  });

  ngOnInit(): void {
    // Dohvatanje ID-ja korisnika iz URL parametra.
    this.router.paramMap.subscribe((params) => {
      this.id = String(params.get('id') ?? ''); // Ako ID nije pronađen, postavlja prazan string.

      // Dohvatanje podataka o korisniku sa servera.
      this.UserService.getUserById(this.id).subscribe((data) => {
        this.user = data; // Čuvanje podataka o korisniku.
        this.image = this.user.image; // Čuvanje URL-a slike korisnika.
        console.log(this.user);

        // Prikaz `isAnonymous` samo za Donatora.
        this.showAnonymous = this.user.role === 0;

        // Proveri da li je korisnik primalac
        if (this.user.role === 1) {
          // Učitaj dostupne kategorije
          this.categories = [
            { id: 0, name: 'Hrana' },
            { id: 1, name: 'Odeća' },
            { id: 2, name: 'Obuća' },
            { id: 3, name: 'Novac' },
          ];

          // Postavi već odabrane kategorije ako postoje
          this.selectedCategories = this.user.registeredCategories || [];
        }

        // Popunjavanje forme dobijenim podacima.
        this.form.patchValue({
          name: this.user.firstName,
          surname: this.user.lastName,
          city: this.user.city,
          age: this.user.age,
          isAnonymous: this.user.isAnonymous,
        });
      });
    });
  }

  // Otvara dijalog za potvrdu brisanja korisnika.
  async openConfirmationDialog(): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationComponent); // Otvara dijalog za potvrdu.

    // Čeka da se dijalog zatvori i proverava rezultat.
    try {
      const result = await dialogRef.afterClosed().toPromise();
      if (result) {
        await this.deleteUser(); // Ako je potvrđeno, briše korisnika.
        localStorage.removeItem('token'); // Uklanja token iz localStorage-a.
        localStorage.removeItem('user'); // Uklanja podatke o korisniku iz localStorage-a.
        this.Router.navigate([`/`]); // Vraća korisnika na početnu stranicu.
      }
    } catch (error) {
      console.log(error); // Loguje grešku ako se desi problem.
    }
  }

  // Getter za pristup form kontrolama.
  get Name() {
    return this.form.get('name');
  }
  get Surname() {
    return this.form.get('surname');
  }
  get City() {
    return this.form.get('city');
  }
  get Age() {
    return this.form.get('age');
  }
  get isAnonymous() {
    return this.form.get('isAnonymous');
  }
  get Image() {
    return this.form.get('image');
  }

  // Obrada selektovane slike i konverzija u Base64 format.
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.imageData = reader.result as string; // Čuvanje slike u Base64 formatu.
    };
    reader.readAsDataURL(file);
  }

  // Konvertuje Base64 u Blob format (koristi se za slanje slike na server).
  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]); // Konvertuje Base64 u binarni string.
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // Dohvata MIME tip.
    const ab = new ArrayBuffer(byteString.length); // Kreira memorijski prostor za binarne podatke.
    const ia = new Uint8Array(ab); // Kreira niz bajtova.
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i); // Kopira podatke.
    }
    return new Blob([ab], { type: mimeString }); // Vraća Blob objekat.
  }

  // Dodaje ili uklanja kategorije iz selekcije
  toggleCategory(categoryId: number): void {
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories = this.selectedCategories.filter(
        (id) => id !== categoryId
      );
    } else {
      this.selectedCategories.push(categoryId);
    }
  }

  // Ažurira podatke o korisniku.
  async updateUser(): Promise<void> {
    if (this.form.invalid) {
      this.missingDataError = true; // Prikazuje grešku ako forma nije validna
      return;
    }

    try {
      this.error = false; // Reset greške
      this.success = false; // Reset uspeha
      this.missingDataError = false; // Resetuje grešku validacije

      const d: UpdateDto = {
        firstName: this.Name?.value ?? '',
        lastName: this.Surname?.value ?? '',
        city: this.City?.value ?? '',
        age: this.Age?.value ?? 0,
        isAnonymous: this.showAnonymous
          ? this.isAnonymous?.value ?? false
          : false, // Ako nije Donator, uvek je false
        image: this.imageData || this.user.image, // Koristi novu sliku ako je selektovana
        registeredCategories:
          this.user.role === 1 ? this.selectedCategories : undefined,
      };

      console.log('Podaci za ažuriranje:', d);

      // Poziva servis za ažuriranje korisnika
      await this.UserService.updateUser(this.id, d).toPromise();

      // Ažuriraj podatke u localStorage
      this.UserService.getUserById(this.id).subscribe((data) => {
        this.user = data; // Osvežava podatke o korisniku
        this.image = this.user.image; // Osvežava sliku korisnika
        this.showAnonymous = this.user.role === 0; // Prikaz `isAnonymous` samo za Donatora.
        this.selectedCategories = this.user.registeredCategories || [];
        this.form.patchValue({
          name: this.user.firstName,
          surname: this.user.lastName,
          city: this.user.city,
          age: this.user.age,
          isAnonymous: this.user.isAnonymous,
        });

        // Resetuj polje za unos slike
        this.form.get('image')?.reset();

        // Ažuriraj localStorage sa novim podacima
        localStorage.setItem('user', JSON.stringify(this.user));

        // Emituj događaj za osvežavanje navigacije
        this.UserService.userUpdated.emit();
      });

      this.success = true; // Postavlja indikator uspeha
    } catch (error) {
      console.error('Greška pri ažuriranju profila:', error);
      this.error = true; // Postavlja indikator greške
    }
  }

  // Briše korisnika sa servera.
  deleteUser() {
    this.UserService.deleteUser(this.id).subscribe((data) => {
      localStorage.removeItem('user'); // Uklanja podatke o korisniku iz localStorage-a.
      localStorage.removeItem('token'); // Uklanja token iz localStorage-a.
      this.Router.navigate(['']); // Navigira na početnu stranicu.
    });
  }
}
