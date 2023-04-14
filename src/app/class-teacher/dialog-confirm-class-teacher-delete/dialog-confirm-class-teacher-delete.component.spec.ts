import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmClassTeacherDeleteComponent } from './dialog-confirm-class-teacher-delete.component';

describe('DialogConfirmClassTeacherDeleteComponent', () => {
  let component: DialogConfirmClassTeacherDeleteComponent;
  let fixture: ComponentFixture<DialogConfirmClassTeacherDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmClassTeacherDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmClassTeacherDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
