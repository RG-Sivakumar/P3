import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarouselConfig, NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tutorial-1',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css'],
  providers: [NgbCarouselConfig]
})
export class TutorialComponent implements OnInit {

  showNavigationArrows = false;
	showNavigationIndicators = false;

	constructor(config: NgbCarouselConfig) {
		// customize default values of carousels used by this component tree
		config.interval = 10000;
		config.wrap = false;
		config.keyboard = false;
		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
	}
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
	paused = false;
	  unpauseOnArrow = false;
	  pauseOnIndicator = false;
	  pauseOnHover = true;

	  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

	  togglePaused() {
	    if (this.paused) {
	      this.carousel.cycle();
	    } else {
	      this.carousel.pause();
	    }
	    this.paused = !this.paused;
	  }

	  onSlide(slideEvent: NgbSlideEvent) {
	    if (this.unpauseOnArrow && slideEvent.paused &&
	      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
	      this.togglePaused();
	    }
	    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
	      this.togglePaused();
	    }
	  }

}
