import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DistributedDonationService } from 'src/app/services/distributed-donation.service';
import { ReceiptDialogComponent } from 'src/app/dialog/receipt-dialog/receipt-dialog.component';
import { ThankYouNoteDialogComponent } from 'src/app/dialog/thank-you-note-dialog/thank-you-note-dialog.component';

@Component({
  selector: 'app-received-donations',
  templateUrl: './received-donations.component.html',
  styleUrls: ['./received-donations.component.css'],
})
export class ReceivedDonationsComponent implements OnInit {
  donations: any[] = [];
  errorMessage: string = ''; // Poruka greške
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
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.userId = user.id;
        this.fetchDonations();
      } catch (err) {
        console.error('Greška prilikom parsiranja korisnika:', err);
        this.errorMessage =
          'Došlo je do greške prilikom učitavanja zahvalnica.';
      }
    }
  }

  fetchDonations(): void {
    this.distributedDonationService.getAllDistributedDonations().subscribe(
      (data: any[]) => {
        // Prikazujemo samo donacije sa potpisom
        this.donations = data.filter(
          (donation: any) =>
            donation.recipientId === this.userId &&
            donation.receipt &&
            donation.receipt.signature !== 'Nema potpisa'
        );
        if (this.donations.length === 0) {
          this.errorMessage = 'Trenutno nema primljenih donacija za prikaz.';
        } else {
          this.errorMessage = '';
        }
      },
      (error) => {
        console.error('Greška prilikom učitavanja donacija:', error);
        this.errorMessage = 'Došlo je do greške prilikom učitavanja donacija.';
      }
    );
  }

  viewDetails(receiptId: number): void {
    this.dialog.open(ReceiptDialogComponent, {
      data: { receiptId },
    });
  }

  sendThankYouNote(donorId: string): void {
    this.dialog.open(ThankYouNoteDialogComponent, {
      data: { donorId, senderId: this.userId },
    });
  }

  translateCategory(category: string): string {
    return this.categoryTranslations[category] || category;
  }
}
