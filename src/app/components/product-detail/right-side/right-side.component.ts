import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GlobalStateService } from '../../../shared/services/state/global-state.service';
import { AuthService } from '../../../shared/services/authentication/Auth.service';
import { Extension } from '../../../helper/common/extension/extension';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-right-side',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.scss'
})
export class RightSideComponent {
  constructor(private router: Router, private globalStateService: GlobalStateService, private toastr: ToastrService, private authService: AuthService,
    public extension: Extension,
  ) {
    this.currentUserid = extension.getUserId();
  }

  productId: any = null
  @Input() product: any = {};
  attributes: any = {}
  loading: boolean = false
  currentUserid: any;
  @Output() handleWishlist = new EventEmitter<any>();


  toggleWishlist(item: any) {
    this.handleWishlist.emit(item)
  }

  buyProduct(product: any) {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');

      this.authService.triggerOpenModal();
      return;
    }
  }

  addToCart(product: any) {
    const storedData = localStorage.getItem('key');

    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    else {
      this.globalStateService.updateCart(product)
    }
  }

  handleProductQty(event: any, product: any) {
    this.globalStateService.updateCart({ ...product, quantity: event.value })
  }

  contactSeller(product: any, user: any): void {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    sessionStorage.setItem('productData', JSON.stringify(product));
    sessionStorage.setItem('userData', JSON.stringify(user));

    this.router.navigate([`/chatBox/${this.currentUserid}`], {
      state: { product, user },
    });
  }

  showOfferModal(modal_type: string) {
    const storedData = localStorage.getItem('key');
    if (!storedData) {
      this.toastr.warning('Plz login first than try again !', 'Warning');
      this.authService.triggerOpenModal();
      return;
    }
    this.globalStateService.setOfferModal(modal_type)
  }

}
