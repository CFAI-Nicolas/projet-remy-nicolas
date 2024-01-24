import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnexionService } from './connexion.service';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

  connexionForm!: FormGroup;
  showSuccessAlert: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private connexionService: ConnexionService
  ) {}

  ngOnInit() {
    this.initForm();

    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['registered'] === 'success') {
        this.showSuccessAlert = true;
      }
    });
  }

  initForm() {
    this.connexionForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.connexionForm.valid) {
      const formData = this.connexionForm.value;
  
      this.connexionService.connexionUtilisateur(formData)
        .subscribe(
          (response: HttpResponse<any>) => {
            const jwt = response.headers.get('Authorization');
            if (jwt) {
              localStorage.setItem('jwtToken', jwt);
              console.log('Token JWT stocké:', jwt);
              // Redirection vers /catalogue
              console.log('Redirection vers /catalogue');
              this.router.navigate(['/catalogue'], { queryParams: { registered: 'success' } });
            } else {
              console.log('Pas de JWT dans la réponse, redirection annulée');
            }
          },
          error => {
            console.error('Erreur lors de la connexion:', error);
            this.handleErrorResponse(error);
          }
        );
    } else {
      this.errorMessage = 'Votre formulaire de connexion est invalide';
    }
  }
  
  
  
  private handleErrorResponse(error: any) {
    if (error.status) {
      console.error('Statut de l\'erreur:', error.status);
      if (error.status === 401) {
        this.errorMessage = 'Identifiants incorrects';
      } else if (error.status === 400) {
        this.errorMessage = 'Votre saisie est invalide';
      }
    }
  }
}  