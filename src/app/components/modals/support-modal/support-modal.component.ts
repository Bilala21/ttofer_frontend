import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-support-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support-modal.component.html',
  styleUrl: './support-modal.component.scss'
})
export class SupportModalComponent {
  isChatOpen = false;

  toggleChatWindow() {
    this.isChatOpen = !this.isChatOpen;
  }
}
