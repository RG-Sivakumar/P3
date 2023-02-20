import { AfterViewInit, Component, HostListener, OnInit,ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ScrollTo } from 'ng2-scroll-to';
import { ChapterActiveService } from '../chapterActive.service'
import { ScrollSpyService } from 'ngx-scrollspy';

@Component({
  selector: 'app-chapter-model',
  templateUrl: './chapter-model.component.html',
  styleUrls: ['./chapter-model.component.css']
})
export class ChapterModelComponent implements OnInit,AfterViewInit {

  scrollView:string="";
  currentSection = 'section-1';

  constructor(private router:ActivatedRoute,private ChapterActiveService:ChapterActiveService,private ChangeDetector: ChangeDetectorRef,
    private routerChange:Router,private scrollSpyService: ScrollSpyService) { 
    
    window.onload = ((event:any)=>{
      console.log(event);
      let id = this.router.snapshot.queryParamMap.get("id");
      console.log(id);
      this.scrollView = this.router.snapshot.queryParamMap.get("target");
      console.log(this.scrollView);
      if(this.scrollView!=null){
      var element = document.getElementById(this.scrollView);
      // var headerOffset = 60;
      // var elementPosition = element.getBoundingClientRect().top;
      // var offsetPosition = elementPosition - headerOffset;
      // window.scrollTo({
      //      top: offsetPosition,
      //      behavior: "smooth"
      // });
            var node = element;
            var yourHeight = 50;

      // scroll to your element
      node.scrollIntoView(true);

      // now account for fixed header
      var scrolledY = window.scrollY;
        console.log(scrolledY,50);
      if(scrolledY){
        window.scroll(0, scrolledY - yourHeight);
      }
      let value = {id:id,target:this.scrollView};
      this.ChapterActiveService.currentActiveOption.emit(value);
      }
      else{
        let value = {id:id,target:id};
        this.ChapterActiveService.currentActiveOption.emit(value);
      }
      this.ChangeDetector.detectChanges();
    });
    routerChange.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
      let id = this.router.snapshot.queryParamMap.get("id");
      console.log(id);
      this.scrollView = this.router.snapshot.queryParamMap.get("target");
      console.log(this.scrollView);
      if(this.scrollView!=null){
      var element = document.getElementById(this.scrollView);
      console.log(element);
      var headerOffset = 60;
      var elementPosition = element.getBoundingClientRect().top;
      var offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
           top: offsetPosition,
           behavior: "smooth"
      });
      let value = {id:id,target:this.scrollView};
      this.ChapterActiveService.currentActiveOption.emit(value);
      }
      else{
        let value = {id:id,target:id};
        this.ChapterActiveService.currentActiveOption.emit(value);
      }
      this.ChangeDetector.detectChanges();
      }
    });
  }

  // @HostListener('window:scroll', ['$event'])
  // checkOffsetTop(event:any) {
  //   $('[data-spy="scroll"]').on('activate.bs.scrollspy', (element)=> {
  //     console.log(element);
  //   });
    
  //   console.log(event);
  //   let children = document.querySelectorAll('section');
  //   let currentSection = "section-1";
  //   let headerOffset = 60;
  //   const scrollTop = event.target.scrollTop;
  //   const parentOffset = event.target.offsetTop;
  //   for (let i = 0; i < children.length; i++) {
  //     const element = children[i];
  //     console.log(element);
  //     var elementPosition = element.getBoundingClientRect().top;
  //     console.log(elementPosition,scrollTop);
  //     var offsetPosition = elementPosition - headerOffset;
  //         if ((element.offsetTop - parentOffset) <= scrollTop) {
  //             currentSection = element.id;
  //             console.log(currentSection);
  //     }
  // }
  // if (currentSection !== this.currentSection) {
  //     this.currentSection = currentSection;
  //     console.log(this.currentSection);
  // }
  // }

  ngOnInit(): void {
    
  }


  ngAfterViewInit():void{
    let activeOne = document.activeElement;
    console.log(activeOne);
    // this.scrollSpyService.getObservable('window').subscribe((e: any) => {
		// 	console.log('ScrollSpy::window: ', e);
		// });
  }

}
