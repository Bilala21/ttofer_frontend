import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../shared/shared-components/header/header.component";
import { CommonModule, NgFor } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { FooterComponent } from "../../shared/shared-components/footer/footer.component";
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
  imports: [HeaderComponent, NgFor, CommonModule, ReactiveFormsModule, FooterComponent]
})
export class ChatBoxComponent {
  messages = [
    {
      sender: 'user', // Indicates the message is sent by the user
      content: 'just ideas for next time',
      image: '/assets/images/banner3.webp'
    },
    {
      sender: 'receiver', // Indicates the message is received from the other person
      content: 'Thanks for your ideas!',
      image: '/assets/images/banner3.webp'
    },
    {
      sender: 'user',
      content: 'Do you want to discuss more?',
      image: '/assets/images/banner3.webp'
    },
    {
      sender: 'receiver',
      content: 'Sure, let’s set up a meeting time.',
      image: '/assets/images/banner3.webp'
    },
    {
      sender: 'user', // Indicates the message is sent by the user
      content: 'just ideas for next time',
      image: '/assets/images/banner3.webp'
    },
    {
      sender: 'receiver', // Indicates the message is received from the other person
      content: 'Thanks for your ideas!',
      image: '/assets/images/banner3.webp'
    },
    {
      sender: 'user',
      content: 'Do you want to discuss more?',
      image: '/assets/images/banner3.webp'
    },
    {
      sender: 'receiver',
      content: 'Sure, let’s set up a meeting time.',
      image: '/assets/images/banner3.webp'
    }
  ];
  
  offerStatus: number | null = null
  // @ViewChild('selectedUserDiv')
  // selectedUserDiv!: ElementRef;
  chatBox: any[] = [
    // {img:'assets/images/chat-profile1.png', name:'Elmer Laverty', text:'Haha oh man 🔥', time:'12m'},
    // {img:'assets/images/chat-profile2.png', name:'Florencio Dorrance', text:'woohoooo', time:'24m'},
    // {img:'assets/images/chat-profile3.png', name:'Lavern Laboy', text:`Haha that's terrifying 😂`, time:'1h'},
    // {img:'assets/images/chat-profile4.png', name:'Titus Kitamura', text:'omg, this is amazing', time:'5h'},
  ]
  selectedUser: any = null;
  meassages: any = { sender: [], reciever: [] };
  selectedConversation: any = [];
  conversationBox: any = [];
  currentUserid: number = 0;
  message: any;
  productId: number = 0
  sellerId: number = 0
  buyerId: number = 0
  offerId: number = 0
  searchQuery: string = '';
  users: any = [
    {
      image: "/assets/images/banner3.webp",
      name: "Ali",
      message: "This is message",
      time: "h1",
      id: 1
    },
    {
      image: "/assets/images/banner3.webp",
      name: "Bilal",
      message: "This is message",
      time: "h2",
      id: 2
    },
    {
      image: "/assets/images/banner3.webp",
      name: "Numan",
      message: "This is message",
      time: "h3",
      id: 3
    },
  ];
  selectedUserId: any = null

  filteredUsers: string[] = [...this.users];
  constructor(
    private mainServices: MainServicesService,
    private extension: Extension,
    private route: ActivatedRoute
  ) {
    this.currentUserid = extension.getUserId();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.searchQuery = searchText;
      this.filteredUsers = this.filterUsers(searchText);
      this.users = this.filteredUsers
      console.log(this.filteredUsers, 'filteredUsers');
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
  }

  openModal() {
    const modal = document.getElementById('offerModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  closeModal() {
    const modal = document.getElementById('offerModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');

      if (backdrop) {
        document.body.removeChild(backdrop);
      }

    }
  }

  messageControl = new FormControl();
  suggestions: string[] = [
    'Still available?',
    'I am interested.',
    'What’s your final price?',
    'Where can I meet you?',
    'I want to buy!'
  ];
  suggestionsVisible: boolean = false;

  showSuggestions() {
    this.suggestionsVisible = true;
  }

  hideSuggestions() {
    setTimeout(() => {
      this.suggestionsVisible = false;
    }, 200); // Delay to allow click event to register
  }

