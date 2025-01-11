import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent {
  // Konstruktor klase
  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    /**
     * `dialogRef`: Referenca na dijalog, omogućava kontrolu dijaloga
     * kao što su zatvaranje i emitovanje podataka nazad komponenti koja ga je otvorila.
     */

    @Inject(MAT_DIALOG_DATA) public data: any
    /**
     * `data`: Podaci koji se prosleđuju iz komponente koja je otvorila dijalog.
     * Koristi se Angularov dekorator `@Inject` za dobijanje ovih podataka.
     * Može sadržati poruku, naslov, dodatne informacije itd.
     */
  ) {}

  // Metoda za potvrdu akcije
  onConfirm(): void {
    /**
     * `onConfirm` se poziva kada korisnik potvrdi akciju.
     * Zatvara dijalog i šalje vrednost `true` komponenti koja je otvorila dijalog.
     */
    this.dialogRef.close(true);
  }

  // Metoda za otkazivanje akcije
  onCancel(): void {
    /**
     * `onCancel` se poziva kada korisnik otkaže akciju.
     * Zatvara dijalog i šalje vrednost `false` komponenti koja je otvorila dijalog.
     */
    this.dialogRef.close(false);
  }
}
