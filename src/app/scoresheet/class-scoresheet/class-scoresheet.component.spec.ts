import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassScoresheetComponent } from './class-scoresheet.component';

describe('ClassScoresheetComponent', () => {
  let component: ClassScoresheetComponent;
  let fixture: ComponentFixture<ClassScoresheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassScoresheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassScoresheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
