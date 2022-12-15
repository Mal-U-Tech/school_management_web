import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassnameComponent } from './classname.component';

describe('ClassnameComponent', () => {
  let component: ClassnameComponent;
  let fixture: ComponentFixture<ClassnameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassnameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
