import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SwitchToolbarComponent } from './switch-toolbar.component';

describe('SwitchToolbarComponent', () => {
  let component: SwitchToolbarComponent;
  let fixture: ComponentFixture<SwitchToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
