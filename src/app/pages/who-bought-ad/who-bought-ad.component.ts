import { Component } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';
import { JwtDecoderService } from '../../shared/services/authentication/jwt-decoder.service';

@Component({
    selector: 'app-who-bought-ad',
    standalone: true,
    templateUrl: './who-bought-ad.component.html',
    styleUrl: './who-bought-ad.component.scss',
    imports: [NgFor]
})
export class WhoBoughtAdComponent {
  message:any [] = [
    {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
    {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
    {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
    {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
  ]
  offers:any
  currentUserid:number = 0;
  sellingId:any;
  sellingList: any = []
  constructor(
    private route: ActivatedRoute,
    private mainServices: MainServicesService,
    private token:JwtDecoderService
  ){
    this.currentUserid =token.decodedToken
  }
  ngOnInit():void{
    this.sellingId = this.route.snapshot.paramMap.get('id')!;
    this.getSelling()
    this.getAllChatsOfUser()
  }
  getSelling() {
    
    this.mainServices.getSelling().subscribe((res:any) => {
      this.sellingList = res.data.selling
      this.sellingList = this.sellingList.filter((item:any) => {
        return item.id == this.sellingId;
    });
    })
  }
  getAllChatsOfUser = () => {
    this.mainServices.getAllChatsOfUser(this.currentUserid).subscribe((res:any) =>{
      this.message = res.data
    });
  }
  whoBought(){
    let input = {
      user_id: this.currentUserid
    }
    this.mainServices.whoBought(input).subscribe((res:any) =>{
    this.offers = res.user
    })
  }
}
