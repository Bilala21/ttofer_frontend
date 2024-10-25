import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalStateService } from '../../shared/services/state/global-state.service';

@Component({
  selector: 'app-temp-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './temp-form.component.html',
  styleUrl: './temp-form.component.scss'
})
export class TempFormComponent {
  emailForm: FormGroup;
  error: boolean = false

  constructor(private formBuilder: FormBuilder, private stateService: GlobalStateService) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]] // Validators for required and email
    });
  }

  handleSubmit() {
    if (this.emailForm.valid) {
      this.error = false
      const email = this.emailForm.get('email')?.value;
      const credentialEmail = "*&$?abc123xyz0_-@ttoffer.com"
      const token = "32423423dfsfsdfd$#$@$#@%$#@&^%$#wergddf!#@$%"
      if (email === credentialEmail) {
        this.stateService.updateTempToken(token)
        localStorage.setItem("tempToken", token)
        this.error = false
      }
      else {
        this.error = true
      }
    }
  }
}
