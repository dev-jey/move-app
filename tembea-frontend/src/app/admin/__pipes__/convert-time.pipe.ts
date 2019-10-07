import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertTime'
})
export class ConvertTimePipe implements PipeTransform {

  transform(time: any): any {
    const engagementTimes = (time.split('-'));
    const transformedTime = engagementTimes.map(twentyFourHourTime => {
      let hour = (twentyFourHourTime.split(':'))[0];
      let min = (twentyFourHourTime.split(':'))[1];
      const part: String = this.getPart(hour);
      min = this.getMinutes(min);
      hour = this.getHour(hour);
      return `${hour}:${min}${part}`;
    });
    return transformedTime.join('<span class="text-in-value"> to </span>');
  }

  getPart(hour): String {
    return hour >= 12 ? 'PM' : 'AM';
  }

  getMinutes(min) {
    return (min + '').length === 1 ? `0${min}` : min;
  }

  getHour(hour) {
    if (hour === '00') {
      hour = 12;
      return hour;
    }
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length === 1 ? `0${hour}` : hour;
    return hour;
  }

}
