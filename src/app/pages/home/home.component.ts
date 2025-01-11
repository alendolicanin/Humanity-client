import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/images/home-app.png',
    'assets/images/home-app2.jpg',
    'assets/images/home-app3.jpeg',
  ];

  // Indeks trenutno prikazane slike
  currentImageIndex = 0;

  // Promenljiva za čuvanje identifikatora intervala koji kontroliše rotaciju slika
  private intervalId?: number;

  // Lifecycle metoda koja se poziva kada se komponenta inicijalizuje
  ngOnInit(): void {
    this.startImageRotation(); // Pokreće smenjivanje slika kada se komponenta učita
  }

  // Lifecycle metoda koja se poziva kada se komponenta uništava
  ngOnDestroy(): void {
    this.stopImageRotation(); // Zaustavlja smenjivanje slika kako bi se oslobodili resursi
  }

  // Privatna metoda koja pokreće rotaciju slika na svakih 3 sekunde
  private startImageRotation(): void {
    this.intervalId = window.setInterval(() => {
      // Ažurira trenutni indeks slike
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.images.length;
      // Kada dostigne kraj niza, vraća se na prvu sliku (kružna rotacija)
    }, 3000); // Interval u milisekundama
  }

  // Privatna metoda koja zaustavlja rotaciju slika
  private stopImageRotation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Briše interval kako bi se zaustavila rotacija
    }
  }
}
