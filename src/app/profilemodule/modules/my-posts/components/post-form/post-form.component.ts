import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CurrentLocationComponent } from '../../../../../pages/current-location/current-location.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MainServicesService } from '../../../../../shared/services/main-services.service';
import { attributes } from '../../../json-data';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { Extension } from '../../../../../helper/common/extension/extension';
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
    private fb: FormBuilder,
    private mainServices: MainServicesService,private extension:Extension
  ) {
    const formData=new FormData();
    this.addProductForm = this.fb.group({
      user_id:[''],
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category_id: ['', Validators.required],
      sub_category_id: ['', Validators.required],
      pricingCatId: [''],
      auction_initial_price: [''],
      auction_final_price: [''],
      auction_starting_time: [''],
      auction_ending_time: [''],
      auction_starting_date: [''],
      auction_ending_date: [''],
      fix_price: [''],
      product_type:[''],
      latitude:[''],
      longitude:[''],
      delivery_type:[''],
      location:[''],
      main_category:[''],
      sub_category:[''],
      image:[''],
      attributes: this.fb.group({}) // Initialize attributes as a FormGroup
    });
  this.addProductForm.patchValue({
    user_id:this.extension.getUserId()
  })
    // Fetch categories initially
    this.loadCategories();
  
    // Listen to category_id changes
    this.addProductForm.get('category_id')?.valueChanges.subscribe((categoryId) => {
      const category = this.categories.find((cat: any) => cat.id == categoryId);
      if (category) {
        this.selectedCategorySlug = category.slug;
        this.addProductForm.patchValue({
          main_category: category.name,
        })
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
          sub_category: subCategory.name,
        })
  
      }
    });
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
  onTimeChange(fieldName: string, event: any) {
    debugger
    const time = event && event instanceof Date ? this.formatTime(event) : null;
    if (time) {
      this.addProductForm.patchValue({
        [fieldName]: time,
      });
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
        this.addProductForm.value.category_id=this.categories[0].id
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
        attributesGroup.addControl(
          field.model,
          this.fb.control('', Validators.required) // Add required validator
        );
      }
    });
  }
  
  addCompleteProduct(){
    const formData=new FormData()
    formData.append('body',this.addProductForm.value
    )
    console.log(this.addProductForm.value)
  }
  onProductTypeChange(selectedValue: string): void {
    debugger
    this.productType = selectedValue; // Check if selected value is "Featured"
  }
}
