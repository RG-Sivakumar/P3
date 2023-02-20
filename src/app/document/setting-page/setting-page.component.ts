import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
} from "@angular/core";
import Swiper from "swiper";
import { fromEvent } from "rxjs";
import { switchMap, takeUntil, pairwise } from "rxjs/operators";

@Component({
  selector: "app-setting-page",
  templateUrl: "./setting-page.component.html",
  styleUrls: ["./setting-page.component.css"],
})
export class SettingPageComponent implements OnInit, AfterViewInit {
  coordinateX: number = 0;
  coordinateY: number = 0;
  getYear: string = "";

  // @ViewChild('myCanvasline')myCanvasLine: ElementRef<HTMLCanvasElement>;
  // @ViewChild('myCanvasrec')myCanvasRec: ElementRef<HTMLCanvasElement>;
  // @ViewChild('myCanvascircle')myCanvasCircle: ElementRef<HTMLCanvasElement>;
  // @ViewChild('myCanvastext')myCanvastext: ElementRef<HTMLCanvasElement>;

  // public contextLine: CanvasRenderingContext2D;
  // public contextRec: CanvasRenderingContext2D;
  // public contextCircle: CanvasRenderingContext2D;
  // public text: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() { }
  @Input() public width = 500;
  @Input() public height = 450;

  getPosition(e) {
    this.coordinateX = e.offsetX;
    this.coordinateY = e.offsetY;
    // this.shapeDrawing();
  }
  // ngOnInit(): void {
  //     var mySwiper = new Swiper ('.swiper-container', {
  //       direction: 'horizontal',
  //       slidesPerView: 1,
  //       spaceBetween: 30,
  //       mousewheel: true,
  //       pagination: {
  //       el: '.swiper-pagination',
  //       clickable: true,
  //   },
  //       loop: true
  //     });
  // }
  public canvasElement: CanvasRenderingContext2D;
  ngAfterViewInit(): void {
    // set some default properties about the line
    var pdfImg = document.getElementById("pdfImg");
    var newcreatedElement = document.createElement("canvas");
    pdfImg.appendChild(newcreatedElement);
    const canvasEl: HTMLCanvasElement = newcreatedElement;
    this.canvasElement = canvasEl.getContext("2d");

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.canvasElement.lineWidth = 3;
    this.canvasElement.lineCap = "round";
    this.canvasElement.strokeStyle = "#000";

    this.captureEvents(canvasEl);
    this.drawFreeHand();
  }
  freeHandLineString =
    "move-145.0:437.5 line-145.0:437.5 line-145.0:433.0 line-145.0:431.0 line-145.0:428.5 line-145.0:411.0 line-147.0:406.5 line-149.0:397.5 line-156.0:366.5 move-156.0:366.5 line-156.0:366.5 line-222.5:317.5 line-225.0:317.5 line-229.5:315.5 line-234.0:313.0 line-238.5:311.0 line-243.0:311.0 line-245.0:306.5 line-247.0:306.5 line-249.5:304.0 line-251.5:304.0 line-254.0:304.0 line-283.0:288.5";

  //Draw a string Free hand line Start
  private drawFreeHand() {
    this.canvasElement.beginPath();
    var spaceSplit = this.freeHandLineString.split(" ");

    for (var i = 0; i < spaceSplit.length; i++) {
      var hypenSplit = spaceSplit[i].split("-");

      for (var j = 0; j < hypenSplit.length; j++) {
        if (j == 1) {
          var colonSplit = hypenSplit[j].split(":");

          var fx = parseFloat(colonSplit[0]);

          var fy = parseFloat(colonSplit[1]);
        }
        switch (hypenSplit[0]) {
          case "move":
            this.canvasElement.moveTo(fx, fy); // from
            break;
          case "line":
            this.canvasElement.lineTo(fx, fy);
            break;
        }
        this.canvasElement.strokeStyle = "red";
        this.canvasElement.stroke();
      }
    }
  }
  //Draw a string Free hand line End

  stringPath = "";
  a = 0;

