import { RideForm } from "./RideForm";

export default function NewRidePage() {
  return (
    <main>
      <h1>ライドを投稿</h1>
      <p>まずは下書きとして保存できる最小構成です</p>
      <p>公開設定は後続の実装で追加します</p>

      <RideForm />
    </main>
  );
}