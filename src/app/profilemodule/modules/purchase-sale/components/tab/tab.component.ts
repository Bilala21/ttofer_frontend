import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent {
  @Output() getTab: EventEmitter<any> = new EventEmitter<any>();
  @Input() tabs: string[] = [];
  @Input() activeTab: number = 1;
  constructor() {}

  setActiveTab(value: string, index: number): void {
    const tab = { index: index, value: value };
    this.getTab.emit(tab);
  }
}
