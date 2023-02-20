import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClayeralertComponent } from './clayeralert.component';

describe('ClayeralertComponent', () => {
  let component: ClayeralertComponent;
  let fixture: ComponentFixture<ClayeralertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClayeralertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClayeralertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
