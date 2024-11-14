import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-f-a-q',
  standalone: true,
  imports: [NgFor],
  templateUrl: './f-a-q.component.html',
  styleUrl: './f-a-q.component.scss'
})
export class FAQComponent {
  faqItems = [
    { question: 'What is your return policy?', answer: 'Our return policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we can’t offer you a refund or exchange.' },
    { question: 'Do you ship internationally?', answer: 'Yes, we ship worldwide. Shipping costs will apply, and will be added at checkout.' },
    { question: 'How do I track my order?', answer: 'You will receive an email with tracking information once your order has shipped.' },
    { question: 'Can I change my order?', answer: 'Yes, you can change your order before it is shipped. Please contact our support team for assistance.' },
    { question: 'What payment methods are accepted?', answer: 'We accept all major credit cards, PayPal, and Apple Pay.' }
  ];
}
