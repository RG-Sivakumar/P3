import {
  Component,
  OnInit,
  Input,
  Injectable,
  ElementRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";

import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { BehaviorSubject, Subscription } from "rxjs";
import { ProjectfolderService } from "../services/projectfolder.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { AddContentComponent } from "../add-content/add-content.component";
import { FolderMoreComponent } from "../folder-more/folder-more.component";
import { AddcontentService } from "../services/addcontent.service";
import { SelectFolderComponent } from "../select-folder/select-folder.component";
import { MoreoptionService } from "../services/moreoption.service";
import { EventGlobalService } from "src/app/event-global.service";
import { DataService } from "src/app/data.service";
import { DocumentMoreComponent } from "../document-more/document-more.component";
import { ValueService } from "src/app/value.service";
import { DatePipe } from "@angular/common";
import { HeadertitleService } from "src/app/headertitle.service";
import { debug } from "console";
import { AlertPermissionComponent } from "../alert-permission/alert-permission.component";
import * as _ from 'lodash';
import { NoParentComponent } from "../no-parent/no-parent.component";
import { DocumentPagesService } from "src/app/document/services/document-pages.service";
import { GlobalUserRoleService } from "../../global-user-role.service";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { RemainderPopupComponent } from "src/app/document/createdocument/remainder-popup/remainder-popup.component";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";

export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  folderdata: any;
  folder_id: string;
  parent_folder_id: string;
  created_date: string;
  modified_date: string;
  is_hidden: boolean;
  annotation_count:any;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  folder_id: string;
  parent_folder_id: string;
  folder_level: number;
  is_folder_flag: number;
  created_date: string;
  modified_date: string;
  is_hidden: boolean;
  annotation_count:any;
}
/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  Main_folder: {
    Subfolder: ["Almond Meal flour", "Organic eggs", "Protein Powder"],
    Fruits: {
      Apple: null,
      Berries: ["Blueberry", "Raspberry"],
      Orange: null,
    },
  },
  Reminders: [
    "Cook dinner",
    "Read the Material Design spec",
    "Upgrade Application to Angular",
  ],
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  constructor(private updateservice: ProjectfolderService, private datePipe: DatePipe, private userRoleGlobal: GlobalUserRoleService) {
    // this.dataChange.subscribe(data => {
    //   this.dataSource.data = [];
    //   this.dataSource.data = data;
    // });
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    // const data = this.buildFileTree(TREE_DATA, 0);
    // Notify the change.
    // this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: object, level: number): TodoItemNode[] {
    let value = Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === "object") {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
    return value;
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: TodoItemNode): TodoItemNode {
    if (parent && !parent.children) {
      parent.children = [];
    }
    // { item: name.item } as TodoItemNode;
    const newItem = new TodoItemNode();
    newItem.item = name.item;
    newItem.folder_id = name.folder_id;

    newItem.parent_folder_id = parent ? parent.folder_id : "0";
    (name.folderdata["folder_level"] = parent ? parent.folderdata["folder_level"] + 1 : 0),
      name.folderdata["parent_folder_id"] = parent ? parent.folderdata["folder_id"] : "0";
    name.folderdata["expandable"] = false;
    let date = new Date().toISOString();
    let convertDate = this.datePipe.transform(date,"MM/dd/yyyy HH:mm:ss");
    name.folderdata["last_updated_date"] = convertDate;
    (newItem.folderdata = name.folderdata);
    if (parent) {
      parent.children.push(newItem);
    }
    this.dataChange.next(this.data);
    var parem = {
      folder_id: name.folder_id,
      folder_name: name.item,
      parent_folder_id: parent ? parent.folder_id : "0",
      folder_level: parent ? parent.folderdata["folder_level"] + 1 : 0,
      is_hidden: false,
    };
    this.updateservice.updatefolder(parem).subscribe((res) => {
      this.updateservice.statusUpdated.emit("Regresh Click");
    });
    return newItem;
  }

  insertItemAbove(node: TodoItemNode, name: string): TodoItemNode {
    const parentNode = this.getParentFromNodes(node);
    const newItem = { item: name } as TodoItemNode;
    if (parentNode != null) {
      parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
    } else {
      this.data.splice(this.data.indexOf(node), 0, newItem);
    }
    this.dataChange.next(this.data);
    return newItem;
  }

  insertItemBelow(node: TodoItemNode, name: string): TodoItemNode {
    const parentNode = this.getParentFromNodes(node);
    const newItem = { item: name } as TodoItemNode;
    if (parentNode != null) {
      parentNode.children.splice(
        parentNode.children.indexOf(node) + 1,
        0,
        newItem
      );
    } else {
      this.data.splice(this.data.indexOf(node) + 1, 0, newItem);
    }
    this.dataChange.next(this.data);
    return newItem;
  }

  getParentFromNodes(node: TodoItemNode): TodoItemNode {
    for (let i = 0; i < this.data.length; ++i) {
      const currentRoot = this.data[i];
      const parent = this.getParent(currentRoot, node);
      if (parent != null) {
        return parent;
      }
    }
    return null;
  }

  getParent(currentRoot: TodoItemNode, node: TodoItemNode): TodoItemNode {
    if (currentRoot.children && currentRoot.children.length > 0) {
      for (let i = 0; i < currentRoot.children.length; ++i) {
        const child = currentRoot.children[i];
        if (child === node) {
          return currentRoot;
        } else if (child.children && child.children.length > 0) {
          const parent = this.getParent(child, node);
          if (parent != null) {
            return parent;
          }
        }
      }
    }
    return null;
  }

  updateItem(node: TodoItemNode, name: string) {

    node.item = name;
    this.dataChange.next(this.data);
  }

  deleteItem(node: TodoItemNode) {
    this.deleteNode(this.data, node);
    this.dataChange.next(this.data);
  }

  copyPasteItem(from: TodoItemNode, to: TodoItemNode): TodoItemNode {
    const newItem = this.insertItem(to, from);
    if (from.children) {
      from.children.forEach((child) => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  copyPasteItemAsRoot(from: TodoItemNode, to: TodoItemNode): TodoItemNode {
    const newItem = this.insertItem(to, from);
    if (from.children) {
      from.children.forEach((child) => {
        this.copyPasteItemAsRoot(child, newItem);
      });
    }
    return newItem;
  }

  copyPasteItemAbove(from: TodoItemNode, to: TodoItemNode): TodoItemNode {
    const newItem = this.insertItemAbove(to, from.item);
    if (from.children) {
      from.children.forEach((child) => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  copyPasteItemBelow(from: TodoItemNode, to: TodoItemNode): TodoItemNode {
    const newItem = this.insertItemBelow(to, from.item);
    if (from.children) {
      from.children.forEach((child) => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  deleteNode(nodes: TodoItemNode[], nodeToDelete: TodoItemNode) {
    const index = nodes.indexOf(nodeToDelete, 0);
    if (index > -1) {
      nodes.splice(index, 1);
    } else {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          this.deleteNode(node.children, nodeToDelete);
        }
      });
    }
  }
}

@Component({
  selector: "app-main-project",
  templateUrl: "./main-project.component.html",
  styleUrls: ["./main-project.component.css"],
  providers: [ChecklistDatabase],
})
export class MainProjectComponent implements OnInit, OnDestroy {
  data: string;
  id: string;
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;
  show: boolean = true;
  /** The new item's name */
  newItemName = "";
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(
    true /* multiple */
  );
  /* Drag and drop */
  dragNode: any;
  dragNodeExpandOverWaitTimeMs = 300;
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime: number;
  dragNodeExpandOverArea: number;
  @ViewChild("emptyItem") emptyItem: ElementRef;
  @Input("useCondition")checked: boolean
  imgpath: string = "assets/images/icons/P3WebIcon_17Folder.png";
  localvalue = this.encrptdecrpt.getItem("loggedIn");
  userId: number;
  projectId: string;
  selectfolder = [];
  sortMessage: string;
  message: string;
  projectlist: any[];
  getAllTags: any[];
  getAlltaglist: any[];
  projectName: string;
  isValidDrag = false;
  nodeDraged: any;
  showLoader: boolean = false;
  admin: any;
  edit: any;
  view: any;
  rootFolderDetails: any = {};
  rootFolder: any;
  expanded: boolean = false;
  expandedNodesList: { folder_id: string; expandMode: boolean }[] = [];
  sortMessageReceive$: Subscription;
  userrole:string="";
  updateSubscription_1$:Subscription;
  updateSubscription_2$:Subscription;
  updateSubscription_3$:Subscription;
  updateSubscription_4$:Subscription;
  searchString:string="";
  displayFiles: boolean =false;

  constructor(
    private database: ChecklistDatabase,
    private service: ProjectfolderService,
    private route: ActivatedRoute,
    public router: Router,
    private dialogbox: MatDialog,
    private addcontentservice: AddcontentService,
    private moreoptionservice: MoreoptionService,
    private receiveData: DataService,
    public dataservice : DataserviceService,
    private receiveData1: ValueService,
    private eventsService: EventGlobalService,
    private datePipe: DatePipe,
    private headerService: HeadertitleService,
    private documentPage: DocumentPagesService,
    private userRoleGlobal: GlobalUserRoleService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.projectId = this.route.snapshot.queryParamMap.get("project_id");
    this.projectName = this.route.snapshot.queryParamMap.get("project_name");
    console.log(this.userRoleGlobal);
    console.log(this.localvalue);
    // let key = "d80dffce56a3ab301f4801631677a1f2ae0b8a86a3c9d07bcdc566d0c70e733e";
    // let newValue =  "U2FsdGVkX1+lOdYxGRz+rpK4+4bt1MOYu4b+iy60lyy9kFuH3tU/Qh0cWDkChEOk"
    // let oldValue =  "U2FsdGVkX1/0GwZAfiZA6VQIGrVcVrLK44Tl0W3YwHW5maRRUGu+bH/mXLLD4hjsxKub8OgRUgoImTmXAw79GULeljlSSPYto8RZ+y8GKSI="
    // let de1one = this.encrptdecrpt.decrypt(key);
    // console.log('decrypt',de1one);
    // if (this.projectId == null) {
    //   router.events.forEach((event) => {
    //     if (event instanceof NavigationEnd) {
    //       this.projectId = this.route.snapshot.queryParamMap.get("project_id");
    //       this.projectName = this.route.snapshot.queryParamMap.get("project_name");
    //       if (this.projectName == null) {
    //         this.projectName = this.encrptdecrpt.getItem("projectName");
    //       }
    //       // this.headerService.setTitle(this.projectName);
    //       this.receiveData.setprojectName(this.projectName);
    //     }
    //   });
    // }
    if (this.projectId == null && this.projectName == null) {
      this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
      this.projectName = this.encrptdecrpt.getItem("projectName");
    }
    this.admin = this.encrptdecrpt.getItem("Admin");
    this.edit = this.encrptdecrpt.getItem("Edit");
    this.view = this.encrptdecrpt.getItem("View");
    let getExpandList = this.encrptdecrpt.getItem('expandNode');
    if (getExpandList != null) {
      this.expandedNodesList = getExpandList;
    }
    this.userRoleGlobal.getProjectUserRolewait(this.projectId).then((get_res)=>{
      console.log('userrole',get_res);
    });
    this.headerService.setTitle(this.projectName);
    this.receiveData.setprojectName(this.projectName);
    this.receiveData.setValue(this.projectName);
    if (this.projectId != null && this.projectName != null) {
      // localStorage.setItem("projectIdlocal", this.projectId);
      this.encrptdecrpt.setItem("projectIdlocal",this.projectId);//security
      // localStorage.setItem("projectName", this.projectName);
      this.encrptdecrpt.setItem("projectName",this.projectName);//security
    }
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );

    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    database.dataChange.subscribe((data) => {
      this.dataSource.data = [];
      this.dataSource.data = data;
    });

    this.updateSubscription_1$ = this.service.statusUpdated.subscribe((status: string) => {
      this.getFolderfromAPI();
    });

    this.updateSubscription_2$ = this.moreoptionservice.listen().subscribe((m: any) => {
      this.getFolderfromAPI();
    });

    this.updateSubscription_3$ = this.addcontentservice.listen().subscribe((m: any) => {
      this.getFolderfromAPI();
    });
    this.updateSubscription_4$ = this.addcontentservice.loaderActivated.subscribe((status: boolean) => {
      this.showLoader = status;
    });
  }
  sorter = this.MySort('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');
  sorterdesc = this.MySortdesc('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');
  document(documentName, folderId, flagSet, folderlevel, pfolderid) {
    if (true) {
     let value : boolean = true;
      this.dataservice.remainder.emit(value);
      let deactivateFilterToolbar = { allChecked: true, pointsChecked: false, freehandChecked: false, vertexChecked: false, rectangleChecked: false };
      // localStorage.setItem("toolbarFilterItem", JSON.stringify(deactivateFilterToolbar));
      this.encrptdecrpt.setItem("toolbarFilterItem",deactivateFilterToolbar);//security
      if (flagSet == 0) {
        // this.documentPage.singlePagenumber.emit(1); need to test more
        if (this.projectId == null) {
          this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
        }
        let projectBackup = { projectId: this.projectId, projectName: this.projectName }
        this.service.updatedDataSelection(projectBackup);
        this.router.navigate(["/document/documentview"], {
          queryParams: {
            project_id: this.projectId,
            documentName: documentName,
            folderId: folderId,
            projectName: this.projectName,
            folderlevel: folderlevel,
            pfolderid: pfolderid,
            openLinkWindow: false,
          },
        });
      }
    }
    else {
      if (flagSet == 0) {
        const dialogconfig = new MatDialogConfig();
        dialogconfig.disableClose = true;
        dialogconfig.autoFocus = true;
        this.dialogbox.open(NoParentComponent, {
          width: "380px",
          panelClass: "mat-dialog-container1",
          data: {
            documentvalid: true,
            message: "This feature is not yet available on the web client.  In the interim, please visit Plannotate on your iPad to view and annotate documents."
          },
        });
      }
    }
   
  }

  ngOnInit(): void {
    this.getFolderfromAPI();
    // this.getProjectTaglist();
    this.filterMethod();
    // localStorage.setItem("toolbarId", "");
    this.encrptdecrpt.setItem("toolbarId","");//security
    // this.searchOut();
  }

  

  remainder()
  {
    let value1 : boolean = true;
    let remainderbox =  this.dialogbox.open(RemainderPopupComponent,{
      disableClose:true,  
      width: '500px',
        data: {
        
      }
      });
  }

  searchOut() {
    this.eventsService.broadcast("on", "@`#11*(%");
  }

  filterMethod() {
    this.eventsService.on("on", (a) => {
      this.message = a;
      // this.searchString = a;
      this.applyFilter(this.message);
    });
  }

  getProjectTaglist() {
    this.service.getFolderAllTag(this.projectId).subscribe((res) => {
      let getresponse_special_character = res["response_body"].folder_tags;
      if(res["response_body"].folder_tags!=undefined && res["response_body"].folder_tags.length>0){
        let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character,'taglist');
        console.log(change_character_list);
        res["response_body"].folder_tags = change_character_list;
      }
      this.getAllTags = res["response_body"].folder_tags;
      this.getAlltaglist = res["response_body"].folder_tags;
    });
  }

  applyFilter = (filtervalue) => {
    var a = filtervalue;

    if (this.getAlltaglist != undefined) {
      var tagfilter = this.getAlltaglist.filter((data) =>
        data.folder_tag_name.toLowerCase().includes(a.toLowerCase())
      );

      var uniqueProjectFilter = this.selectfolder.filter(function (projectlistId) {
        return tagfilter.some(function (tagfilterId) {
          return projectlistId.folder_id === tagfilterId.folder_id;
        });
      });
    } else {
      uniqueProjectFilter = [];
    }
    if (this.selectfolder != undefined) {
      var projectfilter = this.selectfolder.filter(
        (data) =>
          data.folder_name.toLowerCase().includes(a.toLowerCase()) ||
          data.created_date.toLowerCase().includes(a.toLowerCase()) ||
          data.last_updated_date.toLowerCase().includes(a.toLowerCase())
      );
    } else {
      projectfilter = [];
    }
    let arrResult = [...uniqueProjectFilter, ...projectfilter];

    if (a.length > 0) {
      this.sortandsearchCallFilter(arrResult);
    } else {
      this.sortandsearchCall(this.selectfolder);
    }
  };

  // sortandsearchCall1(arrfolder) {
  //
  //   var folderlevel = [];
  //   for (var item in arrfolder) {
  //     folderlevel.push(arrfolder[item]["folder_level"]);
  //   }
  //   folderlevel = folderlevel.filter(function (elem, index, self) {
  //     return index === self.indexOf(elem);
  //   });
  //   folderlevel = folderlevel.sort(function (a, b) { return b - a; });

  //   var folders = [];
  //   for (let item in folderlevel) {
  //     let oldfolder = folders;
  //     folders = [];
  //     let newset = arrfolder.filter(function (data) { return data["folder_level"] === folderlevel[item] });
  //     for (var dataset in newset) {
  //       var localdatavalue = newset[dataset];
  //       let foldersarray = oldfolder.filter(function (data) { return data.parent_folder_id === localdatavalue["folder_id"] });
  //       const node = new TodoItemNode();
  //       node.item = localdatavalue["folder_name"];
  //       node.folderdata = localdatavalue;
  //       node.folder_id = localdatavalue["folder_id"]
  //       node.parent_folder_id = localdatavalue["parent_folder_id"];
  //       node.created_date = localdatavalue["created_date"];
  //       node.modified_date = localdatavalue["last_updated_date"];
  //       if (foldersarray.length > 0) {
  //         // localdatavalue["children"]=foldersarray;
  //         node.children = foldersarray;
  //       }
  //       folders.push(node);
  //
  //     }
  //   }
  //   this.database.dataChange.next(folders);
  // }

  togglevar(event){
    console.log(event.checked);
    var display = event.checked;
    this.displayFiles = display;
  }

  sortandsearchCall(arrfolder) {
    var folderlevel = [];
    for (var item in this.selectfolder) {
      folderlevel.push(this.selectfolder[item]["folder_level"]);
    }
    folderlevel = folderlevel.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    folderlevel = folderlevel.sort(function (a, b) {
      return b - a;
    });
    var folders = [];
    for (var item in folderlevel) {
      let oldfolder = folders;
      folders = [];
      let newset = this.selectfolder.filter(function (data) {
        return data["folder_level"] === folderlevel[item];
      });
      newset = newset.sort((a, b) => a.is_folder_flag - b.is_folder_flag);

      for (var dataset in newset) {
        var localdatavalue = newset[dataset];
        let foldersarray = oldfolder.filter(function (data) {
          return data.parent_folder_id === localdatavalue["folder_id"];
        });
        const node = new TodoItemNode();
        node.item = localdatavalue["folder_name"];
        node.folderdata = localdatavalue;
        node.folder_id = localdatavalue["folder_id"];
        node.parent_folder_id = localdatavalue["parent_folder_id"];
        node.created_date = localdatavalue["created_date"];
        node.modified_date =
          localdatavalue["last_updated_date"] == undefined
            ? localdatavalue["created_date"]
            : localdatavalue["last_updated_date"];
        node.annotation_count = localdatavalue["annotation_count"];
        if (foldersarray.length > 0) {
          // localdatavalue["children"]=foldersarray;
          node.children = foldersarray;
        }
        folders.push(node);
      }
    }
    this.database.dataChange.next(folders);

    this.expandableNodesListen();
  }

  sortandsearchCallFilter(arrfolder) {

    if (arrfolder.length > 0) {
      let mergeFinalSearchArray = [];
      for (let v = 0; v < arrfolder.length; v++) {
        let searchFolderId = arrfolder[v].folder_id;
        let searchLevel = arrfolder[v].folder_level;
        let searchDisplayFolder = [];
        let folderIdArray = [];
        searchDisplayFolder.push(searchFolderId);
        for (let count = searchLevel; count > 0; count--) {
          let filterSearchArray = this.selectfolder.filter((data) => { return searchFolderId == data.folder_id });

          searchDisplayFolder.push(filterSearchArray[0].parent_folder_id);
          searchFolderId = filterSearchArray[0].parent_folder_id;
        }
        let finalArray = [];
        for (let j = 0; j < searchDisplayFolder.length; j++) {
          let filterIdPick = this.selectfolder.filter((data) => { return searchDisplayFolder[j] == data.folder_id });

          finalArray.push(filterIdPick[0]);
        }

        finalArray.forEach((sValue) => mergeFinalSearchArray.push(sValue));
      }
      mergeFinalSearchArray = mergeFinalSearchArray.filter((value, index) => mergeFinalSearchArray.indexOf(value) === index);

      arrfolder = mergeFinalSearchArray;
      mergeFinalSearchArray = this.globalSorting(mergeFinalSearchArray);
      var folderlevel = [];
      for (var item in arrfolder) {
        folderlevel.push(arrfolder[item]["folder_level"]);
      }
      folderlevel = folderlevel.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });
      folderlevel = folderlevel.sort(function (a, b) {
        return b - a;
      });

      var folders = [];
      for (let item in folderlevel) {
        let oldfolder = folders;
        folders = [];
        let newset = arrfolder.filter(function (data) {
          return data["folder_level"] === folderlevel[item];
        });
        for (var dataset in newset) {
          var localdatavalue = newset[dataset];
          let foldersarray = oldfolder.filter(function (data) {
            return data.parent_folder_id === localdatavalue["folder_id"];
          });
          const node = new TodoItemNode();
          node.item = localdatavalue["folder_name"];
          node.folderdata = localdatavalue;
          node.folder_id = localdatavalue["folder_id"];
          node.parent_folder_id = localdatavalue["parent_folder_id"];
          node.created_date = localdatavalue["created_date"];
          node.modified_date = localdatavalue["last_updated_date"];
          node.is_hidden = localdatavalue["is_hidden"];
          node.annotation_count = localdatavalue["annotation_count"];
          if (foldersarray.length > 0) {
            node.children = foldersarray;
          }
          folders.push(node);
        }
      }

      this.database.dataChange.next(folders);
      this.treeControl.expandAll();
    }
    else {
      this.database.dataChange.next([]);
    }
  }

  projecDetailstList: any;
  ShowHideProjectList: any;

  getFolderfromAPI = () => {
    // this.show = true;

    this.userId = this.localvalue.user_id;
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    this.service.getProjectfolder(this.userId, this.projectId).subscribe((res) => {
      console.log(res);
      this.show = false;
      this.showLoader = false;
      this.getProjectTaglist();
      let getresponse_special_character = res["response_body"]["project_master"];
      if(res["response_body"]["project_master"].length>0){
        let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character,'documentlist');
        console.log(change_character_list);
        res["response_body"]["project_master"] = change_character_list;
      }
      // user permission new api values get process
      let get_user_permission = res["response_body"]["user_permission"];
      if(get_user_permission != undefined && get_user_permission != null && 
      res["response_body"]["user_permission"].length > 0){
        
        if (get_user_permission[0].admin_permission_flag == true) {
          this.userrole = "admin";
        }
        else if (get_user_permission[0].edit_permission_flag == true) {
          this.userrole = "edit";
        }
        else if (get_user_permission[0].view_permission_flag == true) {
          this.userrole = "view";
        }
        else if(get_user_permission[0].view_permission_flag == false && get_user_permission[0].edit_permission_flag == false
          && get_user_permission[0].admin_permission_flag == false){
            this.userrole = "view";
        }
        this.encrptdecrpt.setItem("userrole",this.projectId + "||" + this.userrole);//security
      }
      let localvalueresponse = res["response_body"]["project_master"];
      this.ShowHideProjectList = _.cloneDeep(res["response_body"]["project_master"]);

      this.selectfolder = localvalueresponse;

      if (this.selectfolder != undefined) {
        var changesome = this.selectfolder.filter((data) => {
          return data;
        });

        var changesome1 = changesome.filter((data) => {
          return data["is_hidden"] == false;
        });
        this.projecDetailstList = changesome1;
        var dateFilter1 = changesome1.filter((dateonly) => {
          return (dateonly.created_date = this.datePipe.transform(
            dateonly.created_date,
            "MM/dd/yyyy HH:mm:ss"
          ));
        });
        var changesome3 = dateFilter1.filter((dateonly1) => {
          return (dateonly1.last_updated_date = this.datePipe.transform(
            dateonly1.last_updated_date,
            "MM/dd/yyyy HH:mm:ss"
          ));
        });
        this.selectfolder = changesome3;
      }
      if (this.selectfolder != undefined) {
        this.sortMessageReceive$ = this.receiveData.currentMessage.subscribe((message) => {
          this.sortMessage = message;
          if (this.sortMessage == "ascending") {
             this.selectfolder.sort((a, b) => (a.folder_name.toLowerCase()>b.folder_name.toLowerCase())?1:-1);
          } else if (this.sortMessage == "descending") {
            this.selectfolder.sort(this.sorterdesc);
            this.selectfolder = this.selectfolder.sort((a, b) => (a.folder_name.toLowerCase()>b.folder_name.toLowerCase())?-1:1);
          } else if (this.sortMessage == "datecreatedOldToRecent") {
            this.selectfolder.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
            this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
          } else if (this.sortMessage == "datecreatedRecentToOld") {
            this.selectfolder.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
            this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
          } else if (this.sortMessage == "lastupdatedOldToRecent") {
            this.selectfolder.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime());
            this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
          } else if (this.sortMessage == "lastupdatedRecentToOld") {
            this.selectfolder.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime());
            this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
          }
          this.sortandsearchCall(this.selectfolder);
        });
      }
      // this.eventsService.on("sortChange", (a) => {
      //   this.sortMessage = a;

      //   if (this.sortMessage == "ascending") {
      //     this.selectfolder.sort((a, b) =>
      //       a.folder_name.localeCompare(b.folder_name)
      //     );
      //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
      //   } else if (this.sortMessage == "descending") {
      //     this.selectfolder.sort((a, b) =>
      //       b.folder_name.localeCompare(a.folder_name)
      //     );
      //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
      //   } else if (this.sortMessage == "datecreatedOldToRecent") {
      //     // this.selectfolder.sort((a, b) =>
      //     //   a.toolbar_name.localeCompare(b.toolbar_name)
      //     // );
      //     // this.selectfolder.sort((a, b) =>
      //     //   a.created_date.localeCompare(b.created_date)
      //     // );
      //     this.selectfolder.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
      //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
      //   } else if (this.sortMessage == "datecreatedRecentToOld") {
      //     // this.selectfolder.sort((a, b) =>
      //     //   b.created_date.localeCompare(a.created_date)
      //     // );
      //     this.selectfolder.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
      //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
      //   } else if (this.sortMessage == "lastupdatedOldToRecent") {
      //     // this.selectfolder.sort((a, b) =>
      //     //   (a.last_updated_date != undefined
      //     //     ? a.last_updated_date
      //     //     : a.created_date
      //     //   ).localeCompare(
      //     //     b.last_updated_date != undefined
      //     //       ? b.last_updated_date
      //     //       : b.created_date
      //     //   )
      //     // );
      //     this.selectfolder.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
      //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
      //   } else if (this.sortMessage == "lastupdatedRecentToOld") {
      //     // this.selectfolder.sort((a, b) =>
      //     //   (b.last_updated_date != undefined
      //     //     ? b.last_updated_date
      //     //     : b.created_date
      //     //   ).localeCompare(
      //     //     a.last_updated_date != undefined
      //     //       ? a.last_updated_date
      //     //       : a.created_date
      //     //   )
      //     // );
      //     this.selectfolder.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
      //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
      //   }
      //   this.sortandsearchCall(this.selectfolder);
      //   
      // });

      for (let cj = 0; cj < this.selectfolder.length; cj++) {
        if (this.selectfolder[cj].folder_level == 0 && this.selectfolder[cj].parent_folder_id == "0") {
          this.rootFolderDetails = this.selectfolder[cj];
          let rootFolder = { folder_id: this.selectfolder[cj].folder_id, expandMode: true }
          this.expandedNodesList.push(rootFolder);

          break;
        }
      }
      let hideValuesArray = [];
      for (let j = 0; j < this.projecDetailstList.length; j++) {
        let folderIdCheck = this.projecDetailstList[j].folder_id;
        let lengthCheck = 0;
        for (let k = 0; k < this.projecDetailstList.length; k++) {
          if (this.projecDetailstList[k].parent_folder_id != folderIdCheck) {
            lengthCheck = lengthCheck + 1;
          }
        }
        if (lengthCheck == this.projecDetailstList.length && this.projecDetailstList[j].parent_folder_id != "0") {
          hideValuesArray.push(this.projecDetailstList[j].parent_folder_id);
        }
      }

      let hideDetailsArray = [];
      if (hideValuesArray.length > 0) {
        for (let j = 0; j < hideValuesArray.length; j++) {
          for (let m = 0; m < this.ShowHideProjectList.length; m++) {
            if (this.ShowHideProjectList[m].folder_id == hideValuesArray[j]) {
              hideDetailsArray.push(this.ShowHideProjectList[m]);
            }
          }
        }

      }
      var folderlevel = [];
      for (var item in localvalueresponse) {
        folderlevel.push(localvalueresponse[item]["folder_level"]);
      }
      folderlevel = folderlevel.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });
      folderlevel = folderlevel.sort(function (a, b) {
        return b - a;
      });
      var folders = [];
      for (var item in folderlevel) {
        let oldfolder = folders;
        folders = [];
        let newset = this.selectfolder.filter(function (data) {
          return data["folder_level"] === folderlevel[item];
        });
        newset = newset.sort((a, b) => a.is_folder_flag - b.is_folder_flag);

        for (var dataset in newset) {
          var localdatavalue = newset[dataset];

          let foldersarray = oldfolder.filter(function (data) {
            return data.parent_folder_id === localdatavalue["folder_id"];
          });
          const node = new TodoItemNode();
          node.item = localdatavalue["folder_name"];
          node.folderdata = localdatavalue;
          node.folder_id = localdatavalue["folder_id"];
          node.parent_folder_id = localdatavalue["parent_folder_id"];
          node.created_date = localdatavalue["created_date"];
          node.modified_date =
            localdatavalue["last_updated_date"] == undefined
              ? localdatavalue["created_date"]
              : localdatavalue["last_updated_date"];
          node.annotation_count = localdatavalue["annotation_count"];
          if (foldersarray.length > 0) {
            // localdatavalue["children"]=foldersarray;
            node.children = foldersarray;
          }
          folders.push(node);
        }
      }
      console.log(folders);
      this.database.dataChange.next(folders);
      if (res["response_code"] == 200) {

        this.expandableNodesListen();
      }
    });
  };

  expandableNodesListen() {
    let removeDuplicates = this.expandedNodesList;
    this.expandedNodesList = removeDuplicates.filter((v, i, a) => a.findIndex(t => (t.folder_id === v.folder_id)) === i)


    // localStorage.setItem('expandNode', JSON.stringify(this.expandedNodesList));
    this.encrptdecrpt.setItem("expandNode",this.expandedNodesList);//security
    this.treeControl.dataNodes.forEach((node) => {
      if (this.expandedNodesList.length > 0) {
        this.expandedNodesList.forEach((dataExpand) => {
          if (node.folder_id == dataExpand.folder_id) {
            this.treeControl.expand(node);

          }
        });
      }
    });
    //Expand Root Folder latest command 08.05.2021
    // this.treeControl.expand(this.treeControl.dataNodes[0]);
  }

  getLevel = (node: TodoItemFlatNode) => {
    // console.log(node);
    if(node != undefined){
     return node.level
    }
  };

  isExpandable = (node: TodoItemFlatNode) => {
    if(node != undefined){
      return node.expandable;
    }
    
  } 

  getChildren = (node: TodoItemNode): TodoItemNode[] => {
    if(node != undefined){
      return node.children;
    }
  } 

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) =>
    _nodeData.item === "";

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.folder_level = node.folderdata["folder_level"];
    flatNode.folder_id = node.folderdata["folder_id"];
    flatNode.parent_folder_id = node.folderdata["parent_folder_id"];
    flatNode.is_folder_flag = node.folderdata["is_folder_flag"];
    flatNode.created_date = node.folderdata["created_date"];
    flatNode.modified_date = node.folderdata["last_updated_date"];
    flatNode.is_hidden = node.folderdata["is_hidden"];
    flatNode.annotation_count = node.folderdata["annotation_count"];
    if (level == 0) {
      flatNode.expandable = true;
    }
    else {
      flatNode.expandable = node.children && node.children.length > 0;
    }
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    const childNode = new TodoItemNode();
    childNode.item = "";
    this.database.insertItem(parentNode, childNode);
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode, itemValue);
  }

  handleDragStart(event, node) {
    console.log(event);
    if (node.parent_folder_id == "0") {
      event.preventDefault();
    }
    else {
      this.isValidDrag = false;
      this.nodeDraged = node;
      this.rootFolder = this.treeControl.dataNodes[0];


      // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
      // event.dataTransfer.setData("foo", "bar");
      // event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
      this.dragNode = node;
      this.treeControl.collapse(node);
    }
  }

  handleDragOver(event, node) {
    event.preventDefault();
    // Handle node expand
    if (
      this.dragNodeExpandOverNode &&
      node === this.dragNodeExpandOverNode &&
      node.is_folder_flag === 1 && node != this.nodeDraged
    ) {
      if (
        Date.now() - this.dragNodeExpandOverTime >
        this.dragNodeExpandOverWaitTimeMs
      ) {
        if (!this.treeControl.isExpanded(node)) {
          this.treeControl.expand(node);
          //this.cd.detectChanges();

        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }

    // Handle drag area
    //   const percentageY = event.offsetY / event.target.clientHeight;
    //   if (0 <= percentageY && percentageY <= 0.25) {
    //     this.dragNodeExpandOverArea = 1;
    //   } else if (1 >= percentageY && percentageY >= 0.75) {
    //     this.dragNodeExpandOverArea = -1;
    //   } else {
    //     this.dragNodeExpandOverArea = 0;
    //   }
  }

  handleDrop(event, node) {

    this.isValidDrag = true;
    this.nodeDraged = undefined;
    if (node !== this.dragNode && node.is_folder_flag != 0) {
      let newItem: TodoItemNode;
      if (this.dragNodeExpandOverArea === 1 && node.is_folder_flag === 1) {
        this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
        newItem = this.database.copyPasteItemAbove(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
      }
      else if (
        this.dragNodeExpandOverArea === -1 &&
        node.is_folder_flag === 1
      ) {
        this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
        newItem = this.database.copyPasteItemBelow(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
      }
      else if (node.is_folder_flag === 1 && node.folder_id != this.dragNode.parent_folder_id) {
        this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
        newItem = this.database.copyPasteItem(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
      }
      // this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
      if (newItem != undefined) {
        this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
      }
    }
    this.handleDragEnd(event, node);
  }




  handleDragEnd(event, node) {

    if (node != undefined) {
      if (this.isValidDrag === false) {
        //add as root folder
        // var parem = {
        //   folder_id: this.nodeDraged.folder_id,
        //   folder_name: this.nodeDraged.item,
        //   parent_folder_id: "0",
        //   folder_level: 0,
        //   is_hidden: false,
        // };
        //
        // this.service.updatefolder(parem).subscribe((res) => {
        //
        //   this.service.statusUpdated.emit("Regresh Click");
        // });

        var parentNode = this.flatNodeMap.get(this.nodeDraged);
        parentNode.folderdata["folder_level"] = 1;
        let newItem: TodoItemNode;
        this.database.deleteItem(this.flatNodeMap.get(this.nodeDraged));
        newItem = this.database.copyPasteItemAsRoot(this.flatNodeMap.get(this.nodeDraged), this.flatNodeMap.get(this.rootFolder));
      }
      // this.getParendExpanded(node); // commented by ganesh 06.02.2021
      this.expandedNodesList.push({ folder_id: node.folder_id, expandMode: true });

    }
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
    this.dragNodeExpandOverArea = NaN;
    event.preventDefault();
  }

  getParendExpanded(node) {

    let mergeFinalSearchArray = [];
    let searchFolderId = node.folder_id;
    let searchLevel = node.folder_level;

    let searchDisplayFolder = [];
    let folderIdArray = [];
    for (let count = searchLevel; count > 0; count--) {
      let filterSearchArray = this.selectfolder.filter((data) => { return searchFolderId == data.folder_id });

      searchDisplayFolder.push(filterSearchArray[0].parent_folder_id);
      searchFolderId = filterSearchArray[0].parent_folder_id;
    }
    let finalArray = [];
    for (let j = 0; j < searchDisplayFolder.length; j++) {
      let filterIdPick = this.selectfolder.filter((data) => { return searchDisplayFolder[j] == data.folder_id });

      finalArray.push(filterIdPick[0].folder_id);
    }

    mergeFinalSearchArray = finalArray;

  }

  getStyle(node: TodoItemFlatNode) {
    if (this.dragNode === node) {
      return "drag-start";
    } else if (this.dragNodeExpandOverNode === node) {
      switch (this.dragNodeExpandOverArea) {
        case 1:
          return "drop-above";
        case -1:
          return "drop-below";
        default:
          return "drop-center";
      }
    }
  }

  deleteItem(node: TodoItemFlatNode) {
    this.database.deleteItem(this.flatNodeMap.get(node));
  }

  changestyle(event, node) {
    var imgdir = document.getElementsByClassName("folder-img");

    for (var i = 0; i < this.dataSource._data.value.length; i++)
      if (node.item == this.dataSource._data.value[i].item) {
        if (imgdir[i]) {
          this.imgpath =
            "assets/images/projectdetails/P3_FolderOpenedIcon-Orange.png";
        }
      }
  }

  iconChange: string;
  getfoldericon(node) {
    // if (node.folder_level == 0 && node.is_folder_flag == 1) {
    //   this.iconChange = "folder-img";
    //   return "assets/images/icons/P3WebIcon_17Folder.png";
    // }
    // if(node.is_folder_flag == 1) {
    //   this.iconChange = "sub-img";
    //   return "assets/images/projectdetails/P3_SubfolderIcon_Blue.png";
    // } 
    if (node.is_folder_flag == 1) {
      this.iconChange = "folder-img";
      return "assets/images/icons/P3WebIcon_17Folder.png";
    }
    else {
      this.iconChange = "document-img";
      return "assets/images/icons/P3WebIcon_18Doc.png";
    }
  }

  addContent() {
    if (this.admin == 0 && this.edit == 0 && this.view == 1) {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialogbox.open(AlertPermissionComponent, {
        width: "420px",
      });
    }

    else {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialogbox.open(AddContentComponent, {
        width: "380px",
        panelClass: "mat-dialog-container1",
        data: {
          projectId: this.projectId,
          foldersIn: this.selectfolder,
          callback: this.triggerFunction,
          projecDetailstList: this.projecDetailstList,
          ShowHideProjectList: this.ShowHideProjectList,
        },
      });
    }
  }

  triggerFunction = (newFolderDat) => {
    this.getFolderfromAPI();
  };

  onContextMenu(
    event,
    folder_name,
    createdDate,
    modifiedDate,
    folderid,
    parentfolderid,
    folderlevel,
    folderflag,
    is_hidden,
    node
  ) {

    event.preventDefault();
    if (folderflag == 1) {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialogbox.open(FolderMoreComponent, {
        width: "380px",
        data: {
          folderName: folder_name,
          createdDate: createdDate,
          modifiedDate: modifiedDate,
          folderId: folderid,
          parentFolderId: parentfolderid,
          folderLevel: folderlevel,
          hidden: is_hidden,
          folderflag: folderflag,
          projecDetailstList: this.projecDetailstList,
          getAlltaglist: this.getAlltaglist,
          ShowHideProjectList: this.ShowHideProjectList,
          is_hidden: false
        },
      });
    } else {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialogbox.open(DocumentMoreComponent, {
        width: "380px",
        data: {
          projectId: this.projectId,
          folderName: folder_name,
          createdDate: createdDate,
          modifiedDate: modifiedDate,
          folderId: folderid,
          parentFolderId: parentfolderid,
          folderLevel: folderlevel,
          hidden: is_hidden,
          folderflag: folderflag,
          projecDetailstList: this.projecDetailstList,
          getAlltaglist: this.getAlltaglist,
          ShowHideProjectList: this.ShowHideProjectList,
          is_hidden: false,
          project_name:this.projectName
        },
      });
    }
  }

  onVeryLongPress(
    event,
    folder_name,
    createdDate,
    modifiedDate,
    folderid,
    parentfolderid,
    folderlevel,
    folderflag,
    is_hidden,
    node
  ) {

    event.preventDefault();
    if (folderflag == 1) {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialogbox.open(FolderMoreComponent, {
        width: "380px",
        data: {
          folderName: folder_name,
          createdDate: createdDate,
          modifiedDate: modifiedDate,
          folderId: folderid,
          parentFolderId: parentfolderid,
          folderLevel: folderlevel,
          hidden: is_hidden,
          folderflag: folderflag,
          projecDetailstList: this.projecDetailstList,
          getAlltaglist: this.getAlltaglist,
          ShowHideProjectList: this.ShowHideProjectList,
        },
      });
    } else {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialogbox.open(DocumentMoreComponent, {
        width: "380px",
        data: {
          projectId: this.projectId,
          folderName: folder_name,
          createdDate: createdDate,
          modifiedDate: modifiedDate,
          folderId: folderid,
          parentFolderId: parentfolderid,
          folderLevel: folderlevel,
          hidden: is_hidden,
          folderflag: folderflag,
          projecDetailstList: this.projecDetailstList,
          getAlltaglist: this.getAlltaglist,
          ShowHideProjectList: this.ShowHideProjectList,
        },
      });
    }
  }

  onContextMenuDocument(
    folder_name,
    createdDate,
    modifiedDate,
    folderid,
    parentfolderid,
    folderlevel,
    folderflag,
    is_hidden,
    node
  ) {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialogbox.open(DocumentMoreComponent, {
      width: "380px",
      data: {
        projectId: this.projectId,
        folderName: folder_name,
        createdDate: createdDate,
        modifiedDate: modifiedDate,
        folderId: folderid,
        parentFolderId: parentfolderid,
        folderLevel: folderlevel,
        hidden: is_hidden,
      },
    });
  }


  //   expandedNodes:any;
  //   saveExpandedNodes() {
  //     this.treeControl
  //     this.expandedNodes = new Array<any>();
  //     this.treeControl.dataNodes.forEach(node => {
  //         if (node.expandable && this.treeControl.isExpanded(node)) {
  //             this.expandedNodes.push(node);
  //         }
  //     });
  // }
  // restoreExpandedNodes() {
  //   this.expandedNodes.forEach(node => {
  //       this.treeControl.expand(this.treeControl.dataNodes.find(n => n.folder_id === node.folder_id));
  //
  //   });
  // }
  expandedNodes: any;
  expandIdarray: any;
  expandMode() {
    this.expandedNodes = [];
    this.expandIdarray = [];
    this.treeControl.dataNodes.forEach((node) => {
      if (node.expandable && this.treeControl.isExpanded(node)) {
        this.expandedNodes.push(node);
      }
    });
    for (var i = 0; i < this.expandedNodes.length; i++) {
      this.expandIdarray.push(this.expandedNodes[i].folder_id);
    }
  }

  getNodes(node) {

    let value = node && node.children ? `(${node.children.length})` : '';


    var children = 0;
    for (var i = 0; i < this.selectfolder.length; i++) {
      if (node.folder_id == this.selectfolder[i].parent_folder_id) {
        children = 1;
      }
    }
    var a;
    var b;
    var c = 0;
    if (this.expandedNodesList.length == 0 && children == 1) {
      this.treeControl.expand(node);
      b = { folder_id: node.folder_id, expandMode: true };
    } else {
      for (var i = 0; i < this.expandedNodesList.length; i++) {
        c = 0;
        if (
          node.folder_id == this.expandedNodesList[i].folder_id &&
          children == 1
        ) {
          this.treeControl.collapse(node);
          this.expandedNodesList.splice(i, 1);
          c = 1;
          if (this.rootFolderDetails.folder_id == node.folder_id) {
            this.expandedNodesList = [];
            this.treeControl.collapseAll();
          }
        }
      }
      if (c == 0 && children == 1) {
        this.treeControl.expand(node);
        a = { folder_id: node.folder_id, expandMode: true };
      }
    }
    if (a != undefined) {
      this.expandedNodesList.push(a);
    }
    if (b != undefined) {
      this.expandedNodesList.push(b);
    }
    // localStorage.setItem('expandNode', JSON.stringify(this.expandedNodesList));
    this.encrptdecrpt.setItem("expandNode",this.expandedNodesList);//security

  }

  childrenCount(node: TodoItemNode): string {
    let value = node && node.children ? `(${node.children.length})` : '';

    return value;
  }

  globalSorting(arrFolder) {

    if (this.sortMessage == "ascending") {
      arrFolder.sort(this.sorter);
      return arrFolder = arrFolder.sort((a, b) => (a.folder_name.toLowerCase()>b.folder_name.toLowerCase())?1:-1);
    } else if (this.sortMessage == "descending") {
      arrFolder.sort(this.sorterdesc);
      return arrFolder = arrFolder.sort((a, b) => (a.folder_name.toLowerCase()>b.folder_name.toLowerCase())?-1:1);
    } else if (this.sortMessage == "datecreatedOldToRecent") {
      arrFolder.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
      return arrFolder = arrFolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
    } else if (this.sortMessage == "datecreatedRecentToOld") {
      arrFolder.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
      return arrFolder = arrFolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
    } else if (this.sortMessage == "lastupdatedOldToRecent") {
      arrFolder.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime());
      return arrFolder = arrFolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
    } else if (this.sortMessage == "lastupdatedRecentToOld") {
      arrFolder.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime());
      return arrFolder = arrFolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
    }
  }

  
  MySort(alphabet) {
    return function (a, b) {
      var index_a = alphabet.indexOf(a[0]),
        index_b = alphabet.indexOf(b[0]);

      if (index_a === index_b) {
        if (a.folder_name < b.folder_name) {
          return -1;
        } else if (a.folder_name > b.folder_name) {
          return 1;
        }
        return 0;
      }
      else {
        return index_a - index_b;
      }
    }
  }
  MySortdesc(alphabet) {
    return function (a, b) {
      var index_a = alphabet.indexOf(a[0]),
        index_b = alphabet.indexOf(b[0]);

      if (index_a === index_b) {
        if (a.folder_name < b.folder_name) {
          return 1;
        } else if (a.folder_name > b.folder_name) {
          return -1;
        }
        return 0;
      }
      else {
        return index_a - index_b;
      }
    }
  }


  name: number = 0;
  timeoutHandler;

  public mouseup(event,node) {
    if (this.timeoutHandler) {
      clearInterval(this.timeoutHandler);
      if(this.name>=10){
        this.longPressTrigger(event,node);
      }
      else{
        this.document(node.item,node.folder_id,node.is_folder_flag,node.folder_level,
        node.parent_folder_id);
      }
      this.name = 0;
      this.timeoutHandler = null;
    }
  }

  public mousedown(event,node) {
    this.timeoutHandler = setInterval(() => {
      this.name += 1;
      if(this.name==10){
        this.mouseup(event,node);
      }
      console.log(this.name);
    }, 100);
  }


  longPressTrigger(
    event,
    node
  ) {
    event.preventDefault();
    if (node.is_folder_flag == 1) {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialogbox.open(FolderMoreComponent, {
        width: "380px",
        data: {
          folderName: node.item,
          createdDate: node.created_date,
          modifiedDate: node.modified_date,
          folderId: node.folder_id,
          parentFolderId: node.parent_folder_id,
          folderLevel: node.folder_level,
          hidden: node.is_hidden,
          folderflag: node.is_folder_flag,
          projecDetailstList: this.projecDetailstList,
          getAlltaglist: this.getAlltaglist,
          ShowHideProjectList: this.ShowHideProjectList,
        },
      });
    } else {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialogbox.open(DocumentMoreComponent, {
        width: "380px",
        data: {
          projectId: this.projectId,
          folderName: node.item,
          createdDate: node.created_date,
          modifiedDate: node.modified_date,
          folderId: node.folder_id,
          parentFolderId: node.parent_folder_id,
          folderLevel: node.folder_level,
          hidden: node.is_hidden,
          folderflag: node.is_folder_flag,
          projecDetailstList: this.projecDetailstList,
          getAlltaglist: this.getAlltaglist,
          ShowHideProjectList: this.ShowHideProjectList,
        },
      });
    }
  }

  ngOnDestroy(): void {
    // this.expandedNodesList = [];
    if (this.sortMessageReceive$ != undefined) {
      this.sortMessageReceive$.unsubscribe();
    }
    if(this.updateSubscription_1$ != undefined){
      this.updateSubscription_1$.unsubscribe();
    }
    if(this.updateSubscription_2$ != undefined){
      this.updateSubscription_2$.unsubscribe();
    }
    if(this.updateSubscription_3$ != undefined){
      this.updateSubscription_3$.unsubscribe();
    }
    if(this.updateSubscription_4$ != undefined){
      this.updateSubscription_4$.unsubscribe();
    }
  }

  // async getuserrole(){
  //   console.time();
  //   await this.userRoleGlobal.getProjectUserRolewait(this.projectId).then((get_res)=>{
  //     let value = get_res;  
  //     console.timeEnd();
  //   });
    
    
  // }

  // search filter logic start
  filterLeafNode(node: TodoItemFlatNode): boolean {
    if (!this.searchString) {
      return false
    }
    let get_value = (node.item.toLowerCase()
    .indexOf(this.searchString?.toLowerCase()) === -1 && node.created_date?.toLowerCase()
    .indexOf(this.searchString?.toLowerCase()) === -1 && node.modified_date?.toLowerCase()
    .indexOf(this.searchString?.toLowerCase()) === -1);
    console.log(get_value)
    return get_value;
    // return (node.item.toLowerCase()
    //   .indexOf(this.searchString?.toLowerCase()) === -1 || node.created_date.toLowerCase()
    //   .indexOf(this.searchString?.toLowerCase()) === -1 || node.modified_date.toLowerCase()
    //   .indexOf(this.searchString?.toLowerCase()) === -1)
    
  }

  filterParentNode(node: TodoItemFlatNode): boolean {
    if (
      !this.searchString ||
      node.item.toLowerCase().indexOf(this.searchString?.toLowerCase()) !==
        -1
    ) {
      return false
    }
    const descendants = this.treeControl.getDescendants(node)

    if (
      descendants.some(
        (descendantNode) =>
          descendantNode.item
            .toLowerCase()
            .indexOf(this.searchString?.toLowerCase()) !== -1
      )
    ) {
      return false
    }

    return true
  }
  // search filter logic end
  
}
