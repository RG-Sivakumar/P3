// import {FlatTreeControl} from '@angular/cdk/tree';
 import {Component, Injectable} from '@angular/core';
// import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
// import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
// import {CdkDragDrop} from '@angular/cdk/drag-drop';
// import { MatCheckboxChange } from '@angular/material/checkbox';
// import { SelectionModel } from '@angular/cdk/collections';
// import { ProjectfolderService } from '../services/projectfolder.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { login } from 'src/app/projectmanagement/models/login-model';
// import { DatePipe } from '@angular/common';
// import * as _ from 'lodash';

// /**
//  * File node data with nested structure.
//  * Each node has a filename, and a type or a list of children.
//  */
// export class FileNode {
//   children: FileNode[];
//   item: string;
//   folderdata: any;
//   folder_id: string;
//   parent_folder_id: string;
//   created_date: string;
//   modified_date: string;
//   is_hidden: boolean;
// }

// /** Flat node with expandable and level information */
// export class FileFlatNode {
//   constructor(
//     public  item: string,
//     public level: number,
//     public expandable: boolean,
//     public folder_id: string,
//     public parent_folder_id: string,
//     public folder_level: number,
//     public is_folder_flag: number,
//     public created_date: string,
//     public modified_date: string,
//     public is_hidden: boolean,
//     public filename: string,
//     public type: any,
//     public id: string
//   ) {}
// }

// /**
//  * The file structure tree data in string. The data could be parsed into a Json object
//  */
// const TREE_DATA = JSON.stringify({
//   Applications: {
//     Calendar: 'app',
//     Chrome: 'app',
//     Webstorm: 'app'
//   },
//   Documents: {
//     angular: {
//       src: {
//         compiler: 'ts',
//         core: 'ts'
//       }
//     },
//     material2: {
//       src: {
//         button: 'ts',
//         checkbox: 'ts',
//         input: 'ts'
//       }
//     }
//   },
//   Downloads: {
//     October: 'pdf',
//     November: 'pdf',
//     Tutorial: 'html'
//   },
//   Pictures: {
//     'Photo Booth Library': {
//       Contents: 'dir',
//       Pictures: 'dir'
//     },
//     Sun: 'png',
//     Woods: 'jpg'
//   }
// });

// /**
//  * File database, it can build a tree structured Json object from string.
//  * Each node in Json object represents a file or a directory. For a file, it has filename and type.
//  * For a directory, it has filename and children (a list of files or directories).
//  * The input will be a json object string, and the output is a list of `FileNode` with nested
//  * structure.
//  */
// @Injectable()
// export class FileDatabase {
//   dataChange = new BehaviorSubject<FileNode[]>([]);

//   get data(): FileNode[] { return this.dataChange.value; }

//   constructor() {
//     this.initialize();
//   }

//   initialize() {
//     // Parse the string to json object.
//     const dataObject = JSON.parse(TREE_DATA);

//     // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
//     //     file node as children.
//     const data = this.buildFileTree(dataObject, 0);

//     // Notify the change.
//     this.dataChange.next(data);
//   }

//   /**
//    * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
//    * The return value is the list of `FileNode`.
//    */
//   buildFileTree(obj: {[key: string]: any}, level: number, parentId: string = '0'): FileNode[] {
//     return Object.keys(obj).reduce<FileNode[]>((accumulator, key, idx) => {
//       const value = obj[key];
//       const node = new FileNode();
//       node.filename = key;
//       /**
//        * Make sure your node has an id so we can properly rearrange the tree during drag'n'drop.
//        * By passing parentId to buildFileTree, it constructs a path of indexes which make
//        * it possible find the exact sub-array that the node was grabbed from when dropped.
//        */
//       node.id = `${parentId}/${idx}`;

//       if (value != null) {
//         if (typeof value === 'object') {
//           node.children = this.buildFileTree(value, level + 1, node.id);
//         } else {
//           node.type = value;
//         }
//       }

//       return accumulator.concat(node);
//     }, []);
//   }
// }

// /**
//  * @title Tree with flat nodes
//  */

