import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../api/service/user.service';
import { User } from '../../api/model/User';
import { NbAuthService } from '@nebular/auth';
import { defaultAvatar } from '../../config';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { GarbageCollector } from 'src/app/api/util/garbage.collector';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './user-edit-profile.component.html',
  styleUrls: ['./user-edit-profile.component.less']
})
export class UserEditProfileComponent implements OnInit, OnDestroy {

  HOST = environment.host_be;

  loading = false;
  user: User;
  disableBtnAction = false;

  avatarUrl: any;

  gc = new GarbageCollector();

  constructor(private msg: NzMessageService,
    private userService: UserService,
    private authService: NbAuthService,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private _sanitizer: DomSanitizer) {
    this.user = new User();
  }

  ngOnInit() {
    const { id } = this.route.snapshot.params;
    this.gc.collect('userService.getAccountById',
      this.userService.getAccountById(id)
        .subscribe(value => {
          this.user = value;
          if (this.user.avatar)
            this.avatarUrl = this.user.avatar;
          else
            this.avatarUrl = defaultAvatar;
        })
    );
  }

  ngOnDestroy() {
    this.gc.clearAll();
  }

  saveChangeProfile() {
    this.disableBtnAction = true;
    let prepareUser = new User();
    prepareUser.email = this.user.email;
    prepareUser.fullName = this.user.fullName;
    prepareUser.address = this.user.address;
    prepareUser.address = this.user.address;

    this.gc.collect('userService.updateProfile',
      this.userService.updateProfile(this.user.id, prepareUser)
        .subscribe(value => {
          this.notification.success('Thay đổi thông tin', 'Thông tin cá nhân đã được thay đổi');
          this.router.navigate(['users', this.user.id, 'detail']);
        })
    );
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
      if (!isJPG) {
        this.msg.error('Ảnh đại diện phải thuộc định dạng PNG/JPG/JPEG');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Ảnh đại diện phải nhỏ hơn 2MB!');
        observer.complete();
        return;
      }
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error('Kích thước ảnh quá nhỏ!');
          observer.complete();
          return;
        }

        observer.next(isJPG && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  };

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src!);
        resolve(height >= 10 && width >= 10);
      };
    });
  }

  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.loading = false;
        const url = `${environment.host_be}/requests/description-images/${info.file.response[0]}`;
        this.gc.collect('userService.uploadAvatar',
          this.userService.uploadAvatar(this.user.id, url).subscribe(value => this.avatarUrl = url));
        this.msg.success('Ảnh đại điện đã được thay đổi');
        break;
      case 'error':
        this.msg.error('Đã xảy ra lỗi. Ảnh đại điện chưa được thay đổi');
        this.loading = false;
        break;
    }
  }
}
