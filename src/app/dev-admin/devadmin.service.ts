import { HttpClient } from '@angular/common/http';
import { Injectable,EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { devadminprepare, devadminstatus } from './model/dev-admin-prepare-model';
import { devadminconvert } from './model/dev-admin-prepare-model';



@Injectable({
  providedIn: 'root'
})
export class DevadminService {


  formDataa = new devadminstatus();

  formData = new devadminprepare();

  readonly statusUrl = "http://18.205.80.2:3002/planotate30-tools/api/v1/p2p3conversion/p2p3_get_status";

  readonly convertUrl = ":3002/planotate30-tools/api/v1/p2p3conversion/p2p3_read_json";

  readonly prepareUrl = ":3002/planotate30-tools/api/v1/p2p3conversion/p2p3_prepare";

  readonly serverapi = "http://18.205.80.2:3002/planotate30-tools/api/v1/p2p3conversion/get_ip_status";
  constructor(private http: HttpClient) { }

  server(): Observable<any> {

    return this.http.post<any>(
      this.serverapi, null
    );
  }

  prepared(
    datas: devadminprepare, selected
  ): Observable<any> {

    var pre = new devadminprepare();

    pre.owner_name = datas.owner_name;
    pre.assignment_name = datas.assignment_name;
    pre.project_name = datas.project_name;
    pre.project_uuid = datas.project_uuid;


    console.log(selected);

    return this.http.post<any>(
      "http://" + selected + this.prepareUrl, pre
    );
  }

  // this.http.post<any>(
  //   this.APIBaseUrl , uuid
  // );

  convert(uuid,select): Observable<any> {

    var con = new devadminconvert();

    con.file_name = uuid;
    console.log(con);
    return this.http.post<any>(
      "http://" +select+ this.convertUrl, con
    );
  }

  status(
    datas: devadminstatus
  ): Observable<any> {

    var sts = new devadminstatus();

    sts.assignment_name = datas.assignment_name;
    sts.owner_name = datas.owner_name;

    return this.http.post<any>(
      this.statusUrl, sts
    );
  }

  public getValue = new EventEmitter<any>();
  


}
