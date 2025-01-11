import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../env';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private url = `${env.url}/Receipt`;

  constructor(private http: HttpClient) {}

  getReceiptById(id: number): Observable<any> {
    return this.http.get(`${this.url}/get-by-id/${id}`);
  }

  getAllReceipts(): Observable<any> {
    return this.http.get(`${this.url}/all`);
  }

  confirmSignature(receiptId: number, recipientId: string): Observable<any> {
    const params = new HttpParams()
      .set('receiptId', receiptId.toString())
      .set('recipientId', recipientId);

    return this.http.post(`${this.url}/confirm-signature`, null, { params });
  }

  deleteReceipt(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }
}
