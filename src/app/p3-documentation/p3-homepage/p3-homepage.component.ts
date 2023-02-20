import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { DataService } from 'src/app/data.service';
import moment from 'moment';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
@Component({
  selector: 'app-p3-homepage',
  templateUrl: './p3-homepage.component.html',
  styleUrls: ['./p3-homepage.component.css']
})
export class P3HomepageComponent implements OnInit,AfterViewInit {

  lastModifiedDate: string = "";
  pageLoader:boolean=false;
  // last_updated_date = new Date();
  backButtonTrigger:boolean=false;
  constructor(private router: Router, private location: Location,private dataService:DataService,
    private encrptdecrpt:EncryptDecryptService) {
    this.dataService.checkPageLoading.subscribe((value)=>{
      this.pageLoader = value;
    });
    this.backButtonTrigger = this.encrptdecrpt.getItem("ipadValidation");
    this.backButtonTrigger = (this.backButtonTrigger == null || this.backButtonTrigger == undefined) ? false : true;
    // let updatedconvertDate = moment.utc(this.last_updated_date).toDate(); 
    // document.write(document.lastModified);
    this.dataService.hideButtonAnotherOne.subscribe((value1)=>{
      this.backButtonTrigger = value1;
    });
    this.lastModifiedDate = document.lastModified;
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit():void{
    
  }

  goOut() {
    this.router.navigate(['/projectdashboard/support']);
  }

  goIntroduction() {
    this.router.navigate(["chapter-1"]);
  }


  goPickedchapter(chapter,section){
    let routeItem = '/p3/userguide/'+chapter;
    console.log(routeItem);
    this.router.navigate([routeItem],{ queryParams:{id:section}});
  }

  appleIconClick(){
    window.open('itms-services://?action=download-manifest&url=https://plannotate3devbucket.s3.amazonaws.com/Ipad-Build/manifest.plist');
  }

  goPickedchapterSidebar(event,chapter,section,target){
    event.preventDefault();
    let routeItem = '/p3/userguide/'+chapter;
    console.log(routeItem);
    this.router.navigate([routeItem],{ queryParams:{id:section,target:target}});
  }

}
