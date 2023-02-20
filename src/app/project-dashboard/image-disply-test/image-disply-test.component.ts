import { Component, OnInit } from '@angular/core';
import { ProjectlistService } from '../my-project/services/projectlist.service';

@Component({
  selector: 'app-image-disply-test',
  templateUrl: './image-disply-test.component.html',
  styleUrls: ['./image-disply-test.component.css']
})
export class ImageDisplyTestComponent implements OnInit {

  constructor(
    public service: ProjectlistService
  ) { }

  ngOnInit(): void {

    this.service.displayImages().subscribe((data) => {

    })
  }

}
