import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectLoaderComponent } from './project-loader.component';

describe('ProjectLoaderComponent', () => {
  let component: ProjectLoaderComponent;
  let fixture: ComponentFixture<ProjectLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
