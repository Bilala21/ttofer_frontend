import { NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalStateService } from '../../../shared/services/state/global-state.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent {

  showAuthModal: boolean = false
  constructor(private authState: GlobalStateService) {
    this.authState.currentState.subscribe(state => {
      if (state.isLoggedInd) {
        this.showAuthModal = true
      }
    });
  }

  showModal() {
    this.showAuthModal = true; 
  }

  closeModal() {
    this.showAuthModal = false;
  }
}




