import {
  CommonModule,
  NgFor,
  NgIf,
  Location,
  DecimalPipe,
} from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderComponent } from '../../shared/shared-components/header/header.component';
import { FooterComponent } from '../../shared/shared-components/footer/footer.component';
import { SellingComponent } from '../selling/selling.component';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { filter, forkJoin, map, Observable } from 'rxjs';
import { blob } from 'stream/consumers';
import { ReviewPageComponent } from '../review-page/review-page.component';
import { PaymentComponent } from '../payment/payment.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification/notification.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CurrentLocationComponent } from '../current-location/current-location.component';
import { SharedDataService } from '../../shared/services/shared-data.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { AccountSettingDialogeComponent } from '../account-setting-dialoge/account-setting-dialoge.component';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../../public/constants/constants';

interface ImageSnippet {
  file: File | null;
  url: string | ArrayBuffer | null;
}
// category-fields.model.ts
export interface CategoryField {
  label: string;
  type: 'select' | 'input';
  model: string;
  options?: { id: string; name: string }[];
  placeholder?: string;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  providers: [DecimalPipe],
  imports: [
    CommonModule,
    NgFor,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgFor,
    MatSnackBarModule,
    NgxDropzoneModule,
    PaymentComponent,
    StarRatingComponent,
    CurrentLocationComponent,
  ],
})
export class ProfilePageComponent {

