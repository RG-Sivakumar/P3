import {
  Component,
  OnInit,
  Injectable,
  ElementRef,
  ViewChild,
  Inject,
} from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { BehaviorSubject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MatDialogConfig,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { v1 as uuidv1 } from "uuid";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { ProjectfolderService } from "src/app/projects/services/projectfolder.service";
import { AddcontentService } from "src/app/projects/services/addcontent.service";
import { DocumenttagService } from "src/app/document/services/documenttag.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  folderdata: any;
  folder_id: string;
  parent_folder_id: string;
  created_date: string;
  modified_date: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean = true;
  folder_id: string;
  folder_level: number;
  is_folder_flag: number;
  created_date: string;
  modified_date: string;
}

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
  // userId:number;

  constructor(private updateservice: ProjectfolderService) {
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
    if (!parent.children) {
      parent.children = [];
    }
    // { item: name.item } as TodoItemNode;
    const newItem = new TodoItemNode();
    newItem.item = name.item;
    newItem.folder_id = name.folder_id;
    newItem.parent_folder_id = parent.folder_id;
    newItem.folderdata = name.folderdata;
    parent.children.push(newItem);
    this.dataChange.next(this.data);
    var parem = {
      folder_id: name.folder_id,
      folder_name: name.item,
      parent_folder_id: parent.folder_id,
      folder_level: parent.folderdata["folder_level"] + 1,
      is_hidden: true,
    };
    this.updateservice.updatefolder(parem).subscribe((res) => {
      console.log(res);
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
  selector: 'app-select-folder-annotate',
  templateUrl: './select-folder-annotate.component.html',
  styleUrls: ['./select-folder-annotate.component.css'],
  providers: [ChecklistDatabase],
})

export class SelectFolderAnnotateComponent implements OnInit {
  show: boolean = false;
  @ViewChild("tree") tree;

  ngAfterViewInit() {
    this.treeControl.expandAll();
  }

  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

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
  layerId:any;
  dragNodeExpandOverTime: number;
  dragNodeExpandOverArea: number;
  @ViewChild("emptyItem") emptyItem: ElementRef;
  imgpath: string = "assets/images/icons/P3WebIcon_17Folder.png";
  localvalue = this.encrptdecrpt.getItem("loggedIn");
  userId: number;
  projectId: string;
  selectfolder = [];
  uuidValue: string;
  subfolderName: string;
  callback: any;
  file: File;
  readerresult1: any;
  readerresult: any;
  noofPage: number;
  receiveFileType: string;
  page_id: string[] = [];
  su: login;
  projecDetailstList: any;
  projectFolderList: any[] = [];
  documentName: string = "";
  projectid: string = "";
  mediaUrl: any = "";
  documentPageId: any[] = [];
  projectName: string = "";
  parentFolderId: string = "";

  constructor(
    private database: ChecklistDatabase,
    private service: ProjectfolderService,
    private route: ActivatedRoute,
    private documentService: CreateDocumentService,
    private dialogbox: MatDialog,
    private addcontentservice: AddcontentService,
    private dialog: MatDialogRef<SelectFolderAnnotateComponent>,
    private newdocservice: DocumenttagService,
    private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {
    this.projectId = this.route.snapshot.queryParamMap.get("project_id");
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
    console.log(this.dataSource);
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    database.dataChange.subscribe((data) => {
      this.dataSource.data = [];
      this.dataSource.data = data;
    });

    var receivedata = this.data;
    this.subfolderName = receivedata.subfolderName;
    // this.projectId = receivedata.projectId;
    this.callback = receivedata.callback;
    this.file = receivedata.file;
    this.noofPage = receivedata.noofPage;
    console.log(this.noofPage);
    this.receiveFileType = receivedata.sendFileType;
    this.page_id = receivedata.pageId;
    this.projecDetailstList = receivedata.projecDetailstList;
    this.projectFolderList = receivedata.projectFolderList;
    this.projectId = receivedata.projectFolderList[0].project_id;
    this.documentName = receivedata.documentName;
    // this.projectid = receivedata.projectid;
    this.mediaUrl = receivedata.mediaUrl;

    console.log(receivedata,this.mediaUrl);
    this.projectName = this.encrptdecrpt.getItem("projectName");
    this.getFolderfromAPI();
  }

  ngOnInit(): void {
  }

  getFolderfromAPI = () => {
    this.userId = this.localvalue.user_id;
    console.log(this.userId);
    let localvalueresponse = this.projectFolderList;
    console.log(localvalueresponse);
    if (localvalueresponse != undefined) {
      this.selectfolder = localvalueresponse;
      var changesome = this.selectfolder;
      console.log(changesome);
      var changesome = changesome.filter((data) => {
        return data["is_hidden"] == false;
      });
      this.selectfolder = changesome;

      console.log(this.selectfolder);
      this.selectfolder=this.selectfolder.sort((a, b) => (a.folder_name.toLowerCase()>b.folder_name.toLowerCase())?1:-1);
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
      for (let item in folderlevel) {
        let oldfolder = folders;
        folders = [];
        let newset = this.selectfolder.filter(function (data) {
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
          if (foldersarray.length > 0) {
            // localdatavalue["children"]=foldersarray;
            node.children = foldersarray;
          }
          folders.push(node);
        }
      }
      this.database.dataChange.next(folders);
      console.log(this.database.dataChange.next(folders));
      this.treeControl.expandAll();
    }
    console.log(this.localvalue.user_id);
  };


  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

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
    flatNode.is_folder_flag = node.folderdata["is_folder_flag"];
    flatNode.created_date = node.folderdata["created_date"];
    flatNode.modified_date = node.folderdata["last_updated_date"];
    flatNode.expandable = node.children && node.children.length > 0;
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
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
    event.dataTransfer.setData("foo", "bar");
    //event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event, node) {
    event.preventDefault();
    // Handle node expand
    if (this.dragNodeExpandOverNode && node === this.dragNodeExpandOverNode) {
      if (
        Date.now() - this.dragNodeExpandOverTime >
        this.dragNodeExpandOverWaitTimeMs
      ) {
        if (!this.treeControl.isExpanded(node)) {
          this.treeControl.expand(node);
          //this.cd.detectChanges();
         console.log( this.treeControl.expand(node))
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }
  }

  handleDrop(event, node) {
    if (node !== this.dragNode) {
      let newItem: TodoItemNode;
      if (this.dragNodeExpandOverArea === 1) {
        newItem = this.database.copyPasteItemAbove(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
      } else if (this.dragNodeExpandOverArea === -1) {
        newItem = this.database.copyPasteItemBelow(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
      } else {
        newItem = this.database.copyPasteItem(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
      }
      this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
      this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
    }
    this.handleDragEnd(event);
  }

  handleDragEnd(event) {
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
    this.dragNodeExpandOverArea = NaN;
    event.preventDefault();
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
    console.log(imgdir[0]);
    console.log(node.item, this.dataSource._data.value, imgdir);
    for (var i = 0; i < this.dataSource._data.value.length; i++)
      if (node.item == this.dataSource._data.value[i].item) {
        if (imgdir[i]) {
          this.imgpath =
            "assets/images/projectdetails/P3_FolderOpenedIcon-Orange.png";
        }
      }
  }

  getfoldericon(node) {
    if (node.folder_level == 0) {
      return "assets/images/icons/P3WebIcon_17Folder.png";
    } else if (node.is_folder_flag == 1) {
      return "assets/images/projectdetails/P3_SubfolderIcon_Blue.png";
    } else {
      return "assets/images/projectdetails/P3_DocumentsIcon_Blue.png";
    }
  }

  showChildren(node) {
    console.log(node.children);
  }
  documentId: string;
  layerName: string = "Default";
  layerType = "blank";
  

  folderLevel: number = 0;

  AddNewdoc(folderlevel, folderid) {
    var uuidDate = new Date().getTime();
    this.show=true;
    console.log(folderlevel, folderid,this.projectId);
    this.folderLevel = folderlevel + 1;
    let uuId = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
    let pageId = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
    this.newdocservice.addasNewDocAnnotate(
      this.projectId,
      pageId,
      this.mediaUrl,
      uuId,
      this.documentName,
      folderid,
      folderlevel,
    )
      .subscribe((res) => {
        console.log(res);
        
        if (res["response_code"] == 200) {
          this.documentId = uuId;
          this.documentPageId.push(pageId);
          this.parentFolderId = folderid;
          this.createLayerNew(this.documentId,pageId);
        }
        else{
          this.errorMessage();
          this.dialog.close();
        }
      });
  }

  setActiveLayerId(layerId,pageIdfinal) {
    let setpageId = [];
    setpageId.push(pageIdfinal);
    this.service.setactivelayerUpdate(this.documentId,setpageId,layerId).subscribe((response) => {
      
      if (response["response_code"] == 200) {
        this.show=false;
        this.documentHead(this.documentName, this.documentId, 0, this.folderLevel, this.parentFolderId, this.documentPageId[0]);
        this.dialog.close();
      }
      else{
        this.errorMessage();
        this.dialog.close();
      }
    });
  }


  createLayerNew(documentId,pageIdrequire) {
    var uuidDate = new Date().getTime();
    var date = new Date().toISOString();
    let uuid = uuidv1().toUpperCase();
    this.documentService
      .defaultcreateLayer(
        this.layerName,
        this.layerType,
        uuidDate,
        date,
        uuid,
        this.projectId,
        documentId,
        this.documentPageId
      )
      .subscribe((response) => {
        console.log(response);
        
        if (response["response_code"] == 200) {
          this.layerId = this.su.user_id + "-" + uuid + "-" + uuidDate;
          this.setActiveLayerId(this.layerId,pageIdrequire);
          this.newdocservice.filter("Register Click");
        }
        else{
          this.errorMessage;
          this.dialog.close();
        }
      });
  }

  document(documentName, folderId, page_id,projectId) {
    let deactivateFilterToolbar = { allChecked: true, pointsChecked: false, freehandChecked: false, vertexChecked: false, rectangleChecked: false };
    // localStorage.setItem("toolbarFilterItem", JSON.stringify(deactivateFilterToolbar));
    this.encrptdecrpt.setItem("toolbarFilterItem",deactivateFilterToolbar);//security
    const queryParams = {
      project_id: this.projectid,
      documentName: documentName,
      folderId: folderId,
      projectName: this.projectName,
      folderlevel: 0,
      pfolderid: this.parentFolderId,
      page_id: page_id,
      openLinkWindow: true,
    };
    const urlTree = this.router.createUrlTree([], { /* Removed unsupported properties by Angular migration: skipLocationChange. */ queryParams: queryParams,
    relativeTo: this.route });
    window.open(urlTree.toString());
  }
  
  documentHead(documentName, folderId, flagSet, folderlevel, pfolderid, pageId) {
    console.log(folderlevel, pfolderid);
    flagSet = 0;
    let deactivateFilterToolbar = { allChecked: true, pointsChecked: false, freehandChecked: false, vertexChecked: false, rectangleChecked: false };
    // localStorage.setItem("toolbarFilterItem", JSON.stringify(deactivateFilterToolbar));
    this.encrptdecrpt.setItem("toolbarFilterItem",deactivateFilterToolbar);//security
    const url = this.router.serializeUrl(this.router.createUrlTree(['/document/documentview'], {
      queryParams: {
        project_id: this.projectId,
        documentName: documentName,
        folderId: folderId,
        projectName: this.projectName,
        folderlevel: folderlevel,
        pfolderid: pfolderid,
        page_id: pageId,
        openLinkWindow: true,
      },
    }));
    console.log(url);
    window.open(url, '_blank');
    // const urlTree = this.router.createUrlTree([], {
    //   queryParams: queryParams,
    //   relativeTo: "document/documentview",
    //   skipLocationChange: true
    // });
    // window.open('/#' + urlTree.toString());
    // if (flagSet == 0) {
    //   this.router.navigate(["/document/documentview"], {
    //     queryParams: {
    //       project_id: this.projectid,
    //       documentName: documentName,
    //       folderId: folderId,
    //       projectName: this.projectName,
    //       folderlevel: folderlevel,
    //       pfolderid: pfolderid,
    //       openLinkWindow: false,
    //     },
    //   });
    // }
  }



  createLayer(documentId) {
    var uuidDate = new Date().getTime();
    var date = new Date().toISOString();
    this.documentService.defaultcreateLayer(
        this.layerName,
        this.layerType,
        uuidDate,
        date,
        uuidv1().toUpperCase(),
        this.projectId,
        documentId,
        this.page_id
      )
      .subscribe((response) => {
        console.log(response);
        this.documentService.filter("Refresh Start");
        this.addcontentservice.filter("Register Click");
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

  closeBox() {
    this.dialog.close();
  }

}