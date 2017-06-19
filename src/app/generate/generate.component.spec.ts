import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateComponent } from './generate.component';

describe('GenerateComponent', () => {
  let component: GenerateComponent;
  let fixture: ComponentFixture<GenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
