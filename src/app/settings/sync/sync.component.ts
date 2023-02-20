import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-sync",
  templateUrl: "./sync.component.html",
  styleUrls: ["./sync.component.css"],
})
export class SyncComponent implements OnInit {
  firstName: string;
  firstNameEdit: boolean;

  constructor() {}

  ngOnInit(): void {}

  againHideFirst() {}
  againHideLast() {}
  focusInputLastName() {}
  focusInputFirstName() {}
}
