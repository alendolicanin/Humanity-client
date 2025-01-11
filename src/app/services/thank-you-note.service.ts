import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../env';

@Injectable({
  providedIn: 'root',
})
export class ThankYouNoteService {
  private url = `${env.url}/ThankYouNote`;

  constructor(private http: HttpClient) {}

  createThankYouNote(dto: CreateThankYouNoteDto): Observable<any> {
    return this.http.post(`${this.url}/create`, dto);
  }

  getThankYouNoteById(id: number): Observable<any> {
    return this.http.get(`${this.url}/get-by-id/${id}`);
  }

  getAllThankYouNotes(): Observable<any> {
    return this.http.get(`${this.url}/all`);
  }

  updateThankYouNote(id: number, dto: UpdateThankYouNoteDto): Observable<any> {
    return this.http.put(`${this.url}/update/${id}`, dto);
  }

  deleteThankYouNote(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }
}

export interface CreateThankYouNoteDto {
  senderId: string;
  donorId: string;
  message: string;
  rating: number;
}

export interface UpdateThankYouNoteDto {
  message: string;
  rating: number;
}
