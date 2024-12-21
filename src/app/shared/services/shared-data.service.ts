import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private data: any ;
  private imageUrlSource = new BehaviorSubject<string | null>(null);
  currentImageUrl = this.imageUrlSource.asObservable();

  changeImageUrl(url: any) {
    this.imageUrlSource.next(url);
  }
  public  subCatContent: any = [];

  constructor(private http: HttpClient) {
} 


// Method to get data by category ID
getDataByCategoryId(categoryId: any): void {
  this.http.get<any>('assets/sub-categories.json').subscribe({
      next: (response) => {
          this.data = response; 
          this.subCatContent=this.data[categoryId];      },
      
  });
}
}
