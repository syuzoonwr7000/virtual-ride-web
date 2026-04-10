import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  const loginEmail = process.env.E2E_LOGIN_EMAIL;
  const loginPassword = process.env.E2E_LOGIN_PASSWORD;

  if (!loginEmail || !loginPassword) {
    throw new Error("E2E_LOGIN_EMAIL または E2E_LOGIN_PASSWORD が未設定です");
  }

  await page.goto("/login");

  await expect(page).toHaveURL(/\/login/);

  const emailInput = page.locator('input[type="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();

  await emailInput.fill(loginEmail);
  await passwordInput.fill(loginPassword);

  await page.getByRole("button", { name: /ログイン|login/i }).click();

  await page.waitForURL("**/");
  await expect(page).toHaveURL(/\/$/);
}

test.describe("auth and profile e2e", () => {
  test("未ログイン時は / から /login にリダイレクトされる", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("**/login");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("ログイン後は / で認証情報とプロフィール情報が見える", async ({ page }) => {
    const loginEmail = process.env.E2E_LOGIN_EMAIL;
    if (!loginEmail) {
      throw new Error("E2E_LOGIN_EMAIL が未設定です");
    }

    await login(page);

    await expect(page.getByRole("heading", { name: "ホーム" })).toBeVisible();
    await expect(page.getByText("認証確認")).toBeVisible();
    await expect(page.getByText("プロフィール確認")).toBeVisible();
    await expect(page.getByText('"hasSession": true')).toBeVisible();
    await expect(page.getByText(loginEmail)).toBeVisible();
  });

  test("/profile でプロフィールを更新できる", async ({ page }) => {
    await login(page);

    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();

    const suffix = Date.now().toString().slice(-6);
    const displayName = `E2E表示名-${suffix}`;
    const ftp = "255";
    const bio = `E2E自己紹介-${suffix}`;

    await page.locator('input[name="display_name"]').fill(displayName);
    await page.locator('input[name="ftp_w"]').fill(ftp);
    await page.locator('textarea[name="bio"]').fill(bio);

    await page.getByRole("button", { name: "保存する" }).click();

    await page.waitForURL(/\/profile\?message=/);

    await expect(page.getByText("プロフィールを保存しました")).toBeVisible();
    await expect(page.locator('input[name="display_name"]')).toHaveValue(displayName);
    await expect(page.locator('input[name="ftp_w"]')).toHaveValue(ftp);
    await expect(page.locator('textarea[name="bio"]')).toHaveValue(bio);

    await expect(page.getByText(displayName)).toBeVisible();
    await expect(page.getByText(`"ftp_w": ${ftp}`)).toBeVisible();
  });
});