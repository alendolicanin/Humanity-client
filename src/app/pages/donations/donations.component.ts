import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  DonationService,
  DonationQueryDto,
  DonationCategory,
} from 'src/app/services/donation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css'],
})
export class DonationsComponent implements OnInit {
  donations: any[] = []; // Svi podaci
  paginatedDonations: any[] = []; // Podaci za trenutnu stranicu
  sortBy: string = 'DateReceived'; // Podrazumevano sortiranje
  isSortAscending: boolean = true; // Da li je sortiranje rastuće
  searchDate: string = ''; // Pretraga po datumu prijema
  donorName: string = ''; // Pretraga po imenu ili prezimenu donatora
  selectedCategory: DonationCategory | null = null; // Pretraga po kategoriji
  page: number = 1; // Trenutna stranica
  pageSize: number = 6; // Broj stavki po stranici
  totalItems: number = 0; // Ukupan broj stavki
  role: number = 0; // Rola korisnika
  userId: string = ''; // ID trenutnog korisnika

  // Mapa kategorija
  categoryMap: { [key: number]: string } = {
    0: 'Hrana',
    1: 'Odeća',
    2: 'Obuća',
    3: 'Novac',
  };

  constructor(
    private donationService: DonationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.role = user.role;
        this.userId = user.id;
        this.loadDonations(); // Učitavanje donacija
      } catch (err) {
        console.error('Greška prilikom parsiranja korisnika:', err);
      }
    } else {
      console.error('Korisnički podaci nisu pronađeni.');
    }
  }

  // Učitavanje donacija sa odgovarajućim filtrima
  loadDonations(): void {
    const query: DonationQueryDto = {
      sortBy: this.sortBy,
      isSortAscending: this.isSortAscending,
      dateReceived: this.searchDate || undefined,
      category:
        this.selectedCategory !== null ? this.selectedCategory : undefined,
      donorName:
        this.role === 3 || this.role === 2 ? this.donorName.trim() : undefined,
    };

    this.donationService.getAllDonations(query).subscribe(
      (response) => {
        // Filtriranje donacija na osnovu korisničkog ID-a
        if (this.role === 2) {
          // Kurir
          this.donations = response.filter(
            (donation: any) => donation.value > 0
          );
        } else if (this.role === 0) {
          // Donator
          this.donations = response.filter(
            (donation: any) => donation.donorId === this.userId
          );
        } else {
          this.donations = response; // Admin vidi sve donacije
        }

        this.totalItems = this.donations.length;
        this.updatePaginatedDonations();
      },
      (err) => {
        console.error('Greška prilikom učitavanja donacija:', err);
      }
    );
  }

  // Ažuriranje paginacije
  updatePaginatedDonations(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedDonations = this.donations.slice(startIndex, endIndex);
  }

  // Primena filtera
  applyFilters(): void {
    this.page = 1; // Resetovanje na prvu stranicu
    this.loadDonations();
  }

  // Promena stranice
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1; // mat-paginator koristi 0-indeksne stranice
    this.pageSize = event.pageSize;
    this.loadDonations();
  }

  // Navigacija za kreiranje donacija
  navigateToCreateDonation(): void {
    this.router.navigate(['/add-donation']);
  }

  // Dobavljanje naziva kategorije
  getCategoryText(category: number): string {
    return this.categoryMap[category] || 'Nepoznata kategorija';
  }

  // Detalji o distribucijama donacije
  viewDistributedDonations(donationId: number): void {
    this.router.navigate(['/distributed-donations', donationId]);
  }

  // Detalji o primaocima koji su se prijavili za određenu kategoriju donacije
  viewEligibleRecipients(donation: any): void {
    this.router.navigate(['/eligible-recipients', donation.category], {
      queryParams: {
        donationId: donation.id,
        donationValue: donation.value,
      },
    });
  }

  // Metoda za dobijanje statusa
  getDonationStatusClass(donation: any): string {
    if (donation.value === 0) {
      return 'badge-danger'; // Nova klasa za donaciju sa vrednošću 0
    }
    return donation.isDistributed ? 'badge-success' : 'badge-warning';
  }
}
