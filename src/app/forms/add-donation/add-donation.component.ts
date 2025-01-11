import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  DonationService,
  CreateDonationDto,
} from 'src/app/services/donation.service';

@Component({
  selector: 'app-add-donation',
  templateUrl: './add-donation.component.html',
  styleUrls: ['./add-donation.component.css'],
})
export class AddDonationComponent implements OnInit {
  donationForm: FormGroup;
  userId: string = ''; // ID donora
  successMessage: string = ''; // Poruka o uspehu
  errorMessage: string = ''; // Poruka o grešci

  constructor(private donationService: DonationService) {
    this.donationForm = new FormGroup({
      value: new FormControl('', [Validators.required, Validators.min(1)]), // Vrednost donacije
      category: new FormControl('', [Validators.required]), // Kategorija donacije
    });
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('user'); // Dohvati string iz localStorage
    if (userString) {
      try {
        const user = JSON.parse(userString); // Konvertuj string u objekat
        this.userId = user.id; // Postavi ID korisnika iz objekta
        console.log(`Korisnički ID: ${this.userId}`);
      } catch (err) {
        console.error(
          'Greška prilikom parsiranja korisnika iz localStorage:',
          err
        );
      }
    } else {
      console.error('Korisnički podaci nisu pronađeni u localStorage.');
    }
  }

  createDonation(): void {
    // Resetovanje poruka
    this.successMessage = '';
    this.errorMessage = '';

    if (this.donationForm.invalid) {
      this.errorMessage = 'Forma nije validna. Proverite unesene podatke.';
      return;
    }

    const donationDto: CreateDonationDto = {
      donorId: this.userId,
      value: this.donationForm.value.value,
      category: Number(this.donationForm.value.category), // Pretvara u broj
    };

    this.donationService.createDonation(donationDto).subscribe({
      next: () => {
        this.successMessage = 'Donacija je uspešno kreirana.';
        this.donationForm.reset(); // Resetuje formu nakon uspešne kreacije
      },
      error: (error) => {
        console.error('Greška prilikom kreiranja donacije:', error);
        this.errorMessage = 'Došlo je do greške. Pokušajte ponovo.';
      },
    });
  }
}
