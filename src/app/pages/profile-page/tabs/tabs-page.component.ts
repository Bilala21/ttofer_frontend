import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MainServicesService } from '../../../shared/services/main-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tabs-account',
  standalone: true,
  templateUrl: './tabs-page.component.html',
  styleUrls: ['./tabs-page.component.scss'],
  imports: [FormsModule]
})
export class DeleteAccountPageComponent implements OnInit {
 

  constructor(private router: Router,private toastr: ToastrService, private userService: MainServicesService, private activatedRoute: ActivatedRoute) { } // Inject HttpClient service here
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
