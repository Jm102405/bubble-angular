import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Region {
  code: string;
  name: string;
}

export interface Province {
  code: string;
  name: string;
  regionCode: string;
}

export interface City {
  code: string;
  name: string;
  provinceCode: string;
}

export interface Barangay {
  code: string;
  name: string;
  cityCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'https://psgc.cloud/api';

  constructor(private http: HttpClient) {}

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}/regions`);
  }

  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(`${this.apiUrl}/provinces`);
  }

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/cities-municipalities`);
  }

  getBarangays(): Observable<Barangay[]> {
    return this.http.get<Barangay[]>(`${this.apiUrl}/barangays`);
  }
}
