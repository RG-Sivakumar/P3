import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MorecomponemtComponent } from './morecomponemt.component';

describe('MorecomponemtComponent', () => {
  let component: MorecomponemtComponent;
  let fixture: ComponentFixture<MorecomponemtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MorecomponemtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MorecomponemtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
