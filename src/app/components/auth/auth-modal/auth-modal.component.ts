import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent implements OnInit {
  showModal: boolean = true
  modalAnimation: boolean = false
  showModalContent: boolean = false

  ngOnInit(): void {
    document.body.classList.add("overflow-hidden")
    setTimeout(() => {
      this.modalAnimation = true
    }, 1000);
    setTimeout(() => {
      this.showModalContent = true
    }, 1500);
  }
}
