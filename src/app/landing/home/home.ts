import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';

import { AfterViewInit, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
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
  providers: [MessageService],
})
export class Home implements AfterViewInit, OnDestroy {
  formData = {
    ownerName: '',
    petName: '',
    contactNumber: '',
    preferredDateTime: '',
  };

  // EmailJS Configuration
  private SERVICE_ID = 'service_y3w3q2k';
  private TEMPLATE_ID = 'template_6moxbli';
  private PUBLIC_KEY = 'jrzAbasCfx5Cz9p2u';

  constructor(private router: Router, private messageService: MessageService) {
    // Initialize EmailJS
    emailjs.init(this.PUBLIC_KEY);
  }

  @ViewChild('carousel', { static: false })
  carousel!: ElementRef<HTMLDivElement>;

  private animationId!: number;
  private scrollSpeed = 0.9;
  private isPaused = false;
  private processObserver?: IntersectionObserver;
  private scrollAnimationObserver?: IntersectionObserver;
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
     this.initScrollAnimations(); 
    this.scrollSpy();
  }

  private initProcessObserver(): void {
    const process = document.querySelector('.vertical-process');
    if (!process) return;

    this.processObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          process.classList.add('animate');
          this.processObserver?.unobserve(process);
        }
      },
      { threshold: 0.3 }
    );

    this.processObserver.observe(process);
  }

  private initScrollAnimations(): void {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) return;

    this.scrollAnimationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            this.scrollAnimationObserver?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    animatedElements.forEach((el) => this.scrollAnimationObserver!.observe(el));
  }

  private scrollSpy(): void {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  private startAutoScroll(): void {
    const el = this.carousel.nativeElement;

    const animate = () => {
      if (!this.isPaused) {
        el.scrollLeft += this.scrollSpeed;

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
    this.scrollAnimationObserver?.disconnect();
  }

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

  validatePhoneNumber(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');

    if (event.target.value.length > 11) {
      event.target.value = event.target.value.slice(0, 11);
    }

    this.formData.contactNumber = event.target.value;
  }

  async submitReservation() {
    // Validation
    if (
      !this.formData.ownerName ||
      !this.formData.petName ||
      !this.formData.contactNumber ||
      !this.formData.preferredDateTime
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete Form',
        detail: 'Please fill in all fields',
      });
      return;
    }

    if (!this.isValidPhilippineNumber(this.formData.contactNumber)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Number',
        detail: 'Please enter a valid Philippine mobile number (09XX XXX XXXX)',
      });
      return;
    }

    const selectedDate = new Date(this.formData.preferredDateTime);
    const now = new Date();

    if (selectedDate < now) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Date',
        detail: 'Please select a future date and time',
      });
      return;
    }

    // Format datetime for email
    const formattedDateTime = new Date(this.formData.preferredDateTime).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Prepare email parameters
    const templateParams = {
      owner_name: this.formData.ownerName,
      pet_name: this.formData.petName,
      contact_number: this.formData.contactNumber,
      preferred_datetime: formattedDateTime,
    };

    try {
      // Show sending message
      this.messageService.add({
        severity: 'info',
        summary: 'Sending',
        detail: 'Sending your reservation request...',
      });

      // Send email via EmailJS
      const response = await emailjs.send(this.SERVICE_ID, this.TEMPLATE_ID, templateParams);

      console.log('Email sent successfully!', response);

      // Show success message
      this.messageService.add({
        severity: 'success',
        summary: 'Reservation Submitted',
        detail: 'We will contact you shortly!',
      });

      // Clear form
      this.resetForm();
    } catch (error: any) {
      console.error('Failed to send email:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send reservation. Please try again or contact us directly.',
      });
    }
  }

  isValidPhilippineNumber(number: string): boolean {
    const regex = /^09\d{9}$/;
    return regex.test(number);
  }

  resetForm() {
    this.formData = {
      ownerName: '',
      petName: '',
      contactNumber: '',
      preferredDateTime: '',
    };
  }
}
