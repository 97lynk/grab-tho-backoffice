import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { GarbageCollector } from 'src/app/api/util/garbage.collector';

@Component({
  selector: 'app-title-page',
  templateUrl: 'title-page.component.html',
  styleUrls: ['title-page.component.less']
})
export class TitlePageComponent implements OnInit, OnDestroy {

  @Input() hasSetting = false;

  title = '';

  gc = new GarbageCollector();

  showSetting = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location) {

    this.gc.collect('url',
      this.router.events.subscribe((event) => {
        if (event instanceof ActivationEnd) {
          this.title = this.route.snapshot.data['title'] || '';
        }
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.gc.clearAll();
  }

  goBack() {
    this.location.back();
  }
}
