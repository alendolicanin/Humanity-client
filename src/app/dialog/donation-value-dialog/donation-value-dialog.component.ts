import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-donation-value-dialog',
  templateUrl: './donation-value-dialog.component.html',
  styleUrls: ['./donation-value-dialog.component.css'],
})
export class DonationValueDialogComponent {
  donationValue: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DonationValueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  isValid(): boolean {
    return (
      this.donationValue > 0 && this.donationValue <= this.data.maxDonationValue
    );
  }

  onConfirm(): void {
    this.dialogRef.close({ value: this.donationValue });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
