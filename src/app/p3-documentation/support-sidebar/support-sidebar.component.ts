import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { ChapterActiveService } from '../chapterActive.service'

 

@Component({
  selector: 'app-support-sidebar',
  templateUrl: './support-sidebar.component.html',
  styleUrls: ['./support-sidebar.component.css']
})
export class SupportSidebarComponent implements OnInit,AfterViewInit {
  visibilityKey:boolean=true;
  scrWidth:any;  
  chapterCheck:string="section-1";
  activeOption:string="section-1";

  constructor(private route: ActivatedRoute, private router: Router, private ChapterActiveService: ChapterActiveService,
    private ChangeDetector: ChangeDetectorRef,private dataService:DataService) {
    this.chapterCheck = this.route.snapshot.queryParamMap.get("id");
    this.activeOption = this.chapterCheck;
    console.log(this.activeOption);
    this.dataService.activeVisitionSend.subscribe((value)=>{
      this.chapterCheck = value.section;
      this.activeOption = value.id;
    });
    this.dataService.sidebarToggleOption.subscribe(()=>{
      this.visibilityKey = !this.visibilityKey;
    });
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        let id = this.route.snapshot.queryParamMap.get("id");
        let target = this.route.snapshot.queryParamMap.get("target");
        console.log(id,target);
        if (target != null) {
          let elementValue = target;
          this.chapterCheck = id;
          this.activeOption = target;
          var element = document.getElementById(elementValue);
          var headerOffset = 60;
          if(element!=null){
            var elementPosition = element.getBoundingClientRect().top;
            var offsetPosition = elementPosition - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });  
          }
        }
        else {
          let elementValue = id;
          this.chapterCheck = id;
          this.activeOption = id;
          var element = document.getElementById(elementValue);
          var headerOffset = 60;
          if(element!=null){
            var elementPosition = element.getBoundingClientRect().top;
            var offsetPosition = elementPosition - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });  
          }
        }
        this.ChangeDetector.detectChanges();
      }
    });
  }

  ngOnInit(): void {
   
  }

  ngAfterViewInit():void{
    this.getScreenSize();

  }

  // @HostListener('window:scroll', ['$event'])
  // checkOffsetTop() {
  //   console.log(window.pageYOffset); // this will console log our scroll position
  // }

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
      this.scrWidth = window.innerWidth;
      if (this.scrWidth >= 1200) {
        // if larger 
        this.visibilityKey = true; 
      } else {
        // if smaller
        this.visibilityKey = false; 
      }
    }


  scrollToElement(value) {
    this.activeOption = value;
    if(this.scrWidth<1200){
      this.visibilityKey = !this.visibilityKey;
    }
  }

  goPickedchapterSidebar(chapter,section){
    if(this.scrWidth<1200){
      this.visibilityKey = !this.visibilityKey;
    }
    let routeItem = '/p3/userguide/'+chapter;
    console.log(routeItem);
    this.chapterCheck = section;
    this.activeOption = section;
    this.router.navigate([routeItem],{ queryParams:{id:section}});
  }


}
