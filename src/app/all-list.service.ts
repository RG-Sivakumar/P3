import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AllListService {
  constructor() {}
  public Projectlist: any;

  saveList(project_list) {
    this.Projectlist = project_list;
  }
  getList() {}
}
