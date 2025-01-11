import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './forms/login/login.component';
import { RegisterComponent } from './forms/register/register.component';
import { UsersComponent } from './pages/users/users.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { UserAproveComponent } from './pages/user-aprove/user-aprove.component';
import { EditProfileComponent } from './forms/edit-profile/edit-profile.component';
import { ChangepwComponent } from './forms/changepw/changepw.component';
import { AddDonationComponent } from './forms/add-donation/add-donation.component';
import { DonationsComponent } from './pages/donations/donations.component';
import { DistributedDonationComponent } from './pages/distributed-donation/distributed-donation.component';
import { ThankYouNotesComponent } from './pages/thank-you-notes/thank-you-notes.component';
import { ReceivedDonationsComponent } from './pages/received-donations/received-donations.component';
import { EligibleRecipientsComponent } from './pages/eligible-recipients/eligible-recipients.component';
import { UnconfirmedDonationsComponent } from './pages/unconfirmed-donations/unconfirmed-donations.component';

import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'list-of-users',
    component: UsersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRole: 3 }, // Samo admin
  },
  {
    path: 'user/:id',
    component: UserDetailsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRole: 3 }, // Samo admin
  },
  {
    path: 'approve',
    component: UserAproveComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRole: 3 }, // Samo admin
  },
  {
    path: 'edit-profile/:id',
    component: EditProfileComponent,
    canActivate: [AuthGuard], // Bilo koji prijavljeni korisnik
  },
  {
    path: 'changepw/:id',
    component: ChangepwComponent,
    canActivate: [AuthGuard], // Bilo koji prijavljeni korisnik
  },
  {
    path: 'add-donation',
    component: AddDonationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRole: 0 }, // Samo donator
  },
  {
    path: 'donations',
    component: DonationsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRole: [0, 2, 3] }, // Admin, kurir, donator
  },
  {
    path: 'distributed-donations/:id',
    component: DistributedDonationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRole: [0, 3] }, // Admin i donator
  },
  {
    path: 'thank-you-notes',
    component: ThankYouNotesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRole: 0 }, // Samo donator
  },
  {
    path: 'received-donations',
    component: ReceivedDonationsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRole: 1 }, // Samo primalac
  },
  {
    path: 'eligible-recipients/:category',
    component: EligibleRecipientsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRole: 2 }, // Samo kurir
  },
  {
    path: 'unconfirmed-donations',
    component: UnconfirmedDonationsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRole: 1 }, // Samo primalac
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
