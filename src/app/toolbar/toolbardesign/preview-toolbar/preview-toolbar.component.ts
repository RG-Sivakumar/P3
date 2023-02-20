import { Component, OnInit, Input } from "@angular/core";
import { ToolbardesignService } from "../../services/toolbardesign.service";
import { DropEffect, DndDropEvent } from "ngx-drag-drop";
import {
  MatDialogConfig,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { HeadertitleService } from "src/app/headertitle.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormnameService } from "src/app/formname.service";
import { Subscription } from "rxjs";
import { SharedService } from "src/app/shared/shared.service";
import { element } from "../../model/toolbarelement.model";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-preview-toolbar",
  templateUrl: "./preview-toolbar.component.html",
  styleUrls: ["./preview-toolbar.component.css"],
})
export class PreviewToolbarComponent implements OnInit {
  toolbar_id: any;
  fieldModel: Array<any>;
  groupbyVariable: any;
  sample = [];
  groupeddata = [];
  iconsample = [];
  formname: string;
  itemValue: any = [];
  subscription: Subscription;
  set: any;
  forms: any;
  updatedvalue: any[] = [];
  toolbarId: string;
  overlay = false;
  buttonColors: { color: string }[] = [
    { color: "darkblue-clr" },
    { color: "darkorange-clr" },
    { color: "lightorange-clr" },
    { color: "yellow-clr" },
    { color: "lightgreen-clr" },
    { color: "lightblue-clr" },
    { color: "violet-clr" },
    { color: "rose-clr" },
  ];

  buttonColors2: { color: string }[] = [
    { color: "darkrose-clr" },
    { color: "sky-clr" },
    { color: "brown-clr" },
    { color: "grey-clr" },
    { color: "medigrey-clr" },
    { color: "lightgrey-clr" },
    { color: "white-clr" },
  ];
  userid = this.encrptdecrpt.getItem("loggedIn") || "{}";
  constructor(
    private TService: ToolbardesignService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private headerTitleService: HeadertitleService,
    private messageService: FormnameService,
    private router: Router,
    private matDialog: MatDialogRef<PreviewToolbarComponent>,
    private sharedService: SharedService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.set = this.encrptdecrpt.getItem("form");
    console.log(this.userid);    
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.formname = message;
        this.set = this.encrptdecrpt.getItem("form");
      });
    var title = this.route.snapshot.queryParamMap.get("toolbarName");
    this.headerTitleService.mainTitle(title);
    this.toolbarId = this.route.snapshot.queryParamMap.get("toolbarId");
    this.fillToolbar();
  }
  fillToolbar(start = 0) {
    let ele: element = new element();
    ele.element_id = -1;
    for (let i = start; i < 51; i++) {
      this.modelFields.push(ele);
    }
    //.groupeddata = this.groupby(this.sample);
  }
  closeBoxOverlay() {
    this.overlay = false;
  }
  groupby = (items: any[], size = 4) => {
    let grouped = [];
    if (items != undefined) {
      for (let i = 0; i < items.length; i += size) {
        let data = items.slice(i, i + size);
        grouped.push(data);
      }
    }
    return grouped;
  };

  ngOnInit(): void {
    this.TService.get_toolbar_elements_structure().subscribe((data) => {
      let field = data["response_body"].toolbar_elements_template;
      field.map((item) => {
        let elementData = JSON.parse(item.element_data);
        item.element_data = elementData.element_data;
        return item;
      });
      this.fieldModel = field;
      this.groupbyVariable = this.groupby(this.fieldModel);
    });

    //get toolbar data
    this.TService.get_toolbar_data(this.toolbarId).subscribe((data) => {
      var status = data["response_code"];
      if (status == 200) {
        if (
          data.response_body.toolbar_listing[0].toolbar_data != null &&
          data.response_body.toolbar_listing[0].toolbar_data != "null"
        ) {
          this.modelFields = JSON.parse(
            data.response_body.toolbar_listing[0].toolbar_data
          );
        }
        this.fillToolbar(this.modelFields.length);

        this.toolbar_content.toolbarItem = this.modelFields;
      }
    });
  }

  icon_object = {
    baseurl: "./assets/images/ProjectsScreen/",

    geticon: function (index) {
      //functions
      return this.baseurl + this.icons[index - 1];
    },
    groupby: function () {
      let items = this.icons;
      let size = 4;
      let grouped = [];
      for (let i = 0; i < items.length; i += size) {
        let data = items.slice(i, i + size);
        grouped.push(data);
      }
      return grouped;
    },
    icons: [
      "P3_Toolbar_CircleIcon.png",
      "P3_Toolbar_OctagonIcon.png",
      "P3_Toolbar_SquareIcon.png",
      "P3_Toolbar_TriangleIcon.png",
      "P3_Toolbar_StarIcon.png",
      "P3_Toolbar_DiamondIcon.png",
      "P3_Toolbar_FlagIcon.png",
      "P3_Toolbar_CameraIcon.png",
      "P3_Toolbar_ArrowIcon.png",
      "P3_Toolbar_CalloutIcon.png",
      "P3_Toolbar_TextIcon_New.png",
      "P3_Toolbar_FreehandLineIcon.png",
      "P3_Toolbar_PolylineArrowIcon.png",
      "P3_Toolbar_PolylineIcon.png",
      "P3_Toolbar_LineIcon.png",
      "P3_Toolbar_LineAxialIcon.png",
      "P3_Toolbar_FreehandAreaIcon.png",
      "P3_Toolbar_PolygonIcon.png",
      "P3_Toolbar_DrawnEllipseIcon.png",
      "P3_Toolbar_DrawnRectangleIcon.png",
    ],
  };
  modelFields: Array<element> = [];

  toolbar_content: any = {
    numberofitems: 51,
    toolbarItem: this.modelFields,
    groupByToolar: function () {
      let items = this.toolbarItem;
      let size = 3;
      let grouped = [];
      if (items != undefined) {
        for (let i = 0; i < items.length; i += size) {
          let data = items.slice(i, i + size);
          grouped.push(data);
        }
      }
      return grouped;
    },
    toolbarGroup: this.groupby(this.modelFields),
  };

  toolbarClickMain(value, index) { }

  closeBox() {
    this.matDialog.close();
    this.sharedService.nextButtonActive("");
    this.sharedService.filter("Register Click");
  }
}
