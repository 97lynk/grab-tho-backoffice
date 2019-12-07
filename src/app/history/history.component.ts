import { Component, OnInit, OnDestroy } from '@angular/core';
import { HistoryService } from '../api/service/history.service';
import { Page } from '../api/model/Page';
import { History } from '../api/model/History';
import { GarbageCollector } from '../api/util/garbage.collector';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {

  histories = new Page<History>();

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

  gc = new GarbageCollector();

  constructor(
    private historyService: HistoryService
  ) {
    this.histories.content = [];
    this.histories.totalElements = 0;
    this.histories.number = 0;
  }

  ngOnInit() {
    this.loadData(0);
  }

  ngOnDestroy() {
    this.gc.clearAll();
  }

  loadData(page) {
    this.gc.collect('historyService.getHistory',
      this.historyService.getHistory(10, page)
        .subscribe((data: Page<History>) => {
          this.histories = data;
        })
    );
  }

}
