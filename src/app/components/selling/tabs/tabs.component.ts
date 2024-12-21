import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GlobalStateService } from '../../../shared/services/state/global-state.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'] // Corrected to styleUrls
})
export class TabsComponent { // Added component name
  constructor(private globalStateService: GlobalStateService) { }

  @Input() tabData: any = []; // Removed { required: true }, not valid in Angular
  @Input() ulClass: string = '';   // Removed { required: false }
  @Input() tabClass: string = '';  // Removed { required: false }
  @Input() activeTab:any = 1; // Removed { required: true }

  handleTab(index: number, tabName:any): void {
    this.globalStateService.updateTab(index, tabName)
  }
}
