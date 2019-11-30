import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'vdatetime'
})
export class VDateTimePipe implements PipeTransform {

  option = {
    hour12: true, hour: '2-digit', minute: '2-digit',
    day: 'numeric', month: 'numeric', year: 'numeric'
  };

  transform(value: number | Date | string): string {
    let data: Date;
    if (value == null) { return ''; }
    if (typeof value === 'number') {
      data = new Date(value);
    } else if (typeof value === 'string') {
      data = new Date(value);
    } else {
      data = value;
    }
    // return data.toLocaleString('vi-VN', this.option);
    moment.locale('vi-VN');
    return moment(data).fromNow();
  }

}
