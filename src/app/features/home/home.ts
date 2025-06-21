import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faRobot, faFileExcel, faUserGraduate, faMailBulk, faPhone, faMapMarkerAlt, faUser, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // Array para controlar qué FAQ está activo
  activeFaqItems: boolean[] = [false, false, false, false];

  constructor(private elementRef: ElementRef) {
    const library = inject(FaIconLibrary); 
    library.addIcons(
      faRobot, 
      faFileExcel, 
      faUserGraduate, 
      faPhone, 
      faMailBulk, 
      faMapMarkerAlt, 
      faFacebookF, 
      faTwitter, 
      faInstagram, 
      faLinkedinIn, 
      faUser,
      faChevronDown  // Agregamos el icono del chevron
    ); 
  }

  // Método para alternar FAQ
  toggleFAQ(index: number): void {
    // Cerrar todos los FAQs
    this.activeFaqItems = this.activeFaqItems.map(() => false);
    
    // Si no estaba activo, abrirlo
    this.activeFaqItems[index] = true;
  }

  // Método para verificar si un FAQ está activo
  isFaqActive(index: number): boolean {
    return this.activeFaqItems[index];
  }

  // Escuchar clicks fuera del área de FAQ
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const faqSection = this.elementRef.nativeElement.querySelector('#faq');
    
    // Si el click fue fuera de la sección FAQ, cerrar todos
    if (faqSection && !faqSection.contains(target)) {
      this.activeFaqItems = this.activeFaqItems.map(() => false);
    }
  }

  // Método alternativo si prefieres cerrar solo cuando se hace click fuera de los items
  @HostListener('document:click', ['$event'])
  onDocumentClickAlternative(event: Event): void {
    const target = event.target as HTMLElement;
    const faqContainer = this.elementRef.nativeElement.querySelector('.faq-container');
    
    // Si el click fue fuera del contenedor de FAQ, cerrar todos
    if (faqContainer && !faqContainer.contains(target)) {
      this.activeFaqItems = this.activeFaqItems.map(() => false);
    }
  }
}