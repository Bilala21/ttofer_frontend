import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../shared/shared-components/header/header.component';
import { CommonModule, NgFor } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { FooterComponent } from '../../shared/shared-components/footer/footer.component';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  Subject,
  tap,
} from 'rxjs';
declare var bootstrap: any;
@Component({
  selector: 'app-chat-box',
  standalone: true,
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
  imports: [
    HeaderComponent,
    NgFor,
    CommonModule,
    ReactiveFormsModule,
    FooterComponent,
    FormsModule,
  ],
})
export class ChatBoxComponent {
  productImage: any;
  replierImage: any;
  senderImage: any;
  offerDetails: any;
  allChat: any;
  offerStatus: number | null = null;
  chatBox: any[] = [];
  isNavigatingAway: any;
  userImage: any;
  userName: any;
  selectedUser: any = null;
  meassages: any = { sender: [], reciever: [] };
  selectedConversation: any = [];
  conversationBox: any = [];
  currentUserid: number = 0;
  message: any;
  productId: number = 0;
  sellerId: number = 0;
  buyerId: number = 0;
  offerId: number = 0;
  productDetail: any;
  searchQuery: string = '';
  productPrice: any;
  selectedUserId: any = null;
  userDetail: any;
  reviewRating: any = 2;
  userlocation: any;
  constructor(
    private mainServices: MainServicesService,
    private extension: Extension,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.currentUserid = extension.getUserId();
    this.getAllChatsOfUser();
  }
  selectUser(user: any) {
    this.selectedUser = user;
  }
  selectedTab: string = 'buying';
  selectTab(tab: string) {
    this.selectedTab = tab;
    if (this.selectedTab === 'buying') {
      this.selectedUserId = null;
      this.chatBox = this.allChat.buyer_chats;
      this.conversationBox = [];
      this.suggestions = this.buyerSuggestions;
    } else {
      this.selectedUserId = null;
      this.chatBox = this.allChat.seller_chats;
      this.conversationBox = [];
      this.suggestions = this.sellerSuggestions;
    }
    this.chatBox = this.chatBox.sort((a: any, b: any) => {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });
    this.chatBox = this.chatBox.map((chat) => {
      return {
        ...chat,
        formattedTime: this.timeAgo(chat.updated_at),
      };
    });
  }
  timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const intervals = {
      year: 365 * 24 * 60 * 60,
      month: 30 * 24 * 60 * 60,
      week: 7 * 24 * 60 * 60,
      day: 24 * 60 * 60,
      h: 60 * 60,
      m: 60,
      s: 1,
    };
    for (const key in intervals) {
      const interval = Math.floor(
        seconds / intervals[key as keyof typeof intervals]
      );
      if (interval > 1) {
        return `${interval} ${key} ago`;
      } else if (interval === 1) {
        return `1 ${key} ago`;
      }
    }
    return 'just now';
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
  buyerSuggestions: string[] = [
    'Is this still available?',
    'I am interested.',
    'What’s your final price?',
    'Where can we meet?',
    'I’d like to buy this',
  ];
  sellerSuggestions: string[] = [
    'Thank you for your interest!',
    'Do you want pick up today?',
    'The final price is negotiable.',
    'Let me know your preferred time.',
    'What payment method do you prefer?',
  ];
  suggestions: string[] = [];
  suggestionsVisible: boolean = false;
  showSuggestions() {
    this.suggestionsVisible = true;
  }
  hideSuggestions() {
    setTimeout(() => {
      this.suggestionsVisible = false;
    }, 200);
  }
  selectSuggestion(suggestion: string) {
    this.message = suggestion;
  }
  receverId: any;
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        this.isNavigatingAway = true;
      });
    const productData = sessionStorage.getItem('productData');
    const userData = sessionStorage.getItem('userData');
    if (productData && userData) {
      this.productDetail = JSON.parse(productData);
      this.productId = this.productDetail.id;
      this.productImage = this.productDetail.photo[0].src;
      this.productPrice = this.productDetail.fix_price
        ? this.productDetail.fix_price
        : this.productDetail.auction_price;
      this.userDetail = JSON.parse(userData);
      this.userImage = this.userDetail.img;
      this.userName = this.userDetail.name;
      this.sellerId = this.userDetail.id;
      this.buyerId = this.currentUserid;
      this.selectedUser = this.userDetail;
    }
  }
  getAllChatsOfUser = () => {
    this.mainServices
      .getAllChatsOfUser(this.currentUserid)
      .subscribe((res: any) => {
        this.allChat = res.data;
        this.selectTab(this.selectedTab);
        if (this.selectedUser != null) console.log(this.chatBox);
      });
  };
  getTimeDifference(updatedAt: string): string {
    const updatedAtDate = new Date(updatedAt);
    const currentTime = new Date();
    const timeDifference = Math.abs(
      currentTime.getTime() - updatedAtDate.getTime()
    );

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
    this.selectedUserId = data?.id;
    this.userImage = data?.user_image;
    this.productImage = data.image_path.src;
    this.productPrice = data.product?.fix_price
      ? data.product.fix_price
      : data.product?.auction_price;
    const currentUserIsSender = data.receiver.id === this.currentUserid;
    const otherUser = currentUserIsSender ? data.sender : data.receiver;
    this.userlocation = otherUser.location;
    this.userName = otherUser.name;
    if (data.offer_id) {
      const input = {
        id: data.offer_id,
      };
      this.mainServices.getOffer(input).subscribe({
        next: (result: any) => {
          this.offerDetails = result.data;
        },
      });
    } else {
      this.offerDetails = null;
    }
    this.mainServices
      .getConversation(data.conversation_id)
      .subscribe((res: any) => {
        this.selectedConversation = res;
        this.markMessagesAsRead(data.conversation_id);
        const participant1 = res.data.Participant1;
        const participant2 = res.data.Participant2;
        const isCurrentUserParticipant1 =
          this.currentUserid === participant1.id;
        const currentParticipant = isCurrentUserParticipant1
          ? participant1
          : participant2;
        const otherParticipant = isCurrentUserParticipant1
          ? participant2
          : participant1;
        this.conversationBox = res.data.conversation.map((msg: any) => ({
          ...msg,
          formattedTime: this.formatMessageTime(msg.created_at),
          sender_image:
            msg.sender_id === this.currentUserid
              ? currentParticipant.img
              : otherParticipant.img,
          receiver_image:
            msg.sender_id === this.currentUserid
              ? otherParticipant.img
              : currentParticipant.img,
        }));
        this.productId = this.conversationBox[0].product_id;
        this.sellerId = this.conversationBox[0].seller_id;
        this.buyerId = this.conversationBox[0].buyer_id;
        this.offerStatus = this.conversationBox[0]?.offer?.status;
        this.offerId = this.conversationBox[0]?.offer_id;
        console.log(this.conversationBox);
      });
  }
  markMessagesAsRead(conversationId: string) {
    this.mainServices.markMessagesAsRead(conversationId).subscribe({
      next: (response) => {
        console.log('Messages marked as read:', response);
      },
      error: (error) => {
        console.error('Error marking messages as read:', error);
      },
    });
  }
  formatMessageTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  sendMsg() {
    let receiverId: string;

    if (this.selectedConversation.data) {
      receiverId =
        this.currentUserid !== this.selectedConversation.data.Participant2.id
          ? this.selectedConversation.data.Participant2.id
          : this.selectedConversation.data.Participant1.id;
    } else {
      receiverId = this.selectedUser?.id;
    }
    let input = {
      sender_id: this.currentUserid,
      buyer_id: this.buyerId,
      seller_id: this.sellerId,
      receiver_id: receiverId,
      message: this.message,
      product_id: this.productId,
    };

    this.mainServices.sendMsg(input).subscribe((res: any) => {
      this.message = '';
      const newMessage = {
        ...res.data.Message[0],
        sender_image:
          this.currentUserid === this.selectedConversation.data.Participant1.id
            ? this.selectedConversation.data.Participant1.img
            : this.selectedConversation.data.Participant2.img,
        receiver_image:
          this.currentUserid !== this.selectedConversation.data.Participant1.id
            ? this.selectedConversation.data.Participant1.img
            : this.selectedConversation.data.Participant2.img,
        formattedTime: this.formatMessageTime(new Date().toISOString()),
      };

      this.conversationBox.push(newMessage);
      this.cd.detectChanges();
    });
  }
  acceptOffer() {
    let input = {
      product_id: this.productId,
      seller_id: this.sellerId,
      buyer_id: this.buyerId,
      offer_id: this.offerId,
    };
    this.mainServices.acceptOffer(input).subscribe((res) => {
      res;
      console.log(res);
    });
  }

  rejectOffer() {
    let input = {
      product_id: this.productId,
      seller_id: this.sellerId,
      buyer_id: this.buyerId,
      offer_id: this.offerId,
    };
    this.mainServices.rejectOffer(input).subscribe((res) => {
      res;
    });
  }

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  sendMessage(message: string): void {
    if (message.trim() || this.selectedFile) {
      console.log('Message:', message);
      console.log('Selected File:', this.selectedFile);
      this.clearMessage();
    }
  }

  clearMessage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }
  isImageFile: boolean = false;
  filePreview: string | null = null;
  showPreviewModal: boolean = false;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.isImageFile = this.isFileImage(file);

      if (this.isImageFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreview = e.target.result;
          this.showPreviewModal = true;
        };
        reader.readAsDataURL(file);
      } else {
        this.filePreview = null;
        this.showPreviewModal = true;
      }
    }
  }

  confirmSend(): void {
    this.closePreviewModal();
  }

  isFileImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.selectedFile = null;
    this.filePreview = null;
  }
  handleSelectedUser(user: any) {
    this.selectedUserId = user.id;
  }
  searchSubject: Subject<string> = new Subject<string>();

  onSearch(event: any) {
    this.searchSubject.next(event.value);
  }

  ngOnDestroy() {
    if (this.isNavigatingAway) {
      sessionStorage.removeItem('productData');
      sessionStorage.removeItem('userData');
    }
  }
  deleteConversation(conversation: any) {
    this.mainServices
      .deleteConversation(conversation.conversation_id)
      .pipe(
        tap(() => {
          this.chatBox = this.chatBox.filter(
            (item) => item.conversation_id !== conversation.conversation_id
          );
        }),
        catchError((error) => {
          console.error('Error deleting conversation', error);
          return of(null);
        })
      )
      .subscribe();
  }
}
