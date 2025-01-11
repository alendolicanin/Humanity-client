import { Component, OnInit } from '@angular/core';
import { ThankYouNoteService } from 'src/app/services/thank-you-note.service';

@Component({
  selector: 'app-thank-you-notes',
  templateUrl: './thank-you-notes.component.html',
  styleUrls: ['./thank-you-notes.component.css'],
})
export class ThankYouNotesComponent implements OnInit {
  thankYouNotes: any[] = []; // Lista zahvalnica
  errorMessage: string = ''; // Poruka greške
  userId: string = ''; // ID trenutnog korisnika (donatora)

  constructor(private thankYouNoteService: ThankYouNoteService) {}

  ngOnInit(): void {
    // Dohvatanje trenutnog korisnika iz localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.userId = user.id; // Pretpostavlja se da `user` ima polje `id`
        this.loadThankYouNotes();
      } catch (err) {
        console.error('Greška prilikom parsiranja korisnika:', err);
        this.errorMessage =
          'Došlo je do greške prilikom učitavanja zahvalnica.';
      }
    }
  }

  // Učitavanje zahvalnica za trenutnog donatora
  loadThankYouNotes(): void {
    this.thankYouNoteService.getAllThankYouNotes().subscribe(
      (response: any[]) => {
        // Filtriranje zahvalnica za trenutnog donatora
        this.thankYouNotes = response.filter(
          (note) => note.donorId === this.userId
        );
        if (this.thankYouNotes.length === 0) {
          this.errorMessage = 'Trenutno nema zahvalnica za prikaz.';
        } else {
          this.errorMessage = '';
        }
      },
      (error) => {
        console.error('Greška prilikom učitavanja zahvalnica:', error);
        this.errorMessage =
          'Došlo je do greške prilikom učitavanja zahvalnica.';
      }
    );
  }

  getRatingColor(rating: number): string {
    if (rating <= 3) {
      return '#ff6347'; // Crvena za niske ocene
    } else if (rating <= 7) {
      return '#ffd700'; // Žuta za srednje ocene
    } else {
      return '#28a745'; // Zelena za visoke ocene
    }
  }
}
