import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserService } from '../../api/service/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../api/model/User';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { NbAccessChecker } from '@nebular/security';
import { PostService } from '../../api/service/post.service';
import { Action } from '../../api/model/Action';
import { tap } from 'rxjs/operators';
import { Page } from '../../api/model/Page';
import { NbAuthOAuth2JWTToken, NbTokenService } from '@nebular/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { defaultAvatar } from '../../config';
import { Post } from 'src/app/api/model/Posts';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.less']
})
export class UserDetailComponent implements OnInit {

  user: User;
  
  repairer: any;

  actions = [];

  posts = [];

  feedback = [];

  ACTION_COLOR = {
    POST: 'blue',
    RECEIVE: 'blue',
    QUOTE: 'blue',
    ACCEPT: 'cyan',
    COMPLETE: 'green',
    CLOSE: 'red',
    FEEDBACK: 'gold'
  };

  ROLE_NAME = {
    ROLE_CUSTOMER: 'Khách hàng',
    ROLE_REPAIRER: 'Thợ',
    ROLE_ADMIN: 'Quản trị viên',
    ROLE_MODERATOR: 'Kiểm duyệt viên'
  };

  @ViewChild('more')
  pendingTemp: TemplateRef<any>;

  pending: any;

  currentPage = 0;

  canBlock = false;

  role = 'ROLE_CUSTOMER';

  avatar: any = defaultAvatar;

  id: number;

  constructor(private userService: UserService,
    private postService: PostService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private accessChecker: NbAccessChecker,
    private tokenService: NbTokenService,
    private route: ActivatedRoute,
    private _sanitizer: DomSanitizer) {
    this.user = new User();
    this.tokenService.get().subscribe((token: NbAuthOAuth2JWTToken) => {
      this.canBlock = (token.getAccessTokenPayload()['account'].id != this.route.snapshot.params.id);
    });
  }

  ngOnInit() {
    this.route.url.subscribe(url => {
      this.id = this.route.snapshot.params.id;
      this.userService.getAccountById(this.id)
        .subscribe(value => {
          this.user = value;
          this.role = (this.user.roles.length <= 0) ? 'ROLE_CUSTOMER' : this.user.roles[0];

          if (this.user.avatar)
            this.avatar = this.user.avatar;
          else
            this.avatar = defaultAvatar;

          if (this.role === 'ROLE_REPAIRER') {
            this.userService.getRepairerInfo(this.id).subscribe(value => this.repairer = value);
          }

          this.loadAction(this.id);
        });

      this.postService.getFeedback(this.id)
        .subscribe((data: any[]) => {
          this.feedback = data;
        });
    })
  }

  loadAction(id: number) {
    if (this.role === 'ROLE_CUSTOMER')
      this.postService.getActions(false, this.id, ['POST', 'ACCEPT', 'CLOSE', 'FEEDBACK'], this.currentPage)
        .pipe(tap((value: any) => {
          if (value.last) this.pending = false;
          else {
            this.currentPage++;
            this.pending = this.pendingTemp;
          }
        }))
        .subscribe((value: Page<any>) => {
          this.actions.push(...value.content);
        });
    else if (this.role === 'ROLE_REPAIRER')
      this.postService.getActions(true, this.id, ['RECEIVE', 'QUOTE', 'COMPLETE'], this.currentPage)
        .pipe(tap((value: any) => {
          if (value.last) this.pending = false;
          else {
            this.currentPage++;
            this.pending = this.pendingTemp;
          }
        }))
        .subscribe((value: Page<any>) => {
          this.actions.push(...value.content);
        });
  }

  confirmBlockAccount() {
    this.modal.confirm({
      nzTitle: 'Khóa tài khoản',
      nzContent: `Bạn có muốn khóa tài khoản ${this.user.email}?`,
      nzOkText: 'Khóa',
      nzOkType: 'danger',
      nzOnOk: () => this.blockAccount(true),
      nzCancelText: 'Hủy'
    });
  }

  confirmUnBlockAccount() {
    this.modal.confirm({
      nzTitle: 'Mở khóa tài khoản',
      nzContent: `Bạn có muốn mở khóa cho tài khoản ${this.user.email}?`,
      nzOkText: 'Mở khóa',
      nzCancelText: 'Hủy',
      nzOnOk: () => this.blockAccount(false),
    });
  }

  blockAccount(block: boolean) {
    if (block)
      this.userService.blockAccount(this.user.id).subscribe(value => {
        this.notification.success('Khóa tài khoản', `Tài khoản ${this.user.email} đã bị khóa`);
        this.user = value;
      });
    else
      this.userService.unBlockAccount(this.user.id).subscribe(value => {
        this.notification.success('Mở khóa tài khoản', `Tài khoản ${this.user.email} đã được mở khóa`);
        this.user = value;
      });
  }

  fomatDateTime(dt: number[]) {
    return `${dt[3]}:${dt[4]} ${dt[2]}/${dt[1]}/${dt[0]}`;
  }

}
