import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { PostService } from '../../api/service/post.service';
import { Post } from '../../api/model/Posts';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { defaultAvatar } from 'src/app/config';
import { GarbageCollector } from 'src/app/api/util/garbage.collector';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.less']
})
export class PostDetailComponent implements OnInit, OnDestroy {

  contentHTML = '';

  HOST = environment.host_be;

  post = new Post();

  comments = [];

  showMap = false;

  disableBtnAction = false;

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

  gc = new GarbageCollector();

  constructor(
    private postService: PostService,
    private route: ActivatedRoute) {
    this.post.userAvatar = defaultAvatar;
  }

  ngOnInit() {
    this.gc.collect('url',
      this.route.url.subscribe(url => {
        const { id } = this.route.snapshot.params;

        this.gc.collect('postService.getPostById',
          this.postService.getPostById(id).subscribe((value: Post) => this.post = value)
        );

        this.gc.collect('postService.getComments',
          this.postService.getComments(id, ['RECEIVE', 'QUOTE', 'ACCEPT', 'COMPLETE', 'FEEDBACK', 'CLOSE'])
            .subscribe((value: any[]) => this.comments = value)
        );
      })
    );
  }

  ngOnDestroy() {
    this.gc.clearAll();
  }

  hideComment(commentId) {
    this.gc.collect('postService.hideComment',
      this.postService.updateComment(commentId, true).subscribe(v => {
        this.comments.forEach(c => {
          if (c.id === commentId) c.hide = true;
        });
      })
    );
  }

  unhideComment(commentId) {
    this.gc.collect('postService.unhideComment',
      this.postService.updateComment(commentId, false).subscribe(v => {
        this.comments.forEach(c => {
          if (c.id === commentId) c.hide = false;
        });
      })
    );
  }
}
