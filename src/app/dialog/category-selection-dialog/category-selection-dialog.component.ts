import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-category-selection-dialog',
  templateUrl: './category-selection-dialog.component.html',
  styleUrls: ['./category-selection-dialog.component.css'],
})
export class CategorySelectionDialogComponent {
  categories = [
    { id: 0, name: 'Hrana' },
    { id: 1, name: 'Odeća' },
    { id: 2, name: 'Obuća' },
    { id: 3, name: 'Novac' },
  ];
  selectedCategories: number[] = []; // Lista izabranih kategorija

  constructor(
    public dialogRef: MatDialogRef<CategorySelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  toggleCategory(categoryId: number) {
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories = this.selectedCategories.filter(
        (id) => id !== categoryId
      );
    } else {
      this.selectedCategories.push(categoryId);
    }
  }

  save() {
    this.dialogRef.close(this.selectedCategories); // Vraća izabrane kategorije
  }

  close() {
    this.dialogRef.close(null); // Zatvara bez promene
  }
}
