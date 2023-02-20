import { NgxZendeskWebwidgetService } from "ngx-zendesk-webwidget";
import { Component } from "@angular/core";

@Component({
  selector: "app",
  templateUrl: "./app.html",
})
export class app {
  constructor(private _NgxZendeskWebwidgetService: NgxZendeskWebwidgetService) {
    this._NgxZendeskWebwidgetService.zE("webWidget", "identify", {
      name: "jithu",
      email: "jithinkumarkp7@gmail.com",
    });

    this._NgxZendeskWebwidgetService.zE("webWidget", "prefill", {
      name: {
        value: "jithu",
        readOnly: true,
      },
      email: {
        value: "jithinkumarkp7@gmail.com",
        readOnly: true,
      },
    });

    this._NgxZendeskWebwidgetService.zE("webWidget", "show");
  }

  logout() {
    this._NgxZendeskWebwidgetService.zE("webWidget", "hide");
  }
}
