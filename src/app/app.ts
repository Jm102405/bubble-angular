import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  private http = inject(HttpClient);

  ngOnInit() {
    const element = document.querySelector('html') as HTMLElement;
    element.classList.toggle('my-app-dark');

    this.http.get('http://localhost:3000', { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('✅ Backend connected successfully!', response);
      },
      error: (error) => {
        console.error('❌ Backend connection failed:', error);
      }
    });
  }
}
