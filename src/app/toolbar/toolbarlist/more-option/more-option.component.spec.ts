import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MoreOptionComponent } from './more-option.component';

describe('MoreOptionComponent', () => {
  let component: MoreOptionComponent;
  let fixture: ComponentFixture<MoreOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
