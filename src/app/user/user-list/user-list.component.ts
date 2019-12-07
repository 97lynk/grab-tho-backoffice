import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../api/service/user.service';
import { Page } from '../../api/model/Page';
import { User } from '../../api/model/User';
import { GarbageCollector } from 'src/app/api/util/garbage.collector';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['user-list.component.less']
})
export class UserListComponent implements OnInit, OnDestroy {

  page: Page<any> = new Page<any>();

  ROLE_NAME = {
    ROLE_CUSTOMER: 'Khách hàng',
    ROLE_REPAIRER: 'Thợ',
    ROLE_FB: 'Đăng nhập từ Facebook'
  };

  // filter account
  allChecked = true;
  indeterminate = false;
  accountOptions = [
    { label: 'Khách hàng', value: 'ROLE_CUSTOMER', checked: true },
    { label: 'Thợ', value: 'ROLE_REPAIRER', checked: true }
  ];

  loading = false;

  gc = new GarbageCollector();

  constructor(private userSerive: UserService) {
    this.page.content = [];
    this.page.totalElements = 0;
    this.page.size = 0;
    this.page.totalPages = 0;
  }

  ngOnInit(): void {
    this.loadData(1);
  }

  ngOnDestroy() {
    this.gc.clearAll();
  }

  loadData(page: number) {
    this.loading = true;
    let filterBy = this.accountOptions.filter(item => item.checked).map(item => item.value);

    this.gc.collect('userSerive.getAccounts',
      this.userSerive.getAccounts(page - 1, filterBy)
        .subscribe((data: Page<User>) => {
          this.page = data;
          this.loading = false;
        },
          error => {
            this.loading = false;
          })
    );
  }


  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.accountOptions = this.accountOptions.map(item => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.accountOptions = this.accountOptions.map(item => {
        return {
          ...item,
          checked: false
        };
      });
    }

    this.loadData(1);
  }

  updateSingleChecked(): void {
    this.loadData(1);
    if (this.accountOptions.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.accountOptions.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
}
