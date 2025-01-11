import { Component, OnInit } from '@angular/core';
import { DistributedDonationService } from 'src/app/services/distributed-donation.service';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-unconfirmed-donations',
  templateUrl: './unconfirmed-donations.component.html',
  styleUrls: ['./unconfirmed-donations.component.css'],
})
export class UnconfirmedDonationsComponent implements OnInit {
  unconfirmedDonations: any[] = [];
  errorMessage: string = ''; // Poruka greške
  successMessage: string = ''; // Poruka uspeha
  userId: string = ''; // ID trenutnog korisnika

  // Mapa za prevod kategorija
  categoryTranslations: { [key: string]: string } = {
    Food: 'Hrana',
    Clothing: 'Odeća',
    Footwear: 'Obuća',
    Money: 'Novac',
  };

  constructor(
    private distributedDonationService: DistributedDonationService,
    private receiptService: ReceiptService
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.userId = user.id;
        this.fetchUnconfirmedDonations();
      } catch (err) {
        console.error('Greška prilikom parsiranja korisnika:', err);
        this.errorMessage =
          'Došlo je do greške prilikom učitavanja nepotvrđenih donacija.';
      }
    }
  }

  fetchUnconfirmedDonations(): void {
    this.distributedDonationService.getAllDistributedDonations().subscribe(
      (donations: any[]) => {
        this.unconfirmedDonations = donations.filter(
          (donation) =>
            donation.recipientId === this.userId &&
            donation.receipt &&
            donation.receipt.signature === 'Nema potpisa'
        );
        if (this.unconfirmedDonations.length === 0) {
          this.errorMessage = 'Trenutno nema nepotvrđenih donacija za prikaz.';
        } else {
          this.errorMessage = '';
        }
      },
      (err) => {
        console.error('Greška prilikom učitavanja nepotvrđenih donacija:', err);
        this.errorMessage =
          'Došlo je do greške prilikom učitavanja nepotvrđenih donacija.';
      }
    );
  }

  confirmDonation(receiptId: number): void {
    this.receiptService.confirmSignature(receiptId, this.userId).subscribe(
      () => {
        this.successMessage = 'Donacija je uspešno potvrđena.';
        this.errorMessage = ''; // Resetujemo grešku ako postoji
        this.fetchUnconfirmedDonations(); // Osvježavanje liste nakon potvrde
      },
      (err) => {
        console.error('Greška prilikom potvrde donacije:', err);
        this.errorMessage = 'Došlo je do greške prilikom potvrde donacije.';
        this.successMessage = ''; // Resetujemo uspešnu poruku ako postoji
      }
    );
  }

  translateCategory(category: string): string {
    return this.categoryTranslations[category] || category;
  }
}
