import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { AfterViewInit, ElementRef, ViewChild,
  ViewChildDecorator, QueryList, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PanelModule,
    InputTextModule,
    IconFieldModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    CardModule,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements AfterViewInit, OnDestroy {
  constructor(private router: Router) {}

  /* ================================
     CAROUSEL AUTO SCROLL
  ================================= */

  @ViewChild('carousel', { static: false })
  carousel!: ElementRef<HTMLDivElement>;

  private animationId!: number;
  private scrollSpeed = 0.9; // adjust speed here
  private isPaused = false;
  private processObserver?: IntersectionObserver;
  scrolled = false;
  activeSection = '';
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  ngAfterViewInit(): void {
    this.startAutoScroll();
    this.initProcessObserver();
    this.scrollSpy();
  }

  private initProcessObserver(): void {
    const process = document.querySelector('.vertical-process');
    if (!process) return;

    this.processObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          process.classList.add('animate'); // ✅ CORRECT CLASS
          this.processObserver?.unobserve(process);
        }
      },
      { threshold: 0.3 }
    );

    this.processObserver.observe(process);
  }

  private scrollSpy(): void {
     const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px'
      }
    );

    sections.forEach(section => observer.observe(section));
  }

  private startAutoScroll(): void {
    const el = this.carousel.nativeElement;

    const animate = () => {
      if (!this.isPaused) {
        el.scrollLeft += this.scrollSpeed;

        // Reset for infinite loop
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.processObserver?.disconnect();
  }

  /* ================================
     NAVIGATION
  ================================= */

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    const yOffset = -120;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({ top: y, behavior: 'smooth' });
    this.menuOpen = false;
  }
}

}
