import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserData {
  name: string;
  email: string;
  profession: string;
}

interface FileData {
  name: string;
  size: number;
  type: string;
  uploadDate: string;
}

interface UploadedFiles {
  rubric: FileData[];
  tests: FileData[];
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class User implements OnInit {
  private isBrowser: boolean;

  userData: UserData = {
    name: 'Juan Rodríguez',
    email: 'juan.rodriguez@email.com',
    profession: 'Profesor de Matemáticas'
  };

  uploadedFiles: UploadedFiles = {
    rubric: [],
    tests: []
  };

  showProfileModal = false;
  editUserData: UserData = { ...this.userData };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadUserData();
    this.loadUploadedFiles();
  }

  get userInitials(): string {
    return this.userData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  get firstName(): string {
    return this.userData.name.split(' ')[0];
  }

  get canStartReview(): boolean {
    return this.uploadedFiles.rubric.length > 0 && this.uploadedFiles.tests.length > 0;
  }

  // ADD THIS METHOD - this was missing and causing the error
  triggerFileInput(inputId: string): void {
    if (this.isBrowser) {
      const fileInput = document.getElementById(inputId) as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  }

  // LocalStorage methods
  private loadUserData() {
    if (this.isBrowser) {
      const stored = localStorage.getItem('userData');
      if (stored) {
        this.userData = JSON.parse(stored);
      }
    }
  }

  private saveUserData() {
    if (this.isBrowser) {
      localStorage.setItem('userData', JSON.stringify(this.userData));
    }
  }

  private loadUploadedFiles() {
    if (this.isBrowser) {
      const stored = localStorage.getItem('uploadedFiles');
      if (stored) {
        this.uploadedFiles = JSON.parse(stored);
      }
    }
  }

  private saveUploadedFiles() {
    if (this.isBrowser) {
      localStorage.setItem('uploadedFiles', JSON.stringify(this.uploadedFiles));
    }
  }

  // File upload methods
  onFileSelected(event: any, type: 'rubric' | 'tests') {
    const files = Array.from(event.target.files) as File[];
    
    files.forEach(file => {
      if (this.isValidExcelFile(file)) {
        const fileData: FileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString()
        };

        if (type === 'rubric') {
          // For rubric, only keep one file
          this.uploadedFiles.rubric = [fileData];
        } else {
          // For tests, add to existing files
          this.uploadedFiles.tests.push(fileData);
        }
      }
    });

    this.saveUploadedFiles();
    // Clear the input
    event.target.value = '';
  }

  private isValidExcelFile(file: File): boolean {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    const validExtensions = ['.xlsx', '.xls'];
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  }

  removeFile(type: 'rubric' | 'tests', index: number) {
    this.uploadedFiles[type].splice(index, 1);
    this.saveUploadedFiles();
  }

  // Modal methods
  openProfileModal() {
    this.editUserData = { ...this.userData };
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  saveProfile() {
    this.userData = { ...this.editUserData };
    this.saveUserData();
    this.closeProfileModal();
  }

  // Review methods
  startReview() {
    if (!this.canStartReview || !this.isBrowser) return;

    // Create a mock Excel file for download
    const csvContent = `Estudiante,Pregunta 1,Pregunta 2,Pregunta 3,Calificación Total
Juan Pérez,8,9,7,8.0
María García,9,8,8,8.3
Carlos López,7,8,9,8.0
Ana Martínez,9,9,8,8.7
Luis González,6,7,8,7.0`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'resultados_revision.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}