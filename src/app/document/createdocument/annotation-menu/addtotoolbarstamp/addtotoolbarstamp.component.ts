import { Component, OnInit, Inject } from "@angular/core";
import { AddasnewtoolbarComponent } from "../addasnewtoolbar/addasnewtoolbar.component";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToolbarlistService } from "src/app/toolbar/services/toolbarlist.service";
import { ActivatedRoute } from "@angular/router";
import { ToolbardesignService } from "src/app/toolbar/services/toolbardesign.service";
import { ProjectlistService } from "src/app/project-dashboard/my-project/services/projectlist.service";
import { ReadonlyService } from "src/app/document/services/readonly.service";
import { v1 as uuidv1 } from "uuid";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DataService } from "src/app/data.service";
import _ from "lodash";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { json } from "d3";

@Component({
  selector: "app-addtotoolbarstamp",
  templateUrl: "./addtotoolbarstamp.component.html",
  styleUrls: ["./addtotoolbarstamp.component.css"],
})
export class AddtotoolbarstampComponent implements OnInit {
  projectId: string;
  toolbarList: string[];
  toolbarId: string;
  callback1: any;
  getIndex: number = 0;
  su: any;
  annotationName: any;
  mutiarray: any[] = [];
  toolbarListData: any[];
  convertToolbarListData: any[] = [];
  toolbarData: any[] = [];
  selectedToolbarIds: string[] = [];
  selectAnnotationData: any = {};
  show: boolean = false;
  stampValue:number=0;

  constructor(
    private dialogClose: MatDialogRef<AddtotoolbarstampComponent>,
    private toolbarlistService: ToolbarlistService,
    private route: ActivatedRoute,
    private toolbarDesignService: ToolbardesignService,
    public service: ProjectlistService,
    private readonlyservice: ReadonlyService,
    private dataService: DataserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private textCheckService:DataService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.projectId = this.route.snapshot.queryParamMap.get("project_id");
    console.log(data);
    this.annotationName = this.data.dataToSend;
    console.log(this.annotationName);
    this.toolbarListData = this.data.toolbarListData;
    this.selectAnnotationData = this.data.selectAnnotationData;
    this.stampValue = this.data.stamp;
    console.log(this.selectAnnotationData);
    console.log(this.toolbarListData);
    for (let i = 0; i < this.toolbarListData.length; i++) {
      let convertJsonList = (this.toolbarListData[i].toolbar_data);
      let jointoolbarId = { toolbarId: this.toolbarListData[i].toolbar_id, convertJsonList: convertJsonList };
      this.convertToolbarListData.push(jointoolbarId);
      console.log(this.convertToolbarListData);
    }
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }

  ngOnInit(): void {
  }

