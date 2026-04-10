export function normalizeUsername(input: string): string {
  return input.trim().toLowerCase();
}

export function validateUsername(input: string): { valid: boolean; message?: string } {
  const username = normalizeUsername(input);

  if (username.length < 3 || username.length > 20) {
    return { valid: false, message: "ユーザー名は3〜20文字で入力してください" };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return {
      valid: false,
      message: "ユーザー名は半角英小文字・数字・アンダースコアのみ使用できます",
    };
  }

  if (!/^[a-z0-9](?:[a-z0-9_]*[a-z0-9])?$/.test(username)) {
    return {
      valid: false,
      message: "ユーザー名の先頭と末尾は英数字にしてください",
    };
  }

  if (username.includes("__")) {
    return {
      valid: false,
      message: "アンダースコアは連続で使用できません",
    };
  }

  return { valid: true };
}