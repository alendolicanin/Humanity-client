import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  user: any = []; // Čuva podatke o trenutno prijavljenom korisniku
  public currentUserSubscription!: Subscription;
  // Pretplata na tok podataka o korisniku. Koristi se za otkazivanje pretplate kako bi se sprečilo curenje memorije
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  ); // Privatni BehaviorSubject koji emituje trenutnog korisnika i omogućava drugim delovima aplikacije da prate promene korisnika

  constructor(
    public userService: UserService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userJSON = localStorage.getItem('user'); // Proverava da li postoji zapis korisnika u localStorage
    if (userJSON) {
      // Ako postoji, parsira ga iz JSON formata i smešta u user
      this.user = JSON.parse(userJSON);
      this.userService.setCurrentUser(this.user);
      this.currentUserSubject.next(this.user);
    }

    // Pretplaćuje se na getCurrentUser iz UserService, koji vraća Observable
    // Kada se emituje novi korisnik, ažurira lokalnu promenljivu user i koristi cdr.detectChanges() kako bi Angular osvežio prikaz
    this.currentUserSubscription = this.userService
      .getCurrentUser()
      .subscribe((user) => {
        this.user = user;
        this.cdr.detectChanges();
      });

    // Pretplati se na događaj osvežavanja korisničkih podataka
    this.userService.userUpdated.subscribe(() => {
      this.refreshUserData(); // Osvežava podatke kada se događaj emitira
    });
  }

  refreshUserData(): void {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      this.user = JSON.parse(userJSON); // Parsiraj korisnika iz localStorage
      this.cdr.detectChanges(); // Ručno osveži prikaz
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate([`/`]);
  }
  openInfo(id: number) {
    this.router.navigate([`/edit-profile/${id}`]);
  }
  ChangePassword(id: number) {
    this.router.navigate([`/changepw/${id}`]);
  }
}
