import { Injectable } from '@angular/core';
import { Shape } from '../setting-page/shape';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  public canvasElement: CanvasRenderingContext2D;
  coordinateX: number = 0;
  coordinateY: number = 0;
  currentWidth: number = 0;
  currentHeight: number = 0;
  toolbarElementId: any = 0;
  resizeChecking: boolean = false;

  constructor() { }

  private shapes: Shape[] = [
    { type: 'ellipse', x: 10, y: 10, w: 12, h: 34 },
    { type: 'line', x: 60, y: 20, w: 12, h: 34 },
    { type: 'rectangle', x: 30, y: 30, w: 12, h: 34 }
  ];
  getShapes() { return this.shapes; }

  formsheaderCanvas1(id, getData, labelid, attributeId) {
    var elementId = getData.toolbar_element_id;
    var pdfImg = document.getElementById(id);
    let getWidth = 0;
    let getHeight = 0;
    if (getData.initial_width <= 0 && getData.initial_height <= 0 && elementId >= 12 && elementId <= 18) {
      let convertAnnotationWH = getData.annotation_data;
      let xCoordinate = [];
      let yCoordinate = [];
      let startx;
      let starty;
      let endx;
      let endy;
      convertAnnotationWH = convertAnnotationWH.trim();
      let splitData = convertAnnotationWH.split(" ");
      for (var i = 0; i < splitData.length; i++) {
        let hypenSplit = splitData[i].split("-");
        let colonSplit = hypenSplit[1].split(":");
        xCoordinate.push(colonSplit[0]);
        yCoordinate.push(colonSplit[1]);
      }
      startx = Math.min.apply(null, xCoordinate);
      endx = Math.max.apply(null, xCoordinate);
      starty = Math.min.apply(null, yCoordinate);
      endy = Math.max.apply(null, yCoordinate);

      let getDrawWidthandHeight = this.calculateRectPos(
        startx,
        starty,
        endx,
        endy
      );
      this.coordinateX = getDrawWidthandHeight.left;
      this.coordinateY = getDrawWidthandHeight.top;
      getWidth = getDrawWidthandHeight.width;
      getHeight = getDrawWidthandHeight.height;
    }
    else if (Number(getData.initial_width) != 0 && Number(getData.initial_height) != 0) {
      getWidth = getData.initial_width + 5;
      getHeight = getData.initial_height + 5;
    }
    else if (elementId <= 11) {
      getWidth = 40;
      getHeight = 35;
    }
    else if (elementId == 19 || elementId == 20) {
      let hypenSplitCD = getData.annotation_data.split("-");
      let colonSplitCD = hypenSplitCD[1].split(":");
      this.coordinateX = colonSplitCD[0];
      this.coordinateY = colonSplitCD[1];
      getWidth = parseFloat(colonSplitCD[2]);
      getHeight = parseFloat(colonSplitCD[3]);
    }
    var annotationLabel = getData.annotation_label;

    // if (pdfImg.hasChildNodes()!=null && pdfImg != null) {
    //   pdfImg.removeChild(pdfImg.childNodes[0]);
    // }
    if (pdfImg != null && pdfImg.firstChild != null) {
      pdfImg.removeChild(pdfImg.firstChild);
    }
    let getannotationLabelElement = document.querySelectorAll("p");
    if (getannotationLabelElement.length > 0) {
      for (var al = 0; al < getannotationLabelElement.length; al++) {
        if (getannotationLabelElement[al].getAttribute(labelid) != null) {
          getannotationLabelElement[al].remove();
        }
      }
    }
    // else if (this.properties == true) {
    //   var pdfImg = document.getElementById("headerCanvasProperties");
    // }
    var newcreatedElement = document.createElement("canvas");
    if (elementId < 12) {
      newcreatedElement.setAttribute("width", "50");
      if (labelid == 'mediaannotationLabel') {
        newcreatedElement.setAttribute("height", "40");
        newcreatedElement.style.height = "100%";
      }
      else {
        newcreatedElement.setAttribute("height", "35");
        newcreatedElement.style.height = "35px";
        newcreatedElement.style.marginTop = "4px";
      }

      newcreatedElement.style.pointerEvents = "none";
    }
    // newcreatedElement.style.opacity = getData.opacity;
    if (getData.initial_rotation == undefined) {
      newcreatedElement.style.transform = "rotate(" + 0 + "deg)";
    } else if (getData.initial_rotation != undefined) {
      newcreatedElement.style.transform =
        "rotate(" + getData.initial_rotation + "deg)";
    }
    if ((getData.toolbar_element_id == 1 || getData.toolbar_element_id == 8) && labelid != 'mediaannotationLabel') {
      newcreatedElement.style.marginTop = "8px";
    }
    pdfImg.appendChild(newcreatedElement);
    // this.canvasElement = newcreatedElement.getContext("2d");
    // 
    // if (elementId < 12) {
    //   newcreatedElement.setAttribute("width", "50");
    //   newcreatedElement.setAttribute("height", "35");
    //   newcreatedElement.style.height = "35px";
    //   newcreatedElement.style.marginTop = "4px";
    // }
    // // newcreatedElement.style.opacity = getData.opacity;
    // if (getData.initial_rotation == undefined) {
    //   newcreatedElement.style.transform = "rotate(" + 0 + "deg)";
    // } else if (getData.initial_rotation != undefined) {
    //   newcreatedElement.style.transform =
    //     "rotate(" + getData.initial_rotation + "deg)";
    // }
    // newcreatedElement.setAttribute(attributeId, "1");
    // // if (getData.toolbar_element_id == 1 || getData.toolbar_element_id == 8) {
    // //   newcreatedElement.style.marginTop = "8px";
    // // }
    // pdfImg.appendChild(newcreatedElement);
    this.canvasElement = newcreatedElement.getContext("2d");
    // latest comment
    if (elementId == 8) {
      this.canvasElement.translate(0, -3);
    }
    else if (elementId < 12) {
      if (labelid != "mediaannotationLabel") {
        this.canvasElement.translate(0, -10);
      }
      else {
        this.canvasElement.translate(0, -4);
      }
    }
    if (elementId >= 12) {
      let scaleValueX = 0.8;
      let scaleValueY = 0.8;
      let newwidth = 50;
      let newheight = 35;
      if (getWidth > 50 || getHeight > 35) {
        var scale_val = Math.min(50 / (getWidth), 35 / (getHeight))
        newwidth = getWidth * scale_val;
        newheight = getHeight * scale_val;
        scaleValueX = scale_val;
        scaleValueY = scale_val;
      }
      this.canvasElement.canvas.width = newwidth > 50 ? 48 : newwidth;
      if (labelid == 'mediaannotationLabel') {
        this.canvasElement.canvas.height = newheight > 50 ? 40 : newheight;
      }
      else {
        this.canvasElement.canvas.height = newheight > 50 ? 35 : newheight;
      }
      this.canvasElement.scale(scaleValueX, scaleValueX);
      this.canvasElement.textAlign = "center";
    }
    if (getData.annotation_label != "") {
      this.annotationLabelBackground(getData, id, labelid);
    }
    if (Number(getData.initial_width) != 0 && Number(getData.initial_height) != 0) {
      getData.initial_width = Number(getData.initial_width) + 5;
      getData.initial_height = Number(getData.initial_height) + 5;
      newcreatedElement.setAttribute("width", getData.initial_width.toString());
      newcreatedElement.setAttribute("height", getData.initial_height.toString());
    }
    var scale_val = Math.min(50 / Number(getData.initial_width), 50 / Number(getData.initial_height))
    scale_val = scale_val != 0 ? scale_val : 0.5;
    if (scale_val < 0.5) {
      scale_val = 0.7;
    }
    newcreatedElement.style.transform = "scale(" + scale_val + ")";
    //   const img = new Image()
    //   img.src = this.imgUrl;
    //   img.onload = () => {
    //   this.canvasElement.drawImage(img, 0, 0,600,450);
    //   }

    this.canvasElement.beginPath();
    this.canvasElement.globalAlpha = getData.opacity;
    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");

    var previous = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var a = 0;
    var last_mousex = this.coordinateX;
    var last_mousey = this.coordinateY;
    var mousex = 0;
    var mousey = 0;
    var cpx = 0;
    var cpy = 0;
    let cp1x = 0;
    let cp1y = 0;
    let cp2x = 0;
    let cp2y = 0;
    let cx = 0;
    let cy = 0;
    for (var i = 0; i < spaceSplit.length; i++) {
      var hypenSplit = spaceSplit[i].split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "curveEnd" &&
          hypenSplit[0] != "controlpoint" &&
          hypenSplit[0] != "drawRect" &&
          hypenSplit[0] != "controlpoint1" &&
          hypenSplit[0] != "controlpoint2" &&
          hypenSplit[0] != "endCurve"
        ) {
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);
          switch (hypenSplit[0]) {
            case "move":
              this.canvasElement.save();
              this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
              this.canvasElement.restore();
              if (elementId != 20) {
                if (
                  getData.toolbar_element_id >= 12 &&
                  getData.toolbar_element_id <= 20
                ) {
                  this.canvasElement.moveTo(
                    x - this.coordinateX,
                    y - this.coordinateY
                  );
                }
                else if (
                  getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                  getData.toolbar_element_id <= 20) {
                  this.canvasElement.moveTo(x, y
                  );
                }
                else {
                  this.canvasElement.moveTo(x, y);
                }
                if (elementId == 13 && j == 1) {
                  previous.x = x - this.coordinateX;
                  previous.y = y - this.coordinateY;
                  a++;
                }
              }
              break;
            case "line":
              this.canvasElement.save();
              this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
              this.canvasElement.restore();
              if (elementId != 20) {
                if (
                  getData.toolbar_element_id >= 12 &&
                  getData.toolbar_element_id <= 20
                ) {
                  this.canvasElement.lineTo(
                    x - this.coordinateX,
                    y - this.coordinateY
                  );
                }
                else if (
                  getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                  getData.toolbar_element_id <= 20) {
                  this.canvasElement.lineTo(x, y
                  );
                }
                else {
                  this.canvasElement.lineTo(x, y);
                }
                // this.canvasElement.lineTo(x-this.coordinateX, y-this.coordinateY);
                if ((elementId == 13 && previous.x != 0 && previous.y != 0) && (spaceSplit.length - 1 == i) && (j == 1)) {
                  current.x = x - this.coordinateX + 3;
                  current.y = y - this.coordinateY + 3;
                  var dx = current.x - previous.x;
                  var dy = current.y - previous.y;
                  var headlen = 15;
                  var angle = Math.atan2(dy, dx);
                  var length = Math.sqrt(dx * dx + dy * dy);

                  this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height); //clear canvas
                  this.canvasElement.moveTo(current.x, current.y);
                  this.canvasElement.lineTo(
                    current.x - headlen * Math.cos(angle - Math.PI / 4),
                    current.y - headlen * Math.sin(angle - Math.PI / 4)
                  );
                  this.canvasElement.moveTo(current.x, current.y);
                  this.canvasElement.lineTo(
                    current.x - headlen * Math.cos(angle + Math.PI / 4),
                    current.y - headlen * Math.sin(angle + Math.PI / 4)
                  );
                  this.canvasElement.lineCap = "round";
                }
                else {
                  previous.x = x - this.coordinateX + 3;
                  previous.y = y - this.coordinateY + 3;
                }
              }
              break;
            case "ovalIn":
              if (elementId == 1 || elementId == 8) {
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.arc(
                  newcreatedElement.clientWidth / 2,
                  newcreatedElement.clientHeight / 1.6,
                  r,
                  0,
                  2 * Math.PI
                );
              } else if (elementId == 19) {
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.ellipse(
                  w / 2,
                  h / 2,
                  w / 2,
                  h / 2,
                  Math.PI * 1,
                  0,
                  2 * Math.PI
                );
              }
              break;
          }
        }
        else if (hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") {
          if (hypenSplit[0] == "controlpoint") {
            cpx = parseFloat(colonSplit[0]);
            cpy = parseFloat(colonSplit[1]);
          }
          if (hypenSplit[0] == "curveEnd") {
            var ex = parseFloat(colonSplit[0]);
            var ey = parseFloat(colonSplit[1]);

            this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
          }
        }
        else if (hypenSplit[0] == "controlpoint1" || hypenSplit[0] == "controlpoint2" || hypenSplit[0] == "endCurve" && j == 1) {

          if (hypenSplit[0] == "controlpoint1") {
            cp1x = parseFloat(colonSplit[0]);
            cp1y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "controlpoint2") {
            cp2x = parseFloat(colonSplit[0]);
            cp2y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "endCurve") {
            cx = parseFloat(colonSplit[0]);
            cy = parseFloat(colonSplit[1]);
            this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
            this.canvasElement.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);

          }
        }
        else if (hypenSplit[0] == "drawRect" && j == 1) {
          // let colonSplit = hypenSplit[j].split(":");
          let rectX = parseFloat(colonSplit[0]);
          let rectY = parseFloat(colonSplit[1]);
          let rectWidth = parseFloat(colonSplit[2]);
          let rectHeight = parseFloat(colonSplit[3]);
          this.canvasElement.clearRect(0, 0, rectWidth, rectHeight);
          this.canvasElement.rect(
            5,
            5,
            rectWidth,
            rectHeight);

        }
        if ((elementId == 12 || elementId == 17 || elementId == 18) && (spaceSplit.length - 1 == i) && (j == 1)) {

          this.canvasElement.closePath();
        }
      }
    }
    if (
      elementId != 12 &&
      elementId != 14 &&
      elementId != 13 &&
      elementId != 15
    ) {
      var checkFill = getData.fill_color;
      this.canvasElement.fillStyle = this.checkStrokeColor1(getData.fill_color);
      this.canvasElement.fill();
    }
    // this.canvasElement.drawImage(newcreatedElement,0,0,50,50,0,0,10,50);
    // this.canvasElement.lineWidth = this.globalLineWidth(getData.line_width);
    if (elementId == 15 || elementId == 16 || elementId == 13 || elementId == 14 && getData.line_width != 0 && getData.line_width / 5 < 3) {
      this.canvasElement.lineWidth = this.globalLineWidth(getData.line_width) + 2;
    }
    else {
      this.canvasElement.lineWidth = this.globalLineWidth(getData.line_width);
    }
    this.canvasElement.strokeStyle = this.checkStrokeColor1(getData.stroke_color);
    this.canvasElement.stroke();
  }

  globalLineWidth(width) {
    let linewidth = Number(width);
    let newLineWidth = 0;
    if (linewidth > 30) {
      newLineWidth = linewidth / 7;
    }
    else {
      newLineWidth = linewidth / 5;
    }

    if (newLineWidth < 1) {
      return 1;
    }
    else {
      return newLineWidth;
    }
  }

  checkStrokeColor1(checkStroke) {
    if (checkStroke.includes("#")) {

      if (checkStroke == "#NNNNNN00") {
        return "transparent";
      } else {
        return checkStroke;
      }
    }
    else {
      checkStroke = checkStroke.toLowerCase();
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
          return "transparent";
        case "":
          return "transparent";
        default:
          return "#002F5F";
      }
    }
  }

  calculateRectPos(startX, startY, endX, endY) {


    var width = endX - startX;
    var height = endY - startY;
    var posX = startX;
    var posY = startY;

    if (width < 0) {
      width = Math.abs(width);
      posX -= width;
    }

    if (height < 0) {
      height = Math.abs(height);
      posY -= height;
    }
    return {
      left: parseFloat(posX),
      top: parseFloat(posY),
      width: width,
      height: height,
    };
  }
  calculateRectPosP2P3(startX, startY, endX, endY) {
    var width = endX - startX;
    var height = endY - startY;
    var posX = startX;
    var posY = startY;

    if (width < 0) {
      width = Math.abs(width);
      posX -= width;
    }

    if (height < 0) {
      height = Math.abs(height);
      posY -= height;
    }
    return {
      left: parseFloat(posX),
      top: parseFloat(posY),
      width: width,
      height: height,
    };
  }

  annotationLabelBackground(getData, id, labelid, fontsize?: string) {

    let pdfImg = document.getElementById(id);
    let labelElement = document.createElement("p");
    pdfImg.appendChild(labelElement);
    labelElement.setAttribute(labelid, "1");
    labelElement.style.color = this.checkStrokeColor1(getData.stroke_color);
    labelElement.style.fontSize = '12px';
    labelElement.style.fontWeight = "500";
    labelElement.style.position = "absolute";
    labelElement.style.top = "50%";
    labelElement.style.marginBottom = "0px";
    labelElement.innerHTML = getData.annotation_label;
    labelElement.style.lineHeight = "1";
    labelElement.style.textAlign = "center";
    labelElement.style.pointerEvents = "none";
    labelElement.style.maxHeight = "24px";
    labelElement.style.zIndex = "9";
    labelElement.style.marginTop = -(labelElement.clientHeight / 2) + 'px';
    labelElement.style.overflow = "hidden";
    var numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;

    if (numberOfLineBreaks != 0) {
      labelElement.style.whiteSpace = "pre-wrap";
    }
    labelElement.style.wordBreak = "break-word";

    if (labelElement.clientHeight >= 48) {
      labelElement.style.marginTop = "0px";
      labelElement.style.top = "0px";
      if (labelid == 'copyannotationLabel') {
        // labelElement.style.height = "26px";
        labelElement.style.height = "27px";
      }
    }
    if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && getData.element_id < 10) {
      let dx = getData.initial_rotation > 0 ? (labelElement.clientWidth / 2) : (-15);
      let dy = getData.initial_rotation > 0 ? (-15) : labelElement.clientHeight / 2;
      labelElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';

    }
  }



  getSetScaleWidthandHeight(getData) {
    if (getData != undefined) {
      var newShapeString = "";
      let elementId = getData.toolbar_element_id;
      getData.annotation_data = getData.annotation_data.trim();
      var spaceSplit = getData.annotation_data.split(" ");

      var length = 0
      var height = 0
      var prev_axis = { height: 0, width: 0 }


      for (var i = 0; i < spaceSplit.length; i++) {
        let splitString = spaceSplit[i].replace('--', '-n');
        splitString = splitString.replace(':-', ':n');
        var hypenSplit = splitString.split("-");
        for (var j = 0; j < hypenSplit.length; j++) {
          var colonSplit = hypenSplit[j].replace('n', '-').split(":");
          if (
            j == 1 &&
            hypenSplit[0] != "drawRect" &&
            elementId != 19 && elementId != 20

          ) {
            var x = parseFloat(colonSplit[0]);
            var y = parseFloat(colonSplit[1]);
            var w = parseFloat(colonSplit[2]);
            var h = parseFloat(colonSplit[3]);

            switch (hypenSplit[0]) {
              case "move":
                //newShapeString = newShapeString != '' ? (newShapeString + ' move-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('move-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
                prev_axis.height = y
                prev_axis.width = x
                break;
              case "line":
                //newShapeString = newShapeString != '' ? (newShapeString + ' line-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('line-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
                if (elementId == 12 || elementId == 13 || elementId == 14 || elementId == 15 || elementId == 16) {
                  height += y > prev_axis.height ? y - prev_axis.height : prev_axis.height - y
                  length += x > prev_axis.width ? x - prev_axis.width : prev_axis.width - x
                  prev_axis.height = y
                  prev_axis.width = x
                  break;
                }
                if (elementId == 17 || elementId == 19 || elementId == 20) {
                  if (x == prev_axis.width) {
                    length += y - prev_axis.height
                  }
                  else if (y == prev_axis.height) {
                    height += x - prev_axis.width
                  }
                  prev_axis.height = y
                  prev_axis.width = x
                  break;
                }

            }
          }

        }
      }


      return ({ "height": height, "width": length });
    }

  }

  getCanvaswidthandHeight(getData) {    
    if (getData.hasOwnProperty("toolbar_element_id")) {
      var elementId = getData.toolbar_element_id;
    }
    else {
      var elementId = getData.element_id;
    }
    if ((elementId <= 18 || getData.annotation_data.includes('move')) && elementId != 11) {
      let convertAnnotationWH = getData.annotation_data;
      let xCoordinate = [];
      let yCoordinate = [];
      let startx;
      let starty;
      let endx;
      let endy;
      convertAnnotationWH = convertAnnotationWH.trim();
      let splitData = convertAnnotationWH.split(" ");
      for (var i = 0; i < splitData.length; i++) {
        var splitString = splitData[i].replaceAll('--', '-n');
        splitString = splitString.replaceAll(':-', ':n');
        let hypenSplit = splitString.split("-");
        if (hypenSplit.length > 2) {
          let localString1 = hypenSplit[1] + '-' + hypenSplit[2];
          hypenSplit = [hypenSplit[0], localString1];
        }
        if (hypenSplit != '') {
          let colonSplit = hypenSplit[1].replaceAll('n', '-').split(":");
          colonSplit[0] = this.scientificToDecimal(Number(colonSplit[0]));
          colonSplit[1] = this.scientificToDecimal(Number(colonSplit[1]));
          if(xCoordinate.length == 128){
            console.log(xCoordinate)
            console.log(typeof colonSplit[0])
          }
          console.log(typeof colonSplit[0])
          if(!isNaN(colonSplit[0])){
            xCoordinate.push(colonSplit[0]);
          }
          if(!isNaN(colonSplit[1])){
            yCoordinate.push(colonSplit[1]);
          }
        }
      }
      startx = Math.min.apply(null, xCoordinate);
      endx = Math.max.apply(null, xCoordinate);
      starty = Math.min.apply(null, yCoordinate);
      endy = Math.max.apply(null, yCoordinate);
      let getDrawWidthandHeight = this.calculateRectPos(
        startx,
        starty,
        endx,
        endy
      );
      return getDrawWidthandHeight;
    }
    else if (elementId == 11) {
      var getText = getData.annotation_data.split('text-');
      let convertAnnotationWH = getText[0].trim();
      let xCoordinate = [];
      let yCoordinate = [];
      let startx;
      let starty;
      let endx;
      let endy;
      convertAnnotationWH = convertAnnotationWH.trim();
      let splitData = convertAnnotationWH.split(" ");
      for (var i = 0; i < splitData.length; i++) {
        var splitString = splitData[i].replaceAll('--', '-n');
        splitString = splitString.replaceAll(':-', ':n');
        let hypenSplit = splitString.split("-");
        if (hypenSplit != '') {
          let colonSplit = hypenSplit[1].replaceAll('n', '-').split(":");
          colonSplit[0] = this.scientificToDecimal(Number(colonSplit[0]));
          colonSplit[1] = this.scientificToDecimal(Number(colonSplit[1]));
          xCoordinate.push(colonSplit[0]);
          yCoordinate.push(colonSplit[1]);
        }
      }
      startx = Math.min.apply(null, xCoordinate);
      endx = Math.max.apply(null, xCoordinate);
      starty = Math.min.apply(null, yCoordinate);
      endy = Math.max.apply(null, yCoordinate);

      let getDrawWidthandHeight = this.calculateRectPos(
        startx,
        starty,
        endx,
        endy
      );
      return getDrawWidthandHeight;
    }
    else {
      let convertAnnotationWH = getData.annotation_data;
      var splitString = convertAnnotationWH.replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      let hypenSplit = splitString.split("-");
      let colonSplit = hypenSplit[1].replaceAll('n', '-').split(":");
      return {
        left: parseFloat(colonSplit[0]),
        top: parseFloat(colonSplit[1]),
        width: parseFloat(colonSplit[2]),
        height: parseFloat(colonSplit[3]),
      };

    }
  }

  getCanvaswidthandHeight1(getData) {    
    if (getData.annotation_data.includes('move')) {
      let convertAnnotationWH = getData.annotation_data;
      let xCoordinate = [];
      let yCoordinate = [];
      let startx;
      let starty;
      let endx;
      let endy;
      convertAnnotationWH = convertAnnotationWH.trim();
      let splitData = convertAnnotationWH.split(" ");
      for (var i = 0; i < splitData.length; i++) {
        var splitString = splitData[i].replaceAll('--', '-n');
        splitString = splitString.replaceAll(':-', ':n');
        let hypenSplit = splitString.split("-");
        if (hypenSplit.length > 2) {
          let localString1 = hypenSplit[1] + '-' + hypenSplit[2];
          hypenSplit = [hypenSplit[0], localString1];
        }
        if (hypenSplit != '') {
          let colonSplit = hypenSplit[1].replaceAll('n', '-').split(":");
          colonSplit[0] = this.scientificToDecimal(Number(colonSplit[0]));
          colonSplit[1] = this.scientificToDecimal(Number(colonSplit[1]));
          if(xCoordinate.length == 128){
            console.log(xCoordinate)
            console.log(typeof colonSplit[0])
          }
          console.log(typeof colonSplit[0])
          if(!isNaN(colonSplit[0])){
            xCoordinate.push(colonSplit[0]);
          }
          if(!isNaN(colonSplit[1])){
            yCoordinate.push(colonSplit[1]);
          }
        }
      }
      startx = Math.min.apply(null, xCoordinate);
      endx = Math.max.apply(null, xCoordinate);
      starty = Math.min.apply(null, yCoordinate);
      endy = Math.max.apply(null, yCoordinate);
      let getDrawWidthandHeight = this.calculateRectPos(
        startx,
        starty,
        endx,
        endy
      );
      return getDrawWidthandHeight;
    }
  }

  getCanvaswidthandHeightP2P3(getData) {

    if (getData.hasOwnProperty("toolbar_element_id")) {
      var elementId = getData.toolbar_element_id;
    }
    else {
      var elementId = getData.element_id;
    }
    if ((elementId <= 18 || getData.annotation_data.includes('move')) && elementId != 11) {
      let convertAnnotationWH = getData.annotation_data;
      let xCoordinate = [];
      let yCoordinate = [];
      let startx;
      let starty;
      let endx;
      let endy;
      convertAnnotationWH = convertAnnotationWH.trim();
      let splitData = convertAnnotationWH.split(" ");
      for (var i = 0; i < splitData.length; i++) {
        var splitString = splitData[i].replaceAll('--', '-n');
        splitString = splitString.replaceAll(':-', ':n');
        let hypenSplit = splitString.split("-");
        if (hypenSplit.length > 2) {
          let localString1 = hypenSplit[1] + '-' + hypenSplit[2];
          hypenSplit = [hypenSplit[0], localString1];
        }
        if (hypenSplit != '') {
          let colonSplit = hypenSplit[1].replaceAll('n', '-').split(":");

          xCoordinate.push(colonSplit[0]);
          yCoordinate.push(colonSplit[1]);
        }
      }
      startx = Math.min.apply(null, xCoordinate);
      endx = Math.max.apply(null, xCoordinate);
      starty = Math.min.apply(null, yCoordinate);
      endy = Math.max.apply(null, yCoordinate);
      let getDrawWidthandHeight = this.calculateRectPosP2P3(
        startx,
        starty,
        endx,
        endy
      );
      return getDrawWidthandHeight;
    }
    else if (elementId == 11) {
      var getText = getData.annotation_data.split('text-');

      let convertAnnotationWH = getText[0].trim();
      let xCoordinate = [];
      let yCoordinate = [];
      let startx;
      let starty;
      let endx;
      let endy;
      convertAnnotationWH = convertAnnotationWH.trim();
      let splitData = convertAnnotationWH.split(" ");
      for (var i = 0; i < splitData.length; i++) {
        var splitString = splitData[i].replaceAll('--', '-n');
        splitString = splitString.replaceAll(':-', ':n');
        let hypenSplit = splitString.split("-");
        if (hypenSplit != '') {
          let colonSplit = hypenSplit[1].replaceAll('n', '-').split(":");
          xCoordinate.push(colonSplit[0]);
          yCoordinate.push(colonSplit[1]);
        }
      }
      startx = Math.min.apply(null, xCoordinate);
      endx = Math.max.apply(null, xCoordinate);
      starty = Math.min.apply(null, yCoordinate);
      endy = Math.max.apply(null, yCoordinate);
      let getDrawWidthandHeight = this.calculateRectPosP2P3(
        startx,
        starty,
        endx,
        endy
      );
      return getDrawWidthandHeight;
    }
    else {
      let convertAnnotationWH = getData.annotation_data;
      let hypenSplit = convertAnnotationWH.split("-");
      let colonSplit = hypenSplit[1].split(":");
      return {
        left: parseFloat(colonSplit[0]),
        top: parseFloat(colonSplit[1]),
        width: parseFloat(colonSplit[2]),
        height: parseFloat(colonSplit[3]),
      };

    }
  }

  resizeFunctionNew(getData, isnegativeCoordinates) {
    var newShapeString: any = "";
    let getAcutalWidth = this.getCanvaswidthandHeight(getData);
    let elementId = getData.toolbar_element_id;
    var widthDiff = Number(getData.initial_width) - getAcutalWidth.width;
    var heightDiff = Number(getData.initial_height) - getAcutalWidth.height;
    if ((elementId >= 12 && elementId <= 18) || ((elementId == 19 || elementId == 20) && getData.annotation_data.includes('move'))) {
      widthDiff = 0;
      heightDiff = 0;
    }
    if (elementId < 11 || ((elementId == 19 || elementId == 20) && getData.annotation_data.includes('move'))) {
      if (elementId == 19 || elementId == 20) {
        var shapeDiffX = getAcutalWidth.left - widthDiff - ((Number(getData.line_width) / 6) / 2);
        var shapeDiffY = getAcutalWidth.top - heightDiff - ((Number(getData.line_width) / 6) / 2);
      }
      // this line commented by ganesh 20.10.2021 because 35 width height below shape canvas top and left tocuched ticket no P31 - 378
      // else if (elementId >= 1 && elementId <= 10 && (Number(getData.initial_width) < 35) && (Number(getData.initial_height) < 35) &&
      //   (Number(getData.initial_width) != 0) && (Number(getData.initial_height) != 0)) {

      //   // var shapeDiffX = (getAcutalWidth.left - widthDiff + 3.5) / 2;
      //   // var shapeDiffY = (getAcutalWidth.top - heightDiff + 3.5) / 2;
      //   var shapeDiffX = getAcutalWidth.left - widthDiff;
      //   var shapeDiffY = getAcutalWidth.top - heightDiff;
      //   shapeDiffX = shapeDiffX + (Number(getData.initial_width)/2) + 1 - (getAcutalWidth.width/2);
      //   shapeDiffY = shapeDiffY + (Number(getData.initial_height)/2) + 1 - (getAcutalWidth.height/2); 
      //   shapeDiffX = shapeDiffX - ((Number(getData.line_width) / 6));
      //   shapeDiffY = shapeDiffY - ((Number(getData.line_width) / 6));
      // }
      else {
        var shapeDiffX = getAcutalWidth.left - widthDiff;
        var shapeDiffY = getAcutalWidth.top - heightDiff;
        shapeDiffX = shapeDiffX + (Number(getData.initial_width) / 2) - (getAcutalWidth.width / 2);
        shapeDiffY = shapeDiffY + (Number(getData.initial_height) / 2) - (getAcutalWidth.height / 2);
        shapeDiffX = shapeDiffX - Math.round((Number(getData.line_width) / 6) * 2);
        shapeDiffY = shapeDiffY - Math.round((Number(getData.line_width) / 6) * 2);
        // let roundValue = ((Number(getData.line_width) / 6)*2);
        // roundValue = Math.round(roundValue);
        // console.log(roundValue);
      }
    }
    else if (elementId == 11) {
      var shapeDiffX = getAcutalWidth.left - (widthDiff) - ((Number(getData.line_width) / 6) / 2);
      var shapeDiffY = getAcutalWidth.top - (heightDiff / 2) - ((Number(getData.line_width) / 6));
    }
    else {
      var shapeDiffX = getAcutalWidth.left - widthDiff - Math.round((Number(getData.line_width) / 2) / 2);
      var shapeDiffY = getAcutalWidth.top - heightDiff - Math.round((Number(getData.line_width) / 2) / 2);
    }
    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");
    for (var i = 0; i < spaceSplit.length; i++) {
      let splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        // change the scientific number purpose like e - 
        if (hypenSplit.length > 2) {
          let localString1 = hypenSplit[1] + '-' + hypenSplit[2];
          hypenSplit = [hypenSplit[0], localString1];
        }
        if (hypenSplit != '') {
          var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
          colonSplit[0] = this.scientificToDecimal(Number(colonSplit[0]));
          colonSplit[1] = this.scientificToDecimal(Number(colonSplit[1]));
        }
        // var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "drawRect" && hypenSplit[0] != "ovalIn"
        ) {
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);
          switch (hypenSplit[0]) {
            case "move":
              newShapeString = newShapeString != '' ? (newShapeString + ' move-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('move-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "line":
              newShapeString = newShapeString != '' ? (newShapeString + ' line-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('line-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "ovalIn":
              break;
            case "curveEnd":
              newShapeString = newShapeString != '' ? (newShapeString + ' curveEnd-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('curveEnd-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint1":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint1-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint1-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint2":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint2-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint2-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "endCurve":
              newShapeString = newShapeString != '' ? (newShapeString + ' endCurve-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('endCurve-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "text":
              newShapeString = newShapeString != '' ? newShapeString + " " + hypenSplit.join("-") : hypenSplit.join("-");
              break;
          }
        }

      }
    }
    let initialX = Number(getData.initial_position_x) + (getAcutalWidth.left / 2);
    let initialY = Number(getData.initial_position_y) + (getAcutalWidth.top / 2);
    // if(elementId>=1&&elementId<=10&&(Number(getData.initial_width)<35)&&(Number(getData.initial_height)<35)&&
    // (Number(getData.initial_width)!=0)&&(Number(getData.initial_height)!=0)){
    //   newShapeString = newShapeString.replaceAll('--','-');
    //   newShapeString = newShapeString.replaceAll(':-',':');
    //   
    //   
    // }
    let returnValue = { shapeString: newShapeString, initialX: initialX, initialY: initialY }
    return returnValue;
  }

  formsheaderCanvas(id, getData123, labelid, source) {
    let getDataClone = _.cloneDeep(getData123);
    let fullData;
    let getData;
    let elementId;
    let getnewwidth;
    let getnewheight;
    if (source == 'DocPage') {
      fullData = getDataClone;
      getData = getDataClone;
      if (typeof getData.toolbar_element_id == 'string') {
        elementId = Number(getData.toolbar_element_id);
        this.toolbarElementId = Number(getData.toolbar_element_id);
      }
      else {
        elementId = getData.toolbar_element_id;
        this.toolbarElementId = getData.toolbar_element_id;
      }
    }
    else {
      fullData = getDataClone;
      getData = getDataClone.shape;
      elementId = getData.element_id;
    }

    var pdfImg = document.getElementById(id);
    let getWidth = 0;
    let getHeight = 0;
    if (getData.initial_width <= 0 && getData.initial_height <= 0 && elementId >= 12 && elementId <= 18) {
      let getDrawWidthandHeight = this.getCanvaswidthandHeight(getData);
      if (Number(getData.initial_position_x) != 0) {
        let getChangedString = this.changeStringValue(getData);
        getData.annotation_data = getChangedString;
        getData.initial_position_x = Number(getData.initial_position_x);
        getData.initial_position_y = Number(getData.initial_position_y);
        this.coordinateX = getData.initial_position_x < 0 ? -(getData.initial_position_x) : getData.initial_position_x;
        this.coordinateY = getData.initial_position_y < 0 ? -(getData.initial_position_y) : getData.initial_position_y;
      }
      else {
        this.coordinateX = getDrawWidthandHeight.left;
        this.coordinateY = getDrawWidthandHeight.top;
      }
      getWidth = getDrawWidthandHeight.width;
      getHeight = getDrawWidthandHeight.height;
    }
    else if (getData.initial_width != 0 && getData.initial_height != 0 && elementId >= 12 && elementId <= 18) {
      getHeight = getData.initial_height + 3;
      getWidth = getData.initial_width + 3;

      // this.coordinateX = getData.initial_position_x;
      // this.coordinateY = getData.initial_position_y;
      let getWidthResize = this.getCanvaswidthandHeight(getData);

    }
    else if (elementId <= 11 && getData.initial_height != 0 && getData.initial_width != 0) {
      let getDrawWidthandHeight = getData.annotation_data;

      // var startXValue = getDrawWidthandHeight.left;
      // var startYValue = getDrawWidthandHeight.top;
      // var centerShapeChangeX = (endx - startx) / 2;
      // var centerShapeChangeY = (endy - starty) / 2;
      this.coordinateX = getData.initial_position_x;
      this.coordinateY = getData.initial_position_y;

      getWidth = Number(getData.initial_width);
      getHeight = Number(getData.initial_height);
    }
    else if (elementId <= 11) {
      getWidth = 40;
      getHeight = 40;
    }
    else if (elementId == 19 || elementId == 20) {
      if (getData.annotation_data.includes('move')) {
        let getDrawWidthandHeight = this.getCanvaswidthandHeight(getData);
        getWidth = getDrawWidthandHeight.width;
        getHeight = getDrawWidthandHeight.height;
        this.coordinateX = Number(getData.initial_position_x) - 35;
        this.coordinateY = Number(getData.initial_position_y) - 35;
      }
      else {
        let stringValue = getData.annotation_data;
        let splitString = stringValue.replaceAll('--', '-n');
        splitString = splitString.replaceAll(':-', ':n');
        let hypenSplitCD = splitString.split("-");
        let colonSplitCD = hypenSplitCD[1].replaceAll('n', '-').split(":");
        colonSplitCD[0] = Number(colonSplitCD[0]);
        colonSplitCD[1] = Number(colonSplitCD[1]);
        colonSplitCD[2] = Number(colonSplitCD[2]);
        colonSplitCD[3] = Number(colonSplitCD[3]);
        if (Number(getData.initial_position_x) != 0) {
          this.coordinateX = Number(getData.initial_position_x);
          this.coordinateY = Number(getData.initial_position_y);
          this.coordinateY = this.coordinateY - (35 / 2);
          this.coordinateX = this.coordinateX - (35 / 2);
          getData.initial_width = 0;
          getData.initial_height = 0;
          getData.initial_position_x = 0;
          getData.initial_position_y = 0;
        }
        else {
          this.coordinateX = colonSplitCD[2] < 0 ? (colonSplitCD[0]) + colonSplitCD[2] : colonSplitCD[0];
          this.coordinateY = colonSplitCD[3] < 0 ? colonSplitCD[1] + colonSplitCD[3] : colonSplitCD[1];
          colonSplitCD[2] = colonSplitCD[2] < 0 ? -(colonSplitCD[2]) : colonSplitCD[2];
          colonSplitCD[3] = colonSplitCD[3] < 0 ? -(colonSplitCD[3]) : colonSplitCD[3];
        }
        if (elementId == 19) {
          getWidth = parseFloat(colonSplitCD[2]) + 4;
          getHeight = parseFloat(colonSplitCD[3]) + 4;
        }
        else {
          getWidth = parseFloat(colonSplitCD[2]) + 4;
          getHeight = parseFloat(colonSplitCD[3]) + 4;
        }

      }
    }
    var annotationLabel = getData.annotation_label;

    // if (pdfImg.hasChildNodes()!=null && pdfImg != null) {
    //   pdfImg.removeChild(pdfImg.childNodes[0]);
    // }
    if (pdfImg != null) {
      while (pdfImg.hasChildNodes()) {
        pdfImg.removeChild(pdfImg.firstChild);
      }
    }
    let getannotationLabelElement = document.querySelectorAll("p");
    if (getannotationLabelElement.length > 0) {
      for (var al = 0; al < getannotationLabelElement.length; al++) {
        if (getannotationLabelElement[al].getAttribute(labelid) != null) {
          getannotationLabelElement[al].remove();
        }
      }
    }
    // else if (this.properties == true) {
    //   var pdfImg = document.getElementById("headerCanvasProperties");
    // }
    var newcreatedElement = document.createElement("canvas");
    newcreatedElement.setAttribute('id', 'canvas' + id);
    if (elementId < 12) {
      newcreatedElement.setAttribute("width", "50");
      newcreatedElement.setAttribute("height", "50");
      newcreatedElement.style.pointerEvents = "none";
    }
    // newcreatedElement.style.opacity = getData.opacity;
    if (getData.element_type == 1 || getData.element_type == 8) {
      newcreatedElement.style.marginTop = "8px";
    }
    pdfImg.appendChild(newcreatedElement);
    this.canvasElement = newcreatedElement.getContext("2d");
    if (elementId >= 12) {
      let scaleValueX = 0.8;
      let scaleValueY = 0.8;
      let newwidth = 50;
      let newheight = 50;
      if (getWidth > 50 || getHeight > 50) {
        var scale_val = Math.min(50 / (getWidth), 50 / (getHeight))
        newwidth = getWidth * scale_val;
        newheight = getHeight * scale_val;
        scaleValueX = scale_val;
        scaleValueY = scale_val;
      }
      this.canvasElement.canvas.width = newwidth > 50 ? 48 : newwidth;
      this.canvasElement.canvas.height = newheight > 50 ? 48 : newheight;
      this.canvasElement.scale(scaleValueX, scaleValueX);
      this.canvasElement.textAlign = "center";
    }
    if (getData.annotation_label != "") {
      this.annotationLabelBackground(getData, id, labelid);
    }
    if (Number(getData.initial_width) != 0 && Number(getData.initial_height) != 0) {
      this.resizeChecking = true;
      getData.initial_width = Number(getData.initial_width) + 5;
      getData.initial_height = Number(getData.initial_height) + 5;
      newcreatedElement.setAttribute("width", getData.initial_width.toString());
      newcreatedElement.setAttribute("height", getData.initial_height.toString());
    }

    // var scale_val = Math.max(50 / Number(getData.initial_width), 50 / Number(getData.initial_height))

    //ganesh
    // scale_val = scale_val != 0 ? scale_val : 0.5;
    //jose sir logic
    // scale_val = scale_val < 0.5 ? 0.5 : scale_val;
    // newcreatedElement.style.transform = "scale(" + scale_val + ")";

    // var getafterScale = newcreatedElement.getBoundingClientRect();
    // if (getafterScale.width > 70 || getafterScale.height > 70) {
    //   scale_val = Math.max(50 / Number(getData.initial_width), 50 / Number(getData.initial_height))
    //   newcreatedElement.style.transform = "scale(" + scale_val + ")";
    //   getafterScale = newcreatedElement.getBoundingClientRect();
    //   if (getafterScale.width > 70 || getafterScale.height > 70) {
    //     scale_val = Math.min(50 / Number(getData.initial_width), 50 / Number(getData.initial_height))
    //     newcreatedElement.style.transform = "scale(" + scale_val + ")";
    //   }
    // }
    if (source == 'toolbar' || source == 'DocPage') {
      if (Number(getData.initial_width) == 0 && Number(getData.initial_height) == 0) {
        this.resizeChecking = false;
        let getStringWidth1 = this.getCanvaswidthandHeight(getData);
        if (elementId == 15 || elementId == 16 || elementId == 13 || elementId == 14 || elementId == 12) {
          let getnewwidth = getStringWidth1.width + 24;
          let getnewheight = getStringWidth1.height + 24;
          newcreatedElement.setAttribute("width", getnewwidth.toString());
          newcreatedElement.setAttribute("height", getnewheight.toString());
          newcreatedElement = this.createHIDPIcanvs(getnewwidth, getnewheight, 7, newcreatedElement);
        }
        else if (elementId > 11) {

          if (elementId != 19 && elementId != 20) {
            getnewwidth = getStringWidth1.width + 5;
            getnewheight = getStringWidth1.height + 5;
          }
          else {
            getnewwidth = getStringWidth1.width + 20;
            getnewheight = getStringWidth1.height + 20;
          }
          newcreatedElement.setAttribute("width", getnewwidth.toString());
          newcreatedElement.setAttribute("height", getnewheight.toString());
          newcreatedElement = this.createHIDPIcanvs(getnewwidth, getnewheight, 7, newcreatedElement);
        }
        else {
          getnewwidth = 50;
          getnewheight = 50;
          newcreatedElement.setAttribute("width", '50');
          newcreatedElement.setAttribute("height", '50');
          newcreatedElement = this.createHIDPIcanvs(50, 50, 7, newcreatedElement);
        }
      }
      else {
        let tempwidth = Number(getData.initial_width) + 5;
        let tempheight = Number(getData.initial_height) + 5;
        newcreatedElement = this.createHIDPIcanvs(tempwidth, tempheight, 7, newcreatedElement);
      }
      // newcreatedElement.style.transform = "scale(" + 1 + ")";
      newcreatedElement.style.display = "none";
    }
    this.canvasElement.beginPath();
    this.canvasElement.globalAlpha = fullData.opacity;

    //Rotate shape drawing setup start
    if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && elementId < 10) {
      let dx = getData.initial_rotation > 0 ? (getWidth / 2) : (-15);
      let dy = getData.initial_rotation > 0 ? (-15) : getHeight / 2;
      newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';

      // 
      // this.canvasElement.restore();
    }
    if (elementId >= 1 && elementId <= 10 && (Number(getData.initial_width) < 35) && (Number(getData.initial_height) < 35) &&
      (Number(getData.initial_width) != 0) && (Number(getData.initial_height) != 0)) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width) - 5;
      let currentDBgetH = Number(getData.initial_height) - 5;
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }

      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    if (elementId >= 12 && elementId <= 18 && Number(getData.initial_width) != 0 && Number(getData.initial_height) != 0) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width);
      let currentDBgetH = Number(getData.initial_height);
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if ((elementId == 19) && getData.annotation_data.includes('move')) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width) + 17.5;
      let currentDBgetH = Number(getData.initial_height) + 17.5;
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }

      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if (elementId == 20 && getData.annotation_data.includes('move')) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width);
      let currentDBgetH = Number(getData.initial_height);
      let actualratio = (actualCanvasWH.width + 35) / (actualCanvasWH.height + 35);
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }

      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }

    // To Repoint the drawn shape inside the canvas center.
    // --------------
    // 
    // if (getStringWidth != undefined && getData.initial_height == 0) {
    //   let translateWidth = getStringWidth.width - newcreatedElement.width;
    //   let translateHeight = getStringWidth.height - newcreatedElement.height;
    //   let translateX = (translateWidth / 2) + getStringWidth.left;
    //   let translateY = (translateHeight / 2) + getStringWidth.top;
    //   this.canvasElement.translate(-translateX, -translateY);
    //   this.canvasElement.restore();
    // }
    // ---------------

    //Rotate shape drawing setup start
    if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && elementId < 10) {


      let dx = getData.initial_rotation > 0 ? (getWidth / 2) : (-15);
      let dy = getData.initial_rotation > 0 ? (-15) : getHeight / 2;
      newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';

      // 
      // this.canvasElement.restore();
    }
    //Rotate shape drawing setup end
    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");
    var previous = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var a = 0;
    var last_mousex = this.coordinateX;
    var last_mousey = this.coordinateY;
    var mousex = 0;
    var mousey = 0;
    var cpx = 0;
    var cpy = 0;
    let cp1x = 0;
    let cp1y = 0;
    let cp2x = 0;
    let cp2y = 0;
    let cx = 0;
    let cy = 0;
    for (var i = 0; i < spaceSplit.length; i++) {
      var splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "curveEnd" &&
          hypenSplit[0] != "controlpoint" &&
          hypenSplit[0] != "drawRect" &&
          hypenSplit[0] != "controlpoint1" &&
          hypenSplit[0] != "controlpoint2" &&
          hypenSplit[0] != "endCurve"
        ) {
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);
          switch (hypenSplit[0]) {
            case "move":
              if (elementId >= 12 && Number(getData.initial_height) == 0 && elementId <= 18) {
                if (elementId == 15 || elementId == 16 || elementId == 13 || elementId == 14 || elementId == 12) {
                  this.canvasElement.moveTo(
                    x - this.coordinateX + 12,
                    y - this.coordinateY + 12
                  );
                }
                else {
                  this.canvasElement.moveTo(
                    x - this.coordinateX,
                    y - this.coordinateY
                  );
                }

              }
              else if (
                elementId >= 12 && Number(getData.initial_height) != 0 &&
                elementId <= 18 && elementId != 15 && elementId != 16) {
                this.canvasElement.moveTo(x + 2, y + 2
                );
              }
              else {
                this.canvasElement.moveTo(x, y);
              }
              if (elementId == 13 && j == 1) {
                previous.x = x - this.coordinateX;
                previous.y = y - this.coordinateY;
                a++;
              }
              break;
            case "line":
              this.canvasElement.clearRect(
                0,
                0,
                newcreatedElement.width,
                newcreatedElement.height
              );
              if (elementId >= 12 && Number(getData.initial_height) == 0 && elementId <= 20
              ) {
                if (elementId == 15 || elementId == 16 || elementId == 13 || elementId == 14 || elementId == 12) {
                  this.canvasElement.lineTo(
                    x - this.coordinateX + 12,
                    y - this.coordinateY + 12
                  );
                }
                else {
                  this.canvasElement.lineTo(
                    x - this.coordinateX,
                    y - this.coordinateY
                  );
                }
              }
              else if (
                elementId >= 12 && Number(getData.initial_height) != 0 &&
                elementId <= 20 && elementId != 15 && elementId != 16) {
                this.canvasElement.lineTo(x + 2, y + 2
                );
              }
              else {
                this.canvasElement.lineTo(x, y);
              }
              break;
            case "ovalIn":
              if (elementId == 1 || elementId == 8) {
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.arc(
                  newcreatedElement.clientWidth / 2,
                  newcreatedElement.clientHeight / 2.3,
                  r,
                  0,
                  2 * Math.PI
                );
              } else if (elementId == 19) {
                w = w < 0 ? -(w) : w;
                h = h < 0 ? -(h) : h;
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.ellipse(
                  (w / 2) + 2,
                  (h / 2) + 2,
                  w / 2,
                  h / 2,
                  Math.PI * 1,
                  0,
                  2 * Math.PI
                );
              }
              break;
          }
        }
        else if (hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") {
          if (hypenSplit[0] == "controlpoint") {
            cpx = parseFloat(colonSplit[0]);
            cpy = parseFloat(colonSplit[1]);
          }
          if (hypenSplit[0] == "curveEnd") {
            var ex = parseFloat(colonSplit[0]);
            var ey = parseFloat(colonSplit[1]);

            this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
          }
        }
        else if (hypenSplit[0] == "controlpoint1" || hypenSplit[0] == "controlpoint2" || hypenSplit[0] == "endCurve" && j == 1) {

          if (hypenSplit[0] == "controlpoint1") {
            cp1x = parseFloat(colonSplit[0]);
            cp1y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "controlpoint2") {
            cp2x = parseFloat(colonSplit[0]);
            cp2y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "endCurve") {
            cx = parseFloat(colonSplit[0]);
            cy = parseFloat(colonSplit[1]);
            this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
            this.canvasElement.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
          }
        }
        else if (hypenSplit[0] == "drawRect" && j == 1) {
          // let colonSplit = hypenSplit[j].split(":");
          let rectX = parseFloat(colonSplit[0]);
          let rectY = parseFloat(colonSplit[1]);
          let rectWidth = parseFloat(colonSplit[2]);
          let rectHeight = parseFloat(colonSplit[3]);
          this.canvasElement.clearRect(0, 0, rectWidth, rectHeight);
          this.canvasElement.rect(
            5,
            5,
            rectWidth,
            rectHeight);
        }
        if ((elementId == 17 || elementId == 18) && (spaceSplit.length - 1 == i) && (j == 1)) {
          this.canvasElement.closePath();
        }
      }
    }
    if (
      elementId != 12 &&
      elementId != 14 &&
      elementId != 13 &&
      elementId != 15 &&
      elementId != 16
    ) {
      var checkFill = getData.fill_color;
      this.canvasElement.fillStyle = this.checkStrokeColor1(fullData.fill_color);
      this.canvasElement.fill();

    }
    if (elementId == 15 || elementId == 16 || elementId == 13 || elementId == 14 || elementId == 12 && fullData.line_width != 0) {
      this.canvasElement.lineWidth = this.globalLineWidth(fullData.line_width) + 12;
      if ((this.currentWidth < 50 || this.currentHeight < 50) && this.currentWidth != 0 && this.currentHeight != 0 && elementId != 15
        && elementId != 16 && elementId != 14) {
        this.canvasElement.lineWidth = this.globalLineWidth(fullData.line_width) + 3;
      }
    }
    else {
      this.canvasElement.lineWidth = this.globalLineWidth(fullData.line_width);
    }
    this.canvasElement.strokeStyle = this.checkStrokeColor1(fullData.stroke_color);
    this.canvasElement.stroke();
  }


  canvasToImageConvert(id, source, annotJson) {
    let headElement = document.getElementById(id);
    let canvas: any = document.getElementById('canvas' + id);
    if (canvas == undefined) {
      return
    }
    let image = new Image();
    if (this.currentWidth < 50 && this.currentHeight < 50 && source == 'toolbar') {
      image.setAttribute("width", "50");
      image.setAttribute("height", "50");

    }
    else {
      image.setAttribute("width", "40");
      image.setAttribute("height", "40");
      if ((this.resizeChecking == true && source == 'DocPage') || (source == 'DocPage' && this.toolbarElementId >= 12)) {
        image.setAttribute("width", "40");
        image.setAttribute("height", "40");
      }
      else if (annotJson.toolbar_element_id == 11) {
        image.setAttribute("width", "50");
        image.setAttribute("height", "50");
      }
    }
    image.style.objectFit = "contain";
    image.src = canvas.toDataURL();
    headElement.appendChild(image);
    const transformvalue = canvas.style.transform;
    if (transformvalue != "") {
      image.style.transform = transformvalue + "scale(0.65)";
    }
    canvas.style.display = "none";
  }

  process_set_scale(element_id, annot_initial_width, annot_initial_height, scaleFactor) {
    let length
    let height
    let area
    let boundingarea = 0
    annot_initial_width = Number(annot_initial_width) == 0 ? 50 : Number(annot_initial_width)
    annot_initial_height = Number(annot_initial_height) == 0 ? 50 : Number(annot_initial_height)
    scaleFactor = Number(scaleFactor)
    switch (Number(element_id)) {
      case 1: //circle
        boundingarea = 20;
        length = ((annot_initial_width - boundingarea) * scaleFactor) / 2
        area = 3.141592653589793 * length * length
        break;
      case 2: //octagon
        boundingarea = 20;
        length = ((annot_initial_width - boundingarea) * scaleFactor) / 2
        area = 2 * (1 + Math.sqrt(2)) * (length * length)
        break;
      case 3: //square
        boundingarea = 20;
        length = ((annot_initial_width - boundingarea) * scaleFactor)
        area = (length * length)
        break;
      case 4: //Triangle
        boundingarea = 20;
        length = ((annot_initial_width - boundingarea) * scaleFactor)
        area = (length * length) / 2
        break;
      case 5: //Triangle
      case 7: //Flag
      case 8: //Camera
      case 9: //Arrow
      case 11: //Text
      case 18: //Polygon
        length = 'N/A'
        area = 'N/A'
        break;
      case 6://Diamond
        boundingarea = 35;
        length = ((annot_initial_width - boundingarea) * scaleFactor)
        height = length * (2 / 3)
        area = (length * height) / 2
        break;
      case 12: //Freehand line
        length = (annot_initial_width + annot_initial_height) * scaleFactor
        area = "N/A"
        break;
      case 13: //Polyline Arrow
      case 14: //Polyline
        length = (annot_initial_width + annot_initial_height) * scaleFactor
        area = "N/A"
        break;
      case 15: //Line
      case 16: //Line axial
        length = annot_initial_width > annot_initial_height ? annot_initial_width : annot_initial_height
        length = length * scaleFactor
        break;

      case 17: //Freehand area
        boundingarea = 20
        // length = (annot_initial_width-boundingarea)*scaleFactor
        // height = (annot_initial_height-boundingarea)*scaleFactor
        length = annot_initial_width
        height = annot_initial_height
        area = length * height
        break;
      case 19: //Drawn Eclipse
        boundingarea = 20
        length = (annot_initial_width)
        height = (annot_initial_height)
        area = 3.141592653589793 * length * height
        break;
      case 20: //Drawn Rectangle
        boundingarea = 20
        length = (annot_initial_width)
        height = (annot_initial_height)
        area = length * height
        break;

    }//switch close

    length = Number(length) > 0 ? length.toFixed(3) : length
    area = Number(area) > 0 ? area.toFixed(3) : area
    height = Number(height) > 0 ? height.toFixed(3) : height

    return (length + "==" + area + "==" + height);
  }

  createHIDPIcanvs(w, h, r, element) {
    element.width = w * r;
    element.height = h * r;
    element.style.width = w + 'px';
    element.style.height = h + 'px';
    this.currentWidth = w;
    this.currentHeight = h;
    element.getContext('2d').setTransform(r, 0, 0, r, 0, 0);
    return element;
  }

  mainDrawingLabel(getData, pdfImg, x, y, width, height,p2p3?:boolean,margin_adjust_left?:any,margin_adjust_top?:any) {
    if (getData.annotation_label!=undefined && getData.annotation_label != "") {
      // remove label element common place start
      let get_label_Element = document.getElementById("label" + getData.annotation_id);
      if(get_label_Element!=null){
        get_label_Element.remove();
      }
      var labelFontsize = "13px";
      var newFontSize = Number(getData.text_font_size);
      if(getData.text_font_size!="" && getData.text_font_size!=null && newFontSize!=null && newFontSize!=13){
        labelFontsize = newFontSize.toString();
        labelFontsize = labelFontsize + "px";
      }
      // remove label element common place end
      let labelElement: HTMLParagraphElement = document.createElement("p");
      pdfImg.appendChild(labelElement);
      labelElement.setAttribute("annotationLabel", "1");
      labelElement.setAttribute("id", "label" + getData.annotation_id);
      labelElement.style.color = this.checkStrokeColor1(getData.stroke_color);
      labelElement.style.fontSize = labelFontsize;
      labelElement.style.opacity  = getData.opacity;
      labelElement.style.fontWeight = "500";
      labelElement.style.position = "absolute";
      labelElement.style.top = Number(y) + "px";
      labelElement.style.left = Number(x) + "px";
      labelElement.innerHTML = getData.annotation_label;
      labelElement.style.lineHeight = "1";
      labelElement.style.textAlign = "center";
      labelElement.style.pointerEvents = "none";
      labelElement.style.zIndex = "9";
      labelElement.style.whiteSpace = "nowrap";
      var numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;
      if (numberOfLineBreaks != 0) {
        labelElement.style.whiteSpace = "pre-wrap";
      }
      let measurement = (labelElement.offsetHeight / 2);
      let measurement1 = (labelElement.offsetWidth / 2);
      if ((getData.toolbar_element_id >= 12) || getData.initial_height != 0 && getData.initial_width != 0) {
        let calculatex = 0;
        let calculatey = 0;
        calculatex = (Number(width) - labelElement.offsetWidth) / 2;
        calculatey = (Number(height) - labelElement.offsetHeight) / 2;
        measurement = calculatey;
        measurement1 = calculatex;
      }
      //P2 label value position mismatch issue
      else if (p2p3) {
        let calculatex = 0;
        let calculatey = 0;
        calculatex = (Number(width) / 2) - (labelElement.offsetWidth / 2);
        calculatey = (Number(height) / 2) - (labelElement.offsetHeight / 2);
        measurement = calculatey;
        measurement1 = calculatex;
      }
      else {
        measurement = -(measurement);
        measurement1 = -(measurement1);
      }
      let negativeChecky = Number(y) + measurement;
      let negativeCheckx = Number(x) + measurement1;
      margin_adjust_left = margin_adjust_left == undefined ? 0 : margin_adjust_left;
      margin_adjust_top = margin_adjust_top == undefined ? 0 : margin_adjust_top;
      labelElement.style.left = Number(x) + measurement1 + margin_adjust_left + "px";
      labelElement.style.top = Number(y) + measurement + margin_adjust_top + "px";
      //document outside label restriction
      if (negativeCheckx < 0) {
        let positivechange = -(negativeCheckx * 2);
        labelElement.style.width = (labelElement.offsetWidth - positivechange) + 'px';
        labelElement.style.wordBreak = "break-word";
        labelElement.style.whiteSpace = "pre-wrap";
        labelElement.style.left = "0px";
        let findHeight1 = -(labelElement.offsetHeight / 2);
        labelElement.style.top = Number(y) + findHeight1 + "px";
      }
      if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && getData.toolbar_element_id < 10) {
        labelElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';
      }
    }
  }

  xyPositionDiff(data123) {
    let newShapeString = "";
    let getStringWidth = this.getCanvaswidthandHeight(data123);
    let xDiff = data123.initial_position_x - getStringWidth.left;
    let yDiff = data123.initial_position_y - getStringWidth.top;
    let xDiffNegativeCheck = xDiff;
    let yDiffNegativeCheck = yDiff;
    let elementId = data123.toolbar_element_id;
    if (elementId > 11) {
      if (getStringWidth.width < 2 || getStringWidth.height < 2) {
        xDiffNegativeCheck = xDiffNegativeCheck + ((Number(data123.line_width) / 2) / 2);
        yDiffNegativeCheck = yDiffNegativeCheck + ((Number(data123.line_width) / 2) / 2);
      }
      else {
        if (elementId == 19) {
          xDiffNegativeCheck = xDiffNegativeCheck + ((Number(data123.line_width) / 2));
          yDiffNegativeCheck = yDiffNegativeCheck + ((Number(data123.line_width) / 2));
        }
        else {
          if (Number(data123.line_width) > 20) {
            xDiffNegativeCheck = xDiffNegativeCheck + ((Number(data123.line_width) / 2));
            yDiffNegativeCheck = yDiffNegativeCheck + ((Number(data123.line_width) / 2));
          }
          else {
            xDiffNegativeCheck = xDiffNegativeCheck + ((Number(data123.line_width) / 2));
            yDiffNegativeCheck = yDiffNegativeCheck + ((Number(data123.line_width) / 2));
          }
        }
      }
    }
    let cloneObject = Object.assign({},data123);
    data123.annotation_data = data123.annotation_data.trim();
    var spaceSplit = data123.annotation_data.split(" ");
    for (var i = 0; i < spaceSplit.length; i++) {
      var splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (j == 1 && (hypenSplit[0] != "drawRect" && (elementId != 19 || cloneObject.annotation_data.includes('move')) && (elementId != 20 ||cloneObject.annotation_data.includes('move')) ) ) {
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);
          switch (hypenSplit[0]) {
            case "move":
              newShapeString = newShapeString != '' ? (newShapeString + ' move-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck)) : ('move-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck));
              break;
            case "line":
              newShapeString = newShapeString != '' ? (newShapeString + ' line-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck)) : ('line-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck));
              break;
            case "ovalIn":
              break;
            case "curveEnd":
              newShapeString = newShapeString != '' ? (newShapeString + ' curveEnd-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck)) : ('curveEnd-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck));
              break;
            case "controlpoint":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck)) : ('controlpoint-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck));
              break;
            case "controlpoint1":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint1-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck)) : ('controlpoint1-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck));
              break;
            case "controlpoint2":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint2-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck)) : ('controlpoint2-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck));
              break;
            case "endCurve":
              newShapeString = newShapeString != '' ? (newShapeString + ' endCurve-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck)) : ('endCurve-' + (x + xDiffNegativeCheck) + ':' + (y + yDiffNegativeCheck));
              break;
          }
        }
      }
    }
    let initialX = Number(data123.initial_position_x) + (data123.left / 2);
    let initialY = Number(data123.initial_position_y) + (data123.top / 2);
    let returnValue = { shapeString: newShapeString, initialX: initialX, initialY: initialY }
    return returnValue;
  }

  changeStringValue(data) {
    let getnewString = this.xyPositionDiff(data);
    let getStringValue = getnewString.shapeString;
    return getStringValue;
  }

  getshapeDrawing(receiveData, isnegativeCoordinates, id, labelid, source) {
    let getData = _.cloneDeep(receiveData)
    var elementId = Number(getData.toolbar_element_id);
    var pdfImg = document.getElementById(id);
    if (pdfImg == undefined) {
      return
    }
    if (pdfImg != null && pdfImg.firstChild != null) {
      var child = pdfImg.lastElementChild;

      while (child) {
        pdfImg.removeChild(child);
        child = pdfImg.lastElementChild;
      }
    }

    // let getannotationLabelElement = document.querySelectorAll("p");
    // if (getannotationLabelElement.length > 0) {
    //   
    //   for (var al = 0; al < getannotationLabelElement.length; al++) {
    //     if (getannotationLabelElement[al].getAttribute(labelid) != null) {
    //       getannotationLabelElement[al].remove();
    //     }
    //   }
    // }
    // remove label element based on the parent

    var newcreatedElement = document.createElement("canvas");
    newcreatedElement.setAttribute("id", 'canvas' + id);
    getData.initial_height = Number(getData.initial_height);
    getData.initial_width = Number(getData.initial_width);
    var getHeight;
    var getWidth;
    var shapeStringValueTemp = this.getCanvaswidthandHeight(getData);
    if (getData.initial_width <= 0 && getData.initial_height <= 0 && elementId >= 12 && elementId <= 18) {
      let getDrawWidthandHeight = this.getCanvaswidthandHeight(getData);
      if (Number(getData.initial_position_x) != 0) {
        let getChangedString = this.changeStringValue(getData);
        getData.annotation_data = getChangedString;
        getData.initial_position_x = Number(getData.initial_position_x);
        getData.initial_position_y = Number(getData.initial_position_y);
        this.coordinateX = getData.initial_position_x < 0 ? -(getData.initial_position_x) : getData.initial_position_x;
        this.coordinateY = getData.initial_position_y < 0 ? -(getData.initial_position_y) : getData.initial_position_y;
      }
      else {
        this.coordinateX = getDrawWidthandHeight.left;
        this.coordinateY = getDrawWidthandHeight.top;
      }
      if (shapeStringValueTemp.width < 2 || shapeStringValueTemp.height < 2) {
        getWidth = getDrawWidthandHeight.width + Number(getData.line_width);
        getHeight = getDrawWidthandHeight.height + Number(getData.line_width);
      }
      else {
        getWidth = getDrawWidthandHeight.width + Number(getData.line_width);
        getHeight = getDrawWidthandHeight.height + Number(getData.line_width);
      }
    }
    else if (getData.initial_width != 0 && getData.initial_height != 0 && elementId >= 12 && elementId <= 18) {
      getHeight = getData.initial_height + Number(getData.line_width);
      getWidth = getData.initial_width + Number(getData.line_width);

      // this.coordinateX = getData.initial_position_x;
      // this.coordinateY = getData.initial_position_y;
      let getWidthResize = this.getCanvaswidthandHeight(getData);
    }
    else if (elementId <= 11 && getData.initial_height != 0 && getData.initial_width != 0) {
      this.coordinateX = getData.initial_position_x;
      this.coordinateY = getData.initial_position_y;
      getWidth = Number(getData.initial_width) + (Number(getData.line_width) / (6) * 2);
      getHeight = Number(getData.initial_height) + (Number(getData.line_width) / (6) * 2);
      if (elementId == 5 || elementId == 9) {
        getWidth = Number(getData.initial_width) + (Number(getData.line_width) / (6) * 2);
        getHeight = Number(getData.initial_height) + (Number(getData.line_width) / (6) * 2);
      }
    }
    else if (elementId <= 11) {

      getWidth = 35 + Number(getData.line_width) / (6);
      getHeight = 35 + Number(getData.line_width) / (6);
      if (elementId == 5 || elementId == 9) {
        getWidth = 35 + (Number(getData.line_width) / (6) * 2);
        getHeight = 35 + (Number(getData.line_width) / (6) * 2);
      }
    }
    else if (elementId == 19 || elementId == 20) {

      if (getData.annotation_data.includes('move') && getData.initial_width != 0 && getData.initial_height != 0) {
        let getDrawWidthandHeight = this.getCanvaswidthandHeight(getData);
        getWidth = getDrawWidthandHeight.width + (Number(getData.line_width) / 2);
        getHeight = getDrawWidthandHeight.height + (Number(getData.line_width) / 2);
        this.coordinateX = Number(getData.initial_position_x) - 35 - ((Number(getData.line_width) / 2) / 2);
        this.coordinateY = Number(getData.initial_position_y) - 35 - ((Number(getData.line_width) / 2) / 2);
      }
      else if (getData.annotation_data.includes('move') && getData.initial_position_x != 0 && getData.initial_position_y != 0) {
        let getDrawWidthandHeight = this.getCanvaswidthandHeight(getData);
        getWidth = getDrawWidthandHeight.width + (Number(getData.line_width));
        getHeight = getDrawWidthandHeight.height + (Number(getData.line_width));
        this.coordinateX = Number(getData.initial_position_x) - ((Number(getData.line_width) / 2));
        this.coordinateY = Number(getData.initial_position_y) - ((Number(getData.line_width) / 2));
      }
      else {
        let stringValue = getData.annotation_data;
        let splitString = stringValue.replaceAll('--', '-n');
        splitString = splitString.replaceAll(':-', ':n');
        let hypenSplitCD = splitString.split("-");
        let colonSplitCD = hypenSplitCD[1].replaceAll('n', '-').split(":");
        colonSplitCD[0] = Number(colonSplitCD[0]);
        colonSplitCD[1] = Number(colonSplitCD[1]);
        colonSplitCD[2] = Number(colonSplitCD[2]);
        colonSplitCD[3] = Number(colonSplitCD[3]);
        if (Number(getData.initial_position_x) != 0) {
          this.coordinateX = Number(getData.initial_position_x);
          this.coordinateY = Number(getData.initial_position_y);
          this.coordinateY = this.coordinateY - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
          this.coordinateX = this.coordinateX - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
          getData.initial_width = 0;
          getData.initial_height = 0;
          getData.initial_position_x = 0;
          getData.initial_position_y = 0;
        }
        else {
          this.coordinateX = colonSplitCD[2] < 0 ? (colonSplitCD[0]) + colonSplitCD[2] - ((Number(getData.line_width) / 2) / 2) : colonSplitCD[0] - ((Number(getData.line_width) / 2) / 2);
          this.coordinateY = colonSplitCD[3] < 0 ? colonSplitCD[1] + colonSplitCD[3] - ((Number(getData.line_width) / 2) / 2) : colonSplitCD[1] - ((Number(getData.line_width) / 2) / 2);
          colonSplitCD[2] = colonSplitCD[2] < 0 ? -(colonSplitCD[2]) : colonSplitCD[2];
          colonSplitCD[3] = colonSplitCD[3] < 0 ? -(colonSplitCD[3]) : colonSplitCD[3];
        }
        if (elementId == 19) {
          getWidth = parseFloat(colonSplitCD[2]) + 4 + Number(getData.line_width) / (2);
          getHeight = parseFloat(colonSplitCD[3]) + 4 + Number(getData.line_width) / (2);
        }
        else {
          getWidth = parseFloat(colonSplitCD[2]) + 4 + Number(getData.line_width) / (2);
          getHeight = parseFloat(colonSplitCD[3]) + 4 + Number(getData.line_width) / (2);
        }

      }
    }
    newcreatedElement.style.position = "absolute";
    newcreatedElement.style.zIndex = "1";
    if (
      elementId == 12 ||
      elementId == 17 ||
      elementId == 18 ||
      elementId == 14 ||
      elementId == 13 ||
      elementId == 19 ||
      elementId == 20 ||
      elementId == 15 ||
      elementId == 16 ||
      isnegativeCoordinates == true
    ) {
      // newcreatedElement.setAttribute("id", getData.annotation_id);
      var complexElementWidth = 0;
      var complexElementHeight = 0;
      if ((elementId == 13 || elementId == 14) && getData.initial_height == 0) {
        newcreatedElement.setAttribute("width", getWidth + 20);
        newcreatedElement.setAttribute("height", getHeight + 20);
        complexElementWidth = getWidth + 20;
        complexElementHeight = getHeight + 20;
      }
      else if (elementId != 19 && elementId != 20 && getData.initial_height == 0) {
        newcreatedElement.setAttribute("width", getWidth + 20);
        newcreatedElement.setAttribute("height", getHeight + 20);
        complexElementWidth = getWidth + 20;
        complexElementHeight = getHeight + 20;
      }
      else {
        newcreatedElement.setAttribute("width", getWidth);
        newcreatedElement.setAttribute("height", getHeight);
        complexElementWidth = getWidth;
        complexElementHeight = getHeight;
      }
      if (getData.initial_width != 0 && getData.initial_height != 0 && (elementId >= 12 && elementId <= 18)) {
        if (shapeStringValueTemp.width < 2 || shapeStringValueTemp.height < 2) {
          newcreatedElement.style.top = 0 + 'px';
          newcreatedElement.style.left = 0 + 'px';
        }
        else {
          newcreatedElement.style.top = 0 + 'px';
          newcreatedElement.style.left = 0 + 'px';
        }
      }
      else if (getData.initial_position_x != 0 && getData.initial_position_y != 0 && (elementId >= 12 && elementId <= 18)) {
        if (shapeStringValueTemp.width < 2 || shapeStringValueTemp.height < 2) {
          newcreatedElement.style.top = 0 + 'px';
          newcreatedElement.style.left = 0 + 'px';
        }
        else {
          newcreatedElement.style.top = 0 + 'px';
          newcreatedElement.style.left = 0 + 'px';
        }
      }
      else if (elementId == 19 || elementId == 20) {

        if (getData.annotation_data.includes('move') && elementId == 19 && getData.initial_height != 0) {
          newcreatedElement.style.top = 0 + 'px';
          newcreatedElement.style.left = 0 + 'px';
        }
        else if (getData.annotation_data.includes('move') && elementId == 20 && getData.initial_height != 0) {
          newcreatedElement.style.top = 0 + 'px';
          newcreatedElement.style.left = 0 + 'px';
        }
        else if (getData.annotation_data.includes('move') && elementId == 19 && getData.initial_position_x != 0) {
          newcreatedElement.style.top = 0 + 'px';
          newcreatedElement.style.left = 0 + 'px';
        }
        else if (getData.annotation_data.includes('move') && elementId == 20 && getData.initial_position_x != 0) {
          newcreatedElement.style.top = 0 + 'px';
          newcreatedElement.style.left = 0 + 'px';
        }
        else {
          newcreatedElement.style.top = 0 + 'px';
          newcreatedElement.style.left = 0 + 'px';
        }
      }
      else {
        newcreatedElement.style.top = 0 + 'px';
        newcreatedElement.style.left = 0 + 'px';
      }
      // else if(getData.initial_height == 0&&getData.initial_position_x==0&&getData.initial_position_y==0) {
      //   newcreatedElement.style.marginTop = - 10 + "px";
      //   newcreatedElement.style.marginLeft = - 10 + "px";
      // }
    }
    else if (
      elementId == 15 ||
      elementId == 16
    ) {
      // newcreatedElement.setAttribute("id", getData.annotation_id);
      newcreatedElement.setAttribute("width", getWidth + getData.line_width + getData.line_width + 10);
      newcreatedElement.setAttribute("height", getHeight + getData.line_width + getData.line_width + 10);
      newcreatedElement.style.top = this.coordinateY - getData.line_width - getData.line_width + "px";
      newcreatedElement.style.left = this.coordinateX - getData.line_width - getData.line_width + "px";
      newcreatedElement.style.marginTop = -getData.line_width - 2.5 + "px";
      newcreatedElement.style.marginLeft = -getData.line_width - 2.5 + "px";
    }
    else if (elementId == 11) {
      let staticValue = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-60:0 controlpoint-65:0 curveEnd-65:5 line-65:15 controlpoint-65:20 curveEnd-60:20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10"
      var getText = getData.annotation_data.split('text-');

      if (typeof getText[1] != undefined) {
        if (getData.annotation_label.trim() != '') {
          let textvalue = getData.annotation_label.trim();
          getText.push(textvalue);
        }
        else {
          let textvalue = "     ";
          getText.push(textvalue);
        }
      }
      getText[1] = getText[1].replaceAll("`~", "");
      getText[1] = getText[1].replaceAll("~`", "-");
      getText[1] = getText[1].replaceAll("~~~", ":");
      let canvas12 = document.createElement("canvas");
      canvas12.style.width = "200px";
      let textCount = 20;
      let context = canvas12.getContext("2d");
      context.font = "17px times new roman";
      context.fillText(getText[1], 0, 0);
      let widthget = context.measureText(getText[1]).width;

      ;
      if (getText[1].length < 5) {
        textCount = 27;
      }
      else if (getText[1].length > 12) {
        textCount = 5;
      }
      let formattedWidth = Math.ceil(widthget);
      formattedWidth = formattedWidth + textCount;
      canvas12.innerHTML = getText[1];
      canvas12.style.fontWeight = "500";
      canvas12.style.fontSize = "17px";
      var textWidth = formattedWidth;
      let currentAnnotationData = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10 text-" + getText[1] + ""
      let widththerom = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10";
      let x1Coordinate = [];
      let y1Coordinate = [];
      widththerom = widththerom.trim();
      let splitData123 = widththerom.split(" ");
      for (var im = 0; im < splitData123.length - 1; im++) {

        let hypenSplit = splitData123[im].split("-");
        let colonSplit = hypenSplit[1].split(":");
        x1Coordinate.push(colonSplit[0]);
        y1Coordinate.push(colonSplit[1]);
      }
      let startx = Math.min.apply(null, x1Coordinate);
      let endx = Math.max.apply(null, x1Coordinate);
      let starty = Math.min.apply(null, y1Coordinate);
      let endy = Math.max.apply(null, y1Coordinate);
      let textshapewidth = (endx - startx);
      let textshapeheight = (endy - starty);
      getData.annotation_data = staticValue;


      // newcreatedElement.setAttribute("id", getData.annotation_id);
      let newOne = textWidth;

      newcreatedElement.setAttribute("width", "60");
      newcreatedElement.setAttribute("height", "50");
      var textShapexyWidth = (newOne - textshapewidth) / 2;
      var textShapexyHeight = (50 - textshapeheight) / 2;
      textShapexyWidth = textShapexyWidth - 5;

      newcreatedElement.style.top = 0 + "px";
      newcreatedElement.style.left = 0 + "px";
      newcreatedElement.style.marginLeft = - (newOne / 2) + "px";
      newcreatedElement.style.marginTop = -(50 / 2) + "px";
      if (getData.annotation_label != "") {
        let labelElement = document.createElement("p");
        // pdfImg.appendChild(labelElement);
        labelElement.setAttribute("annotationLabel", "1");
        labelElement.setAttribute("id", "label" + getData.annotation_id);
        labelElement.style.color = this.checkStrokeColor1(getData.stroke_color);
        let fontSizeget = getText[1].length > 15 ? 6 : getText[1].length <= 6 ? 8 : 6;
        labelElement.style.fontSize = fontSizeget + 'px';
        labelElement.style.fontWeight = "500";
        labelElement.style.position = "absolute";
        labelElement.style.top = 20 + "px";
        labelElement.style.left = 10 + "px";
        labelElement.innerHTML = getData.annotation_label;
        labelElement.style.lineHeight = "1";
        labelElement.style.textAlign = "center";
        labelElement.style.pointerEvents = "none";
        labelElement.style.zIndex = "9";
        var numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;

        if (numberOfLineBreaks != 0) {
          labelElement.style.whiteSpace = "pre-wrap";
        }

        let measurement = (labelElement.clientHeight);
        let measurement1 = (labelElement.clientWidth);

        // labelElement.style.marginLeft = -(measurement1 / 2) + 3 + "px";
        // labelElement.style.marginTop = -(measurement / 2) + "px";
        labelElement.style.wordBreak = "break-word";
        if (getData.initial_rotation != undefined && getData.initial_rotation != 0) {
          let dx = getData.initial_rotation > 0 ? (labelElement.clientWidth / 2) : (-15);
          let dy = getData.initial_rotation > 0 ? (-15) : labelElement.clientHeight / 2;
          labelElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';

          // 
          // this.canvasElement.restore();
        }
      }
    }
    else {

      var getStringWidth = this.getCanvaswidthandHeight(getData);
      // newcreatedElement.setAttribute("id", getData.annotation_id);
      newcreatedElement.setAttribute("width", getWidth);
      newcreatedElement.setAttribute("height", getHeight);
      if (Number(getData.initial_height) != 0 && Number(getData.initial_width) != 0) {
        newcreatedElement.style.top = 0 + 'px';
        newcreatedElement.style.left = 0 + 'px';
      }
      else {
        newcreatedElement.style.top = 0 + 'px';
        newcreatedElement.style.left = 0 + 'px';
      }
    }
    // newcreatedElement.addEventListener("contextmenu", (e: any) => {
    //   this.canvasRightClick(e);
    // });
    // if(getData.annotation_label.trim()!=""){
    //   this.shapeService1.mainDrawingLabel(getData,pdfImg,newcreatedElement.style.top,newcreatedElement.style.left);
    // }
    if (getData.annotation_label != "" && elementId != 11) {
      this.annotationLabelBackground(getData, id, labelid);
    }
    pdfImg.appendChild(newcreatedElement);
    this.canvasElement = newcreatedElement.getContext("2d");

    this.canvasElement.beginPath();
    // this.canvasBlurryRemove(newcreatedElement,this.canvasElement);
    this.canvasElement.globalAlpha = getData.opacity;
    if (elementId >= 1 && elementId <= 10 && (Number(getData.initial_width) < 35) && (Number(getData.initial_height) < 35) &&
      (Number(getData.initial_width) != 0) && (Number(getData.initial_height) != 0)) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width) - 5;
      let currentDBgetH = Number(getData.initial_height) - 5;
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    if (elementId >= 12 && elementId <= 18 && Number(getData.initial_width) != 0 && Number(getData.initial_height) != 0) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width);
      let currentDBgetH = Number(getData.initial_height);
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if ((elementId == 19) && getData.annotation_data.includes('move')) {

      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width) + 17.5;
      let currentDBgetH = Number(getData.initial_height) + 17.5;
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if (elementId == 20 && getData.annotation_data.includes('move')) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width);
      let currentDBgetH = Number(getData.initial_height);
      let actualratio = (actualCanvasWH.width + 35) / (actualCanvasWH.height + 35);
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if (elementId < 11 && Number(getData.initial_height) != 0 && Number(getData.initial_position_x) != 0) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetWJSON = Number(getData.initial_width);
      let currentDBgetHJSON = Number(getData.initial_height);
      let currentDBgetW = currentDBgetWJSON;
      let currentDBgetH = currentDBgetHJSON;
      if (currentDBgetWJSON != currentDBgetHJSON) {
        if (currentDBgetWJSON < currentDBgetHJSON) {
          currentDBgetW = currentDBgetWJSON;
          currentDBgetH = currentDBgetWJSON;
        }
        else {
          currentDBgetW = currentDBgetHJSON;
          currentDBgetH = currentDBgetHJSON;
        }
      }
      let actualratio = (actualCanvasWH.width) / (actualCanvasWH.height);
      //Jose modified this for resize
      // let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      let fixedratio = Number(currentDBgetWJSON) / Number(currentDBgetHJSON);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / (actualCanvasWH.width);
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / (actualCanvasWH.height);
      }
      scaleFactor1 = scaleFactor1 == 1 ? 0.8 : scaleFactor1;
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }

    // To Repoint the drawn shape inside the canvas center.
    // --------------

    if (getStringWidth != undefined && getData.initial_height == 0) {
      let translateWidth = getStringWidth.width - newcreatedElement.width;
      let translateHeight = getStringWidth.height - newcreatedElement.height;
      let translateX = (translateWidth / 2) + getStringWidth.left;
      let translateY = (translateHeight / 2) + getStringWidth.top;
      this.canvasElement.translate(-translateX, -translateY);
      this.canvasElement.restore();
    }
    else if (getStringWidth != undefined && elementId < 12) {
      //Jose Added for resize fixed shapes
      let translateWidth = getStringWidth.width - newcreatedElement.width;
      let translateHeight = getStringWidth.height - newcreatedElement.height;
      let translateX = (translateWidth / 2) + getStringWidth.left;
      let translateY = (translateHeight / 2) + getStringWidth.top;
      if (getStringWidth.left < 0 || getStringWidth.top < 0) {
        translateX = getStringWidth.left < 0 ? getStringWidth.left : getStringWidth.top;
        translateX = translateX < 0 ? translateX : (translateWidth / 2) + getStringWidth.left;
        translateY = translateX < 0 ? translateX : (translateHeight / 2) + getStringWidth.top;
        // translateY = getStringWidth.top < 0 ? getStringWidth.top : (translateHeight/2);
        this.canvasElement.translate(-translateX, -translateY);
      }
      else if (getStringWidth.width < 40 && getStringWidth.height < 40) {
        translateX = translateWidth / 2;
        translateY = translateHeight / 2;
        if (translateX > 0 && translateY > 0) {
          this.canvasElement.translate(translateX, translateY);
        } else {
          // this.canvasElement.translate(-translateX,-translateY);
        }
      }
      //  else if(elementId < 11 && (this.canvasElement.canvas.width - this.canvasElement.canvas.height) > 100){
      //   this.canvasElement.translate(-((getStringWidth.left-(getStringWidth.width/2))/2), -getStringWidth.top);
      // } else if(elementId < 11 && (this.canvasElement.canvas.height - this.canvasElement.canvas.width) > 100){
      //   this.canvasElement.translate(-getStringWidth.left, -((getStringWidth.top-(getStringWidth.height/2))/2));
      // }
      else {
        this.canvasElement.translate(-translateX, -translateY);
      }
      this.canvasElement.restore();
    }
    //add top else if condition using sidebar header and longpress popup header shape cutting issue solution
    // if (elementId>=12&&getData.initial_position_x != 0&&getData.initial_position_y != 0) {
    //   let getDrawWidthandHeight = this.shapeService1.getCanvaswidthandHeight(getData); 
    //   let translateWidth = getDrawWidthandHeight.width - newcreatedElement.width;
    //   let translateHeight = getDrawWidthandHeight.height - newcreatedElement.height;
    //   let translateX = (translateWidth / 2) + getDrawWidthandHeight.left;
    //   let translateY = (translateHeight / 2) + getStringWidth.top;
    //   this.canvasElement.translate(-translateX, -translateY);
    //   this.canvasElement.restore();
    // }
    // ---------------

    //Rotate shape drawing setup start
    if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && elementId < 12) {
      let dx = getData.initial_rotation > 0 ? (getWidth / 2) : (-15);
      let dy = getData.initial_rotation > 0 ? (-15) : getHeight / 2;
      newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';

      // 
      // this.canvasElement.restore();
    }
    //Rotate shape drawing setup end

    // newcreatedElement = this.shapeService1.createHIDPIcanvs(getWidth,getHeight,7,newcreatedElement);
    // let ratio = 2;
    // newcreatedElement.width = newcreatedElement.clientWidth * ratio;
    // newcreatedElement.height = newcreatedElement.clientHeight * ratio;
    // this.canvasElement.scale(ratio,ratio);
    // this.canvasElement.imageSmoothingQuality = "high";
    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");

    var previous = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var a = 0;
    var last_mousex = this.coordinateX;
    var last_mousey = this.coordinateY;
    var mousex = 0;
    var mousey = 0;
    var cpx = 0;
    var cpy = 0;
    let cp1x = 0;
    let cp1y = 0;
    let cp2x = 0;
    let cp2y = 0;
    let cx = 0;
    let cy = 0;
    for (var i = 0; i < spaceSplit.length; i++) {
      var splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        if (hypenSplit.length > 2) {
          let localString1 = hypenSplit[1] + '-' + hypenSplit[2];
          hypenSplit = [hypenSplit[0], localString1];
        }
        if (hypenSplit != '') {
          var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
          colonSplit[0] = this.scientificToDecimal(Number(colonSplit[0]));
          colonSplit[1] = this.scientificToDecimal(Number(colonSplit[1]));
        }
        // var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "curveEnd" &&
          hypenSplit[0] != "controlpoint" &&
          hypenSplit[0] != "drawRect" &&
          hypenSplit[0] != "controlpoint1" &&
          hypenSplit[0] != "controlpoint2" &&
          hypenSplit[0] != "endCurve"
        ) {
          //Ellipse negative value is coming convert positive from ipad
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);
          //
          switch (hypenSplit[0]) {
            case "move":
              if (
                getData.toolbar_element_id >= 12 && (Number(getData.initial_position_y) != 0 && Number(getData.initial_height) == 0) &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10 + ((Number(getData.line_width) / 2) / 2),
                  y - this.coordinateY + 10 + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true
              ) {
                //Freehand shapes except ellipse and rectangle
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10 + (Number(getData.line_width) / 2),
                  y - this.coordinateY + 10 + (Number(getData.line_width) / 2)
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
                this.canvasElement.moveTo(
                  x + ((Number(getData.line_width) / 2) / 2),
                  y + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if ((getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) && (Number(getData.initial_position_y) != 0)) {
                //Line and line axial shape
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10 + ((Number(getData.line_width) / 2) / 2),
                  y - this.coordinateY + 10 + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) {
                //Line and line axial shape
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10 + (Number(getData.line_width) / 2),
                  y - this.coordinateY + 10 + (Number(getData.line_width) / 2)
                );
              }
              else {
                //Simple shapes initial
                if (elementId == 11) {

                  this.canvasElement.moveTo(x + textShapexyWidth, y + textShapexyHeight);
                }
                else {
                  this.canvasElement.moveTo(x, y);
                }
              }
              if (elementId == 13 && j == 1) {
                previous.x = x - this.coordinateX + 10;
                previous.y = y - this.coordinateY + 10;
                a++;
              }
              break;
            case "line":
              this.canvasElement.clearRect(
                0,
                0,
                newcreatedElement.width,
                newcreatedElement.height
              );
              if (
                getData.toolbar_element_id >= 12 && (Number(getData.initial_position_y) != 0 && Number(getData.initial_height) == 0) &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10 + ((Number(getData.line_width) / 2) / 2),
                  y - this.coordinateY + 10 + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true
              ) {
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10 + (Number(getData.line_width) / 2),
                  y - this.coordinateY + 10 + (Number(getData.line_width) / 2)
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
                this.canvasElement.lineTo(
                  x + ((Number(getData.line_width) / 2) / 2),
                  y + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if ((getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) && (Number(getData.initial_position_y) != 0)) {
                //Line and line axial shape
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10 + ((Number(getData.line_width) / 2) / 2),
                  y - this.coordinateY + 10 + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) {
                //Line and line axial shape
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10 + (Number(getData.line_width) / 2),
                  y - this.coordinateY + 10 + (Number(getData.line_width) / 2)
                );
              }
              else {
                if (elementId == 11) {

                  this.canvasElement.lineTo(x + textShapexyWidth, y + textShapexyHeight);
                }
                else {
                  this.canvasElement.lineTo(x, y);
                }
              }
              break;
            case "ovalIn":
              if (elementId == 1 || elementId == 8) {
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.arc(
                  newcreatedElement.clientWidth / 2,
                  newcreatedElement.clientHeight / 2.3, r, 0, 2 * Math.PI
                );
              } else if (elementId == 19) {
                w = w < 0 ? -(w) : w;
                h = h < 0 ? -(h) : h;
                w = w;
                h = h;

                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.ellipse((w / 2) + 2 + ((Number(getData.line_width) / 2) / 2), (h / 2) + 2 + ((Number(getData.line_width) / 2) / 2), w / 2, h / 2, Math.PI * 1, 0, 2 * Math.PI);
              }
              break;
          }
        }
        else if ((hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") && j == 1) {
          if (hypenSplit[0] == "controlpoint") {
            cpx = parseFloat(colonSplit[0]);
            cpy = parseFloat(colonSplit[1]);
          }
          if (hypenSplit[0] == "curveEnd") {
            var ex = parseFloat(colonSplit[0]);
            var ey = parseFloat(colonSplit[1]);
            if (elementId == 11) {

              this.canvasElement.quadraticCurveTo(cpx + textShapexyWidth, cpy + textShapexyHeight, ex + textShapexyWidth, ey + textShapexyHeight);
            }
            else {
              this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
            }
          }
        }
        else if ((hypenSplit[0] == "controlpoint1" || hypenSplit[0] == "controlpoint2" || hypenSplit[0] == "endCurve") && j == 1) {
          if (hypenSplit[0] == "controlpoint1") {
            cp1x = parseFloat(colonSplit[0]);
            cp1y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "controlpoint2") {
            cp2x = parseFloat(colonSplit[0]);
            cp2y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "endCurve") {
            cx = parseFloat(colonSplit[0]);
            cy = parseFloat(colonSplit[1]);
            this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
            if (getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 && getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
              this.canvasElement.bezierCurveTo(cp1x + ((Number(getData.line_width) / 2) / 2), cp1y + ((Number(getData.line_width) / 2) / 2), cp2x + ((Number(getData.line_width) / 2) / 2), cp2y + ((Number(getData.line_width) / 2) / 2), cx + ((Number(getData.line_width) / 2) / 2), cy + ((Number(getData.line_width) / 2) / 2));
            }
            else {
              this.canvasElement.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
            }
          }
        }
        else if (hypenSplit[0] == "drawRect" && j == 1) {
          // let colonSplit = hypenSplit[j].split(":");
          colonSplit[0] = Number(colonSplit[0]);
          colonSplit[1] = Number(colonSplit[1]);
          colonSplit[2] = Number(colonSplit[2]);
          colonSplit[3] = Number(colonSplit[3]);
          colonSplit[2] = colonSplit[2] < 0 ? -(colonSplit[2]) : colonSplit[2];
          colonSplit[3] = colonSplit[3] < 0 ? -(colonSplit[3]) : colonSplit[3];
          let rectX = parseFloat(colonSplit[0]);
          let rectY = parseFloat(colonSplit[1]);
          let rectWidth = parseFloat(colonSplit[2]);
          let rectHeight = parseFloat(colonSplit[3]);

          this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
          let rectlineWidth = this.globalLineWidth(getData.line_width);
          // newcreatedElement.setAttribute('width',(newcreatedElement.width + rectlineWidth).toString());
          // newcreatedElement.setAttribute('height',(newcreatedElement.height + rectlineWidth).toString());
          // newcreatedElement.style.top = this.coordinateY - (rectlineWidth/2) + 'px';
          // newcreatedElement.style.left = this.coordinateX - (rectlineWidth/2) + 'px';
          this.canvasElement.rect(
            ((Number(getData.line_width) / 2) / 2) + 1,
            ((Number(getData.line_width) / 2) / 2) + 1,
            rectWidth,
            rectHeight);
        }
      }
    }
    if (
      elementId != 12 &&
      elementId != 14 &&
      elementId != 13 &&
      elementId != 15
    ) {
      var checkFill = getData.fill_color;
      this.canvasElement.fillStyle = this.checkStrokeColor1(checkFill);
      this.canvasElement.fill();
    }
    if (elementId == 17 || elementId == 18 || elementId == 1) {
      this.canvasElement.closePath();
    }
    if (elementId == 11) {
      // newcreatedElement.appendChild(labelElement);
      // labelElement.style.top = '0px';
      // labelElement.style.left = '0px';
      this.canvasElement.font = 'bold ' + 8 + 'px Calibri';
      this.canvasElement.textAlign = 'left';
      this.canvasElement.textBaseline = 'top';
      this.canvasElement.fillStyle = this.checkStrokeColor1(getData.stroke_color);
      let getStringSplit = getData.annotation_data.split(' ');
      let secondLineget = getStringSplit[1].split('-');
      let colonsplitsecond = secondLineget[1].split(':');
      let ypositionCalc = 17;
      let xpositionCalc = 10;
      // this.canvasElement.fillText(getData.annotation_label, xpositionCalc + 3, ypositionCalc);
      var words = getData.annotation_label.split('\n');

      var line = '';
      let maxWidth = 50;
      let lineHeight = 8;
      console.log(words);
      for (var n = 0; n < words.length; n++) {
        this.canvasElement.fillText(words[n] + '', xpositionCalc + 4, ypositionCalc);
        ypositionCalc += lineHeight;
      }
      // for (var n = 0; n < words.length; n++) {

      //   var testLine = line + words[n] + ' ';
      //   var metrics = this.canvasElement.measureText(testLine);
      //   var testWidth = metrics.width;
      //   if (testWidth > maxWidth && n > 0) {
      //     this.canvasElement.fillText(line, xpositionCalc + 4, ypositionCalc);
      //     line = words[n] + ' ';
      //     ypositionCalc += lineHeight;
      //   }
      //   else {
      //     line = testLine;
      //   }
      // }
      // this.canvasElement.fillText(line, xpositionCalc + 4, ypositionCalc);
    }
    // if(elementId==11){
    //   this.canvasElement.font = "20px Georgia";
    //   this.canvasElement.fillText(getText[1],0,0);
    // }
    // this.canvasElement.drawImage(newcreatedElement,0,0,50,50,0,0,10,50);
    // latest
    // if (getData.line_width / 5 < 1) {
    //   this.canvasElement.lineWidth = 1;
    // }
    // else {
    //   this.canvasElement.lineWidth = this.globalLineWidth(getData.line_width);
    // }
    // if ((elementId == 15 || elementId == 16 || elementId == 12 || elementId == 13 || elementId == 14) && getData.line_width != 0) {
    //   this.canvasElement.lineWidth = this.globalLineWidth(getData.line_width) + 1;
    // }
    if (elementId <= 11) {
      this.canvasElement.lineWidth = Number(getData.line_width) / (6);
    }
    else if (elementId > 11) {
      this.canvasElement.lineWidth = Number(getData.line_width) / (2);
    }
    this.canvasElement.strokeStyle = this.checkStrokeColor1(getData.stroke_color);
    this.canvasElement.stroke();
    newcreatedElement.style.overflow = "visible";
    newcreatedElement.style.display = "block";
  }

  getshapeDrawingToolbar(getData123, isnegativeCoordinates, id, labelid, source) {
    let getDataClone = _.cloneDeep(getData123);
    let fullData;
    let getData;
    var elementId;
    let getnewwidth;
    let getnewheight;
    if (source == 'DocPage') {
      fullData = getDataClone;
      getData = getDataClone.shape;
      elementId = getData.element_id;
      getnewheight = 35;
      getnewwidth = 35;
      var getDrawWidthandHeightTemp = this.getCanvaswidthandHeight(getData);
    }
    else {
      fullData = getDataClone;
      getData = getDataClone.shape;
      elementId = getData.element_id;
      getnewheight = 50;
      getnewwidth = 50;
      var getDrawWidthandHeightTemp = this.getCanvaswidthandHeightP2P3(getData);
    }
    getData.initial_position_x = 0;
    getData.initial_position_y = 0;
    this.coordinateX = getDrawWidthandHeightTemp.left - ((Number(fullData.line_width) / 2) / 2);
    this.coordinateY = getDrawWidthandHeightTemp.top - ((Number(fullData.line_width) / 2) / 2);

    var pdfImg = document.getElementById(id);

    if (pdfImg != null && pdfImg.firstChild != null) {
      // pdfImg.removeChild(pdfImg.firstChild);
      var child = pdfImg.lastElementChild;
      while (child) {
        pdfImg.removeChild(child);
        child = pdfImg.lastElementChild;
      }
    }
    if (pdfImg != null) {

      let getannotationLabelElement = pdfImg.querySelectorAll("p");
      if (getannotationLabelElement.length > 0) {
        for (var al = 0; al < getannotationLabelElement.length; al++) {
          if (getannotationLabelElement[al].getAttribute(labelid) != null) {
            getannotationLabelElement[al].remove();
          }
        }
      }
    }
    // let getannotationLabelElement = document.querySelectorAll("p");
    // if (getannotationLabelElement.length > 0) {
    //   for (var al = 0; al < getannotationLabelElement.length; al++) {
    //     if (getannotationLabelElement[al].getAttribute(labelid) != null) {
    //       getannotationLabelElement[al].remove();
    //     }
    //   }
    // }
    if (source == 'DocPage') {
      var newcreatedElement: any = document.getElementById(id);
      if (newcreatedElement == null) {
        return;
      }
    }
    else {
      var newcreatedElement: any = document.createElement("canvas");
      // newcreatedElement.style.background="green";
      newcreatedElement.setAttribute("id", 'canvas' + id);
    }
    if (elementId != 11) {
      newcreatedElement.style.top = 0 + "px";
      newcreatedElement.style.left = 0 + "px";
      newcreatedElement.setAttribute("width", getnewwidth);
      newcreatedElement.setAttribute("height", getnewheight);
    }
    else if (elementId == 11) {
      let staticValue = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-60:0 controlpoint-65:0 curveEnd-65:5 line-65:15 controlpoint-65:20 curveEnd-60:20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10"
      var getText = getData.annotation_data.split('text-');
      var textvalidate = getText[1] != undefined ? getText[1] : '';
      if (getText.length > 1 && typeof getText[1] != undefined) {
        if (getData.annotation_label.trim() != '') {
          let textvalue = getData.annotation_label.trim();
          getText.push(textvalue);
        }
        else {
          let textvalue = "     ";
          getText.push(textvalue);
        }
      }
      textvalidate = textvalidate.replaceAll("`~", " ");
      textvalidate = textvalidate.replaceAll("~`", "-");
      textvalidate = textvalidate.replaceAll("~~~", ":");
      let canvas12 = document.createElement("canvas");
      canvas12.style.width = "200px";
      let textCount = 20;
      let context = canvas12.getContext("2d");
      context.font = "17px times new roman";
      context.fillText(textvalidate, 0, 0);
      let widthget = context.measureText(textvalidate).width;
      if (textvalidate.length < 5) {
        textCount = 27;
      }
      else if (textvalidate.length > 12) {
        textCount = 5;
      }
      let formattedWidth = Math.ceil(widthget);
      formattedWidth = formattedWidth + textCount;
      canvas12.innerHTML = textvalidate;
      canvas12.style.fontWeight = "500";
      canvas12.style.fontSize = "17px";
      var textWidth = formattedWidth;
      let currentAnnotationData = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10 text-" + getText[1] + ""
      let widththerom = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10";
      let x1Coordinate = [];
      let y1Coordinate = [];
      widththerom = widththerom.trim();
      let splitData123 = widththerom.split(" ");
      for (var im = 0; im < splitData123.length - 1; im++) {
        // var splitString = splitData123[im].replaceAll('--', '-n');
        // splitString = splitString.replaceAll(':-', ':n');
        // var hypenSplit = splitString.split("-");
        // for (var j = 0; j < hypenSplit.length; j++) {
        //   var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");

        let hypenSplit = splitData123[im].split("-");
        let colonSplit = hypenSplit[1].split(":");
        x1Coordinate.push(colonSplit[0]);
        y1Coordinate.push(colonSplit[1]);
      }
      let startx = Math.min.apply(null, x1Coordinate);
      let endx = Math.max.apply(null, x1Coordinate);
      let starty = Math.min.apply(null, y1Coordinate);
      let endy = Math.max.apply(null, y1Coordinate);
      let textshapewidth = (endx - startx);
      let textshapeheight = (endy - starty);
      // two line purpose of initlial text shape not showing 
      // let changeannotationdata = this.changeShapeForWidthAndHeight(staticValue,45,50,11);
      //this line commented by P2 shape is not working fine this usage
      // getData.annotation_data = staticValue;
      // newcreatedElement.setAttribute("id", getData.annotation_id);
      // two line purpose of initlial text shape not showing 
      let newOne = textWidth;
      newcreatedElement.setAttribute("width", "60");
      newcreatedElement.setAttribute("height", "50");
      var textShapexyWidth = (newOne - textshapewidth) / 2;
      var textShapexyHeight = (50 - textshapeheight) / 2;
      textShapexyWidth = textShapexyWidth - 5;

      newcreatedElement.style.top = 0 + "px";
      newcreatedElement.style.left = 0 + "px";
      // newcreatedElement.style.marginLeft = - (newOne / 2) + "px";
      // newcreatedElement.style.marginTop = -(50 / 2) + "px";

    }

    if (getData.annotation_label != undefined && getData.annotation_label != "" && elementId != 11) {
      this.annotationLabelBackground(getData, id, labelid);
    }
    if (source != 'DocPage') {
      pdfImg.appendChild(newcreatedElement);
    }
    this.canvasElement = newcreatedElement.getContext("2d");

    this.canvasElement.beginPath();
    // this.canvasBlurryRemove(newcreatedElement,this.canvasElement);

    //Rotate shape drawing setup start
    if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && elementId < 12) {
      let dx = getData.initial_rotation > 0 ? (getnewwidth / 2) : (-15);
      let dy = getData.initial_rotation > 0 ? (-15) : getnewheight / 2;
      newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')' + ' scale(0.7)';

      // 
      // this.canvasElement.restore();
    }


    //Rotate shape drawing setup end
    // if (getData.is_stamp != 4) {

    let actualCanvasWH = this.getCanvaswidthandHeight(getData);
    let reduces = 1;
    if (elementId < 12) {
      reduces = (Number(fullData.line_width) / 10);
      reduces = reduces < 1 ? 1 : reduces;
    }
    else {
      reduces = (Number(fullData.line_width) / 2);
      reduces = reduces < 1 ? 1 : reduces;
    }
    actualCanvasWH.width = actualCanvasWH.width + (reduces * 2);
    actualCanvasWH.height = actualCanvasWH.height + (reduces * 2);
    let translateWidth = actualCanvasWH.width - newcreatedElement.width;
    let translateHeight = actualCanvasWH.height - newcreatedElement.height;
    translateWidth = translateWidth < 0 ? -(translateWidth) : translateWidth;
    translateHeight = translateHeight < 0 ? -(translateHeight) : translateHeight;
    let leftNegative = getDrawWidthandHeightTemp.left < 0 ? 0 : getDrawWidthandHeightTemp.left;
    let topNegative = getDrawWidthandHeightTemp.top < 0 ? 0 : getDrawWidthandHeightTemp.top;
    let translateX = (translateWidth / 2);
    let translateY = (translateHeight / 2);
    if (getData.is_stamp == 4 && elementId == 11) {
      getDrawWidthandHeightTemp.left = 0;
      getDrawWidthandHeightTemp.top = 0;
    }

    if (elementId == 11) {
      this.canvasElement.translate(-getDrawWidthandHeightTemp.left, -getDrawWidthandHeightTemp.top + reduces);
      // this line commented reason for bottom cutting text shape in (P2 shapes )
      // this.canvasElement.translate(-getDrawWidthandHeightTemp.left, -getDrawWidthandHeightTemp.top+5);
    }
    else {
      this.canvasElement.translate(-getDrawWidthandHeightTemp.left + reduces, -getDrawWidthandHeightTemp.top + reduces);
    }
    // scale value add start
    let currentDBgetW = newcreatedElement.width;
    let currentDBgetH = newcreatedElement.height;
    let scaleFactor1 = 1;
    let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
    let actualratio = actualCanvasWH.width / actualCanvasWH.height;
    if (actualratio > fixedratio) {
      scaleFactor1 = Number(currentDBgetW) / (actualCanvasWH.width);
    }
    else {
      scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
    }
    this.canvasElement.scale(scaleFactor1, scaleFactor1);
    // scale value add end

    // else{
    //   let translateWidth = actualCanvasWH.width - newcreatedElement.width;
    //   let translateHeight = actualCanvasWH.height - newcreatedElement.height;
    //   let translateX = (translateWidth / 2);
    //   let translateY = (translateHeight / 2);
    //   this.canvasElement.translate(translateX, translateY);  
    // }
    // }
    // else {

    //   let actualCanvasWH = this.getCanvaswidthandHeight(getData);
    //   if (elementId < 12) {
    //     var currentDBgetW = getnewwidth - ((Number(fullData.line_width) / 6) * 2);
    //     var currentDBgetH = getnewheight - ((Number(fullData.line_width) / 6) * 2);
    //   }
    //   else {
    //     var currentDBgetW = getnewwidth - (Number(fullData.line_width) / 2);
    //     var currentDBgetH = getnewheight - (Number(fullData.line_width) / 2);
    //   }
    //   var fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
    //   var scaleFactor1 = 0;
    //   if (source == "DocPage") {
    //     currentDBgetW = (currentDBgetW / 2);
    //     currentDBgetH = (currentDBgetH / 2);
    //     fixedratio = Number(currentDBgetW - 2) / Number(currentDBgetH - 2);
    //     let actualratio = actualCanvasWH.width / actualCanvasWH.height;
    //     if (actualratio > fixedratio) {
    //       scaleFactor1 = Number(currentDBgetW - 2) / (actualCanvasWH.width);
    //     }
    //     else {
    //       scaleFactor1 = Number(currentDBgetH - 2) / actualCanvasWH.height;
    //     }
    //   }
    //   else {
    //     var reduces = Number(fullData.line_width) / 10;
    //     if(reduces<2){
    //       reduces = 1;
    //     }
    //     actualCanvasWH.width = actualCanvasWH.width + reduces;
    //     actualCanvasWH.height = actualCanvasWH.height + reduces;
    //     fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
    //     let actualratio = actualCanvasWH.width / actualCanvasWH.height;
    //     if (actualratio > fixedratio) {
    //       scaleFactor1 = Number(currentDBgetW) / (actualCanvasWH.width);
    //     }
    //     else {
    //       scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
    //     }
    //   }

    //   if (getDrawWidthandHeightTemp != undefined && (getData.initial_height == 0 || getData.initial_height == undefined)) {
    //     if (source == "DocPage") {
    //       newcreatedElement.setAttribute("width", (currentDBgetW));
    //       newcreatedElement.setAttribute("height", (currentDBgetH));
    //       this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    //       this.canvasElement.translate(1, 1);
    //       this.canvasElement.restore();
    //     }
    //     else {
    //       newcreatedElement.setAttribute("width", (getnewwidth));
    //       newcreatedElement.setAttribute("height", (getnewheight));
    //       this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    //       if (getDrawWidthandHeightTemp != undefined) {
    //         let translateWidth = getDrawWidthandHeightTemp.width - newcreatedElement.width;
    //         let translateHeight = getDrawWidthandHeightTemp.height - newcreatedElement.height;
    //         let leftNegative = getDrawWidthandHeightTemp.left<0 ? 0 : getDrawWidthandHeightTemp.left;
    //         let topNegative = getDrawWidthandHeightTemp.top<0 ? 0 : getDrawWidthandHeightTemp.top;
    //         let translateX = (translateWidth / 2) + leftNegative;
    //         let translateY = (translateHeight / 2) + topNegative;
    //         if(elementId==11){
    //           console.log(translateWidth * scaleFactor1 ,translateHeight * scaleFactor1,
    //           newcreatedElement.width,newcreatedElement.height);
    //         }
    //         // console.log(translateX,translateY);
    //         // this.canvasElement.translate(translateX, translateY);
    //         // this.canvasElement.restore();
    //         // if (getData.is_stamp == 4 && elementId == 11) {
    //         //   getDrawWidthandHeightTemp.left = 0;
    //         //   getDrawWidthandHeightTemp.top = 0;
    //         //   
    //         // }

    //         if(elementId==11){
    //           this.canvasElement.translate(-getDrawWidthandHeightTemp.left, -getDrawWidthandHeightTemp.top+reduces);
    //           // this line commented reason for bottom cutting text shape in (P2 shapes )
    //           // this.canvasElement.translate(-getDrawWidthandHeightTemp.left, -getDrawWidthandHeightTemp.top+5);
    //         }
    //         else{
    //           this.canvasElement.translate(-getDrawWidthandHeightTemp.left, -getDrawWidthandHeightTemp.top);
    //         }

    //         this.canvasElement.restore();
    //         // this.canvasElement.scale(scaleFactor1,scaleFactor1);
    //       }
    //     }
    //   }
    // }

    this.canvasElement.imageSmoothingQuality = "high";
    // newcreatedElement = this.createHIDPIcanvs(newcreatedElement.width, newcreatedElement.height, 72, newcreatedElement);
    this.canvasElement.globalAlpha = fullData.opacity;
    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");
    var previous = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var a = 0;
    var text_x_position = 10;
    var cpx = 0;
    var cpy = 0;
    let cp1x = 0;
    let cp1y = 0;
    let cp2x = 0;
    let cp2y = 0;
    let cx = 0;
    let cy = 0;
    for (var i = 0; i < spaceSplit.length; i++) {
      var splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "curveEnd" &&
          hypenSplit[0] != "controlpoint" &&
          hypenSplit[0] != "drawRect" &&
          hypenSplit[0] != "controlpoint1" &&
          hypenSplit[0] != "controlpoint2" &&
          hypenSplit[0] != "endCurve"
        ) {
          //Ellipse negative value is coming convert positive from ipad
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);

          switch (hypenSplit[0]) {
            case "move":
              if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true
              ) {
                //Freehand shapes except ellipse and rectangle
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
                this.canvasElement.moveTo(
                  x,
                  y
                );
              }
              else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) {
                //Line and line axial shape
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else {
                //Simple shapes initial
                // commented by 24.07.2021 shape not showing P3X-114 fixes
                if (elementId == 11) {
                  this.canvasElement.moveTo(x, y);
                  // let calHeight = newcreatedElement.clientHeight / 2;
                  // this.canvasElement.moveTo(x + textShapexyWidth, y + textShapexyHeight);
                }
                else {

                  this.canvasElement.moveTo(x, y);

                }
              }
              if (elementId == 13 && j == 1) {
                previous.x = x - this.coordinateX + 10;
                previous.y = y - this.coordinateY + 10;
                a++;
              }
              break;
            case "line":
              this.canvasElement.clearRect(
                0,
                0,
                newcreatedElement.width,
                newcreatedElement.height
              );
              if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true
              ) {
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
                this.canvasElement.lineTo(
                  x,
                  y
                );
              }
              else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) {
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else {
                // commented by 24.07.2021 shape not showing P3X-114 fixes
                if (elementId == 11) {
                  this.canvasElement.lineTo(x, y);
                  if (i == 1) {
                    text_x_position = x;
                  }

                  // let calHeight = newcreatedElement.clientHeight / 2;
                  // this.canvasElement.lineTo(x + textShapexyWidth, y + textShapexyHeight);
                }
                else {
                  this.canvasElement.lineTo(x, y);
                }
              }
              break;
            case "ovalIn":
              if (elementId == 1 || elementId == 8) {
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.arc(
                  newcreatedElement.clientWidth / 2,
                  newcreatedElement.clientHeight / 2.3, r, 0, 2 * Math.PI
                );
              } else if (elementId == 19) {
                w = w < 0 ? -(w) : w;
                h = h < 0 ? -(h) : h;

                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.ellipse((w / 2) + 2 + ((Number(fullData.line_width) / 2) / 2), (h / 2) + 2 + ((Number(fullData.line_width) / 2) / 2), w / 2, h / 2, Math.PI * 1, 0, 2 * Math.PI);
              }
              break;
          }
        }
        else if ((hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") && j == 1) {
          if (hypenSplit[0] == "controlpoint") {
            cpx = parseFloat(colonSplit[0]);
            cpy = parseFloat(colonSplit[1]);
          }
          if (hypenSplit[0] == "curveEnd") {
            var ex = parseFloat(colonSplit[0]);
            var ey = parseFloat(colonSplit[1]);
            if (false) {

              this.canvasElement.quadraticCurveTo(cpx + textShapexyWidth, cpy + textShapexyHeight, ex + textShapexyWidth, ey + textShapexyHeight);
            }
            else {
              this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
            }

          }
        }
        else if (hypenSplit[0] == "controlpoint1" || hypenSplit[0] == "controlpoint2" || hypenSplit[0] == "endCurve" && j == 1) {
          if (hypenSplit[0] == "controlpoint1") {
            cp1x = parseFloat(colonSplit[0]);
            cp1y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "controlpoint2") {
            cp2x = parseFloat(colonSplit[0]);
            cp2y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "endCurve") {
            cx = parseFloat(colonSplit[0]);
            cy = parseFloat(colonSplit[1]);
            this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
            this.canvasElement.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
          }
        }
        else if (hypenSplit[0] == "drawRect" && j == 1) {
          // let colonSplit = hypenSplit[j].split(":");
          colonSplit[0] = Number(colonSplit[0]);
          colonSplit[1] = Number(colonSplit[1]);
          colonSplit[2] = Number(colonSplit[2]);
          colonSplit[3] = Number(colonSplit[3]);
          colonSplit[2] = colonSplit[2] < 0 ? -(colonSplit[2]) : colonSplit[2];
          colonSplit[3] = colonSplit[3] < 0 ? -(colonSplit[3]) : colonSplit[3];
          let rectX = parseFloat(colonSplit[0]);
          let rectY = parseFloat(colonSplit[1]);
          let rectWidth = parseFloat(colonSplit[2]);
          let rectHeight = parseFloat(colonSplit[3]);

          this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
          // let rectlineWidth = this.globalLineWidth(getData.line_width);
          // newcreatedElement.setAttribute('width',(newcreatedElement.width + rectlineWidth).toString());
          // newcreatedElement.setAttribute('height',(newcreatedElement.height + rectlineWidth).toString());
          // newcreatedElement.style.top = this.coordinateY - (rectlineWidth/2) + 'px';
          // newcreatedElement.style.left = this.coordinateX - (rectlineWidth/2) + 'px';
          this.canvasElement.rect(
            ((Number(fullData.line_width) / 2) / 2) + 1,
            ((Number(fullData.line_width) / 2) / 2) + 1,
            rectWidth + 2,
            rectHeight + 2);
          // 
        }
      }
    }
    if (
      elementId != 12 &&
      elementId != 14 &&
      elementId != 13 &&
      elementId != 15 &&
      elementId != 11
    ) {
      var checkFill = getData.fill_color;
      this.canvasElement.fillStyle = this.checkStrokeColor1(checkFill);
      this.canvasElement.fill();
    }
    if (elementId == 17 || elementId == 18 || elementId == 1) {
      this.canvasElement.closePath();
    }

    // if(getData.hasOwnProperty('is_stamp')){
    //   this.canvasElement.lineWidth = Number(fullData.line_width) / (100);
    // }
    // else 
    if (elementId <= 11) {
      this.canvasElement.lineWidth = Number(fullData.line_width) / (10);
      if (elementId == 11) {

        let lineCount = Number(fullData.line_width) / (10);
        if (lineCount < 2) {
          this.canvasElement.lineWidth = 1;
        }
      }
    }
    else if (elementId > 11) {

      this.canvasElement.lineWidth = Number(fullData.line_width) / (2);
      let lineCount = Number(fullData.line_width) / (2);
      if (lineCount < 2) {
        // P2 shape blur showing fixed this line
        this.canvasElement.lineWidth = 2;
      }
    }
    this.canvasElement.strokeStyle = this.checkStrokeColor1(getData.stroke_color);
    this.canvasElement.stroke();
    newcreatedElement.style.overflow = "visible";
    newcreatedElement.style.display = "block";
    // this.canvasElement.lineCap = "square";
    // this.canvasElement.lineJoin = "miter";
    // if(elementId==11){
    //   // this.canvasElement.font = 'bold '+ 10 +'px Calibri';
    //   // this.canvasElement.textAlign = 'center';
    //   // this.canvasElement.textBaseline = 'middle';
    //   // this.canvasElement.fillStyle=this.checkStrokeColor1(getData.stroke_color);
    //   // let ypositionCalc = (newcreatedElement.height) / 2;
    //   // let xpositionCalc = (newcreatedElement.width);
    //   // this.canvasElement.fillText(getData.annotation_label,xpositionCalc, ypositionCalc);

    //     // newcreatedElement.appendChild(labelElement);
    //     // labelElement.style.top = '0px';
    //     // labelElement.style.left = '0px';
    //     this.canvasElement.font = 'bold '+ 12 +'px Calibri';
    //     this.canvasElement.textAlign = 'left';
    //     this.canvasElement.textBaseline = 'top';
    //     this.canvasElement.fillStyle=this.checkStrokeColor1(getData.stroke_color);
    //     let getStringSplit = getData.annotation_data.split(' ');
    //     let secondLineget = getStringSplit[1].split('-');
    //     let colonsplitsecond = secondLineget[1].split(':');
    //     let ypositionCalc = 4;
    //     let xpositionCalc = 20;
    //     // this.canvasElement.fillText(getData.annotation_label, xpositionCalc + 3, ypositionCalc);
    //     var words = getData.annotation_label.split('\n');

    //     var line = '';
    //     let maxWidth = 50;
    //     let lineHeight = 8;
    //     console.log(words);
    //     for (var n = 0; n < words.length; n++) {
    //       this.canvasElement.fillText(words[n] + '', xpositionCalc + 2, ypositionCalc);
    //       ypositionCalc += lineHeight;
    //     }
    // }
    if (elementId == 11 && getData.annotation_label != undefined) {
      // newcreatedElement.appendChild(labelElement);
      // labelElement.style.top = '0px';
      // labelElement.style.left = '0px';
      let numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;
      console.log(numberOfLineBreaks);
      let fontSizeBaseHeight = (20 / numberOfLineBreaks);
      if (numberOfLineBreaks > 0) {
        numberOfLineBreaks = numberOfLineBreaks + 1;

        // fontSizeBaseHeight = (shapeStringValueTemp.height / numberOfLineBreaks);
        let formattedWidth = 50 - (20 / 2);
        let label_value = getData.annotation_label.trim();
        fontSizeBaseHeight = Math.ceil(formattedWidth / label_value.length) * 2;
      }
      else {
        let formattedWidth = 30;
        let label_value = getData.annotation_label.trim();
        fontSizeBaseHeight = Math.ceil(formattedWidth / label_value.length) * 2;


      }
      this.canvasElement.font = '500 ' + fontSizeBaseHeight + 'px Roboto, "Helvetica Neue", sans-serif';
      this.canvasElement.textAlign = 'left';
      // this.canvasElement.textBaseline = 'top';
      this.canvasElement.fillStyle = this.checkStrokeColor1(getData.stroke_color);
      let getStringSplit = getData.annotation_data.split(' ');
      let secondLineget = getStringSplit[1].split('-');
      let colonsplitsecond = secondLineget[1].split(':');
      let ypositionCalc = 0;
      let xpositionCalc = text_x_position;
      if (numberOfLineBreaks > 0) {
        let ypositionCalc = (newcreatedElement.height) - (numberOfLineBreaks * 16);
        ypositionCalc = (ypositionCalc / 2) + 2;
        console.log(ypositionCalc);
        var words = getData.annotation_label.split('\n');
        var line = '';
        let lineHeight = 17;
        console.log(words);
        for (var n = 0; n < words.length; n++) {
          this.canvasElement.fillText(words[n] + '', xpositionCalc + 2, ypositionCalc);
          ypositionCalc += lineHeight;
        }
        // this.canvasElement.fillText(line, xpositionCalc + 4, ypositionCalc);
      }
      else {
        // xpositionCalc = (newcreatedElement.width) / 2;
        ypositionCalc = 10;
        this.canvasElement.fillText(getData.annotation_label, xpositionCalc, ypositionCalc);
      }

    }
    if (elementId >= 12 && elementId <= 18 && getData.initial_height != 0 && getData.initial_width != 0) {
      newcreatedElement.style.top = 0 + 'px';
      newcreatedElement.style.left = 0 + 'px';
    }


  }

  getshapeDrawingDocToolbar(getData123, isnegativeCoordinates, id, labelid, source, labelheadIdDoc?: string) {

    let getDataClone = _.cloneDeep(getData123);
    let fullData;
    let getData;
    var elementId;
    let getnewwidth;
    let getnewheight;
    if (source == 'DocPage') {
      fullData = getDataClone;
      getData = getDataClone.shape;
      elementId = getData.element_id;
      getnewheight = 35;
      getnewwidth = 35;
      var getDrawWidthandHeightTemp = this.getCanvaswidthandHeightP2P3(getData);
    }
    else {
      fullData = getDataClone;
      getData = getDataClone.shape;
      elementId = getData.element_id;
      getnewheight = 50;
      getnewwidth = 50;
      var getDrawWidthandHeightTemp = this.getCanvaswidthandHeightP2P3(getData);
    }
    getData.initial_position_x = 0;
    getData.initial_position_y = 0;
    this.coordinateX = getDrawWidthandHeightTemp.left - ((Number(fullData.line_width) / 2) / 2);
    this.coordinateY = getDrawWidthandHeightTemp.top - ((Number(fullData.line_width) / 2) / 2);

    var pdfImg = document.getElementById(id);
    if (elementId == 11) {

    }
    if (pdfImg != null && pdfImg.firstChild != null) {
      // pdfImg.removeChild(pdfImg.firstChild);
      var child = pdfImg.lastElementChild;
      while (child) {
        pdfImg.removeChild(child);
        child = pdfImg.lastElementChild;
      }
    }
    let getannotationLabelElement = document.querySelectorAll("p");
    if (getannotationLabelElement.length > 0) {
      for (var al = 0; al < getannotationLabelElement.length; al++) {
        if (getannotationLabelElement[al].getAttribute(labelid) != null) {
          getannotationLabelElement[al].remove();
        }
      }
    }
    if (source == 'DocPage') {
      var newcreatedElement: any = document.getElementById(id);
      if (newcreatedElement == null) {
        return;
      }
    }
    else {
      var newcreatedElement: any = document.createElement("canvas");
      // newcreatedElement.style.background="green";
      newcreatedElement.setAttribute("id", 'canvas' + id);
    }
    if (elementId != 11) {
      newcreatedElement.style.top = 0 + "px";
      newcreatedElement.style.left = 0 + "px";
      newcreatedElement.setAttribute("width", getnewwidth);
      newcreatedElement.setAttribute("height", getnewheight);
    }
    else if (elementId == 11) {
      let staticValue = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-60:0 controlpoint-65:0 curveEnd-65:5 line-65:15 controlpoint-65:20 curveEnd-60:20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10"
      var getText = getData.annotation_data.split('text-');
      console.log(typeof getText[1] != undefined);
      if (typeof getText[1] != undefined) {
        if (getData.annotation_label != undefined && getData.annotation_label.trim() != '') {
          let textvalue = getData.annotation_label.trim();
          getText.push(textvalue);
        }
        else {
          let textvalue = "     ";
          getText.push(textvalue);
        }
      }
      getText[1] = getText[1].replaceAll("`~", "");
      getText[1] = getText[1].replaceAll("~`", "-");
      getText[1] = getText[1].replaceAll("~~~", ":");
      let canvas12 = document.createElement("canvas");
      canvas12.style.width = "200px";
      let textCount = 20;
      let context = canvas12.getContext("2d");
      context.font = "17px times new roman";
      context.fillText(getText[1], 0, 0);
      let widthget = context.measureText(getText[1]).width;

      ;
      if (getText[1].length < 5) {
        textCount = 27;
      }
      else if (getText[1].length > 12) {
        textCount = 5;
      }
      let formattedWidth = Math.ceil(widthget);
      formattedWidth = formattedWidth + textCount;
      canvas12.innerHTML = getText[1];
      canvas12.style.fontWeight = "500";
      canvas12.style.fontSize = "17px";
      var textWidth = formattedWidth;
      let currentAnnotationData = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10 text-" + getText[1] + ""
      let widththerom = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10";
      let x1Coordinate = [];
      let y1Coordinate = [];
      widththerom = widththerom.trim();
      let splitData123 = widththerom.split(" ");
      for (var im = 0; im < splitData123.length - 1; im++) {

        let hypenSplit = splitData123[im].split("-");
        let colonSplit = hypenSplit[1].split(":");
        x1Coordinate.push(colonSplit[0]);
        y1Coordinate.push(colonSplit[1]);
      }
      let startx = Math.min.apply(null, x1Coordinate);
      let endx = Math.max.apply(null, x1Coordinate);
      let starty = Math.min.apply(null, y1Coordinate);
      let endy = Math.max.apply(null, y1Coordinate);
      let textshapewidth = (endx - startx);
      let textshapeheight = (endy - starty);
      //below line commented reason for P2 shape not showing this static value assinging mean
      // getData.annotation_data = staticValue;


      // newcreatedElement.setAttribute("id", getData.annotation_id);
      let newOne = textWidth;

      newcreatedElement.setAttribute("width", "35");
      newcreatedElement.setAttribute("height", "40");
      var textShapexyWidth = (newOne - textshapewidth) / 2;
      var textShapexyHeight = (40 - textshapeheight) / 2;
      textShapexyWidth = textShapexyWidth - 5;

      newcreatedElement.style.top = 0 + "px";
      newcreatedElement.style.left = 0 + "px";
      // newcreatedElement.style.marginLeft = - (newOne / 2) + "px";
      // newcreatedElement.style.marginTop = -(50 / 2) + "px";
      //Addtoolbar with data shape position not properly set so this code hided
      // newcreatedElement.style.marginLeft = - (newOne / 2) + "px";
      // newcreatedElement.style.marginTop = -(50 / 2) + "px";
      // latest command by 28.06.2021 reason for label value context inside added
      // if (getData.annotation_label!=undefined && getData.annotation_label != "") {
      //   let labelElement = document.createElement("p");
      //   // pdfImg.appendChild(labelElement);
      //   labelElement.setAttribute("annotationLabel", "1");
      //   labelElement.setAttribute("id", "label" + getData.annotation_id);
      //   labelElement.style.color = this.checkStrokeColor1(getData.stroke_color);
      //   let fontSizeget = getText[1].length > 15 ? 6 : getText[1].length <= 6 ? 8 : 6;
      //   labelElement.style.fontSize = fontSizeget + 'px';
      //   labelElement.style.fontWeight = "500";
      //   labelElement.style.position = "absolute";
      //   labelElement.style.top = 20 + "px";
      //   labelElement.style.left = 10 + "px";
      //   labelElement.innerHTML = getData.annotation_label;
      //   labelElement.style.lineHeight = "1";
      //   labelElement.style.textAlign = "center";
      //   labelElement.style.pointerEvents = "none";
      //   labelElement.style.zIndex = "9";
      //   var numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;

      //   if (numberOfLineBreaks != 0) {
      //     labelElement.style.whiteSpace = "pre-wrap";
      //   }

      //   let measurement = (labelElement.clientHeight);
      //   let measurement1 = (labelElement.clientWidth);

      //   // labelElement.style.marginLeft = -(measurement1 / 2) + 3 + "px";
      //   // labelElement.style.marginTop = -(measurement / 2) + "px";
      //   labelElement.style.wordBreak = "break-word";
      //   if (getData.initial_rotation != undefined && getData.initial_rotation != 0) {
      //     let dx = getData.initial_rotation > 0 ? (labelElement.clientWidth / 2) : (-15);
      //     let dy = getData.initial_rotation > 0 ? (-15) : labelElement.clientHeight / 2;
      //     labelElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')' + 'scale(0.9)';

      //     // 
      //     // this.canvasElement.restore();
      //   }
      // }
    }

    if (getData.annotation_label != undefined && getData.annotation_label != "" && elementId != 11) {
      this.annotationLabelBackground(getData, labelheadIdDoc, labelid);
    }
    if (source != 'DocPage') {
      pdfImg.appendChild(newcreatedElement);
    }
    this.canvasElement = newcreatedElement.getContext("2d");

    this.canvasElement.beginPath();
    // this.canvasBlurryRemove(newcreatedElement,this.canvasElement);

    //Rotate shape drawing setup start
    if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && elementId < 12) {
      let dx = getData.initial_rotation > 0 ? (getnewwidth / 2) : (-15);
      let dy = getData.initial_rotation > 0 ? (-15) : getnewheight / 2;
      // newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';
      if (elementId == 11) {
        newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')' + 'scale(0.9)';
      }
      else if (elementId != 11) {
        newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')' + 'scale(0.7)';
      }
      // 
      // this.canvasElement.restore();
    }
    //Rotate shape drawing setup end

    if (getData.is_stamp != 4) {
      let actualCanvasWH = this.getCanvaswidthandHeightP2P3(getData);
      if (elementId < 12) {
        var currentDBgetW = getnewwidth - ((Number(fullData.line_width) / 6) * 2);
        var currentDBgetH = getnewheight - ((Number(fullData.line_width) / 6) * 2);
      }
      else {
        var currentDBgetW = getnewwidth - (Number(fullData.line_width) / 7);
        var currentDBgetH = getnewheight - (Number(fullData.line_width) / 7);
      }
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
      // let translateWidth = actualCanvasWH.width - currentDBgetW;
      // let translateHeight = actualCanvasWH.height - currentDBgetH;
      // let leftNegative = actualCanvasWH.left < 0 ? 0 : actualCanvasWH.left;
      // let topNegative = actualCanvasWH.top < 0 ? 0 : actualCanvasWH.top;
      // let translateX = (translateWidth / 2);
      // let translateY = (translateHeight / 2);
      // console.log(translateX, translateY);
      // this.canvasElement.translate(-translateX, -translateY);
      // this.canvasElement.restore();
    }
    else {
      let actualCanvasWH = this.getCanvaswidthandHeightP2P3(getData);
      if (elementId < 12) {
        var currentDBgetW = getnewwidth - ((Number(fullData.line_width) / 6) * 2);
        var currentDBgetH = getnewheight - ((Number(fullData.line_width) / 6) * 2);
      }
      else {
        var currentDBgetW = getnewwidth - (Number(fullData.line_width) / 2);
        var currentDBgetH = getnewheight - (Number(fullData.line_width) / 2);
      }
      var fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (source == "DocPage") {
        var reduces = Number(fullData.line_width) / 10;
        if (reduces < 2) {
          reduces = 1;
        }
        actualCanvasWH.width = actualCanvasWH.width + reduces;
        actualCanvasWH.height = actualCanvasWH.height + reduces;
        currentDBgetW = (currentDBgetW / 2);
        currentDBgetH = (currentDBgetH / 2);
        fixedratio = Number(currentDBgetW - 2) / Number(currentDBgetH - 2);
        let actualratio = actualCanvasWH.width / actualCanvasWH.height;
        if (actualratio > fixedratio) {
          scaleFactor1 = Number(currentDBgetW - 2) / (actualCanvasWH.width);
        }
        else {
          scaleFactor1 = Number(currentDBgetH - 2) / actualCanvasWH.height;
        }
      }
      else {
        var reduces = Number(fullData.line_width) / 10;
        if (reduces < 2) {
          reduces = 1;
        }
        actualCanvasWH.width = actualCanvasWH.width + reduces;
        actualCanvasWH.height = actualCanvasWH.height + reduces;
        fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
        let actualratio = actualCanvasWH.width / actualCanvasWH.height;
        if (actualratio > fixedratio) {
          scaleFactor1 = Number(currentDBgetW) / (actualCanvasWH.width);
        }
        else {
          scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
        }
      }
      if (getDrawWidthandHeightTemp != undefined && (getData.initial_height == 0 || getData.initial_height == undefined)) {
        if (source == "DocPage") {

          newcreatedElement.setAttribute("width", (currentDBgetW));
          newcreatedElement.setAttribute("height", (currentDBgetH));
          this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
          if (actualCanvasWH.left < 0 && actualCanvasWH.top < 0) {
            let transatex1 = -(actualCanvasWH.left);
            let transatey1 = -(actualCanvasWH.top);
            if (elementId == 11) {

              this.canvasElement.translate(transatex1, transatey1 + reduces);
            }
            else {
              this.canvasElement.translate(transatex1, transatey1);
            }
          }
          else {
            this.canvasElement.translate(1, 1);
          }
          this.canvasElement.restore();
        }
        else {
          newcreatedElement.setAttribute("width", (getnewwidth));
          newcreatedElement.setAttribute("height", (getnewheight));
          this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
          if (getDrawWidthandHeightTemp != undefined) {
            // let translateWidth = getDrawWidthandHeightTemp.width - newcreatedElement.width;
            // let translateHeight = getDrawWidthandHeightTemp.height - newcreatedElement.height;
            // let leftNegative = getDrawWidthandHeightTemp.left<0 ? 0 : getDrawWidthandHeightTemp.left;
            // let topNegative = getDrawWidthandHeightTemp.top<0 ? 0 : getDrawWidthandHeightTemp.top;
            // let translateX = (translateWidth / 2) + leftNegative;
            // let translateY = (translateHeight / 2) + topNegative;
            // console.log(translateX,translateY);
            // this.canvasElement.translate(translateX, translateY);
            // this.canvasElement.restore();
            if (elementId == 11) {
              this.canvasElement.translate(-getDrawWidthandHeightTemp.left, -getDrawWidthandHeightTemp.top + reduces);
            }
            else {
              this.canvasElement.translate(-getDrawWidthandHeightTemp.left, -getDrawWidthandHeightTemp.top);
            }

            this.canvasElement.restore();
            // this.canvasElement.scale(scaleFactor1,scaleFactor1);
          }
        }

      }
    }

    this.canvasElement.imageSmoothingQuality = "high";
    // newcreatedElement = this.createHIDPIcanvs(newcreatedElement.width, newcreatedElement.height, 72, newcreatedElement);
    this.canvasElement.globalAlpha = fullData.opacity;
    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");

    var previous = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var a = 0;
    var last_mousex = this.coordinateX;
    var last_mousey = this.coordinateY;
    var mousex = 0;
    var mousey = 0;
    var cpx = 0;
    var cpy = 0;
    let cp1x = 0;
    let cp1y = 0;
    let cp2x = 0;
    let cp2y = 0;
    let cx = 0;
    let cy = 0;
    for (var i = 0; i < spaceSplit.length; i++) {
      var splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "curveEnd" &&
          hypenSplit[0] != "controlpoint" &&
          hypenSplit[0] != "drawRect" &&
          hypenSplit[0] != "controlpoint1" &&
          hypenSplit[0] != "controlpoint2" &&
          hypenSplit[0] != "endCurve"
        ) {
          //Ellipse negative value is coming convert positive from ipad
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);

          switch (hypenSplit[0]) {
            case "move":
              if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true
              ) {
                //Freehand shapes except ellipse and rectangle
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
                this.canvasElement.moveTo(
                  x,
                  y
                );
              }
              else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) {
                //Line and line axial shape
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else {
                //Simple shapes initial
                //elementId 11 added initial text shape purpose of toolbar preview this line works P3 shape
                // if condition false because P2 shape not showing reason. we can handle both shape showing this line works P2 shape 
                if (false) {
                  let calHeight = newcreatedElement.clientHeight / 2;
                  this.canvasElement.moveTo(x + textShapexyWidth, y + textShapexyHeight);
                }
                else {
                  this.canvasElement.moveTo(x, y);

                }
              }
              if (elementId == 13 && j == 1) {
                previous.x = x - this.coordinateX + 10;
                previous.y = y - this.coordinateY + 10;
                a++;
              }
              break;
            case "line":
              this.canvasElement.clearRect(
                0,
                0,
                newcreatedElement.width,
                newcreatedElement.height
              );
              if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true
              ) {
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
                this.canvasElement.lineTo(
                  x,
                  y
                );
              }
              else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) {
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else {
                //elementId 11 added initial text shape purpose of toolbar preview this line works P3 shape
                // if condition false because P2 shape not showing reason. we can handle both shape showing this line works P2 shape 
                if (false) {
                  let calHeight = newcreatedElement.clientHeight / 2;
                  this.canvasElement.lineTo(x + textShapexyWidth, y + textShapexyHeight);
                }
                else {
                  this.canvasElement.lineTo(x, y);
                }
              }
              break;
            case "ovalIn":
              if (elementId == 1 || elementId == 8) {
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.arc(
                  newcreatedElement.clientWidth / 2,
                  newcreatedElement.clientHeight / 2.3, r, 0, 2 * Math.PI
                );
              } else if (elementId == 19) {
                w = w < 0 ? -(w) : w;
                h = h < 0 ? -(h) : h;

                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.ellipse((w / 2) + 2 + ((Number(fullData.line_width) / 2) / 2), (h / 2) + 2 + ((Number(fullData.line_width) / 2) / 2), w / 2, h / 2, Math.PI * 1, 0, 2 * Math.PI);
              }
              break;
          }
        }
        else if ((hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") && j == 1) {
          if (hypenSplit[0] == "controlpoint") {
            cpx = parseFloat(colonSplit[0]);
            cpy = parseFloat(colonSplit[1]);
          }
          if (hypenSplit[0] == "curveEnd") {
            var ex = parseFloat(colonSplit[0]);
            var ey = parseFloat(colonSplit[1]);
            if (false) {
              this.canvasElement.quadraticCurveTo(cpx + textShapexyWidth, cpy + textShapexyHeight, ex + textShapexyWidth, ey + textShapexyHeight);
            }
            else {
              this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
            }

          }
        }
        else if (hypenSplit[0] == "controlpoint1" || hypenSplit[0] == "controlpoint2" || hypenSplit[0] == "endCurve" && j == 1) {
          if (hypenSplit[0] == "controlpoint1") {
            cp1x = parseFloat(colonSplit[0]);
            cp1y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "controlpoint2") {
            cp2x = parseFloat(colonSplit[0]);
            cp2y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "endCurve") {
            cx = parseFloat(colonSplit[0]);
            cy = parseFloat(colonSplit[1]);
            this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
            this.canvasElement.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
          }
        }
        else if (hypenSplit[0] == "drawRect" && j == 1) {
          // let colonSplit = hypenSplit[j].split(":");
          colonSplit[0] = Number(colonSplit[0]);
          colonSplit[1] = Number(colonSplit[1]);
          colonSplit[2] = Number(colonSplit[2]);
          colonSplit[3] = Number(colonSplit[3]);
          colonSplit[2] = colonSplit[2] < 0 ? -(colonSplit[2]) : colonSplit[2];
          colonSplit[3] = colonSplit[3] < 0 ? -(colonSplit[3]) : colonSplit[3];
          let rectX = parseFloat(colonSplit[0]);
          let rectY = parseFloat(colonSplit[1]);
          let rectWidth = parseFloat(colonSplit[2]);
          let rectHeight = parseFloat(colonSplit[3]);

          this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
          // let rectlineWidth = this.globalLineWidth(getData.line_width);
          // newcreatedElement.setAttribute('width',(newcreatedElement.width + rectlineWidth).toString());
          // newcreatedElement.setAttribute('height',(newcreatedElement.height + rectlineWidth).toString());
          // newcreatedElement.style.top = this.coordinateY - (rectlineWidth/2) + 'px';
          // newcreatedElement.style.left = this.coordinateX - (rectlineWidth/2) + 'px';
          this.canvasElement.rect(
            ((Number(fullData.line_width) / 2) / 2) + 1,
            ((Number(fullData.line_width) / 2) / 2) + 1,
            rectWidth + 2,
            rectHeight + 2);
          // 
        }
      }
    }
    if (
      elementId != 12 &&
      elementId != 14 &&
      elementId != 13 &&
      elementId != 15
    ) {
      var checkFill = getData.fill_color;
      this.canvasElement.fillStyle = this.checkStrokeColor1(checkFill);
      this.canvasElement.fill();
    }
    if (elementId == 17 || elementId == 18 || elementId == 1) {
      this.canvasElement.closePath();
    }
    if (elementId <= 11) {
      this.canvasElement.lineWidth = Number(fullData.line_width) / (10);
      if (elementId == 11) {

        let lineCount = Number(fullData.line_width) / (10);
        if (lineCount < 2) {
          this.canvasElement.lineWidth = 1;
        }
      }
    }
    else if (elementId >= 12) {
      this.canvasElement.lineWidth = Number(fullData.line_width) / (2);
    }
    this.canvasElement.strokeStyle = this.checkStrokeColor1(getData.stroke_color);
    this.canvasElement.stroke();
    newcreatedElement.style.overflow = "visible";
    newcreatedElement.style.display = "block";
    // this.canvasElement.lineCap = "square";
    // this.canvasElement.lineJoin = "miter";
    if (elementId == 11 && getData.annotation_label != undefined) {
      // this.canvasElement.font = 'bold '+ 10 +'px Calibri';
      // this.canvasElement.textAlign = 'center';
      // this.canvasElement.textBaseline = 'middle';
      // this.canvasElement.fillStyle=this.checkStrokeColor1(getData.stroke_color);
      // let ypositionCalc = (newcreatedElement.height) / 2;
      // let xpositionCalc = (newcreatedElement.width);
      // this.canvasElement.fillText(getData.annotation_label,xpositionCalc, ypositionCalc);

      // newcreatedElement.appendChild(labelElement);
      // labelElement.style.top = '0px';
      // labelElement.style.left = '0px';
      this.canvasElement.font = 'bold ' + 8 + 'px Calibri';
      this.canvasElement.textAlign = 'left';
      this.canvasElement.textBaseline = 'top';
      this.canvasElement.fillStyle = this.checkStrokeColor1(getData.stroke_color);
      let getStringSplit = getData.annotation_data.split(' ');
      let secondLineget = getStringSplit[1].split('-');
      let colonsplitsecond = secondLineget[1].split(':');
      let ypositionCalc = 17;
      let xpositionCalc = 10;
      // this.canvasElement.fillText(getData.annotation_label, xpositionCalc + 3, ypositionCalc);
      var words = getData.annotation_label.split('\n');

      var line = '';
      let maxWidth = 50;
      let lineHeight = 8;
      console.log(words);
      for (var n = 0; n < words.length; n++) {
        this.canvasElement.fillText(words[n] + '', xpositionCalc + 4, ypositionCalc);
        ypositionCalc += lineHeight;
      }
      // for (var n = 0; n < words.length; n++) {

      //   var testLine = line + words[n] + ' ';
      //   var metrics = this.canvasElement.measureText(testLine);
      //   var testWidth = metrics.width;
      //   if (testWidth > maxWidth && n > 0) {
      //     this.canvasElement.fillText(line, xpositionCalc + 4, ypositionCalc);
      //     line = words[n] + ' ';
      //     ypositionCalc += lineHeight;
      //   }
      //   else {
      //     line = testLine;
      //   }
      // }
      // this.canvasElement.fillText(line, xpositionCalc + 4, ypositionCalc);

    }
    if (elementId >= 12 && elementId <= 18 && getData.initial_height != 0 && getData.initial_width != 0) {
      newcreatedElement.style.top = 0 + 'px';
      newcreatedElement.style.left = 0 + 'px';
    }

  }


  resizeFunctionNewtoolbar(receiveData, isnegativeCoordinates) {
    let jsonInput = receiveData;
    let fullData = _.cloneDeep(jsonInput);
    let getData = fullData.shape;
    var newShapeString = "";
    let getAcutalWidth = this.getCanvaswidthandHeight(getData);
    let elementId = fullData.element_id;
    if (elementId < 12) {

      //minus to plush value changes on 06.02.2021 by ganesh reason toolbar builder icon rightside and bottom cutting
      var shapeDiffX = getAcutalWidth.left - ((Number(fullData.line_width) / 6) / 2);
      var shapeDiffY = getAcutalWidth.top - ((Number(fullData.line_width) / 6) / 2);
      shapeDiffX = shapeDiffX < 0 ? -(shapeDiffX) : shapeDiffX;
      shapeDiffY = shapeDiffY < 0 ? -(shapeDiffY) : shapeDiffY;
    }
    else {
      var shapeDiffX = getAcutalWidth.left - ((Number(fullData.line_width) / 2) / 2);
      var shapeDiffY = getAcutalWidth.top - ((Number(fullData.line_width) / 2) / 2);
    }

    // if ((elementId >= 12 && elementId <= 18) || ((elementId == 19 || elementId == 20) && getData.annotation_data.includes('move'))) {
    //   widthDiff = 0;
    //   heightDiff = 0;
    // }
    // if (elementId < 11 || ((elementId == 19 || elementId == 20) && getData.annotation_data.includes('move'))) {
    //   if (elementId == 19 || elementId == 20) {
    //     var shapeDiffX = getAcutalWidth.left - widthDiff - ((Number(fullData.line_width) / 6) / 2);
    //     var shapeDiffY = getAcutalWidth.top - heightDiff - ((Number(fullData.line_width) / 6) / 2);
    //   }
    //   else {
    //     var shapeDiffX = getAcutalWidth.left - widthDiff + 3.5 - ((Number(fullData.line_width) / 6));
    //     var shapeDiffY = getAcutalWidth.top - heightDiff + 3.5 - ((Number(fullData.line_width) / 6));
    //   }
    // }
    // else {
    //   var shapeDiffX = getAcutalWidth.left - widthDiff - ((Number(fullData.line_width) / 2) / 2);
    //   var shapeDiffY = getAcutalWidth.top - heightDiff - ((Number(fullData.line_width) / 2) / 2);
    // }
    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");
    var previous = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var a = 0;
    var last_mousex = this.coordinateX;
    var last_mousey = this.coordinateY;
    var mousex = 0;
    var mousey = 0;
    var cpx = 0;
    var cpy = 0;
    let cp1x = 0;
    let cp1y = 0;
    let cp2x = 0;
    let cp2y = 0;
    let cx = 0;
    let cy = 0;

    for (var i = 0; i < spaceSplit.length; i++) {
      let splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      if (hypenSplit.length > 2) {
        let localString1 = hypenSplit[1] + '-' + hypenSplit[2];
        hypenSplit = [hypenSplit[0], localString1];
      }
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "drawRect" && hypenSplit[0] != "ovalIn"
        ) {
          if (hypenSplit[0] == 'line') {

          }
          colonSplit[0] = this.scientificToDecimal(Number(colonSplit[0]));
          colonSplit[1] = this.scientificToDecimal(Number(colonSplit[1]));
          var x = this.scientificToDecimal(Number(colonSplit[0]));
          var y = this.scientificToDecimal(Number(colonSplit[1]));
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);
          switch (hypenSplit[0]) {
            case "move":
              newShapeString = newShapeString != '' ? (newShapeString + ' move-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('move-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "line":
              newShapeString = newShapeString != '' ? (newShapeString + ' line-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('line-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "ovalIn":
              break;
            case "curveEnd":
              newShapeString = newShapeString != '' ? (newShapeString + ' curveEnd-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('curveEnd-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint1":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint1-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint1-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint2":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint2-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint2-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "endCurve":
              newShapeString = newShapeString != '' ? (newShapeString + ' endCurve-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('endCurve-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
          }
        }

      }
    }
    let initialX = Number(getData.initial_position_x) + (getAcutalWidth.left / 2);
    let initialY = Number(getData.initial_position_y) + (getAcutalWidth.top / 2);
    let returnValue = { shapeString: newShapeString, initialX: initialX, initialY: initialY }

    return returnValue;
  }

  resizeFunctionDoctoolbar(receiveData, isnegativeCoordinates) {
    let jsonInput = receiveData;
    let fullData = _.cloneDeep(jsonInput);
    let getData = fullData.shape;
    var newShapeString = "";
    let getAcutalWidth = this.getCanvaswidthandHeight(getData);

    let elementId = fullData.element_id;
    if (elementId < 12) {
      //minus to plush value changes on 06.02.2021 by ganesh reason toolbar builder icon rightside and bottom cutting
      var shapeDiffX = getAcutalWidth.left - ((Number(fullData.line_width) / 6) / 2);
      var shapeDiffY = getAcutalWidth.top - ((Number(fullData.line_width) / 6) / 2);
      shapeDiffX = shapeDiffX < 0 ? -(shapeDiffX) : shapeDiffX;
      shapeDiffY = shapeDiffY < 0 ? -(shapeDiffY) : shapeDiffY;
    }
    else {
      var shapeDiffX = getAcutalWidth.left - ((Number(fullData.line_width) / 2) / 2);
      var shapeDiffY = getAcutalWidth.top - ((Number(fullData.line_width) / 2) / 2);
    }

    // if ((elementId >= 12 && elementId <= 18) || ((elementId == 19 || elementId == 20) && getData.annotation_data.includes('move'))) {
    //   widthDiff = 0;
    //   heightDiff = 0;
    // }
    // if (elementId < 11 || ((elementId == 19 || elementId == 20) && getData.annotation_data.includes('move'))) {
    //   if (elementId == 19 || elementId == 20) {
    //     var shapeDiffX = getAcutalWidth.left - widthDiff - ((Number(fullData.line_width) / 6) / 2);
    //     var shapeDiffY = getAcutalWidth.top - heightDiff - ((Number(fullData.line_width) / 6) / 2);
    //   }
    //   else {
    //     var shapeDiffX = getAcutalWidth.left - widthDiff + 3.5 - ((Number(fullData.line_width) / 6));
    //     var shapeDiffY = getAcutalWidth.top - heightDiff + 3.5 - ((Number(fullData.line_width) / 6));
    //   }
    // }
    // else {
    //   var shapeDiffX = getAcutalWidth.left - widthDiff - ((Number(fullData.line_width) / 2) / 2);
    //   var shapeDiffY = getAcutalWidth.top - heightDiff - ((Number(fullData.line_width) / 2) / 2);
    // }
    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");
    var previous = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var a = 0;
    var last_mousex = this.coordinateX;
    var last_mousey = this.coordinateY;
    var mousex = 0;
    var mousey = 0;
    var cpx = 0;
    var cpy = 0;
    let cp1x = 0;
    let cp1y = 0;
    let cp2x = 0;
    let cp2y = 0;
    let cx = 0;
    let cy = 0;

    for (var i = 0; i < spaceSplit.length; i++) {
      let splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      if (hypenSplit.length > 2) {
        let localString1 = hypenSplit[1] + '-' + hypenSplit[2];
        hypenSplit = [hypenSplit[0], localString1];
      }
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "drawRect" && hypenSplit[0] != "ovalIn"
        ) {
          colonSplit[0] = this.scientificToDecimal(Number(colonSplit[0]));
          colonSplit[1] = this.scientificToDecimal(Number(colonSplit[1]));
          var x = this.scientificToDecimal(Number(colonSplit[0]));
          var y = this.scientificToDecimal(Number(colonSplit[1]));
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);
          switch (hypenSplit[0]) {
            case "move":
              newShapeString = newShapeString != '' ? (newShapeString + ' move-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('move-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "line":
              newShapeString = newShapeString != '' ? (newShapeString + ' line-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('line-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "ovalIn":
              break;
            case "curveEnd":
              newShapeString = newShapeString != '' ? (newShapeString + ' curveEnd-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('curveEnd-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint1":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint1-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint1-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint2":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint2-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint2-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "endCurve":
              newShapeString = newShapeString != '' ? (newShapeString + ' endCurve-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('endCurve-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
          }
        }

      }
    }
    let initialX = Number(getData.initial_position_x) + (getAcutalWidth.left / 2);
    let initialY = Number(getData.initial_position_y) + (getAcutalWidth.top / 2);
    let returnValue = { shapeString: newShapeString, initialX: initialX, initialY: initialY }

    return returnValue;
  }

  scientificToDecimal(num) {
    var nsign = Math.sign(num);
    //remove the sign
    num = Math.abs(num);
    //if the number is in scientific notation remove it
    if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
      var zero = '0',
        parts = String(num).toLowerCase().split('e'), //split into coeff and exponent
        e = parts.pop(), //store the exponential part
        l = Math.abs(Number(e)), //get the number of zeros
        sign = Number(e) / l,
        coeff_array = parts[0].split('.');
      if (sign === -1) {
        l = l - coeff_array[0].length;
        if (l < 0) {
          num = coeff_array[0].slice(0, l) + '.' + coeff_array[0].slice(l) + (coeff_array.length === 2 ? coeff_array[1] : '');
        }
        else {
          num = zero + '.' + new Array(l + 1).join(zero) + coeff_array.join('');
        }
      }
      else {
        var dec = coeff_array[1];
        if (dec)
          l = l - dec.length;
        if (l < 0) {
          num = coeff_array[0] + dec.slice(0, l) + '.' + dec.slice(l);
        } else {
          num = coeff_array.join('') + new Array(l + 1).join(zero);
        }
      }
    }

    return nsign < 0 ? '-' + num : num;
  };

  getshapeDrawingBefore(getData, isnegativeCoordinates, id, labelid, source) {
    var elementId = Number(getData.toolbar_element_id);
    var pdfImg = document.getElementById(id);
    if (pdfImg != null && pdfImg.firstChild != null) {
      var child = pdfImg.lastElementChild;
      while (child) {
        pdfImg.removeChild(child);
        child = pdfImg.lastElementChild;
      }
    }
    let getannotationLabelElement = document.querySelectorAll("p");
    if (getannotationLabelElement.length > 0) {
      for (var al = 0; al < getannotationLabelElement.length; al++) {
        if (getannotationLabelElement[al].getAttribute(labelid) != null) {
          getannotationLabelElement[al].remove();
        }
      }
    }
    var newcreatedElement = document.createElement("canvas");
    newcreatedElement.setAttribute("id", 'canvas' + id);
    getData.initial_height = Number(getData.initial_height);
    getData.initial_width = Number(getData.initial_width);
    var getHeight;
    var getWidth;
    if (getData.initial_width <= 0 && getData.initial_height <= 0 && elementId >= 12 && elementId <= 18) {
      let getDrawWidthandHeight = this.getCanvaswidthandHeight(getData);
      if (Number(getData.initial_position_x) != 0) {
        let getChangedString = this.changeStringValue(getData);
        getData.annotation_data = getChangedString;
        getData.initial_position_x = Number(getData.initial_position_x);
        getData.initial_position_y = Number(getData.initial_position_y);
        this.coordinateX = getData.initial_position_x < 0 ? -(getData.initial_position_x) : getData.initial_position_x;
        this.coordinateY = getData.initial_position_y < 0 ? -(getData.initial_position_y) : getData.initial_position_y;
      }
      else {
        this.coordinateX = getDrawWidthandHeight.left - ((Number(getData.line_width) / 2) / 2);
        this.coordinateY = getDrawWidthandHeight.top - ((Number(getData.line_width) / 2) / 2);
      }
      getWidth = getDrawWidthandHeight.width + Number(getData.line_width) / (2);
      getHeight = getDrawWidthandHeight.height + Number(getData.line_width) / (2);
    }
    else if (getData.initial_width != 0 && getData.initial_height != 0 && elementId >= 12 && elementId <= 18) {
      getHeight = getData.initial_height + 3 + Number(getData.line_width) / (2);
      getWidth = getData.initial_width + 3 + Number(getData.line_width) / (2);

      // this.coordinateX = getData.initial_position_x;
      // this.coordinateY = getData.initial_position_y;
      let getWidthResize = this.getCanvaswidthandHeight(getData);

    }
    else if (elementId <= 11 && getData.initial_height != 0 && getData.initial_width != 0) {
      let convertAnnotationWH = getData.annotation_data;
      let xCoordinate = [];
      let yCoordinate = [];
      let startx;
      let starty;
      let endx;
      let endy;
      convertAnnotationWH = convertAnnotationWH.trim();
      let splitData = convertAnnotationWH.split(" ");
      for (var i = 0; i < splitData.length; i++) {
        let hypenSplit = splitData[i].split("-");
        let colonSplit = hypenSplit[1].split(":");
        xCoordinate.push(colonSplit[0]);
        yCoordinate.push(colonSplit[1]);
      }
      startx = Math.min.apply(null, xCoordinate);
      endx = Math.max.apply(null, xCoordinate);
      starty = Math.min.apply(null, yCoordinate);
      endy = Math.max.apply(null, yCoordinate);

      let getDrawWidthandHeight = this.calculateRectPos(
        startx,
        starty,
        endx,
        endy
      );
      var startXValue = getDrawWidthandHeight.left;
      var startYValue = getDrawWidthandHeight.top;
      var centerShapeChangeX = (endx - startx) / 2;
      var centerShapeChangeY = (endy - starty) / 2;
      this.coordinateX = getData.initial_position_x;
      this.coordinateY = getData.initial_position_y;

      getWidth = Number(getData.initial_width) + (Number(getData.line_width) / (6) * 2);
      getHeight = Number(getData.initial_height) + (Number(getData.line_width) / (6) * 2);
      if (elementId == 5 || elementId == 9) {
        getWidth = Number(getData.initial_width) + (Number(getData.line_width) / (6) * 2);
        getHeight = Number(getData.initial_height) + (Number(getData.line_width) / (6) * 2);
      }
    }
    else if (elementId <= 11) {
      getWidth = 35 + Number(getData.line_width) / (6);
      getHeight = 35 + Number(getData.line_width) / (6);
      if (elementId == 5 || elementId == 9) {
        getWidth = 35 + (Number(getData.line_width) / (6) * 2);
        getHeight = 35 + (Number(getData.line_width) / (6) * 2);
      }
    }
    else if (elementId == 19 || elementId == 20) {
      if (getData.annotation_data.includes('move')) {
        let getDrawWidthandHeight = this.getCanvaswidthandHeight(getData);
        getWidth = getDrawWidthandHeight.width + (Number(getData.line_width) / 2);
        getHeight = getDrawWidthandHeight.height + (Number(getData.line_width) / 2);
        this.coordinateX = Number(getData.initial_position_x) - 35 - ((Number(getData.line_width) / 2) / 2);
        this.coordinateY = Number(getData.initial_position_y) - 35 - ((Number(getData.line_width) / 2) / 2);
      }
      else {
        let stringValue = getData.annotation_data;
        let splitString = stringValue.replaceAll('--', '-n');
        splitString = splitString.replaceAll(':-', ':n');
        let hypenSplitCD = splitString.split("-");
        let colonSplitCD = hypenSplitCD[1].replaceAll('n', '-').split(":");
        colonSplitCD[0] = Number(colonSplitCD[0]);
        colonSplitCD[1] = Number(colonSplitCD[1]);
        colonSplitCD[2] = Number(colonSplitCD[2]);
        colonSplitCD[3] = Number(colonSplitCD[3]);
        if (Number(getData.initial_position_x) != 0) {
          this.coordinateX = Number(getData.initial_position_x);
          this.coordinateY = Number(getData.initial_position_y);
          this.coordinateY = this.coordinateY - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
          this.coordinateX = this.coordinateX - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
          getData.initial_width = 0;
          getData.initial_height = 0;
          getData.initial_position_x = 0;
          getData.initial_position_y = 0;
        }
        else {
          this.coordinateX = colonSplitCD[2] < 0 ? (colonSplitCD[0]) + colonSplitCD[2] - ((Number(getData.line_width) / 2) / 2) : colonSplitCD[0] - ((Number(getData.line_width) / 2) / 2);
          this.coordinateY = colonSplitCD[3] < 0 ? colonSplitCD[1] + colonSplitCD[3] - ((Number(getData.line_width) / 2) / 2) : colonSplitCD[1] - ((Number(getData.line_width) / 2) / 2);
          colonSplitCD[2] = colonSplitCD[2] < 0 ? -(colonSplitCD[2]) : colonSplitCD[2];
          colonSplitCD[3] = colonSplitCD[3] < 0 ? -(colonSplitCD[3]) : colonSplitCD[3];
        }
        if (elementId == 19) {
          getWidth = parseFloat(colonSplitCD[2]) + 4 + Number(getData.line_width) / (2);
          getHeight = parseFloat(colonSplitCD[3]) + 4 + Number(getData.line_width) / (2);
        }
        else {
          getWidth = parseFloat(colonSplitCD[2]) + 4 + Number(getData.line_width) / (2);
          getHeight = parseFloat(colonSplitCD[3]) + 4 + Number(getData.line_width) / (2);
        }

      }
    }
    newcreatedElement.style.position = "absolute";
    newcreatedElement.style.zIndex = "1";
    if (
      elementId == 12 ||
      elementId == 17 ||
      elementId == 18 ||
      elementId == 14 ||
      elementId == 13 ||
      elementId == 19 ||
      elementId == 20 ||
      elementId == 15 ||
      elementId == 16 ||
      isnegativeCoordinates == true
    ) {
      newcreatedElement.setAttribute("id", 'canvas' + id);
      if (elementId == 13 && getData.initial_height == 0) {
        newcreatedElement.setAttribute("width", getWidth + 25);
        newcreatedElement.setAttribute("height", getHeight + 25);
      }
      else if (elementId != 19 && elementId != 20 && getData.initial_height == 0) {
        newcreatedElement.setAttribute("width", getWidth + 20);
        newcreatedElement.setAttribute("height", getHeight + 20);
      }
      else {
        newcreatedElement.setAttribute("width", getWidth);
        newcreatedElement.setAttribute("height", getHeight);
      }
      if (getData.initial_position_x != 0 && getData.initial_position_y != 0) {
        newcreatedElement.style.top = 0 + "px";
        newcreatedElement.style.left = 0 + "px";
      }
      else {
        newcreatedElement.style.top = 0 + "px";
        newcreatedElement.style.left = 0 + "px";
      }
      if (elementId == 19 || elementId == 20) {
        if (getData.annotation_data.includes('move') && elementId == 19) {
          newcreatedElement.style.top = 0 + "px";
          newcreatedElement.style.left = 0 + "px";
        }
        else if (getData.annotation_data.includes('move') && elementId == 20) {
          // newcreatedElement.setAttribute('width',(Number(getWidth)+10).toString());
          // newcreatedElement.setAttribute('height',(Number(getHeight)+10).toString());
          newcreatedElement.style.top = 0 + "px";
          newcreatedElement.style.left = 0 + "px";
        }
      }
      else if (getData.initial_height == 0 && getData.initial_position_x == 0 && getData.initial_position_y == 0) {
        newcreatedElement.style.marginTop = - 10 + "px";
        newcreatedElement.style.marginLeft = - 10 + "px";
      }
    }
    else if (
      elementId == 15 ||
      elementId == 16
    ) {
      newcreatedElement.setAttribute("id", 'canvas' + id);
      newcreatedElement.setAttribute("width", getWidth + getData.line_width + getData.line_width + 10);
      newcreatedElement.setAttribute("height", getHeight + getData.line_width + getData.line_width + 10);
      newcreatedElement.style.top = 0 + "px";
      newcreatedElement.style.left = 0 + "px";
      newcreatedElement.style.marginTop = -getData.line_width - 2.5 + "px";
      newcreatedElement.style.marginLeft = -getData.line_width - 2.5 + "px";
    }
    else if (elementId == 11) {
      let staticValue = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-44:0 controlpoint-49:0 curveEnd-49:5 line-49:15 controlpoint-49:20 curveEnd-44:20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10 text-123"
      let getText = getData.annotation_data.split('text-');

      let canvas12 = document.createElement("canvas");
      canvas12.style.width = "200px";

      let context = canvas12.getContext("2d");
      context.font = "14px times new roman";
      context.fillText(getText[1], 0, 0);
      let widthget = context.measureText(getText[1]).width;

      // let ruler = document.createElement("p");
      // ruler.style.width = "auto";
      // ruler.style.position = 'absolute';
      // ruler.style.whiteSpace = 'nowrap';
      // ruler.innerHTML = getText[1];
      // let getEle = document.getElementById("welldone");
      // getEle.appendChild(ruler);
      // 
      let formattedWidth = Math.ceil(widthget);
      // let canvas12 =  document.createElement("p");

      let minusXposition = formattedWidth < 50 ? 10 : 5;
      formattedWidth = formattedWidth < 50 ? formattedWidth + 25 : formattedWidth + 0;
      canvas12.innerHTML = getText[1];
      canvas12.style.fontWeight = "500";
      canvas12.style.fontSize = "14px";
      var textWidth = formattedWidth;
      let currentAnnotationData = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10 text-" + getText[1] + ""
      let x1Coordinate = [];
      let y1Coordinate = [];
      currentAnnotationData = currentAnnotationData.trim();
      let splitData123 = currentAnnotationData.split(" ");
      for (var im = 0; im < splitData123.length - 1; im++) {

        let hypenSplit = splitData123[im].split("-");
        let colonSplit = hypenSplit[1].split(":");
        x1Coordinate.push(colonSplit[0]);
        y1Coordinate.push(colonSplit[1]);
      }
      let startx = Math.min.apply(null, x1Coordinate);
      let endx = Math.max.apply(null, x1Coordinate);
      let starty = Math.min.apply(null, y1Coordinate);
      let endy = Math.max.apply(null, y1Coordinate);
      let textshapewidth = (endx - startx);
      let textshapeheight = (endy - starty);
      getData.annotation_data = currentAnnotationData;


      newcreatedElement.setAttribute("id", 'canvas' + id);
      let newOne = textWidth;

      newcreatedElement.setAttribute("width", newOne.toString());
      newcreatedElement.setAttribute("height", "50");
      var textShapexyWidth = (newOne - textshapewidth) / 2;
      var textShapexyHeight = (50 - textshapeheight) / 2;
      textShapexyWidth = textShapexyWidth - 5;

      newcreatedElement.style.top = 0 + "px";
      newcreatedElement.style.left = 0 + "px";
      newcreatedElement.style.marginLeft = - (newOne / 2) + "px";
      newcreatedElement.style.marginTop = -(50 / 2) + "px";
    }
    else {

      var getStringWidth = this.getCanvaswidthandHeight(getData);
      newcreatedElement.setAttribute("id", 'canvas' + id);
      newcreatedElement.setAttribute("width", getWidth + Number(getData.line_width) / (6));
      newcreatedElement.setAttribute("height", getHeight + Number(getData.line_width) / (6));
      if (Number(getData.initial_height) != 0) {
        // let subtractX = this.dbxposition - 17.5;
        // let subtractY = this.dbyposition - 17.5;
        newcreatedElement.style.top = 0 + "px";
        newcreatedElement.style.left = 0 + "px";
      }
      else {
        newcreatedElement.style.top = 0 + "px";
        newcreatedElement.style.left = 0 + "px";
        newcreatedElement.style.marginLeft = -getWidth / 2 + "px";
        newcreatedElement.style.marginTop = -getHeight / 2 + "px";
      }
    }
    // newcreatedElement.addEventListener("contextmenu", (e: any) => {
    //   this.canvasRightClick(e);
    // });
    if (getData.annotation_label != "") {
      this.annotationLabelBackground(getData, id, labelid);
    }
    pdfImg.appendChild(newcreatedElement);
    this.canvasElement = newcreatedElement.getContext("2d");

    this.canvasElement.beginPath();
    // this.canvasBlurryRemove(newcreatedElement,this.canvasElement);
    this.canvasElement.globalAlpha = getData.opacity;
    if (elementId >= 1 && elementId <= 10 && (Number(getData.initial_width) < 35) && (Number(getData.initial_height) < 35) &&
      (Number(getData.initial_width) != 0) && (Number(getData.initial_height) != 0)) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width) - 5;
      let currentDBgetH = Number(getData.initial_height) - 5;
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }

      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    if (elementId >= 12 && elementId <= 18 && Number(getData.initial_width) != 0 && Number(getData.initial_height) != 0) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width);
      let currentDBgetH = Number(getData.initial_height);
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if ((elementId == 19) && getData.annotation_data.includes('move')) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width) + 17.5;
      let currentDBgetH = Number(getData.initial_height) + 17.5;
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if (elementId == 20 && getData.annotation_data.includes('move')) {
      let actualCanvasWH = this.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width);
      let currentDBgetH = Number(getData.initial_height);
      let actualratio = (actualCanvasWH.width + 35) / (actualCanvasWH.height + 35);
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }

    // To Repoint the drawn shape inside the canvas center.
    // --------------

    if (getStringWidth != undefined && getData.initial_height == 0) {
      let translateWidth = getStringWidth.width - newcreatedElement.width;
      let translateHeight = getStringWidth.height - newcreatedElement.height;
      let translateX = (translateWidth / 2) + getStringWidth.left;
      let translateY = (translateHeight / 2) + getStringWidth.top;
      this.canvasElement.translate(-translateX, -translateY);
      this.canvasElement.restore();
    }
    // ---------------

    //Rotate shape drawing setup start
    if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && elementId < 10) {


      let dx = getData.initial_rotation > 0 ? (getWidth / 2) : (-15);
      let dy = getData.initial_rotation > 0 ? (-15) : getHeight / 2;
      newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';

      // 
      // this.canvasElement.restore();
    }
    //Rotate shape drawing setup end

    // newcreatedElement = this.createHIDPIcanvs(getWidth,getHeight,7,newcreatedElement);
    // let ratio = 2;
    // newcreatedElement.width = newcreatedElement.clientWidth * ratio;
    // newcreatedElement.height = newcreatedElement.clientHeight * ratio;
    // this.canvasElement.scale(ratio,ratio);
    this.canvasElement.imageSmoothingQuality = "high";
    // newcreatedElement = this.createHIDPIcanvs(newcreatedElement.width, newcreatedElement.height, 72, newcreatedElement);
    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");

    var previous = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var a = 0;
    var last_mousex = this.coordinateX;
    var last_mousey = this.coordinateY;
    var mousex = 0;
    var mousey = 0;
    var cpx = 0;
    var cpy = 0;
    let cp1x = 0;
    let cp1y = 0;
    let cp2x = 0;
    let cp2y = 0;
    let cx = 0;
    let cy = 0;
    for (var i = 0; i < spaceSplit.length; i++) {
      var splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "curveEnd" &&
          hypenSplit[0] != "controlpoint" &&
          hypenSplit[0] != "drawRect" &&
          hypenSplit[0] != "controlpoint1" &&
          hypenSplit[0] != "controlpoint2" &&
          hypenSplit[0] != "endCurve"
        ) {
          //Ellipse negative value is coming convert positive from ipad
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);

          switch (hypenSplit[0]) {
            case "move":
              if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true
              ) {
                //Freehand shapes except ellipse and rectangle
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
                this.canvasElement.moveTo(
                  x,
                  y
                );
              }
              else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) {
                //Line and line axial shape
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else {
                //Simple shapes initial
                if (elementId == 11) {
                  let calHeight = newcreatedElement.clientHeight / 2;
                  this.canvasElement.moveTo(x + textShapexyWidth, y + textShapexyHeight);
                }
                else {
                  this.canvasElement.moveTo(x, y);

                }
              }
              if (elementId == 13 && j == 1) {
                previous.x = x - this.coordinateX + 10;
                previous.y = y - this.coordinateY + 10;
                a++;
              }
              break;
            case "line":
              this.canvasElement.clearRect(
                0,
                0,
                newcreatedElement.width,
                newcreatedElement.height
              );
              if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true
              ) {
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
                this.canvasElement.lineTo(
                  x,
                  y
                );
              }
              else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) {
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10,
                  y - this.coordinateY + 10
                );
              }
              else {
                if (elementId == 11) {
                  let calHeight = newcreatedElement.clientHeight / 2;
                  this.canvasElement.lineTo(x + textShapexyWidth, y + textShapexyHeight);
                }
                else {
                  this.canvasElement.lineTo(x, y);
                }
              }
              break;
            case "ovalIn":
              if (elementId == 1 || elementId == 8) {
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.arc(
                  newcreatedElement.clientWidth / 2,
                  newcreatedElement.clientHeight / 2.3, r, 0, 2 * Math.PI
                );
              } else if (elementId == 19) {
                w = w < 0 ? -(w) : w;
                h = h < 0 ? -(h) : h;

                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.ellipse((w / 2) + 2 + ((Number(getData.line_width) / 2) / 2), (h / 2) + 2 + ((Number(getData.line_width) / 2) / 2), w / 2, h / 2, Math.PI * 1, 0, 2 * Math.PI);
              }
              break;
          }
        }
        else if (hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") {
          if (hypenSplit[0] == "controlpoint") {
            cpx = parseFloat(colonSplit[0]);
            cpy = parseFloat(colonSplit[1]);
          }
          if (hypenSplit[0] == "curveEnd") {
            var ex = parseFloat(colonSplit[0]);
            var ey = parseFloat(colonSplit[1]);
            if (elementId == 11) {
              this.canvasElement.quadraticCurveTo(cpx + textShapexyWidth, cpy + textShapexyHeight, ex + textShapexyWidth, ey + textShapexyHeight);
            }
            else {
              this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
            }

          }
        }
        else if (hypenSplit[0] == "controlpoint1" || hypenSplit[0] == "controlpoint2" || hypenSplit[0] == "endCurve" && j == 1) {
          if (hypenSplit[0] == "controlpoint1") {
            cp1x = parseFloat(colonSplit[0]);
            cp1y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "controlpoint2") {
            cp2x = parseFloat(colonSplit[0]);
            cp2y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "endCurve") {
            cx = parseFloat(colonSplit[0]);
            cy = parseFloat(colonSplit[1]);
            this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
            this.canvasElement.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
          }
        }
        else if (hypenSplit[0] == "drawRect" && j == 1) {
          // let colonSplit = hypenSplit[j].split(":");
          colonSplit[0] = Number(colonSplit[0]);
          colonSplit[1] = Number(colonSplit[1]);
          colonSplit[2] = Number(colonSplit[2]);
          colonSplit[3] = Number(colonSplit[3]);
          colonSplit[2] = colonSplit[2] < 0 ? -(colonSplit[2]) : colonSplit[2];
          colonSplit[3] = colonSplit[3] < 0 ? -(colonSplit[3]) : colonSplit[3];
          let rectX = parseFloat(colonSplit[0]);
          let rectY = parseFloat(colonSplit[1]);
          let rectWidth = parseFloat(colonSplit[2]);
          let rectHeight = parseFloat(colonSplit[3]);

          this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
          // let rectlineWidth = this.globalLineWidth(getData.line_width);
          // newcreatedElement.setAttribute('width',(newcreatedElement.width + rectlineWidth).toString());
          // newcreatedElement.setAttribute('height',(newcreatedElement.height + rectlineWidth).toString());
          // newcreatedElement.style.top = this.coordinateY - (rectlineWidth/2) + 'px';
          // newcreatedElement.style.left = this.coordinateX - (rectlineWidth/2) + 'px';
          this.canvasElement.rect(
            ((Number(getData.line_width) / 2) / 2) + 1,
            ((Number(getData.line_width) / 2) / 2) + 1,
            rectWidth + 2,
            rectHeight + 2);
          // 
        }
      }
    }
    if (
      elementId != 12 &&
      elementId != 14 &&
      elementId != 13 &&
      elementId != 15
    ) {
      var checkFill = getData.fill_color;
      this.canvasElement.fillStyle = this.checkStrokeColor1(checkFill);
      this.canvasElement.fill();
    }
    if ((elementId == 17 || elementId == 18) && (spaceSplit.length - 1 == i) && (j == 1)) {

      this.canvasElement.closePath();
    }
    if (elementId < 11) {
      this.canvasElement.lineWidth = Number(getData.line_width) / (6);
    }
    else if (elementId >= 12) {
      this.canvasElement.lineWidth = Number(getData.line_width) / (2);
    }
    this.canvasElement.strokeStyle = this.checkStrokeColor1(getData.stroke_color);
    this.canvasElement.stroke();
    newcreatedElement.style.overflow = "visible";
    newcreatedElement.style.display = "block";
    // this.canvasElement.lineCap = "square";
    // this.canvasElement.lineJoin = "miter";
    if (elementId >= 12 && elementId <= 18 && getData.initial_height != 0 && getData.initial_width != 0) {
      newcreatedElement.style.top = Number(this.coordinateY) - (35 / 2) + 'px';
      newcreatedElement.style.left = Number(this.coordinateX) - (35 / 2) + 'px';
    }
  }

  resizeFunctionLineWidth(getData, isnegativeCoordinates, width, height) {
    var newShapeString: any = "";
    let getAcutalWidth = this.getCanvaswidthandHeight(getData);
    let elementId = getData.toolbar_element_id;
    var widthDiff = Number(width) - getAcutalWidth.width;
    var heightDiff = Number(height) - getAcutalWidth.height;
    var shapeDiffX = -(widthDiff / 2);
    var shapeDiffY = -(heightDiff / 2);
    // shapeDiffX = shapeDiffX + (Number(width) / 2) + 1 - (getAcutalWidth.width / 2);
    // shapeDiffY = shapeDiffY + (Number(height) / 2) + 1 - (getAcutalWidth.height / 2);
    shapeDiffX = shapeDiffX + ((Number(getData.line_width) / 2));
    shapeDiffY = shapeDiffY + ((Number(getData.line_width) / 2));
    let WidhDiffer = shapeDiffX < 0 ? -(shapeDiffX) : shapeDiffX;
    let HeightDiffer = shapeDiffY < 0 ? -(shapeDiffY) : shapeDiffY;

    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");
    for (var i = 0; i < spaceSplit.length; i++) {
      let splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "drawRect" && hypenSplit[0] != "ovalIn"
        ) {
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);
          switch (hypenSplit[0]) {
            case "move":
              newShapeString = newShapeString != '' ? (newShapeString + ' move-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('move-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "line":
              newShapeString = newShapeString != '' ? (newShapeString + ' line-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('line-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "ovalIn":
              break;
            case "curveEnd":
              newShapeString = newShapeString != '' ? (newShapeString + ' curveEnd-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('curveEnd-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint1":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint1-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint1-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "controlpoint2":
              newShapeString = newShapeString != '' ? (newShapeString + ' controlpoint2-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('controlpoint2-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
            case "endCurve":
              newShapeString = newShapeString != '' ? (newShapeString + ' endCurve-' + (x - shapeDiffX) + ':' + (y - shapeDiffY)) : ('endCurve-' + (x - shapeDiffX) + ':' + (y - shapeDiffY));
              break;
          }
        }

      }
    }
    let initialX = Number(getData.initial_position_x) + (getAcutalWidth.left / 2);
    let initialY = Number(getData.initial_position_y) + (getAcutalWidth.top / 2);
    // if(elementId>=1&&elementId<=10&&(Number(getData.initial_width)<35)&&(Number(getData.initial_height)<35)&&
    // (Number(getData.initial_width)!=0)&&(Number(getData.initial_height)!=0)){
    //   newShapeString = newShapeString.replaceAll('--','-');
    //   newShapeString = newShapeString.replaceAll(':-',':');
    //   
    //   
    // }
    let returnValue = { shapeString: newShapeString, xDifference: WidhDiffer, yDifference: HeightDiffer }
    return returnValue;
  }

  getshapeDrawingP2P3(getDataP2P3, id, labelid, source) {
    let getData = _.cloneDeep(getDataP2P3);
    getData.initial_position_x = getData.initial_position_x < 0 ? -(Number(getData.initial_position_x)) : Number(getData.initial_position_x);
    getData.initial_position_y = getData.initial_position_y < 0 ? -(Number(getData.initial_position_y)) : Number(getData.initial_position_y);
    var elementId = Number(getData.toolbar_element_id);
    var pdfImg = document.getElementById(id);
    if (pdfImg != null && pdfImg.firstChild != null) {
      var child = pdfImg.lastElementChild;
      while (child) {
        pdfImg.removeChild(child);
        child = pdfImg.lastElementChild;
      }
    }
    let getannotationLabelElement = document.querySelectorAll("p");
    if (getannotationLabelElement.length > 0) {
      for (var al = 0; al < getannotationLabelElement.length; al++) {
        if (getannotationLabelElement[al].getAttribute(labelid) != null) {
          getannotationLabelElement[al].remove();
        }
      }
    }
    var newcreatedElement = document.createElement("canvas");
    var getHeight;
    var getWidth;
    let linewidthCount = 0;
    if (elementId > 11) {
      linewidthCount = Math.round(Number(getData.line_width) / 2);
    }
    else {
      linewidthCount = Math.round(Number(getData.line_width) / 6);
    }
    var shapeStringValueTemp = this.getCanvaswidthandHeight(getData);
    getWidth = shapeStringValueTemp.width + 10;
    getHeight = shapeStringValueTemp.height + 10;
    newcreatedElement.style.position = "absolute";
    newcreatedElement.style.zIndex = "1";
    var getStringWidth = this.getCanvaswidthandHeight(getData);
    newcreatedElement.setAttribute("id", 'canvas' + id);
    newcreatedElement.setAttribute("width", getWidth);
    newcreatedElement.setAttribute("height", getHeight);
    newcreatedElement.style.top = "0px";
    newcreatedElement.style.left = "0px";
    pdfImg.appendChild(newcreatedElement);
    this.canvasElement = newcreatedElement.getContext("2d");
    this.canvasElement.beginPath();
    this.canvasElement.globalAlpha = getData.opacity;
    // this.canvasBlurryRemove(newcreatedElement,this.canvasElement);
    if (getStringWidth != undefined) {
      let translateWidth = getStringWidth.width - newcreatedElement.width;
      let translateHeight = getStringWidth.height - newcreatedElement.height;
      let translateX = (translateWidth / 2) + getStringWidth.left;
      let translateY = (translateHeight / 2) + getStringWidth.top;
      this.canvasElement.translate(-translateX, -translateY);
      this.canvasElement.restore();
    }
    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");

    var previous = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var a = 0;
    var last_mousex = this.coordinateX;
    var last_mousey = this.coordinateY;
    var mousex = 0;
    var mousey = 0;
    var cpx = 0;
    var cpy = 0;
    let cp1x = 0;
    let cp1y = 0;
    let cp2x = 0;
    let cp2y = 0;
    let cx = 0;
    let cy = 0;
    let xposition = Number(this.coordinateX);
    let yposition = Number(this.coordinateY);
    for (var i = 0; i < spaceSplit.length; i++) {
      var splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "curveEnd" &&
          hypenSplit[0] != "controlpoint" &&
          hypenSplit[0] != "drawRect" &&
          hypenSplit[0] != "controlpoint1" &&
          hypenSplit[0] != "controlpoint2" &&
          hypenSplit[0] != "endCurve"
        ) {
          //Ellipse negative value is coming convert positive from ipad
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);

          switch (hypenSplit[0]) {
            case "move":
              let actmovex = x;
              let actmovey = y;
              this.canvasElement.moveTo(actmovex, actmovey);
              break;
            case "line":
              let actlinex = x;
              let actliney = y;
              this.canvasElement.lineTo(actlinex, actliney);
              break;
            case "ovalIn":
              if (elementId == 1 || elementId == 8) {
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.arc(
                  newcreatedElement.clientWidth / 2,
                  newcreatedElement.clientHeight / 2.3, r, 0, 2 * Math.PI
                );
              } else if (elementId == 19) {
                w = w < 0 ? -(w) : w;
                h = h < 0 ? -(h) : h;
                w = w;
                h = h;
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.ellipse((w / 2) + 2 + ((Number(getData.line_width) / 2) / 2), (h / 2) + 2 + ((Number(getData.line_width) / 2) / 2), w / 2, h / 2, Math.PI * 1, 0, 2 * Math.PI);
              }
              break;
          }
        }
        else if ((hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") && j == 1) {
          if (hypenSplit[0] == "controlpoint") {
            cpx = parseFloat(colonSplit[0]);
            cpy = parseFloat(colonSplit[1]);
          }
          if (hypenSplit[0] == "curveEnd") {
            var ex = parseFloat(colonSplit[0]);
            var ey = parseFloat(colonSplit[1]);
            this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
          }
        }
        else if ((hypenSplit[0] == "controlpoint1" || hypenSplit[0] == "controlpoint2" || hypenSplit[0] == "endCurve") && j == 1) {
          if (hypenSplit[0] == "controlpoint1") {
            cp1x = parseFloat(colonSplit[0]);
            cp1y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "controlpoint2") {
            cp2x = parseFloat(colonSplit[0]);
            cp2y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "endCurve") {
            cx = parseFloat(colonSplit[0]);
            cy = parseFloat(colonSplit[1]);
            let cp1linex = cp1x;
            let cp1liney = cp1y;
            let cp2linex = cp2x;
            let cp2liney = cp2y;
            let cxlinex = cx;
            let cxliney = cy;
            this.canvasElement.bezierCurveTo(cp1linex, cp1liney, cp2linex, cp2liney, cxlinex, cxliney);
          }
        }
        else if (hypenSplit[0] == "drawRect" && j == 1) {
          // let colonSplit = hypenSplit[j].split(":");
          colonSplit[0] = Number(colonSplit[0]);
          colonSplit[1] = Number(colonSplit[1]);
          colonSplit[2] = Number(colonSplit[2]);
          colonSplit[3] = Number(colonSplit[3]);
          colonSplit[2] = colonSplit[2] < 0 ? -(colonSplit[2]) : colonSplit[2];
          colonSplit[3] = colonSplit[3] < 0 ? -(colonSplit[3]) : colonSplit[3];
          let rectX = parseFloat(colonSplit[0]);
          let rectY = parseFloat(colonSplit[1]);
          let rectWidth = parseFloat(colonSplit[2]);
          let rectHeight = parseFloat(colonSplit[3]);
          this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
          let rectlineWidth = this.globalLineWidth(getData.line_width);
          this.canvasElement.rect(
            ((Number(getData.line_width) / 2) / 2) + 1,
            ((Number(getData.line_width) / 2) / 2) + 1,
            rectWidth,
            rectHeight);
        }
      }
    }
    if (
      elementId != 12 &&
      elementId != 14 &&
      elementId != 13 &&
      elementId != 15
    ) {
      var checkFill = getData.fill_color;
      this.canvasElement.fillStyle = this.checkStrokeColor1(checkFill);
      this.canvasElement.fill();
    }
    if (elementId == 17 || elementId == 18 || elementId == 1) {
      this.canvasElement.closePath();
    }

    if (elementId <= 11) {
      this.canvasElement.lineWidth = Math.round(Number(getData.line_width) / (6));
    }
    else if (elementId > 11) {
      this.canvasElement.lineWidth = Number(getData.line_width) / (2);
    }
    this.canvasElement.strokeStyle = this.checkStrokeColor1(getData.stroke_color);
    this.canvasElement.stroke();
  }

  changeShapeForWidthAndHeight(strShape: string, widthToChange: number, heightToChange: number, toolbar_element_id: number) {

    var getshapedimensions = this.getCanvaswidthandHeight({ toolbar_element_id, annotation_data: strShape })
    // if(widthToChange <= 20 || heightToChange <= 20){
    //   widthToChange = 35;
    //   heightToChange = 35;
    // }
    // widthToChange = widthToChange <= 20 ? 50 : widthToChange;
    // heightToChange = heightToChange <= 20 ? 50 : heightToChange;
    var widthDifference = widthToChange / (getshapedimensions.width)
    var heightDifference = heightToChange / (getshapedimensions.height)
    var scaleFactorValue = widthDifference > heightDifference ? heightDifference : widthDifference

    var xDiff = 0;
    var yDiff = 0;
    if (toolbar_element_id < 11) {
      let commonValue = widthToChange > heightToChange ? heightToChange : widthToChange
      widthDifference = commonValue / (getshapedimensions.width)
      heightDifference = commonValue / (getshapedimensions.height)
      scaleFactorValue = widthDifference > heightDifference ? heightDifference : widthDifference
    } else if (toolbar_element_id != 100) {

      xDiff = ((getshapedimensions.left * scaleFactorValue) - getshapedimensions.left)
      yDiff = ((getshapedimensions.top * scaleFactorValue) - getshapedimensions.top)


      //Jose Added -- Previous code before resize fix for normal shape

      // xDiff = xDiff + (xDiff/4)//((widthToChange - getshapedimensions.width)/2)
      // yDiff = yDiff + (yDiff/4)//((heightToChange - getshapedimensions.height)/2)

      ////////

      xDiff = xDiff + ((widthToChange - getshapedimensions.width) / 2)
      yDiff = yDiff + ((heightToChange - getshapedimensions.height) / 2)
      // xDiff = xDiff < 0 ? -(xDiff) : xDiff;
      // yDiff = yDiff < 0 ? -(yDiff) : yDiff;
    }

    let finalString = ""
    let splitData: any = strShape.split(" ");
    for (var i = 0; i < splitData.length; i++) {
      var splitString = splitData[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      let hypenSplit = splitString.split("-");
      if (hypenSplit.length > 2) {
        let localString1 = hypenSplit[1] + '-' + hypenSplit[2];
        hypenSplit = [hypenSplit[0], localString1];
      }
      if (hypenSplit != '') {
        let colonSplit = hypenSplit[1].replaceAll('n', '-').split(":");
        colonSplit[0] = this.scientificToDecimal(Number(colonSplit[0]));
        colonSplit[1] = this.scientificToDecimal(Number(colonSplit[1]));

        if (toolbar_element_id == 19 || toolbar_element_id == 20) {
          colonSplit[2] = this.scientificToDecimal(Number(colonSplit[2]));
          colonSplit[3] = this.scientificToDecimal(Number(colonSplit[3]));

          let widthDiff = widthToChange - getshapedimensions.width
          let heightDiff = heightToChange - getshapedimensions.height
          colonSplit[0] = colonSplit[0] - (widthDiff / 2)
          colonSplit[1] = colonSplit[1] - (heightDiff / 2)
          colonSplit[2] = colonSplit[2] + (widthDiff)
          colonSplit[3] = colonSplit[3] + (heightDiff)

          let localstring = hypenSplit[0] + "-" + colonSplit[0] + ":" + colonSplit[1] + ":" + colonSplit[2] + ":" + colonSplit[3]
          finalString = finalString != "" ? finalString + " " + localstring : localstring
        } else {
          colonSplit[0] = (colonSplit[0] * scaleFactorValue) - xDiff
          colonSplit[1] = (colonSplit[1] * scaleFactorValue) - yDiff
          colonSplit[0] = colonSplit[0] < 0 ? -(colonSplit[0]) : colonSplit[0];
          colonSplit[1] = colonSplit[1] < 0 ? -(colonSplit[1]) : colonSplit[1];
          let localstring = hypenSplit[0] + "-" + colonSplit[0] + ":" + colonSplit[1];
          finalString = finalString != "" ? finalString + " " + localstring : localstring;
        }
      }
    }
    console.log("shape for base icon", finalString)

    let value = this.getCanvaswidthandHeight({ toolbar_element_id, annotation_data: finalString })
    console.log("old", getshapedimensions, "new ", value, (widthToChange - getshapedimensions.width))
    return finalString;
  }


}


