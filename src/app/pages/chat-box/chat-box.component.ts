import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute, NavigationStart, Router, RouterLink } from '@angular/router';
import {
  catchError,
  filter,
  of,
  Subject,
  tap,
} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../../public/constants/constants';
declare var bootstrap: any;
@Component({
  selector: 'app-chat-box',
  standalone: true,
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
  imports: [
    NgFor,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ChatBoxComponent {
  productImage: any;
  imagePreviews: string[] = [];
  selectedImageIndex: number = 0;
  imagePreview: string | null = null;
  replierImage: any;
  senderImage: any;
  selectedImages:any
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
  currentUserid: any;
  message: any;
  productId: any
  sellerId: any ;
  buyerId: any;
  offerId: any;
  productDetail: any;
  searchQuery: string = '';
  productPrice: any;
  selectedUserId: any = null;
  userDetail: any;
  reviewRating: any = 2;
  userlocation: any;
  isSmallScrenn: boolean = false
  screenWidth: number;
  constructor(

    private toastr: ToastrService,
    private mainServices: MainServicesService,
    private extension: Extension,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    
    this.currentUserid = extension.getUserId();
    this.getAllChatsOfUser();
    this.screenWidth = window.innerWidth;
  }
  selectUser(user: any) {
    this.selectedUser = user;
  }
  selectedTab: string = 'buying';
  selectTab(tab: string) {
    this.selectedTab = tab;
    if (this.selectedTab === 'buying') {
      this.selectedUserId = null;
      
      this.chatBox = this.allChat?.buyer_chats;
      this.conversationBox = [];

      this.suggestions = this.buyerSuggestions;
    } else {
      this.selectedUserId = null;
      this.chatBox = this.allChat?.seller_chats;
      this.conversationBox = [];
      this.suggestions = this.sellerSuggestions;
    }
    if(this.chatBox?.length > 0){
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
      
      this.productImage = this.productDetail?.photos[0]?.url;
      this.productPrice = this.productDetail.fix_price
        ? this.productDetail.fix_price
        : this.productDetail.auction_initial_price;
      this.userDetail = JSON.parse(userData);
      this.userImage = this.userDetail?.img;
      this.userName = this.userDetail?.name;
      this.sellerId = this.userDetail?.id;
      this.buyerId = this.currentUserid;
      this.selectedUser = this.userDetail;
    }
  }
  getAllChatsOfUser = (conversation_id?: any) => {
    this.mainServices.getAllChatsOfUser(this.currentUserid).subscribe((res: any) => {
      this.allChat = res.data;
      this.selectTab(this.selectedTab);
      if (this.productDetail && this.userDetail) {
        const matchedChat = this.allChat.buyer_chats.find(
          (chat: any) => chat.conversation_id === conversation_id
        );
          if (matchedChat) {
            this.productDetail=null
            this.userDetail=null
            sessionStorage.removeItem('productData');
            sessionStorage.removeItem('userData');
          this.getConversation(matchedChat);

        } 
      }
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
    
    console.log(this.selectedUser)
    this.selectedUserId = data?.id;
    this.userImage = data?.user_image;
    this.productImage = data.image_path.url;

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
        
        this.selectedUser=res
        this.productPrice = this.selectedConversation.data.conversation[0].product?.fix_price
        ?  this.selectedConversation.data.conversation[0].product?.fix_price
        :  this.selectedConversation.data.conversation[0].auction_initial_price;
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
  activeOptionIndex: number | null = null;

toggleOptions(index: any): void {
  this.activeOptionIndex = this.activeOptionIndex === index ? null : index;
}

deleteMessage(message: any, index: number): void {
  this.mainServices.deleteMessage(message.id).subscribe({
    next: (response: any) => {
      if (response.status) {
        this.conversationBox.splice(index, 1); // Remove message from the list
        this.activeOptionIndex = null;
        this.toastr.success('Message deleted successfully.', 'Success');
      }
    },
    error: (error: any) => {
      // Handle HTTP errors (e.g., 403, 404, 500)
        this.toastr.error(error.error.message, 'Error');
        this.activeOptionIndex = null;

      console.error('Error deleting message:', error);
    }
  });
}


  markMessagesAsRead(conversationId: string) {
    this.mainServices.markMessagesAsRead(conversationId).subscribe({
      next: (response) => {
      },
      error: (error) => {
      },
    });
  }
  formatMessageTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  sendMsg() {
    let receiverId;
  
    if (this.selectedConversation?.data) {
      receiverId =
        this.currentUserid !== this.selectedConversation.data.Participant2.id
          ? this.selectedConversation.data.Participant2.id
          : this.selectedConversation.data.Participant1.id;
    } else {
      receiverId = this.selectedUser?.id;
    }
  
    // Prepare form data
    const formData = new FormData();
    formData.append('sender_id', this.currentUserid);
    formData.append('buyer_id', this.buyerId);
    formData.append('seller_id', this.sellerId);
    formData.append('receiver_id', receiverId);
    if(this.message){
      formData.append('message', this.message);

    }
    formData.append('product_id', this.productId);
  
    // Append images if any exist
    if (this.selectedImages && this.selectedImages.length > 0) {
      this.selectedImages.forEach((file:any, index:any) => {
        formData.append(`images[${index}]`, file); // Adjust key based on backend requirement
      });
    }
    const token = localStorage.getItem('authToken');
    // API call using fetch
    fetch(`${Constants.baseApi}/message/send`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((res:any) => {
        this.message = '';
        this.selectedImages = []; // Clear selected images after sending
        this.imagePreviews=[]
        if(this.productDetail&&this.userDetail){
          
          this.getAllChatsOfUser(res.data.Message[0].conversation_id)
         }
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
      })
      .catch((error) => {
        this.selectedImages = []; // Clear selected images after sending
        this.imagePreviews=[]
        console.error('There was a problem with the fetch operation:', error);
      }
    );
  }
  
  
  removeImage(): void {
    this.imagePreview = null; // Clear the preview
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

  clearMessage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }
  isImageFile: boolean = false;
  filePreview: string | null = null;
  showPreviewModal: boolean = false;
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages = Array.from(input.files); // Store selected files
      this.imagePreviews = this.selectedImages.map((file:any) =>
        URL.createObjectURL(file)
      ); // Create image previews
      this.selectedImageIndex = 0; // Default to the first image
    }
    
  }
  

  setSelectedImage(index: number): void {
    this.selectedImageIndex = index;
  }

  removeImages(index: number): void {
    this.imagePreviews.splice(index, 1);
    if (this.selectedImageIndex >= this.imagePreviews.length) {
      this.selectedImageIndex = this.imagePreviews.length - 1;
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
          this.toastr.success('Chat deleted successfully', 'Success');
        }),
        catchError((error) => {
          
          // Show the error message in the toastr
          this.toastr.error(error.error.message ,'Error');
          return of(null); // Return an observable to complete the stream
        })
      )
      .subscribe();
  }
  
  handleSmScreen() {
    this.isSmallScrenn = !this.isSmallScrenn
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    if (this.screenWidth > 767) { } this.isSmallScrenn = false
  }
  @HostListener('document:click', ['$event'])
  closeMenu(): void {
    this.activeOptionIndex = null;
  }
}

