import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../shared/shared-components/header/header.component";
import { CommonModule, NgFor } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { FooterComponent } from "../../shared/shared-components/footer/footer.component";
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, filter, of, Subject, tap } from 'rxjs';
declare var bootstrap: any;
@Component({
  selector: 'app-chat-box',
  standalone: true,
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
  imports: [HeaderComponent, NgFor, CommonModule, ReactiveFormsModule, FooterComponent,FormsModule]
})
export class ChatBoxComponent {
  replierImage:any;
  senderImage:any;
  offerDetails:any
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
  allChat:any;
  offerStatus: number | null = null
  // @ViewChild('selectedUserDiv')
  // selectedUserDiv!: ElementRef;
  chatBox: any[] = [
    // {img:'assets/images/chat-profile1.png', name:'Elmer Laverty', text:'Haha oh man 🔥', time:'12m'},
    // {img:'assets/images/chat-profile2.png', name:'Florencio Dorrance', text:'woohoooo', time:'24m'},
    // {img:'assets/images/chat-profile3.png', name:'Lavern Laboy', text:`Haha that's terrifying 😂`, time:'1h'},
    // {img:'assets/images/chat-profile4.png', name:'Titus Kitamura', text:'omg, this is amazing', time:'5h'},
  ]
  isNavigatingAway:any;
  userImage:any;
  userName:any;
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
  productDetail:any
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
  userDetail:any
  filteredUsers: string[] = [...this.users];
  constructor(
    private mainServices: MainServicesService,
    private extension: Extension,private router: Router,
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
    });
    this.getAllChatsOfUser();
  }

  selectUser(user: any) {
    this.selectedUser = user;
  }
  selectedTab: string = 'buying';

  selectTab(tab: string) {
    this.selectedTab = tab; // Update the selected tab
  
    if (this.selectedTab === 'buying') {
      // Assign buying chat data
      this.chatBox = this.allChat.buyer_chats;
    } else {
      // Assign selling chat data
      this.chatBox = this.allChat.seller_chats;
    }
  
    // Sort the chats based on updated_at date
    this.chatBox = this.chatBox.sort((a: any, b: any) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  
    // Format the updated_at field to show "time ago"
    this.chatBox = this.chatBox.map(chat => {
      return {
        ...chat,
        formattedTime: this.timeAgo(chat.updated_at) // Format to "time ago"
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
      hour: 60 * 60,
      minute: 60,
      second: 1,
    };
  
    for (const key in intervals) {
      const interval = Math.floor(seconds / intervals[key as keyof typeof intervals]);
      if (interval > 1) {
        return `${interval} ${key}s ago`;
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
    this.message = suggestion; 
  }
  receverId:any
  ngOnInit() {
      
    this.router.events
    .pipe(filter(event => event instanceof NavigationStart))
    .subscribe((event: any) => {
      this.isNavigatingAway = true;
    });
      // If no state, try to get data from sessionStorage
      const productData = sessionStorage.getItem('productData');
      const userData = sessionStorage.getItem('userData');

      if (productData && userData) {
        this.productDetail = JSON.parse(productData);
        this.productId=this.productDetail.id
        this.userDetail = JSON.parse(userData);
        this.userImage=this.userDetail.img;
        this.userName=this.userDetail.name;
        this.sellerId=this.userDetail.id;
        this.buyerId=this.currentUserid;
        this.selectedUser = this.userDetail;
      } 
  }
  getAllChatsOfUser = () => {
    this.mainServices.getAllChatsOfUser(this.currentUserid).subscribe((res: any) => {
        
      this.allChat = res.data;
      // this.chatBox = this.chatBox.sort((a: any, b: any) => {
      //   return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      // });
      this.selectTab(this.selectedTab)

      const receiverIdFromRoute = this.route.snapshot.paramMap.get('id');
      // this.selectedUser = this.chatBox.filter(chat => chat.receiver_id == receiverIdFromRoute);

      // this.selectedUser = this.chatBox[0];
      if (this.selectedUser != null)
        // this.getConversation(this.selectedUser);
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
      
    this.selectedUserId = data?.id;
    this.userImage = data?.user_image;
    this.userName = data?.receiver?.name;
    if (data.offer_id) {
      const input = {
        id: data.offer_id,
      };
      this.mainServices.getOffer(input).subscribe({
        next: (result:any) => {
          this.offerDetails = result.data; // Store offer details if available
        },
      });
    } else {
      this.offerDetails = null; // Clear offer details if no offer is present
    }
    this.mainServices.getConversation(data.conversation_id).subscribe((res: any) => {
      this.selectedConversation = res;
      const participant1 = res.data.Participant1;
      const participant2 = res.data.Participant2;
        
      this.conversationBox = res.data.conversation.map((msg: any) => ({
        ...msg,
        sender_image: msg.sender_id === participant1.id ? participant1.img : participant2.img,
        receiver_image: msg.sender_id !== participant1.id ? participant1.img : participant2.img
      }));
  
      this.productId = this.conversationBox[0].product_id;
      this.sellerId = this.conversationBox[0].seller_id;
      this.buyerId = this.conversationBox[0].buyer_id;
      this.offerStatus = this.conversationBox[0]?.offer?.status;
      this.offerId = this.conversationBox[0]?.offer_id;
      console.log(this.conversationBox)
    });
  }
  
  
  
  sendMsg() {
    let receiverId: string;

    if (this.selectedConversation.data) {
      // Use optional chaining to safely access Participant IDs
      receiverId = (this.currentUserid !== this.selectedConversation.data.Participant2.id)
        ? this.selectedConversation.data.Participant2.id
        : this.selectedConversation.data.Participant1.id;
    } else {
      // Fallback to selected user's ID if no conversation is selected
      receiverId = this.selectedUser?.id;  // Use optional chaining for safety
    }
    let input = {
      sender_id: this.currentUserid,
      buyer_id: this.buyerId,
      seller_id: this.sellerId,
      receiver_id: receiverId,

      message: this.message,
      product_id: this.productId
    };
  
    this.mainServices.sendMsg(input).subscribe((res: any) => {
      // Clear message input
      this.message = "";
  
      // Push the new message to the conversationBox directly to update the UI without needing to refetch
      const newMessage = {
        ...res.data.Message[0],
        sender_image: this.currentUserid === this.selectedConversation.data.Participant1.id
          ? this.selectedConversation.data.Participant1.img
          : this.selectedConversation.data.Participant2.img,
        receiver_image: this.currentUserid !== this.selectedConversation.data.Participant1.id
          ? this.selectedConversation.data.Participant1.img
          : this.selectedConversation.data.Participant2.img
      };
    
      this.conversationBox.push(newMessage);
    });
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
  isImageFile: boolean = false;
  filePreview: string | null = null;
  showPreviewModal: boolean = false;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.isImageFile = this.isFileImage(file);

      if (this.isImageFile) {
        // Create a FileReader to show image preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreview = e.target.result;
          this.showPreviewModal = true; // Open modal after setting preview
        };
        reader.readAsDataURL(file);
      } else {
        // If it's not an image, set file name and show modal
        this.filePreview = null;
        this.showPreviewModal = true;
      }
    }
  }

  confirmSend(): void {
    // Logic for sending the message/file
    this.closePreviewModal();
  }

  isFileImage(file: File): boolean {
    // Check if file type is an image
    return file.type.startsWith('image/');
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.selectedFile = null;
    this.filePreview = null;
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
  ngOnDestroy() {
    // Remove editPost data from localStorage if navigating away
    if (this.isNavigatingAway) {
      sessionStorage.removeItem('productData');
      sessionStorage.removeItem('userData')
    }
  }
  deleteConversation(conversation: any) {
      
    this.mainServices.deleteConversation(conversation.conversation_id)
      .pipe(
        tap(() => {
          // Remove the item from chatBox array if the API call is successful
          this.chatBox = this.chatBox.filter((item) => item.conversation_id !== conversation.conversation_id);
        }),
        catchError((error) => {
          console.error('Error deleting conversation', error);
          return of(null); // Handle errors gracefully
        })
      )
      .subscribe();
  }
  
}
