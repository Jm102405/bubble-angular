import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { MessageService, ConfirmationService } from 'primeng/api';

import { ClientsService, Client } from '../../../services/services/clients/clients';

interface CityData {
  name: string;
  barangays: string[];
}

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    SelectModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  clients: Client[] = [];
  displayDialog: boolean = false;
  client: Client = this.resetClient();
  isEdit: boolean = false;

  // Static Cebu cities and barangays data
  cebuCitiesData: CityData[] = [
    {
      name: 'Cebu City',
      barangays: ['Apas', 'Banilad', 'Busay', 'Capitol Site', 'Guadalupe', 'Kasambagan', 'Lahug', 'Mabolo', 'Talamban', 'Tisa']
    },
    {
      name: 'Mandaue City',
      barangays: ['Alang-alang', 'Banilad', 'Cabancalan', 'Centro', 'Guizo', 'Ibabao-Estancia', 'Mantuyong', 'Tipolo']
    },
    {
      name: 'Lapu-Lapu City',
      barangays: ['Agus', 'Babag', 'Basak', 'Buaya', 'Canjulao', 'Caubian', 'Maribago', 'Pajo', 'Poblacion', 'Pusok']
    },
    {
      name: 'Talisay City',
      barangays: ['Bulacao', 'Cansojong', 'Dumlog', 'Jaclupan', 'Lawaan', 'Poblacion', 'Tabunok', 'Tangke']
    },
    {
      name: 'Toledo City',
      barangays: ['Poblacion', 'Bato', 'Bagakay', 'Bunga', 'Cabitoonan', 'Don Andres Soriano', 'Luray', 'Matab-ang']
    },
    {
      name: 'Naga City',
      barangays: ['Balirong', 'Central Poblacion', 'Colon', 'East Poblacion', 'Inayagan', 'Langtad', 'North Poblacion', 'South Poblacion', 'Tinaan', 'Uling']
    },
    {
      name: 'Carcar City',
      barangays: ['Poblacion I', 'Poblacion II', 'Poblacion III', 'Bolinawan', 'Calidngan', 'Liburon', 'Ocaña', 'Perrelos', 'Tuyom', 'Valencia']
    },
    {
      name: 'Danao City',
      barangays: ['Poblacion', 'Bayabas', 'Cagat-Lamac', 'Calao', 'Cogon-Cruz', 'Dungga', 'Guinacot', 'Looc', 'Magtagobtob', 'Santican']
    },
    {
      name: 'Minglanilla',
      barangays: ['Poblacion Ward I', 'Poblacion Ward II', 'Cadulawan', 'Camp 7', 'Camp 8', 'Linao', 'Pakigne', 'Tungkop', 'Tulay', 'Tubod']
    },
    {
      name: 'Consolacion',
      barangays: ['Poblacion Occidental', 'Poblacion Oriental', 'Cabangahan', 'Cansaga', 'Danglag', 'Garing', 'Jugan', 'Lamac', 'Panas', 'Pitogo']
    },
    {
      name: 'Liloan',
      barangays: ['Poblacion', 'Catarman', 'Cotcot', 'Jubay', 'Lataban', 'San Roque', 'Santa Cruz', 'Tayud', 'Yati']
    },
    {
      name: 'Compostela',
      barangays: ['Poblacion', 'Basak', 'Cabadiangan', 'Cambayog', 'Cogon', 'Estaca', 'Lupa', 'Magay', 'Tag-ube']
    }
  ];

  cebuCities: string[] = [];
  filteredBarangays: string[] = [];

  constructor(
    private clientsService: ClientsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadClients();
    this.loadCebuData();
  }

  loadCebuData() {
    // Extract city names
    this.cebuCities = this.cebuCitiesData.map(c => c.name);
  }

  onCityChange() {
    const selectedCityData = this.cebuCitiesData.find(c => c.name === this.client.city);
    if (selectedCityData) {
      this.filteredBarangays = selectedCityData.barangays;
      this.client.barangay = '';
    }
  }

  loadClients() {
    this.clientsService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load clients'
        });
      }
    });
  }

  openNew() {
    this.client = this.resetClient();
    this.isEdit = false;
    this.filteredBarangays = [];
    this.displayDialog = true;
  }

  editClient(client: Client) {
    this.client = { ...client };
    this.isEdit = true;
    
    // Load filtered barangays based on selected city
    if (this.client.city) {
      const selectedCityData = this.cebuCitiesData.find(c => c.name === this.client.city);
      if (selectedCityData) {
        this.filteredBarangays = selectedCityData.barangays;
      }
    }
    
    this.displayDialog = true;
  }

  deleteClient(client: Client) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${client.name}?`,
      accept: () => {
        this.clientsService.delete(client._id!).subscribe({
          next: () => {
            this.loadClients();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Client deleted successfully'
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete client'
            });
          }
        });
      }
    });
  }

  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^(09)\d{9}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  saveClient() {
    if (!this.isValidPhoneNumber(this.client.contactNumber)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Invalid Philippine phone number. Format: 09XXXXXXXXX'
      });
      return;
    }

    if (!this.isValidEmail(this.client.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Invalid email format'
      });
      return;
    }

    if (!this.client.city || !this.client.barangay) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please select City/Municipality and Barangay'
      });
      return;
    }

    if (this.isEdit) {
      this.clientsService.update(this.client._id!, this.client).subscribe({
        next: () => {
          this.loadClients();
          this.displayDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Client updated successfully'
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update client'
          });
        }
      });
    } else {
      this.clientsService.create(this.client).subscribe({
        next: () => {
          this.loadClients();
          this.displayDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Client added successfully'
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add client'
          });
        }
      });
    }
  }

  resetClient(): Client {
    return {
      name: '',
      contactNumber: '',
      email: '',
      city: '',
      barangay: ''
    };
  }
}
