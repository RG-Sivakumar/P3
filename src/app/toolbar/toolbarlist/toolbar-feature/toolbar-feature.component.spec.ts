import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolbarFeatureComponent } from './toolbar-feature.component';

describe('ToolbarFeatureComponent', () => {
  let component: ToolbarFeatureComponent;
  let fixture: ComponentFixture<ToolbarFeatureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