  activeButtonPayment: number = 1;
  selectedCategorySlug:any
  editStartingPrice: any;
  edit_final_price: any;
  editStartingTime: any;
  editEndingTime: any;
  imageloading: any = false;
  selectedVideoFile: any;
  categoryForm: FormGroup;
  validationErrors: { [key: string]: string } = {};
  attributes: { [key: string]: any } = {};
  showOTPBox: boolean = false;
  progress!: number;
  defaultProfileUrl: string = '/assets/images/profile-icon.svg'; // /assets/images/profile-placeholder.png
  showMore: boolean = false;
  selectedTab: any;
  selectedTabItem: string = '';
  selectedTabId: any;
  activeButton: number = 2;
  showDiv: boolean = false;
  currentUserProfile: any;
  rating: number = 0; // Current rating
  maxRating: number = 1; // Maximum rating, default is 5
  ratingChange: any;
  imageUrl: string | ArrayBuffer | null = null;
  currentUserId: number = 0;
  user_Id: number = 0;
  title: string = '';
  editTitle: any;
  editPrice: any;
  editpricingCatId: any;
  editDescription: any;
  description: string = '';
  userImage: any;
  profilePhoto: File | null = null;
  selectedCategoryId: any;
  selectedSubCategoryId: any;
  pricingCatId: string = '';
  price: string = '';
  subCategoriesId: any;
  userSetting: any;
  final_price: any;
  startingTime: string = '';
  endingTime: string = '';
  startingDate: Date | null = null;
  endingDate: Date | null = null;
  productId: number = 0;
  locationId: any;
  jSonAttributes: any;
  startingPrice: string = '';
  lowestPrice: string = '';
  defaultsImage: string = 'assets/images/best-selling.png';
  public imagesFiles: File[] = [];
  EditImageFilesAbc: File[] = [];
  filesabc: File[] = [];
  imageFilesAbc: File[] = [];
  videoFilesAbc: File[] = [];
  showNotification: boolean = false;
  notificationList: any = [];
  customLink: any;
  allowRating: boolean = false;
  isDisabled: boolean = false;
  isEditPost: boolean = false;
  subCategory: any = [];
  categories: any = [];
  isLoading: boolean = false;
  editStartingDate: any;
  editEndingDate: any;
  soldList: any;
  private isNavigatingAway: boolean = false;
  sections = [
    {
      title: 'Transactions',
      items: [
        { id: 'purchasesSales', label: 'Purchases & Sales', icon: 'fas fa-shopping-cart' },
        { id: 'paymentDeposit', label: 'Payment & Deposit Method', icon: 'fas fa-credit-card' },
      ],
    },
    {
      title: 'Save',
      items: [
        { id: 'savedItems', label: 'Saved Items', icon: 'fas fa-heart' },
        { id: 'notification', label: 'Notifications', icon: 'fas fa-bell' },
      ],
    },
    {
      title: 'My Posts',
      items: [
        { id: 'editPost', label: 'Edit Post', icon: 'fas fa-edit' },
        { id: 'addPost', label: 'Add Post', icon: 'fas fa-plus-circle' },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'accountSetting', label: 'Account Setting', icon: 'fas fa-cog' },
        { id: 'boostPlus', label: 'Boost Plus', icon: 'fas fa-rocket' },
        { id: 'customLinks', label: 'Custom Profile Link', icon: 'fas fa-link' },
      ],
    },
    {
      title: 'Help',
      items: [{ id: 'helpCenter', label: 'Help Center', icon: 'fas fa-question' }],
    },
  ];
  
  showNotif() {
    this.showNotification = true;
  }
  pricingCategories: any = [
    { id: 'FixedPrice', name: 'Fixed Price' },
    { id: 'Auction', name: 'Auction' },
    { id: 'SellToTTOffer', name: 'Sell To TTOffer' },
  ];
  deliveryType: any = [
    { id: 'shipping', name: 'Shipping' },
    { id: 'local_delivery', name: 'Local Delivery' },
    { id: 'pick_up', name: 'Pick Up' },
  ];
  brandList: any = [
    { id: 'Samsung', name: 'Samsung' },
    { id: 'Apple', name: 'Apple' },
    { id: 'Huawei', name: 'Huawei' },
    { id: 'Xiaomi', name: 'Xiaomi' },
    { id: 'Infinix', name: 'Infinix' },
    { id: 'Motorola', name: 'Motorola' },
    { id: 'Sony', name: 'Sony' },
    { id: 'Nokia', name: 'Nokia' },
    { id: 'LG', name: 'LG' },
    { id: 'Oppo', name: 'Oppo' },
    { id: 'Vivo', name: 'Vivo' },
    { id: 'Realme', name: 'Realme' },
    { id: 'OnePlus', name: 'OnePlus' },
    { id: 'Google', name: 'Google' },
    { id: 'HTC', name: 'HTC' },
    { id: 'BlackBerry', name: 'BlackBerry' },
    { id: 'Lenovo', name: 'Lenovo' },
    { id: 'Asus', name: 'Asus' },
    { id: 'Tecno', name: 'Tecno' },
    { id: 'ZTE', name: 'ZTE' },
    { id: 'Micromax', name: 'Micromax' },
    { id: 'Honor', name: 'Honor' },
    { id: 'Itel', name: 'Itel' },
    { id: 'Panasonic', name: 'Panasonic' },
    { id: 'Alcatel', name: 'Alcatel' },
    { id: 'Meizu', name: 'Meizu' },
    { id: 'Coolpad', name: 'Coolpad' },
    { id: 'TCL', name: 'TCL' },
    { id: 'Sharp', name: 'Sharp' },
    { id: 'Philips', name: 'Philips' },
    { id: 'Other', name: 'Other' },
  ];
  
  brandElectornicsList: any = [
    { id: 'Dawlence', name: 'Dawlence' },
    { id: 'Pel', name: 'Pel' },
    { id: 'LG', name: 'LG' },
    { id: 'Samsung', name: 'Samsung' },
    { id: 'Bosch', name: 'Bosch' },
    { id: 'Kenmore', name: 'Kenmore' },
    { id: 'Amana', name: 'Amana' },
  ];
  conditionList: any = [
    { id: 'new', name: 'New' },
    { id: 'use', name: 'Used' },
    { id: 'Refurbished', name: 'Refurbished' },
    { id: 'Other', name: 'Other' },
  ];
  conditionKidsList: any = [
    { id: 'New', name: 'New' },
    { id: 'Used', name: 'Used' },
    { id: 'Open Box', name: 'Open Box' },
    { id: 'Other', name: 'Other' },
  ];
  storageList: any = [
    { id: '32GB', name: '32GB' },
    { id: '16GB', name: '16GB' },
    { id: '64GB', name: '64GB' },
    { id: '128GB', name: '128GB' },
    { id: '256GB', name: '256GB' },
    { id: '512GB', name: '512GB' },
    { id: '1 TB+', name: '1 TB+' },
  ];
  colorList: any = [
    { id: 'White', name: 'White' },
    { id: 'Black', name: 'Black' },
    { id: 'Red', name: 'Red' },
    { id: 'Blue', name: 'Blue' },
    { id: 'Green', name: 'Green' },
    { id: 'Yellow', name: 'Yellow' },
    { id: 'Gray', name: 'Gray' },
    { id: 'Silver', name: 'Silver' },
    { id: 'Gold', name: 'Gold' },
    { id: 'Orange', name: 'Orange' },
    { id: 'Purple', name: 'Purple' },
    { id: 'Pink', name: 'Pink' },
    { id: 'Brown', name: 'Brown' },
    { id: 'Maroon', name: 'Maroon' },
    { id: 'Beige', name: 'Beige' },
    { id: 'Turquoise', name: 'Turquoise' },
    { id: 'Teal', name: 'Teal' },
    { id: 'Navy', name: 'Navy' },
    { id: 'Ivory', name: 'Ivory' },
    { id: 'Magenta', name: 'Magenta' },
    { id: 'Cyan', name: 'Cyan' },
    { id: 'Lime', name: 'Lime' },
    { id: 'Olive', name: 'Olive' },
    { id: 'Peach', name: 'Peach' },
    { id: 'Burgundy', name: 'Burgundy' },
    { id: 'Charcoal', name: 'Charcoal' },
    { id: 'Mint', name: 'Mint' },
    { id: 'Lavender', name: 'Lavender' },
    { id: 'Other', name: 'Other' },
  ];
  
  occupancyStatus: any = [
    { id: 'Vacant', name: 'Vacant' },
    { id: 'Occupied', name: 'Occupied' },
    
  ];
  typeList: any = [{ id: 'Apartment', name: 'Apartment' }];
  
  bedRoomList: any = [
    { id: '1', name: '1' },
    { id: '2', name: '2' },
    { id: '3', name: '3' },
    { id: '4', name: '4' },
    { id: '5', name: '5' },
    { id: '5', name: '6' },
    { id: '5', name: '7' },
    { id: '5', name: '8' },
    { id: '5', name: '9' },
    { id: '5', name: '10' },
    { id: '5', name: '11' },
    { id: '5', name: '12' },
    { id: '5', name: '13' },
    { id: '6+', name: '13+' },
    { id: 'Studio', name: 'Studio' },
  ];
  areaSizeList: any = [{ id: '1,000 sqft', name: '1,000 sqft' }];
  yearBuilt: any = [{ id: '2020', name: '2020' }];
  feartureBuilt: any = [
    { id: 'Servant Quarters', name: 'Servant Quarters' },
    { id: 'Drawing Room', name: 'Drawing Room' },
    { id: 'Dining Room', name: 'Dining Room' },
    { id: 'Kitchen', name: 'Kitchen' },
    { id: 'Study Room', name: 'Study Room' },
    { id: 'Prayer Room', name: 'Prayer Room' },
    { id: 'Powder Room', name: 'Powder Room' },
    { id: 'Gym', name: 'Gym' },
    { id: 'Store Room', name: 'Store Room' },
    { id: 'Steam Room', name: 'Steam Room' },
    { id: 'Guest Room', name: 'Guest Room' },
    { id: 'Laundry Room', name: 'Laundry Room' },
    { id: 'Home Theater', name: 'Home Theater' },
    { id: 'Office', name: 'Office' },
    { id: 'Library', name: 'Library' },
    { id: 'Wine Cellar', name: 'Wine Cellar' },
    { id: 'Basement', name: 'Basement' },
    { id: 'Attic', name: 'Attic' },
    { id: 'Balcony', name: 'Balcony' },
    { id: 'Terrace', name: 'Terrace' },
    { id: 'Garden', name: 'Garden' },
    { id: 'Swimming Pool', name: 'Swimming Pool' },
    { id: 'Garage', name: 'Garage' },
  ];
  amenitiesList: any = [{ id: 'Apartment', name: 'Apartment' }];
  makeAndModelList: any = [
    { id: 'Audi', name: 'Audi' },
    { id: 'BMW', name: 'BMW' },
    { id: 'Corolla', name: 'Corolla' },
    { id: 'Mercedes-Benz', name: 'Mercedes-Benz' },
    { id: 'Tesla Model 3', name: 'Tesla Model 3' },
    { id: 'Ford Mustang', name: 'Ford Mustang' },
    { id: 'Chevrolet Camaro', name: 'Chevrolet Camaro' },
    { id: 'Honda Civic', name: 'Honda Civic' },
    { id: 'Toyota Prius', name: 'Toyota Prius' },
    { id: 'Nissan Altima', name: 'Nissan Altima' },
    { id: 'Hyundai Sonata', name: 'Hyundai Sonata' },
    { id: 'Volkswagen Passat', name: 'Volkswagen Passat' },
    { id: 'Porsche 911', name: 'Porsche 911' },
    { id: 'Lamborghini Huracan', name: 'Lamborghini Huracan' },
    { id: 'Ferrari F8', name: 'Ferrari F8' },
    { id: 'Kia Optima', name: 'Kia Optima' },
    { id: 'Jeep Wrangler', name: 'Jeep Wrangler' },
    { id: 'Range Rover', name: 'Range Rover' },
    { id: 'Mazda CX-5', name: 'Mazda CX-5' },
    { id: 'Subaru Outback', name: 'Subaru Outback' },
    { id: 'Chevrolet Tahoe', name: 'Chevrolet Tahoe' },
    { id: 'Dodge Charger', name: 'Dodge Charger' },
    { id: 'Volvo XC90', name: 'Volvo XC90' },
    { id: 'GMC Sierra', name: 'GMC Sierra' },
    { id: 'Toyota Hilux', name: 'Toyota Hilux' },
    { id: 'Ford F-150', name: 'Ford F-150' },
    { id: 'Honda Accord', name: 'Honda Accord' },
    { id: 'Suzuki Swift', name: 'Suzuki Swift' },
    { id: 'Peugeot 208', name: 'Peugeot 208' },
    { id: 'Mitsubishi Outlander', name: 'Mitsubishi Outlander' },
    { id: 'Jaguar XF', name: 'Jaguar XF' },
    { id: 'Fiat 500', name: 'Fiat 500' },
    { id: 'Lexus RX', name: 'Lexus RX' },
    { id: 'Hyundai Tucson', name: 'Hyundai Tucson' },
    { id: 'Ford Explorer', name: 'Ford Explorer' },
    { id: 'Mazda 3', name: 'Mazda 3' },
    { id: 'Nissan Rogue', name: 'Nissan Rogue' },
    { id: 'Chrysler Pacifica', name: 'Chrysler Pacifica' },
    { id: 'Chevrolet Malibu', name: 'Chevrolet Malibu' },
    { id: 'Cadillac Escalade', name: 'Cadillac Escalade' },
    { id: 'Toyota Camry', name: 'Toyota Camry' },
    { id: 'Ford Escape', name: 'Ford Escape' },
    { id: 'Volkswagen Tiguan', name: 'Volkswagen Tiguan' },
    { id: 'BMW X5', name: 'BMW X5' },
    { id: 'Audi Q5', name: 'Audi Q5' },
    { id: 'Kia Sportage', name: 'Kia Sportage' },
    { id: 'Honda CR-V', name: 'Honda CR-V' },
    { id: 'Hyundai Elantra', name: 'Hyundai Elantra' },
    { id: 'Mercedes GLE', name: 'Mercedes GLE' },
    { id: 'Jeep Cherokee', name: 'Jeep Cherokee' },
    { id: 'Tesla Model Y', name: 'Tesla Model Y' },
    { id: 'Toyota RAV4', name: 'Toyota RAV4' },
    { id: 'Subaru Forester', name: 'Subaru Forester' },
    { id: 'Nissan Pathfinder', name: 'Nissan Pathfinder' },
    { id: 'Dodge Durango', name: 'Dodge Durango' },
    { id: 'Lexus ES', name: 'Lexus ES' },
  ];
  yearList: any = [
    { id: '2021', name: '2021' },
    { id: '2000', name: '2000' },
    { id: '2001', name: '2001' },
  ];
  fuelTypeList: any = [
    { id: 'Diesel', name: 'Diesel' },
    { id: 'Petrol', name: 'Petrol' },
    { id: 'Gas', name: 'Gas' },
    { id: 'Other', name: 'Other' },
  ];

  engineCapacityList: any = [
    { id: '50cc', name: '50cc' },
    { id: '60cc', name: '60cc' },
    { id: '150cc', name: '150cc' },
    { id: '250cc', name: '250cc' },
    { id: '500cc', name: '500cc' },
    { id: '1000cc', name: '1000cc' },
    { id: 'Others', name: 'Others' },
  ];
  modelList: any = [{ id: 'Yamaha R1', name: 'Yamaha R1' }];
  jobtypeList: any = [
    { id: 'Graphic Design', name: 'Graphic Design' },
    { id: 'Software Engineer', name: 'Software Engineer' },
    { id: 'Electric Engineer', name: 'Electric Engineer' },
    { id: 'Mechanic', name: 'Mechanic' },
    { id: 'Painter', name: 'Painter' },
    { id: 'Others', name: 'Others' },
  ];
  experiencelist: any = [
    { id: 'Freshie', name: 'Freshie' },
    { id: 'Intermediate', name: 'Intermediate' },
    { id: 'Others', name: 'Others' },
  ];
  educationlist: any = [
    { id: 'Intermediate', name: 'Intermediate' },
    { id: 'High School', name: 'High School' },
    { id: "Bachelor's Degree", name: "Bachelor's Degree" },
    { id: "Master's Degree", name: "Master's Degree" },
    { id: 'PhD', name: 'PhD' },
    { id: 'Others', name: 'Others' },
  ];
  salaryList: any = [
    { id: '$30,000', name: '$30,000' },
    { id: '$50,000', name: '$50,000' },
    { id: '$60,000', name: '$60,000' },
    { id: 'Others', name: 'Others' },
  ];
  salaryPeriodList: any = [
    { id: 'Monthly', name: 'Monthly' },
    { id: 'Daily', name: 'Daily' },
    { id: 'Weekly', name: 'Weekly' },
    { id: 'Others', name: 'Others' },
  ];
  comanNameList: any = [
    { id: 'DevSinc', name: 'DevSinc' },
    { id: 'System Limited', name: 'System Limited' },
    { id: 'Neon System', name: 'Neon System' },
    { id: 'Others', name: 'Others' },
  ];
  positioinTypeList: any = [
    { id: 'Full Time', name: 'Full Time' },
    { id: 'Half Time', name: 'Half Time' },
    { id: 'Others', name: 'Others' },
  ];
  careerLevelList: any = [
    { id: 'Mid - Senior Level', name: 'Mid - Senior Level' },
    { id: 'Full - Senior Level', name: 'Full - Senior Level' },
    { id: 'Others', name: 'Others' },
  ];
  carList: any = [{ id: 'Corolla', name: 'Corolla' }];
  ageList: any = [
    { id: '1 year', name: '1 year' },
    { id: '2 year', name: '2 year' },
    { id: '3 year', name: '3 year' },
    { id: '4 year', name: '4 year' },
    { id: '5 year', name: '5 year' },
    { id: 'Others', name: 'Others' },
  ];
  breedList: any = [
    { id: 'Husky', name: 'Husky' },
    { id: 'Bully', name: 'Bully' },
    { id: 'Pointer', name: 'Pointer' },
    { id: 'Others', name: 'Others' },
  ];
  fashionTypeList: any = [
    { id: '1 seater', name: '1 seater' },
    { id: '2 seater', name: '2 seater' },
    { id: '3 seater', name: '3 seater' },
    { id: '4 seater', name: '4 seater' },
    { id: 'Others', name: 'Others' },
  ];
  fabricList: any = [{ id: 'Cotton', name: 'Cotton' }];
  suitTypeList: any = [{ id: 'Tuxedo', name: 'Tuxedo' }];
  toyList: any = [{ id: 'Doll', name: 'Doll' }];
  locationList: any = [{ id: 'America', name: 'America' }];
  compStatusId: any;
  CompletionStatusList: any = [
    { id: 'Off plan', name: 'Off plan' },
    { id: 'Ready', name: 'Ready' },
    { id: 'Other', name: 'Other' },
  ];
  furnisheableId: any;
  FurnishableList: any = [
    { id: 'Furnished', name: 'Furnished' },
    { id: 'Unfurnished', name: 'Unfurnished' },
  ];
  bathRoomId: any;
  BathRoomList: any = [
    { id: '1', name: '1' },
    { id: '2', name: '2' },
    { id: '3', name: '3' },
  ];
  categoryFields: { [key: string]: CategoryField[] } = {
    'mobiles': [
      {
        label: 'Brand',
        type: 'select',
        model: 'brand',
        options: this.brandList,
      },
      {
        label: 'Condition',
        type: 'select',
        model: 'condition',
        options: this.conditionKidsList,
      },
      {
        label: 'Storage Capacity',
        type: 'select',
        model: 'storage',
        options: this.storageList,
      },
      {
        label: 'Color',
        type: 'select',
        model: 'color',
        options: this.colorList,
      },
      {
        label: 'Delivery Type',
        type: 'select',
        model: 'Delivery',
        options: [
          { id: 'Local Delivery', name: 'Local Delivery' },
          { id: 'Pick Up', name: 'Pick up' },
          { id: 'Shipping', name: 'Shipping' },
        ],
      },
    ],
    'electronics-appliances': [
      {
        label: 'Brand',
        type: 'select',
        model: 'brand',
        options: this.brandElectornicsList,
      },
      {
        label: 'Condition',
        type: 'select',
        model: 'condition',
        options: this.conditionList,
      },
      {
        label: 'Color',
        type: 'select',
        model: 'color',
        options: this.colorList,
      },
      {
        label: 'Delivery Type',
        type: 'select',
        model: 'Delivery',
        options: [
          { id: 'Local Delivery', name: 'Local Delivery' },
          { id: 'Pick Up', name: 'Pick up' },
          { id: 'Shipping', name: 'Shipping' },
        ],
      },
    ],
    'property-for-rent': [
      {
        label: 'Year Built',
        type: 'input',
        model: 'yearBuilt',
        placeholder: 'Year Built',
      },
      {
        label: 'Bed Rooms',
        type: 'select',
        model: 'bedrooms',
        options: this.bedRoomList,
      },
      {
        label: 'Area/Size',
        type: 'input',
        model: 'area',
        placeholder: 'Area/Size in Sqft',
      },
      {
        label: 'Bath Room',
        type: 'select',
        model: 'bathRoom',
        options: this.BathRoomList,
      },
      {
        label: 'Condition',
        type: 'select',
        model: 'condition',
        options: this.conditionList,
      },
     
      {
        label: 'Completion',
        type: 'select',
        model: 'compStatus',
        options: this.CompletionStatusList,
      },
      {
        label: 'Delivery Type',
        type: 'select',
        model: 'Delivery',
        options: [
          { id: 'Local Delivery', name: 'Local Delivery' },
          { id: 'Pick Up', name: 'Pick up' },
          { id: 'Shipping', name: 'Shipping' },
        ],
      },
    ],
    'property-for-sale': [
      {
        label: 'Bed Rooms',
        type: 'select',
        model: 'bedrooms',
        options: this.bedRoomList,
      },
      {
        label: 'Area/Size',
        type: 'input',
        model: 'area',
        placeholder: 'Area/Size in Sqft',
      },
      {
        label: 'Bath Room',
        type: 'select',
        model: 'bathRoom',
        options: this.BathRoomList,
      },
      {
        label: 'Year Built',
        type: 'input',
        model: 'yearBuilt',
        placeholder: 'Year Built',
      },    
      {
        label: 'Features',
        type: 'select',
        model: 'fearture',
        options: this.feartureBuilt,
      },
      {
        label: 'Furnished',
        type: 'select',
        model: 'furnisheable',
        options: this.FurnishableList,
      },
      {
        label: 'Total Closing Fee',
        type: 'input',
        model: 'total_closing_fee',
        placeholder:'Total Closing Fee',
      },  
      {
        label: 'Developer',
        type: 'input',
        model: '_developer',
        placeholder:'Developer',
      }, 
      {
        label: 'Annual Community Fee',
        type: 'input',
        model: 'annual_community_fee',
        placeholder:'Annual Community Fee',
      },     
      {
        label: 'Property Reference ID #',
        type: 'input',
        model: 'property_reference_id',
        placeholder:'Property Reference ID #',
      },  
      {
        label: 'Buy Transfer Fee',
        type: 'input',
        model: 'buy_transfer_fee',
        placeholder:'Buy Transfer Fee',
      }, 
      {
        label: 'Seller Transfer Fee',
        type: 'input',
        model: 'seller_transfer_fee',
        placeholder:'Seller Transfer Fee',
      }, 
      {
        label: 'Maintenance Fee',
        type: 'input',
        model: 'maintenance_fee',
        placeholder:'Maintenance Fee',
      }, 
      {
        label: 'Occupancy Status',
        type: 'select',
        model: 'occupancy status',
        options: this.occupancyStatus,
      },
      {
        label: 'Completion',
        type: 'select',
        model: 'completion',
        options: this.CompletionStatusList,
      },
      
    ],
    'vehicles': [
      {
        label: 'Make and Model',
        type: 'select',
        model: 'Make and Model',
        options: this.makeAndModelList,
      },
      { label: 'Year', type: 'input', model: 'year', placeholder: 'Year' },
      {
        label: 'Condition',
        type: 'select',
        model: 'condition',
        options: this.conditionList,
      },
      {
        label: 'Mileage',
        type: 'input',
        model: 'mileage',
        placeholder: 'Mileage',
      },
      {
        label: 'Fuel Type',
        type: 'select',
        model: 'fuelType',
        options: this.fuelTypeList,
      },
      {
        label: 'Color',
        type: 'select',
        model: 'color',
        options: this.colorList,
      },
      {
        label: 'Delivery Type',
        type: 'select',
        model: 'Delivery',
        options: [
          { id: 'Local Delivery', name: 'Local Delivery' },
          { id: 'Pick Up', name: 'Pick up' },
          { id: 'Shipping', name: 'Shipping' },
        ],
      },
    ],
    '6': [
      {
        label: 'Engine Capacity',
        type: 'select',
        model: 'engineCapacity',
        options: this.engineCapacityList,
      },
      { label: 'Model', type: 'input', model: 'model', placeholder: 'Model' },
      {
        label: 'Delivery Type',
        type: 'select',
        model: 'Delivery',
        options: [
          { id: 'Local Delivery', name: 'Local Delivery' },
          { id: 'Pick Up', name: 'Pick up' },
          { id: 'Shipping', name: 'Shipping' },
        ],
      },
    ],
    'job': [
      {
        label: 'Type',
        type: 'select',
        model: 'type',
        options: this.jobtypeList,
      },
      {
        label: 'Experience',
        type: 'select',
        model: 'experience',
        options: this.experiencelist,
      },
      {
        label: 'Education',
        type: 'select',
        model: 'education',
        options: this.educationlist,
      },
      {
        label: 'Salary',
        type: 'select',
        model: 'salary',
        options: this.salaryList,
      },
      {
        label: 'Salary Period',
        type: 'select',
        model: 'salaryPeriod',
        options: this.salaryPeriodList,
      },
      {
        label: 'Company Name',
        type: 'select',
        model: 'companyName',
        options: this.comanNameList,
      },
      {
        label: 'Position Type',
        type: 'select',
        model: 'positionType',
        options: this.positioinTypeList,
      },
      {
        label: 'Career Level',
        type: 'select',
        model: 'careerLevel',
        options: this.careerLevelList,
      },
    ],
    'fashion-beauty': [
      {
        label: 'Product Description',
        type: 'input',
        model: 'description',
        placeholder:'Product Description',
      },
      {
        label: 'Delivery Type',
        type: 'select',
        model: 'Delivery',
        options: [
          { id: 'Local Delivery', name: 'Local Delivery' },
          { id: 'Pick Up', name: 'Pick up' },
          { id: 'Shipping', name: 'Shipping' },
        ],
      },
    ],
    'kids': [
      {
        label: 'Condition',
        type: 'select',
        model: 'condition',
        options: this.conditionKidsList,
      },
      {
        label: 'Delivery Type',
        type: 'select',
        model: 'Delivery',
        options: [
          { id: 'Local Delivery', name: 'Local Delivery' },
          { id: 'Pick Up', name: 'Pick up' },
          { id: 'Shipping', name: 'Shipping' },
        ],
      },
    ],
    'animals': [
      { label: 'Age',
        type: 'select',
        model: 'age', 
        options: this.ageList },
      {
        label: 'Breed',
        type: 'input',
        model: 'breed',
        placeholder:'Breed',
      },
      {
        label: 'Delivery Type',
        type: 'select',
        model: 'Delivery',
        options: [
          { id: 'Local Delivery', name: 'Local Delivery' },
          { id: 'Pick Up', name: 'Pick up' },
          { id: 'Shipping', name: 'Shipping' },
        ],
      },
    ],
  };

  // selectedFile: File | null = null;
  selectedFile: any;
  loading = false;
  editProductData: any = null;
  productForm!: FormGroup;
  constructor(
    private decimalPipe: DecimalPipe,
    private toastr: ToastrService,
    private mainServices: MainServicesService,
    private extension: Extension,
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    public cd: ChangeDetectorRef,
    public service: SharedDataService
  ) {
    this.currentUserId = this.extension.getUserId();
    this.categoryForm = this.fb.group({});
  }
  ngOnInit() {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
    let currentTab: any = localStorage.getItem('currentTab');

    if (
      currentTab === null ||
      currentTab === 'undefined' ||
      currentTab === ''
    ) {
      currentTab = 'purchasesSales';
    }
    this.route.queryParams.subscribe((params) => {
      if (params['button']) {
        this.activeButton = +params['button'];
      }
    });
    this.editProductData = localStorage.getItem('editProduct');
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        this.isNavigatingAway = true;
      });
    this.selectTab(currentTab);

    this.getNotification();
    this.startingDate = new Date();
    this.endingDate = new Date();
    this.customLink = window.location.href;
    this.selectedTabItem = this.route.snapshot.paramMap.get('name')!;
    this.selectedTabId = this.route.snapshot.paramMap.get('id');
    this.loadCategories();
    this.getSelling();
    this.getCurrentUser();
    this.wishListProduct();
  }
  loadCategories(): void {
    this.mainServices.getCategories(this.selectedTabId).subscribe(
      (data: any) => {
        this.categories = data.data;
        if (this.editProductData) {
          this.editProductData = JSON.parse(this.editProductData);
          this.selectedCategoryId = this.editProductData.category_id;
          this.selectedSubCategoryId = this.editProductData.sub_category_id;
          this.editTitle = this.editProductData.title;
          this.productId = JSON.parse(
            this.editProductData.attributes
          ).product_id;
          this.editDescription = this.editProductData.description;

          // Set pricingCatId based on ProductType
          if (this.editProductData.ProductType === 'featured') {
            this.editpricingCatId = 'FixedPrice';
            this.editPrice = this.editProductData.fix_price;
          } else if (this.editProductData.ProductType === 'auction') {
            this.editpricingCatId = 'Auction';
            this.editStartingPrice = this.editProductData.auction_price; // Bind starting price
            this.edit_final_price = this.editProductData.final_price; // Bind final price
            this.editStartingTime = this.editProductData.starting_time; // Bind starting time
            this.editEndingTime = this.editProductData.ending_time; // Bind ending time
            this.editStartingDate = this.editProductData.starting_date; // Bind starting date
            this.editEndingDate = this.editProductData.ending_date; // Bind ending date
          }

          this.getSubcategories(this.selectedCategoryId);
          this.initializeForm();
          this.categoryForm.patchValue(
            JSON.parse(this.editProductData.attributes)
          );
        } else {
          this.selectedCategoryId = this.categories[0].id;
          this.onCategoryChange(this.selectedCategoryId)
          this.pricingCatId = this.pricingCategories[0].id; // Set default for new entries
          this.getSubcategories(this.categories[0].id);
        }
      },
      (error) => {
      }
    );
  }
  initializeForm() {
    // Initialize form controls dynamically based on the selected category
    const fields = this.categoryFields[this.selectedCategorySlug];
    fields.forEach((field) => {
      this.categoryForm.addControl(
        field.model,
        this.fb.control('', Validators.required)
      );
    });
    if (this.categoryFields[this.selectedCategorySlug]) {
      this.categoryFields[this.selectedCategorySlug].forEach((field: any) => {
        // If the field type is select, set the default value to the first option
        if (field.type === 'select' && field.options.length > 0) {
          this.attributes[field.model] = field.options[0].id; // Set default to the first option
        }
      });
    }
  }

  openPage() {
    this.showDiv = true;
  }
  onSelectImage(event: any) {
    this.imagesFiles.push(...event.addedFiles);
  }
  copyCustomLink() {
    navigator.clipboard
      .writeText(this.customLink)
      .then(() => {
       
      })
      .catch((err) => {
      });
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    localStorage.setItem('currentTab', this.selectedTab);
    this.showDiv = false;
    this.showMore = false;
  }
  toggleActive(buttonIndex: number) {
    this.activeButton = buttonIndex;
  }
  toggleActivePayement(buttonIndex: number) {
    this.activeButtonPayment = buttonIndex;
  }
  sellingList: any = [];
  sellingListTemp: any = [];
  purchaseListTemp: any = [];
  purchaseSale: any[] = [];
  savedItems: any = [];
  paymentDeposit: any[] = [
    {
      img: 'assets/images/Applelogo.svg',
      detail1: 'Apply Pay',
      detail2: 'Default',
      id: 'flexRadioDefault1',
    },
    {
      img: 'assets/images/visalogo.svg',
      detail1: 'Visa',
      date: 'Expiry 06/2024',
      detail2: 'Set as default',
      btn: 'Edit',
      id: 'flexRadioDefault2',
    },
    {
      img: 'assets/images/StripLogo.svg',
      detail1: 'Mastercard',
      date: 'Expiry 06/2024',
      detail2: 'Set as default',
      btn: 'Edit',
      id: 'flexRadioDefault2',
    },
    {
      img: 'assets/images/GPay.svg',
      detail1: 'Google Pay',
      date: 'Expiry 06/2024',
      detail2: 'Set as default',
      btn: 'Edit',
      id: 'flexRadioDefault2',
    },
  ];
  selectedFiles: Array<{ src: string }> = [];
  selectedImagesList: File[] = [];
  selectedImageIndex: number = -1;
  selectedVideoIndex: number = -1;
  onEditFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.EditImageFilesAbc.push(event.target.files[i]);
        this.readFileAsDataURL(event.target.files[i]);
      }
      this.updateProductImage();
    }
  }
  onFileChange(event: any) {
    const allowedExtensions = ['png', 'jpg','jpeg'];
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();           
        if (allowedExtensions.includes(fileExtension || '')) {
          this.imageFilesAbc.push(file);
          this.readFileAsDataURL(file); 
        } else {
          this.validationErrors['uploadImage'] = 
            'Only .png and .jpg files are allowed.';
        }
      }
    } else {
      this.validationErrors['uploadImage'] = 'Please add at least one image.';
    }
    this.validateForm();
  }
  readFileAsDataURL(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedFiles.push({ src: reader.result as string });
      this.validateForm(); 
    };
    reader.readAsDataURL(file);
  }
  readEditFileAsDataURL(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.editProductData.data.push({ src: reader.result as string });
    };
    reader.readAsDataURL(file);
  }
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }
  openMore() {
    this.showMore = !this.showMore;
  }
  deleteSelectedImage(): void {
    if (
      this.selectedImageIndex > -1 &&
      this.selectedImageIndex < this.selectedFiles.length
    ) {
      this.selectedFiles.splice(this.selectedImageIndex, 1);
      this.selectedImageIndex = -1;
    }
  }
  deleteProductImage(file: any) {
    const input = {
      id: file.id,
      product_id: file.product_id,
    };
    this.mainServices.deleteProductImage(input).subscribe((res) => {
      this.toastr.success('Product image deleted successfully', 'Success');
      if (this.editProductData) {
        const editProductDataStr = localStorage.getItem('editProduct');
        if (editProductDataStr) {
          const editProductData = JSON.parse(editProductDataStr);
          editProductData.photo = editProductData.photo.filter(
            (photo: any) => photo.id !== input.id
          );
          localStorage.setItem('editProduct', JSON.stringify(editProductData));
          this.editProductData = editProductData; // Optional, if you want to keep it in sync
        }
      }
    });
  }
  async updateProductImage() {
    this.imageloading = true;
    let formData = new FormData();
    this.EditImageFilesAbc.forEach((file, index) => {
      formData.append(`src[]`, file, file.name);
    }); 
    formData.append(
      'product_id',
      this.productId ? Number(this.productId).toString() : '0'
    );
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        'https://www.ttoffer.com/backend/public/api/upload-image',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        this.EditImageFilesAbc = [];
        this.imageloading = false;
        localStorage.setItem('editProduct', JSON.stringify(data.data));
        this.editProductData = localStorage.getItem('editProduct');
        this.editProductData = JSON.parse(this.editProductData);
      } else {
      }
    } catch (error) {
    } finally {
      this.imageloading = false;
    }
  }
  async addProductImage() {
    this.imageloading = true;
    let formData = new FormData();
    this.imageFilesAbc.forEach((file, index) => {
      formData.append(`src[]`, file, file.name);
    });
    formData.append(
      'product_id',
      this.productId ? Number(this.productId).toString() : '0'
    );
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        'https://www.ttoffer.com/backend/public/api/upload-image',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
      } else {
        this.loading = false;
      }
    } catch (error) {
    } finally {
      this.loading = false;
      this.imageloading = false;
    }
  }
  confirmSelection(): void {
    if (
      this.selectedImageIndex > -1 &&
      this.selectedImageIndex < this.selectedFiles.length
    ) {
     
    }
  }
  selectedVideos: Array<{ url: string }> = [];
  selectedVideo: any | null = null
  onVideosSelected(event: any): void {
    const files = event.target.files;
    for (let file of files) {
      const videoURL = URL.createObjectURL(file);
      this.selectedVideos.push({ url: videoURL });
    }
  }
  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (this.selectedVideo) {
      this.toastr.error('You cannot upload more than one video.', 'Error');
      return;
    }
    if (file) {
      const maxFileSize = 20 * 1024 * 1024; // 20 MB in bytes
      if (file.size > maxFileSize) {
        this.toastr.error(
          'Video size exceeds the maximum limit of 20 MB.',
          'Error'
        );
        return;
      }
      const videoURL = URL.createObjectURL(file);
      this.selectedVideo = { url: videoURL, file: file };
    }
  }
  removeVideo(): void {
    this.selectedVideo = null; 
  }
  selectVideo(index: number): void {
    this.selectedVideoIndex = index;
  }
  deleteSelectedVideo(): void {
    if (
      this.selectedVideoIndex > -1 &&
      this.selectedVideoIndex < this.selectedVideos.length
    ) {
      this.selectedVideos.splice(this.selectedVideoIndex, 1);
      this.selectedVideoIndex = -1; 
    }
  }
  confirmVideoSelection(): void {
    if (
      this.selectedVideoIndex > -1 &&
      this.selectedVideoIndex < this.selectedVideos.length
    ) {
      
    }
  }
  openModal() {
    const modal = document.getElementById('editModal');
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
    const modal = document.getElementById('editModal');
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
  openNewCardModal() {
    const modal = document.getElementById('newCardModal');
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
  closeNewCardModal() {
    const modal = document.getElementById('newCardModal');
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

 
 
 
  openBoostModal() {
    const modal = document.getElementById('boostPlusModal');
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
  closeBoostModal() {
    const modal = document.getElementById('boostPlusModal');
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
  openBoostPlanModal() {
    const modal = document.getElementById('boostModal');
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
  closeBoostPlanModal() {
    const modal = document.getElementById('boostModal');
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
  onImageUpload(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
    this.updateProfile();
  }
  updateProfile(): void {
    if (this.selectedFile) {
      let formData = new FormData();
      formData.append('user_id', this.currentUserId.toString());
      formData.append('img', this.selectedFile);
      let url = `https://ttoffer.com/backend/public/api/update/user`;
      let token = localStorage.getItem('authToken')
      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response: any) => {
          return response.json();
        })
        .then((data) => {
          this.toastr.success(
            'Profile picture updated successfully!',
            'Success'
          );
          this.imageUrl = data.data.img;
          this.service.changeImageUrl(this.imageUrl);
          this.UpdateLocalUserData(data.data);
        })
        .catch((error) => {
          this.toastr.error(
            'Profile update failed. Please try again.',
            'Error'
          );
        });
    }
  }
  UpdateLocalUserData(data: any) {
    const jsonString = JSON.stringify(data);
    localStorage.setItem('key', jsonString);
    this.getCurrentUser();
  }

  validateForm(): boolean {
    this.validationErrors = {};
    if (!this.title) {
      this.validationErrors['title'] = 'Please add a title.';
    }
    if (!this.description) {
      this.validationErrors['description'] = 'Please add a description.';
    }
    if (!this.selectedCategoryId) {
      this.validationErrors['selectedCategoryId'] = 'Please select a category.';
    }
    if (!this.selectedSubCategoryId) {
      this.validationErrors['selectedSubCategoryId'] =
        'Please select a sub-category.';
    }
    if (this.selectedFiles.length == 0) {
      this.validationErrors['uploadImage'] = 'Please add at least one image.';
    }
    const requiredFields = this.categoryFields[this.selectedCategorySlug] || [];
    requiredFields.forEach((field) => {
      if (!this.attributes[field.model]) {
        this.validationErrors[field.model] = `${field.label} is required.`;
      }
    });
    switch (this.pricingCatId) {
      case 'Auction':
        if (!this.startingPrice) {
          this.validationErrors['startingPrice'] =
            'Starting price is required for Auction.';
        }
        if (!this.final_price) {
          this.validationErrors['final_price'] =
            'Lowest price is required for Auction.';
        }
        if (!this.startingTime) {
          this.validationErrors['startingTime'] =
            'Starting time is required for Auction.';
        }
        if (!this.endingTime) {
          this.validationErrors['endingTime'] =
            'Ending time is required for Auction.';
        }
        if (!this.startingDate) {
          this.validationErrors['startingDate'] =
            'Starting date is required for Auction.';
        }
        if (!this.endingDate) {
          this.validationErrors['endingDate'] =
            'Ending date is required for Auction.';
        }
        break;

      case 'FixedPrice':
        if (!this.price) {
          this.validationErrors['price'] = 'Price is required for Fixed Price.';
        }
        break;

      default:
        break;
    }
    return Object.keys(this.validationErrors).length === 0;
  }
  onFieldChange(fieldModel: string): void {
    if (this.validationErrors[fieldModel]) {
      delete this.validationErrors[fieldModel];
    }
  }
  handleLocationChange(location: {
    lat: number;
    lng: number;
    address: string;
  }): void {
    this.locationId = location;
  }
  async addCompleteProduct() {   
    if (!this.validateForm()) {
      return;
    }
    this.isLoading = true;
    let formData = new FormData();
    formData.append(
      'user_id',
      this.currentUserId ? Number(this.currentUserId).toString() : '0'
    );
    formData.append('title', this.title || '');
    formData.append('description', this.description || '');
    if (this.selectedVideo?.file) {
      formData.append(
        'video',
        this.selectedVideo.file,
        this.selectedVideo.file.name
      );
    }
    this.imageFilesAbc.forEach((file) => {
      formData.append('image[]', file, file.name);
    });
    formData.append('category_id', this.selectedCategoryId.toString());
    formData.append('sub_category_id', this.selectedSubCategoryId.toString());
    const mainCategory = String(
      this.getCategoryNameById(this.selectedCategoryId) || ''
    );
    const subCategory = String(
      this.getSubCategoryNameById(this.selectedSubCategoryId) || ''
    );  
   formData.append('main_category', JSON.stringify(mainCategory));
    formData.append('sub_category', JSON.stringify(subCategory));
    if (this.attributes['make_and_model']) formData.append('condition', this.attributes['condition']);
    if (this.attributes['make_and_model'])
      formData.append('make_and_model', this.attributes['make_and_model']);
    if (this.attributes['mileage'])
      formData.append('mileage', this.attributes['mileage']);
    if (this.attributes['color'])
      formData.append('color', this.attributes['color']);
    if (this.attributes['brand'])
      formData.append('brand', this.attributes['brand']);
    if (this.attributes['model'])
      formData.append('model', this.attributes['model']);
    if (this.attributes['Delivery'])
      formData.append('delivery_type', this.attributes['Delivery']);
    formData.append('edition', this.attributes['edition']);
    formData.append('authenticity', this.attributes['authenticity']);
    formData.append('attributes', JSON.stringify(this.attributes));
    if (this.pricingCatId === 'Auction') {
      formData.append('product_type', 'auction');
      formData.append(
        'auction_initial_price',
        this.startingPrice?.toString() || ''
      );
      formData.append(
        'auction_final_price',
        this.final_price?.toString() || ''
      );
      formData.append(
        'auction_starting_date',
        this.startingDate ? this.startingDate.toISOString().split('T')[0] : ''
      );
      formData.append(
        'auction_ending_date',
        this.endingDate ? this.endingDate.toISOString().split('T')[0] : ''
      ); 
      formData.append(
        'auction_starting_time',
        this.startingTime.toString() || ''
      );
      formData.append('auction_ending_time', this.endingTime.toString() || '');
    } else if (this.pricingCatId === 'FixedPrice') {
      formData.append('product_type', 'featured');
      formData.append('fix_price', this.price?.toString() || '');
    } else {
      formData.append('product_type', 'other');
    }
    if (this.locationId) formData.append('location', this.locationId.address);
    if (this.locationId) formData.append('latitude', this.locationId.lat);
    if (this.locationId) formData.append('longitude', this.locationId.lng);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${Constants.baseApi}/products`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        this.toastr.success('Product is live now!', 'Success');
        this.router.navigate(['']);
      } else {
        this.toastr.error('Product creation failed', 'Error');
      }
    } catch (error) {
      this.toastr.error('An error occurred while adding the product', 'Error');
    } finally {
      this.isLoading = false;
    }
  }
  getCategoryNameById(categoryId: number): string {
    const category = this.categories.find((cat: any) => cat.id == categoryId);
    return category ? category.name : '';
  }
  getSubCategoryNameById(subCategoryId: number): string {
    const subCategory = this.subCategory.find(
      (subCat: any) => subCat.id == subCategoryId
    );
    return subCategory ? subCategory.name : '';
  }

 

  formatPrice(price: any) {
    return this.decimalPipe.transform(price, '1.0-0') || '0';
  }
  getSelling() {
    this.loading = true;
    this.mainServices.getSelling().subscribe({
      next: (res: any) => {
        this.sellingList = res;
        this.loading = false;
        this.soldList = res.data?.archive.data;
        this.purchaseListTemp = res.data?.buying.data;
        this.sellingListTemp = res.data?.selling.data;
      },
      error: (err: any) => {
        this.loading = false;
      },
    });
  }
  getNotification() {
    this.loading = true;
    this.mainServices
      .getNotification(this.currentUserId)
      .subscribe((res: any) => {
        this.notificationList = res.data;
        this.notificationList = res.data.sort((a: any, b: any) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        this.loading = false;
      });
  }
  getCurrentUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const jsonStringGetData = localStorage.getItem('key');
      if (jsonStringGetData) {
        this.currentUserProfile = JSON.parse(jsonStringGetData);
        this.userSettings();
        this.allowRating = this.currentUserProfile.Id == this.currentUserId;
        this.imageUrl = this.currentUserProfile.img;
      } else {

      }
    }
  }
  userSettings() {
    this.userSetting = [
      {
        key: 'name',
        value: this.currentUserProfile.name,
        icon: 'fas fa-user fs-20',
        placeholder: 'User Name',
      },
      {
        key: 'phone',
        value: this.currentUserProfile.phone,
        icon: 'fas fa-phone fs-20',
        placeholder: 'Number',
      },
      {
        key: 'email',
        value: this.currentUserProfile.email,
        icon: 'fas fa-envelope fs-20',
        placeholder: 'Email',
      },
      {
        key: 'password',
        value: '********',
        icon: 'fas fa-lock fs-20',
        placeholder: 'Password',
      },
      {
        key: 'location',
        value: this.currentUserProfile.location,
        icon: 'fa fa-map-marker-alt fs-20 mr-2',
        placeholder: 'Location',
      },
    ];
  }
  openDialog(key: string, placeholder: any): void {
    const dialogRef = this.dialog.open(AccountSettingDialogeComponent, {
      width: '470px',
      height: '322px',
      data: { placeholder, key, currentUserProfile: this.currentUserProfile },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.key === 'password') {
          this.updateUserInfo(result.key, {
            old_password: result.old_password,
            password: result.password,
          });
        } else {
          this.updateUserInfo(result.key, result.value);
        }
      }
    });
  }
  onDeleteAccount(): void {
    this.router.navigate([`/user/delete-account/${this.currentUserId}`]);
  }
  updateUserInfo(field: string, value: any) {
    this.isDisabled = true;
    this.loading = true;
    let input;
    if (field === 'password') {
      input = {
        old_password: value.old_password,
        password: value.password,
      };
    } else {
      input = { [field]: value };
    }
    const updateMethods: any = {
      phone: () => this.mainServices.updateNumber(input),
      email: () => this.mainServices.updateEmail(input),
      password: () => this.mainServices.updatePassword(input),
      location: () => this.mainServices.updateLocation(input),
      name: () => this.mainServices.updateUserName(input),
    };
    if (updateMethods[field]) {
      updateMethods[field]().subscribe({
        next: (res: any) => {
          const jsonString = JSON.stringify(res.data);
          localStorage.setItem('key', jsonString);
          this.getCurrentUser();
          this.loading = false;
          this.isDisabled = false;
          this.toastr.success('Updated Successfully', 'Success');
        },
        error: (error: any) => {
          this.loading = false;
          this.isDisabled = false;
        },
      });
    } else {
      this.loading = false;
      this.isDisabled = false;
    }
  }
  wishListProduct() {
    var input = {
      user_id: this.currentUserId,
    };
    this.mainServices.wishListProduct(input).subscribe(
      (res: any) => {
        this.savedItems = res.data;
        this.savedItems.isAuction =
        this.savedItems.fix_price == null ? true : false;
      },
      (err: any) => {}
    );
  }

  parseDate(event: any, type: 'start' | 'end'): Date {
    const date = (event.target as HTMLInputElement).value;
    const selectedDate = date ? new Date(date) : new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    selectedDate.setHours(0, 0, 0, 0); 
    if (selectedDate < today) {
      event.target.value = '';
      return new Date(); 
    }
    if (type === 'end' && this.startingDate) {
      const startingDate = new Date(this.startingDate);
      startingDate.setHours(0, 0, 0, 0); 
      if (selectedDate < startingDate) {
        this.toastr.error(
          'Ending date cannot be earlier than the starting date.',
          'Error'
        );
        event.target.value = ''; 
        return this.startingDate; 
      }
    }

    return selectedDate;
  }
  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  parseETime(event: any): void {
    const selectedEndingTime = event.target.value;
    if (!this.startingTime) {
      this.toastr.error('Please select a starting time first.', 'Error');
      setTimeout(() => (this.endingTime = ''), 1);
      return;
    }
    const selectedStartingTime = this.startingTime;
    if (!this.startingDate || !this.endingDate) {
     
      setTimeout(() => (this.endingTime = ''), 1);
      return;
    }
    const selectedEndingDate = new Date(this.endingDate);
    const selectedStartingDate = new Date(this.startingDate);
    const startTime = new Date(
      `${selectedStartingDate.toDateString()} ${selectedStartingTime}`
    );
    const endTime = new Date(
      `${selectedEndingDate.toDateString()} ${selectedEndingTime}`
    );
    if (
      selectedStartingDate.toDateString() === selectedEndingDate.toDateString()
    ) {
      if (endTime <= startTime) {
        this.toastr.error(
          'Ending time cannot be less than or equal to the starting time',
          'Error'
        );
        setTimeout(() => (this.endingTime = ''), 1);
        return;
      }
      const timeDifference =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      if (timeDifference < 30) {
        this.toastr.error(
          'Ending time must be at least 30 minutes later than the starting time',
          'Error'
        );
        setTimeout(() => (this.endingTime = ''), 1);
        return;
      }
    }
    this.endingTime = selectedEndingTime;
  }
  parseSTime(event: any): void {
    const selectedStartingTime = event.target.value;
    if (!this.startingDate) {
      setTimeout(() => (this.startingTime = ''), 1);
      return;
    }
    const selectedStartingDate = new Date(this.startingDate);
    const currentDateTime = new Date();
    const [hours, minutes] = selectedStartingTime.split(':').map(Number);
    const startTime = new Date(
      selectedStartingDate.getFullYear(),
      selectedStartingDate.getMonth(),
      selectedStartingDate.getDate(),
      hours,
      minutes
    );
    if (
      selectedStartingDate.toDateString() === currentDateTime.toDateString()
    ) {
      if (startTime < currentDateTime) {
        this.toastr.error('Starting time cannot be in the past.', 'Error');
        setTimeout(() => (this.startingTime = ''), 1); // Clear the starting time input
        return;
      }
    }
    this.startingTime = selectedStartingTime;
  }
  formatDate(date: any): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return ''; // Return an empty string or a default value
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
  getCurrentTime(): string {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    return `${utcHours}:${utcMinutes}`;
  }

  getMinTime(type: 'start' | 'end'): string {
    const todayDate = this.getTodayDate();
    if (type === 'start') {
      if (this.startingDate) {
        const formattedStartDate = this.formatDate(this.startingDate);
        return formattedStartDate === todayDate
          ? this.getCurrentTime()
          : '00:00';
      }
      return '00:00';
    } else if (type === 'end') {
      if (this.endingDate) {
        const formattedEndDate = this.formatDate(this.endingDate);
        return formattedEndDate === todayDate ? this.getCurrentTime() : '00:00';
      }
      return '00:00';
    }
    return '00:00';
  }
  getSubcategories(categoryId: any): void {
    if (categoryId) {
      this.mainServices.getSubCategories(this.selectedCategoryId).subscribe(
        (data: any) => {
          this.subCategory = data.data;
          this.selectedSubCategoryId=this.subCategory[0].id
          this.attributes = {};
          this.initializeForm();
        },
        (error) => {}
      );
    } else {
      this.subCategory = []; 
    }
  }
  markAsSold(product: any) {
    localStorage.setItem('soldItems', JSON.stringify(product));
    this.router.navigate(['/markAsSold/', product.id]);
  }
  addCumtomLink() {
    let input = {
      custom_link: this.customLink,
    };
    this.mainServices.customLink(input).subscribe((res: any) => {
    });
  }
  onLocationFound(location: string) {
    this.locationId = location;
  }
 

  removeImage(index: number, event: Event): void {
    event.stopPropagation(); // Prevent triggering the selectImage function
    this.selectedFiles.splice(index, 1); // Remove the image from the array
    if (this.selectedImageIndex === index) {
      this.selectedImageIndex = -1; // Reset selected image if the deleted image was selected
    } else if (this.selectedImageIndex > index) {
      this.selectedImageIndex -= 1; // Adjust the selected image index if necessary
    }
  }
  ngOnDestroy() {
    if (this.isNavigatingAway) {
      localStorage.removeItem('editProduct');
    }
  }
  onCategoryChange(categoryId: number): void {
    
    const selectedCategory = this.categories.find((cat:any) => cat.id == categoryId);
    this.selectedCategorySlug = selectedCategory?.slug || null;
    this.attributes = {}; // Reset attributes when category changes
  }
  
}
