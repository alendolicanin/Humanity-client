import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DistributedDonationService } from 'src/app/services/distributed-donation.service';
import { MatDialog } from '@angular/material/dialog';
import { ReceiptDialogComponent } from 'src/app/dialog/receipt-dialog/receipt-dialog.component';

@Component({
  selector: 'app-distributed-donation',
  templateUrl: './distributed-donation.component.html',
  styleUrls: ['./distributed-donation.component.css'],
})
export class DistributedDonationComponent implements OnInit {
  donationId!: number; // ID donacije
  distributedDonations: any[] = []; // Lista distribuiranih donacija
  errorMessage: string = ''; // Poruka greške
  isAdmin: boolean = false; // Da li je korisnik admin

  constructor(
    private route: ActivatedRoute,
    private distributedDonationService: DistributedDonationService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Dohvati ID donacije iz rute
    this.route.params.subscribe((params) => {
      this.donationId = +params['id'];
      this.loadDistributedDonations();
    });

    // Proveri da li je korisnik admin
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.isAdmin = user.role === 3; // Ako je role == 3, korisnik je admin
    }
  }

  // Učitaj distribuirane donacije za odabranu donaciju
  loadDistributedDonations(): void {
    this.distributedDonationService.getAllDistributedDonations().subscribe(
      (response) => {
        // Filtriraj distribucije za trenutnu donaciju
        this.distributedDonations = response.filter(
          (d: any) => d.donationId === this.donationId
        );
        if (this.distributedDonations.length === 0) {
          this.errorMessage = 'Trenutno nema distribucija za ovu donaciju.';
        }
      },
      (error) => {
        console.error(
          'Greška prilikom učitavanja distribuiranih donacija:',
          error
        );
        this.errorMessage =
          'Došlo je do greške prilikom učitavanja distribucija.';
      }
    );
  }

  // Funkcija za prikazivanje računa
  viewDetails(receiptId: number): void {
    this.dialog.open(ReceiptDialogComponent, {
      data: { receiptId },
    });
  }
}
