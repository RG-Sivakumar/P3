import { EventEmitter, Injectable } from "@angular/core";
import { Subject, Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DocumentshareddataService {

  setbaseiconchanges: BehaviorSubject<number>;
  getDrawWidthandHeight_service:any =  { left: 0, top: 0, width: 35, height: 35 };
  document_details:any = [];

  constructor() { 
    this.setbaseiconchanges = new BehaviorSubject(this.getDrawWidthandHeight_service);
  }

  changeBaseIconWidthHeight(getWidthHeight){
    this.setbaseiconchanges.next(getWidthHeight);
  }


  private subject = new Subject<any>();

  sendMessage(message: any) {
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  switchPagesendPageNumber = new EventEmitter<any>();


  set_base_icon_changes = new EventEmitter<any>();


  private linkCountStore = new BehaviorSubject(0);
  // currentlinkCount = this.linkCountStore.asObservable();

  updatelinkCount(message: number) {
    this.linkCountStore.next(message);
  }

  getLinkCount(): Observable<number> {
    return this.linkCountStore.asObservable();
  }

  private linkAnnotationIdStore = new BehaviorSubject("");

  updatelinkAnnotationId(annotationId: string) {
    this.linkAnnotationIdStore.next(annotationId);
  }

  getlinkAnnotationId(): Observable<string> {
    return this.linkAnnotationIdStore.asObservable();
  }


  private mediaCountStore = new BehaviorSubject(0);
  // currentlinkCount = this.linkCountStore.asObservable();

  updatemediaCount(message: number) {
    this.mediaCountStore.next(message);
  }

  getmediaCount(): Observable<number> {
    return this.mediaCountStore.asObservable();
  }


  private messageSource = new BehaviorSubject(false);
  currentRotateandResizeMessage = this.messageSource.asObservable();

  changeRotateandResizeMessage(message: boolean) {
    this.messageSource.next(message)
  }

  



}
