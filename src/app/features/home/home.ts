import { Component, inject } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faRobot, faFileExcel, faUserGraduate, faMailBulk, faPhone, faMapMarkerAlt, faUser} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter,faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
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
  constructor() {
    const library = inject(FaIconLibrary); 
    library.addIcons(faRobot, faFileExcel, faUserGraduate, faPhone, faMailBulk, faMapMarkerAlt, faFacebookF, faTwitter, faInstagram, faLinkedinIn, faUser); }
}
