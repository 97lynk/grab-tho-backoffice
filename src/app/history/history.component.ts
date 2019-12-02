import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../api/service/history.service';
import { Page } from '../api/model/Page';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  histories = [];

  nameStatus = {
    QUOTE: 'Báo giá',
    RECHARGE: 'Nạp tiền',
    REFUND_QUOTE: 'Hoàn tiền báo giá'
  }

  colorStatus = {
    QUOTE: 'red',
    RECHARGE: 'green',
    REFUND_QUOTE: 'green'
  }

  constructor(
    private historyService: HistoryService
  ) { }

  ngOnInit() {
    this.historyService.getHistory(10, 0)
      .subscribe((data: Page<History>) => {
        this.histories = data.content;
      });
  }

}
