import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageSortComponent } from './page-sort.component';

describe('PageSortComponent', () => {
  let component: PageSortComponent;
  let fixture: ComponentFixture<PageSortComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
