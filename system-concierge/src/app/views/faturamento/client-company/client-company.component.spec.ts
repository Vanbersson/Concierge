import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCompanyComponent } from './client-company.component';

describe('ClientCompanyComponent', () => {
  let component: ClientCompanyComponent;
  let fixture: ComponentFixture<ClientCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
