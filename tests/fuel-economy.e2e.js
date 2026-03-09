import { test, expect } from '@playwright/test';

test.describe('Fuel Economy: Critical Path', () => {
  test.beforeEach(async ({ page }) => {
    // Вкажи порт, на якому працює твій локальний сервер (Vite)
    await page.goto('http://localhost:5173/'); 
  });

test('should calculate cost and update UI', async ({ page }) => {
  // 1. Введення даних (якщо ці ID існують в HTML, залишаємо, 
  // інакше використовуємо getByLabel або getByRole)
  await page.fill('#distance', '100');
  await page.fill('#consumption', '8');
  await page.fill('#price', '70');

  // 2. Дія: Знаходимо кнопку за її назвою (як у знімку сторінки)
  await page.getByRole('button', { name: 'Розрахувати вартість' }).click();

  // 3. Перевірка результату: Знаходимо заголовок із текстом результату
  const resultHeader = page.getByRole('heading', { level: 2 });
  await expect(resultHeader).toBeVisible();
  await expect(resultHeader).toContainText('560');
  });
});