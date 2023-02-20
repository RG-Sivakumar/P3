import { Component, OnInit, AfterViewInit, Inject, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CreateDocumentService } from "../services/create-document.service";
import { v1 as uuidv1 } from "uuid";
import { DataserviceService } from "../services/dataservice.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { SharedService } from "src/app/shared/shared.service";
import { ShapeService } from "../services/shape.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as _ from 'lodash';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-swipecheck',
  templateUrl: './swipecheck.component.html',
  styleUrls: ['./swipecheck.component.css']
})
export class SwipecheckComponent implements OnInit {
  
  public canvasElement: CanvasRenderingContext2D;
  stringOne = {annotation_data: "move-106.34299495026693:12.14153589035243 line-80.58610116762503:22.444293403409233 line-66.41980958717198:37.898429672994325 line-59.98058614151165:50.77687656431522 line-44.52644987192642:79.10945972522131 line-29.07231360234138:116.45695571005194 line-16.19386671102032:152.51660700575053 line-12.33033264362416:187.28841361231707 line-12.33033264362416:214.3331520840909 line-22.63309015668085:233.65082242107246 line-52.253518006718906:249.10495869065767 line-98.61592681547441:254.25633744718607 line-139.82695686770137:254.25633744718607 line-169.44738471773945:252.9684927580538 line-184.9015209873245:250.3928033797897 line-190.052899743853:250.3928033797897 line-191.340744432985:250.3928033797897 line-192.6285891221172:250.3928033797897 line-192.6285891221172:246.52926931239358 line-200.3556572569097:227.2115989754118 line-217.09763821562694:193.72763705797752 line-231.26392979607994:162.81936451880733 line-241.56668730913668:138.3503154252976 line-242.85453199826884:124.18402384484466 line-242.85453199826884:112.59342164265581 line-238.99099793087248:104.8663535078631 line-227.40039572868363:94.56359599480629 line-214.52194883736274:88.12437254914607 line-204.21919132430588:79.10945972522131 line-197.77996787864555:68.80670221216462 line-192.6285891221172:61.07963407737191 line-187.47721036558886:52.06472125344749 line-184.9015209873245:44.33765311865466 line-179.75014223079614:36.61058498386217 line-173.3109187851358:28.88351684906968 line-168.1595400286073:25.01998278167332 line-159.14462720468276:21.15644871427719 line-148.84186969162587:18.580759336012875 line-135.963422800305:17.29291464688083 line-124.37282059811614:16.005069957748788 line-112.78221839592726:14.71722526861663 line-105.05515026113477:14.71722526861663",
  annotation_forms: [],
  annotation_id: "8-440EBC5F-3D8D-46C6-A6B3-9B16C394D45D-1617360769007",
  annotation_label: "",
  annotation_links: [],
  annotation_media: [],
  annotation_name: "Freehand Area",
  annotation_stubs: [],
  annotation_tags: "",
  annotation_url: [],
  created_by_user_id: "8",
  created_date: "2021-04-02T10:52:49.007Z",
  document_id: "8-08392475-8B22-4CD5-A3F4-4E1DFC03105E-1616934531266",
  element_size: "1",
  fill_color: "blue",
  initial_height: 259.11480155683364,
  initial_position_x: "30.685414134832342",
  initial_position_y: "501.4757483928534",
  initial_rotation: "0.0",
  initial_width: 247.52419935464468,
  is_removed: "false",
  last_updated_date: "2021-04-02T10:52:56.354Z",
  layer_id: "8-08392475-8B22-4CD5-A3F4-4E1DFC03105E-1616934531291",
  line_width: "5.0",
  opacity: "1.0",
  page_id: "8-08392475-8B22-4CD5-A3F4-4E1DFC03105E-1616934531272",
  project_id: "8-EB072D70-8ED0-11EB-A30C-135023E28B74-1616831351238",
  stroke_color: "blue",
  toolbar_element_id: "17",
  version_number: "1"}

  constructor() {
  }
    
  ngOnInit():void{

  }

}