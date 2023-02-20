
import { fromEvent, Subscription, combineLatest } from "rxjs";
import { switchMap, takeUntil, pairwise, tap } from "rxjs/operators";


export function captureEventsMultiple() {
    
    var pdfImg = document.getElementById("pdfImg");
    let newcreatedElement = document.createElement("canvas");
    newcreatedElement.setAttribute("width", this.realWidth);
    newcreatedElement.setAttribute("height", this.realHeight);
    newcreatedElement.setAttribute("customeMultipleAttribute", "1");
    newcreatedElement.style.position = "absolute";
    newcreatedElement.style.top = "0px";
    newcreatedElement.style.left = "0px";
    newcreatedElement.style.zIndex = "999";
    pdfImg.appendChild(newcreatedElement);
    // var canvasEl: HTMLCanvasElement = this.createElementChanged;
    this.canvasElement = newcreatedElement.getContext("2d");
    let initialX: number, initialY: number, currentX = 0, currentY = 0;
    fromEvent(newcreatedElement, "mousedown")
        .pipe(
            switchMap((e: MouseEvent) => {
                console.log(e);
                let mousedowntrigger = true;
                let mousedrag = false;
                this.annotationselectEnableDisable('enable');
                initialX = e.clientX - currentX;
                initialY = e.clientY - currentY;
                // after a mouse down, we'll record all mouse moves
                return fromEvent(newcreatedElement, "mousemove").do(() => {
                    mousedrag = true;
                }).pipe(
                    // we'll stop (and unsubscribe) once the user releases the mouse
                    // this will trigger a 'mouseup' event
                    takeUntil(
                        fromEvent(newcreatedElement, "mouseup").do(() => {
                            console.log('mousedrag', mousedrag);
                            if (mousedowntrigger == true && mousedrag == true) {
                                mousedowntrigger = false;
                                console.log('mouse_up');
                                this.annotationselectEnableDisable('remove');
                            }
                            else if (mousedrag == false) {
                                const rect = newcreatedElement.getBoundingClientRect();
                                
                                let clickPosition = {
                                    x: initialX - rect.left,
                                    y: initialY - rect.top,
                                };
                                let clickPositionX = clickPosition.x / this.scale;
                                clickPositionX = clickPositionX + 10;
                                let clickPositionY = clickPosition.y / this.scale;
                                clickPositionY = clickPositionY + 10;
                                console.log(clickPositionX, clickPositionY, e);
                                let getAllCanvasElements = document.querySelectorAll('canvas[documentcanvas]');
                                var filterCanvas = [];
                                // console.log(getAllCanvasElements);
                                for (let ma = 0; ma < getAllCanvasElements.length; ma++) {
                                    let getAllElementsXY: any = getAllCanvasElements[ma];
                                    let getStyle = getComputedStyle(getAllElementsXY);
                                    let getLeft: any = getStyle.left;
                                    getLeft = getLeft.substring(getLeft.length - 2, 0);
                                    let getTop: any = getStyle.top;
                                    getTop = getTop.substring(getTop.length - 2, 0);
                                    let getWidth: any = getStyle.width;
                                    getWidth = getWidth.substring(getWidth.length - 2, 0);
                                    let getHeight: any = getStyle.height;
                                    getHeight = getHeight.substring(getHeight.length - 2, 0);
                                    let checkBoundingBox = false;
                                    getLeft = Number(getLeft);
                                    getTop = Number(getTop);
                                    getWidth = Number(getWidth);
                                    getHeight = Number(getHeight);
                                    let EndPointX = getLeft + getWidth;
                                    let EndPointY = getTop + getHeight;
                                    // let annotId = getAllElementsXY.getAttribute('id');
                                    // let alreadySelected = this.createDocumentStore.selectedAnnotations.some((ids)=>ids===annotId);
                                    console.log(getLeft <= clickPositionX && EndPointX >= clickPositionX && getTop <= clickPositionY && EndPointY >= clickPositionY)
                                    if (getLeft <= clickPositionX && EndPointX >= clickPositionX && getTop <= clickPositionY && EndPointY >= clickPositionY) {
                                        // console.log('X:'+getLeft+'Y:'+getTop + '----' + 'width:' + getWidth + 'height:' + getHeight);
                                        // let markback:any = getAllCanvasElements[ma];
                                        // this.colorBorder(markback);
                                        // // markback.style.backgroundColor = "red";
                                        // this.createDocumentStore.selectedAnnotations.push(annotId);
                                        filterCanvas.push(getAllCanvasElements[ma]);
                                    }
                                    // else if(getLeft<=clickPositionX && EndPointX>=clickPositionX && getTop<=clickPositionY && EndPointY>=clickPositionY && alreadySelected==true){
                                    //   let removeIndex = this.createDocumentStore.selectedAnnotations.findIndex((ids)=>ids===annotId);
                                    //   this.createDocumentStore.selectedAnnotations.splice(removeIndex,1);
                                    //   let markback:any = getAllCanvasElements[ma];
                                    //   this.transparentBorder(markback);
                                    //   break;
                                    // }
                                }
                                if (this.createDocumentStore.selectedAnnotations.length == 0 && filterCanvas.length > 0) {
                                    let annotId = filterCanvas[0].getAttribute('id');
                                    this.createDocumentStore.selectedAnnotations.push(annotId);
                                    this.colorBorder(filterCanvas[0]);
                                }
                                else if (this.createDocumentStore.selectedAnnotations.length != 0 && filterCanvas.length > 0) {
                                    for (let f = 0; f < filterCanvas.length; f++) {
                                        let annotId = filterCanvas[f].getAttribute('id');
                                        let alreadySelected = this.createDocumentStore.selectedAnnotations.some((ids) => ids === annotId);
                                        if (alreadySelected == true) {
                                            this.createDocumentStore.selectedAnnotations.splice(f, 1);
                                            this.transparentBorder(filterCanvas[f]);
                                            break;
                                        }
                                        else {
                                            this.createDocumentStore.selectedAnnotations.push(annotId);
                                            this.colorBorder(filterCanvas[f]);
                                            break;
                                        }
                                    }
                                }
                            }
                        })
                    ),
                    // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
                    takeUntil(fromEvent(newcreatedElement, "mouseleave").do(() => {
                        if (this.stringPath != "") {

                        }
                    })),
                    // pairwise lets us get the previous value to draw a line from
                    // the previous point to the current point
                    pairwise()
                );
            })
        )
        .subscribe((res: [MouseEvent, MouseEvent]) => {
            const rect = newcreatedElement.getBoundingClientRect();
            const prevPos = {
                x: initialX - rect.left,
                y: initialY - rect.top,
            };

            const currentPos = {
                x: res[1].clientX - rect.left,
                y: res[1].clientY - rect.top,
            };
            // this method we'll implement soon to do the actual drawing
            let currentValue = this.drawOnCanvasMove(prevPos, currentPos);
            currentX = currentValue.x;
            currentY = currentValue.y;
        });
}

export function drawOnCanvasMove(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number },
) {
    prevPos.x = prevPos.x / this.scale;
    prevPos.y = prevPos.y / this.scale;
    currentPos.x = currentPos.x / this.scale;
    currentPos.y = currentPos.y / this.scale;
    let newPointX = currentPos.x - prevPos.x;
    let newPointY = currentPos.y - prevPos.y;
    this.canvasElement.rect(prevPos.x, prevPos.y, newPointX, newPointY);
    this.canvasElement.lineWidth = 5;
    this.canvasElement.strokeStyle = "red";
    this.canvasElement.stroke();
}