  default_toolbar_content = [
    {
      element_name: "Circle",
      is_hidden: 0,
      element_uuid: "0",
      element_type: "circle",
      element_id: 1,
      element_category: "Circle",
      is_removed: 0,
      version_number: 1,
      element_data: {
        element_order: 0,
        element_type: "circle",
        element_name: "Circle",
        element_id: 1,
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_category: "Circle",
        opacity: 1,
        element_label: "Circle",
        line_width: 5,
        fill_color: "#002F5F",
        shape: {
          annotation_label: "",
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 1,
          fill_color: "#002F5F",
          element_type: "circle",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 1,
          initial_width: 0,
          initial_rotation: 0,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_type: "octagon",
      element_id: 2,
      version_number: 1,
      element_category: "Octagon",
      is_hidden: 0,
      element_uuid: "0",
      is_removed: 0,
      element_name: "Octagon",
      element_data: {
        element_name: "Octagon",
        element_category: "Circle",
        opacity: 1,
        fill_color: "#002F5F",
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_id: 2,
        line_width: 5,
        element_label: "Octagon",
        element_type: "octagon",
        element_order: 0,
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 2,
          fill_color: "#002F5F",
          element_type: "octagon",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 1,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_id: 3,
      is_hidden: 0,
      element_uuid: "0",
      element_type: "square",
      element_category: "Square",
      element_name: "Square",
      is_removed: 0,
      version_number: 1,
      element_data: {
        opacity: 1,
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_name: "Square",
        line_width: 5,
        element_type: "square",
        element_label: "Square",
        element_order: 1,
        fill_color: "#002F5F",
        element_category: "Square",
        element_id: 3,
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 3,
          fill_color: "#002F5F",
          element_type: "square",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      is_hidden: 0,
      element_uuid: "0",
      is_removed: 0,
      element_type: "triangle",
      element_category: "Triangle",
      version_number: 1,
      element_id: 4,
      element_name: "Triangle",
      element_data: {
        element_name: "Triangle",
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_category: "Triangle",
        element_id: 4,
        fill_color: "#002F5F",
        element_label: "Triangle",
        element_type: "triangle",
        element_order: 2,
        line_width: 5,
        opacity: 1,
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 4,
          fill_color: "#002F5F",
          element_type: "triangle",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_type: "star",
      is_hidden: 0,
      element_uuid: "0",
      version_number: 1,
      element_category: "Star",
      is_removed: 0,
      element_id: 5,
      element_name: "Star",
      element_data: {
        element_order: 3,
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_name: "Star",
        line_width: 5,
        fill_color: "#002F5F",
        element_type: "star",
        element_id: 5,
        element_category: "Star",
        element_label: "Star",
        opacity: 1,
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 5,
          fill_color: "#002F5F",
          element_type: "star",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_type: "diamond",
      element_id: 6,
      element_category: "Diamond",
      is_hidden: 0,
      element_uuid: "0",
      version_number: 1,
      element_name: "Diamond",
      is_removed: 0,
      element_data: {
        element_id: 6,
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_name: "Diamond",
        line_width: 5,
        opacity: 1,
        element_label: "Diamond",
        element_type: "diamond",
        fill_color: "#002F5F",
        element_category: "Diamond",
        element_order: 4,
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 6,
          fill_color: "#002F5F",
          element_type: "diamond",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_id: 7,
      version_number: 1,
      element_name: "Flag",
      is_hidden: 0,
      element_uuid: "0",
      is_removed: 0,
      element_category: "Flag",
      element_type: "flag",
      element_data: {
        element_id: 7,
        line_width: 5,
        fill_color: "#002F5F",
        element_type: "flag",
        element_category: "Flag",
        element_label: "Flag",
        opacity: 1,
        element_order: 5,
        element_name: "Flag",
        stroke_color: "#002F5F",
        forms_list_data: [],
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 7,
          fill_color: "#002F5F",
          element_type: "flag",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 1,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_type: "camera",
      element_name: "Camera",
      version_number: 1,
      is_removed: 0,
      element_category: "Camera",
      element_id: 8,
      is_hidden: 0,
      element_uuid: "0",
      element_data: {
        element_category: "Camera",
        fill_color: "#002F5F",
        element_name: "Camera",
        element_label: "Camera",
        element_type: "camera",
        opacity: 1,
        element_order: 6,
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_id: 8,
        line_width: 5,
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 8,
          fill_color: "#002F5F",
          element_type: "camera",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 1,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_name: "Arrow",
      version_number: 1,
      element_category: "Arrow",
      element_type: "arrow",
      element_id: 9,
      is_removed: 0,
      is_hidden: 0,
      element_uuid: "0",
      element_data: {
        element_category: "Arrow",
        element_order: 7,
        line_width: 5,
        element_name: "Arrow",
        opacity: 1,
        element_id: 9,
        element_type: "arrow",
        element_label: "Arrow",
        stroke_color: "#002F5F",
        forms_list_data: [],
        fill_color: "#002F5F",
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 9,
          fill_color: "#002F5F",
          element_type: "arrow",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_id: 10,
      is_hidden: 0,
      element_uuid: "0",
      is_removed: 0,
      version_number: 1,
      element_type: "Callout",
      element_name: "Callout",
      element_category: "Callout",
      element_data: {
        opacity: 1,
        element_name: "Callout",
        element_order: 8,
        fill_color: "#002F5F",
        element_type: "callout",
        line_width: 5,
        element_category: "Callout",
        element_label: "Callout",
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_id: 10,
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 10,
          fill_color: "#002F5F",
          element_type: "callout",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_type: "text",
      element_category: "Text",
      element_id: 11,
      is_removed: 0,
      element_name: "Text",
      is_hidden: 0,
      element_uuid: "0",
      version_number: 1,
      element_data: {
        opacity: 1,
        fill_color: "#002F5F",
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_id: 11,
        element_category: "Text",
        element_label: "Text",
        element_name: "Text",
        line_width: 5,
        element_order: 9,
        element_type: "text",
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 11,
          fill_color: "#002F5F",
          element_type: "text",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      version_number: 1,
      element_type: "freehand_line",
      element_name: "Freehand Line",
      is_removed: 0,
      element_category: "Freehand Line",
      element_id: 12,
      is_hidden: 0,
      element_uuid: "0",
      element_data: {
        element_category: "Freehand Line",
        element_type: "freehand_line",
        element_name: "Freehand Line",
        stroke_color: "#002F5F",
        forms_list_data: [],
        opacity: 1,
        line_width: 5,
        fill_color: "clear",
        element_label: "Freehand Line",
        element_order: 0,
        element_id: 12,
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 12,
          fill_color: "clear",
          element_type: "freehand_line",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      is_removed: 0,
      is_hidden: 0,
      element_uuid: "0",
      element_type: "polyline_arrow",
      element_id: 13,
      element_name: "Polyline Arrow",
      version_number: 1,
      element_category: "Polyline Arrow",
      element_data: {
        opacity: 1,
        element_label: "Polyline Arrow",
        line_width: 5,
        element_id: 13,
        element_name: "Polyline Arrow",
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_category: "Polyline Arrow",
        fill_color: "#002F5F",
        element_order: 11,
        element_type: "polyline_arrow",
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 13,
          fill_color: "#002F5F",
          element_type: "polyline_arrow",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_name: "Polyline",
      element_category: "Polyline",
      element_id: 14,
      version_number: 1,
      is_removed: 0,
      is_hidden: 0,
      element_uuid: "0",
      element_type: "polyline",
      element_data: {
        element_label: "Polyline",
        fill_color: "#002F5F",
        element_name: "Polyline",
        element_order: 12,
        element_category: "Polyline",
        element_type: "polyline",
        opacity: 1,
        stroke_color: "#002F5F",
        forms_list_data: [],
        line_width: 5,
        element_id: 14,
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 14,
          fill_color: "#002F5F",
          element_type: "polyline",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_category: "Line",
      element_type: "line",
      element_name: "Line",
      element_id: 15,
      is_hidden: 0,
      element_uuid: "0",
      version_number: 1,
      is_removed: 0,
      element_data: {
        element_order: 13,
        opacity: 1,
        line_width: 5,
        element_id: 15,
        element_category: "Line",
        element_type: "line",
        fill_color: "#002F5F",
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_label: "Line",
        element_name: "Line",
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 15,
          fill_color: "#002F5F",
          element_type: "line",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_category: "Line Axial",
      element_type: "line_axial",
      is_removed: 0,
      element_id: 16,
      element_name: "Line Axial",
      is_hidden: 0,
      element_uuid: "0",
      version_number: 1,
      element_data: {
        element_type: "line_axial",
        line_width: 5,
        opacity: 1,
        element_order: 14,
        element_id: 16,
        fill_color: "#002F5F",
        element_category: "Line Axial",
        element_label: "Line Axial",
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_name: "Line Axial",
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 16,
          fill_color: "#002F5F",
          element_type: "line_axial",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_category: "Freehand Area",
      is_removed: 0,
      is_hidden: 0,
      element_uuid: "0",
      element_id: 17,
      version_number: 1,
      element_type: "freehand_area",
      element_name: "Freehand Area",
      element_data: {
        opacity: 1,
        element_order: 15,
        element_category: "Freehand Area",
        element_name: "Freehand Area",
        fill_color: "#002F5F",
        stroke_color: "#002F5F",
        forms_list_data: [],
        element_type: "freehand_area",
        element_label: "Freehand Area",
        line_width: 5,
        element_id: 17,
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 17,
          fill_color: "#002F5F",
          element_type: "freehand_area",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_type: "polygon",
      version_number: 1,
      is_removed: 0,
      element_category: "Polygon",
      element_name: "Polygon",
      is_hidden: 0,
      element_uuid: "0",
      element_id: 18,
      element_data: {
        element_category: "Polygon",
        element_name: "Polygon",
        line_width: 5,
        stroke_color: "#002F5F",
        forms_list_data: [],
        opacity: 1,
        element_order: 16,
        element_label: "Polygon",
        fill_color: "#002F5F",
        element_id: 18,
        element_type: "polygon",
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 18,
          fill_color: "#002F5F",
          element_type: "polygon",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      element_type: "drawn_ellipse",
      is_hidden: 0,
      element_uuid: "0",
      element_name: "Drawn Ellipse",
      is_removed: 0,
      version_number: 1,
      element_category: "Drawn Ellipse",
      element_id: 19,
      element_data: {
        element_order: 17,
        stroke_color: "#002F5F",
        forms_list_data: [],
        line_width: 5,
        opacity: 1,
        element_name: "Drawn Ellipse",
        element_type: "drawn_ellipse",
        element_label: "Drawn Ellipse",
        fill_color: "#002F5F",
        element_id: 19,
        element_category: "Drawn Ellipse",
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 19,
          fill_color: "#002F5F",
          element_type: "drawn_ellipse",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
    {
      version_number: 1,
      is_hidden: 0,
      element_uuid: "0",
      element_type: "drawn_rectangle",
      is_removed: 0,
      element_category: "Drawn Rectangle",
      element_id: 20,
      element_name: "Drawn Rectangle",
      element_data: {
        line_width: 5,
        element_category: "Drawn Rectangle",
        opacity: 1,
        fill_color: "#002F5F",
        element_order: 18,
        element_name: "Drawn Rectangle",
        element_id: 20,
        element_type: "drawn_rectangle",
        element_label: "Drawn Rectangle",
        stroke_color: "#002F5F",
        forms_list_data: [],
        shape: {
          annotation_label: "",
          stroke_color: "#002F5F",
          initial_width: 0,
          annotation_data: "move-978.1437125748503:834.8802395209581 line-978.1437125748503:834.8802395209581 line-971.556886227545:834.8802395209581 line-958.3832335329341:834.8802395209581 line-910.6287425149701:834.8802395209581 line-884.2814371257484:834.8802395209581 line-871.1077844311376:834.8802395209581 line-818.4131736526945:834.8802395209581 line-757.4850299401198:848.0538922155689 line-737.7245508982035:867.814371257485 line-685.0299401197603:908.9820359281438 line-637.2754491017963:948.502994011976 line-643.8622754491018:1001.1976047904192 line-663.622754491018:1027.5449101796407 line-663.622754491018:1042.3652694610778 line-676.7964071856288:1095.0598802395211 line-698.2035928143712:1114.820359281437 line-724.5508982035929:1141.1676646706587 line-737.7245508982035:1147.754491017964 line-770.6586826347304:1160.9281437125746 line-797.0059880239521:1175.7485029940121 line-803.5928143712574:1175.7485029940121 line-838.1736526946108:1175.7485029940121 line-871.1077844311376:1182.3353293413174 line-877.6946107784431:1182.3353293413174 line-971.556886227545:1167.5149700598804 line-1011.0778443113772:1147.754491017964 line-1085.179640718563:1062.1257485029942 line-1085.179640718563:1001.1976047904192 line-1072.005988023952:928.7425149700599 line-1024.251497005988:867.814371257485 line-1004.4910179640717:848.0538922155689 line-971.556886227545:808.5329341317366 line-958.3832335329341:795.3592814371258 line-951.7964071856288:795.3592814371258 line-945.2095808383233:795.3592814371258",
          element_id: 20,
          fill_color: "#002F5F",
          element_type: "drawn_rectangle",
          initial_rotation: 0,
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          initial_height: 0,
          is_stamp: 0,
          rearrange_anno_data: ""
        },
      },
    },
  ];

  toggleVisibility(event, value, index) {
    this.getIndex = index;
    if (event.target.checked) {
      this.selectedToolbarIds.push(value.toolbar_id);
    }
    else {
      let index = this.selectedToolbarIds.indexOf(value.toolbar_id);
      if (index > -1) {
        this.selectedToolbarIds.splice(index, 1);
      }
    }
  }

  closeBox() {
    
    if (this.selectedToolbarIds.length > 0) {
      this.show = true;
      for (let i = 0; i < this.selectedToolbarIds.length; i++) {
        this.toolbarId = this.selectedToolbarIds[i];
        let gettoolbarData = this.toolbarListData.filter((data) => { return this.selectedToolbarIds[i] == data.toolbar_id });
        this.toolbarData = (gettoolbarData[0].toolbar_data);
        if (this.toolbarData == null) {
          this.toolbarData = [];
        }
        console.log(this.toolbarId);
        console.log(this.toolbarData);
        this.localUpdateValue(this.selectedToolbarIds[i]);
      }
    }
    else {
      this.dataService.multiSelectFooter.emit(false);
      this.dialogClose.close();
    }
  }

  localUpdateValue(getToolbarId) {
    
    let toggletoolbarData: any = [];
    for(let ts=0;ts<this.annotationName.length;ts++){
      var toolelementoriginal = this.default_toolbar_content.find(
        (ele) => ele.element_id == this.annotationName[ts].toolbar_element_id
      );
      var toolelement= _.cloneDeep(toolelementoriginal);
      // converting special character
      this.annotationName[ts].annotation_name = this.textCheckService.changeFormat(this.annotationName[ts].annotation_name);
      if (this.stampValue != undefined && this.stampValue == 0 && Number(this.annotationName[ts].toolbar_element_id) == 11) {
        this.annotationName[ts].annotation_label = "";
      }
      else {
        this.annotationName[ts].annotation_label = this.textCheckService.changeFormat(this.annotationName[ts].annotation_label);
      }
      this.annotationName[ts].annotation_tags = this.textCheckService.changeFormat(this.annotationName[ts].annotation_tags);
      if(this.annotationName[ts].toolbar_element_id==11){
        this.annotationName[ts].annotation_data = this.textCheckService.changeFormat(this.annotationName[ts].annotation_data);
      }
      if (this.annotationName[ts].annotation_forms.length > 0) {
        for (let fi = 0; fi < this.annotationName[ts].annotation_forms.length; fi++) {
          this.annotationName[ts].annotation_forms[fi].form_name = this.textCheckService.changeFormat(this.annotationName[ts].annotation_forms[fi].form_name);
          let get_cur_formdata = this.annotationName[ts].annotation_forms[fi].form_data;
          if (Array.isArray(get_cur_formdata)) {
            if (get_cur_formdata.length > 0) {
              this.annotationName[ts].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata, 'annotationupdateformpublish');
            }
          }
          if(this.annotationName[ts].annotation_forms[fi].is_extend == true){
            if(this.annotationName[ts].annotation_forms[fi].ext_form_data != null){
              if(this.annotationName[ts].annotation_forms[fi].ext_form_data != undefined && this.annotationName[ts].annotation_forms[fi].ext_form_data != "" && this.annotationName[ts].annotation_forms[fi].ext_form_data.length > 0){
              let ext_get_cur_formdata = this.annotationName[ts].annotation_forms[fi].ext_form_data;
              if (Array.isArray(ext_get_cur_formdata)) {
                if (ext_get_cur_formdata.length > 0) {
                  this.annotationName[ts].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(ext_get_cur_formdata, 'annotationupdateformpublish');
                }
              }else{
                ext_get_cur_formdata = JSON.parse(ext_get_cur_formdata);
                if (ext_get_cur_formdata.length > 0) {
                  this.annotationName[ts].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(ext_get_cur_formdata, 'annotationupdateformpublish');
                }
              }
            }else{
              this.annotationName[ts].annotation_forms[fi].ext_form_data = null;
            }
            }
          }else{
            this.annotationName[ts].annotation_forms[fi].ext_form_data = null;
          }
        }
      }
      if (this.annotationName[ts].annotation_links.length > 0) {
        if (Array.isArray(this.annotationName[ts].annotation_links)) {
          for (let li = 0; li < this.annotationName[ts].annotation_links.length; li++) {
            if (this.annotationName[ts].annotation_links[li].document_id == '') {
              this.annotationName[ts].annotation_links[li].link_type = this.textCheckService.changeFormat(this.annotationName[ts].annotation_links[li].link_type);
            }
            else if (this.annotationName[ts].annotation_links[li].document_id != '') {
              this.annotationName[ts].annotation_links[li].link_type = this.textCheckService.changeFormat(this.annotationName[ts].annotation_links[li].link_type);
            }
            if (this.annotationName[ts].annotation_links[li].hasOwnProperty('location')) {
              console.log(this.annotationName[ts].annotation_links[li].location);
              if (this.annotationName[ts].annotation_links[li].location != undefined) {
                this.annotationName[ts].annotation_links[li].location = this.textCheckService.changeFormat(this.annotationName[ts].annotation_links[li].location);
              }
            }
          }
        }
      }
      if (this.annotationName[ts].annotation_media.length > 0) {
        if (Array.isArray(this.annotationName[ts].annotation_media)) {
          for (let li = 0; li < this.annotationName[ts].annotation_media.length; li++) {
            if (this.annotationName[ts].annotation_media[li].media_name != '') {
              this.annotationName[ts].annotation_media[li].media_name = this.textCheckService.changeFormat(this.annotationName[ts].annotation_media[li].media_name);
            }
            if (this.annotationName[ts].annotation_media[li].media_comment != '') {
              this.annotationName[ts].annotation_media[li].media_comment = this.textCheckService.changeFormat(this.annotationName[ts].annotation_media[li].media_comment);
            }
            if(this.annotationName[ts].annotation_media[li].hasOwnProperty("media_tags")){
              if (this.annotationName[ts].annotation_media[li].media_tags != '') {
                this.annotationName[ts].annotation_media[li].media_tags = this.textCheckService.changeFormat(this.annotationName[ts].annotation_media[li].media_tags);
              }
            }
          }
        }
      }
      toolelement.element_name = this.annotationName[ts].annotation_name;
      toolelement.element_data.element_name = this.annotationName[ts].annotation_name;
      toolelement.element_data.fill_color = this.annotationName[ts].fill_color;
      toolelement.element_data.stroke_color = this.annotationName[ts].stroke_color;
      toolelement.element_data.line_width = this.annotationName[ts].line_width;
      toolelement.element_data.opacity = this.annotationName[ts].opacity;
      toolelement.element_data.shape.stroke_color = this.annotationName[ts].stroke_color;
      toolelement.element_data.shape.initial_width = this.annotationName[ts].initial_width;
      toolelement.element_data.shape.annotation_data = this.annotationName[ts].annotation_data;
      toolelement.element_data.shape.fill_color = this.annotationName[ts].fill_color;
      toolelement.element_data.shape.annotation_label = this.annotationName[ts].annotation_label;
      toolelement.element_data.shape.initial_rotation = this.annotationName[ts].initial_rotation;
      toolelement.element_data.shape.initial_height = this.annotationName[ts].initial_height;
      toolelement.element_data.shape.initial_width = this.annotationName[ts].initial_width;
      toolelement.element_data.shape.element_id = this.annotationName[ts].toolbar_element_id;
      toolelement.element_data.shape.annotation_media = [];
      toolelement.element_data.shape.annotation_links = this.annotationName[ts].annotation_links;
      toolelement.element_data.shape.annotation_tags = this.annotationName[ts].annotation_tags;
      toolelement.element_data.shape.is_stamp = this.stampValue;
      toolelement.element_data.element_order = this.toolbarData.length + ts;
      if (this.annotationName[ts].hasOwnProperty("annotation_forms")) {
        if (this.annotationName[ts].annotation_forms.length > 0) {
          toolelement.element_data.forms_list_data = this.annotationName[ts].annotation_forms;
        }
        else {
          toolelement.element_data.forms_list_data = [];
        }
      }
      toolelement.element_uuid = this.su.user_id + uuidv1().toUpperCase() + new Date().getTime();
      toggletoolbarData.push(toolelement);
      console.log(toolelement);
      console.log(this.annotationName);
    }
  
    if(typeof this.toolbarData=="string"){
      this.toolbarData=JSON.parse(this.toolbarData)
    }else{
    }
    console.log(typeof this.toolbarData);
    console.log(toggletoolbarData);
   this.toolbarData=[]
     this.toolbarData =toggletoolbarData;
    console.log(this.toolbarData);

    let UpdateToolbarModel: any = {
      toolbar_id: [getToolbarId],
      user_id: this.su.user_id,
      toolbar_data: this.toolbarData,
      
    };
    console.log(UpdateToolbarModel);
    this.publishToolbar(UpdateToolbarModel);
    
    // for (let k = 0; k < this.convertToolbarListData.length; k++) {
    //   if (this.toolbarId == this.convertToolbarListData[k].toolbarId) {
    //     this.convertToolbarListData[k].convertJsonList = this.toolbarData;
    //   }
    // }
  
  }

  publishToolbar(UpdateToolbarModelFinal) {
    console.log("UpdateToolbarModel", UpdateToolbarModelFinal);
    this.toolbarDesignService.merge_toolbar_data(UpdateToolbarModelFinal).subscribe((data) => {
      console.log(data);
      if (data["response_code"] == 200) {
        this.show = false;
        this.convertToolbarListData=data["response_body"]
        for (let k = 0; k <this.convertToolbarListData.length; k++) {
      var toolbar_data=data["response_body"][k].toolbar_data
      console.log(toolbar_data)
      if(typeof toolbar_data=="string"){
        this.convertToolbarListData[k].convertJsonList=JSON.parse(toolbar_data)
      }else{
        this.convertToolbarListData[k].convertJsonList=toolbar_data
      }
    }
        this.dataService.toolbarDataShapes.emit(this.convertToolbarListData);
        this.dataService.multiSelectFooter.emit(false);
        this.dialogClose.close();
      }
      else {
        this.errorMessage();
        this.dataService.multiSelectFooter.emit(false);
        this.dialogClose.close();
      }
    });
  }

  errorMessage() {
    this.show = false;
    this._snackBar.open('Sync is an error', null,
      {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
  }
}
