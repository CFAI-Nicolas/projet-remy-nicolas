import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InscriptionService } from './inscription.service'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  inscriptionForm!: FormGroup;

  constructor(
    private http: HttpClient,
     private fb: FormBuilder, 
     private inscriptionService: InscriptionService,
     private router: Router) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.inscriptionForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      codepostal: ['', [Validators.required]],
      ville: ['', [Validators.required]],
      email: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.inscriptionForm.valid) {
      const formData = this.inscriptionForm.value;
  
      this.inscriptionService.creerUtilisateur(formData)
        .subscribe(
          response => {
            console.log('Réponse du serveur à l\'inscription:', response);
            if (response.message) {
              console.log('Inscription réussie:', response.message);
              this.router.navigate(['/connexion'], { queryParams: { registered: 'success' } });
            }
          },
          error => {
            // Afficher les détails de l'erreur en cas de problème
            console.error('Erreur lors de l\'inscription:', error);
            if (error.status) {
              console.error('Statut de l\'erreur:', error.status);
            }
            if (error.error) {
              console.error('Message d\'erreur:', error.error);
            }
          }
        );
    } else {
      console.error('Formulaire d\'inscription invalide');
    }
  }

  // Fonction pour vérifier si un champ a une erreur
  hasError(controlName: string, errorName: string) {
    return this.inscriptionForm.get(controlName)?.hasError(errorName);
  }
}
