import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UseasnewtoolbarComponent } from './useasnewtoolbar.component';

describe('UseasnewtoolbarComponent', () => {
  let component: UseasnewtoolbarComponent;
  let fixture: ComponentFixture<UseasnewtoolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UseasnewtoolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseasnewtoolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
