import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-aprove',
  templateUrl: './user-aprove.component.html',
  styleUrls: ['./user-aprove.component.css'],
})
export class UserAproveComponent implements OnInit {
  users: any[] = []; // Svi korisnici za odobravanje
  filteredUsers: any[] = []; // Filtrirani korisnici
  displayedColumns: string[] = [
    'ime',
    'prezime',
    'email',
    'uloga',
    'dugme1',
    'dugme2',
  ];
  selectedRole: string = 'svi'; // Izabrana uloga za filtriranje
  successMessage: string = ''; // Poruka za uspešne akcije
  errorMessage: string = ''; // Poruka za greške

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  // Dohvatanje korisnika iz servisa
  fetchUsers(): void {
    this.userService.getPendingApproval().subscribe(
      (response: any) => {
        this.users = response;
        this.filteredUsers = [...this.users]; // Kopiranje svih korisnika u filtrirani niz
      },
      (error) => {
        this.errorMessage = 'Došlo je do greške prilikom učitavanja korisnika.';
        console.error(error);
      }
    );
  }

  // Filtriranje korisnika prema ulozi
  filterUsers(): void {
    if (this.selectedRole === 'svi') {
      this.filteredUsers = [...this.users];
    } else {
      const roleNumber = parseInt(this.selectedRole, 10);
      this.filteredUsers = this.users.filter(
        (user) => user.role === roleNumber
      );
    }
  }

  // Odobravanje korisnika
  approveUser(id: string): void {
    this.userService.approve(id).subscribe(
      () => {
        this.successMessage = 'Korisnik je uspešno odobren.';
        this.resetFilters(); // Resetuj filtere
        this.fetchUsers(); // Osvežavanje liste
      },
      (error) => {
        this.errorMessage =
          'Došlo je do greške prilikom odobravanja korisnika.';
        console.error(error);
      }
    );
  }

  // Odbijanje korisnika
  rejectUser(id: string): void {
    this.userService.reject(id).subscribe(
      () => {
        this.successMessage = 'Korisnik je uspešno odbijen.';
        this.resetFilters(); // Resetuj filtere
        this.fetchUsers(); // Osvežavanje liste
      },
      (error) => {
        this.errorMessage = 'Došlo je do greške prilikom odbijanja korisnika.';
        console.error(error);
      }
    );
  }

  // Resetovanje filtera
  resetFilters(): void {
    this.selectedRole = 'svi'; // Resetuj izabranu ulogu na 'svi'
    this.filteredUsers = [...this.users]; // Prikaži sve korisnike
  }
}
