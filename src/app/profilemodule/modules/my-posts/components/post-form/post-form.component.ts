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
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../../../../../../public/constants/constants';
import { JwtDecoderService } from '../../../../../shared/services/authentication/jwt-decoder.service';
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
  selectedFiles: Array<{ url: string }> = [];
  selectedVideos: Array<{ url: string }> = [];
  selectedVideo: any | null = null
  addProductForm!: FormGroup
  subCategory: any[] = []
  categories: any = []
  isLoading: any = false
  selectedCategorySlug: any
  attributes: any = attributes
  categoryFields: any = {};
  editProduct: any
  id: any
  parentLocation: any
  editProductData: any
  @ViewChild('datePickerPromotion', { static: false }) datePickerPromotion!: ElementRef;
  productType: any = 'featured'
  constructor(
    private toastr: ToastrService, private route: ActivatedRoute,
    private fb: FormBuilder, private router: Router, private token: JwtDecoderService,
    private mainServices: MainServicesService, private extension: Extension
  ) {
    this.minDate = new Date();
    this.minDate.setSeconds(0, 0);
    this.addProductForm = this.fb.group({
      user_id: ['', Validators.required],
      product_id: [''],
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category_id: ['', Validators.required],
      sub_category_id: ['', Validators.required],
      image: this.fb.array([]),
      auction_initial_price: [null],
      auction_final_price: [null],
      auction_starting_time: [''],
      auction_ending_time: [''],
      auction_starting_date: [''],
      auction_ending_date: [''],
      fix_price: [null],
      product_type: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      location: ['', Validators.required],
      main_category: ['', Validators.required],
      sub_category: ['', Validators.required],
      attributes: this.fb.group({}),
    });
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.addProductForm.patchValue({
          product_id: this.id,
        })
        this.editProduct = true;
      }
    });
    this.addProductForm.patchValue({
      user_id: token.decodedToken
    })
    this.addProductForm.get('auction_starting_date')?.valueChanges.subscribe(startDate => {
      const endDateControl = this.addProductForm.get('auction_ending_date');
      if (startDate) {
        if (endDateControl?.hasError('noStartDate')) {
          endDateControl.updateValueAndValidity();
        }
        endDateControl?.updateValueAndValidity();
      }
    });
    this.addProductForm.get('auction_ending_date')?.valueChanges.subscribe(() => {
      this.addProductForm.get('auction_starting_date')?.updateValueAndValidity();
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
  fetchData(productId: number) {
    this.mainServices.getProductById({ product_id: productId }).subscribe({
      next: (value) => {
        this.editProductData = value.data;
        this.editProductData.attributes = JSON.parse(this.editProductData.attributes);
        this.addProductForm.patchValue(this.editProductData)
        this.addProductForm.patchValue({
          auction_starting_date: new Date(this.editProductData.auction_starting_date),
          auction_starting_time: new Date(`1970-01-01T${this.editProductData.auction_starting_time}Z`),
          auction_ending_date: new Date(this.editProductData.auction_ending_date),
          auction_ending_time: new Date(`1970-01-01T${this.editProductData.auction_ending_time}Z`)
        })
        this.selectedFiles = this.editProductData.photos;
        this.handleLocationChange({
          latitude: this.editProductData.latitude,
          longitude: this.editProductData.longitude,
          location: this.editProductData.location
        }); this.onCategoryChange(this.addProductForm.value.category_id)
        this.addProductForm.patchValue({
          attributes: this.editProductData.attributes,
        });
        const attributesGroup = this.addProductForm.get('attributes') as FormGroup;
        if (this.editProductData && this.editProductData.attributes) {
          Object.keys(this.editProductData.attributes).forEach((key) => {
            if (!attributesGroup.contains(key)) {
              attributesGroup.addControl(
                key,
                this.fb.control(this.editProductData.attributes[key], Validators.required)
              );
            } else {
              attributesGroup.get(key)?.setValue(this.editProductData.attributes[key]);
            }
          });
        }
        this.selectedCategorySlug = this.editProductData.category.slug

        this.onProductTypeChange(this.editProductData.product_type)
        this.getSubcategories()
      },
      error: (err) => {
      },
    });
  }
  endingTimeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startTime = this.addProductForm?.get('auction_starting_time')?.value;
    if (startTime && control.value) {
      const startDate = new Date(startTime);
      const endDate = new Date(control.value);
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
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  loadCategories(): void {
    this.mainServices.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data;

        if (this.editProduct) {
          this.fetchData(this.id)
        } else if (!this.editProduct) {
          this.addProductForm.patchValue(
            {
              product_type: this.productType,
              category_id: this.categories[0].id
            }
          )
          this.onProductTypeChange(this.addProductForm.value.product_type)
          this.onCategoryChange(this.addProductForm.value.category_id)
          this.getSubcategories()
        }

      }
    })
  }
  onCategoryChange(categoryId: number): void {
    const selectedCategory = this.categories.find((cat: any) => cat.id == categoryId);
    this.selectedCategorySlug = selectedCategory?.slug || null;
    this.addProductForm.patchValue({
      main_category: this.selectedCategorySlug,
    })
    if (!this.editProduct) {
      this.addProductForm.setControl('attributes', this.fb.group({}));

    }
  }
  handleLocationChange(location: {
    latitude: number;
    longitude: number;
    location: string;
  }): void {
    if (this.editProduct) {
      this.parentLocation = location;
    }
    this.addProductForm.patchValue(location);
  }
  getSubcategories(): void {
    if (this.addProductForm.value.category_id) {
      this.mainServices.getSubCategories(this.addProductForm.value.category_id).subscribe(
        (data: any) => {
          this.subCategory = data.data;
          this.addProductForm.patchValue({
            sub_category_id: this.subCategory[0].id
          })
          this.onCategoryChange(this.addProductForm.value.category_id)
          this.initializeForm();
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
          setTimeout(() => {
            this.deleteValidationError('uploadImage');
          }, 2000);
          return;
        }
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (e: any) => {
          img.src = e.target.result;
          img.onload = () => {
            if (img.width < minWidth || img.height < minHeight) {
              this.validationErrors['uploadImage'] = `Image must be at least ${minWidth}x${minHeight} pixels.`;
              setTimeout(() => {
                this.deleteValidationError('uploadImage');
              }, 2000);
            } else {
              imagesControl.push(this.fb.control(file));
              this.selectedFiles.push({ url: reader.result as string });
            }
          };
        };
        reader.readAsDataURL(file);
      }
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
deleteValidationError(errorKey: string) {
    if (this.validationErrors[errorKey]) {
      delete this.validationErrors[errorKey];
    }
}
  removeImage(file: any, index: number) {
    const imagesControl = this.addProductForm.get('image') as FormArray;
    if (file.id) {
      this.deleteProductImage(file)
    }
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
    if (!this.selectedCategorySlug) return;
    this.categoryFields = this.attributes[this.selectedCategorySlug];
    const attributesGroup = this.addProductForm.get('attributes') as FormGroup;
    this.categoryFields.forEach((field: any) => {
      let defaultValue = '';
      if (!attributesGroup.contains(field.model)) {
        const existingValue = attributesGroup.get(field.model)?.value;
        if (existingValue) {
          defaultValue = existingValue;
        } else if (field.type === 'select' && field.options && field.options.length > 0) {
          defaultValue = field.options[0].id;
        }
        attributesGroup.addControl(
          field.model,
          this.fb.control(defaultValue, Validators.required)
        );
      } else {
        const control = attributesGroup.get(field.model);
        if (control) {
          control.setValue(control.value || defaultValue);
        }
      }
    });
  }
  addCompleteProduct() {
    if (!this.editProduct) {
      this.addProduct()
    } else if (this.editProduct) {
      this.updateProduct()
    }

  }
  async addProduct() {
    const imagesControl = this.addProductForm.get('image') as FormArray;
    if (imagesControl.length === 0) {
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
    Object.keys(this.addProductForm.controls).forEach((key) => {
      const control = this.addProductForm.get(key);
      if (key === 'attributes' && control instanceof FormGroup) {
        if (Object.keys(control.value).length > 0) {
          formData.append(key, JSON.stringify(control.value));
        }
      } else if (control?.value instanceof Array) {
        if (control.value.length > 0) {
          control.value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        }
      } else if (control?.value) {
        if (key === 'auction_starting_date' || key === 'auction_ending_date') {
          const formattedDate = this.formatDate(new Date(control.value));
          formData.append(key, formattedDate);
        } else if (key === 'auction_starting_time' || key === 'auction_ending_time') {
          const formattedtime = this.formatTime(control.value);
          formData.append(key, formattedtime);
        } else {
          formData.append(key, control.value);
        }
      }
    });
    try {
      const token = localStorage.getItem('authToken');
      this.isLoading = true;
      const response = await fetch(`${Constants.baseApi}/products`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        this.isLoading = false
        this.toastr.success('Product is live now!', 'Success');
        this.router.navigate(['']);
      } else {
        this.isLoading = false
        this.toastr.error(data.message || 'Product creation failed', 'Error');
      }
    } catch (error) {
      this.isLoading = false
      this.toastr.error('An error occurred while adding the product', 'Error');
    } finally {
      this.isLoading = false;
    }
  }
  async updateProduct() {
    const imagesControl = this.addProductForm.get('image') as FormArray;
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
    Object.keys(this.addProductForm.controls).forEach((key) => {
      const control = this.addProductForm.get(key);
      if (key === 'attributes' && control instanceof FormGroup) {
        if (Object.keys(control.value).length > 0) {
          formData.append(key, JSON.stringify(control.value));
        }
      } else if (control?.value instanceof Array) {
        if (control.value.length > 0) {
          control.value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        }
      } else if (control?.value) {
        if (key === 'auction_starting_date' || key === 'auction_ending_date') {
          const formattedDate = this.formatDate(new Date(control.value));
          formData.append(key, formattedDate);
        } else if (key === 'auction_starting_time' || key === 'auction_ending_time') {
          const formattedtime = this.formatTime(control.value);
          formData.append(key, formattedtime);
        } else {
          formData.append(key, control.value);
        }
      }
    });
    try {
      const token = localStorage.getItem('authToken');
      this.isLoading = true;
      const response = await fetch(`${Constants.baseApi}/products/update`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        this.isLoading = false
        this.toastr.success('Product Updated Successfully', 'Success');
        this.router.navigate(['']);
      } else {
        this.isLoading = false
        this.toastr.error(data.message || 'Product creation failed', 'Error');
      }
    } catch (error) {
      this.isLoading = false
      this.toastr.error('An error occurred while adding the product', 'Error');
    } finally {
      this.isLoading = false;
    }
  }
  onProductTypeChange(selectedValue: string): void {
    if (selectedValue == 'featured') {
      this.addProductForm.get('auction_initial_price')?.clearValidators();
      this.addProductForm.get('auction_initial_price')?.updateValueAndValidity();
      this.addProductForm.get('auction_final_price')?.clearValidators();
      this.addProductForm.get('auction_final_price')?.updateValueAndValidity();
      this.addProductForm.get('auction_starting_time')?.clearValidators();
      this.addProductForm.get('auction_starting_time')?.updateValueAndValidity();
      this.addProductForm.get('auction_ending_time')?.clearValidators();
      this.addProductForm.get('auction_ending_time')?.updateValueAndValidity();
      this.addProductForm.get('auction_starting_date')?.clearValidators();
      this.addProductForm.get('auction_starting_date')?.updateValueAndValidity();
      this.addProductForm.get('auction_ending_date')?.clearValidators();
      this.addProductForm.get('auction_ending_date')?.updateValueAndValidity();
      this.addProductForm.get('fix_price')?.setValidators(Validators.required);
      this.addProductForm.get('fix_price')?.updateValueAndValidity();
      this.addProductForm.patchValue({
        auction_initial_price: '',
        auction_final_price: '',
        auction_starting_time: '',
        auction_ending_time: '',
        auction_starting_date: '',
        auction_ending_date: '',
      })
    }
    else if (selectedValue == 'auction') {
      this.addProductForm.get('fix_price')?.clearValidators();
      this.addProductForm.patchValue({
        fix_price: null
      })
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
      ]); this.addProductForm.get('auction_ending_date')?.setValidators([
        Validators.required,
        endDateValidator('auction_starting_date'),
      ]);
      this.addProductForm.updateValueAndValidity();
      this.addProductForm.get('auction_ending_date')?.updateValueAndValidity();
    }
    this.productType = selectedValue;
    this.addProductForm.patchValue({
      product_type: this.productType // Set the default value you want
    });
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
    if (end.getTime() < start.getTime()) {
      return { timeOrderError: true };
    }
    if (end.getTime() - start.getTime() < 30 * 60 * 1000) {
      return { timeDifferenceError: true };
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
    const startDate = formGroup.get(startField)?.value;
    const endDate = control.value;
    if (!startDate && endDate) {
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
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { startDateAfterEndDate: true };
    }
    return null; // No error if startDate is not after endDate
  };
}