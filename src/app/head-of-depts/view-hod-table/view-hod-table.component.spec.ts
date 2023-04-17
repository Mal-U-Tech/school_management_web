import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHodTableComponent } from './view-hod-table.component';

describe('ViewHodTableComponent', () => {
  let component: ViewHodTableComponent;
  let fixture: ComponentFixture<ViewHodTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHodTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHodTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
