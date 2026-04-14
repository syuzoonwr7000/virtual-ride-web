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

  await Promise.all([
    page.waitForURL("**/"),
    page.getByRole("button", { name: /ログイン|login/i }).click(),
  ]);

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

  test("/profile で username を更新できる", async ({ page }) => {
    await login(page);

    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();

    const suffix = Date.now().toString().slice(-6);
    const username = `e2e_user_${suffix}`;

    await page.locator('input[name="username"]').fill(username);
    await page.getByRole("button", { name: "保存する" }).click();

    await page.waitForURL(/\/profile\?message=/);

    await expect(page.getByText("プロフィールを保存しました")).toBeVisible();
    await expect(page.locator('input[name="username"]')).toHaveValue(username);

    await page.goto("/");
    await expect(page.getByText(username)).toBeVisible();
  });

  test("/profile で不正な username は保存できない", async ({ page }) => {
    await login(page);

    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();

    const beforeValue = await page.locator('input[name="username"]').inputValue();

    await page.locator('input[name="username"]').fill("ab__cd");
    await page.getByRole("button", { name: "保存する" }).click();

    await page.waitForURL(/\/profile\?message=/);

    await expect(page.getByText("アンダースコアは連続で使用できません")).toBeVisible();
    await expect(page.locator('input[name="username"]')).toHaveValue(beforeValue);
  });

  test("公開プロフィールページを表示できる", async ({ page }) => {
    await login(page);

    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();

    const suffix = Date.now().toString().slice(-6);
    const username = `e2e_user_${suffix}`;
    const displayName = `E2E公開表示名-${suffix}`;
    const bio = `E2E公開プロフィール-${suffix}`;

    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="display_name"]').fill(displayName);
    await page.locator('textarea[name="bio"]').fill(bio);

    await page.getByRole("button", { name: "保存する" }).click();
    await page.waitForURL(/\/profile\?message=/);
    await expect(page.getByText("プロフィールを保存しました")).toBeVisible();

    await page.goto(`/users/${username}`);

    await expect(page.getByRole("heading", { name: "公開プロフィール" })).toBeVisible();
    await expect(page.getByText(username)).toBeVisible();
    await expect(page.getByText(displayName)).toBeVisible();
    await expect(page.getByText(bio)).toBeVisible();
  });

  test("/profile から公開プロフィールページへ遷移できる", async ({ page }) => {
    await login(page);

    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();

    const suffix = Date.now().toString().slice(-6);
    const username = `e2e_user_${suffix}`;

    await page.locator('input[name="username"]').fill(username);
    await page.getByRole("button", { name: "保存する" }).click();

    await page.waitForURL(/\/profile\?message=/);
    await expect(page.getByText("プロフィールを保存しました")).toBeVisible();

    const publicProfileLink = page.locator(`a[href="/users/${username}"]`);
    await expect(publicProfileLink).toBeVisible();

    await Promise.all([
      page.waitForURL(new RegExp(`/users/${username}$`)),
      publicProfileLink.click(),
    ]);

    await expect(page.getByRole("heading", { name: "公開プロフィール" })).toBeVisible();
    await expect(page.getByText(username)).toBeVisible();
  });

  test("存在しない username の公開プロフィールは 404 になる", async ({ page }) => {
    const suffix = Date.now().toString().slice(-6);
    const username = `not_found_user_${suffix}`;

    const response = await page.goto(`/users/${username}`);

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(404);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toContain("公開プロフィール");
  });

  test("アバター画像をアップロードするとプロフィール画面と公開プロフィール画面の両方で表示される", async ({
    page,
  }) => {
    await login(page);

    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();

    const suffix = Date.now().toString().slice(-6);
    const username = `e2e_user_${suffix}`;
    const displayName = `E2Eアバター表示名-${suffix}`;

    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="display_name"]').fill(displayName);

    const avatarInput = page.locator('input[type="file"][name="avatar"]');
    await expect(avatarInput).toHaveCount(1);

    await avatarInput.setInputFiles({
      name: "avatar.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn8n6sAAAAASUVORK5CYII=",
        "base64"
      ),
    });

    await page.getByRole("button", { name: "保存する" }).click();
    await page.waitForURL(/\/profile\?message=/);

    await expect(page.getByText("プロフィールを保存しました")).toBeVisible();

    const profileAvatarImage = page.locator('img[alt*="avatar" i], img[alt*="アバター"]');
    await expect(profileAvatarImage.first()).toBeVisible();

    const profileAvatarSrc = await profileAvatarImage.first().getAttribute("src");
    expect(profileAvatarSrc).toBeTruthy();
    expect(profileAvatarSrc).toMatch(/^https?:\/\//);

    await page.goto(`/users/${username}`);
    await expect(page.getByRole("heading", { name: "公開プロフィール" })).toBeVisible();
    await expect(page.getByText(username)).toBeVisible();
    await expect(page.getByText(displayName)).toBeVisible();

    const publicAvatarImage = page.locator('img[alt*="avatar" i], img[alt*="アバター"]');
    await expect(publicAvatarImage.first()).toBeVisible();

    const publicAvatarSrc = await publicAvatarImage.first().getAttribute("src");
    expect(publicAvatarSrc).toBeTruthy();
    expect(publicAvatarSrc).toBe(profileAvatarSrc);
  });

  test("アバター画像を削除するとプロフィール画面と公開プロフィール画面の両方で画像表示が消える", async ({
    page,
  }) => {
    await login(page);

    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: "プロフィール編集" })).toBeVisible();

    const suffix = Date.now().toString().slice(-6);
    const username = `e2e_user_${suffix}`;
    const displayName = `E2Eアバター削除表示名-${suffix}`;

    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="display_name"]').fill(displayName);

    const avatarInput = page.locator('input[type="file"][name="avatar"]');
    await expect(avatarInput).toHaveCount(1);

    await avatarInput.setInputFiles({
      name: "avatar.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn8n6sAAAAASUVORK5CYII=",
        "base64"
      ),
    });

    await page.getByRole("button", { name: "保存する" }).click();
    await page.waitForURL(/\/profile\?message=/);
    await expect(page.getByText("プロフィールを保存しました")).toBeVisible();

    const uploadedAvatarImage = page.locator('img[alt*="avatar" i], img[alt*="アバター"]');
    await expect(uploadedAvatarImage.first()).toBeVisible();

    const removeAvatarCheckbox = page.locator('input[type="checkbox"][name="remove_avatar"]');
    await expect(removeAvatarCheckbox).toHaveCount(1);
    await removeAvatarCheckbox.check();

    await page.getByRole("button", { name: "保存する" }).click();
    await page.waitForURL(/\/profile\?message=/);
    await expect(page.getByText("プロフィールを保存しました")).toBeVisible();

    await expect(page.locator('img[alt*="avatar" i], img[alt*="アバター"]')).toHaveCount(0);
    await expect(
      page
        .locator("section")
        .filter({ hasText: "現在のアバター" })
        .locator("div.rounded-full")
        .first()
    ).toBeVisible();

    await page.goto(`/users/${username}`);
    await expect(page.getByRole("heading", { name: "公開プロフィール" })).toBeVisible();
    await expect(page.getByText(username)).toBeVisible();
    await expect(page.getByText(displayName)).toBeVisible();

    await expect(page.locator('img[alt*="avatar" i], img[alt*="アバター"]')).toHaveCount(0);
    await expect(page.locator("div.rounded-full").first()).toBeVisible();
  });
});