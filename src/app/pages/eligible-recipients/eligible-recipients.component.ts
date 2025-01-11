import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DistributedDonationService } from 'src/app/services/distributed-donation.service';
import { UserService } from 'src/app/services/user.service';
import { DonationValueDialogComponent } from 'src/app/dialog/donation-value-dialog/donation-value-dialog.component';

@Component({
  selector: 'app-eligible-recipients',
  templateUrl: './eligible-recipients.component.html',
  styleUrls: ['./eligible-recipients.component.css'],
})
export class EligibleRecipientsComponent implements OnInit {
  recipients: any[] = []; // Lista primalaca
  filteredRecipients: any[] = []; // Filterisani primaoci
  category: number = -1; // Kategorija donacije
  donationId: number = -1; // Dodajemo ID donacije
  donationValue: number = 0; // Dodajemo vrednost donacije
  successMessage: string = ''; // Poruka za uspešne akcije
  errorMessage: string = ''; // Poruka za greške
  searchQuery: string = ''; // Pretraga po imenu/prezimenu

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private distributedDonationService: DistributedDonationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.category = +params['category'];
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.donationId = +queryParams['donationId'];
      this.donationValue = +queryParams['donationValue'];
    });

    this.loadRecipients(); // Učitavanje primalaca
  }

  // Učitavanje primalaca koji odgovaraju kategoriji
  loadRecipients(): void {
    this.userService.getUsers().subscribe((users) => {
      // Filtriranje korisnika koji su primaoci i odgovaraju kategoriji
      this.recipients = users.filter(
        (user: any) =>
          user.role === 1 &&
          user.registeredCategories &&
          user.registeredCategories.includes(this.category)
      );
      this.filteredRecipients = this.recipients; // Podrazumevano svi primaoci
    });
  }

  // Primena pretrage
  applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredRecipients = this.recipients.filter(
      (recipient: any) =>
        recipient.firstName.toLowerCase().includes(query) ||
        recipient.lastName.toLowerCase().includes(query)
    );
  }

  openDonationValueDialog(recipient: any): void {
    const dialogRef = this.dialog.open(DonationValueDialogComponent, {
      data: {
        maxDonationValue: this.donationValue,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.value) {
        this.sendDonation(recipient, result.value);
      }
    });
  }

  sendDonation(recipient: any, value: number): void {
    const donationDto = {
      donationId: this.donationId, // Preuzeto iz rute
      recipientId: recipient.id,
      dateDistributed: new Date().toISOString(),
      value: value, // Uneta vrednost
    };

    this.distributedDonationService
      .createDistributedDonation(donationDto)
      .subscribe(
        (res) => {
          this.successMessage = 'Donacija uspešno poslata!';
          this.errorMessage = ''; // Resetujemo poruku o grešci
        },
        (err) => {
          this.errorMessage = 'Greška prilikom slanja donacije.';
          this.successMessage = ''; // Resetujemo poruku o uspehu
          console.error(err);
        }
      );
  }
}
