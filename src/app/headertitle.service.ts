import { Injectable } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HeadertitleService {
  public title = new BehaviorSubject("");

  private changeTitle = new BehaviorSubject("");

  public maintitle = new BehaviorSubject("");

  constructor() {}

  sendProjectName(changetitle: any) {
    this.changeTitle.next(changetitle);
  }

  setTitle(title) {
    this.title.next(title);
  }

  mainTitle(maintitle) {
    this.maintitle.next(maintitle);
  }
}
