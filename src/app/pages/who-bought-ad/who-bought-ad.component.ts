import { Component } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../../shared/services/main-services.service';
import { Extension } from '../../helper/common/extension/extension';

@Component({
    selector: 'app-who-bought-ad',
    standalone: true,
    templateUrl: './who-bought-ad.component.html',
    styleUrl: './who-bought-ad.component.scss',
    imports: [FooterComponent, NgFor]
})
export class WhoBoughtAdComponent {
  message:any [] = [
    {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
    {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
    {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
    {img:'assets/images/profile-img.png', name:'Anthony (Web3.io)', text:'How are you today?', time:'9:54 AM'},
  ]
  offers:any
  // offers:any [] = [
  //   {img:'assets/images/profile-img.png', text:'Someone from TToffer?'},
  //   {img:'assets/images/profile-img.png', text:'Someone from Outside TToffer?'},
  //   {img:'assets/images/profile-img.png', text:'Anthony'},
  //   {img:'assets/images/profile-img.png', text:'Mark'},
  // ]
  currentUserid:number = 0;
  sellingId:any;
  sellingList: any = []

  constructor(
    private route: ActivatedRoute,
    private mainServices: MainServicesService,
    private extension: Extension,
  ){
    this.currentUserid = extension.getUserId()
  }
  ngOnInit():void{
    this.sellingId = this.route.snapshot.paramMap.get('id')!;
    this.getSelling()
    this.getAllChatsOfUser()
  }
  getSelling() {
    ;
    this.mainServices.getSelling().subscribe((res:any) => {
      ;
      this.sellingList = res.data.selling

      this.sellingList = this.sellingList.filter((item:any) => {

        return item.id == this.sellingId;
    });
      //(this.sellingList)
    })
  }
  getAllChatsOfUser = () => {

    this.mainServices.getAllChatsOfUser(this.currentUserid).subscribe((res:any) =>{
      this.message = res.data
      //(this.message)
    });
  }

  whoBought(){
    let input = {
      user_id: this.currentUserid
    }
    this.mainServices.whoBought(input).subscribe((res:any) =>{

      res
      this.offers = res.user
      //('who bought',this.offers)
    })
  }
}
