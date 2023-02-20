import { Injectable, EventEmitter } from '@angular/core';
import { ShapeService } from './shape.service';
import * as _ from 'lodash';
import { DataService } from 'src/app/data.service';
import { createDocumentVar } from '../createdocument/createdocumentvariables';
import { CreateDocumentService } from './create-document.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentPagesService {
  
  
  

  seticonwidth:number= 0;
  seticonheight:number = 0;
  coordinateX:number = 0;
  coordinateY:number = 0;
  realWidth:number = 0;
  realHeight:number = 0;
  dbxposition:number = 0;
  dbyposition:number = 0;
  canvasElement:CanvasRenderingContext2D=null;
  createDocumentValues:createDocumentVar;

  constructor(private shapeService:ShapeService,private dataService:DataService,private documentService:CreateDocumentService) { 
    this.createDocumentValues = this.documentService.createDocumentStore_values;
    this.realWidth = this.createDocumentValues.document_width;
    this.realHeight = this.createDocumentValues.document_height;
  }


  changesvgpath(annotation_data: any, platform?: string, pngformat?: any) {
    
    let get_annotation_data = _.cloneDeep(annotation_data);
    let clone_receviedata = _.cloneDeep(annotation_data);
    let change_path = get_annotation_data.annotation_data;
    let convert_svg_path = "";
    let replace_negative_initial = change_path.replaceAll('--', '-n');
    let replace_negative_inside = replace_negative_initial.replaceAll(':-', ':n');
    let split_string = replace_negative_inside.split(' ');
    for (let a = 0; a < split_string.length; a++) {
      let hypen_split = split_string[a].split('-');
      if (hypen_split.length > 2) {
        let localString1 = hypen_split[1] + '-' + hypen_split[2];
        hypen_split = [hypen_split[0], localString1];
      }
      if (hypen_split != '') {
        var colonSplit = hypen_split[1].replaceAll('n', '-').split(":");
        colonSplit[0] = this.shapeService.scientificToDecimal(Number(colonSplit[0]));
        colonSplit[1] = this.shapeService.scientificToDecimal(Number(colonSplit[1]));
      }
      if (hypen_split[0] != 'drawRect' && hypen_split[0] != 'ovalIn') {
        var x = parseFloat(colonSplit[0]);
        var y = parseFloat(colonSplit[1]);
        switch (hypen_split[0]) {
          case "move":
            convert_svg_path = convert_svg_path != '' ? (convert_svg_path + ' M' + x + ' ' + y) : ('M' + x + ' ' + y);
            break;
          case "line":
            convert_svg_path = convert_svg_path != '' ? (convert_svg_path + ' L' + x + ' ' + y) : ('L' + x + ' ' + y);
            break;
          case "controlpoint1":
            var c1_x = x;
            var c1_y = y;
            break;
          case "controlpoint2":
            var c2_x = x;
            var c2_y = y;
            break;
          case "endCurve":
            var ecurve_x = x;
            var ecurve_y = y;
            convert_svg_path = convert_svg_path != '' ? (convert_svg_path + ` C${c1_x} ${c1_y} ${c2_x} ${c2_y} ${ecurve_x} ${ecurve_y}`) : `C${c1_x} ${c1_y} ${c2_x} ${c2_y} ${ecurve_x} ${ecurve_y}`;
            break;
          case "controlpoint":
            var camera_controlpoint_x = x;
            var camera_controlpoint_y = y;
            break;
          case "curveEnd":
            var camera_curveend_x = x;
            var camera_curveend_y = y;
            convert_svg_path = convert_svg_path != '' ? (convert_svg_path + ` Q${camera_controlpoint_x} ${camera_controlpoint_y} ${camera_curveend_x} ${camera_curveend_y}`) : `Q${camera_controlpoint_x} ${camera_controlpoint_y} ${camera_curveend_x} ${camera_curveend_y}`;
            break;
          case "ovalIn":
            break;
          // case "text":
          //   convert_svg_path = convert_svg_path != '' ? convert_svg_path + " "+ hypen_split.join("-") : hypen_split.join("-");
          //   break;
        }
      }
      else if (hypen_split[0] == 'ovalIn') {
        colonSplit[2] = this.shapeService.scientificToDecimal(Number(colonSplit[2]));
        colonSplit[3] = this.shapeService.scientificToDecimal(Number(colonSplit[3]));
      }
      else if (hypen_split[0] == 'drawRect') {
        colonSplit[2] = this.shapeService.scientificToDecimal(Number(colonSplit[2]));
        colonSplit[3] = this.shapeService.scientificToDecimal(Number(colonSplit[3]));
      }
      // The below line is added to avoid camera shape mismatch when it is added from ipad and displaying it in web.[P3X-2405]
      if(annotation_data.annotation_name=="Camera" && a>43){
        break;
      }

    }
    this.realWidth = this.createDocumentValues.document_width;
    this.realHeight = this.createDocumentValues.document_height;
    let ellipse = false;
    let rectangle = false;
    // check P2 or P3 annotations
    // find the x and y position inside json
    let p2Annotation = false;
    if (get_annotation_data.hasOwnProperty('initial_position_x') && get_annotation_data.hasOwnProperty('initial_position_y')) {
      this.coordinateX = Number(get_annotation_data.initial_position_x);
      this.coordinateY = Number(get_annotation_data.initial_position_y);
      if (this.coordinateX < 0 && this.coordinateY < 0) {
        this.coordinateX = -(this.coordinateX);
        this.coordinateY = -(this.coordinateY);
        p2Annotation = true;
      }
    }// toolbar custom shape does not have position
    else {
      let getannotation_bounds = this.shapeService.getCanvaswidthandHeight({ "toolbar_element_id": get_annotation_data['element_id'], "annotation_data": get_annotation_data['annotation_data'] })
      let initial_position_x = getannotation_bounds.left;
      let initial_position_y = getannotation_bounds.top;
      if (initial_position_x < 0 && initial_position_y < 0) {
        this.coordinateX = -(initial_position_x);
        this.coordinateY = -(initial_position_y);
        p2Annotation = true;
      }
    }
    if (p2Annotation == false) {
      var svg_position = this.getshapeDrawing(clone_receviedata, platform, pngformat);
    }
    else {
      var svg_position = this.getshapeDrawingP2P3(clone_receviedata, platform,pngformat);
    }
    get_annotation_data["width"] = svg_position.width;
    get_annotation_data["height"] = svg_position.height;
    get_annotation_data["left"] = svg_position.left;
    get_annotation_data["top"] = svg_position.top;
    get_annotation_data["viewbox"] = `${svg_position.translatex} ${svg_position.translatey} ${svg_position.width} ${svg_position.height}`;
    get_annotation_data["textshapetextx"] = svg_position.textshapetextx;
    get_annotation_data["textshapetexty"] = svg_position.textshapetexty;
    get_annotation_data["textfontSize"] = svg_position.textfontSize;
    get_annotation_data["breaktexts"] = svg_position.breaktexts;
    get_annotation_data["transform"] = svg_position.transform;
    let elementId = clone_receviedata.toolbar_element_id;
    //line width
    let accurateline_width = 1;
    accurateline_width = (Number(clone_receviedata.line_width) / 6);
    // The below lines are commented for line width mismatch issue with IPAD for free hand shapes.
    // if (elementId > 11) {
    //   accurateline_width = (Number(clone_receviedata.line_width) / 2);
    // }
    // else {
    //   accurateline_width = (Number(clone_receviedata.line_width) / 6);
    // }
    get_annotation_data["linewidth"] = accurateline_width;
    get_annotation_data.line_width = accurateline_width.toString();
    // stroke and fill colors
    get_annotation_data.fill_color = this.checkStrokeColor1(get_annotation_data.fill_color);
    if (elementId == 12 || elementId == 14 || elementId == 13 || elementId == 15 || elementId == 16) {
      get_annotation_data.fill_color = "none";
    }
    get_annotation_data.stroke_color = this.checkStrokeColor1(get_annotation_data.stroke_color);
    // ClosePath attached and annotation data svg changes.
    if (elementId == 17 || elementId == 18 || elementId == 1 || elementId == 8 || (elementId == 19 && get_annotation_data.annotation_data.includes('move')) ||
      (elementId == 20 && get_annotation_data.annotation_data.includes('move'))) {
      if (platform == 'layer') {
        // layer page annotation data back key only showing 
        get_annotation_data["annotation_data_svg"] = convert_svg_path + ' Z';
      }
      else {
        get_annotation_data.annotation_data = convert_svg_path + ' Z';
      }
    }
    else if (elementId == 19 && get_annotation_data.annotation_data.includes('ovalIn')) {
      let ellipse_svg_path = new Object();
      let lineWidth = get_annotation_data.linewidth;
      // adding +5 and +10 selection box space prupose
      ellipse_svg_path["cx"] = ((svg_position.width / 2) + 5) - lineWidth;
      ellipse_svg_path["cy"] = ((svg_position.height / 2) + 5) - lineWidth;
      ellipse_svg_path["rx"] = svg_position.width / 2 - (accurateline_width / 2);
      ellipse_svg_path["ry"] = svg_position.height / 2 - (accurateline_width / 2);
      get_annotation_data["ellipse"] = ellipse_svg_path;
      ellipse = true;
    }
    else if (elementId == 20 && get_annotation_data.annotation_data.includes('drawRect')) {
      let rectangle_svg_path = new Object();
      let lineWidth = get_annotation_data.linewidth; 
      // adding +5 and +10 selection box space prupose
      rectangle_svg_path["x"] = ((accurateline_width / 2) + 5) - lineWidth;
      rectangle_svg_path["y"] = ((accurateline_width / 2) + 5) - lineWidth;
      rectangle_svg_path["width"] = svg_position.width - (accurateline_width);
      rectangle_svg_path["height"] = svg_position.height - (accurateline_width);
      get_annotation_data["rectangle"] = rectangle_svg_path;
      rectangle = true;
    }
    else {
      if (platform == 'layer') {
        // layer page annotation data back key only showing 
        get_annotation_data["annotation_data_svg"] = convert_svg_path;
      }
      else {
        get_annotation_data.annotation_data = convert_svg_path;
      }
    }
    // ellipse and rectangle finding
    get_annotation_data["isEllipse"] = ellipse;
    get_annotation_data["isRectangle"] = rectangle;

    // selection box space function
    if (elementId > 11 || (Number(get_annotation_data.initial_width) != 0 || Number(get_annotation_data.initial_height) != 0)) {
      // adding +5 and +10 selection box space prupose
      get_annotation_data["width"] = svg_position.width + 10;
      get_annotation_data["height"] = svg_position.height + 10;
      get_annotation_data["left"] = svg_position.left - 5;
      get_annotation_data["top"] = svg_position.top - 5;
      let add_space_horizontal = svg_position.width + 10;
      let add_space_vertical = svg_position.height + 10;
      if (elementId != 19 && elementId != 20) {
        svg_position.translatex = svg_position.translatex - 5;
        svg_position.translatey = svg_position.translatey - 5;
        get_annotation_data["viewbox"] = `${svg_position.translatex} ${svg_position.translatey} ${add_space_horizontal} ${add_space_vertical}`;
      }
      else if ((elementId == 19 && get_annotation_data.annotation_data.includes('M')) || (elementId == 20 && get_annotation_data.annotation_data.includes('M'))) {
        svg_position.translatex = svg_position.translatex - 5;
        svg_position.translatey = svg_position.translatey - 5;
        get_annotation_data["viewbox"] = `${svg_position.translatex} ${svg_position.translatey} ${add_space_horizontal} ${add_space_vertical}`;
      }
      else {
        get_annotation_data["viewbox"] = `${svg_position.translatex} ${svg_position.translatey} ${add_space_horizontal} ${add_space_vertical}`;
      }
    }
    get_annotation_data["left"] = get_annotation_data["left"] < 0 ? 0 : get_annotation_data["left"];
    get_annotation_data["top"] = get_annotation_data["top"] < 0 ? 0 : get_annotation_data["top"];
    return get_annotation_data;
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
        case "magenta":
          return "#C832B1";
        case "cyan":
          return "#80F1FE";
        case "brown":
          return "#7C4E40";
        case "grey":
          return "#949494";
        case "gray":
          return "#949494";
        case "medium_grey":
          return "#CCCCCC";
        case "light_grey":
          return "#000000";
        case "black":
          return "#000000";
        case "dark gray":
          return "#949494";
        case "light gray":
          return "#CCCCCC";
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

  getshapeDrawing(getData,platform?:string,pngformat?:any) {
    let svg_width = 0;
    let svg_height = 0;
    let svg_left = 0;
    let svg_top = 0;
    let translate_x = 0;
    let translate_y= 0;
    let svg_transform = null;
    var elementId = Number(getData.toolbar_element_id);
    if(pngformat!=undefined && pngformat==false){
      var pdfImg = document.getElementById("pdfannotationhead");  
    }
    else{
      var pdfImg = document.getElementById("pdfImg");
    }
    var newcreatedElement = document.createElement("canvas");
    newcreatedElement.setAttribute("documentCanvas", "1");
    newcreatedElement.className = 'annot_canvas';
    getData.initial_height = Number(getData.initial_height);
    getData.initial_width = Number(getData.initial_width);
    var getHeight;
    var getWidth;
    let linewidthCount = 0;
    if (elementId > 11) {
      linewidthCount = (Number(getData.line_width) / 2);
      if(elementId == 20 || elementId == 19){
        let lineWidth = Number(getData.line_width) / 2;
        getData.line_width = lineWidth.toString();
      }
    }
    else {
      linewidthCount = (Number(getData.line_width) / 6);
    }
    // ** If there is no value it should be remove annotation label start
    this.annotation_label_removed(getData);
    var shapeStringValueTemp = this.shapeService.getCanvaswidthandHeight(getData);
    if (getData.initial_width <= 0 && getData.initial_height <= 0 && elementId >= 12 && elementId <= 18) {
      let getDrawWidthandHeight = this.shapeService.getCanvaswidthandHeight(getData);
      if (Number(getData.initial_position_x) != 0) {
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
        if (getData.line_width > 20) {
          getWidth = getDrawWidthandHeight.width + (Number(getData.line_width) * 4);
          getHeight = getDrawWidthandHeight.height + (Number(getData.line_width) * 4);
        }
        else {
          getWidth = getDrawWidthandHeight.width + (Number(getData.line_width));
          getHeight = getDrawWidthandHeight.height + (Number(getData.line_width));
        }
      }
      else {
        if (getData.line_width > 20) {
          getWidth = getDrawWidthandHeight.width + (Number(getData.line_width));
          getHeight = getDrawWidthandHeight.height + (Number(getData.line_width));
        }
        else {
          getWidth = getDrawWidthandHeight.width + (Number(getData.line_width));
          getHeight = getDrawWidthandHeight.height + (Number(getData.line_width));
        }
      }
    }
    else if (getData.initial_width != 0 && getData.initial_height != 0 && elementId >= 12 && elementId <= 18) {
        getHeight = getData.initial_height + Number(getData.line_width);
        getWidth = getData.initial_width + Number(getData.line_width);
    }
    else if (elementId <= 11 && getData.initial_height != 0 && getData.initial_width != 0) {
      this.coordinateX = getData.initial_position_x;
      this.coordinateY = getData.initial_position_y;
      getWidth = Number(getData.initial_width) + (Number(getData.line_width) / (6));
      getHeight = Number(getData.initial_height) + (Number(getData.line_width) / (6));
    }
    else if (elementId < 11) {
      if ((this.seticonwidth == undefined || this.seticonwidth == 0) && (this.seticonheight == undefined || this.seticonheight == 0)) {
        getWidth = 35 + linewidthCount;
        getHeight = 35 + linewidthCount;
      }
      else {
        getWidth = this.seticonwidth + linewidthCount;
        getHeight = this.seticonheight + linewidthCount;
      }
      svg_width = getWidth;
      svg_height = getWidth;
    }
    else if (elementId == 19 || elementId == 20) {
      if (getData.annotation_data.includes('move') && getData.initial_width != 0 && getData.initial_height != 0) {
        let getDrawWidthandHeight = this.shapeService.getCanvaswidthandHeight(getData);
        getWidth = getDrawWidthandHeight.width + (Number(getData.line_width) / 2);
        getHeight = getDrawWidthandHeight.height + (Number(getData.line_width) / 2);
        this.coordinateX = Number(getData.initial_position_x) - 35 - ((Number(getData.line_width) / 2) / 2);
        this.coordinateY = Number(getData.initial_position_y) - 35 - ((Number(getData.line_width) / 2) / 2);
      }
      else if (getData.annotation_data.includes('move') && getData.initial_position_x != 0 && getData.initial_position_y != 0) {
        let getDrawWidthandHeight = this.shapeService.getCanvaswidthandHeight(getData);
        getWidth = getDrawWidthandHeight.width + (Number(getData.line_width));
        getHeight = getDrawWidthandHeight.height + (Number(getData.line_width));
        this.coordinateX = Number(getData.initial_position_x) - (getDrawWidthandHeight.width/2) - ((Number(getData.line_width) / 2)) + 35;
        this.coordinateY = Number(getData.initial_position_y) - (getDrawWidthandHeight.height/2) - ((Number(getData.line_width) / 2)) + 35;
      }
      else {
        // changing code
        if(getData.annotation_data.includes('move')){
          let repoint_shape = this.shapeService.getCanvaswidthandHeight(getData);
          getWidth = repoint_shape.width + (Number(getData.line_width));
          getHeight = repoint_shape.height + (Number(getData.line_width));
          this.coordinateX = Number(repoint_shape.left)- ((Number(getData.line_width) / 2)); 
          this.coordinateY = Number(repoint_shape.top)- ((Number(getData.line_width) / 2));
        }
        else{
          let stringValue = getData.annotation_data;
          let splitString = stringValue.replaceAll('--', '-n');
          splitString = splitString.replaceAll(':-', ':n');
          let hypenSplitCD = splitString.split("-");
          let colonSplitCD = hypenSplitCD[1].replaceAll('n', '-').split(":");
          // add negative value reduce the x and y in normal shapes
          colonSplitCD[0] = Number(colonSplitCD[2]) < 0 ? Number(colonSplitCD[0]) + Number(colonSplitCD[2]) : Number(colonSplitCD[0]);
          colonSplitCD[1] = Number(colonSplitCD[3]) < 0 ? Number(colonSplitCD[1]) + Number(colonSplitCD[3]) : Number(colonSplitCD[1]);

          colonSplitCD[0] = Number(colonSplitCD[0]) < 0 ? - (Number(colonSplitCD[0])) : Number(colonSplitCD[0]);
          colonSplitCD[1] = Number(colonSplitCD[1]) < 0 ? - (Number(colonSplitCD[1])) : Number(colonSplitCD[1]);
          // let negativeElipseRectX = colonSplitCD[2] < 0 ? true : false;
          // let negativeElipseRectY = colonSplitCD[3] < 0 ? true : false;  
          colonSplitCD[2] = Number(colonSplitCD[2]) < 0 ? - (Number(colonSplitCD[2])) : Number(colonSplitCD[2]);
          colonSplitCD[3] = Number(colonSplitCD[3]) < 0 ? - (Number(colonSplitCD[3])) : Number(colonSplitCD[3]);
          
          if (elementId == 19) {
            getWidth = Number(colonSplitCD[2]) + Number(getData.line_width) / (2);
            getHeight = Number(colonSplitCD[3]) + Number(getData.line_width) / (2);
          }
          else {
            getWidth = Number(colonSplitCD[2]) + Number(getData.line_width) / (2);
            getHeight = Number(colonSplitCD[3]) + Number(getData.line_width) / (2);
          }
          if (Number(getData.initial_width) != 0 && Number(getData.initial_height) != 0) {
            this.coordinateX = Number(getData.initial_position_x);
            this.coordinateY = Number(getData.initial_position_y);
            this.coordinateY = this.coordinateY - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
            this.coordinateX = this.coordinateX - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
            // commented by ganesh at 04.06.2021 purpose of rectange position change after move
            // getData.initial_width = 0;
            // getData.initial_height = 0;
            // getData.initial_position_x = 0;
            // getData.initial_position_y = 0;
          }
          else if (Number(getData.initial_position_x) != 0 && Number(getData.initial_position_y) != 0) {
            this.coordinateX = Number(getData.initial_position_x);
            this.coordinateY = Number(getData.initial_position_y);
            this.coordinateY = this.coordinateY - (getHeight / 2);
            this.coordinateX = this.coordinateX - (getWidth / 2);
          }
          else {
            // if(negativeElipseRectX){
            //   
            //   this.coordinateX = -(colonSplitCD[2]) < 0 ? -(colonSplitCD[0]) + colonSplitCD[2] - ((Number(getData.line_width) / 2) / 2) : colonSplitCD[0] - ((Number(getData.line_width) / 2) / 2);
            // }
            // if(negativeElipseRectY){
            //   this.coordinateY = -(colonSplitCD[3]) < 0 ? -(colonSplitCD[1]) + colonSplitCD[3] - ((Number(getData.line_width) / 2) / 2) : colonSplitCD[1] - ((Number(getData.line_width) / 2) / 2);
            // }
            // if(!negativeElipseRectX && !negativeElipseRectY){
            //Jose Added condition to include line width alone for eclipes alone
            if (elementId == 19) {
              this.coordinateX = colonSplitCD[0] - (linewidthCount/2);
              this.coordinateY = colonSplitCD[1] - (linewidthCount/2);
            } else {
              this.coordinateX = colonSplitCD[0] - ((Number(getData.line_width) / 2) / 2);
              this.coordinateY = colonSplitCD[1] - ((Number(getData.line_width) / 2) / 2);
            }
          }
        }
      }
    }
    if (
      elementId == 12 ||
      elementId == 17 ||
      elementId == 18 ||
      elementId == 14 ||
      elementId == 13 ||
      elementId == 19 ||
      elementId == 20 ||
      elementId == 15 ||
      elementId == 16
    ) {
      newcreatedElement.setAttribute("id", getData.annotation_id);
      var complexElementWidth = 0;
      var complexElementHeight = 0;
      if ((elementId == 13 || elementId == 14) && getData.initial_height == 0) {
        newcreatedElement.setAttribute("width", getWidth);
        newcreatedElement.setAttribute("height", getHeight);
        complexElementWidth = getWidth;
        complexElementHeight = getHeight;
      }
      else if (elementId != 19 && elementId != 20 && getData.initial_height == 0) {
        newcreatedElement.setAttribute("width", getWidth);
        newcreatedElement.setAttribute("height", getHeight);
        complexElementWidth = getWidth;
        complexElementHeight = getHeight;
      }
      else {
        newcreatedElement.setAttribute("width", getWidth);
        newcreatedElement.setAttribute("height", getHeight);
        complexElementWidth = getWidth;
        complexElementHeight = getHeight;
      }

      if (getData.initial_width != 0 && getData.initial_height != 0 && (elementId >= 12 && elementId <= 18)) {
        var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
        //translate purpose added.
        let topResizeSimple = 0;
        let leftResizeSimple = 0;
        if (shapeStringValueTemp.width < 2 || shapeStringValueTemp.height < 2) {
          newcreatedElement.style.top = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
          newcreatedElement.style.left = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
          topResizeSimple = this.coordinateY - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
          leftResizeSimple = this.coordinateX - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
          if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "" && platform=='document') {
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
          }
        }
        else {
          newcreatedElement.style.top = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2)) + 'px';
          newcreatedElement.style.left = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2)) + 'px';
          topResizeSimple = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2));
          leftResizeSimple = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2));
          if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "" && platform=='document') {
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
          }
        }
      }
      else if (getData.initial_position_x != 0 && getData.initial_position_y != 0 && (elementId >= 12 && elementId <= 18)) {
       var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
        let topResizeSimple = 0;
        let leftResizeSimple = 0;
        
        if (shapeStringValueTemp.width < 2 || shapeStringValueTemp.height < 2) {
          newcreatedElement.style.top = Number(this.coordinateY) - (newcreatedElement.height / 2) + 'px';
          newcreatedElement.style.left = Number(this.coordinateX) - (newcreatedElement.width / 2) + 'px';
          topResizeSimple = Number(this.coordinateY) - (newcreatedElement.height / 2);
          leftResizeSimple = Number(this.coordinateX) - (newcreatedElement.width / 2);
          if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "" && platform=='document') {
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
          }
        }
        else {
          newcreatedElement.style.top = Number(this.coordinateY) - (newcreatedElement.height / 2) + 'px';
          newcreatedElement.style.left = Number(this.coordinateX) - (newcreatedElement.width / 2) + 'px';
          topResizeSimple = Number(this.coordinateY) - (newcreatedElement.height / 2);
          leftResizeSimple = Number(this.coordinateX) - (newcreatedElement.width / 2);
          if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "" && platform=='document') {
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
          }
        }
      }
      else if (elementId == 19 || elementId == 20) {
        if (getData.annotation_data.includes('move') && elementId == 19 && getData.initial_height != 0) {
          var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
          //translate purpose added
          newcreatedElement.style.top = Number(getData.initial_position_y) - (17.5) - ((Number(getData.line_width) / 2)) + "px";
          newcreatedElement.style.left = Number(getData.initial_position_x) - (17.5) - ((Number(getData.line_width) / 2)) + "px";
          if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "") {
            let topResizeSimple = Number(getData.initial_position_y) - (35) + 10;
            let leftResizeSimple = Number(getData.initial_position_x) - (35) + 10;
            if(getData.annotation_label!=undefined && getData.annotation_label!="" && platform=='document'){
              this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
            }
          }
        }
        else if (getData.annotation_data.includes('move') && elementId == 20 && getData.initial_height != 0) {
          var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
          newcreatedElement.style.top = Number(getData.initial_position_y) - (17.5) + "px";
          newcreatedElement.style.left = Number(getData.initial_position_x) - (17.5) + "px";
          if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "") {
            let topResizeSimple = Number(getData.initial_position_y) - (17.5);
            let leftResizeSimple = Number(getData.initial_position_x) - (17.5);
            if(getData.annotation_label!=undefined && getData.annotation_label!="" &&platform=='document'){
              this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
            }
          }
        }
        else if (getData.annotation_data.includes('move') && elementId == 19 && getData.initial_position_x != 0) {
          var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
          newcreatedElement.style.top = Number(this.coordinateY) - (35) + "px";
          newcreatedElement.style.left = Number(this.coordinateX) - (35) + "px";
          if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "") {
            let topResizeSimple = Number(this.coordinateY) - (35);
            let leftResizeSimple = Number(this.coordinateX) - (35);
            if(getData.annotation_label!=undefined && getData.annotation_label!="" && platform=='document'){
              this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
            }
          }
        }
        else if (getData.annotation_data.includes('move') && elementId == 20 && getData.initial_position_x != 0) {
          var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
          newcreatedElement.style.top = Number(this.coordinateY) - (35) + "px";
          newcreatedElement.style.left = Number(this.coordinateX) - (35) + "px";
          if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "") {
            let topResizeSimple = Number(this.coordinateY) - (35);
            let leftResizeSimple = Number(this.coordinateX) - (35);
            if(getData.annotation_label!=undefined && getData.annotation_label!="" && platform=='document'){
              this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
            }
          }
        }
        else if (getData.annotation_data.includes('move') && (elementId == 20 || elementId == 19)) {
          var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
          newcreatedElement.style.top = Number(this.coordinateY) + "px";
          newcreatedElement.style.left = Number(this.coordinateX) + "px";
          // changing code 26.10.2021 reason ticket no:391 repoint and resize ellipse when hit resizeincrease button moving left and top position issue 
          // newcreatedElement.style.top = Number(this.coordinateY) - ((Number(getData.line_width) / 2)) + "px";
          // newcreatedElement.style.left = Number(this.coordinateX) - ((Number(getData.line_width) / 2)) + "px";
          if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "") {
            let topResizeSimple = Number(this.coordinateY);
            let leftResizeSimple = Number(this.coordinateX);
            if(getData.annotation_label!=undefined && getData.annotation_label!="" && platform=='document'){
              this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
            }
          }
        }
        else {
          // var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
          newcreatedElement.style.top = this.coordinateY + "px";
          newcreatedElement.style.left = this.coordinateX + "px";
          if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "" && platform=='document') {
            this.shapeService.mainDrawingLabel(getData, pdfImg, this.coordinateX, this.coordinateY, complexElementWidth, complexElementHeight);
          }
        }
      }
      else {
        var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
        let topResizeSimple = 0;
        let leftResizeSimple = 0;
        newcreatedElement.style.top = this.coordinateY - (Number(getData.line_width) / 2) + "px";
        newcreatedElement.style.left = this.coordinateX - (Number(getData.line_width) / 2) + "px";
        svg_left = Number(this.coordinateX) - (Number(getData.line_width) / 2);
        svg_top = Number(this.coordinateY) - (Number(getData.line_width) / 2);
        topResizeSimple = Number(this.coordinateY) - (Number(getData.line_width) / 2);
        leftResizeSimple = Number(this.coordinateX) - (Number(getData.line_width) / 2);
        if (getData.line_width > 20) {
          let cloneLineWidthChange = _.cloneDeep(getData);
          let getStringMethod = this.shapeService.resizeFunctionLineWidth(cloneLineWidthChange, false, newcreatedElement.width, newcreatedElement.height);
          getData.annotation_data = getStringMethod.shapeString;
          newcreatedElement.style.top = this.coordinateY - (Number(getData.line_width) / 2) - getStringMethod.yDifference + "px";
          newcreatedElement.style.left = this.coordinateX - (Number(getData.line_width) / 2) - getStringMethod.xDifference + "px";
          topResizeSimple = Number(this.coordinateY) - (Number(getData.line_width) / 2) - getStringMethod.yDifference;
          leftResizeSimple = Number(this.coordinateX) - (Number(getData.line_width) / 2) - getStringMethod.xDifference;
        }
        if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "" && platform=='document') {
          this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight,false);
        }
      }
    }
    else if (
      elementId == 15 ||
      elementId == 16
    ) {
      newcreatedElement.setAttribute("id", getData.annotation_id);
      newcreatedElement.setAttribute("width", getWidth + getData.line_width + getData.line_width + 10);
      newcreatedElement.setAttribute("height", getHeight + getData.line_width + getData.line_width + 10);
      newcreatedElement.style.top = this.coordinateY - getData.line_width - getData.line_width + "px";
      newcreatedElement.style.left = this.coordinateX - getData.line_width - getData.line_width + "px";
      newcreatedElement.style.marginTop = -getData.line_width - 2.5 + "px";
      newcreatedElement.style.marginLeft = -getData.line_width - 2.5 + "px";
    }
    else if (elementId == 11) {
      var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
      var getText = getData.annotation_data.split('text-');
      if (typeof getText[1] != undefined) {
        if (getData.hasOwnProperty("annotation_label") && getData.annotation_label.trim() != '') {
          let textvalue = getData.annotation_label.trim();
          getText.push(textvalue);
        }
        else {
          let textvalue = "     ";
          getText.push(textvalue);
        }
      }
      getText[1] = getText[1].replaceAll("`~", " ");
      getText[1] = getText[1].replaceAll("~`", "-");
      getText[1] = getText[1].replaceAll("~~~", ":");
      newcreatedElement.setAttribute("id", getData.annotation_id);
      let textCount = 20;
      if (getText[1].length < 5) {
        textCount = 27;
      }
      else if (getText[1].length > 12) {
        textCount = 12;
      }
      if (Number(getData.initial_width) == 0) {
        var fontsize;
        if(getData.text_font_size!=""){
          fontsize = getData.text_font_size;
        }
        else{
          fontsize = "14";
        }
        let text_shape_height = 50;
        var numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;
        if (numberOfLineBreaks > 0) {
          numberOfLineBreaks = numberOfLineBreaks + 1;
          text_shape_height = numberOfLineBreaks * 25;
        }
        else {
          text_shape_height = 50;
        }
        let canvas12 = document.createElement("canvas");
        canvas12.style.width = "200px";
        let context = canvas12.getContext("2d");
        context.font = `${fontsize}px times new roman`;
        context.fillText(getText[1], 0, 0);
        var fontHeight = parseInt(context.font);
        var widthget = context.measureText(getText[1]).width;
        if(numberOfLineBreaks!=0){
          widthget = widthget /  numberOfLineBreaks;
        }
        var formattedWidth = Math.ceil(widthget);
        formattedWidth = formattedWidth;
        canvas12.innerHTML = getText[1];
        canvas12.style.fontWeight = "500";
        canvas12.style.fontSize = fontsize + "px";
        var textWidth = formattedWidth;
        let currentAnnotationData = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10 text-" + getText[1] + "";
        let cloneGetData = _.cloneDeep(getData);
        let getShapeStringWidth = this.shapeService.getCanvaswidthandHeight(cloneGetData);
        var textshapewidth = getShapeStringWidth.width;
        var textshapeheight = getShapeStringWidth.height;
        // getData.annotation_data = currentAnnotationData;
        var newOne = textshapewidth + 25;
        // let text_shape_height = 50;
        // let numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;
        // if (numberOfLineBreaks > 0) {
        //   numberOfLineBreaks = numberOfLineBreaks + 1;
        //   text_shape_height = numberOfLineBreaks * 25;
        // }
        // else {
        //   text_shape_height = 50;
        // }
        newcreatedElement.setAttribute("width", newOne.toString());
        newcreatedElement.setAttribute("height", ((Number(getData.line_width) / 2) + text_shape_height).toString());
        var textShapexyWidth = (newOne - textshapewidth) / 2;
        textShapexyWidth = textShapexyWidth < 0 ? -(textShapexyWidth) : textShapexyWidth;
        var textShapexyHeight = (text_shape_height - textshapeheight) / 2;
        textShapexyWidth = textShapexyWidth;
        let textshapetop = Number(this.coordinateY) - (newcreatedElement.height / 2);
        let textshapeleft = Number(this.coordinateX) - (newcreatedElement.width / 2);
        textshapetop = textshapetop < 0 ? 0 : textshapetop;
        textshapeleft = textshapeleft < 0 ? 0 : textshapeleft;
        let canvasRightSideCheck = newOne + textshapeleft;
        // if (this.realWidth < canvasRightSideCheck) {
        //   var checkDifference = canvasRightSideCheck - this.realWidth;
        //   console.log(checkDifference);
        //   textshapeleft = textshapeleft - checkDifference;
        //   console.log(textshapeleft);
        // }
        newcreatedElement.style.top = textshapetop + "px";
        newcreatedElement.style.left = textshapeleft + "px";
        svg_left = textshapeleft;
        svg_top = textshapetop;
        //THe below lines are added for removing the label for annotation while changing shapes using attributes.
        //Used only while changing normal shape(with label) to text label annotation.Ticket number P3X-1635.
        if (getData.annotation_label!=undefined && getData.annotation_label != "") {
          let get_label_Element = document.getElementById("label" + getData.annotation_id);
          if(get_label_Element!=null){
            get_label_Element.remove();
          }
        }
      }
      else if (Number(getData.initial_width) != 0) {
        let cloneGetData = _.cloneDeep(getData);
        cloneGetData.annotation_data = getText[0];
        let getShapeStringWidth = this.shapeService.getCanvaswidthandHeight(cloneGetData);
        var textWidth = Number(getData.initial_width);
        let textHeight = Number(getData.initial_height) + (Number(getData.line_width) / 6);
        var textshapewidth = getShapeStringWidth.width;
        var textshapeheight = getShapeStringWidth.height;
        var newOne = textshapewidth + 25;
        let text_shape_height = getShapeStringWidth.height;
        let numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;
        if (numberOfLineBreaks > 0) {
          numberOfLineBreaks = numberOfLineBreaks + 1;
          text_shape_height = numberOfLineBreaks * 25;
        }
        else {
          text_shape_height = 50;
        }
        newcreatedElement.setAttribute("width", (textWidth).toString());
        newcreatedElement.setAttribute("height", (textHeight).toString());
        var textShapexyWidth = (newOne - textshapewidth) / 2;
        textShapexyWidth = textShapexyWidth < 0 ? -(textShapexyWidth) : textShapexyWidth;
        var textShapexyHeight = (text_shape_height - textshapeheight) / 2;
        textShapexyWidth = textShapexyWidth;
        let subtractX = this.coordinateX - 17.5 - (newcreatedElement.width / 2);
        let subtractY = this.coordinateY - 17.5 - (newcreatedElement.height / 2);
        subtractX = subtractX < 0 ? 0 : subtractX;
        subtractY = subtractY < 0 ? 0 : subtractY;
        let canvasRightSideCheck = newOne + subtractX;
        if (this.realWidth < canvasRightSideCheck) {
          var checkDifference = canvasRightSideCheck - this.realWidth;
          console.log(checkDifference);
          subtractX = subtractX - checkDifference;
          console.log(subtractX);
        }
        newcreatedElement.style.top = Number(subtractY) + "px";
        newcreatedElement.style.left = Number(subtractX) + "px";
        if (getData.annotation_label!=undefined && getData.annotation_label != "") {
          let get_label_Element = document.getElementById("label" + getData.annotation_id);
          if(get_label_Element!=null){
            get_label_Element.remove();
          }
        }
      }
    }
    else {
      var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
      newcreatedElement.setAttribute("id", getData.annotation_id);
      newcreatedElement.setAttribute("width", getWidth);
      newcreatedElement.setAttribute("height", getHeight);
      if (Number(getData.initial_height) != 0 && Number(getData.initial_width) != 0) {
        // let subtractX = this.dbxposition - 17.5;
        // let subtractY = this.dbyposition - 17.5;
        // 17.5 px added predefined shapes resized ipad and wev position mismatche fixes.
        let subtractX = Number(this.coordinateX) - 17.5;
        let subtractY = Number(this.coordinateY) - 17.5;
        let line_width_reduce = ((Number(getData.line_width) / 6)/2);
        newcreatedElement.style.top = subtractY - line_width_reduce + "px";
        newcreatedElement.style.left = subtractX - line_width_reduce + "px";
        if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "" && platform=='document') {
          let topResizeSimple = subtractY - line_width_reduce;
          let leftResizeSimple = subtractX - line_width_reduce;
          if(getData.annotation_label!=undefined && getData.annotation_label!="" && platform=="document"){
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
          }
        }
      }
      else {
        newcreatedElement.style.top = Number(this.coordinateY) + "px";
        newcreatedElement.style.left = Number(this.coordinateX) + "px";
        newcreatedElement.style.marginLeft = -getWidth / 2 + "px";
        newcreatedElement.style.marginTop = -getHeight / 2 + "px";
        //svg position purpose
        svg_left = Number(this.coordinateX)  - (getWidth / 2);
        svg_top = this.coordinateY - (getHeight / 2);
        if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "" && platform=='document') {
          let topResizeSimple = Number(this.coordinateY);
          let leftResizeSimple = Number(this.coordinateX);
          if(getData.annotation_label!=undefined && getData.annotation_label!="" && platform=="document"){
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight,false,0,0);
          }
        }
      }
    }
    // if(getData.annotation_label.trim()!=""){
    //   this.shapeService.mainDrawingLabel(getData,pdfImg,newcreatedElement.style.top,newcreatedElement.style.left);
    // }
    pdfImg.appendChild(newcreatedElement);
    this.canvasElement = newcreatedElement.getContext("2d");
    this.canvasElement.beginPath();
    // To Repoint the drawn shape inside the canvas center.
    // --------------
    if (getStringWidth != undefined) {
      let translateWidth = getStringWidth.width - newcreatedElement.width;
      let translateHeight = getStringWidth.height - newcreatedElement.height;
      let translateX = (translateWidth / 2) + getStringWidth.left;
      let translateY = (translateHeight / 2) + getStringWidth.top;
      translate_x = translateX;
      translate_y = translateY;
    } 
    //Rotate shape drawing setup start
    if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && (elementId < 12 || elementId >= 19)) {
      newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';
      svg_transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')'
    }
    if (elementId == 11) {
      if (Number(getData.initial_width) == 0) {
        newcreatedElement.setAttribute("width", (newOne + (Number(getData.line_width) / 6)).toString());
        let textshapetop = Number(this.coordinateY) - (newcreatedElement.height / 2);
        let textshapeleft = Number(this.coordinateX) - (newcreatedElement.width / 2);
        textshapetop = textshapetop < 0 ? 0 : textshapetop;
        textshapeleft = textshapeleft < 0 ? 0 : textshapeleft;
        let canvasRightSideCheck = newOne + textshapeleft;
        if (this.realWidth < canvasRightSideCheck) {
          var checkDifference = canvasRightSideCheck - this.realWidth;
          textshapeleft = textshapeleft - checkDifference;
        }
        newcreatedElement.style.top = textshapetop + "px";
        newcreatedElement.style.left = textshapeleft + "px";
        textShapexyWidth = (newcreatedElement.width - textshapewidth) / 2;
        textShapexyWidth = textShapexyWidth < 0 ? -(textShapexyWidth) : textShapexyWidth;
        textShapexyHeight = (newcreatedElement.height - textshapeheight) / 2;
        svg_left = textshapeleft;
        svg_top = textshapetop;
      }
      else if (Number(getData.initial_width) != 0) {
        var textWidth = Number(getData.initial_width) + (Number(getData.line_width) / 2);
        let textHeight = Number(getData.initial_height) + (Number(getData.line_width) / 2);
        newcreatedElement.setAttribute("width", (textWidth).toString());
        newcreatedElement.setAttribute("height", (textHeight).toString());
        let subtractX = this.coordinateX - 17.5 - ((Number(getData.line_width) / 2) / 2);
        let subtractY = this.coordinateY - 17.5 - ((Number(getData.line_width) / 2) / 2);
        subtractX = subtractX < 0 ? 0 : subtractX;
        subtractY = subtractY < 0 ? 0 : subtractY;
        let canvasRightSideCheck = newOne + subtractX;
        if (this.realWidth < canvasRightSideCheck) {
          var checkDifference = canvasRightSideCheck - this.realWidth;
          console.log(checkDifference);
          subtractX = subtractX - checkDifference;
          console.log(subtractX);
        }
        newcreatedElement.style.top = Number(subtractY) + "px";
        newcreatedElement.style.left = Number(subtractX) + "px";
      }
    }
    if(elementId == 11){
      var x_value_text = 0;
      getData.annotation_data = getData.annotation_data.trim();
      let annotation_data = getData.annotation_data;
      let replace_negative_initial = annotation_data.replaceAll('--', '-n');
      let replace_negative_inside = replace_negative_initial.replaceAll(':-', ':n');
      let split_string = replace_negative_inside.split(' ');
      let hypen_split = split_string[1].split('-');
      if (hypen_split.length > 2) {
        let localString1 = hypen_split[1] + '-' + hypen_split[2];
        hypen_split = [hypen_split[0], localString1];
      }
      if (hypen_split != '') {
        var colonSplit = hypen_split[1].replaceAll('n', '-').split(":");
        colonSplit[0] = this.shapeService.scientificToDecimal(Number(colonSplit[0]));
        colonSplit[1] = this.shapeService.scientificToDecimal(Number(colonSplit[1]));
      }
      x_value_text = Math.round(parseFloat(colonSplit[0]));
      if (getData.annotation_label != undefined && getData.annotation_label != "") {
        if(fontsize==undefined){
          fontsize = Number(getData.text_font_size);
        }
        var font_size:any = Number(fontsize);
        let previous_width = 29;
        let previous_height = 20;
        let current_width = 29;
        let current_height = 20;
        var ypositionCalc_text = 0;
        var calculate_height = 13;
        let width_value_enable = false;
        // check line breaks
        var breaktexts = getData.annotation_label.split('\n');
        if(breaktexts == undefined){
          breaktexts == null;
        }
        let numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;
        // multi line handled
        numberOfLineBreaks = (numberOfLineBreaks + 1);
        // single line text convert 2 number of lines
        let original_lines = numberOfLineBreaks;
        numberOfLineBreaks = numberOfLineBreaks == 1 ? 2 : numberOfLineBreaks;
        // check line breaks
        // font size check area start
        if(Number(getData.initial_width)!=0 && Number(getData.initial_height)!=0){
          // current_width = Number(getData.initial_width) - x_value_text;
          // current_height = Number(getData.initial_height);
          let getShapeStringWidthHeight = this.shapeService.getCanvaswidthandHeight(getData);
          current_width = getShapeStringWidthHeight.width;
          current_height = getShapeStringWidthHeight.height;

          let get_scale_width = current_width / previous_width;
          let get_scale_height = current_height / previous_height;
          var fsize = Number(getData.text_font_size);
          font_size = get_scale_width > get_scale_height ? fsize * get_scale_height : fsize * get_scale_width;
          calculate_height = font_size - 1;
          font_size = font_size - 1;
          if (breaktexts.length > 1) {
            if (get_scale_width > get_scale_height) {
              // divide line breaks based font size like fontsize/threelines = 60/3 = 20 
              font_size = font_size / breaktexts.length;
            }
            else{
              width_value_enable = true;
              font_size = font_size;
            }
          }
        }
        else{
          let getShapeStringWidthHeight = this.shapeService.getCanvaswidthandHeight(getData);
            
            if(font_size==13){
              current_width = getShapeStringWidthHeight.width;
              current_height = getShapeStringWidthHeight.height;
            }
            else{
              current_width = widthget;
              current_height = fontHeight;
            }
          font_size = font_size;
          calculate_height = fontHeight;
        }
        // font size check area end
        // yPosition check area start
        let get_large_height = newcreatedElement.height;
        let get_min_height = shapeStringValueTemp.height;
        let check_height_difference_normal = 0;
        if (shapeStringValueTemp.height <= newcreatedElement.height) {
          get_large_height = newcreatedElement.height;
          get_min_height = shapeStringValueTemp.height;
          check_height_difference_normal = newcreatedElement.height - shapeStringValueTemp.height;
        }
        else {
          get_large_height = shapeStringValueTemp.height;
          get_min_height = newcreatedElement.height;
          check_height_difference_normal = shapeStringValueTemp.height - newcreatedElement.height;
        }
        let assign_label = document.createElement('label');
        assign_label.innerHTML = getData.annotation_label;
        assign_label.style.fontSize = font_size + 'px';
        pdfImg.appendChild(assign_label);
        let element_details = {"height":(assign_label.clientHeight-font_size),"width":assign_label.clientWidth};
        let final_y_position = 0;
        if(original_lines==1){
          final_y_position = (shapeStringValueTemp.height/2) + (check_height_difference_normal/2) + (element_details.height/numberOfLineBreaks); 
          if(getData.initial_width!=0 && getData.initial_height!=0){
            let difference_height = current_height - calculate_height;
            let y_center_position = difference_height/2;
            ypositionCalc_text = (newcreatedElement.height/2) + y_center_position; 
          }
          else{
            ypositionCalc_text = (final_y_position/numberOfLineBreaks); 
          }
        }
        else{ 
          // if center position find and else part normal shape without resize
          if(getData.initial_width!=0 && getData.initial_height!=0){
            if(width_value_enable==true){
              // single character handling 
              let difference_height = current_height - (calculate_height * numberOfLineBreaks);
              difference_height = difference_height < 0 ? -(difference_height) : difference_height;
              let y_center_position = difference_height / 2;
              // final_y_position = (shapeStringValueTemp.height/2) + (check_height_difference_normal/2) + ((element_details.height * numberOfLineBreaks)/numberOfLineBreaks); 
              final_y_position = (shapeStringValueTemp.height / 2) + (check_height_difference_normal / 2);
              ypositionCalc_text = (final_y_position / original_lines) + y_center_position + 5;
            }
            else {
              let difference_height = current_height - calculate_height;
              let y_center_position = difference_height / 2;
              final_y_position = (shapeStringValueTemp.height/2) + (check_height_difference_normal/2) + ((element_details.height * numberOfLineBreaks)/numberOfLineBreaks); 
              ypositionCalc_text = (final_y_position / original_lines) + y_center_position;
            }
          }
          else{
            final_y_position = (shapeStringValueTemp.height/2) + (check_height_difference_normal/2) + ((element_details.height * numberOfLineBreaks)/numberOfLineBreaks); 
            ypositionCalc_text = (final_y_position/original_lines);
          }
          
        }        
        assign_label.remove();
        // yPosition check area end
      }
    }
    // style.display = "none";
    let annotation_element_ref = {"width":0,"height":0,"left":0,"top":0,"translatex":0,"translatey":0,
    "textshapetextx":0,"textshapetexty":0,"textfontSize":10,"breaktexts":[],"transform":svg_transform};
    // check element has if any margin we can reduce the left and top position.
    let line_width = ((Number(getData.line_width)/6)/2);
    let getstyleofelement = getComputedStyle(newcreatedElement); 
    let getLeft_A: any = getstyleofelement.left;
    getLeft_A = getLeft_A.substring(getLeft_A.length - 2, 0);
    getLeft_A = Number(getLeft_A);
    let getTop_B: any = getstyleofelement.top;
    getTop_B = getTop_B.substring(getTop_B.length - 2, 0);  
    getTop_B = Number(getTop_B);
    let getmarginLeft_A: any = getstyleofelement.marginLeft;
    getmarginLeft_A = getmarginLeft_A.substring(getmarginLeft_A.length - 2, 0);
    getmarginLeft_A = Number(getmarginLeft_A);
    let getmarginTop_B: any = getstyleofelement.marginTop;
    getmarginTop_B = getmarginTop_B.substring(getmarginTop_B.length - 2, 0);  
    getmarginTop_B = Number(getmarginTop_B);
    svg_left = (getLeft_A + getmarginLeft_A);  
    svg_left = svg_left < 0 ? 0 : Number(svg_left);
    svg_top = (getTop_B + getmarginTop_B); 
    svg_top = svg_top < 0 ? 0 : Number(svg_top);
    svg_width =  newcreatedElement.width;
    svg_height = newcreatedElement.height;
    annotation_element_ref["width"] = svg_width;
    annotation_element_ref["height"] = svg_height;
    annotation_element_ref["left"] = svg_left;
    annotation_element_ref["top"] = svg_top;
    annotation_element_ref["translatex"] = translate_x;
    annotation_element_ref["translatey"] = translate_y;
    var x = x_value_text + 2;
    var y = ypositionCalc_text - line_width;
    console.log(font_size);
    if(font_size!=13 && font_size!=undefined && widthget!=undefined && fontHeight!=undefined){
      x = x-2;
      x = x-(widthget/4);
      y = (fontHeight/2);
      y = y+2;
    }
    if(font_size == undefined){
      font_size = Number(getData.text_font_size);
    }
    annotation_element_ref["textshapetextx"] = x;
    annotation_element_ref["textshapetexty"] = y;
    annotation_element_ref["textfontSize"] = font_size;
    if(breaktexts!=undefined){
      annotation_element_ref["breaktexts"] = breaktexts;
    }
    annotation_element_ref["transform"] = svg_transform;
    newcreatedElement.remove();
    return annotation_element_ref;
  }
  
  getshapeDrawingP2P3(getDataP2P3,platform?:string,pngformat?:any) {
    let svg_width = 0;
    let svg_height = 0;
    let svg_left = 0;
    let svg_top = 0;
    let translate_x = 0;
    let translate_y= 0;
    let svg_transform = null;
    let getData = _.cloneDeep(getDataP2P3);
    getData.initial_position_x = getData.initial_position_x < 0 ? -(Number(getData.initial_position_x)) : Number(getData.initial_position_x);
    getData.initial_position_y = getData.initial_position_y < 0 ? -(Number(getData.initial_position_y)) : Number(getData.initial_position_y);
    var elementId = Number(getData.toolbar_element_id);
    if(pngformat!=undefined && pngformat==false){
      var pdfImg = document.getElementById("pdfannotationhead");  
    }
    else{
      var pdfImg = document.getElementById("pdfImg");
    }
    
    var newcreatedElement = document.createElement("canvas");
    newcreatedElement.setAttribute("documentSVG", "1");
    newcreatedElement.className = 'annot_canvas';
    getData.initial_height = Number(getData.initial_height);
    getData.initial_width = Number(getData.initial_width);
    var getHeight;
    var getWidth;
    let linewidthCount = 0;
    if (elementId > 11) {
      linewidthCount = Math.round(Number(getData.line_width) / 2);
    }
    else {
      linewidthCount = Math.round(Number(getData.line_width) / 6);
    }
    var shapeStringValueTemp = this.shapeService.getCanvaswidthandHeight(getData);

    getWidth = shapeStringValueTemp.width + 10;
    getHeight = shapeStringValueTemp.height + 10;
    newcreatedElement.style.position = "absolute";
    newcreatedElement.style.zIndex = "1";
    var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
    newcreatedElement.setAttribute("id", getData.annotation_id);
    newcreatedElement.setAttribute("width", getWidth);
    newcreatedElement.setAttribute("height", getHeight);
    newcreatedElement.style.top = Number(this.coordinateY) - 5 + "px";
    newcreatedElement.style.left = Number(this.coordinateX) - 5 + "px";
      // if (getData.annotation_label.trim() != "") {
      //   let topResizeSimple = Number(this.coordinateY);
      //   let leftResizeSimple = Number(this.coordinateX);
      //   this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
      // }
    pdfImg.appendChild(newcreatedElement);
    this.canvasElement = newcreatedElement.getContext("2d");
    this.canvasElement.beginPath();
    this.canvasElement.globalAlpha = getData.opacity;
    if (getStringWidth != undefined) {
      let translateWidth = getStringWidth.width - newcreatedElement.width;
      let translateHeight = getStringWidth.height - newcreatedElement.height;
      let translateX = (translateWidth / 2) + getStringWidth.left;
      let translateY = (translateHeight / 2) + getStringWidth.top;
      let shapeLeft = translateX;
      let shapeTop = translateY;
      translate_x = translateX;
      translate_y = translateY;
      newcreatedElement.style.top = shapeTop + "px";
      newcreatedElement.style.left = shapeLeft + "px";

      this.canvasElement.translate(-translateX - 0.5, -translateY - 0.8);
      this.canvasElement.restore();
      if (getData.annotation_label!=undefined && getData.annotation_label.trim() != "" && platform=='document') {
        this.shapeService.mainDrawingLabel(getData, pdfImg, shapeLeft, shapeTop, getWidth, getHeight, true);
      }
    }

    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");
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
              let actmovex = x;
              let actmovey = y;
              // actmovex = actmovex < 0 ? -(actmovex) : actmovex;
              // actmovey = actmovey < 0 ? -(actmovey) : actmovey;
              this.canvasElement.moveTo(actmovex, actmovey);
              break;
            case "line":
              let actlinex = x;
              let actliney = y;
              // actlinex = actlinex < 0 ? -(actlinex) : actlinex;
              // actliney = actliney < 0 ? -(actliney) : actliney;
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
            // cp1linex = cp1linex < 0 ? -(cp1linex) : cp1linex;
            // cp1liney = cp1liney < 0 ? -(cp1liney) : cp1liney;
            // cp2linex = cp2linex < 0 ? -(cp2linex) : cp2linex;
            // cp2liney = cp2liney < 0 ? -(cp2liney) : cp2liney;
            // cxlinex = cxlinex < 0 ? -(cxlinex) : cxlinex;
            // cxliney = cxliney < 0 ? -(cxliney) : cxliney;
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
          console.log(rectWidth, rectHeight);
          this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
          // let rectlineWidth = this.globalLineWidth(getData.line_width);
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
    if (elementId == 17 || elementId == 18) {
      console.log(elementId);
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


    // annotation details
    let annotation_element_ref = {"width":0,"height":0,"left":0,"top":0,"translatex":0,"translatey":0,
    "textshapetextx":0,"textshapetexty":0,"textfontSize":10,"breaktexts":[],"transform":svg_transform};
    // check element has if any margin we can reduce the left and top position.
    let getstyleofelement = getComputedStyle(newcreatedElement); 
    let getLeft_A: any = getstyleofelement.left;
    getLeft_A = getLeft_A.substring(getLeft_A.length - 2, 0);
    getLeft_A = Number(getLeft_A);
    let getTop_B: any = getstyleofelement.top;
    getTop_B = getTop_B.substring(getTop_B.length - 2, 0);  
    getTop_B = Number(getTop_B);
    let getmarginLeft_A: any = getstyleofelement.marginLeft;
    getmarginLeft_A = getmarginLeft_A.substring(getmarginLeft_A.length - 2, 0);
    getmarginLeft_A = Number(getmarginLeft_A);
    let getmarginTop_B: any = getstyleofelement.marginTop;
    getmarginTop_B = getmarginTop_B.substring(getmarginTop_B.length - 2, 0);  
    getmarginTop_B = Number(getmarginTop_B);
    svg_left = (getLeft_A + getmarginLeft_A);  
    svg_top = (getTop_B + getmarginTop_B); 
    svg_width =  newcreatedElement.width;
    svg_height = newcreatedElement.height;
    annotation_element_ref["width"] = svg_width;
    annotation_element_ref["height"] = svg_height;
    annotation_element_ref["left"] = svg_left;
    annotation_element_ref["top"] = svg_top;
    annotation_element_ref["translatex"] = translate_x;
    annotation_element_ref["translatey"] = translate_y;
    // annotation_element_ref["textshapetextx"] = x_value_text + 2;
    // annotation_element_ref["textshapetexty"] = ypositionCalc;
    // annotation_element_ref["textfontSize"] = fontSizeBaseHeight;
    // annotation_element_ref["breaktexts"] = breaktexts;
    annotation_element_ref["transform"] = svg_transform;
    newcreatedElement.remove();
    return annotation_element_ref;
  }

  changeStringValue(data) {
    let getnewString = this.shapeService.xyPositionDiff(data);
    let getStringValue = getnewString.shapeString;
    return getStringValue;
  }

  annotation_label_removed(getData){
    if (getData.annotation_label==undefined) {
      // remove label element common place start
      let get_label_Element = document.getElementById("label" + getData.annotation_id);
      if(get_label_Element!=null){
        get_label_Element.remove();
      }
    }
    else if (getData.annotation_label.trim() == "") {
      // remove label element common place start
      let get_label_Element = document.getElementById("label" + getData.annotation_id);
      if (get_label_Element != null) {
        get_label_Element.remove();
      }
    }
  }

  generate_copy_annotation(OldAnnotationData,currentxy){
    let clone_properties_data = _.cloneDeep(OldAnnotationData);
    let get_currentxy = currentxy;
    let getNewAnnotationData: any = "";
    let getOldAnnotationData = clone_properties_data.annotation_data.trim();
    let spaceSplit : string[] | any = getOldAnnotationData.split(" ");
    var shapeStringValueTemp = this.shapeService.getCanvaswidthandHeight(clone_properties_data);
    for (let i = 0; i < spaceSplit.length; i++) {
      // line--317:-664
      let splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      // line-n317:n664
      let hypenSplit = splitString.split("-");
      // line-
      // n317:n664
      if (hypenSplit != '') {
        var colonSplit = hypenSplit[1].replaceAll('n', '-').split(":");
        colonSplit[0] = this.shapeService.scientificToDecimal(Number(colonSplit[0]));
        colonSplit[1] = this.shapeService.scientificToDecimal(Number(colonSplit[1]));
        let getName = hypenSplit[0];
        // let getData = hypenSplit[1];
        // let splitGetData: any = getData.split(":");
        let calculateAddWidth: any = parseFloat(colonSplit[0]) - shapeStringValueTemp.left;
        let calculateAddHeight: any = parseFloat(colonSplit[1]) - shapeStringValueTemp.top;
        colonSplit[0] = get_currentxy.x + parseInt(calculateAddWidth);
        colonSplit[1] = get_currentxy.y + parseInt(calculateAddHeight);
        console.log(calculateAddWidth, calculateAddHeight);
        getNewAnnotationData = getNewAnnotationData + getName + "-" + colonSplit[0] + ":" + colonSplit[1] + " ";
      }
    }
    if(getNewAnnotationData != null && getNewAnnotationData != undefined){
      getNewAnnotationData = getNewAnnotationData.trim();
    }
    return getNewAnnotationData;
  }

  //Ipad color code receive from sankar 
  // switch normal_string {
  //   case "red":
  //       return "#BC0900"
  //   case "green":
  //       return "#98D133"
  //   case "blue":
  //       return "#002F5F"
  //   case "yellow":
  //       return "#FFFF00"
  //   case "orange":
  //       return "#F48F00"
  //   case "purple":
  //       return "#6C2EA7"
  //   case "cyan":
  //       return "#80F1FE"
  //   case "magenta":
  //       return "#C832B1"
  //   case "pink":
  //       return "#DF1ED3"
  //   case "brown":
  //       return "#7C4E40"
  //   case "gray":
  //       return "#949494"
  //   case "dark gray":
  //       return "#949494"
  //   case "light gray":
  //       return "#CCCCCC"
  //   case "black":
  //       return "#000000"
  //   case "white":
  //       return "#FFFFFF"
  //   case "clear":
  //       return "#NNNNNN00"
  //   default:
  //       return "#NNNNNN00"
  //   }

  private measureWidth = function (text, font) {
    // Create an element
    const ele = document.createElement('div');

    // Set styles
    ele.style.position = 'absolute';
    ele.style.visibility = 'hidden';
    ele.style.whiteSpace = 'nowrap';
    ele.style.left = '-9999px';

    // Set font and text
    ele.style.font = font;
    ele.innerText = text;

    // Append to the body
    document.body.appendChild(ele);

    // Get the width
    const width = window.getComputedStyle(ele).width;
    const height = window.getComputedStyle(ele,font);
    // body.append('<p>Height: ' + parseInt(window.getComputedStyle(text[0]).fontSize, 10)
    // Remove the element
    document.body.removeChild(ele);

    return {width:width,height:height};
};


}
