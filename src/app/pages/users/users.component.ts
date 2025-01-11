import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  users: any[] = []; // Svi korisnici
  filteredUsers: any[] = []; // Filtrirani korisnici
  roleFilter: string = ''; // Uloga za filtriranje
  searchQuery: string = ''; // Pretraga po imenu ili prezimenu

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res.filter(
          (user: any) => user.isActive && [0, 1, 2].includes(user.role)
        );
        this.filteredUsers = [...this.users]; // Inicijalno svi korisnici su prikazani
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Metoda za otvaranje informacija o korisniku
  openInfo(id: number) {
    this.router.navigate([`/user/${id}`]);
  }

  // Metoda za filtriranje korisnika
  applyFilters() {
    this.filteredUsers = this.users.filter((user) => {
      const matchesRole =
        this.roleFilter === '' || user.role === Number(this.roleFilter);
      const matchesSearch =
        this.searchQuery === '' ||
        user.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesRole && matchesSearch;
    });
  }
}
