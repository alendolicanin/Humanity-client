import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../env';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private url = `${env.url}/Donation`;

  constructor(private http: HttpClient) {}

  createDonation(dto: CreateDonationDto): Observable<any> {
    return this.http.post(`${this.url}/create`, dto);
  }

  getDonationById(id: number): Observable<any> {
    return this.http.get(`${this.url}/get-by-id/${id}`);
  }

  getAllDonations(queryDto?: DonationQueryDto): Observable<any> {
    let params = new HttpParams();

    if (queryDto) {
      params = this.appendParams(params, queryDto);
    }

    return this.http.get(`${this.url}/all`, { params });
  }

  updateDonation(id: number, dto: UpdateDonationDto): Observable<any> {
    return this.http.put(`${this.url}/update/${id}`, dto);
  }

  deleteDonation(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }

  private appendParams(
    params: HttpParams,
    queryDto: DonationQueryDto
  ): HttpParams {
    Object.keys(queryDto).forEach((key) => {
      const value = queryDto[key];
      if (value != null) {
        params = params.append(key, value.toString());
      }
    });
    return params;
  }
}

export interface CreateDonationDto {
  donorId: string;
  value: number;
  category: DonationCategory;
}

export interface UpdateDonationDto {
  value: number;
  category: DonationCategory;
}

export interface DonationQueryDto {
  [key: string]: any;
  sortBy?: string;
  isSortAscending?: boolean;
  page?: number;
  pageSize?: number;
  dateReceived?: string;
  category?: DonationCategory;
  donorName?: string;
}

export enum DonationCategory {
  Food = 0,
  Clothing = 1,
  Footwear = 2,
  Money = 3,
}
