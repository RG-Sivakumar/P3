import {
  Component,
  OnInit,
  Injectable,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { BehaviorSubject } from "rxjs";
import { ProjectfolderService } from "../services/projectfolder.service";
import { ActivatedRoute } from "@angular/router";
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
import { FormlistService } from "src/app/formbuilder/services/formlist.service";
import * as _ from 'lodash';
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

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
  formlist: string[];
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  constructor(
    private updateservice: ProjectfolderService,
    public service: FormlistService
  ) {
    this.service.getformlist().subscribe((data) => {
      this.formlist = data["response_body"]["form_listing"];

      this.formlist = this.formlist.filter((data) => {
        return data["is_hidden"] == true;
      });
    });
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
    this.updateservice.updatefolder(parem).subscribe((res) => {
      this.updateservice.listen();
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
  selector: "app-hidden",
  templateUrl: "./hidden.component.html",
  styleUrls: ["./hidden.component.css"],
  providers: [ChecklistDatabase],
})
export class HiddenComponent implements OnInit {
  data: string;
  id: string;
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;
  show = false;
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
  showLoader: boolean = true;
  iconChange: any;
  ShowHideProjectList: any;
  projecDetailstList: any;
  rootFolderDetails:any;

  constructor(
    private database: ChecklistDatabase,
    private service: ProjectfolderService,
    private route: ActivatedRoute,
    private dialogbox: MatDialog,
    private addcontentservice: AddcontentService,
    private moreoptionservice: MoreoptionService,
    private receiveData: DataService,
    private receiveData1: ValueService,
    private eventsService: EventGlobalService,
    private datePipe: DatePipe,
    private headerservice: HeadertitleService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.show = true;
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
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

    this.moreoptionservice.listen().subscribe((m: any) => {
      this.getFolderfromAPI();
    });

    this.addcontentservice.listen().subscribe((m: any) => {
      this.getFolderfromAPI();
    });
    this.addcontentservice.loaderActivated.subscribe((status: boolean) => {
      this.showLoader = status;
    });
  }

  ngOnInit(): void {

    this.headerservice.mainTitle("");
    this.headerservice.setTitle(this.encrptdecrpt.getItem("projectName"));
    // setTimeout(()=>{
    this.getFolderfromAPI();
    this.filterMethod();
    // },2000);
    this.searchOut();
  }
  searchOut() {
    this.eventsService.broadcast("on", "@`#11*(%");
  }

  filterMethod() {
    this.eventsService.on("on", (a) => {
      this.message = a;
      this.applyFilter(this.message);
    });
  }

  getProjectTaglist() {
    this.service.getFolderAllTag(this.projectId).subscribe((res) => {
      let getresponse_special_character = res["response_body"].folder_tags;
      if(res["response_body"].folder_tags.length>0){
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

      var uniqueProjectFilter = this.selectfolder.filter(function (
        projectlistId
      ) {
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
      this.sortandsearchCall(arrResult);
    } else {
      this.sortandsearchCall(this.selectfolder);
    }
  };

  sortandsearchCall1(arrfolder) {
  
    var folderlevel = [];
    for (var item in arrfolder) {
      folderlevel.push(arrfolder[item]["folder_level"]);
    }
    folderlevel = folderlevel.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    folderlevel = folderlevel.sort(function (a, b) { return b - a; });

    var folders = [];
    for (let item in folderlevel) {
      let oldfolder = folders;
      folders = [];
      let newset = arrfolder.filter(function (data) { return data["folder_level"] === folderlevel[item] });
      for (var dataset in newset) {
        var localdatavalue = newset[dataset];
        let foldersarray = oldfolder.filter(function (data) { return data.parent_folder_id === localdatavalue["folder_id"] });
        const node = new TodoItemNode();
        node.item = localdatavalue["folder_name"];
        node.folderdata = localdatavalue;
        node.folder_id = localdatavalue["folder_id"]
        node.parent_folder_id = localdatavalue["parent_folder_id"];
        node.created_date = localdatavalue["created_date"];
        node.modified_date = localdatavalue["last_updated_date"];
        node.annotation_count = localdatavalue["annotation_count"];
        if (foldersarray.length > 0) {
          // localdatavalue["children"]=foldersarray;
          node.children = foldersarray;
        }
        folders.push(node);
  
      }
    }
    this.database.dataChange.next(folders);
  }

  sortandsearchCall(arrfolder) {
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
  }

  getFolderfromAPI = () => {
    this.userId = this.localvalue.user_id;
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    this.service
      .getProjectfolder(this.userId, this.projectId)
      .subscribe((res) => {
        console.log(res);
        this.showLoader = false;
        let getresponse_special_character = res["response_body"]["project_master"];
        if (res["response_body"]["project_master"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'documentlist');
          console.log(change_character_list);
          res["response_body"]["project_master"] = change_character_list;
        }
        let localvalueresponse = res["response_body"]["project_master"];
        this.rootFolderDetails = localvalueresponse.filter((RData)=>{
          if(RData.parent_folder_id=='0' || RData.parent_folder_id==0){
            return RData;
          }
        });

        var projectTemplist = localvalueresponse.filter((data) => {
          return data["is_hidden"] == false;
        });
        this.projecDetailstList = projectTemplist;
        this.selectfolder = localvalueresponse;
        var changesome = this.selectfolder;
        this.ShowHideProjectList = _.cloneDeep(res["response_body"]["project_master"]);
        if (changesome != undefined) {
          var changesome1 = changesome.filter((HData) => {
            if(HData["is_hidden"] == true || HData["is_hidden"] == '1'){
              return HData;
            }
            
          });

          //Finding parent folder for hidden folders
          changesome1 = this.findParentFoldersForHiddenFolders(
            changesome1,
            localvalueresponse
          );

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

          this.receiveData.currentMessage.subscribe((message) => {
            this.sortMessage = message;
            console.log(this.selectfolder);
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
              this.selectfolder.sort((a, b) =>a.folder_name.localeCompare(b.folder_name));
              this.selectfolder.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
              this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
            } else if (this.sortMessage == "datecreatedRecentToOld") {
              this.selectfolder.sort((a, b) =>a.folder_name.localeCompare(b.folder_name));
              this.selectfolder.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
              this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
            } else if (this.sortMessage == "lastupdatedOldToRecent") {
              this.selectfolder.sort((a, b) =>a.folder_name.localeCompare(b.folder_name));
              this.selectfolder.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime());
              this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
            } else if (this.sortMessage == "lastupdatedRecentToOld") {
              this.selectfolder.sort((a, b) =>a.folder_name.localeCompare(b.folder_name));
              this.selectfolder.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime());
              this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
            }
            this.sortandsearchCall(this.selectfolder);
          });
          
          var folders = [];
          this.selectfolder = changesome3;
          folders = [];
          var folderlevel = [];

          for (var item in changesome3) {
            folderlevel.push(changesome3[item]["folder_level"]);
          }
          folderlevel = folderlevel.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
          });
          folderlevel = folderlevel.sort(function (a, b) {
            return b - a;
          });
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
              node.annotation_count = localdatavalue["annotation_count"];
              if (foldersarray.length > 0) {
                node.children = foldersarray;
              }
              folders.push(node);
            }
          }
          this.database.dataChange.next(folders);
        }
        let expandNode = this.treeControl.dataNodes[0] 
        this.treeControl.expand(expandNode);
        this.getProjectTaglist();
      });
  };

  //Jose Modified
  findParentFoldersForHiddenFolders(filterdfolders, mainfoldersList) {
    //Find folder levels from main list
    var folderlevel = [];

    for (var item in mainfoldersList) {
      folderlevel.push(mainfoldersList[item]["folder_level"]);
    }
    folderlevel = folderlevel.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    folderlevel = folderlevel.sort(function (a, b) {
      return b - a;
    });

    let filteredFolder = [];
    filterdfolders.forEach((element) => {
      let index = folderlevel.indexOf(element["folder_level"]);
      let lastFolderID = element["parent_folder_id"];
      filteredFolder.push(element);
      for (var val = index; val <folderlevel.length; val++) {
        let fold = mainfoldersList.filter(function (data) {
          return data.folder_id === lastFolderID;
        });
        if (fold.length > 0) {
          lastFolderID = fold[0]["parent_folder_id"];
          filteredFolder.push(fold[0]);
        }
      }
    });

    let tempArray = [];
    var usedFolders = [];
    filteredFolder.forEach((element) => {
      if (usedFolders.includes(element["folder_id"])) {
      } else {
        tempArray.push(element);
        usedFolders.push(element["folder_id"]);
      }
    });

    return tempArray;
  }

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
    flatNode.parent_folder_id = node.folderdata["parent_folder_id"];
    flatNode.is_folder_flag = node.folderdata["is_folder_flag"];
    flatNode.created_date = node.folderdata["created_date"];
    flatNode.modified_date = node.folderdata["last_updated_date"];
    flatNode.is_hidden = node.folderdata["is_hidden"];
    flatNode.annotation_count = node.folderdata["annotation_count"];
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
    if (
      this.dragNodeExpandOverNode &&
      node === this.dragNodeExpandOverNode &&
      node.is_folder_flag === 1
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
    if (node !== this.dragNode) {
      let newItem: TodoItemNode;
      if (this.dragNodeExpandOverArea === 1 && node.is_folder_flag === 1) {
        this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
        newItem = this.database.copyPasteItemAbove(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
      } else if (
        this.dragNodeExpandOverArea === -1 &&
        node.is_folder_flag === 1
      ) {
        this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
        newItem = this.database.copyPasteItemBelow(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
      } else if (node.is_folder_flag === 1) {
        this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
        newItem = this.database.copyPasteItem(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
      }
      // this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
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
          this.imgpath =
            "assets/images/projectdetails/P3_FolderOpenedIcon-Orange.png";
        }
      }
  }

  imgURL: any = "";

  getfoldericon(node) {
    if ((node.folder_level == 0 && node.is_folder_flag == 1 && node.is_hidden == 0)) {
      this.iconChange = "folder-img";
      this.imgURL = "assets/images/icons/P3WebIcon_17Folder.png"
      return "assets/images/icons/P3WebIcon_17Folder.png";
    } else if (node.is_hidden == 1 && node.is_folder_flag == 1) {
      this.iconChange = "folder-img";
      this.imgURL = "assets/images/icons/P3WebIcon_17Folder.png";
      return "assets/images/icons/P3WebIcon_17Folder.png";
    } else if (node.is_hidden == 0 && node.is_folder_flag == 1) {
      this.iconChange = "folder-img";
      this.imgURL = "assets/images/icons/P3WebIcon_17Folder.png";
      return "assets/images/icons/P3WebIcon_17Folder.png";
    } else if ((node.is_hidden == 0 && node.is_folder_flag == 0) || 1) {
      this.iconChange = "folder-img";
      this.imgURL = "assets/images/icons/P3WebIcon_18Doc.png"
      return "assets/images/icons/P3WebIcon_18Doc.png";
    } else {
      this.iconChange = "document-img";
      this.imgURL = "assets/images/projectdetails/P3_DocumentsIcon_Blue.png";
      return "assets/images/projectdetails/P3_DocumentsIcon_Blue.png";
    }
  }


  addContent() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialogbox.open(AddContentComponent, {
      width: "380px",
      data: {
        projectId: this.projectId,
        foldersIn: this.selectfolder,
        callback: this.triggerFunction,
        projecDetailstList: this.projecDetailstList,
        ShowHideProjectList: this.ShowHideProjectList,
      },
    });
  }

  triggerFunction = (newFolderDat) => {
    this.getFolderfromAPI();
  };

  foldermorepopup(
    folder_name,
    createdDate,
    modifiedDate,
    folderid,
    parentfolderid,
    folderlevel,
    folderflag,
    is_hidden
  ) {
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
        folderflag:folderflag,
        hidden: is_hidden,
      },
    });
  }

  foldermorepopupDoc(
    folder_name,
    createdDate,
    modifiedDate,
    folderid,
    parentfolderid,
    folderlevel,
    folderflag,
    is_hidden
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
        folderflag:folderflag,
        hidden: is_hidden,
      },
    });
  }

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
          folderflag:folderflag,
          projecDetailstList: this.projecDetailstList,
          ShowHideProjectList: this.ShowHideProjectList,
          getAlltaglist: this.getAlltaglist,
          is_hidden: true
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
          folderflag:folderflag,
          parentFolderId: parentfolderid,
          folderLevel: folderlevel,
          hidden: is_hidden,
          projecDetailstList: this.projecDetailstList,
          ShowHideProjectList: this.ShowHideProjectList,
          is_hidden: true
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
          folderflag:folderflag,
          parentFolderId: parentfolderid,
          folderLevel: folderlevel,
          hidden: is_hidden,
          projecDetailstList: this.projecDetailstList,
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
          projecDetailstList: this.projecDetailstList,
          ShowHideProjectList: this.ShowHideProjectList,
        },
      });
    }
  }

  expanded: boolean = false;
  expandedNodesList: { folder_id: string; expandMode: boolean }[] = [];

  getNodes(node) {
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
  }
}