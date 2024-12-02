import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CurrentLocationComponent } from '../../../../../pages/current-location/current-location.component';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  imports: [NgFor, NgIf, NgClass, CurrentLocationComponent, FormsModule, ReactiveFormsModule, DropdownModule, InputTextModule, InputNumberModule, CalendarModule],
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
  addProductForm!: FormGroup
  subCategory: any[] = []
  categories: any = []
  isLoading: any = false
  selectedCategorySlug: any
  attributes: any = attributes
  categoryFields: any = {};
  @ViewChild('datePickerPromotion', { static: false }) datePickerPromotion!: ElementRef;
  productType: any = 'auction'
  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder, private router: Router,
    private mainServices: MainServicesService, private extension: Extension
  ) {
    this.minDate = new Date();
    this.minDate.setSeconds(0, 0);
    this.addProductForm = this.fb.group({
      user_id: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category_id: ['', Validators.required],
      sub_category_id: ['', Validators.required],
      image: this.fb.array([], Validators.required),
      auction_initial_price: [null],
      auction_final_price: [null],
      auction_starting_time: [''],
      auction_ending_time: [''],
      auction_starting_date: [null],
      auction_ending_date: [null],
      fix_price: [null],
      product_type: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      location: ['', Validators.required],
      main_category: ['', Validators.required],
      sub_category: ['', Validators.required],
      attributes: this.fb.group({}),
    });
this.onProductTypeChange(this.productType);


    this.addProductForm.patchValue({
      user_id: this.extension.getUserId()
    })
    this.addProductForm.patchValue({
      product_type: this.productType // Set the default value you want
    });
    // Fetch categories initially
    this.loadCategories();
    // Enable/disable time selection based on start and end date
    this.addProductForm.get('auction_starting_date')?.valueChanges.subscribe(startDate => {
      const endDateControl = this.addProductForm.get('auction_ending_date');
      
      // Clear 'noStartDate' error if the starting date is set
      if (startDate) {
        if (endDateControl?.hasError('noStartDate')) {
          endDateControl.updateValueAndValidity(); // This will clear the error
        }
        endDateControl?.updateValueAndValidity();
      }
    });
    this.addProductForm.get('auction_ending_date')?.valueChanges.subscribe(() => {
      this.addProductForm.get('auction_starting_date')?.updateValueAndValidity();
    });
    this.addProductForm.get('category_id')?.valueChanges.subscribe((categoryId) => {
      const category = this.categories.find((cat: any) => cat.id == categoryId);
      if (category) {
        this.selectedCategorySlug = category.slug;
        this.addProductForm.patchValue({
          main_category: JSON.stringify(category.name),
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
          sub_category: JSON.stringify(subCategory.name),
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
  isImageFieldInvalid(): boolean {
    const imagesControl = this.addProductForm.get('image') as FormArray;
    return imagesControl.invalid && imagesControl.touched;
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
      next: (response: any) => {
        this.categories = response.data;
        this.addProductForm.patchValue({
          category_id: this.categories[0].id
        })
        this.getSubcategories(this.categories[0].id)
      }
    })

  }
  onDateSelect(event: any): void {
    // debugger
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
        (error) => { }
      );
    } else {
      this.subCategory = [];
    }
  }

  onFileChange(event: any) {
    const allowedExtensions = ['png', 'jpg', 'jpeg'];
    const minWidth = 150;
    const minHeight = 150;
    const imagesControl = this.addProductForm.get('image') as FormArray;

    this.validationErrors['uploadImage'] = ''; // Clear any previous errors
  
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
        if (!allowedExtensions.includes(fileExtension || '')) {
          this.validationErrors['uploadImage'] = 'Only .png, .jpg, and .jpeg files are allowed.';
  
          // Automatically remove the error after 2 seconds
          setTimeout(() => {
            this.deleteValidationError('uploadImage');
          }, 2000);
  
          return; // Stop further processing as the file type is invalid
        }
  
        const img = new Image();
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          img.src = e.target.result;
  
          img.onload = () => {
            if (img.width < minWidth || img.height < minHeight) {
              this.validationErrors['uploadImage'] = `Image must be at least ${minWidth}x${minHeight} pixels.`;
  
              // Automatically remove the error after 2 seconds
              setTimeout(() => {
                this.deleteValidationError('uploadImage');
              }, 2000);
            } else {
              // Valid image: Add to FormArray and preview
              imagesControl.push(this.fb.control(file));
              this.selectedFiles.push({ src:reader.result as string });
            }
          };
        };
  
        reader.readAsDataURL(file); // Start reading the file
      }
    }
  }
  
  
  deleteValidationError(errorKey: string) {
    if (this.validationErrors[errorKey]) {
      delete this.validationErrors[errorKey]; // Clear the specific error key
    }
  }
  
  removeImage(index: number) {
    const imagesControl = this.addProductForm.get('image') as FormArray;
    imagesControl.removeAt(index);
    this.selectedFiles.splice(index, 1);
  
    if (imagesControl.length === 0) {
      this.validationErrors['uploadImage'] = 'At least one image is required.';
    } else {
      delete this.validationErrors['uploadImage'];
    }
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
      const maxFileSize = 20 * 1024 * 1024;
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
    debugger
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
    debugger
    const imagesControl = this.addProductForm.get('image') as FormArray;
    if(imagesControl.length === 0){
      this.validationErrors['uploadImage'] = 'Please add at least one image.';

    }
    if (this.addProductForm.invalid) {
      this.addProductForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();

    const attributes = this.addProductForm.get('attributes')?.value;
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
    // Handle form controls dynamically
    Object.keys(this.addProductForm.controls).forEach((key) => {
      const control = this.addProductForm.get(key);
  
      if (key === 'attributes' && control instanceof FormGroup) {
        if (Object.keys(control.value).length > 0) {
          formData.append(key, JSON.stringify(control.value));
        }
      } else if (control?.value instanceof Array) {
        debugger
        if (control.value.length > 0) {
          control.value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        }
      } else if (control?.value) {
        if (key === 'auction_starting_date' || key === 'auction_ending_date') {
          const formattedDate = this.formatDate(new Date(control.value));
          formData.append(key, formattedDate);
        } else {
          formData.append(key, control.value);
        }
      }
    });
  
    try {
      const token = localStorage.getItem('authToken');
      this.isLoading=true;
      const response = await fetch(`${Constants.baseApi}/products`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        this.isLoading=false
        this.toastr.success('Product is live now!', 'Success');
        this.router.navigate(['']);
      } else {
        this.isLoading=false

        this.toastr.error(data.message || 'Product creation failed', 'Error');
      }
    } catch (error) {
      this.isLoading=false

      this.toastr.error('An error occurred while adding the product', 'Error');
    } finally {
      this.isLoading = false;
    }
  }

  onProductTypeChange(selectedValue: string): void {
    if (selectedValue == 'featured') {
      this.addProductForm.get('auction_initial_price')?.clearValidators();
      this.addProductForm.get('auction_final_price')?.clearValidators();
      this.addProductForm.get('auction_starting_time')?.clearValidators();
      this.addProductForm.get('auction_ending_time')?.clearValidators();
      this.addProductForm.get('auction_starting_date')?.clearValidators();
      this.addProductForm.get('auction_ending_date')?.clearValidators();
      this.addProductForm.get('fix_price')?.setValidators(Validators.required);
      this.addProductForm.patchValue({
        auction_initial_price: '',
        auction_final_price: '',
        auction_starting_time: '',
        auction_ending_time: '',
        auction_start_date: '', // Default value set to current date
        auction_end_date: '',   // Default value set to current date
      })
    }
    else if (selectedValue =='auction') {
      // Disable fix_price field
      this.addProductForm.get('fix_price')?.clearValidators();
      this.addProductForm.patchValue({
        fix_price: null
      })
      // Enable auction-related fields
      this.addProductForm.get('auction_initial_price')?.setValidators(Validators.required);
      this.addProductForm.get('auction_final_price')?.setValidators(Validators.required);
      this.addProductForm.get('auction_starting_time')?.setValidators(Validators.required);
      this.addProductForm.get('auction_ending_time')?.setValidators([
        Validators.required,
        timeDifferenceValidator('auction_starting_time'),
      ]);
      this.addProductForm.get('auction_starting_date')?.setValidators([
        Validators.required,
        startDateBeforeEndDateValidator('auction_ending_date')
      ]);      this.addProductForm.get('auction_ending_date')?.setValidators([
        Validators.required,
        endDateValidator('auction_starting_date'),
      ]);  
      this.addProductForm.get('auction_ending_date')?.updateValueAndValidity();  }
    this.productType = selectedValue;
    this.addProductForm.updateValueAndValidity();
  }
}
export function timeDifferenceValidator(startField: string): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent;
    if (!formGroup) {
      return null;
    }

    const startTime = formGroup.get(startField)?.value;
    const endTime = control.value;

    if (!startTime || !endTime) {
      return null; // Only validate when both times are present
    }

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    // Check if the ending time is less than the starting time
    if (end.getTime() < start.getTime()) {
      return { timeOrderError: true }; // Error: Ending time is less than starting time
    }

    // Check if the time difference is at least 30 minutes
    if (end.getTime() - start.getTime() < 30 * 60 * 1000) {
      return { timeDifferenceError: true }; // Error: Less than 30 minutes difference
    }

    return null; // No error
  };
}
export function endDateValidator(startField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent;
    if (!formGroup) {
      return null;
    }
debugger
    const startDate = formGroup.get(startField)?.value;
    const endDate = control.value;

    if (!startDate && endDate) {
      // Clear the value of the end date and show the validation error
      formGroup.get('auction_ending_date')?.setValue(null);
      return { noStartDate: true }; // Error: Ending date exists without starting date
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        return { endDateBeforeStart: true }; 
      }
    }

    return null; // No error
  };
}
export function startDateBeforeEndDateValidator(endDateField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent;
    if (!formGroup) {
      return null;
    }

    const startDate = control.value;
    const endDate = formGroup.get(endDateField)?.value;

    // Check if there is an end date and if the start date is after the end date
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { startDateAfterEndDate: true };
    }

    return null; // No error if startDate is not after endDate
  };
}