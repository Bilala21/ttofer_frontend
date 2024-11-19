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
  // faqItems = [
  //   { question: 'What is your return policy?', answer: 'Our return policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we can’t offer you a refund or exchange.' },
  //   { question: 'Do you ship internationally?', answer: 'Yes, we ship worldwide. Shipping costs will apply, and will be added at checkout.' },
  //   { question: 'How do I track my order?', answer: 'You will receive an email with tracking information once your order has shipped.' },
  //   { question: 'Can I change my order?', answer: 'Yes, you can change your order before it is shipped. Please contact our support team for assistance.' },
  //   { question: 'What payment methods are accepted?', answer: 'We accept all major credit cards, PayPal, and Apple Pay.' }
  // ];

  faqItems = [
    {
      category: "General",
      questions: [
        {
          question: "What is TToffer?",
          answer: "TToffer is an online marketplace where users can buy and sell new and used products."
        },
        {
          question: "How do I register on the website?",
          answer: "To register, click on 'Sign Up' and fill out the required information, you can also signup using Google or Apple account."
        },
        {
          question: "What are the benefits of registering?",
          answer: "Registered users can post ads, save favourite listings, and receive notifications and many other features to make interaction with buyers and sellers."
        }
      ]
    },
    {
      category: "Posting Ads",
      questions: [
        {
          question: "How do I post an ad?",
          answer: "Click on 'Post Ad' and fill out the product details, upload photos, and submit."
        },
        {
          question: "What are the allowed file formats for images?",
          answer: "Allowed formats are JPEG and PNG."
        },
        {
          question: "Can I edit my ad after posting?",
          answer: "Yes, you can edit your ad through your account dashboard."
        }
      ]
    },
    {
      category: "Product Information",
      questions: [
        {
          question: "What information should I provide for my product?",
          answer: "Include product name, type of selling (Auction or feature), description, price, location, and clear photos."
        }
      ]
    },
    {
      category: "Payment and Safety",
      questions: [
        {
          question: "How do I pay for a product?",
          answer: "Buyers and sellers can negotiate payment methods directly."
        },
        {
          question: "How do I stay safe while transacting?",
          answer: "Use caution, verify seller/buyer identities, and meet in public areas."
        }
      ]
    },
    {
      category: "Account and Password",
      questions: [
        {
          question: "How do I reset my password?",
          answer: "Click on 'Forgot Password' and follow the instructions."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, contact our support team to delete your account."
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          question: "What if I encounter technical issues?",
          answer: "Contact our support team via email or phone."
        },
        {
          question: "Why can't I upload images?",
          answer: "Check file format, size, and ensure you have a stable internet connection."
        }
      ]
    },
    {
      category: "Moderation and Reporting",
      questions: [
        {
          question: "How do I report suspicious or inappropriate content?",
          answer: "Use the 'Report' button on the ad or contact our support team."
        },
        {
          question: "What happens if my ad is removed?",
          answer: "You'll receive an email explaining the reason; contact support for clarification."
        }
      ]
    },
    {
      category: "Other",
      questions: [
        {
          question: "Is TToffer free to use?",
          answer: "Yes, posting and browsing ads are free."
        },
        {
          question: "Do you offer customer support?",
          answer: "Yes, contact us via email, phone, or our support page."
        }
      ]
    }
  ];
  
}
