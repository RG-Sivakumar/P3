import { Injectable, EventEmitter } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { toggleValue } from "../models/toggleChange.model";

@Injectable({
  providedIn: "root",
})
export class DataserviceService {
  // pageSyncStateComplete(arg0: boolean) {
  //   throw new Error("Method not implemented.");
  // }
  messagedetails: any;
  constructor() { }

  public subject = new Subject<any>();

  public moveflag = new Subject<string>();

  sendMessage(message: any) {
    this.subject.next(message);
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  private subjectMediaTags = new Subject<any>();

  sendMediaTagsMessage(message: any) {
    this.subjectMediaTags.next(message);
  }

  getMediaTagsMessage(): Observable<any> {
    return this.subjectMediaTags.asObservable();
  }

  private subjectLinkedPageData = new Subject<any>();

  sendLinkedPageData(message: any) {
    this.subjectLinkedPageData.next(message);
  }

  getLinkedPageData(): Observable<any> {
    return this.subjectLinkedPageData.asObservable();
  }

  private subjectRenameMedia = new Subject<any>();

  sendMessageMedia(message: any) {
    this.subjectRenameMedia.next(message);
  }

  getMessageMedia(): Observable<any> {
    return this.subjectRenameMedia.asObservable();
  }

  private messageSource = new BehaviorSubject(false);
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: boolean) {
    this.messageSource.next(message);
  }
  searchselector = new EventEmitter<any>();

  remainder = new EventEmitter<any>();

  searchoption = new EventEmitter<any>();

  formoption = new EventEmitter<any>();

  currentpageidsearch = new EventEmitter<any>();

  statusUpdated = new EventEmitter<any>();

  public deleteannotation = new Subject<string>();

  passValue(data) {
    //passing the data as the next observable
    this.deleteannotation.next(data);
  }

  updateStatus(status: string) { }

  getIdUpdated = new EventEmitter<any>();

  sendgetId(activateId: string) { }

  multiSelectFooter = new EventEmitter<any>();

  imageChangeDocHeader = new EventEmitter<any>();

  moveAccess = new EventEmitter<any>();

  moveAccessRemove = new EventEmitter<any>();

  moveAccessCancel = new EventEmitter<any>();

  copyAnnotation = new EventEmitter<any>();

  copyAnnotationMultiple = new EventEmitter<any>();

  editAnnotation = new EventEmitter<any>();

  rotateandResize = new EventEmitter<any>();

  removeGroup = new EventEmitter<any>();

  removeGroupSingle = new EventEmitter<any>();

  annotationAlignment = new EventEmitter<any>();

  copyAnnotationSingle = new EventEmitter<any>();

  setIconBaseSize = new EventEmitter<any>();
  mediaTagsUpdate = new EventEmitter<any>();
  getannotationid = new EventEmitter<any>();
  navgiationSendData = new EventEmitter<any>();
  htmlelement = new EventEmitter<any>();
  htmlelement1 = new EventEmitter<any>();
  navgiationgetData = new EventEmitter<any>();

  sendrealwidth = new EventEmitter<any>()

  sendrealheight = new EventEmitter<any>()

  setScaleTrigger = new EventEmitter<any>();

  viewOnlyModeTrigger = new EventEmitter<any>();

  rapidModeTrigger = new EventEmitter<any>();

  groupingAnntsTrigger = new EventEmitter<any>();
  
  searchannotationCheckbox = new EventEmitter<any>();

  viewOnlyModeChecked = new EventEmitter<any>();

  searchannotationId = new EventEmitter<any>();

  imageChangeDocHeaderSearch = new EventEmitter<any>();

  searchLayerDatas = new EventEmitter<any>();

  search_annotation = new EventEmitter<any>();

  documentlistReceive = new EventEmitter<any>();

  checkedAnnotationId = new EventEmitter<any>();

  filterOptions = new EventEmitter<any>();

  removeForm = new EventEmitter<any>();

  layerPageUpdateData = new EventEmitter<any>();

  toolbarDataShapes = new EventEmitter<any>();

  undoAction = new EventEmitter<any>();

  redoAction = new EventEmitter<any>();

  useasToolbarlistUpdate = new EventEmitter<any>();

  private messageLayerData = new BehaviorSubject([]);
  sharedMessage = this.messageLayerData.asObservable();


  sendMessageLayerDatas(message: any) {
    this.messageLayerData.next(message);
  }

  // private messageprojectFolderList = new BehaviorSubject([]);
  // sharedMessageprojectFolderList = this.messageprojectFolderList.asObservable();

  // sendMessageprojectFolderList(message: any) {
  //   this.messageprojectFolderList.next(message);
  // }

  private messagetoolbarlist = new BehaviorSubject([]);
  sharedMessagetoolbarlist = this.messagetoolbarlist.asObservable();

  sendMessagetoolbarlist(message: any) {
    this.messagetoolbarlist.next(message);
  }

  private messagegetDocumentdetails = new BehaviorSubject([]);
  sharedMessagegetDocumentdetails = this.messagegetDocumentdetails.asObservable();

  sendMessagegetDocumentdetails(message: any) {
    this.messagegetDocumentdetails.next(message);
  }
  senddetails(message: any) {
    this.messagedetails.next(message);
  }
  moveAccessfn(data) {
    this.moveflag.next(data);
  }





  // private previousDocumentBackup = new BehaviorSubject({});
  // sharedMessagepreviousDocumentBackup = this.previousDocumentBackup.asObservable();


  // sendMessagepreviouDocumentData(message: any) {
  //   this.previousDocumentBackup.next(message);
  // }

  synActionNew = new EventEmitter<any>();
  filtertool = new EventEmitter<any>();
  synActionCompleteNew = new EventEmitter<any>();

  layerDatafromnavigation = new EventEmitter<any>();

  layeractiveEnable = new EventEmitter<any>();

  layerPageAllUpdateReceive = new EventEmitter<any>();

  closesearchfromdocument = new EventEmitter<any>();

  layerCheckBoxClick = new EventEmitter<any>();

  newformmodel = new EventEmitter<any>();

  layerBoxCloseTrigger = new EventEmitter<any>();

  copydatadialogclose = new EventEmitter<any>();

  diameter_changes: EventEmitter<any> = new EventEmitter();

  userroleshare = new EventEmitter<any>();





}
