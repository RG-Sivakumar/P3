import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MediaComponent } from "../media.component";
import { DataserviceService } from "../../services/dataservice.service";
import { StubdataService } from "../../services/stubdata.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { event } from "jquery";
import { every } from "lodash";
import { CreateDocumentService } from "../../services/create-document.service";
import { ProjectlistService } from "src/app/project-dashboard/my-project/services/projectlist.service";
import { DataService } from "src/app/data.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-stubphotos",
  templateUrl: "./stubphotos.component.html",
  styleUrls: ["./stubphotos.component.css"],
})
export class StubphotosComponent implements OnInit {
  callback_StubData: any;
  allCheckbox:boolean=false;
  loader:boolean=true;
  image: any[] = [];
  buttonDisable: boolean;
  disableTextbox = false;
  stubNumber: any;
  ProjectId: string;
  last_selected_count :any;
  bind:boolean;
  setPrefix: any = "";
  setNumber: any = "";

  //setPrefix: any = "IMG_";
  //setNumber: any = "0001";
  NoOfStubs: number = 5;
  novalue: boolean = true;
  su: login;
  sampleFormObject: any = [];
  setUserNameValue: string = "";
  usernameToggleStatus : boolean = false;
  value: any;
  array1=[]
  filter=[];
  added: boolean=false;
  constructor(
    private dialogClose: MatDialogRef<StubphotosComponent>,
    private _dialog: MatDialog,
    public stubdataService: StubdataService,
    private documentService:CreateDocumentService,
    public service: ProjectlistService,
    public commonservice:DataService,
    private encrptdecrpt:EncryptDecryptService,
    private dataService:DataService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(this.NoOfStubs,this.image)
    this.callback_StubData = this.data.callback_StubData;
    this.ProjectId=this.data.projectID;
   
    for(let i=0;i<this.image.length;i++){
      if(this.image[i].selected=true){
        this.bind=true;

      }
      else{
        this.bind=false;
      }
    }
  }



  ngOnInit(): void {
    // get previous stub changes stored.
    this.get_stub_info();
  }

  stubNumberArray: any = [];
  // stub name handle looping
  toggleDisable(event) {
    // localStorage.setItem(this.ProjectId+"-username", event)
    
    var today = new Date();
    var currDay = ("0" + today.getDate()).slice(-2);
    var currMonth = ("0" + (today.getMonth() + 1)).slice(-2);
    var currYear = today.getFullYear();
    let setnumber = Number(this.setNumber);
    var setnumberlength=0;
    if(this.setNumber!=null){
       setnumberlength = this.setNumber.length;
    }
    if (event == true) {
      
      this.disableTextbox = true;
      for (let i = 0; i < this.NoOfStubs; i++) {
        this.image[i].name = this.setUserNameValue + "-" + currYear + currMonth + currDay + "_" + (setnumber++).toString().padStart(setnumberlength, "0");
        this.image[i].name = this.image[i].name + ".jpg";
      }
    }
    else {
      this.disableTextbox = false;
      for (let i = 0; i < this.NoOfStubs; i++) {
        this.image[i].name = this.setPrefix + (setnumber++).toString().padStart(setnumberlength, "0");
        this.image[i].name = this.image[i].name + ".jpg";
      }
    }
  }

  setPrefixChange() {
    this.StubNoChange();
  }
  setNumberChange() {
    this.All(false,true);

    if (this.disableTextbox == false) {
      this.StubNoChange();
    }
    else {
      
      this.toggleDisable(true);
    }
  }


  StubNoChange() {
    var iii = this.ProjectId
    //let setnumber = Number(this.encrptdecrpt.getItem(this.ProjectId));

    if(this.setNumber!=null){
      let setnumber = Number(this.setNumber)
    let setnumberlength = this.setNumber.length;
    let setname = this.setPrefix;
    // if(this.setNumber==""){
    //   setnumber = Number('0001');
    //   setnumberlength = 4;
    // }
    // localStorage.setItem("stub_prefix", setname)
   // localStorage.setItem(this.ProjectId, setnumber.toString())
    this.image = [];
    
    for (let i = 1; i <= this.NoOfStubs; i++) {
      let filename = setname + (setnumber++).toString().padStart(setnumberlength, "0");
      let stubData = { name: filename + ".jpg", selected: false };
      this.image.push(stubData);
    }
    }
  }

