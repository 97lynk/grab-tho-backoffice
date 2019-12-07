import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../api/service/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { User } from '../../api/model/User';
import { GarbageCollector } from 'src/app/api/util/garbage.collector';

@Component({
  selector: 'app-user-security',
  templateUrl: './user-security.component.html',
  styleUrls: ['./user-security.component.css']
})
export class UserSecurityComponent implements OnInit, OnDestroy {

  id = -1;
  newPassword = '';
  confirmPassword = '';

  passwordVisible = false;
  cfPasswordVisible = false;
  noMatchPassword = false;
  user: User;

  role = 'ROLE_USER';

  preRole = 'ROLE_USER';

  canChangeRole = false;

  loading = false;

  gc = new GarbageCollector();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) {
    this.user = new User();
  }

  ngOnInit() {
    this.loading = true;
    this.id = +this.route.snapshot.params.id;

    this.gc.collect('userService.getAccountById',
      this.userService.getAccountById(this.id)
        .subscribe(value => {
          this.user = value;
          this.role = (this.user.roles.length <= 0) ? 'ROLE_USER' : this.user.roles[0];
          this.preRole = this.role;
          this.canChangeRole = this.preRole != 'ROLE_ADMIN';
          this.loading = false;
        },
          error => {
            this.loading = false;
          })
    );
  }

  ngOnDestroy() {
    this.gc.clearAll();
  }

  saveChange() {
    this.gc.collect('userService.changePassword',
      this.userService.changePassword(this.id, this.newPassword)
        .subscribe(v => {
          this.location.back();
        }, error => {
          // this.wrongPassword = true;
        })
    );
  }

  saveChangeRole() {
    this.gc.collect('userService.changeRole',
      this.userService.changeRole(this.id, this.role)
        .subscribe(v => {
          this.location.back();
        }, error => {
          this.role = this.preRole;
        })
    );
  }
}
