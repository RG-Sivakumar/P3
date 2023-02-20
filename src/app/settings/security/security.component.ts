import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.css"],
})
export class SecurityComponent implements OnInit {
  firstName: string;
  lastName: string;
  firstNameEdit: boolean;
  LastNameEdit: boolean;

  constructor() {}

  ngOnInit(): void {}

  againHideFirst() {}
  againHideLast() {}
  focusInputLastName() {}
}
