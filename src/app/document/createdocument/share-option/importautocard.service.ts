import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { environment } from 'src/environments/environment.prod';
import { autocad } from './autocad.model';

@Injectable({
  providedIn: 'root'
})
export class ImportautocardService {
  readonly APIBaseUrl = environment.APIBaseUrl;
  readonly export_url=environment.APIExportUrl
  su: any;
  constructor(public Http:HttpClient,private encrptdecrpt:EncryptDecryptService) {
    
   }
   incertDoc(file,document_id,layer_id,project_id,page_id) {
    
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    const formdataDireUpFl: FormData = new FormData();
    formdataDireUpFl.append("file_data",file);
    formdataDireUpFl.append("document_id",document_id);
    formdataDireUpFl.append("layer_id",layer_id);
    formdataDireUpFl.append("project_id",project_id);
    formdataDireUpFl.append("page_id",page_id);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
     formdataDireUpFl.append("token",token);
    formdataDireUpFl.append("user_id", this.su.user_id.toString());
    formdataDireUpFl.append("updated_by_userid", this.su.user_id.toString());
    console.log(file,token,this.su.user_id.toString())
    return this.Http.post(this.APIBaseUrl + "autocad/preview_json",formdataDireUpFl);
  }
  save(process){
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Access-Control-Allow-Origin':'*',
       
      })
    };
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var imports=new autocad()
    imports.user_id=this.su.user_id
    imports.process_id=process
    imports.updated_by_userid=this.su.user_id.toString();
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    console.log(imports,token)
    return this.Http.post<any>(
      this.APIBaseUrl + "autocad/import_autocad", {...imports,token},httpOptions
      
    );
  
  }
  importdoccsv(file,project_id){
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    const formdataDireUpFl: FormData = new FormData(); 
    formdataDireUpFl.append("file",file);
    formdataDireUpFl.append("user_id",this.su.user_id);
    formdataDireUpFl.append("project_id",project_id);
    return this.Http.post<any>(
      this.export_url + "import_form_data",formdataDireUpFl); 
  }
}
