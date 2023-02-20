import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { DataService } from 'src/app/data.service';
import { ChapterActiveService } from '../chapterActive.service';

@Component({
  selector: 'app-support-header',
  templateUrl: './support-header.component.html',
  styleUrls: ['./support-header.component.css']
})
export class SupportHeaderComponent implements OnInit,AfterViewInit {

  previousRoute:string;
  backButtonTrigger:boolean=false;

  constructor(private router:Router,private route:ActivatedRoute,private DataService:DataService,
    private chapterActivePlace:ChapterActiveService,private encrptdecrpt:EncryptDecryptService) { 
    this.previousRoute = this.route.snapshot.queryParamMap.get("code");
  }

  ngOnInit(): void {
   
  }

  gotoUserGuide(){
    this.router.navigateByUrl('p3/userguidehome');
    // this.DataService.checkPageLoading.emit(true);
  }

  ngAfterViewInit(): void {
    this.backButtonTrigger = this.encrptdecrpt.getItem("ipadValidation");
    this.backButtonTrigger = (this.backButtonTrigger == null || this.backButtonTrigger == undefined) ? false : true;
  }

  gotoSupportPage(){
    this.router.navigate(['/projectdashboard/support']);
  }

  sidebarToggle(){
    this.DataService.sidebarToggleOption.emit();
  }





}
