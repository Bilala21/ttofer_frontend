import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CurrentLocationComponent } from '../../../../../pages/current-location/current-location.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { attributes } from '../../../json-data';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { Extension } from '../../../../../helper/common/extension/extension';
import { Router } from '@angular/router';
import { Constants } from '../../../../../../../public/constants/constants';
@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [NgFor,NgIf,NgClass,CurrentLocationComponent,FormsModule,ReactiveFormsModule,DropdownModule,InputTextModule,InputNumberModule,CalendarModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss'
})
export class PostFormComponent {
  pricingCategories: any = [
    { id: 'featured', name: 'Fixed Price' },
    { id: 'auction', name: 'Auction' },
    { id: 'other', name: 'Sell To TTOffer' },
  ];
  currentDate: Date = new Date();
  minDate: Date = new Date();
  rangeDates = [new Date(), new Date()]; // Incorrect if both values are the same
  validationErrors: { [key: string]: string } = {};
  productImageFiles: File[] = [];
  selectedFiles: Array<{ src: string }> = [];
  selectedVideos: Array<{ url: string }> = [];
  selectedVideo: any | null = null
  addProductForm!:FormGroup
  subCategory:any[]=[]
  categories:any=[]
  isLoading:any=false
  selectedCategorySlug:any
  attributes:any=attributes
  categoryFields: any = {};
  @ViewChild('datePickerPromotion', { static: false }) datePickerPromotion!: ElementRef;
  productType:any='auction'
  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,private router:Router,
    private mainServices: MainServicesService,private extension:Extension
  ) {
    this.minDate = new Date();
    this.minDate.setSeconds(0, 0); 
        this.addProductForm = this.fb.group({
      user_id:[''],
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category_id: ['', Validators.required],
      sub_category_id: ['', Validators.required],
      auction_initial_price: [''],
      auction_final_price: [''],
      auction_starting_time: [''],
      auction_ending_time: ['', [ this.endingTimeValidator.bind(this)]],  
      auction_start_date: [this.currentDate], // Default value set to current date
      auction_end_date: [this.currentDate],   // Default value set to current date
      fix_price: [''],
      product_type:[''],
      latitude:[''],
      longitude:[''],
      location:[''],
      main_category:[''],
      sub_category:[''],
      attributes: this.fb.group({}) 
    });
  this.addProductForm.patchValue({
    user_id:this.extension.getUserId()
  })
  this.addProductForm.patchValue({
    product_type:this.productType // Set the default value you want
  });
    // Fetch categories initially
    this.loadCategories();
     // Enable/disable time selection based on start and end date
    
    // Listen to category_id changes
    this.addProductForm.get('category_id')?.valueChanges.subscribe((categoryId) => {
      const category = this.categories.find((cat: any) => cat.id == categoryId);
      if (category) {
        this.selectedCategorySlug = category.slug;
        this.addProductForm.patchValue({
          main_category:JSON.stringify( category.name),
        })
        this.addProductForm.setControl('attributes', this.fb.group({}));
        // Initialize form controls for the selected category
        this.initializeForm();
  
        // Fetch subcategories
        this.getSubcategories(categoryId);
      }
    });
    this.addProductForm.get('sub_category_id')?.valueChanges.subscribe((subcategoryId) => {
      const subCategory = this.subCategory.find((cat: any) => cat.id == subcategoryId);
      if (subCategory) {
        this.addProductForm.patchValue({
          sub_category:JSON.stringify( subCategory.name) ,
        })
  
      }
    });
  }
  endingTimeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startTime = this.addProductForm?.get('auction_starting_time')?.value;
    if (startTime && control.value) {
      const startDate = new Date(startTime);
      const endDate = new Date(control.value);

      // Check if the ending time is at least 30 minutes after the starting time
      if ((endDate.getTime() - startDate.getTime()) < 30 * 60 * 1000) {
        return { notEnoughTime: true };
      }
    }
    return null;
  }

  onDateRangeSelect(rangeDates: Date[]) {
    if (rangeDates && rangeDates.length === 2) {
      const startDate = this.formatDate(rangeDates[0]);
      const endDate = this.formatDate(rangeDates[1]);
      this.addProductForm.patchValue({
        auction_starting_date: startDate,
        auction_ending_date: endDate,
      });
    }
  }
  // onTimeChange(fieldName: string, event: any) {
  //   debugger
  //   const time = event && event instanceof Date ? this.formatTime(event) : null;
  //   if (time) {
  //     this.addProductForm.patchValue({
  //       [fieldName]: time,
  //     });
  //   }
  // }
  onTimeChange(timeType: string, event: Date): void {
    const startDate = this.addProductForm.get('auction_start_date')?.value;
    const startTime = this.addProductForm.get('auction_starting_time')?.value;
    const endTime = this.addProductForm.get('auction_ending_time')?.value;
    
    // Check if the start date is the current date and validate the time against the current time
    if (startDate && new Date(startDate).toDateString() === new Date().toDateString()) {
      const currentTime = new Date();
      if (timeType === 'auction_starting_time' && startTime && new Date(startTime).getTime() < currentTime.getTime()) {
        this.toastr.warning('Start time cannot be in the past.');
        this.addProductForm.get('auction_starting_time')?.reset();
        return;
      }
      if (timeType === 'auction_ending_time' && endTime && new Date(endTime).getTime() < currentTime.getTime()) {
        this.toastr.warning('End time cannot be in the past.');
        this.addProductForm.get('auction_ending_time')?.reset();
        return;
      }
    }
  
    if (timeType === 'auction_starting_time') {
      if (endTime && new Date(endTime).getTime() < new Date(startTime).getTime()) {
        // If end time is already set and less than start time, show warning and reset end time
        this.toastr.warning('End time must be at least 30 minutes after the start time.');
        this.addProductForm.get('auction_ending_time')?.reset();
        return;
      }
    } else if (timeType === 'auction_ending_time') {
      if (!startTime) {
        // Show notification if start time is not selected
        this.toastr.warning('Please select the start time first.');
        this.addProductForm.get('auction_ending_time')?.reset();
        return;
      }
  
      // Only check the 30-minute condition if the end time is different from the initial value
      if (endTime) {
        const timeDifference = (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60);
        if (timeDifference < 30) {
          this.toastr.warning('Ending time must be at least 30 minutes after the starting time.');
          // Do not reset here, so the user can modify the time.
          return;
        }
      }
    }
  }
  
  
  formatTime(date: Date): string {
    // Formats the Date object to HH:mm
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Example: Converts to YYYY-MM-DD
  }
  loadCategories(): void {
    this.mainServices.getCategories().subscribe({
      next:(response:any)=>{
        this.categories=response.data;
        this.addProductForm.patchValue({
          category_id: this.categories[0].id
        })
        this.getSubcategories(this.categories[0].id)
      }
    })
      
  }
  onDateSelect(event: any): void {
    debugger
    console.log('Selected range:', this.rangeDates);
  }
  handleLocationChange(location: {
    latitude: number;
    longitude: number;
    location: string;
  }): void {
    this.addProductForm.patchValue(location);
  }
  getSubcategories(categoryId: string): void {
    if (categoryId) {
      this.mainServices.getSubCategories(categoryId).subscribe(
        (data: any) => {
          this.subCategory = data.data;
          this.addProductForm.patchValue({
            sub_category_id: this.subCategory[0].id
          })
        },
        (error) => {}
      );
    } else {
      this.subCategory = []; 
    }
  }
  onFileChange(event: any) {
    const allowedExtensions = ['png', 'jpg','jpeg'];
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();           
        if (allowedExtensions.includes(fileExtension || '')) {
          this.productImageFiles.push(file);
          this.readFileAsDataURL(file); 
        } else {
          // this.validationErrors['uploadImage'] = 
          //   'Only .png and .jpg files are allowed.';
        }
      }
    } else {
      // this.validationErrors['uploadImage'] = 'Please add at least one image.';
    }
    // this.validateForm()
  }
  readFileAsDataURL(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedFiles.push({ src: reader.result as string });
      // this.validateForm(); 
    };
    reader.readAsDataURL(file);
  }
  removeImage(index: number, event: Event): void {
    event.stopPropagation(); 
    debugger
    this.selectedFiles.splice(index, 1); 
    this.productImageFiles.splice(index, 1); 
  }
  onFieldChange(fieldModel: string): void {
    if (this.validationErrors[fieldModel]) {
      delete this.validationErrors[fieldModel];
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
  initializeForm() {
    if (!this.selectedCategorySlug) return;
  
    // Get the fields for the selected category
    this.categoryFields = this.attributes[this.selectedCategorySlug];
  
    // Reference the attributes FormGroup
    const attributesGroup = this.addProductForm.get('attributes') as FormGroup;
  
    // Add controls dynamically based on the categoryFields
    this.categoryFields.forEach((field: any) => {
      if (!attributesGroup.contains(field.model)) {
        let defaultValue = ''; // Default to empty string
  
        // If the field type is 'select', set the first option as the default value
        if (field.type === 'select' && field.options && field.options.length > 0) {
          defaultValue = field.options[0].id;
        }
  
        attributesGroup.addControl(
          field.model,
          this.fb.control(defaultValue, Validators.required) // Add required validator
        );
      }
    });
  }
  
  
  
  async addCompleteProduct() {
    const formData = new FormData();
    debugger;
  
    // Append files if `image` contains file objects
    this.productImageFiles.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
  
    const attributes = this.addProductForm.get('attributes')?.value;
  
    // Append non-empty attributes fields
    if (attributes) {
      if (attributes['condition']) formData.append('condition', attributes['condition']);
      if (attributes['make_and_model']) formData.append('make_and_model', attributes['make_and_model']);
      if (attributes['mileage']) formData.append('mileage', attributes['mileage']);
      if (attributes['color']) formData.append('color', attributes['color']);
      if (attributes['brand']) formData.append('brand', attributes['brand']);
      if (attributes['model']) formData.append('model', attributes['model']);
      if (attributes['Delivery']) formData.append('delivery_type', attributes['Delivery']);
      formData.append('edition', attributes['edition']);
     formData.append('authenticity', attributes['authenticity']);
    }
  
    // Append non-empty form controls except `attributes`
    Object.keys(this.addProductForm.controls).forEach((key) => {
      const control = this.addProductForm.get(key);
  
      if (key === 'attributes' && control instanceof FormGroup) {
        // Serialize `attributes` as JSON only if not empty
        if (Object.keys(control.value).length > 0) {
          formData.append(key, JSON.stringify(control.value));
        }
      } else if (control?.value instanceof Array) {
        // Handle non-empty arrays
        if (control.value.length > 0) {
          control.value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        }
      } else if (control?.value) {
        // Append other fields if value is not empty
        formData.append(key, control.value);
      }
    });
  
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
        this.toastr.error(data.message || 'Product creation failed', 'Error');
      }
    } catch (error) {
      this.toastr.error('An error occurred while adding the product', 'Error');
    } finally {
      this.isLoading = false;
    }
  }

  onProductTypeChange(selectedValue: string): void {
    if(selectedValue=='featured'){
      this.addProductForm.patchValue({
        auction_initial_price: '',
        auction_final_price: '',
        auction_starting_time: '',
        auction_ending_time: '',  
        auction_start_date: '', // Default value set to current date
        auction_end_date: '',   // Default value set to current date
      })
    }
    this.productType = selectedValue; // Check if selected value is "Featured"
  }
}
