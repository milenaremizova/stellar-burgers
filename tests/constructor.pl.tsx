import { expect, test } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Говяжий метеорит (отбивная)';
const MAIN_CALORIES = '2674';

const ORDER_NUMBER = '12345';

const getIngredientCard = (page: Page, name: string): Locator =>
  page.getByRole('listitem').filter({ has: page.getByRole('link', { name }) });

// вспомогательная функция, чтобы не дублировать код открытия модалки
const openIngredientModal = async (page: Page, name: string): Promise<Locator> => {
  await page.getByRole('link', { name }).click();
  const modal = page.getByTestId('modal');
  await expect(modal).toBeVisible();

  return modal;
};

test.describe('конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', { url: '**/api/**' });
    await page.goto('/');
  });

  test.describe('добавление ингредиентов', () => {
    test('булка добавляется в верх и низ конструктора', async ({ page }) => {
      const burgerConstructor = page.getByTestId('constructor');

      await getIngredientCard(page, BUN_NAME)
        .getByRole('button', { name: 'Добавить' })
        .click();

      await expect(burgerConstructor.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
      await expect(burgerConstructor.getByText(`${BUN_NAME} (низ)`)).toBeVisible();
    });

    test('начинка добавляется в середину конструктора', async ({ page }) => {
      const burgerConstructor = page.getByTestId('constructor');

      await getIngredientCard(page, MAIN_NAME)
        .getByRole('button', { name: 'Добавить' })
        .click();

      await expect(burgerConstructor.getByText(MAIN_NAME)).toBeVisible();
    });
  });

  test.describe('модальное окно ингредиента', () => {
    test('открывается с данными того ингредиента, по которому кликнули', async ({
      page,
    }) => {
      const modal = await openIngredientModal(page, MAIN_NAME);

      await expect(modal.getByText(MAIN_NAME)).toBeVisible();
      await expect(modal.getByText(MAIN_CALORIES)).toBeVisible();
    });

    test('закрывается по клику на крестик', async ({ page }) => {
      const modal = await openIngredientModal(page, MAIN_NAME);

      await modal.getByRole('button', { name: 'Закрыть' }).click();

      await expect(modal).toBeHidden();
    });

    test('закрывается по клику на оверлей', async ({ page }) => {
      const modal = await openIngredientModal(page, MAIN_NAME);

      await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });

      await expect(modal).toBeHidden();
    });
  });
});

test.describe('создание заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', { url: '**/api/ingredients' });
    await page.routeFromHAR('tests/hars/user.har', { url: '**/api/auth/user' });
    await page.routeFromHAR('tests/hars/order.har', { url: '**/api/orders' });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000',
      },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');
  });

  test('оформляет заказ, показывает его номер и очищает конструктор', async ({
    page,
  }) => {
    const burgerConstructor = page.getByTestId('constructor');

    await getIngredientCard(page, BUN_NAME)
      .getByRole('button', { name: 'Добавить' })
      .click();

    await getIngredientCard(page, MAIN_NAME)
      .getByRole('button', { name: 'Добавить' })
      .click();

    await burgerConstructor.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(ORDER_NUMBER)).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal).toBeHidden();

    await expect(burgerConstructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(burgerConstructor.getByText('Выберите начинку')).toHaveCount(1);
  });
});
