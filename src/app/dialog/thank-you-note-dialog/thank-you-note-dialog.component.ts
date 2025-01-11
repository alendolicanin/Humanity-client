import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ThankYouNoteService,
  CreateThankYouNoteDto,
} from 'src/app/services/thank-you-note.service';

@Component({
  selector: 'app-thank-you-note-dialog',
  templateUrl: './thank-you-note-dialog.component.html',
  styleUrls: ['./thank-you-note-dialog.component.css'],
})
export class ThankYouNoteDialogComponent {
  thankYouForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private dialogRef: MatDialogRef<ThankYouNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { donorId: string; senderId: string },
    private fb: FormBuilder,
    private thankYouNoteService: ThankYouNoteService
  ) {
    this.thankYouForm = this.fb.group({
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      rating: [
        null,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitThankYouNote(): void {
    if (this.thankYouForm.invalid) return;

    const thankYouNote: CreateThankYouNoteDto = {
      senderId: this.data.senderId,
      donorId: this.data.donorId,
      ...this.thankYouForm.value,
    };

    this.thankYouNoteService.createThankYouNote(thankYouNote).subscribe(
      () => {
        this.successMessage = 'Zahvalnica je uspešno poslata!';
        this.errorMessage = '';
        setTimeout(() => this.closeDialog(), 2000);
      },
      (error) => {
        console.error('Greška prilikom slanja zahvalnice:', error);
        this.successMessage = '';
        this.errorMessage =
          'Došlo je do greške prilikom slanja zahvalnice. Pokušajte ponovo.';
      }
    );
  }
}
