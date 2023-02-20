import { AfterViewInit, Component, OnInit } from '@angular/core';
import { switchMap, takeUntil, pairwise } from "rxjs/operators";


@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent implements OnInit, AfterViewInit  {

  drawrectangle_path:{x:number,y:number,width:number,height:number} = {x:0,y:0,width:0,height:0};

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.drawRectangleSVG();
  }

  drawRectangleSVG() {
    let newcreatedElement = document.getElementById('multiselectsvg');
    let rect = document.getElementById('rectanglesvg');
    console.log(newcreatedElement);
    // add transform on svg If zoomin 1 above
    // this.addZoom(newcreatedElement);
    var last_mousex = 0;
    var last_mousey = 0;
    var mousex = 0;
    var mousey = 0;
    var mousedown = false;
    var width = 0;
    var height = 0;
    //Mousedown

    const mousemove_ev = (e) =>{
      e.preventDefault();
      mousex = e.offsetX;
      mousey = e.offsetY;
      console.log('mouse move outside');
      // first_click_capture_points = false;
      if (mousedown) {
        console.log('move_move inside');
        width = mousex - last_mousex;
        height = mousey - last_mousey;
        let getWidth = (last_mousex) - (mousex);
        let getHeight = (last_mousey) - (mousey);
        let positive_width = getWidth < 0 ? -(getWidth) : getWidth;
        let positive_height = getHeight < 0 ? -(getHeight) : getHeight;
        let svg_left = (last_mousex) < (mousex) ? (last_mousex) : (mousex);
        let svg_top = (last_mousey) < (mousey) ? (last_mousey) : (mousey);
        // this.drawrectangle_path.x = svg_left;
        // this.drawrectangle_path.y = svg_top;
        // this.drawrectangle_path.width = positive_width - 1;
        // this.drawrectangle_path.height = positive_height - 1;
        rect.setAttribute("x", svg_left.toString());
        rect.setAttribute("y", svg_top.toString());
        rect.setAttribute("width", (positive_width - 1).toString());
        rect.setAttribute("height", (positive_height - 1).toString());
        rect.setAttribute('fill', "yellow");
        rect.setAttribute('stroke', "black");
        rect.setAttribute('stroke-width', "5");
      }
    }

    const mouseup_ev = (e) =>{
      console.log('mouse up');
      mousedown = false;
      mousex = e.offsetX;
      mousey = e.offsetY;
      width = mousex - last_mousex;
      height = mousey - last_mousey;
      width = width < 0 ? -(width) : width;
      height = height < 0 ? -(height) : height;
      console.log(width, height);
      newcreatedElement.removeEventListener("mousemove",mousemove_ev);
      newcreatedElement.removeEventListener("mouseup",mouseup_ev);
    }
    
    const mousedown_ev = (e) =>{
      e.preventDefault();
      mousedown = true;
      console.log('mousedowninside called');
      last_mousex = e.offsetX;
      last_mousey = e.offsetY;
    }
    newcreatedElement.addEventListener("mousedown",mousedown_ev);
    newcreatedElement.addEventListener("mousemove",mousemove_ev);
    newcreatedElement.addEventListener("mouseup",mouseup_ev);

   
  }

  // captureEventsMultiple() {
  //   var pdfImg = document.getElementById("pdfImg");
  //   let newcreatedElement = document.createElement("canvas");
  //   newcreatedElement.setAttribute("width", this.realWidth);
  //   newcreatedElement.setAttribute("height", this.realHeight);
  //   newcreatedElement.setAttribute("customeMultipleAttribute", "1");
  //   newcreatedElement.style.position = "absolute";
  //   newcreatedElement.style.top = "0px";
  //   newcreatedElement.style.left = "0px";
  //   newcreatedElement.style.zIndex = "999";
  //   pdfImg.appendChild(newcreatedElement);
  //   // add transform on svg If zoomin 1 above
  //   this.addZoom(newcreatedElement);
  //   var previousPosition: any = "";
  //   var currentPosition: any = "";
  //   // var canvasEl: HTMLCanvasElement = this.createElementChanged;
  //   this.createDocumentStore.multipleDragSelectCanvas = newcreatedElement.getContext("2d");
  //   let initialX: number, initialY: number, currentX = 0, currentY = 0;
  //   newcreatedElement.addEventListener("contextmenu", (e: any) => {
  //     e.preventDefault();
  //   });
  //   fromEvent(newcreatedElement, "mousedown")
  //     .pipe(
  //       switchMap((e: MouseEvent) => {
  //         e.preventDefault();
  //         console.log(e);
  //         let mousedowntrigger = true;
  //         let mousedrag = false;
  //         // this.annotationselectEnableDisable('remove');
  //         initialX = (e.offsetX);
  //         initialY = (e.offsetY);
  //         previousPosition = "";
  //         currentPosition = "";
  //         // disable drag scroll
  //         this.createDocumentStore.disable_drag_scroll = true;
  //         // after a mouse down, we'll record all mouse moves
  //         return fromEvent(newcreatedElement, "mousemove").do(() => {
  //           mousedrag = true;
  //         }).pipe(
  //           // we'll stop (and unsubscribe) once the user releases the mouse
  //           // this will trigger a 'mouseup' event
  //           takeUntil(
  //             fromEvent(newcreatedElement, "mouseup").do(async () => {
  //               console.log('event', e);
  //               e.preventDefault();
  //               console.log(previousPosition, currentPosition);
  //               // disable drag scroll
  //               this.createDocumentStore.disable_drag_scroll = false;
  //               if (mousedowntrigger == true && mousedrag == true) {
  //                 //jose drag select    
  //                 mousedrag = false;
  //                 mousedowntrigger = false;
  //                 console.log('mouse_up');
  //                 const rect = newcreatedElement.getBoundingClientRect();
  //                 if (previousPosition.x > currentPosition.x) {
  //                   let cloneCurrentX = previousPosition.x;
  //                   previousPosition.x = currentPosition.x;
  //                   currentPosition.x = cloneCurrentX;
  //                 }
  //                 if (previousPosition.y > currentPosition.y) {
  //                   let cloneCurrentY = previousPosition.y;
  //                   previousPosition.y = currentPosition.y;
  //                   currentPosition.y = cloneCurrentY;
  //                 }
  //                 let startPositionX = previousPosition.x;
  //                 let startPositionY = previousPosition.y;
  //                 console.log(startPositionX, startPositionY, e);
  //                 let getAllCanvasElements = document.querySelectorAll('svg.documentSVG');
  //                 var filterCanvas = [];
  //                 // console.log(getAllCanvasElements);
  //                 for (let ma = 0; ma < getAllCanvasElements.length; ma++) {
  //                   let getAllElementsXY: any = getAllCanvasElements[ma];
  //                   let getStyle = getComputedStyle(getAllElementsXY);
  //                   let getLeft: any = getStyle.left;
  //                   getLeft = getLeft.substring(getLeft.length - 2, 0);
  //                   let getTop: any = getStyle.top;
  //                   getTop = getTop.substring(getTop.length - 2, 0);
  //                   let getWidth: any = getStyle.width;
  //                   getWidth = getWidth.substring(getWidth.length - 2, 0);
  //                   let getHeight: any = getStyle.height;
  //                   getHeight = getHeight.substring(getHeight.length - 2, 0);
  //                   let checkBoundingBox = false;
  //                   getLeft = Number(getLeft);
  //                   getTop = Number(getTop);
  //                   getWidth = Number(getWidth);
  //                   getHeight = Number(getHeight);
  //                   let get_transform = getStyle.transform;
  //                   console.log('transform', get_transform)
  //                   let EndPointX = currentPosition.x;
  //                   let EndPointY = currentPosition.y;
  //                   let get_full_width = getLeft + getWidth;
  //                   let get_full_height = getTop + getHeight;
  //                   // checking if rotation has the shape x and y changes 

  //                   // let annotId = getAllElementsXY.getAttribute('id');
  //                   // let alreadySelected = this.createDocumentStore.selectedAnnotations.some((ids)=>ids===annotId);
  //                   console.log('old Method', getLeft >= startPositionX && EndPointX >= getLeft && getTop >= startPositionY && EndPointY >= getTop)
  //                   console.log('canvas', getLeft, getTop, getWidth, getHeight, get_full_width, get_full_height);
  //                   console.log('box', startPositionX, startPositionY, EndPointX, EndPointY);
  //                   let inside_bound_values = (getLeft >= startPositionX && EndPointX >= getLeft && getTop >= startPositionY && EndPointY >= getTop) || (getLeft >= startPositionX && EndPointX >= getLeft && getTop >= startPositionY && EndPointY >= getTop)
  //                   //if ((getLeft >= startPositionX && EndPointX >= getLeft && getTop >= startPositionY && EndPointY >= getTop)) {
  //                   if ((getLeft > startPositionX && getLeft < EndPointX && getTop > startPositionY && getTop < EndPointY) || (getLeft < startPositionX && get_full_width > EndPointX && getTop < startPositionY && get_full_height > EndPointY) || (get_full_width > startPositionX && get_full_width < EndPointX && getTop > startPositionY && getTop < EndPointY) || (getLeft > startPositionX && getLeft < EndPointX && get_full_height > startPositionY && get_full_height < EndPointY) || (get_full_width > startPositionX && get_full_width < EndPointX && get_full_height > startPositionY && get_full_height < EndPointY) || (getLeft > startPositionX && getLeft < EndPointX && getTop < startPositionY && get_full_height > EndPointY) || (get_full_width > startPositionX && get_full_width < EndPointX && getTop < startPositionY && get_full_height > EndPointY) || (getTop > startPositionY && getTop < EndPointY && getLeft < startPositionX && get_full_width > EndPointX) || (get_full_height > startPositionY && get_full_height < EndPointY && getLeft < startPositionX && get_full_width > EndPointX)) {
  //                     filterCanvas.push(getAllCanvasElements[ma]);
  //                   }
  //                 }
  //                 if (this.createDocumentStore.selectedAnnotations.length == 0 && filterCanvas.length > 0) {
  //                   for (let fc = 0; fc < filterCanvas.length; fc++) {
  //                     let annotId = filterCanvas[fc].getAttribute('id');
  //                     let lock_layer_check = this.lock_condition_multiple(annotId);
  //                     if (lock_layer_check == true) {
  //                       filterCanvas[fc].setAttribute('multimoving', '1');
  //                       this.createDocumentStore.selectedAnnotations.push(annotId);
  //                       this.colorBorderSVG(filterCanvas[fc]);
  //                       this.getMultipleMovingLabelElement(annotId);
  //                     }
  //                     // this.globalMediaCount(singleDataReceived.annotation_media, 'media')
  //                     // this.globalMediaCount(singleDataReceived.annotation_links, 'links')
  //                   }
  //                 }
  //                 else if (this.createDocumentStore.selectedAnnotations.length != 0 && filterCanvas.length > 0) {
  //                   await this.automatic_update_form();
  //                   for (let f = 0; f < filterCanvas.length; f++) {
  //                     let annotId = filterCanvas[f].getAttribute('id');
  //                     let lock_layer_check = this.lock_condition_multiple(annotId);
  //                     if (lock_layer_check == true) {
  //                       let alreadySelected = this.createDocumentStore.selectedAnnotations.some((ids) => ids === annotId);
  //                       if (alreadySelected == false) {
  //                         if (this.attribute_change == true) {
  //                           await this.attribute_value_changes();
  //                         }
  //                         this.createDocumentStore.selectedAnnotations.push(annotId);
  //                         filterCanvas[f].setAttribute('multimoving', '1');
  //                         this.colorBorderSVG(filterCanvas[f]);
  //                         this.getMultipleMovingLabelElement(annotId);
  //                       }
  //                     }
  //                   }
  //                 }
  //                 console.log(this.createDocumentStore.selectedAnnotations);
  //                 let tempArray = this.createDocumentStore.selectedAnnotations;
  //                 this.createDocumentStore.selectedAnnotations = tempArray.filter(function (elem, index, self) {
  //                   return index === self.indexOf(elem);
  //                 })
  //                 this.createDocumentStore.multipleDragSelectCanvas.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
  //                 // get Multiple Annotations data from API
  //               }
  //               else if (mousedrag == false) {

  //                 const rect = newcreatedElement.getBoundingClientRect();
  //                 let clickPosition = {
  //                   x: initialX,
  //                   y: initialY,
  //                 };
  //                 let clickPositionX = clickPosition.x;
  //                 clickPositionX = clickPositionX + 10;
  //                 let clickPositionY = clickPosition.y;
  //                 clickPositionY = clickPositionY + 10;
  //                 console.log(clickPositionX, clickPositionY, e);
  //                 let getAllCanvasElements = document.querySelectorAll('svg.documentSVG');
  //                 var filterCanvas = [];
  //                 // console.log(getAllCanvasElements);
  //                 for (let ma = 0; ma < getAllCanvasElements.length; ma++) {
  //                   let getAllElementsXY: any = getAllCanvasElements[ma];
  //                   let getStyle = getComputedStyle(getAllElementsXY);
  //                   let getLeft: any = getStyle.left;
  //                   getLeft = getLeft.substring(getLeft.length - 2, 0);
  //                   let getTop: any = getStyle.top;
  //                   getTop = getTop.substring(getTop.length - 2, 0);
  //                   let getWidth: any = getStyle.width;
  //                   getWidth = getWidth.substring(getWidth.length - 2, 0);
  //                   let getHeight: any = getStyle.height;
  //                   getHeight = getHeight.substring(getHeight.length - 2, 0);
  //                   let checkBoundingBox = false;
  //                   getLeft = Number(getLeft);
  //                   getTop = Number(getTop);
  //                   getWidth = Number(getWidth);
  //                   getHeight = Number(getHeight);
  //                   let EndPointX = getLeft + getWidth;
  //                   let EndPointY = getTop + getHeight;
  //                   console.log(getLeft <= clickPositionX && EndPointX >= clickPositionX && getTop <= clickPositionY && EndPointY >= clickPositionY)
  //                   if (getLeft <= clickPositionX && EndPointX >= clickPositionX && getTop <= clickPositionY && EndPointY >= clickPositionY) {
  //                     filterCanvas.push(getAllCanvasElements[ma]);
  //                   }
  //                 }
  //                 if (this.createDocumentStore.selectedAnnotations.length == 0 && filterCanvas.length > 0) {
  //                   let annotId = filterCanvas[0].getAttribute('id');
  //                   let itemIndex = this.createDocumentStore.selectedAnnotations.findIndex(item => item == annotId);
  //                   if (itemIndex != -1) {
  //                     if (this.attribute_change == true) {
  //                       await this.attribute_value_changes();
  //                     }
  //                     if (e.which == 3) {
  //                       e.preventDefault();
  //                       e.stopPropagation();
  //                       this.getId = this.createDocumentStore.selectedAnnotations[this.createDocumentStore.selectedAnnotations.length - 1];
  //                       this.canvasRightClick(e, this.getId);
  //                     }
  //                     else {
  //                       var canExecute = true;
  //                       let cloneFilterCVanvas = _.cloneDeep(filterCanvas)
  //                       for (let f = 0; f < filterCanvas.length; f++) {
  //                         if (canExecute == true) {
  //                           for (let g = 0; g < this.createDocumentStore.selectedAnnotations.length; g++) {
  //                             cloneFilterCVanvas = cloneFilterCVanvas.filter((canvas) => canvas.getAttribute('id') != this.createDocumentStore.selectedAnnotations[g])
  //                           }
  //                           if (cloneFilterCVanvas.length > 0) {
  //                             let annotId = cloneFilterCVanvas[0].getAttribute('id');
  //                             let lock_layer_check = this.lock_condition_multiple(annotId);
  //                             if (lock_layer_check == true) {
  //                               this.createDocumentStore.selectedAnnotations.push(annotId);
  //                               cloneFilterCVanvas[f].setAttribute('multimoving', '1');
  //                               this.colorBorderSVG(cloneFilterCVanvas[f]);
  //                               canExecute = false;
  //                               this.getMultipleMovingLabelElement(annotId);
  //                             }
  //                           } else {
  //                             var iVal = 0;
  //                             do {
  //                               if (this.createDocumentStore.selectedAnnotations.length > iVal) {
  //                                 let canvasfiltered = filterCanvas.filter((element) => element.getAttribute('id') === this.createDocumentStore.selectedAnnotations[iVal]);
  //                                 if (canvasfiltered.length > 0) {
  //                                   this.getMultipleMovingLabelElementRemove(this.createDocumentStore.selectedAnnotations[iVal]);
  //                                   this.createDocumentStore.selectedAnnotations.splice(iVal, 1);

  //                                   canvasfiltered[0].removeAttribute('multimoving');
  //                                   this.transparentBorderSVG(canvasfiltered[0]);
  //                                   //this.createDocumentStore.selectedAnnotations
  //                                   canExecute = false
  //                                 }
  //                                 else {
  //                                   iVal += 1
  //                                 }
  //                               } else {
  //                                 canExecute = false
  //                               }
  //                             } while (canExecute)
  //                           }
  //                         }
  //                       }
  //                     }
  //                   } else {
  //                     let lock_layer_check = this.lock_condition_multiple(annotId);
  //                     if (lock_layer_check == true) {
  //                       if (this.attribute_change == true) {
  //                         await this.attribute_value_changes();
  //                       }
  //                       this.createDocumentStore.selectedAnnotations.push(annotId);
  //                       filterCanvas[0].setAttribute('multimoving', '1');
  //                       this.colorBorderSVG(filterCanvas[0]);
  //                       this.getMultipleMovingLabelElement(annotId);
  //                       // right click should call after api call
  //                       // if (e.which == 3) {
  //                       //   e.preventDefault();
  //                       //   e.stopPropagation();
  //                       //   if (this.multiclickdisabled == false) {
  //                       //     this.multiclickdisabled = true;
  //                       //     this.getId = this.createDocumentStore.selectedAnnotations[this.createDocumentStore.selectedAnnotations.length - 1];
  //                       //     this.canvasRightClickBox();
  //                       //   }
  //                       // }
  //                     }
  //                   }
  //                 }
  //                 else if (this.createDocumentStore.selectedAnnotations.length != 0 && filterCanvas.length > 0) {
  //                   // await this.multiannotation_automatic_update_form_rightclick(e, false);
  //                   let get_response = await this.multi_func_handling();
  //                   console.log(get_response);
  //                   if (get_response == 201) {
  //                     return; // stop the running method because previous data not updated in db
  //                   }
  //                   if (this.attribute_change == true) {
  //                     await this.attribute_value_changes();
  //                   }
  //                   var canExecute = true;
  //                   let cloneFilterCVanvas = _.cloneDeep(filterCanvas)
  //                   for (let f = 0; f < filterCanvas.length; f++) {
  //                     if (canExecute == true) {
  //                       for (let g = 0; g < this.createDocumentStore.selectedAnnotations.length; g++) {
  //                         cloneFilterCVanvas = cloneFilterCVanvas.filter((canvas) => canvas.getAttribute('id') != this.createDocumentStore.selectedAnnotations[g])
  //                       }
  //                       if (cloneFilterCVanvas.length > 0) {
  //                         let annotId = cloneFilterCVanvas[0].getAttribute('id');
  //                         this.createDocumentStore.selectedAnnotations.push(annotId);
  //                         cloneFilterCVanvas[f].setAttribute('multimoving', '1');
  //                         this.colorBorderSVG(cloneFilterCVanvas[f]);
  //                         canExecute = false;
  //                         this.getMultipleMovingLabelElement(annotId);
  //                       } else {
  //                         var iVal = 0;
  //                         do {
  //                           if (this.createDocumentStore.selectedAnnotations.length > iVal) {
  //                             let canvasfiltered = filterCanvas.filter((element) => element.getAttribute('id') === this.createDocumentStore.selectedAnnotations[iVal]);
  //                             if (canvasfiltered.length > 0) {
  //                               this.getMultipleMovingLabelElementRemove(this.createDocumentStore.selectedAnnotations[iVal]);
  //                               this.createDocumentStore.selectedAnnotations.splice(iVal, 1);

  //                               canvasfiltered[0].removeAttribute('multimoving');
  //                               this.transparentBorderSVG(canvasfiltered[0]);
  //                               //this.createDocumentStore.selectedAnnotations
  //                               canExecute = false
  //                             }
  //                             else {
  //                               iVal += 1
  //                             }
  //                           } else {
  //                             canExecute = false
  //                           }
  //                         } while (canExecute)
  //                       }
  //                     }
  //                   }
  //                 }
  //               }

  //               if (this.createDocumentStore.selectedAnnotations.length > 0 && filterCanvas.length > 0) {
  //                 // await this.automatic_update_form();
  //                 this.documentService.getMultipleAnnotationData(this.createDocumentStore.selectedAnnotations).subscribe((response) => {
  //                   console.log(response);
  //                   if (response["response_code"] == 200) {
  //                     this.multiselectionList = response["response_body"]["annotation_data"];
  //                     this.selectedAnnotationLength = this.multiselectionList.length;
  //                     this.optionClick = false;
  //                     this.hideSelectForm = true;
  //                     this.sampleFormObject = [];
  //                     this.modelFieldsForm = [];
  //                     this.extend_modelFieldsForm = [];
  //                     this.annotationSelected = true;
  //                     for (let ma = 0; ma < this.multiselectionList.length; ma++) {
  //                       let findLayerIndex = this.layerDatas.findIndex((LData) => LData.layer_id == this.multiselectionList[ma].layer_id);
  //                       if (findLayerIndex != -1) {
  //                         let findAnnotationIndexS = this.layerDatas[findLayerIndex].annotations.findIndex((ADAta) => ADAta.annotation_id == this.multiselectionList[ma].annotation_id);
  //                         if (findAnnotationIndexS != -1) {
  //                           this.layerDatas[findLayerIndex].annotations[findAnnotationIndexS] = this.multiselectionList[ma];
  //                         }
  //                       }
  //                     }
  //                     if (this.multiselectionList.length > 0) {
  //                       this.getId = this.multiselectionList[this.multiselectionList.length - 1].annotation_id;
  //                     }
  //                     this.getCounts();
  //                     if (this.form == true) {
  //                       this.formiconClick();
  //                     }
  //                     else if (this.media == true) {
  //                       this.mediaIconClick();
  //                     }
  //                     else if (this.links == true) {
  //                       this.linkIconClick();
  //                     }
  //                     else if (this.tags == true) {
  //                       this.tagIconClick();
  //                     }
  //                     else if (this.properties == true) {
  //                       this.propertyIconClick();
  //                     }
  //                     // canvas right click function call after api calling done
  //                     if (e.which == 3) {
  //                       e.preventDefault();
  //                       e.stopPropagation();
  //                       this.getId = this.createDocumentStore.selectedAnnotations[this.createDocumentStore.selectedAnnotations.length - 1];
  //                       this.canvasRightClick(e, this.getId)
  //                     }
  //                   }
  //                 })
  //               }
  //               else if (this.createDocumentStore.selectedAnnotations.length == 0) {
  //                 // await this.automatic_update_form();
  //                 this.selectAnnotationZero();
  //                 if (this.searchOption == true) {
  //                   let multiple_clone = [];
  //                   const myClonedArray_multiple = Object.assign([], multiple_clone);
  //                   this.dataService.getannotationid.emit(myClonedArray_multiple);
  //                 }
  //               }
  //               else if (this.createDocumentStore.selectedAnnotations.length > 0 && filterCanvas.length == 0) {
  //                 await this.multiannotation_automatic_update_form_rightclick(e, true);
  //               }
  //             })
  //           ),
  //           // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
  //           takeUntil(fromEvent(newcreatedElement, "mouseleave").do(() => {
  //             console.log('event', e);
  //             e.preventDefault();
  //             console.log(previousPosition, currentPosition);
  //             // disable drag scroll
  //             this.createDocumentStore.disable_drag_scroll = false;
  //             if (mousedowntrigger == true && mousedrag == true) {
  //               //jose drag select    
  //               mousedrag = false;
  //               mousedowntrigger = false;
  //               console.log('mouse_up');
  //               const rect = newcreatedElement.getBoundingClientRect();
  //               if (previousPosition.x > currentPosition.x) {
  //                 let cloneCurrentX = previousPosition.x;
  //                 previousPosition.x = currentPosition.x;
  //                 currentPosition.x = cloneCurrentX;
  //               }
  //               if (previousPosition.y > currentPosition.y) {
  //                 let cloneCurrentY = previousPosition.y;
  //                 previousPosition.y = currentPosition.y;
  //                 currentPosition.y = cloneCurrentY;
  //               }
  //               let startPositionX = previousPosition.x;
  //               let startPositionY = previousPosition.y;
  //               console.log(startPositionX, startPositionY, e);
  //               let getAllCanvasElements = document.querySelectorAll('svg.documentSVG');
  //               var filterCanvas = [];
  //               // console.log(getAllCanvasElements);
  //               for (let ma = 0; ma < getAllCanvasElements.length; ma++) {
  //                 let getAllElementsXY: any = getAllCanvasElements[ma];
  //                 let getStyle = getComputedStyle(getAllElementsXY);
  //                 let getLeft: any = getStyle.left;
  //                 getLeft = getLeft.substring(getLeft.length - 2, 0);
  //                 let getTop: any = getStyle.top;
  //                 getTop = getTop.substring(getTop.length - 2, 0);
  //                 let getWidth: any = getStyle.width;
  //                 getWidth = getWidth.substring(getWidth.length - 2, 0);
  //                 let getHeight: any = getStyle.height;
  //                 getHeight = getHeight.substring(getHeight.length - 2, 0);
  //                 let checkBoundingBox = false;
  //                 getLeft = Number(getLeft);
  //                 getTop = Number(getTop);
  //                 getWidth = Number(getWidth);
  //                 getHeight = Number(getHeight);
  //                 let EndPointX = currentPosition.x;
  //                 let EndPointY = currentPosition.y;
  //                 let get_full_width = getLeft + getWidth;
  //                 let get_full_height = getTop + getHeight;
  //                 // let annotId = getAllElementsXY.getAttribute('id');
  //                 // let alreadySelected = this.createDocumentStore.selectedAnnotations.some((ids)=>ids===annotId);
  //                 console.log('old Method', getLeft >= startPositionX && EndPointX >= getLeft && getTop >= startPositionY && EndPointY >= getTop)
  //                 console.log('canvas', getLeft, getTop, getWidth, getHeight, get_full_width, get_full_height);
  //                 console.log('box', startPositionX, startPositionY, EndPointX, EndPointY);
  //                 let inside_bound_values = (getLeft >= startPositionX && EndPointX >= getLeft && getTop >= startPositionY && EndPointY >= getTop) || (getLeft >= startPositionX && EndPointX >= getLeft && getTop >= startPositionY && EndPointY >= getTop)
  //                 //if ((getLeft >= startPositionX && EndPointX >= getLeft && getTop >= startPositionY && EndPointY >= getTop)) {
  //                 if ((getLeft > startPositionX && getLeft < EndPointX && getTop > startPositionY && getTop < EndPointY) || (getLeft < startPositionX && get_full_width > EndPointX && getTop < startPositionY && get_full_height > EndPointY) || (get_full_width > startPositionX && get_full_width < EndPointX && getTop > startPositionY && getTop < EndPointY) || (getLeft > startPositionX && getLeft < EndPointX && get_full_height > startPositionY && get_full_height < EndPointY) || (get_full_width > startPositionX && get_full_width < EndPointX && get_full_height > startPositionY && get_full_height < EndPointY) || (getLeft > startPositionX && getLeft < EndPointX && getTop < startPositionY && get_full_height > EndPointY) || (get_full_width > startPositionX && get_full_width < EndPointX && getTop < startPositionY && get_full_height > EndPointY) || (getTop > startPositionY && getTop < EndPointY && getLeft < startPositionX && get_full_width > EndPointX) || (get_full_height > startPositionY && get_full_height < EndPointY && getLeft < startPositionX && get_full_width > EndPointX)) {
  //                   filterCanvas.push(getAllCanvasElements[ma]);
  //                 }
  //               }

  //               if (this.createDocumentStore.selectedAnnotations.length == 0 && filterCanvas.length > 0) {
  //                 for (let fc = 0; fc < filterCanvas.length; fc++) {
  //                   let annotId = filterCanvas[fc].getAttribute('id');
  //                   let lock_layer_check = this.lock_condition_multiple(annotId);
  //                   if (lock_layer_check == true) {
  //                     filterCanvas[fc].setAttribute('multimoving', '1');
  //                     this.createDocumentStore.selectedAnnotations.push(annotId);
  //                     this.colorBorderSVG(filterCanvas[fc]);
  //                     this.getMultipleMovingLabelElement(annotId);
  //                   }
  //                   // this.globalMediaCount(singleDataReceived.annotation_media, 'media')
  //                   // this.globalMediaCount(singleDataReceived.annotation_links, 'links')
  //                 }
  //               }
  //               else if (this.createDocumentStore.selectedAnnotations.length != 0 && filterCanvas.length > 0) {
  //                 for (let f = 0; f < filterCanvas.length; f++) {
  //                   let annotId = filterCanvas[f].getAttribute('id');
  //                   let lock_layer_check = this.lock_condition_multiple(annotId);
  //                   if (lock_layer_check == true) {
  //                     let alreadySelected = this.createDocumentStore.selectedAnnotations.some((ids) => ids === annotId);
  //                     if (alreadySelected == false) {
  //                       this.createDocumentStore.selectedAnnotations.push(annotId);
  //                       filterCanvas[f].setAttribute('multimoving', '1');
  //                       this.colorBorderSVG(filterCanvas[f]);
  //                       this.getMultipleMovingLabelElement(annotId);
  //                     }
  //                   }
  //                 }
  //               }
  //               console.log(this.createDocumentStore.selectedAnnotations);
  //               let tempArray = this.createDocumentStore.selectedAnnotations;
  //               this.createDocumentStore.selectedAnnotations = tempArray.filter(function (elem, index, self) {
  //                 return index === self.indexOf(elem);
  //               })
  //               this.createDocumentStore.multipleDragSelectCanvas.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
  //               // get Multiple Annotations data from API
  //             }
  //             else if (mousedrag == false) {
  //               const rect = newcreatedElement.getBoundingClientRect();
  //               let clickPosition = {
  //                 x: initialX,
  //                 y: initialY,
  //               };
  //               let clickPositionX = clickPosition.x;
  //               clickPositionX = clickPositionX + 10;
  //               let clickPositionY = clickPosition.y;
  //               clickPositionY = clickPositionY + 10;
  //               console.log(clickPositionX, clickPositionY, e);
  //               let getAllCanvasElements = document.querySelectorAll('svg.documentSVG');
  //               var filterCanvas = [];
  //               // console.log(getAllCanvasElements);
  //               for (let ma = 0; ma < getAllCanvasElements.length; ma++) {
  //                 let getAllElementsXY: any = getAllCanvasElements[ma];
  //                 let getStyle = getComputedStyle(getAllElementsXY);
  //                 let getLeft: any = getStyle.left;
  //                 getLeft = getLeft.substring(getLeft.length - 2, 0);
  //                 let getTop: any = getStyle.top;
  //                 getTop = getTop.substring(getTop.length - 2, 0);
  //                 let getWidth: any = getStyle.width;
  //                 getWidth = getWidth.substring(getWidth.length - 2, 0);
  //                 let getHeight: any = getStyle.height;
  //                 getHeight = getHeight.substring(getHeight.length - 2, 0);
  //                 let checkBoundingBox = false;
  //                 getLeft = Number(getLeft);
  //                 getTop = Number(getTop);
  //                 getWidth = Number(getWidth);
  //                 getHeight = Number(getHeight);
  //                 let EndPointX = getLeft + getWidth;
  //                 let EndPointY = getTop + getHeight;
  //                 console.log(getLeft <= clickPositionX && EndPointX >= clickPositionX && getTop <= clickPositionY && EndPointY >= clickPositionY)
  //                 if (getLeft <= clickPositionX && EndPointX >= clickPositionX && getTop <= clickPositionY && EndPointY >= clickPositionY) {
  //                   filterCanvas.push(getAllCanvasElements[ma]);
  //                 }
  //               }

  //               if (this.createDocumentStore.selectedAnnotations.length == 0 || filterCanvas.length > 0) {
  //                 let annotId = filterCanvas[0].getAttribute('id');
  //                 let itemIndex = this.createDocumentStore.selectedAnnotations.findIndex(item => item == annotId);
  //                 if (itemIndex != -1) {
  //                   if (e.which == 3) {
  //                     e.preventDefault();
  //                     e.stopPropagation();
  //                     this.getId = this.createDocumentStore.selectedAnnotations[this.createDocumentStore.selectedAnnotations.length - 1];
  //                     this.canvasRightClick(e, this.getId);
  //                   }
  //                   else {
  //                     var canExecute = true;
  //                     let cloneFilterCVanvas = _.cloneDeep(filterCanvas)
  //                     for (let f = 0; f < filterCanvas.length; f++) {
  //                       if (canExecute == true) {
  //                         for (let g = 0; g < this.createDocumentStore.selectedAnnotations.length; g++) {
  //                           cloneFilterCVanvas = cloneFilterCVanvas.filter((canvas) => canvas.getAttribute('id') != this.createDocumentStore.selectedAnnotations[g])
  //                         }
  //                         if (cloneFilterCVanvas.length > 0) {
  //                           let annotId = cloneFilterCVanvas[0].getAttribute('id');
  //                           let lock_layer_check = this.lock_condition_multiple(annotId);
  //                           if (lock_layer_check == true) {
  //                             this.createDocumentStore.selectedAnnotations.push(annotId);
  //                             cloneFilterCVanvas[f].setAttribute('multimoving', '1');
  //                             this.colorBorderSVG(cloneFilterCVanvas[f]);
  //                             canExecute = false;
  //                             this.getMultipleMovingLabelElement(annotId);
  //                           }
  //                         } else {
  //                           var iVal = 0;
  //                           do {
  //                             if (this.createDocumentStore.selectedAnnotations.length > iVal) {
  //                               let canvasfiltered = filterCanvas.filter((element) => element.getAttribute('id') === this.createDocumentStore.selectedAnnotations[iVal]);
  //                               if (canvasfiltered.length > 0) {
  //                                 this.getMultipleMovingLabelElementRemove(this.createDocumentStore.selectedAnnotations[iVal]);
  //                                 this.createDocumentStore.selectedAnnotations.splice(iVal, 1);


  //                                 canvasfiltered[0].removeAttribute('multimoving');
  //                                 this.transparentBorderSVG(canvasfiltered[0]);
  //                                 //this.createDocumentStore.selectedAnnotations
  //                                 canExecute = false
  //                               }
  //                               else {
  //                                 iVal += 1
  //                               }
  //                             } else {
  //                               canExecute = false
  //                             }
  //                           } while (canExecute)
  //                         }
  //                       }
  //                     }
  //                   }
  //                 } else {
  //                   let lock_layer_check = this.lock_condition_multiple(annotId);
  //                   if (lock_layer_check == true) {
  //                     this.createDocumentStore.selectedAnnotations.push(annotId);
  //                     filterCanvas[0].setAttribute('multimoving', '1');
  //                     this.colorBorderSVG(filterCanvas[0]);
  //                     this.getMultipleMovingLabelElement(annotId);
  //                     if (e.which == 3) {
  //                       e.preventDefault();
  //                       e.stopPropagation();
  //                       this.getId = this.createDocumentStore.selectedAnnotations[this.createDocumentStore.selectedAnnotations.length - 1];
  //                       this.canvasRightClick(e, this.getId);
  //                     }
  //                   }
  //                 }
  //               }
  //               else if (this.createDocumentStore.selectedAnnotations.length != 0 && filterCanvas.length > 0) {
  //                 if (e.which == 3) {
  //                   e.preventDefault();
  //                   e.stopPropagation();
  //                   this.getId = this.createDocumentStore.selectedAnnotations[this.createDocumentStore.selectedAnnotations.length - 1];
  //                   this.canvasRightClick(e, this.getId);
  //                 }
  //                 else {
  //                   var canExecute = true;
  //                   let cloneFilterCVanvas = _.cloneDeep(filterCanvas)
  //                   for (let f = 0; f < filterCanvas.length; f++) {
  //                     if (canExecute == true) {
  //                       for (let g = 0; g < this.createDocumentStore.selectedAnnotations.length; g++) {
  //                         cloneFilterCVanvas = cloneFilterCVanvas.filter((canvas) => canvas.getAttribute('id') != this.createDocumentStore.selectedAnnotations[g])
  //                       }
  //                       if (cloneFilterCVanvas.length > 0) {
  //                         let annotId = cloneFilterCVanvas[0].getAttribute('id');
  //                         this.createDocumentStore.selectedAnnotations.push(annotId);


  //                         cloneFilterCVanvas[f].setAttribute('multimoving', '1');
  //                         this.colorBorderSVG(cloneFilterCVanvas[f]);
  //                         canExecute = false;
  //                         this.getMultipleMovingLabelElement(annotId);
  //                       } else {
  //                         var iVal = 0;
  //                         do {
  //                           if (this.createDocumentStore.selectedAnnotations.length > iVal) {
  //                             let canvasfiltered = filterCanvas.filter((element) => element.getAttribute('id') === this.createDocumentStore.selectedAnnotations[iVal]);
  //                             if (canvasfiltered.length > 0) {
  //                               this.getMultipleMovingLabelElementRemove(this.createDocumentStore.selectedAnnotations[iVal]);
  //                               this.createDocumentStore.selectedAnnotations.splice(iVal, 1);

  //                               canvasfiltered[0].removeAttribute('multimoving');
  //                               this.transparentBorderSVG(canvasfiltered[0]);
  //                               //this.createDocumentStore.selectedAnnotations
  //                               canExecute = false
  //                             }
  //                             else {
  //                               iVal += 1
  //                             }
  //                           } else {
  //                             canExecute = false
  //                           }
  //                         } while (canExecute)
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             if (this.createDocumentStore.selectedAnnotations.length > 0) {
  //               //  this.automatic_update_form();
  //               this.documentService.getMultipleAnnotationData(this.createDocumentStore.selectedAnnotations).subscribe((response) => {
  //                 console.log(response);
  //                 if (response["response_code"] == 200) {
  //                   this.multiselectionList = response["response_body"]["annotation_data"];
  //                   this.selectedAnnotationLength = this.multiselectionList.length;
  //                   this.optionClick = false;
  //                   this.hideSelectForm = true;
  //                   this.sampleFormObject = [];
  //                   this.modelFieldsForm = [];
  //                   this.extend_modelFieldsForm = [];
  //                   this.annotationSelected = true;
  //                   for (let ma = 0; ma < this.multiselectionList.length; ma++) {
  //                     let findLayerIndex = this.layerDatas.findIndex((LData) => LData.layer_id == this.multiselectionList[ma].layer_id);
  //                     if (findLayerIndex != -1) {
  //                       let findAnnotationIndexS = this.layerDatas[findLayerIndex].annotations.findIndex((ADAta) => ADAta.annotation_id == this.multiselectionList[ma].annotation_id);
  //                       if (findAnnotationIndexS != -1) {
  //                         this.layerDatas[findLayerIndex].annotations[findAnnotationIndexS] = this.multiselectionList[ma];
  //                       }
  //                     }
  //                   }
  //                   this.getCounts();
  //                   if (this.form == true) {
  //                     this.formiconClick();
  //                   }
  //                   else if (this.media == true) {
  //                     this.mediaIconClick();
  //                   }
  //                   else if (this.links == true) {
  //                     this.linkIconClick();
  //                   }
  //                   else if (this.tags == true) {
  //                     this.tagIconClick();
  //                   }
  //                   else if (this.properties == true) {
  //                     this.propertyIconClick();
  //                   }

  //                   for (let r = 0; r < this.multiselectionList.length; r++) {
  //                     console.log(this.multiselectionList[r]);
  //                     //Abarajithan The below 2 lines are commented because when multiselect the media count is getting doubled 
  //                     //  this.globalMediaCount(this.multiselectionList[r].annotation_media, 'media')
  //                     //  this.globalMediaCount(this.multiselectionList[r].annotation_links, 'links')
  //                   }
  //                 }
  //               })
  //             }
  //             else {
  //               this.selectAnnotationZero();
  //               if (this.searchOption == true) {
  //                 let multiple_clone = [];
  //                 const myClonedArray_multiple = Object.assign([], multiple_clone);
  //                 this.dataService.getannotationid.emit(myClonedArray_multiple);
  //               }
  //             }
  //           })),
  //           // pairwise lets us get the previous value to draw a line from
  //           // the previous point to the current point
  //           pairwise()
  //         );
  //       })
  //     )
  //     .subscribe((res: [MouseEvent, MouseEvent]) => {
  //       const rect = newcreatedElement.getBoundingClientRect();
  //       console.log(rect);
  //       const prevPos = {
  //         x: initialX,
  //         y: initialY,
  //       };

  //       const currentPos = {
  //         x: res[1].offsetX,
  //         y: res[1].offsetY,
  //       };
  //       // this method we'll implement soon to do the actual drawing
  //       this.createDocumentStore.multipleDragSelectCanvas.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height); //clear canvas
  //       this.createDocumentStore.multipleDragSelectCanvas.beginPath();
  //       let currentValue = this.drawOnCanvasMultiRectangle(prevPos, currentPos);
  //       previousPosition = currentValue.prevPosition;
  //       console.log(previousPosition);
  //       currentPosition = currentValue.currPosition;
  //     });
  // }


  // drawOnCanvasMultiRectangle(
  //   prevPos: { x: number; y: number },
  //   currentPos: { x: number; y: number },
  // ) {
  //   console.log('moving', prevPos, currentPos);
  //   prevPos.x = prevPos.x;
  //   prevPos.y = prevPos.y;
  //   currentPos.x = currentPos.x;
  //   currentPos.y = currentPos.y;
  //   let newPointX = currentPos.x - prevPos.x;
  //   let newPointY = currentPos.y - prevPos.y;
  //   this.createDocumentStore.multipleDragSelectCanvas.rect(prevPos.x, prevPos.y, newPointX, newPointY);
  //   this.createDocumentStore.multipleDragSelectCanvas.lineWidth = 3;
  //   this.createDocumentStore.multipleDragSelectCanvas.strokeStyle = "red";
  //   this.createDocumentStore.multipleDragSelectCanvas.stroke();
  //   return { prevPosition: prevPos, currPosition: currentPos };
  // }

  // addZoom(newcreatedElement) {
  //   if (this.pngFormat == false && this.pdfScaleValue > 1 && newcreatedElement != null) {
  //     // let get_pdfannotationhead = document.getElementById('pdfannotationhead');
  //     let detailed_scale = this.pdfScaleValue;//e.source.viewport.scale
  //     let increase_width = this.realWidth * this.pdfScaleValue//+(get_width.substring(get_width.length - 2, 0));
  //     let increase_height = this.realHeight * this.pdfScaleValue
  //     let width_difference = (increase_width - this.realWidth) / 2;
  //     let height_difference = (increase_height - this.realHeight) / 2;

  //     if (this.realHeight < this.realWidth && this.pdfScaleValue < 1) {
  //       width_difference = 0
  //     } else if (this.realHeight > this.realWidth && this.pdfScaleValue < 1) {
  //       height_difference = 0
  //     }
  //     // if(height_difference >= 0 && width_difference >= 0){
  //     newcreatedElement.style.top = height_difference + 'px'
  //     newcreatedElement.style.left = width_difference + 'px'
  //     newcreatedElement.style.transform = "matrix(" + detailed_scale + ", 0, 0, " + detailed_scale + ", 0, 0)"
  //   }
  // }
}
