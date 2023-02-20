import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImagetostubComponent } from './imagetostub.component';

describe('ImagetostubComponent', () => {
  let component: ImagetostubComponent;
  let fixture: ComponentFixture<ImagetostubComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagetostubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagetostubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
