import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { PostService } from '../../api/service/post.service';
import { Post } from '../../api/model/Posts';
import { ActivatedRoute, Router } from '@angular/router';
import { Accomodation } from '../../api/model/Accomodation';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { defaultAvatar } from 'src/app/config';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.less']
})
export class PostDetailComponent implements OnInit {

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

  fileList = [
    {
      uid: -1,
      name: 'can-ho.png',
      status: 'done',
      url: 'http://localhost:8080/api/image/064e893a-1d69-47c5-8e07-d74a283106db'
    }
  ];

  constructor(private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService) {
    this.post.userAvatar = defaultAvatar;
  }

  ngOnInit() {
    this.route.url.subscribe(url => {
      const { id } = this.route.snapshot.params;
      this.postService.getPostById(id)
        .pipe(tap((value: Post) => {
          value.imagesDescription.map((img, i) => {
            this.fileList.push({
              uid: i,
              name: 'a' + i + '.png',
              status: 'done',
              url: img
            });
          });
        }))
        .subscribe((value: Post) => {
          this.post = value;
        });

      this.postService.getComments(id, ['RECEIVE', 'QUOTE', 'ACCEPT', 'COMPLETE', 'FEEDBACK', 'CLOSE'])
        .subscribe((value: any[]) => {
          this.comments = value;
        });
    });
  }

  hideComment(commentId) {
    this.postService.updateComment(commentId, true).subscribe(v => {
      this.comments.forEach(c => {
        if (c.id === commentId) c.hide = true;
      });
    });
  }

  unhideComment(commentId) {
    this.postService.updateComment(commentId, false).subscribe(v => {
      this.comments.forEach(c => {
        if (c.id === commentId) c.hide = false;
      });
    });
  }

  approvePost() {
    // this.disableBtnAction = true;
    // this.postService.approvePostById(this.post.id)
    //   .subscribe((value: Post) => {
    //     this.notification.success('Duyệt bài', `Bài viết "${value.title}" đã được kiểm duyệt.`);
    //     this.router.navigateByUrl('/posts?tab=1');
    //   }, error => {
    //     this.disableBtnAction = false;
    //   });
  }
}
