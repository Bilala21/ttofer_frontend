import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-link',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './custom-link.component.html',
  styleUrl: './custom-link.component.scss',
})
export class CustomLinkComponent {
  customLink;
  isCopied: boolean = false;
  constructor() {
    this.customLink = window.location.href;
  }
  copyCustomLink() {
    navigator.clipboard
      .writeText(this.customLink)
      .then(() => {
        this.isCopied = true;
      })
      .catch((err) => {
        this.isCopied = false;
      });
  }
}