  closeBox() {
    // if(this.added==false)
    // {
    //   localStorage.setItem(this.ProjectId+"-username", "true")
    // }
    this.dialogClose.close();
  }

  
  add(setPrefix, setNumber, NoOfStubs) {
    this.added=true;
    this.buttonDisable = true;
    this.loader = true;
    // this._dialog.closeAll();
    let filterStub = this.image.filter((x) => x.selected == true);
    NoOfStubs = filterStub.length;
    
    // get stub name
    var laststub = filterStub[NoOfStubs - 1]['name'];
    // get set Number length
    let get_length_of_setNumber = this.setNumber.toString().length;
    let temp_name = laststub;
    // replace .jpg ""
    var remove_jpg_name = temp_name.replace(".jpg","");
    let sliceIndex = remove_jpg_name.length - get_length_of_setNumber;
    let split_last_stub_id = remove_jpg_name.substr(sliceIndex,get_length_of_setNumber);
    
    let add_plus_1 = Number(split_last_stub_id) + 1;
    let make_stubId = (add_plus_1).toString().padStart(get_length_of_setNumber, "0");
    let generate_stubName = remove_jpg_name.substr(0,sliceIndex);
    generate_stubName = this.disableTextbox == true ? setPrefix : generate_stubName;
    let make_stub_name = `${generate_stubName}$~_${this.disableTextbox}_~^`;
    make_stub_name = this.dataService.changeFormat(make_stub_name);
    this.service.create_stub_reference_api(this.ProjectId,make_stubId,make_stub_name).subscribe((response)=>{
      console.log(response);
      this.buttonDisable = false;
      this.loader = false;
      if(response["response_code"]==200){
        this.callback_StubData(filterStub);
        this.dialogClose.close({});
      }
      else{
        this.dialogClose.close({});
      }
    },
    (error)=>{
      this.buttonDisable = false;
      this.loader = false;
    });
  
    
  }

  processimagename(checkchar1)
  {
    
    var checkchar = checkchar1.replace(".jpg","")
     let storeNumber:any = [] 
     let finalcount:any = Number(this.setNumber);
      for (let k = checkchar.length - 1; k >= 0; k--) {
        if (Number(checkchar[k]) >= 0 && Number(checkchar[k]) <= 9) {
          storeNumber.push(checkchar[k]);
        }
        else {
          break;
        }
      }
      if (storeNumber.length > 0) {
        let getLastNumber = "";
        for (let a = 0; a < storeNumber.length; a++) {
          getLastNumber = storeNumber[a] + getLastNumber;
        }
       
        let numberLength = getLastNumber.length;
        let addIncrement = Number(getLastNumber);
        this.last_selected_count = addIncrement.toString().padStart(numberLength, "0");
        
      }
    }
    


  All(event,b) {
    if(event==true)
    {
      this.allCheckbox=true;
    }
    else{
      this.allCheckbox=false;
    }
    if (event == true) {
      this.buttonDisable = false;
      this.image.forEach((element) => {
        element.selected = true;
        if(element.selected==true){
          this.bind=true
        }
      });
    } else {
      this.buttonDisable = true;
      this.image.forEach((element) => {
        element.selected = false;
      });
    }
  }
  checkboxCheck(event, e) {
    // this.image.every((element) => {

    if (this.image.every((element) => (element.selected == true))) {
      this.bind = true
    }

    if (this.image.every((element) => (element.selected == false))) {
      this.buttonDisable = true
    }
    else {
      this.buttonDisable = false;
    }





    this.value = event;
    if (e == true) {


    } else {
      this.bind = false;
      //  

    }
  }  
  // To restrict special character â while entering in keyboard.
  asciiChecker(event,word){
    var inputBox = document.getElementById('style-1');
    console.log(event,word);
    console.log(event.key);
    var word1=event.key;
    var asciiNumber=word1.charCodeAt(0);
    if(asciiNumber==226){
      return false;
    }
  }

  // if(word!=null && word!=undefined){
  //   var length=word.length;
  // }
  // var asciiNumber=word.charCodeAt(length-1);
  // console.log(asciiNumber);
  // if(asciiNumber==226){
  //   this.setPrefix=word.slice(0,length-1);
  //   console.log(this.setPrefix);
  //   return
  // }

