import { Component, EventEmitter, HostListener, OnInit, Output, OnDestroy } from '@angular/core';
import { NbAuthOAuth2JWTToken, NbAuthService } from '@nebular/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { defaultAvatar } from '../../config';
import { UserService } from '../../api/service/user.service';
import { User } from '../../api/model/User';
import { GarbageCollector } from 'src/app/api/util/garbage.collector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {

  inputSearch = '';
  user: User;
  isCollapsed = false;
  gc = new GarbageCollector();

  @Output('collapse')
  changeCollapse = new EventEmitter<boolean>();

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth < 992) {
      this.isCollapsed = true;
      this.changeCollapse.emit(this.isCollapsed);
    }
  }

  avatar: any = defaultAvatar;

  constructor(private authService: NbAuthService) {

    this.gc.collect('authService.onTokenChange',
      this.authService.onTokenChange()
        .subscribe((token: NbAuthOAuth2JWTToken) => {
          if (token.isValid()) {
            this.user = token.getPayload()['account'];
            if (this.user.avatar)
              this.avatar = this.user.avatar;
            else
              this.avatar = defaultAvatar;
          }
        })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.gc.clearAll();
  }

  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.isCollapsed = !this.isCollapsed;
    this.changeCollapse.emit(this.isCollapsed);
  }
}
