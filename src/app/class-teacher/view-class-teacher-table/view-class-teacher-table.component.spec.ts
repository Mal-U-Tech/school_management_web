import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClassTeacherTableComponent } from './view-class-teacher-table.component';

describe('ViewClassTeacherTableComponent', () => {
  let component: ViewClassTeacherTableComponent;
  let fixture: ComponentFixture<ViewClassTeacherTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewClassTeacherTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewClassTeacherTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
