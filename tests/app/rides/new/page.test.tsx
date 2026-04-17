import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import NewRidePage from "@/app/rides/new/page";

describe("app/rides/new/page.tsx", () => {
  it("新規ライド投稿フォームの見出しを表示する", async () => {
    const Page = await NewRidePage();
    render(Page);

    expect(
      screen.getByRole("heading", { name: "ライドを投稿" }),
    ).toBeInTheDocument();
  });

  it("最小構成の入力項目を表示する", async () => {
    const Page = await NewRidePage();
    render(Page);

    expect(screen.getByLabelText("タイトル")).toBeInTheDocument();
    expect(screen.getByLabelText("説明")).toBeInTheDocument();
    expect(screen.getByLabelText("動画URL")).toBeInTheDocument();
    expect(screen.getByLabelText("サムネイルURL")).toBeInTheDocument();
    expect(screen.getByLabelText("走行日")).toBeInTheDocument();
    expect(screen.getByLabelText("距離(km)")).toBeInTheDocument();
    expect(screen.getByLabelText("獲得標高(m)")).toBeInTheDocument();
  });

  it("draft 保存前提の説明を表示する", async () => {
    const Page = await NewRidePage();
    render(Page);

    expect(
      screen.getByText("まずは下書きとして保存できる最小構成です"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("公開設定は後続の実装で追加します"),
    ).toBeInTheDocument();
  });

  it("下書き保存ボタンを表示する", async () => {
    const Page = await NewRidePage();
    render(Page);

    expect(
      screen.getByRole("button", { name: "下書き保存" }),
    ).toBeInTheDocument();
  });
});