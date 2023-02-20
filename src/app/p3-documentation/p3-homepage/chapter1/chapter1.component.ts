import { Location } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chapter1',
  templateUrl: './chapter1.component.html',
  styleUrls: ['./chapter1.component.css']
})
export class Chapter1Component implements OnInit, AfterViewInit {

  scrWidth:any;  
  visibilityKey:boolean=true;
  getId:string="";
  

  constructor(private location:Location,private router:ActivatedRoute) {

  }

  ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    this.getScreenSize();
  }

    getScreenSize() {
      let selectedId = this.router.snapshot.paramMap.get("id");
      this.scrollToElement(selectedId);
    }

    scrollToElement(value){
      console.log(value);
    const itemToScrollTo = document.getElementById(value);
    if (itemToScrollTo) {
      itemToScrollTo.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
  }

}
