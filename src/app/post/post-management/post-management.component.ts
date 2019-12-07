import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Action } from '../../api/model/Action';

@Component({
  selector: 'app-post-management',
  templateUrl: './post-management.component.html',
  styleUrls: ['post-management.component.css']
})
export class PostManagementComponent {

  @ViewChild('more')
  pendingTemp: TemplateRef<any>;

  pending: any;

  positionTop = true;

  tabIndex = 0;

  actions: Action[] = [];

  ACTION_COLOR = {
    APPROVE: 'blue',
    CREATE: 'green',
    BLOCK: 'red'
  };

  hasWaitingPosts = true;

  currentPage = 0;

  constructor(private route: ActivatedRoute) {
    this.pending = this.pendingTemp;
  }

  ngOnInit(): void {
    this.tabIndex = this.route.snapshot.queryParams.tab;
  }

  loadWaitingPostTabComplete($event) {
    this.hasWaitingPosts = $event;
  }

  fomatDateTime(dt: number[]) {
    return `${dt[3]}:${dt[4]} ${dt[2]}/${dt[1]}/${dt[0]}`;
  }

}