@Component({
  selector: "app-duplicatetable",
  templateUrl: "./duplicatetable.component.html",
  styleUrls: ["./duplicatetable.component.css"],
})
export class DuplicatetableComponent {

//   treeControl: FlatTreeControl<FileFlatNode>;
//   treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
//   dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
//   // expansion model tracks expansion state
//   expansionModel = new SelectionModel<string>(true);
//   dragging = false;
//   expandTimeout: any;
//   expandDelay = 1000;

//   show:boolean=false;
//   su:login;
//   projectId:string="";


//   constructor(database: FileDatabase,private service: ProjectfolderService,
//     private route: ActivatedRoute,
//     public router: Router,private datePipe: DatePipe) {
//     this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
//       this._isExpandable, this._getChildren);
//     this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
//     this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
//     this.projectId = this.route.snapshot.queryParamMap.get("project_id");

//     database.dataChange.subscribe(data => this.rebuildTreeForData(data));
//   }

//   transformer = (node: FileNode, level: number) => {
//     return new FileFlatNode(!!node.children, node.filename, level, node.type, node.id);
//   }
//   private _getLevel = (node: FileFlatNode) => node.level;
//   private _isExpandable = (node: FileFlatNode) => node.expandable;
//   private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);
//   hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;

//   // DRAG AND DROP METHODS

//   /**
//    * This constructs an array of nodes that matches the DOM
//    */
//   visibleNodes(): FileNode[] {
//     const result = [];

//     function addExpandedChildren(node: FileNode, expanded: string[]) {
//       result.push(node);
//       if (expanded.includes(node.id)) {
//         node.children.map((child) => addExpandedChildren(child, expanded));
//       }
//     }
//     this.dataSource.data.forEach((node) => {
//       addExpandedChildren(node, this.expansionModel.selected);
//     });
//     return result;
//   }

//   /**
//    * Handle the drop - here we rearrange the data based on the drop event,
//    * then rebuild the tree.
//    * */
//   drop(event: CdkDragDrop<string[]>) {
//     // console.log('origin/destination', event.previousIndex, event.currentIndex);
  
//     // ignore drops outside of the tree
//     if (!event.isPointerOverContainer) return;

//     // construct a list of visible nodes, this will match the DOM.
//     // the cdkDragDrop event.currentIndex jives with visible nodes.
//     // it calls rememberExpandedTreeNodes to persist expand state
//     const visibleNodes = this.visibleNodes();

//     // deep clone the data source so we can mutate it
//     const changedData = JSON.parse(JSON.stringify(this.dataSource.data));

//     // recursive find function to find siblings of node
//     function findNodeSiblings(arr: Array<any>, id: string): Array<any> {
//       let result, subResult;
//       arr.forEach((item, i) => {
//         if (item.id === id) {
//           result = arr;
//         } else if (item.children) {
//           subResult = findNodeSiblings(item.children, id);
//           if (subResult) result = subResult;
//         }
//       });
//       return result;

//     }

//     // determine where to insert the node
//     const nodeAtDest = visibleNodes[event.currentIndex];
//     const newSiblings = findNodeSiblings(changedData, nodeAtDest.id);
//     if (!newSiblings) return;
//     const insertIndex = newSiblings.findIndex(s => s.id === nodeAtDest.id);

//     // remove the node from its old place
//     const node = event.item.data;
//     const siblings = findNodeSiblings(changedData, node.id);
//     const siblingIndex = siblings.findIndex(n => n.id === node.id);
//     const nodeToInsert: FileNode = siblings.splice(siblingIndex, 1)[0];
//     if (nodeAtDest.id === nodeToInsert.id) return;

//     // ensure validity of drop - must be same level
//     const nodeAtDestFlatNode = this.treeControl.dataNodes.find((n) => nodeAtDest.id === n.id);
//     if (nodeAtDestFlatNode.level !== node.level) {
//       alert('Items can only be moved within the same level.');
//       return;
//     }

//     // insert node 
//     newSiblings.splice(insertIndex, 0, nodeToInsert);
    
//     // rebuild tree with mutated data
//     this.rebuildTreeForData(changedData);
//   }

//   /**
//    * Experimental - opening tree nodes as you drag over them
//    */
//   dragStart() {
//     this.dragging = true;
//   }
//   dragEnd() {
//     this.dragging = false;
//   }
//   dragHover(node: FileFlatNode) {
//     if (this.dragging) {
//       clearTimeout(this.expandTimeout);
//       this.expandTimeout = setTimeout(() => {
//         this.treeControl.expand(node);
//       }, this.expandDelay);
//     }
//   }
//   dragHoverEnd() {
//     if (this.dragging) {
//       clearTimeout(this.expandTimeout);
//     }
//   }

//   /**
//    * The following methods are for persisting the tree expand state
//    * after being rebuilt
//    */

//   rebuildTreeForData(data: any) {
//     this.dataSource.data = data;
//     this.expansionModel.selected.forEach((id) => {
//         const node = this.treeControl.dataNodes.find((n) => n.id === id);
//         this.treeControl.expand(node);
//       });
//   }

//   /**
//    * Not used but you might need this to programmatically expand nodes
//    * to reveal a particular node
//    */
//   private expandNodesById(flatNodes: FileFlatNode[], ids: string[]) {
//     if (!flatNodes || flatNodes.length === 0) return;
//     const idSet = new Set(ids);
//     return flatNodes.forEach((node) => {
//       if (idSet.has(node.id)) {
//         this.treeControl.expand(node);
//         let parent = this.getParentNode(node);
//         while (parent) {
//           this.treeControl.expand(parent);
//           parent = this.getParentNode(parent);
//         }
//       }
//     });
//   }

//   private getParentNode(node: FileFlatNode): FileFlatNode | null {
//     const currentLevel = node.level;
//     if (currentLevel < 1) {
//       return null;
//     }
//     const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
//     for (let i = startIndex; i >= 0; i--) {
//       const currentNode = this.treeControl.dataNodes[i];
//       if (currentNode.level < currentLevel) {
//         return currentNode;
//       }
//     }
//     return null;
//   }

//   showLoader:boolean=false;
//   ShowHideProjectList:any[] = [];
//   projecDetailstList:any[] = [];
//   selectfolder:any[] = [];
//   rootFolderDetails:any[] = [];


//   getFolderfromAPI = () => {
//     // this.show = true;

//     // this.userId = this.localvalue.user_id;
//     this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
//     this.service.getProjectfolder(8, this.projectId).subscribe((res) => {
//       this.show = false;
//       this.showLoader = false;
//       // this.getProjectTaglist();
//       let localvalueresponse = res["response_body"]["project_master"];


//       this.ShowHideProjectList = _.cloneDeep(res["response_body"]["project_master"]);

//       this.selectfolder = localvalueresponse;

//       if (this.selectfolder != undefined) {
//         var changesome = this.selectfolder.filter((data) => {
//           return data;
//         });

//         var changesome1 = changesome.filter((data) => {
//           return data["is_hidden"] == false;
//         });
//         this.projecDetailstList = changesome1;
//         var dateFilter4 = changesome1.filter((dateonly) => {
//           return (dateonly.created_date1 = this.datePipe.transform(
//             dateonly.created_date,
//             "MM/dd/yyyy"
//           ));
//         });
//         var changesome5 = dateFilter4.filter((dateonly1) => {
//           return (dateonly1.last_updated_date1 = this.datePipe.transform(
//             dateonly1.last_updated_date,
//             "MM/dd/yyyy"
//           ));
//         });
//         var dateFilter1 = changesome1.filter((dateonly) => {
//           return (dateonly.created_date = this.datePipe.transform(
//             dateonly.created_date,
//             "MM/dd/yyyy HH:mm:ss"
//           ));
//         });
//         var changesome3 = dateFilter1.filter((dateonly1) => {
//           return (dateonly1.last_updated_date = this.datePipe.transform(
//             dateonly1.last_updated_date,
//             "MM/dd/yyyy HH:mm:ss"
//           ));
//         });
//         this.selectfolder = changesome3;
//       }
//       // if (this.selectfolder != undefined) {
//       //   this.sortMessageReceive$ = this.receiveData.currentMessage.subscribe((message) => {
//       //     this.sortMessage = message;

//       //     if (this.sortMessage == "ascending") {
//       //       this.selectfolder.sort(this.sorter);
//       //       this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //     } else if (this.sortMessage == "descending") {
//       //       this.selectfolder.sort(this.sorterdesc);
//       //       this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //     } else if (this.sortMessage == "datecreatedOldToRecent") {
//       //       this.selectfolder.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
//       //       this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //     } else if (this.sortMessage == "datecreatedRecentToOld") {
//       //       this.selectfolder.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
//       //       this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //     } else if (this.sortMessage == "lastupdatedOldToRecent") {
//       //       this.selectfolder.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime());
//       //       this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //     } else if (this.sortMessage == "lastupdatedRecentToOld") {
//       //       this.selectfolder.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime());
//       //       this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //     }
//       //     this.sortandsearchCall(this.selectfolder);
//       //   });
//       // }
//       // this.eventsService.on("sortChange", (a) => {
//       //   this.sortMessage = a;

//       //   if (this.sortMessage == "ascending") {
//       //     this.selectfolder.sort((a, b) =>
//       //       a.folder_name.localeCompare(b.folder_name)
//       //     );
//       //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //   } else if (this.sortMessage == "descending") {
//       //     this.selectfolder.sort((a, b) =>
//       //       b.folder_name.localeCompare(a.folder_name)
//       //     );
//       //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //   } else if (this.sortMessage == "datecreatedOldToRecent") {
//       //     // this.selectfolder.sort((a, b) =>
//       //     //   a.toolbar_name.localeCompare(b.toolbar_name)
//       //     // );
//       //     // this.selectfolder.sort((a, b) =>
//       //     //   a.created_date.localeCompare(b.created_date)
//       //     // );
//       //     this.selectfolder.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
//       //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //   } else if (this.sortMessage == "datecreatedRecentToOld") {
//       //     // this.selectfolder.sort((a, b) =>
//       //     //   b.created_date.localeCompare(a.created_date)
//       //     // );
//       //     this.selectfolder.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
//       //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //   } else if (this.sortMessage == "lastupdatedOldToRecent") {
//       //     // this.selectfolder.sort((a, b) =>
//       //     //   (a.last_updated_date != undefined
//       //     //     ? a.last_updated_date
//       //     //     : a.created_date
//       //     //   ).localeCompare(
//       //     //     b.last_updated_date != undefined
//       //     //       ? b.last_updated_date
//       //     //       : b.created_date
//       //     //   )
//       //     // );
//       //     this.selectfolder.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
//       //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //   } else if (this.sortMessage == "lastupdatedRecentToOld") {
//       //     // this.selectfolder.sort((a, b) =>
//       //     //   (b.last_updated_date != undefined
//       //     //     ? b.last_updated_date
//       //     //     : b.created_date
//       //     //   ).localeCompare(
//       //     //     a.last_updated_date != undefined
//       //     //       ? a.last_updated_date
//       //     //       : a.created_date
//       //     //   )
//       //     // );
//       //     this.selectfolder.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
//       //     this.selectfolder = this.selectfolder.sort((a, b) => a.is_folder_flag - b.is_folder_flag);
//       //   }
//       //   this.sortandsearchCall(this.selectfolder);
//       //   
//       // });

//       for (let cj = 0; cj < this.selectfolder.length; cj++) {
//         if (this.selectfolder[cj].folder_level == 0 && this.selectfolder[cj].parent_folder_id == "0") {
//           this.rootFolderDetails = this.selectfolder[cj];
//           let rootFolder = { folder_id: this.selectfolder[cj].folder_id, expandMode: true }
//           this.expandedNodesList.push(rootFolder);

//           break;
//         }
//       }
//       let hideValuesArray = [];
//       for (let j = 0; j < this.projecDetailstList.length; j++) {
//         let folderIdCheck = this.projecDetailstList[j].folder_id;
//         let lengthCheck = 0;
//         for (let k = 0; k < this.projecDetailstList.length; k++) {
//           if (this.projecDetailstList[k].parent_folder_id != folderIdCheck) {
//             lengthCheck = lengthCheck + 1;
//           }
//         }
//         if (lengthCheck == this.projecDetailstList.length && this.projecDetailstList[j].parent_folder_id != "0") {
//           hideValuesArray.push(this.projecDetailstList[j].parent_folder_id);
//         }
//       }

//       let hideDetailsArray = [];
//       if (hideValuesArray.length > 0) {
//         for (let j = 0; j < hideValuesArray.length; j++) {
//           for (let m = 0; m < this.ShowHideProjectList.length; m++) {
//             if (this.ShowHideProjectList[m].folder_id == hideValuesArray[j]) {
//               hideDetailsArray.push(this.ShowHideProjectList[m]);
//             }
//           }
//         }

//       }
//       var folderlevel = [];
//       for (var item in localvalueresponse) {
//         folderlevel.push(localvalueresponse[item]["folder_level"]);
//       }
//       folderlevel = folderlevel.filter(function (elem, index, self) {
//         return index === self.indexOf(elem);
//       });
//       folderlevel = folderlevel.sort(function (a, b) {
//         return b - a;
//       });
//       var folders = [];
//       for (var item in folderlevel) {
//         let oldfolder = folders;
//         folders = [];
//         let newset = this.selectfolder.filter(function (data) {
//           return data["folder_level"] === folderlevel[item];
//         });
//         newset = newset.sort((a, b) => a.is_folder_flag - b.is_folder_flag);

//         for (var dataset in newset) {
//           var localdatavalue = newset[dataset];
//           let foldersarray = oldfolder.filter(function (data) {
//             return data.parent_folder_id === localdatavalue["folder_id"];
//           });
//           const node = new TodoItemNode();
//           node.item = localdatavalue["folder_name"];
//           node.folderdata = localdatavalue;
//           node.folder_id = localdatavalue["folder_id"];
//           node.parent_folder_id = localdatavalue["parent_folder_id"];
//           node.created_date = localdatavalue["created_date"];
//           node.modified_date =
//             localdatavalue["last_updated_date"] == undefined
//               ? localdatavalue["created_date"]
//               : localdatavalue["last_updated_date"];
//           if (foldersarray.length > 0) {
//             // localdatavalue["children"]=foldersarray;
//             node.children = foldersarray;
//           }
//           folders.push(node);
//         }
//       }
//       this.database.dataChange.next(folders);
//       if (res["response_code"] == 200) {

//         this.expandableNodesListen();
//       }
//     });
//   };
}