import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-receipt-dialog',
  templateUrl: './receipt-dialog.component.html',
  styleUrls: ['./receipt-dialog.component.css'],
})
export class ReceiptDialogComponent implements OnInit {
  receipt: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { receiptId: number },
    private receiptService: ReceiptService,
    private dialogRef: MatDialogRef<ReceiptDialogComponent>
  ) {}

  ngOnInit(): void {
    this.fetchReceipt();
  }

  fetchReceipt(): void {
    this.receiptService
      .getReceiptById(this.data.receiptId)
      .subscribe((data) => {
        this.receipt = data;
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
