import { describe, it, expect } from 'vitest';
import { calculateFuelCost, calculateEVCost } from '../calculator';

describe('Fuel Economy: Unit Tests', () => {
  // Тест 1: Бензин (8л/100км, 70 грн/л)
  it('should calculate correct cost for petrol', () => {
    expect(calculateFuelCost(100, 8, 70)).toBe(560);
  });

  // Тест 2: Електро (денний тариф 4.32)
  it('should calculate EV cost at day rate', () => {
    expect(calculateEVCost(18, 4.32)).toBeCloseTo(77.76);
  });

  // Тест 3: Електро (нічний тариф -50%)
  it('should calculate EV cost at night rate', () => {
    expect(calculateEVCost(18, 4.32, true)).toBeCloseTo(38.88);
  });

  // Тест 4: Перевірка нульової дистанції
  it('should return 0 for zero distance', () => {
    expect(calculateFuelCost(0, 8, 70)).toBe(0);
  });

  // Тест 5: Обробка від'ємних значень
  it('should handle negative input safely', () => {
    expect(calculateFuelCost(-100, 8, 70)).toBe(0);
  });

  
// Тест 6: Поїздка на велику відстань (Lviv -> Kyiv ~540km)
  it('should calculate cost for long distance', () => {
    // Використовуємо toBeCloseTo для точності з плаваючою комою
    expect(calculateFuelCost(540, 6, 71)).toBeCloseTo(2300.4);
  });
});