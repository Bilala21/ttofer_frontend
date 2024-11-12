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
    HeaderComponent,
    NgFor,
    MatDialogModule,
    FooterComponent,
    SellingComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgFor,
    MatSnackBarModule,
    NotificationComponent,
    NgxDropzoneModule,
    ReviewPageComponent,
    PaymentComponent,
    StarRatingComponent,
    CurrentLocationComponent,
  ],
})
export class ProfilePageComponent {
  activeButtonPayment: number = 1;
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
  showNotif() {
    this.showNotification = true;
  }
  pricingCategories: any = [
    { id: 'FixedPrice', name: 'Fixed Price' },
    { id: 'Auction', name: 'Auction' },
    { id: 'SellToTTOffer', name: 'Sell To TTOffer' },
  ];
  brandList: any = [
    { id: 'Samsung', name: 'Samsung' },
    { id: 'Infinix', name: 'Infinix' },
    { id: 'Xiaomi', name: 'Xiaomi' },
    { id: 'Motorola', name: 'Motorola' },
    { id: 'Huawei', name: 'Huawei' },
    { id: 'Apple', name: 'Apple' },
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
    { id: 'New', name: 'New' },
    { id: 'Used', name: 'Used' },
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
    { id: 'Other', name: 'Other' },
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
  CombitanStatusList: any = [
    { id: 'Off plan', name: 'Off plan' },
    { id: 'Ready', name: 'Ready' },
    { id: 'Other', name: 'Other' },
  ];
  furnisheableId: any;
  FurnishableList: any = [
    { id: 'All', name: 'All' },
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
    '1': [
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
        options: this.conditionList,
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
    ],
    '2': [
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
    ],
    '3': [
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
        label: 'Completion',
        type: 'select',
        model: 'compStatus',
        options: this.CombitanStatusList,
      },
    ],
    '4': [
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
    ],
    '5': [
      {
        label: 'Make and Model',
        type: 'select',
        model: 'make_and_model',
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
    ],
    '6': [
      {
        label: 'Engine Capacity',
        type: 'select',
        model: 'engineCapacity',
        options: this.engineCapacityList,
      },
      { label: 'Model', type: 'input', model: 'model', placeholder: 'Model' },
    ],
    '7': [
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
    '9': [
      {
        label: 'Choose Type',
        type: 'select',
        model: 'type',
        options: this.fashionTypeList,
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
    ],
    '11': [
      {
        label: 'Condition',
        type: 'select',
        model: 'condition',
        options: this.conditionKidsList,
      },
      { label: 'Toy', type: 'input', model: 'toy', placeholder: 'Toy' },
    ],
    '12': [
      { label: 'Age', type: 'select', model: 'age', options: this.ageList },
      {
        label: 'Breed',
        type: 'select',
        model: 'breed',
        options: this.breedList,
      },
    ],
  };

  // selectedFile: File | null = null;
  selectedFile: any;
  loading = false;
  editProductData: any = null;
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
    console.log(this.categoryForm, 'this.pricingCatId');
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
          this.pricingCatId = this.pricingCategories[0].id; // Set default for new entries
          this.getSubcategories(this.categories[0].id);
          this.initializeForm();
        }
      },
      (error) => {
        console.error('Error fetching categories:', error); // Handle error
      }
    );
  }
  initializeForm() {
    // Initialize form controls dynamically based on the selected category
    const fields = this.categoryFields[this.selectedCategoryId];
    fields.forEach((field) => {
      this.categoryForm.addControl(
        field.model,
        this.fb.control('', Validators.required)
      );
    });
    if (this.categoryFields[this.selectedCategoryId]) {
      this.categoryFields[this.selectedCategoryId].forEach((field: any) => {
        // If the field type is select, set the default value to the first option
        if (field.type === 'select' && field.options.length > 0) {
          this.attributes[field.model] = field.options[0].id; // Set default to the first option
        }
      });
    }
  }

  showfor() {
    console.log(this.categoryForm);
  }
  showOtp() {
    this.showOTPBox = true;
  }
  showSuccessMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }
  showErrorMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
  openPage() {
    this.showDiv = true;
  }
  onSelectImage(event: any) {
    console.log(event);
    this.imagesFiles.push(...event.addedFiles);
  }
  copyCustomLink() {
    navigator.clipboard
      .writeText(this.customLink)
      .then(() => {
        this.showSuccessMessage(
          `Profile link ${this.customLink} copied to clipboard!`
        );
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  }

  // handleInputChange() {
  //   console.log('Starting Time:', this.startingTime);
  //   console.log('Ending Time:', this.endingTime);
  //   console.log('Starting Date:', this.startingDate);
  //   console.log('Ending Date:', this.endingDate);
  // }

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
  purchaseSale: any[] = [
    // { img: 'assets/images/light-clothes-img.svg', heading: 'Modern light clothes', elipsImg1: 'assets/images/Ellipse1.svg', elipsImg2: 'assets/images/Ellipse2.svg', elipsImg3: 'assets/images/Ellipse3.svg', elipsImg4: 'assets/images/Ellipse4.svg', subHeading1: 'Sale Faster', subHeading2: 'Mark As Sold' },
    // { img: 'assets/images/light-img2.svg', heading: 'Modern light clothes', elipsImg1: 'assets/images/Ellipse1.svg', elipsImg2: 'assets/images/Ellipse2.svg', elipsImg3: 'assets/images/Ellipse3.svg', elipsImg4: 'assets/images/Ellipse4.svg', subHeading1: 'Sale Faster', subHeading2: 'Mark As Sold' },
    // { img: 'assets/images/light-img3.svg', heading: 'Modern light clothes', elipsImg1: 'assets/images/Ellipse1.svg', elipsImg2: 'assets/images/Ellipse2.svg', elipsImg3: 'assets/images/Ellipse3.svg', elipsImg4: 'assets/images/Ellipse4.svg', subHeading1: 'Sale Faster', subHeading2: 'Mark As Sold' },
    // { img: 'assets/images/light-clothes-img.svg', heading: 'Modern light clothes', elipsImg1: 'assets/images/Ellipse1.svg', elipsImg2: 'assets/images/Ellipse2.svg', elipsImg3: 'assets/images/Ellipse3.svg', elipsImg4: 'assets/images/Ellipse4.svg', subHeading1: 'Sale Faster', subHeading2: 'Mark As Sold' },
    // { img: 'assets/images/light-img2.svg', heading: 'Modern light clothes', elipsImg1: 'assets/images/Ellipse1.svg', elipsImg2: 'assets/images/Ellipse2.svg', elipsImg3: 'assets/images/Ellipse3.svg', elipsImg4: 'assets/images/Ellipse4.svg', subHeading1: 'Sale Faster', subHeading2: 'Mark As Sold' },
    // { img: 'assets/images/light-img3.svg', heading: 'Modern light clothes', elipsImg1: 'assets/images/Ellipse1.svg', elipsImg2: 'assets/images/Ellipse2.svg', elipsImg3: 'assets/images/Ellipse3.svg', elipsImg4: 'assets/images/Ellipse4.svg', subHeading1: 'Sale Faster', subHeading2: 'Mark As Sold' },
  ];

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

  // onFilesSelected(event: any): void {

  //   const files = event.target.files;
  //   this.selectedImagesList.push(files[0])
  //   for (let file of files) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.selectedFiles.push({ src: e.target.result });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // onFileSelected(event: Event) {
  //
  //   const input = event.target as HTMLInputElement;
  //   if (input.files) {
  //     this.filesabc = Array.from(input.files);
  //   } else {
  //     this.filesabc = [];
  //   }
  // }
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
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.imageFilesAbc.push(event.target.files[i]);
        this.readFileAsDataURL(event.target.files[i]);
      }
    }
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
  // onFilesSelected(event: any): void {
  //
  //   const files = event.target.files;
  //   for (let file of files) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.selectedFiles.push({ url: e.target.result });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

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
      //
      this.toastr.success('Product image deleted successfully', 'Success');

      if (this.editProductData) {
        // Retrieve existing editProductData from localStorage
        const editProductDataStr = localStorage.getItem('editProduct');
        if (editProductDataStr) {
          // Parse the existing data
          const editProductData = JSON.parse(editProductDataStr);

          // Filter the photo array to remove the photo with the specified id
          editProductData.photo = editProductData.photo.filter(
            (photo: any) => photo.id !== input.id
          );

          // Save the updated object back to localStorage
          localStorage.setItem('editProduct', JSON.stringify(editProductData));

          // Update the local instance if necessary
          this.editProductData = editProductData; // Optional, if you want to keep it in sync
        }
      }

      console.log(res);
    });
  }

  async updateProductImage() {
    this.imageloading = true;

    let formData = new FormData();

    // Append image files to formData
    this.EditImageFilesAbc.forEach((file, index) => {
      formData.append(`src[]`, file, file.name);
    });

    // Append product ID
    formData.append(
      'product_id',
      this.productId ? Number(this.productId).toString() : '0'
    );

    try {
      const token = localStorage.getItem('authToken');

      // Fetch request to upload the image
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
        //
        this.imageloading = false;
        localStorage.setItem('editProduct', JSON.stringify(data.data));
        this.editProductData = localStorage.getItem('editProduct');
        this.editProductData = JSON.parse(this.editProductData);
      } else {
        console.error('Image upload failed', await response.json());
      }
    } catch (error) {
      // Handle fetch error
      console.error('Image upload failed', error);
    } finally {
      this.imageloading = false;
    }
  }
  async addProductImage() {
    this.imageloading = true;

    let formData = new FormData();

    // Append image files to formData
    this.imageFilesAbc.forEach((file, index) => {
      formData.append(`src[]`, file, file.name);
    });

    // Append product ID
    formData.append(
      'product_id',
      this.productId ? Number(this.productId).toString() : '0'
    );

    try {
      const token = localStorage.getItem('authToken');

      // Fetch request to upload the image
      const response = await fetch(
        'https://www.ttoffer.com/backend/public/api/upload-image',
        {
          method: 'POST',
          body: formData,
          headers: {
            // 'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
      } else {
        this.loading = false;
        console.error('Image upload failed', await response.json());
      }
    } catch (error) {
      // Handle fetch error
      console.error('Image upload failed', error);
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
      console.log(
        'Image selected:',
        this.selectedFiles[this.selectedImageIndex]
      );
    }
  }

  selectedVideos: Array<{ url: string }> = [];
  selectedVideo: any | null = null;

  onVideosSelected(event: any): void {
    const files = event.target.files;
    for (let file of files) {
      const videoURL = URL.createObjectURL(file);
      this.selectedVideos.push({ url: videoURL });
    }
  }
  onVideoSelected(event: any): void {
    const file = event.target.files[0];

    // Check if a video is already selected
    if (this.selectedVideo) {
      this.toastr.error('You cannot upload more than one video.', 'Error');
      return;
    }

    // Check if the file exists
    if (file) {
      // Check the file size (20 MB limit)
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
    this.selectedVideo = null; // Clear the selected video
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
      this.selectedVideoIndex = -1; // Reset selection
    }
  }

  confirmVideoSelection(): void {
    if (
      this.selectedVideoIndex > -1 &&
      this.selectedVideoIndex < this.selectedVideos.length
    ) {
      // Perform any action needed on selection
      console.log(
        'Video selected:',
        this.selectedVideos[this.selectedVideoIndex]
      );
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

  closeUserNameModal() {
    const modal = document.getElementById('userNameModal');
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

  openNumberModal() {
    const modal = document.getElementById('numberModal');
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

  closeNumberModal() {
    const modal = document.getElementById('numberModal');
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

  openEmailModal() {
    const modal = document.getElementById('emailModal');
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
  openVerifyEmailModal() {
    const modal = document.getElementById('verifyEmailModal');
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

  closeVerifyEmailModal() {
    const modal = document.getElementById('verifyEmailModal');
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

  openVerifyPhoneModal() {
    const modal = document.getElementById('verifyPhoneModal');
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

  closeVerifyPhoneModal() {
    const modal = document.getElementById('verifyPhoneModal');
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

  closeEmailModal() {
    const modal = document.getElementById('emailModal');
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
  openPasswordModal() {
    const modal = document.getElementById('passwordModal');
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

  closePasswordModal() {
    const modal = document.getElementById('passwordModal');
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

  openLocationModal() {
    const modal = document.getElementById('locationModal');
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

  closeLocationModal() {
    const modal = document.getElementById('locationModal');
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
    // 
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
    this.updateProfile();
  }

  updateProfile(): void {
    if (this.selectedFile) {
      let formData = new FormData();
      console.log(this.selectedFile);
      formData.append('user_id', this.currentUserId.toString());
      formData.append('img', this.selectedFile);
      let url = `https://ttoffer.com/backend/public/api/update/user`;
      let token = localStorage.getItem('authToken');

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

  // triggerFileInput(): void {
  //   const fileInput = document.getElementById(
  //     'image-upload'
  //   ) as HTMLInputElement;
  //   fileInput.click();
  // }

  EditProductFirstStep() {
    let formData = new FormData();
    this.filesabc.forEach((file) => formData.append('video', file, file.name));
    this.imageFilesAbc.forEach((file, index) => {
      formData.append(`video[]`, file, file.name);
    });
    formData.append(
      'user_id',
      (this.currentUserId ? Number(this.currentUserId) : 0).toString()
    );
    formData.append('title', this.editTitle);
    formData.append('description', this.editDescription);
    formData.append(
      'product_id',
      (this.productId ? Number(this.productId) : 0).toString()
    );
    const token = localStorage.getItem('authToken');
    this.isLoading = true;
    fetch(
      'https://www.ttoffer.com/backend/public/api/edit-product-first-step',
      {
        method: 'POST',
        body: formData,
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }
    )
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => {
        console.log('File upload successful', data);
        this.productId = data.product_id;
        this.EditProductSeccondStep(); // Call the next step if upload is successful
      })
      .catch((error) => {
        this.isLoading = false;
        console.error('File upload failed', error);
      });
  }
  validateForm(): boolean {
    // ;
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

    // Validate attributes for the selected category
    const requiredFields = this.categoryFields[this.selectedCategoryId] || [];
    requiredFields.forEach((field) => {
      if (!this.attributes[field.model]) {
        this.validationErrors[field.model] = `${field.label} is required.`;
      }
    });

    // Specific validation for different pricing categories
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
  async addCompleteProduct() {
    if (!this.validateForm()) {
        return;
    }

    this.isLoading = true;

    let formData = new FormData();
    formData.append('user_id', this.currentUserId ? Number(this.currentUserId).toString() : '0');
    formData.append('title', this.title || '');
    formData.append('description', this.description || '');

    if (this.selectedVideo?.file) {
        formData.append('video', this.selectedVideo.file, this.selectedVideo.file.name);
    }

    this.imageFilesAbc.forEach((file) => {
        formData.append('image[]', file, file.name);
    });

    formData.append('category_id', this.selectedCategoryId.toString());
    formData.append('sub_category_id', this.selectedSubCategoryId.toString());
    
   
    // Append non-empty attribute values
    // if (this.attributes['condition']) formData.append('condition', this.attributes['condition']);
    // if (this.attributes['make_and_model']) formData.append('make_and_model', this.attributes['make_and_model']);
    // if (this.attributes['mileage']) formData.append('mileage', this.attributes['mileage']);
    // if (this.attributes['color']) formData.append('color', this.attributes['color']);
    // if (this.attributes['brand']) formData.append('brand', this.attributes['brand']);
    // if (this.attributes['model']) formData.append('model', this.attributes['model']);
    // if (this.attributes['edition']) formData.append('edition', this.attributes['edition']);
    // if (this.attributes['authenticity']) formData.append('authenticity', this.attributes['authenticity']);

    // Append JSON stringified attributes
    formData.append('attributes', JSON.stringify(this.attributes));

    // Add pricing and auction information
    if (this.pricingCatId === 'Auction') {
        formData.append('productType', 'auction');
        formData.append('auction_price', this.startingPrice?.toString() || '');
        formData.append('starting_date', this.startingDate?.toISOString() || '');
        formData.append('starting_time', this.startingTime.toString() || '');
        formData.append('ending_date', this.endingDate?.toISOString() || '');
        formData.append('ending_time', this.endingTime.toString() || '');
    } else if (this.pricingCatId === 'FixedPrice') {
        formData.append('productType', 'featured');
        formData.append('fix_price', this.price?.toString() || '');
    } else {
        formData.append('productType', 'other');
    }

    // Add location if not empty
    if (this.locationId) formData.append('location', this.locationId);

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
            console.error('Product creation failed', data);
            this.toastr.error('Product creation failed', 'Error');
        }
    } catch (error) {
        console.error('An error occurred while adding the product:', error);
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

  async addProductSecondStep() {
    this.attributes['category_id'] = this.selectedCategoryId;
    this.attributes['category_name'] = this.getCategoryNameById(
      this.selectedCategoryId
    );
    this.attributes['sub_category_id'] = this.selectedSubCategoryId;
    this.attributes['sub_category_name'] = this.getSubCategoryNameById(
      this.selectedSubCategoryId
    );
    let input = {
      product_id: this.productId,
      category_id: this.selectedCategoryId,
      sub_category_id: this.selectedSubCategoryId,
      condition: this.attributes['condition'], // Extract condition from attributes
      make_and_model: this.attributes['make_and_model'], // Extract make and model from attributes
      mileage: this.attributes['mileage'], // Extract mileage from attributes
      color: this.attributes['color'], // Extract color from attributes
      brand: this.attributes['brand'], // Extract brand from attributes
      model: this.attributes['model'], // Extract model from attributes
      edition: '',
      authenticity: '',
      attributes: JSON.stringify(this.attributes), // Convert attributes to JSON string
    };

    try {
      const res = await this.mainServices
        .addProductSecondStep(input)
        .toPromise();
      await this.addProductThirdStep();
    } catch (error) {
      this.isLoading = false;
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async addProductThirdStep() {
    let input;

    if (this.pricingCatId === 'Auction') {
      input = {
        productType: 'auction',
        product_id: this.productId,
        auction_price: this.startingPrice,
        starting_date: this.startingDate?.toISOString(),
        starting_time: this.startingTime.toString(),
        ending_date: this.endingDate?.toISOString(),
        ending_time: this.endingTime.toString(),
        final_price: this.final_price,
      };
    } else if (this.pricingCatId === 'FixedPrice') {
      input = {
        productType: 'featured',
        product_id: this.productId,
        fix_price: this.price,
      };
    } else {
      input = { product_id: this.productId, productType: 'other' };
    }

    try {
      const res = await this.mainServices
        .addProductThirdStep(input)
        .toPromise();
      await this.addProductLastStep();
    } catch (error) {
      this.isLoading = false;
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async addProductLastStep() {
    let input = {
      product_id: this.productId,
      location: this.locationId,
    };

    try {
      const res: any = await this.mainServices
        .addProductLastStep(input)
        .toPromise();
      this.toastr.success('Product is live now!', 'Success');
      this.isLoading = false;
      this.router.navigate(['']);
    } catch (error) {
      this.isLoading = false;
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  // Centralized error handling
  handleError(error: any) {
    this.loading = false;
  }

  EditProductSeccondStep() {
    try {
      let input = {
        user_id: this.currentUserId,
        product_id: this.productId,
        category_id: this.selectedCategoryId,
        sub_category_id: this.selectedSubCategoryId,
        condition: this.categoryForm.get('condition')?.value,
        make_and_model: this.categoryForm.get('make_and_model')?.value,
        mileage: this.categoryForm.get('mileage')?.value,
        color: this.categoryForm.get('color')?.value,
        brand: this.categoryForm.get('brand')?.value,
        model: this.categoryForm.get('model')?.value,
        edition: '',
        authenticity: '',
        attributes: JSON.stringify(this.categoryForm.value),
      };

      this.mainServices.editProductSecondStep(input).subscribe(
        (res) => {
          this.EditProductThirdStep();
          console.log(res);
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
        }
      );
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  EditProductThirdStep() {
    this.loading = true;
    try {
      let input;
      if (this.editpricingCatId === 'Auction') {
        input = {
          productType: 'auction',
          product_id: this.productId,
          auction_price: this.editStartingPrice.toString(),
          starting_date: this.editStartingDate
            ? new Date(this.editStartingDate).toISOString()
            : null,
          starting_time: this.editStartingTime.toString(),
          ending_date: this.editEndingDate
            ? new Date(this.editEndingDate).toISOString()
            : null,
          ending_time: this.editEndingTime.toString(),
          final_price: this.edit_final_price,
        };
      } else if (this.editpricingCatId === 'FixedPrice') {
        input = {
          productType: 'featured',
          product_id: this.productId,
          fix_price: this.editPrice,
          auction_price: null,
        };
      } else {
        input = {
          productType: 'other',
          product_id: this.productId,
          // fix_price: this.price,
        };
      }

      this.mainServices.editProductThirdStep(input).subscribe(
        (res) => {
          this.editProductLastStep();
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
        }
      );
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  editProductLastStep() {
    this.loading = true;
    try {
      let input = {
        product_id: this.productId,
        location: this.locationId,
      };

      this.mainServices.editProductLastStep(input).subscribe(
        (res: any) => {
          localStorage.removeItem('editProduct');
          this.toastr.success('Product updated successfully', 'Success');
          console.log(res);
          this.isLoading = false;
          this.router.navigate(['']);
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
        }
      );
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }
  formatPrice(price: any) {
    return this.decimalPipe.transform(price, '1.0-0') || '0';
  }
  getSelling() {
    this.loading = true;
    this.mainServices.getSelling().subscribe({
      next: (res: any) => {
        this.sellingList = res;
        console.log(res);
        this.loading = false;
        ;
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
        // 
        this.notificationList = res.data;
        this.notificationList = res.data.sort((a: any, b: any) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        console.log('Notification:', this.notificationList);
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
        console.warn('localStorage is not available.');
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
      // Pass both old and new passwords as input
      input = {
        old_password: value.old_password,
        password: value.password,
      };
    } else {
      // Pass single value for other fields
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
          console.log(res);
          const jsonString = JSON.stringify(res.data);
          localStorage.setItem('key', jsonString);
          this.getCurrentUser();
          this.loading = false;
          this.isDisabled = false;
          this.toastr.success('Updated Successfully', 'Success');
        },
        error: (error: any) => {
          console.error(error);
          this.loading = false;
          this.isDisabled = false;
        },
      });
    } else {
      console.error(`No method found for updating ${field}`);
      this.loading = false;
      this.isDisabled = false;
    }
  }

  wishListProduct() {
    // this.loading = true
    var input = {
      user_id: this.currentUserId,
    };
    this.mainServices.wishListProduct(input).subscribe(
      (res: any) => {
        
        this.savedItems = res.data;

        this.savedItems.isAuction =
          this.savedItems.fix_price == null ? true : false;
        // this.loading = false;
      },
      (err: any) => {}
    );
  }
  // parseDate(event: any): Date {

  //   let date = (event.target as HTMLTextAreaElement).value;
  //   let dateString: string = date;
  //   if (dateString) {
  //     return new Date(dateString);
  //   }
  //   return new Date();
  // }
  // parseSTime(event: Event): any {

  //   const input = event.target as HTMLInputElement;
  //   this.startingTime = input.value;
  // }
  // parseETime(event: Event): any {

  //   const input = event.target as HTMLInputElement;
  //   this.endingTime = input.value;
  // }
  // parseDate(event: any): Date {
  //   const date = (event.target as HTMLInputElement).value;
  //   return date ? new Date(date) : new Date();
  // }
  parseDate(event: any, type: 'start' | 'end'): Date {
    const date = (event.target as HTMLInputElement).value;
    const selectedDate = date ? new Date(date) : new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for comparison
    selectedDate.setHours(0, 0, 0, 0); // Ensure no time component for comparison

    // Check if the selected date is in the past
    if (selectedDate < today) {
      event.target.value = ''; // Clear the input field
      return new Date(); // Return the current date as a fallback
    }

    // Additional check for end date
    if (type === 'end' && this.startingDate) {
      const startingDate = new Date(this.startingDate);
      startingDate.setHours(0, 0, 0, 0); // Reset time for comparison

      if (selectedDate < startingDate) {
        // Ending date is less than the starting date
        this.toastr.error(
          'Ending date cannot be earlier than the starting date.',
          'Error'
        );
        event.target.value = ''; // Clear the ending date input
        return this.startingDate; // Return the starting date as fallback
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
      this.showErrorMessage('Invalid date selected.');
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
      this.showErrorMessage('Invalid date selected.');
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

  // Format a Date object as 'yyyy-MM-dd'
  formatDate(date: any): string {
    // If the input is a string, convert it to a Date object
    if (typeof date === 'string') {
      date = new Date(date);
    }

    // Check if date is a valid Date object
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date object passed:', date);
      return ''; // Return an empty string or a default value
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Example method to get today's date as 'yyyy-MM-dd'
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Method to get current time in 'HH:MM' format
  getCurrentTime(): string {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    return `${utcHours}:${utcMinutes}`;
  }

  // Get minimum time based on the selected date
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
        },
        (error) => {}
      );
    } else {
      this.subCategory = []; // Clear subcategories if no category is selected
    }
  }
  markAsSold(product: any) {
    // 
    localStorage.setItem('soldItems', JSON.stringify(product));
    this.router.navigate(['/markAsSold/', product.id]);
  }

  addCumtomLink() {
    let input = {
      custom_link: this.customLink,
    };
    this.mainServices.customLink(input).subscribe((res: any) => {
      res;
      this.showSuccessMessage(res.message);
      console.log('customLInt', res);
    });
  }
  onLocationFound(location: string) {
    ;
    this.locationId = location;
  }
  cat(cat: any) {
    cat;
  }
  subcat(subCat: any) {
    subCat;
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
    // Remove editPost data from localStorage if navigating away
    if (this.isNavigatingAway) {
      localStorage.removeItem('editProduct');
    }
  }
}
