import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../environnement/environnement'

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  private inscriptionUrl = environnement.backendCreateUser;

  constructor(private http: HttpClient) { }

  creerUtilisateur(formData: any): Observable<any> {
    return this.http.post(this.inscriptionUrl, formData);
  }
}
