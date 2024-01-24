import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environnement } from '../environnement/environnement'
import { HttpClient, HttpResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ConnexionService {
  private inscriptionUrl = environnement.backendLoginClient;

  constructor(private http: HttpClient) { }

  connexionUtilisateur(formData: any): Observable<HttpResponse<any>> {
    return this.http.post(this.inscriptionUrl, formData, { observe: 'response' });
  }
}