  firstLetterCapital(event,word) {
    if(word!="â"){
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
    
      this.setPrefix = changeUpperCaseProjectName;
    }
   }
  }
  //To restrict special character â while copying and pasting â.
  myFunction(event)
  {
    this.commonservice.specialCharacterPasteRestrict(event);
  }


  decreaseNumber() {
    this.All(false,true);
    let setnumber = Number(this.setNumber);
   
    if (setnumber != 0) {
      let setnumberlength = this.setNumber.length;
      setnumber -= 1;
      this.setNumber = (setnumber).toString().padStart(setnumberlength, "0");
    
     
      if (this.disableTextbox == false) {
        this.StubNoChange();
      }
      else {
        
        this.toggleDisable(true);
      }
    }
  }

  increaseNumber() {
    if(this.NoOfStubs>0){
      console.log(this.NoOfStubs);
    }
    else{
      this.NoOfStubs=0;
    }
    this.All(false,true);
    let setnumber = Number(this.setNumber);
    var setnumberlength=0;
    if(this.setNumber!=null){
       setnumberlength = this.setNumber.length;
    }
    setnumber += 1;
    this.setNumber = (setnumber).toString().padStart(setnumberlength, "0");

    if (this.disableTextbox == false) {
      this.StubNoChange();
    }
    else {
      
      this.toggleDisable(true);
    }
  }

  addStubs(value) {
    this.All(false,true);
    value = Number(value);
   
    this.NoOfStubs = Number(this.NoOfStubs) + value;
   
    this.bind=false;
    if (this.disableTextbox == false) {
      this.StubNoChange();
    }
    else {
      this.useNamePrefix(true);
    }
  }

  useNamePrefix(event) {
    let today = new Date();
    let currDay = ("0" + today.getDate()).slice(-2);
    let currMonth = ("0" + (today.getMonth() + 1)).slice(-2);
    let currYear = today.getFullYear();
    let setnumber = Number(this.setNumber);
    var setnumberlength=0;
    if(this.setNumber!=null){
       setnumberlength = this.setNumber.length;
    }
    let tick=false;
  
    let fileinitials = this.setUserNameValue + "_" + currYear + currMonth + currDay + "_"
    this.image = [];
    if(this.allCheckbox==true)
    {
        tick=true;
    }
    if (event == true) {
      
      this.disableTextbox = true;
      for (let i = 0; i < this.NoOfStubs; i++) {
        let filename =  fileinitials + (setnumber++).toString().padStart(setnumberlength, "0");
      
        let stubData = { name: filename + ".jpg", selected: tick };
        console.log("stub",i,stubData)
        this.image.push(stubData);
      }
    }
  }

  StubNoChange1() {
    
    if (this.disableTextbox == false) {
      let setnumber = Number(this.setNumber);
      let setnumberlength = this.setNumber.length;
      let setname = this.setPrefix;
      // if(this.setNumber==""){
      //   setnumber = Number('0001');
      //   setnumberlength = 4;
      // }
      
      this.image = [];
      for (let i = 1; i <= this.NoOfStubs; i++) {
   
        let filename = setname + (setnumber++).toString().padStart(setnumberlength, "0")+".jpg";
        let stubData = { name: filename, selected: false };
        this.image.push(stubData);
        console.log(filename)
      }
    }
    else {
      this.loader=true;
      this.useNamePrefix(true);
      this.loader=false;
    }
  }
  timeout: any = null;

  onKeyStubComplete(event) {
    this.All(false,true);
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.StubNoChange1();
      }
    }, 1000);
  }

  get_stub_info(){
    this.documentService.getProjectfolder(this.ProjectId).subscribe((response) => {
      console.log(response);
      
      if(response["response_code"]==200){
        this.loader = false;
        let get_response_body = response["response_body"]["stub_name"];
        if(get_response_body == undefined || get_response_body == ""){
          this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
          get_response_body = {last_stub_id:"0001",email_id:this.su.email_id,stub_name:"IMG-$~_true_~^"};
          // get_response_body["last_stub_id"] = "0001";
          // get_response_body.email_id = this.su.email_id;
          // get_response_body.stub_name = "IMG-$~_true_~^";
        }
        this.setNumber = get_response_body.last_stub_id;
        // this.setNumber = this.encrptdecrpt.getItem(this.ProjectId)===null? "0001":this.encrptdecrpt.getItem(this.ProjectId)===undefined?"0001":this.encrptdecrpt.getItem(this.ProjectId)===""?"0001":(Number(this.encrptdecrpt.getItem(this.ProjectId))+1).toString().padStart(4, "0");
        let splitEmail = get_response_body.email_id.split("@");
        this.setUserNameValue = splitEmail[0];
        // get the stubname and clicked value
        let getstub_usename_value = get_response_body.stub_name;
        // split the stubname
        let split_stub_name = getstub_usename_value.split("$");
        let get_stub_name = split_stub_name[0];
        if(get_stub_name != ""){
          this.setPrefix = this.dataService.changeSpecialtoKeyFormat(get_stub_name);
        }
        else{
          this.setPrefix = get_stub_name;
        }
        // split the use name value
        let get_use_name_value = split_stub_name[1].split("_");
        //get if use name is been clicked or not value
        var check_username_checkstatus = get_use_name_value[1];
        // default number of stubs
        this.NoOfStubs = 5;
        // made by number of stubs array 
        this.StubNoChange();
        this.image.forEach((element) => {
          if (element.selected == false) {
            this.buttonDisable = true;
          } else {
            this.buttonDisable = false;
          }
        });
        // var check_username_checkstatus = this.encrptdecrpt.getItem(this.ProjectId + "-username")
        //Toggle to be set on page load 
        if (check_username_checkstatus == null || check_username_checkstatus === undefined || check_username_checkstatus == "true" || check_username_checkstatus == true) {
          this.usernameToggleStatus = true;
          this.disableTextbox = true;
          
          this.toggleDisable(true)
        }
        else {
          this.disableTextbox = false;
          this.usernameToggleStatus = false
        }
      }
      
    });
  }

}