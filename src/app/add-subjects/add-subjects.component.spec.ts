import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubjectsComponent } from './add-subjects.component';

describe('AddSubjectsComponent', () => {
  let component: AddSubjectsComponent;
  let fixture: ComponentFixture<AddSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
