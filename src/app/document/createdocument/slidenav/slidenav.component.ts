import { AfterViewInit, Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-slidenav',
  templateUrl: './slidenav.component.html',
  styleUrls: ['./slidenav.component.css']
})
export class SlidenavComponent implements OnInit, AfterViewInit {

  changeViewWidth: any = "26%";
  changeViewWidth1: any = "74%";
  changeViewWidthNumber = 400;
  // changeViewWidthNumber = 341.5;
  mediaSectionBootCol: any = "col-6";
  mediaSectionBootColPhotos: any = "col-4";
  alignCenterMedia: boolean = false;
  @Output('disable_document') slideDrag_changes = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.makeResizableDiv();
  }

  screenWidthValue: any = 0;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidthValue = event.target.innerWidth;
  }

  makeResizableDiv() {
    const element = document.getElementById('resizers');
    const resizers = document.querySelectorAll('.resizer');
    const minimum_size = 0;
    let original_width = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    let mousedown = false;
    var parentwidth;
    var div1width;
    var div2width;
    let second_div_width = 0;
    let width = 0;
    let maximumSize = 0;
    let convertdiv1percentage = 0;
    let getDiv2Width = 0;
    for (let i = 0; i < resizers.length; i++) {
      const currentResizer = resizers[i];
      let get_left_side_ele = document.getElementById("resizers");
      let get_right_side_ele = document.getElementById("rightSideDiv");
      currentResizer.addEventListener('mousedown', (e: any) => {
        // if(this.column==true){
        e.preventDefault();
        this.slideDrag_changes.emit(false);
        parentwidth = document.getElementById("welldone").clientWidth;
        div1width = get_left_side_ele.clientWidth;
        div2width = get_right_side_ele.clientWidth;
        mousedown = true;
        original_width = this.changeViewWidthNumber;
        original_x = element.getBoundingClientRect().left;
        original_y = element.getBoundingClientRect().top;
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        window.addEventListener('mousemove', (e) => {
          if (mousedown == true) {
            resize(e);
          }
        });
        window.addEventListener('mouseup', (e) => {
          stopResize(e)
        })
        // }
      });

      const resize = (e) => {
        e.preventDefault();
        if (currentResizer.classList.contains('top-right')) {
          width = original_width + (e.pageX - original_mouse_x);
          maximumSize = Math.round((width / parentwidth) * 100);
          if (maximumSize <= 50) {
            // element.style.width = width + 'px';
            this.changeViewWidthNumber = width;
            convertdiv1percentage = Math.round((width / parentwidth) * 100);
            if (this.changeViewWidthNumber <= 217 && this.screenWidthValue <= 1366) {
              this.alignCenterMedia = true;
            }
            else if (this.changeViewWidthNumber <= 217 && this.screenWidthValue > 1366) {
              this.alignCenterMedia = true;
            }
            else {
              this.alignCenterMedia = false;
            }
            // this.changeViewWidth = convertdiv1percentage + '%';
            getDiv2Width = parentwidth - width;
            second_div_width = Math.round((getDiv2Width / parentwidth) * 100);
            // this.changeViewWidth1 = second_div_width + '%';
            get_left_side_ele.style.width = convertdiv1percentage + '%';
            get_right_side_ele.style.width = second_div_width + '%';
          }
        }
        else {
          width = original_width - (e.pageX - original_mouse_x)
          this.changeViewWidth = width + 'px';
          if (width > minimum_size) {
            // element.style.width = width + 'px'
            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
            this.changeViewWidthNumber = width;
            convertdiv1percentage = Math.round((width / parentwidth) * 100);
            if (this.changeViewWidthNumber <= 217 && this.screenWidthValue <= 1366) {
              this.alignCenterMedia = true;
            }
            else if (this.changeViewWidthNumber <= 217 && this.screenWidthValue > 1366) {
              this.alignCenterMedia = true;
            }
            else {
              this.alignCenterMedia = false;
            }
            // if (convertdiv1percentage < 18) {
            //   this.mediaSectionBootCol = "col-12";
            // }
            // else {
            //   this.mediaSectionBootCol = "col-6";
            // }
            // if (convertdiv1percentage <= 16) {
            //   this.mediaSectionBootColPhotos = "col-12";
            //   this.alignCenterMedia = true;
            // }
            // else if (convertdiv1percentage <= 24) {
            //   this.mediaSectionBootColPhotos = "col-6";
            //   this.alignCenterMedia = false;
            // }
            // else if (convertdiv1percentage >= 30 && convertdiv1percentage <= 44) {
            //   this.mediaSectionBootColPhotos = "col-3";
            //   this.alignCenterMedia = false;
            // }
            // else if (convertdiv1percentage >= 45 && convertdiv1percentage <= 79) {
            //   this.mediaSectionBootColPhotos = "col-2";
            //   this.alignCenterMedia = false;
            // }
            // else if (convertdiv1percentage >= 80) {
            //   this.mediaSectionBootColPhotos = "col-2";
            //   this.alignCenterMedia = false;
            // }
            // else {
            //   this.mediaSectionBootColPhotos = "col-4";
            //   this.alignCenterMedia = false;
            // }
            this.changeViewWidth = convertdiv1percentage + '%';
            let getDiv2Width = parentwidth - width;
            let convertdiv2percentage = Math.round((getDiv2Width / parentwidth) * 100);
            console.log(convertdiv2percentage);
            this.changeViewWidth1 = convertdiv2percentage + '%';
          }
          console.log(width);
        }
      }

      const stopResize = (e) => {
        e.preventDefault();
        if(mousedown == true){
          mousedown = false;
        // this.changeViewWidth1 = second_div_width + '%';
        e.stopPropagation();
        window.removeEventListener('mousemove',resize)
        window.removeEventListener('mouseup',stopResize);
        this.slideDrag_changes.emit(true);
        // this.slideAfterScale();
        }
        
      }
    }
  }

}
