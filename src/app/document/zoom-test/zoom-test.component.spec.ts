import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZoomTestComponent } from './zoom-test.component';

describe('ZoomTestComponent', () => {
  let component: ZoomTestComponent;
  let fixture: ComponentFixture<ZoomTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
