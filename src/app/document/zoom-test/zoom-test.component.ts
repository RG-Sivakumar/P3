import { Component, OnDestroy, OnInit } from '@angular/core';
import { PanZoomConfig, PanZoomAPI, PanZoomModel } from 'ng2-panzoom';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-zoom-test',
  templateUrl: './zoom-test.component.html',
  styleUrls: ['./zoom-test.component.css']
})
export class ZoomTestComponent implements OnInit, OnDestroy {
  public panZoomConfig: PanZoomConfig = new PanZoomConfig;
  private panZoomAPI: PanZoomAPI;
  private apiSubscription: Subscription;
  constructor() { }

  ngOnInit(): void {
    this.apiSubscription = this.panZoomConfig.api.subscribe((api: PanZoomAPI) => this.panZoomAPI = api);
  }

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();  // don't forget to unsubscribe.  you don't want a memory leak!
  }
}
