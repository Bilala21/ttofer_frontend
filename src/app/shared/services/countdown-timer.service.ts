import { Injectable } from '@angular/core';
import { Observable, interval, map, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownTimerService {
  constructor() {}

  startCountdown(endDateTime: string): Observable<string> {
    const endDate = new Date(endDateTime).getTime();
    return interval(1000).pipe(
      map(() => {
        const now = Date.now();
        const timeDifference = endDate - now;

        if (timeDifference <= 0 || Number.isNaN(timeDifference)) {
          return 'Bid Expired';
        } else {
          return this.formatTimeDifference(timeDifference);
        }
      }),
      takeWhile((time) => time !== 'Bid Expired') // Stop emitting after expiration
    );
  }

  private formatTimeDifference(timeDifference: number): string {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
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
    formattedTime += `${seconds}s `;

    return formattedTime ;
  }
}
