import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaidaAutorizadaComponent } from './saida-autorizada.component';

describe('SaidaAutorizadaComponent', () => {
  let component: SaidaAutorizadaComponent;
  let fixture: ComponentFixture<SaidaAutorizadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaidaAutorizadaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaidaAutorizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
