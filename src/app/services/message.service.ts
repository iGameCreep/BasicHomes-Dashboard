import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
    private errorMessageSubject = new Subject<string>();
  private successMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  successMessage$ = this.successMessageSubject.asObservable();

  setErrorMessage(message: string, duration: number = 5000) {
    this.errorMessageSubject.next(message);
    setTimeout(() => {
      this.clearErrorMessage();
    }, duration);
  }

  clearErrorMessage() {
    this.errorMessageSubject.next('');
  }

  setSuccessMessage(message: string, duration: number = 5000) {
    this.successMessageSubject.next(message);
    setTimeout(() => {
      this.clearSuccessMessage();
    }, duration);
  }

  clearSuccessMessage() {
    this.successMessageSubject.next('');
  }
}
