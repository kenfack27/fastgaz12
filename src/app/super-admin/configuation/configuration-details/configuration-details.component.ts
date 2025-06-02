import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Configuration } from 'src/app/model/configuration';
import { ConfigurationService } from 'src/app/service/configuration.service';

@Component({
  selector: 'app-configuration-details',
  templateUrl: './configuration-details.component.html',
  styleUrls: ['./configuration-details.component.css']
})
export class ConfigurationDetailsComponent implements OnInit {
  configurationForm = this.fb.group({
    deliveryFeeDefault: [0, [Validators.required, Validators.min(0)]],
    deliveryFeePerKm: [0, [Validators.required, Validators.min(0)]],
    percentDelivery: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    percentStore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    percentSystem: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
  });
  // Form group pour le formulaire de modification de la configuration
  configuration: Configuration = {
    deliveryFeeDefault: 0,
    deliveryFeePerKM: 0,
    percentDelivery: 0,
    percentStore: 0,
    percentSystem: 0
  };


  constructor(
    private configurationService: ConfigurationService,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {


    // Charger la configuration
    this.getConfiguration();
  }

  getConfiguration(): void {
    this.configurationService.getConfiguration$().subscribe({
      next: (response) => {
        this.configuration = response.data.configuration;
      },
      error: (err) => console.error('Erreur lors du chargement de la configuration', err)

    });

  }

  onUpdateConfiguration(): void {
    this.configuration = {
      deliveryFeeDefault: this.configurationForm.get('deliveryFeeDefault').value,
      deliveryFeePerKM: this.configurationForm.get('deliveryFeePerKm').value,
      percentDelivery: this.configurationForm.get('percentDelivery').value,
      percentStore: this.configurationForm.get('percentStore').value,
      percentSystem: this.configurationForm.get('percentSystem').value,
    }
    this.configurationService.updateConfiguration(this.configuration).subscribe({
      next: () => {
        this
        // this.notifier.onSuccess('Configuration modifiée avec succès');
      },
      error: (err) => console.error('Erreur lors de la modification de la configuration', err)
    });

  }

}
