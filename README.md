# rakuten-sec-calendar-automation

# Gmail連携 楽天証券決算予定日 Googleカレンダー自動登録ツール

## 概要
楽天証券から届く「決算予定日のお知らせ」の通知メール（Gmail）から情報を自動で抽出し、自身のGoogleカレンダーへスケジュールとして自動登録を行うGoogle Apps Script (GAS) プログラムです。
日々のメールチェックと手動でのカレンダー登録の手間を排除し、情報収集とタスク管理の自動化を実現するために開発しました。

## 主な機能・処理フロー
1. **Gmailからの情報抽出**
   - 楽天証券からの特定の通知メールを検索・取得。
   - メールの本文から、正規表現等を用いて「企業名」「決算予定日」などの必要情報を正確に抽出。
2. **Googleカレンダーへの自動登録**
   - 抽出した情報をもとに、Google Calendar APIを介して指定のカレンダーにイベントを一括生成。
   - 重複登録を防止するロジックの実装。

## 使用技術・環境
- Google Apps Script (JavaScript)
- GmailApp / CalendarApp (Google Workspace 内製API)
- 正規表現によるテキストモデリング
