import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolbarhiddenComponent } from './toolbarhidden.component';

describe('ToolbarhiddenComponent', () => {
  let component: ToolbarhiddenComponent;
  let fixture: ComponentFixture<ToolbarhiddenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarhiddenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarhiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
