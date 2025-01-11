import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { FooterComponent } from './baselayout/footer/footer.component';
import { HeaderComponent } from './baselayout/header/header.component';
import { NavigationComponent } from './baselayout/navigation/navigation.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { LoginComponent } from './forms/login/login.component';
import { RegisterComponent } from './forms/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { UserAproveComponent } from './pages/user-aprove/user-aprove.component';
import { EditProfileComponent } from './forms/edit-profile/edit-profile.component';
import { ChangepwComponent } from './forms/changepw/changepw.component';
import { AddDonationComponent } from './forms/add-donation/add-donation.component';
import { DonationsComponent } from './pages/donations/donations.component';
import { DistributedDonationComponent } from './pages/distributed-donation/distributed-donation.component';
import { ThankYouNotesComponent } from './pages/thank-you-notes/thank-you-notes.component';
import { CategorySelectionDialogComponent } from './dialog/category-selection-dialog/category-selection-dialog.component';
import { ReceivedDonationsComponent } from './pages/received-donations/received-donations.component';
import { ReceiptDialogComponent } from './dialog/receipt-dialog/receipt-dialog.component';
import { ThankYouNoteDialogComponent } from './dialog/thank-you-note-dialog/thank-you-note-dialog.component';
import { DonationValueDialogComponent } from './dialog/donation-value-dialog/donation-value-dialog.component';
import { EligibleRecipientsComponent } from './pages/eligible-recipients/eligible-recipients.component';
import { UnconfirmedDonationsComponent } from './pages/unconfirmed-donations/unconfirmed-donations.component';

export function getSrPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Stavki po stranici:';
  paginatorIntl.nextPageLabel = 'Sledeća stranica';
  paginatorIntl.previousPageLabel = 'Prethodna stranica';
  paginatorIntl.firstPageLabel = 'Prva stranica';
  paginatorIntl.lastPageLabel = 'Poslednja stranica';
  paginatorIntl.getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ) => {
    if (length === 0 || pageSize === 0) {
      return `0 od ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} – ${endIndex} od ${length}`;
  };
  return paginatorIntl;
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    ConfirmationComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UsersComponent,
    UserDetailsComponent,
    UserAproveComponent,
    EditProfileComponent,
    ChangepwComponent,
    AddDonationComponent,
    DonationsComponent,
    DistributedDonationComponent,
    ThankYouNotesComponent,
    ReceivedDonationsComponent,
    ReceiptDialogComponent,
    ThankYouNoteDialogComponent,
    CategorySelectionDialogComponent,
    DonationValueDialogComponent,
    EligibleRecipientsComponent,
    UnconfirmedDonationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useValue: getSrPaginatorIntl() }],
  bootstrap: [AppComponent],
})
export class AppModule {}
