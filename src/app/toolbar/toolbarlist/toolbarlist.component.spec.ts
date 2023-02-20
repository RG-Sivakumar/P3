import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolbarlistComponent } from './toolbarlist.component';

describe('ToolbarlistComponent', () => {
  let component: ToolbarlistComponent;
  let fixture: ComponentFixture<ToolbarlistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
