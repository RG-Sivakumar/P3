import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chapter12',
  templateUrl: './chapter12.component.html',
  styleUrls: ['./chapter12.component.css']
})
export class Chapter12Component implements OnInit {
  
  lastModifiedDate: string="";

  constructor() { }

  ngOnInit(): void {
    this.lastModifiedDate = document.lastModified;
  }

}
