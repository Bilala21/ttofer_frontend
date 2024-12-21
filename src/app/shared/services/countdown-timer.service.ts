import { Injectable } from '@angular/core';
import { Observable, interval, map, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownTimerService {
  constructor() {}
  startCountdown(endDateTime: string, product: any): Observable<string> {
 
    const dateTimeStr = `${product?.utc_data_time?.utc_date} ${product?.utc_data_time?.utc_time}`;

    const date = new Date(dateTimeStr + ' UTC');
    date.setUTCDate(date.getUTCDate() + 7);
    date.setUTCHours(20, 15, 0, 0);
    const endDate = new Date(endDateTime).getTime();
    const serverDateTime = new Date(date.toISOString()).getTime();
    let count = 0;
    return interval(1000).pipe(
      map(() => {
        const timeDifference = endDate - serverDateTime;
        if (timeDifference <= 0 || Number.isNaN(timeDifference)) {
          return 'Bid Expired';
        } else {
          return this.formatTimeDifference(
            timeDifference - (count += 1 * 1000)
          );
        }
      }),
      takeWhile((time) => time !== 'Bid Expired')
    );
  }

  private formatTimeDifference(timeDifference: number): string {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    let formattedTime = '';
    if (days > 0) {
      formattedTime += `${days}d `;
    }
    if (hours > 0) {
      formattedTime += `${hours}h `;
    }
    if (minutes > 0) {
      formattedTime += `${minutes}m `;
    }
    formattedTime += `${seconds}s`;

    return formattedTime;
  }
}
