// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { environnement } from '../environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl = environnement.backendCatalogue;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', jwtToken || '');

    return this.http.get<Product[]>(this.productUrl, { headers });
  }
}
