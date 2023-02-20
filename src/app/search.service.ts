import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class SearchService {
  private refreshNeed$ = new Subject<void>();
  private history = [];

  get _refreshNeed$() {
    return this.refreshNeed$;
  }

  constructor(private router: Router) {}

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/index';
  }

}
