import { Component, OnInit } from '@angular/core';
import { HeadertitleService } from 'src/app/headertitle.service';
import { p3version } from 'src/app/models/version-global';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  year: number;
  month: string;
  day: string;
  versionNumber:string=p3version.versionNumber;

  constructor(private headerService: HeadertitleService,) {
   }

  ngOnInit(): void {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.headerService.setTitle('About');
    var today = new Date();
    this.day = String(today.getDate()).padStart(2, '0');
    this.month = monthNames[today.getMonth()] //January is 0!
    this.year = today.getFullYear();
  }

}
