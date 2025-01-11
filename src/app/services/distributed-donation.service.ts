import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../env';

@Injectable({
  providedIn: 'root',
})
export class DistributedDonationService {
  private url = `${env.url}/DistributedDonation`;

  constructor(private http: HttpClient) {}

  createDistributedDonation(
    dto: CreateDistributedDonationDto
  ): Observable<any> {
    return this.http.post(`${this.url}/create`, dto);
  }

  getDistributedDonationById(id: number): Observable<any> {
    return this.http.get(`${this.url}/get-by-id/${id}`);
  }

  getAllDistributedDonations(): Observable<any> {
    return this.http.get(`${this.url}/all`);
  }

  deleteDistributedDonation(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }
}

export interface CreateDistributedDonationDto {
  donationId: number;
  recipientId: string;
  dateDistributed: string;
  value: number;
}
