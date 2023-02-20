import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RmcomponentComponent } from './rmcomponent.component';

describe('RmcomponentComponent', () => {
  let component: RmcomponentComponent;
  let fixture: ComponentFixture<RmcomponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RmcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
