import {Component, OnInit} from '@angular/core';
import {NbAuthResult, NbLoginComponent, NbAuthOAuth2JWTToken} from '@nebular/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends NbLoginComponent implements OnInit {
 
  showTip = false;

  hasError = false;

  errorMsg = 'Tài khoản hoặc mật khẩu không chính xác';

  ngOnInit(): void {
    this.user.email = '';
    this.user.password = '';
  }

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;
    this.hasError = false;

    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      let redirect = result.getRedirect();

      if (result.isSuccess()) {
        this.messages = result.getMessages();
        let roles = (result.getToken() as NbAuthOAuth2JWTToken).getAccessTokenPayload().authorities;
        redirect = '/users';
      } else {
        this.errors = result.getErrors();
        this.hasError = true;
        switch (result.getErrors().join()) {
          case 'Bad credentials':
            this.errorMsg ='Tài khoản hoặc mật khẩu không chính xác';
            break;
          case 'User account is locked':
            this.errorMsg = 'Tài khoản đã bị khóa';
            break;
          default:
            this.errorMsg = 'Đăng nhập không thành công';
        }
      }

      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

}
