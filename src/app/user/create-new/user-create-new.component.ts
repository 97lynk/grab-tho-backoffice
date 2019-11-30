import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { UserService } from '../../api/service/user.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/api/model/User';

@Component({
  selector: 'app-create-new',
  templateUrl: './user-create-new.component.html',
  styleUrls: ['./user-create-new.component.less']
})
export class UserCreateNewComponent implements OnInit {

  loading = false;

  avatarUrl: string;

  existEmail = false;

  clicked = false;

  fileUpload: File;

  user = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    address: '',
    phone: '',
    role: 'ROLE_USER'
  };

  constructor(
    private msg: NzMessageService,
    private userService: UserService,
    private router: Router,
    private notification: NzNotificationService) {
  }

  ngOnInit() {
  }


  beforeUpload = (file: File) => {
    this.fileUpload = null;
    this.avatarUrl = '';
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
    if (!isJPG) {
      this.msg.error('Ảnh đại diện phải thuộc định dạng PNG/JPG/JPEG');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('Ảnh đại diện phải nhỏ hơn 2MB!');
      return false;
    }
    // check height
    this.checkImageDimension(file).then(dimensionRes => {
      if (!dimensionRes) {
        this.msg.error('Kích thước ảnh quá nhỏ!');
        return false;
      }
    });

    this.getBase64(file, (img: string) => {
      this.loading = false;
      this.avatarUrl = img;
    });

    this.fileUpload = file;

    return false;
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

  submitCreate() {
    this.clicked = true;
    const req = [
      this.userService.registerAccount({
        email: this.user.email,
        username: this.user.username,
        password: this.user.password,
        fullName: this.user.fullName,
        address: this.user.address,
        phone: this.user.phone,
        role: [this.user.role]
      })
    ];

    if (this.fileUpload) {
      const formData = new FormData();
      formData.append('images', this.fileUpload);
      req.push(this.userService.uploadImage(formData));
    }
    forkJoin(req).subscribe(results => {
      const user = results[0] as User;
      this.clicked = false;
      this.notification.success('Tạo mới tài khoản', `Tài khoản "${this.user.username}" đã được tạo.`);
      if (results[1]) {
        const url = `http://localhost:8080/requests/description-images/${results[1][0]}`;
        this.userService.uploadAvatar(user.id, url).subscribe(value => this.avatarUrl = url);
      }
      this.router.navigateByUrl('/users')
    },
      error => {
        this.clicked = false;
        this.notification.error('Tạo mới tài khoản', `Đã có lỗi xảy ra!<br/>Tài khoản chưa được tạo: ${error.error.error_description || ''}`);
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
        this.msg.success('Ảnh đại điện đã được thay đổi');
        break;
      case 'error':
        this.msg.error('Đã xảy ra lỗi. Ảnh đại điện chưa được thay đổi');
        this.loading = false;
        break;
    }
  }
}
