import path from 'path';
import { test } from '../fixtures';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

test('Verify successfull login', { tag: '@auth' }, async ({ app, request }) => {
  const apiUrl = 'https://api.practicesoftwaretesting.com';

  const resp = await request.post(`${apiUrl}/users/login`, {
    data: {
      'email': 'customer@practicesoftwaretesting.com',
      'password': 'welcome01'
    }
  });
  const jsonData = await resp.json() as { access_token: string };
  const token = jsonData.access_token;

  // localStorage is per-origin, so the page has to be on the site before
  // the token can be written into it
  await app.page.goto('/');

  await app.page.evaluate((token) => {
    localStorage.setItem('auth-token', token);
  }, token);

  await app.page.context().storageState({ path: authFile });
});