  private captureEvents(canvasEl: HTMLCanvasElement) {
    ;
    // this will capture all mousedown events from the canvas element

    fromEvent(canvasEl, "mousedown")
      .pipe(
        switchMap((e) => {
          this.stringPath = "";
          this.a = 0;
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, "mousemove").pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'mouseup' event
            takeUntil(fromEvent(canvasEl, "mouseup")),
            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
            takeUntil(fromEvent(canvasEl, "mouseleave")),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point
            pairwise()
          );
        })
      )

      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top,
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top,
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number }
  ) {
    if (!this.canvasElement) {
      return;
    }

    this.canvasElement.beginPath();

    if (prevPos) {
      if (this.a == 0) {
        this.stringPath =
          this.stringPath + "move" + "-" + prevPos.x + ":" + prevPos.y + " ";
        this.a++;
      }
      if (this.a != 0) {
        this.stringPath =
          this.stringPath + "line" + "-" + prevPos.x + ":" + prevPos.y + " ";
      }
      this.canvasElement.moveTo(prevPos.x, prevPos.y); // from
      this.stringPath =
        this.stringPath +
        "line" +
        "-" +
        currentPos.x +
        ":" +
        currentPos.y +
        " ";
      this.canvasElement.lineTo(currentPos.x, currentPos.y);
      this.canvasElement.strokeStyle = "red";
      this.canvasElement.stroke();
    }
  }

  receiveString: string =
    "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15";
  receiveString1: string =
    "move-15:40 line-15:15 line-30:15 line-25:20 line-30:25 line-15:25";
  receiveString2: string =
    "ovalIn-21.5:18:7:7 move-10:15 line-17:15 line-17:10 line-33:10 line-33:15 line-40:15 line-40:31 line-10:31 line-10:15 line-17:15 move-34:19 line-35:19";
  curve: string =
    "move-10:25 line-22:25 line-22:19 controlpoint-22:16 curveEnd-25:16 line-37:16 controlpoint-40:16 curveEnd-40:19 line-40:31 controlpoint-40:34 curveEnd-37:34 line-25:34 controlpoint-22:34 curveEnd-22:31 line-22:25";

  // shapeDrawing(){
  //   var spaceSplit = this.receiveString.split(" ");
  //
  //   for(var i =0;i<spaceSplit.length;i++){
  //     var hypenSplit = spaceSplit[i].split("-")
  //     for(var j=0;i<hypenSplit.length;j++){
  //       if(j==1){
  //         var colonSplit = hypenSplit[i].split(":");
  //         var x = parseInt(colonSplit[0]);
  //         var y = parseInt(colonSplit[1]);
  //       }
  //     }
  //     switch(hypenSplit[i]){
  //       case "move" :
  //         this.contextLine.moveTo(x,y)
  //         break;
  //       case 'line' :
  //         this.contextLine.lineTo(x,y);
  //     }
  //   }
  //
  //   ;
  //
  //
  //
  // }
  // public canvasElement : CanvasRenderingContext2D;
  shapeDrawing() {
    var pdfImg = document.getElementById("pdfImg");
    var newcreatedElement = document.createElement("canvas");
    newcreatedElement.style.backgroundColor = "red";
    newcreatedElement.setAttribute("width", "50");
    newcreatedElement.setAttribute("height", "50");
    newcreatedElement.style.position = "absolute";
    newcreatedElement.style.top = this.coordinateY + "px";
    newcreatedElement.style.left = this.coordinateX + "px";
    newcreatedElement.style.marginLeft = "-25px";
    newcreatedElement.style.marginTop = "-25px";
    pdfImg.appendChild(newcreatedElement);
    this.canvasElement = newcreatedElement.getContext("2d");
    this.canvasElement.beginPath();
    var spaceSplit = this.curve.split(" ");

    for (var i = 0; i < spaceSplit.length; i++) {
      ;
      var hypenSplit = spaceSplit[i].split("-");

      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].split(":");
        if (hypenSplit[0] == "controlpoint") {
          var cpx = parseFloat(colonSplit[0]);
          var cpy = parseFloat(colonSplit[1]);
        }
        if (hypenSplit[0] == "curveEnd") {
          var ex = parseFloat(colonSplit[0]);
          var ey = parseFloat(colonSplit[1]);
        }
        if (
          j == 1 &&
          hypenSplit[0] != "curveEnd" &&
          hypenSplit[0] != "controlpoint"
        ) {
          var x = parseFloat(colonSplit[0]);

          var y = parseFloat(colonSplit[1]);

          var h = parseFloat(colonSplit[2]);

          var w = parseFloat(colonSplit[3]);
        }
        switch (hypenSplit[0]) {
          case "move":
            this.canvasElement.moveTo(x, y);
            break;
          case "line":
            this.canvasElement.lineTo(x, y);
            break;
          case "ovalIn":
            this.canvasElement.ellipse(
              x,
              y,
              h,
              w,
              (90 * Math.PI) / 180,
              0,
              2 * Math.PI
            );
            break;
          case "curveEnd":
            this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
            break;
        }
        this.canvasElement.stroke();
      }
    }
  }
}
