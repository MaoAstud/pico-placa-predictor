import { TestBed } from '@angular/core/testing';
import { PicoPlacaService } from './pico-placa.service';

describe('PicoPlacaService', () => {
  let svc: PicoPlacaService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PicoPlacaService] });
    svc = TestBed.inject(PicoPlacaService);
  });

  it('allows any plate on weekends', () => {
    expect(svc.canDrive('XYZ-9991', '2025-05-17', '08:00')).toBeTrue(); // Sat
    expect(svc.canDrive('XYZ-9992', '2025-05-18', '17:00')).toBeTrue(); // Sun
  });

  it('restricts 1/2 on Monday during peak hours', () => {
    const mon = '2025-05-19'; // Monday
    expect(svc.canDrive('ABC-1231', mon, '07:30')).toBeFalse();
    expect(svc.canDrive('ABC-1232', mon, '16:30')).toBeFalse();
  });

  it('allows other digits on Monday', () => {
    const mon = '2025-05-19';
    expect(svc.canDrive('ABC-1233', mon, '08:00')).toBeTrue();
  });

  it('allows restricted plates outside peak hours', () => {
    const mon = '2025-05-19';
    expect(svc.canDrive('ABC-1231', mon, '10:00')).toBeTrue();
    expect(svc.canDrive('ABC-1232', mon, '15:59')).toBeTrue();
    expect(svc.canDrive('ABC-1231', mon, '19:31')).toBeTrue();
  });

  it('throws on invalid plate format', () => {
    expect(() => svc.canDrive('NO-DIGIT', '2025-05-19', '08:00')).toThrow();
  });
});
