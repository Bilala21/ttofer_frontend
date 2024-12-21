import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxApexchartsModule, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from 'ngx-apexcharts';
import { CardComponent } from '../../../components/selling/card/card.component';

@Component({
  selector: 'app-post-performance',
  standalone: true,
  templateUrl: './post-performance.component.html',
  styleUrl: './post-performance.component.scss',
  imports: [RouterLink, NgFor, CardComponent, NgxApexchartsModule, NgxApexchartsModule]
})

export class PostPerformanceComponent {
  public chartOptions: any;
  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Series 1',
          data: [0, 10, 20, 30, 40, 50, 60]
        }
      ],
      chart: {
        height: 350,
        type: 'area',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'category',
        categories: ['Jan', 'Feb', 'Mar', 'Apr']
      },
      tooltip: {
        enabled: true
      },
      fill: {
        opacity: 0.8
      },
      colors: ['#77B6EA']
    };


  }
  buttonData: any = [
    {
      text: "View <br/> Post",
      href: "#",
      img: "/assets/images/icons/eye.png",
    },
    {
      text: "Edit <br/> Post",
      href: "#",
      img: "/assets/images/icons/edit.png",
    },
    {
      text: "Mark as<br/> Sold",
      href: "#",
      img: "/assets/images/icons/bookmark.png",
    },
    {
      text: "Sell <br/>Faster",
      href: "#",
      img: "/assets/images/icons/trend-up.png",
    },
  ]
}
