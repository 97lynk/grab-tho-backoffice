import { Component, OnDestroy } from '@angular/core';
import { NbAuthResult, NbLogoutComponent } from '@nebular/auth';
import { GarbageCollector } from 'src/app/api/util/garbage.collector';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent extends NbLogoutComponent implements OnDestroy {

  gc = new GarbageCollector();

  logout(strategy: string): void {
    this.gc.collect('logout',
      this.service.logout(strategy).subscribe((result: NbAuthResult) => {
        setTimeout(() => {
          return this.router.navigateByUrl('/login');
        }, this.redirectDelay);

      })
    );
  }

  ngOnDestroy() {
    this.gc.clearAll();
  }
}
