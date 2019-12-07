import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Post } from '../../api/model/Posts';
import { PostService } from '../../api/service/post.service';
import { Page } from '../../api/model/Page';
import { NzNotificationService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import { GarbageCollector } from 'src/app/api/util/garbage.collector';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['post-list.component.less']
})
export class PostListComponent implements OnInit, OnDestroy {

  HOST = environment.host_be;

  @Input('filterBy') filterBy: any = '*';

  @Output('loadComplete') loadDataComplete = new EventEmitter<boolean>();

  page: Page<any> = new Page<any>();

  loading = false;

  data: Post[] = [];

  getData = this.postService.getAllPosts;

  disableBtnAction = false;

  userId: number = null;


  gc = new GarbageCollector();

  colorStatus = {
    POSTED: 'blue',
    RECEIVED: 'blue',
    QUOTED: 'blue',
    ACCEPTED: 'cyan',
    WAITING: 'cyan',
    COMPLETED: 'green',
    FEEDBACK: 'gold',
    CLOSED: ''
  }

  nameStatus = {
    POSTED: 'Đã đăng',
    RECEIVED: 'Đã có thợ xem yêu cầu',
    QUOTED: 'Đã có thợ báo giá',

    ACCEPTED: 'Đã xác nhận',
    WAITING: 'Chờ làm việc',

    COMPLETED: 'Đã hoàn thành việc',
    FEEDBACK: 'Đã đánh giá',
    CLOSED: 'Đã đóng'
  }

  constructor(private postService: PostService,
    private notification: NzNotificationService) {

  }

  ngOnInit(): void {
    // console.log(this.filterBy);
    switch (this.filterBy) {
      case 'RECENT':
        this.getData = this.postService.getPostRecent;
        break;
      case 'ACCEPT':
        this.getData = this.postService.getPostAccept;
        break;
      case 'COMPLETE':
        this.getData = this.postService.getPostComplete;
        break;
      case '*':
        this.getData = this.postService.getAllPosts;
        break;
      default:
        this.userId = +this.filterBy;
        this.getData = this.loadDataFilterUserId;
    }

    this.page.totalElements = 0;
    this.page.number = 0;
    this.loadData(1);
  }

  ngOnDestroy() {
    this.gc.clearAll();
  }

  loadData(page) {
    this.loading = true;

    this.gc.collect('getData',
      this.getData(page - 1)
        .subscribe((value: any) => {
          this.data = value.content;
          this.loadDataComplete.emit((page == 1 && this.data.length > 0) || page > 1);
          value.content = [];
          this.page = value;
          this.loading = false;
        }, error => {
          this.loading = false;
        })
    );
  }

  loadDataFilterUserId(page: number) {
    return this.postService.getPostOfUser(this.userId, [], page);
  }

  encodeDescription(text: string): string {
    let preElement = document.createElement('pre');
    preElement.innerHTML = text;
    return preElement.innerText;
  }

}
