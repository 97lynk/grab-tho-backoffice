import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NbRoleProvider } from '@nebular/security';
import { GarbageCollector } from 'src/app/api/util/garbage.collector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {


  title = '';
  LOGO = 'XómTrọHCM';
  isCollapsed = false;
  triggerTemplate: TemplateRef<void> | null = null;
  gc = new GarbageCollector();
  @ViewChild('trigger') customTrigger: TemplateRef<void>;

  isVisible = false;
  temp: TemplateRef<LoginComponent> | null = null;


  constructor(
    private router: Router,
    private route: ActivatedRoute) {

    this.gc.collect('url',
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.title = this.route.root.firstChild.snapshot.data['title'];
        }
      })
    );
  }


  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.gc.clearAll();
  }

  showLoginBox() {
    this.isVisible = true;
  }

  collapse($event) {
    this.isCollapsed = $event;
    this.LOGO = (this.isCollapsed) ? '' : 'XómTrọHCM';
  }

}
