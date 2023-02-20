import {
  Component,
  OnInit,
  Injectable,
  ElementRef,
  ViewChild,
  Inject,
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
import { ActivatedRoute } from "@angular/router";
import { MoreoptionService } from "../services/moreoption.service";
import { SuccessComponent } from "src/app/document/success/success.component";
import {
  MatDialogConfig,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AddContentComponent } from "../add-content/add-content.component";
import { FolderMoreComponent } from "../folder-more/folder-more.component";
import { AddcontentService } from "../services/addcontent.service";
import { v1 as uuidv1 } from "uuid";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { DataService } from "src/app/data.service";
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
  show = false;
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
      is_hidden: false,
    };

    this.show = true;
    this.updateservice.updatefolder(parem).subscribe((res) => {
      this.show = false;
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
  selector: "app-fieldselectfolder",
  templateUrl: "./fieldselectfolder.component.html",
  styleUrls: ["./fieldselectfolder.component.css"],
  providers: [ChecklistDatabase],
})
export class FieldselectfolderComponent implements OnInit, OnDestroy {
  @ViewChild("tree") tree;
  type: any;
  user_id: any;
  oldfolderId: any;
  su: any;

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
  value:boolean=false;
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
  imgpath: string = "assets/images/icons/P3WebIcon_17Folder.png";
  localvalue = this.encrptdecrpt.getItem("loggedIn");
  userId: number;
  projectId: string;
  selectfolder = [];
  uuidValue: string;
  document_name: string;
  callback: any;
  noofPage: any;
  mode: string;
  receiveFileType: string;
  documentId: string;
  layerName: string = "Default";
  layerType = "blank";
  page_id: any[] = [];
  iconChange: string = "";
  projecDetailstList: any[] = [];
  sortMessage: string;
  subscription: Subscription;

  constructor(
    private database: ChecklistDatabase,
    private service: ProjectfolderService,
    private route: ActivatedRoute,
    private dialogbox: MatDialog,
    private addcontentservice: AddcontentService,
    private dialog: MatDialogRef<FieldselectfolderComponent>,
    private documentService: CreateDocumentService,
    private receiveDataSort: DataService,
    private moreoptionservice: MoreoptionService,
    private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any
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

    database.dataChange.subscribe((data) => {
      this.dataSource.data = [];
      this.dataSource.data = data;
    });
  
    var receivedata = this.data;
    this.document_name = receivedata.document_name;
    this.projectId = receivedata.projectId;
    this.callback = receivedata.callback;
    this.noofPage = receivedata.noofPage;
    this.type = receivedata.type;
    this.projecDetailstList = receivedata.projecDetailstList;
    this.mode = receivedata.mode;
    this.oldfolderId = receivedata.oldFolderID;
     
  }



  ngOnInit(): void {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.getFolderfromAPI();
  }
  show: boolean = false;
  getFolderfromAPI = () => {
    this.userId = this.localvalue.user_id;
    this.show = false;
    let localvalueresponse = this.projecDetailstList;
    console.log(localvalueresponse);
    if (localvalueresponse != undefined) {
      this.selectfolder = localvalueresponse;
      var changesome = this.selectfolder
      var changesome = changesome.filter((data) => {
        return data["is_hidden"] == false;
      });
      this.selectfolder = changesome;
      if (this.selectfolder != undefined) {
        this.subscription = this.receiveDataSort.currentMessage.subscribe((message) => {
          this.sortMessage = message;
          console.log(this.sortMessage);
          if (this.sortMessage == "ascending") {
            this.selectfolder.sort((a, b) =>
              a.folder_name.localeCompare(b.folder_name)
            );
            this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
          } else if (this.sortMessage == "descending") {
            this.selectfolder.sort((a, b) =>
              b.folder_name.localeCompare(a.folder_name)
            );
            this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
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
          // this.sortandsearchCall(this.selectfolder);
        });
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
      this.treeControl.expandAll();
    }
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

    for (var i = 0; i < this.dataSource._data.value.length; i++)
      if (node.item == this.dataSource._data.value[i].item) {
        if (imgdir[i]) {
          this.imgpath = "assets/images/projectdetails/P3_FolderOpenedIcon-Orange.png";
        }
      }
  }

  getfoldericon(node) {
    if (node.is_folder_flag == 1) {
      this.iconChange = "folder-img";
      return "assets/images/icons/P3WebIcon_17Folder.png";
    }
    else {
      this.iconChange = "document-img";
      return "assets/images/projectdetails/P3_DocumentsIcon_Blue.png";
    }
  }

  showChildren(node) { }

  loader: boolean = false;

  addfieldsheet(level, folderid) {
    if(this.type == "project"){
      this.copyDocAnotherProj(level, folderid)
    }
    else{
      this.value=true;
      this.addcontentservice.loaderActivated.emit(true);
      this.loader = true;
      console.log(this.projectId,
        this.document_name,
        folderid,
        level,
        this.noofPage,
        this.mode,
        uuid,
        date,
        this.page_id);
      var date = new Date().getTime();
      var uuid = uuidv1().toUpperCase();
      this.documentId = this.su.user_id + "-" + uuid + "-" + date;
      this.page_id = [];
      for (var i = 0; i < this.noofPage; i++) {
        let datePage = new Date().getTime();
        this.page_id.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + datePage);
      }
      this.addcontentservice
        .fieldSheetAuc(
          this.projectId,
          this.document_name,
          folderid,
          level,
          this.noofPage,
          this.mode,
          uuid,
          date,
          this.page_id
        )
        .subscribe((res) => {
          console.log(res);
          this.createLayer(this.documentId);
          // this.callback();
        });
    }
  }

  copyDocAnotherProj(level, folderId) {
    var newfolderId = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
    var createdDate = new Date().toISOString();
    var updatedDate = new Date().toISOString();
    var sync_version_uuid = this.su.user_id;
    var email = this.su.email_id;
    var docName = this.document_name;
    var projectId = this.projectId;
    var parentFolderId = folderId;
    var newLevel = level + 1;
    var userid = this.su.user_id;
    console.log(this.su);
    console.log(this.oldfolderId)
    this.moreoptionservice.copywithAnnotProject(newfolderId,createdDate,updatedDate,sync_version_uuid,
      email,docName, projectId, parentFolderId,newLevel,userid,this.oldfolderId).subscribe((res)=>{
      console.log(res);
      if(res.response_code == 200){
        this.dialogbox.closeAll()
        this.dialogbox.open(SuccessComponent, {
          width: '500px',
          data: {
            status: "true",
            title: "export",
          }
        });

      }
      })
  }

  createLayer(documentId) {
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
        this.page_id
      )
      .subscribe((response) => {
        console.log(response);
        if (response["response_code"] == 200) {
          let layerId = this.su.user_id + "-" + uuid + "-" + uuidDate;
          this.setActiveLayerId(layerId);
        }
      });
  }

  setActiveLayerId(layerId) {
    this.service.setactivelayerUpdate(this.documentId, this.page_id, layerId).subscribe((response) => {
      if (response["response_code"] == 200) {
        this.loader = false;
        // this.documentService.filter("Refresh Start");
        this.addcontentservice.filter("Register Click");
        this.dialog.close();
      }
      else{
        this.loader = false;
      }
    });
  }

  closeBox() {
    this.dialog.close();
  }

  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }
}
