import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { category } from '../../shared/Models/Product/category';
import { LookupService } from '../../shared/services/lookup/lookup.service';
import { subCategory } from '../../shared/Models/Product/SubCategory';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
})
export class AddPostComponent implements OnInit {
  postForm!: FormGroup;
  selectedFiles: { src: string; file: File }[] = []; // Array to hold file objects and their preview URLs
  selectedImageIndex: number = 0; // Track the index of the selected image
  maxImageCount: number = 10; // Limit to 10 images
  maxTotalSize: number = 50 * 1024 * 1024; // Limit total size to 50 MB
  imageError: string | null = null; // Error message
  public isErrorOnSubmit!: boolean;
  isProcessing = false;
  categories!: category[];
  subCategories!: subCategory[];
  IsSubCategory: boolean = false;
  selectedCategoryName!: string;
  brands: any = [
    { id: 1, name: 'LG' },
    { id: 2, name: 'Samsung' },
    { id: 3, name: 'Apple' },
    // Add more brands as needed
  ];
  constructor(private fb: FormBuilder, private lookupService: LookupService) {}
  async ngOnInit() {
    this.initializeForm();
    this.categories = await this.lookupService.GetProductCategories();
    this.postForm.get('category')?.valueChanges.subscribe((categoryId) => {
      this.loadSubcategories(categoryId);
      this.selectedCategoryName = this.categories.filter(
        (a) => a.id == categoryId
      )[0].name;
    });
  }
  private async loadSubcategories(categoryId: number): Promise<void> {
    if (categoryId) {
      this.IsSubCategory = true;
      this.subCategories = await this.lookupService.GetProductSubCategories(
        categoryId
      );
    } else {
      this.subCategories = [];
    }
  }
  initializeForm() {
    this.postForm = this.fb.group({
      postTitle: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      category: ['', [Validators.required]],
      subcategory: ['', [Validators.required]],
      brand: ['', [Validators.required]],
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.postForm.controls;
  }

  selectImage(index: number) {
    this.selectedImageIndex = index; // Update the selected image index
  }

  // Method to handle file selection and preview generation
  onFileChange(event: any) {
    const files: FileList = event.target.files;
    let totalSize = this.selectedFiles.reduce(
      (acc, fileObj) => acc + fileObj.file.size,
      0
    ); // Current total size

    this.imageError = null;

    // Check if adding these files exceeds the maximum image count
    if (files.length + this.selectedFiles.length > this.maxImageCount) {
      this.imageError = 'Cannot upload more than 10 images.';
      return;
    }

    // Process each selected file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      totalSize += file.size;

      // Check if the total size exceeds 50 MB
      if (totalSize > this.maxTotalSize) {
        this.imageError = 'Total image size exceeds 50 MB.';
        return;
      }

      // Create a FileReader to generate the preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Push the file object and preview URL to the selectedFiles array
        this.selectedFiles.push({
          src: e.target.result, // Preview URL
          file: file, // Original file object
        });
      };
      reader.readAsDataURL(file);
    }
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
  confirmSelection(): void {
    if (
      this.selectedImageIndex > -1 &&
      this.selectedImageIndex < this.selectedFiles.length
    ) {
    }
  }
  onSubmit() {
    if (this.postForm.invalid) {
      this.isErrorOnSubmit = true;
      return;
    }
  }
}
