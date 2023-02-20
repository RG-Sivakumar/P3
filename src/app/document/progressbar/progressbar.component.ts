import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.css']
})
export class ProgressbarComponent implements OnInit {

  @Input('get_image_format') imageformat:boolean = true;
  @Input('get_zoom_type') zoomType:string="Zooming In..."

  constructor() { }

  ngOnInit(): void {
  }

}
