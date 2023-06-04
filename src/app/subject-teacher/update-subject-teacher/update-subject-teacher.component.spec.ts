import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubjectTeacherComponent } from './update-subject-teacher.component';

describe('UpdateSubjectTeacherComponent', () => {
  let component: UpdateSubjectTeacherComponent;
  let fixture: ComponentFixture<UpdateSubjectTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSubjectTeacherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSubjectTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