  selectSuggestion(suggestion: string) {
    this.messageControl.setValue(suggestion);
    this.suggestionsVisible = false;
  }
  ngOnInit() {
    // this.getAllChatsOfUser();
  }
  getAllChatsOfUser = () => {
    this.mainServices.getAllChatsOfUser(this.currentUserid).subscribe((res: any) => {
      this.chatBox = res.data
      this.chatBox = this.chatBox.sort((a: any, b: any) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
      const receiverIdFromRoute = this.route.snapshot.paramMap.get('id');
      // this.selectedUser = this.chatBox.filter(chat => chat.receiver_id == receiverIdFromRoute);

      this.selectedUser = this.chatBox[0];
      if (this.selectedUser != null)
        this.getConversation(this.selectedUser);
      console.log(this.chatBox)
      console.log(this.chatBox)
      console.log(this.chatBox)
    });
  }
  // getMinutesDifference(updatedAt: string): number {
  //   const updatedAtDate = new Date(updatedAt);
  //   const currentTime = new Date();
  //   const timeDifference = Math.abs(currentTime.getTime() - updatedAtDate.getTime()); // Difference in milliseconds
  //   return Math.floor(timeDifference / (1000 * 60)); // Convert to minutes
  // }
  getTimeDifference(updatedAt: string): string {
    const updatedAtDate = new Date(updatedAt);
    const currentTime = new Date();
    const timeDifference = Math.abs(currentTime.getTime() - updatedAtDate.getTime()); // Difference in milliseconds

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 60) {
      return `${minutes} m`;
    } else if (hours < 24) {
      return `${hours} h`;
    } else if (days < 7) {
      return `${days} d`;
    } else if (weeks < 4) {
      return `${weeks} w`;
    } else if (months < 12) {
      return `${months} mt${months !== 1 ? 's' : ''}`;
    } else {
      return `${years} y`;
    }
  }

  getConversation(data: any) {
    this.mainServices.getConversation(data.conversation_id).subscribe((res: any) => {
      this.selectedConversation = res;
      this.selectUser((res.data.Participant2.id != this.currentUserid) ? res.data.Participant2 : res.data.Participant1)

      console.log(res)
      console.log(res.data.conversation)
      this.conversationBox = res.data.conversation
      this.productId = this.conversationBox[0].product_id;
      this.sellerId = this.conversationBox[0].sender_id;
      this.buyerId = this.conversationBox[0].receiver_id;
      this.offerStatus = this.conversationBox[0].offer.status;
      this.offerId = this.conversationBox[0].offer_id;
      this.conversationBox.replier = res.data.Participant1.img;
      this.conversationBox.sender = res.data.Participant2.img;
      console.log('conversationBox', this.conversationBox)
    })
  }
  sendMsg() {

    let input = {
      // sender_id: this.selectedConversation.data.Participant1.id,
      sender_id: this.currentUserid,
      receiver_id: (this.currentUserid != this.selectedConversation.data.Participant2.id) ? this.selectedConversation.data.Participant2.id : this.selectedConversation.data.Participant1.id,
      message: this.message,
    }
    this.mainServices.sendMsg(input).subscribe((res: any) => {

      this.message = "";
      // this.getConversation(res.conversation_id)
      this.getConversation(res.data.Message[0])
    })
  }
  acceptOffer() {

    let input = {
      product_id: this.productId,
      seller_id: this.sellerId,
      buyer_id: this.buyerId,
      offer_id: this.offerId
    }
    this.mainServices.acceptOffer(input).subscribe(res => {

      res
      console.log(res)
    });
  }

  rejectOffer() {

    let input = {
      product_id: this.productId,
      seller_id: this.sellerId,
      buyer_id: this.buyerId,
      offer_id: this.offerId
    }
    this.mainServices.rejectOffer(input).subscribe(res => {

      res
    });
  }

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  sendMessage(message: string): void {
    if (message.trim() || this.selectedFile) {
      // Handle sending message and the file to the server or chat list
      console.log('Message:', message);
      console.log('Selected File:', this.selectedFile);
      // Reset message and file preview
      this.clearMessage();
    }
  }

  clearMessage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Read the file to generate a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  // CODED BY BILAL
  handleSelectedUser(user: any) {
    this.selectedUserId = user.id
  }
  searchSubject: Subject<string> = new Subject<string>();

  onSearch(event: any) {
    this.searchSubject.next(event.value); // Send input to the search stream
  }

  filterUsers(query: string): any[] {
    if (!query.trim()) {
      console.log(this.users, "users");
      return this.users;
    }
    return this.filteredUsers.filter((user: any) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
