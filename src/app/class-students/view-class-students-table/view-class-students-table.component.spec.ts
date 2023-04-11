import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClassStudentsTableComponent } from './view-class-students-table.component';

describe('ViewClassStudentsTableComponent', () => {
  let component: ViewClassStudentsTableComponent;
  let fixture: ComponentFixture<ViewClassStudentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewClassStudentsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewClassStudentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
