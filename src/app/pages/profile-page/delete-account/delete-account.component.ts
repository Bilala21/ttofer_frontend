import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
  imports: [FormsModule]
})
export class DeleteAccountPageComponent implements OnInit {
  isDeleteConfirmed: boolean = false;
  captchaInputValue: string = '';
  accountId: number | null = null

  constructor(private router: Router,private toastr: ToastrService, private userService: MainServicesService, private activatedRoute: ActivatedRoute) { } // Inject HttpClient service here

  // Method to handle changes in the input field
  onCaptchaChange(value: string): void {
    this.captchaInputValue = value;
    if (this.captchaInputValue === 'DELETE') {
      this.isDeleteConfirmed = true;
    }
    else {
      this.isDeleteConfirmed = false
    }
  }

  deleteAccount() {
    this.userService.deleteAccount(this.accountId).subscribe({
      next: (res: any) => {
        if (res.success) {
          localStorage.getItem("authToken")
          localStorage.getItem("key")
          this.router.navigate(['/']);
          this.toastr.success('Account deleted successfully', 'Success');
        }
      },
      error: (err) => {
        //(err);
        this.toastr.error('An error occurred while deleting the account', 'Error');
      },
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.accountId = params['id'];
    });
  }
}
