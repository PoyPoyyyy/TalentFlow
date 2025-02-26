import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionFormUpdateComponent } from './session-form-update.component';

describe('SessionFormUpdateComponent', () => {
  let component: SessionFormUpdateComponent;
  let fixture: ComponentFixture<SessionFormUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionFormUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionFormUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
