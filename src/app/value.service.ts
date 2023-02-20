import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { login } from "./projectmanagement/models/login-model";
import { v1 as uuidv1 } from "uuid";
import { DataService } from "./data.service";
import { EncryptDecryptService } from "./commonshared/services/encrypt-decrypt.service";

@Injectable({
  providedIn: "root",
})

export class ValueService {
  private messageSource = new BehaviorSubject<any>(false);
  su: login;
  currentMessage = this.messageSource.asObservable();
  constructor(private dataService:DataService,private encrptdecrpt:EncryptDecryptService) {
  }
  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  firstLetterCapital(input) {
    if (input) {
      let firsttypeLetter = input[0].toUpperCase();
      let othertypeletters = input.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      // var changedName = changeUpperCaseProjectName.split("'").join("‘");
      // changedName = changedName.split("\"").join("“");
      return changeUpperCaseProjectName;
    }
  }

  getStrokeColor(checkStroke) {
    if (checkStroke.includes("#")) {
      if (checkStroke == "#NNNNNN00") {
        return "transparent";
      } else {
        return checkStroke;
      }
    }
    else {
      switch (checkStroke) {
        case "blue":
          return "#002F5F";
        case "red":
          return "#BC0900";
        case "orange":
          return "#F48F00";
        case "yellow":
          return "#FFFF00";
        case "green":
          return "#98D133";
        case "default_blue":
          return "#015ECD";
        case "purple":
          return "#6C2EA7";
        case "pink":
          return "#DF1ED3";
        case "dark_pink":
          return "#C832B1";
        case "light_blue":
          return "#80F1FE";
        case "brown":
          return "#7C4E40";
        case "grey":
          return "#949494";
        case "medium_grey":
          return "#CCCCCC";
        case "light_grey":
          return "#000000";
        case "white":
          return "#FFFFFF";
        case "clear":
          return "#NNNNNN00";
        default:
          return "#002F5F";
      }
    }
  }

  getFillColor(checkFill) {
    if (checkFill.includes("#")) {
      if (checkFill == "#NNNNNN00") {
        return "transparent";
      } else {
        return checkFill;
      }
    } else {
      switch (checkFill) {
        case "blue":
          return "#002F5F";
        case "red":
          return "#BC0900";
        case "orange":
          return "#F48F00";
        case "yellow":
          return "#FFFF00";
        case "green":
          return "#98D133";
        case "default_blue":
          return "#015ECD";
        case "purple":
          return "#6C2EA7";
        case "pink":
          return "#DF1ED3";
        case "dark_pink":
          return "#C832B1";
        case "light_blue":
          return "#80F1FE";
        case "brown":
          return "#7C4E40";
        case "grey":
          return "#949494";
        case "medium_grey":
          return "#CCCCCC";
        case "light_grey":
          return "#000000";
        case "white":
          return "#FFFFFF";
        case "clear":
          return "#NNNNNN00";
        default:
          return "#002F5F";
      }
    }
  }

  generateUUID() {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let uuidGenerator = this.su.user_id + '-' + uuidv1().toUpperCase() + '-' + new Date().getTime();
    return uuidGenerator;
  }






}
