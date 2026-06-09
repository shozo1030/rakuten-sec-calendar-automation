function registerRakutenStockEarnings() {
  const query = 'is:unread subject:"国内株式の決算発表予定日をお知らせします（銘柄情報通知サービス）"';
  const threads = GmailApp.search(query);
  const calendar = CalendarApp.getDefaultCalendar();

  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(message => {
      const body = message.getPlainBody();
      const lines = body.split(/\r?\n/);

      // Aパターン用：見出しにある共通の決算日を抽出 (例: ■決算発表日（2026/04/13）)
      const commonDateMatch = body.match(/■決算発表日[（\(](\d{4}\/\d{2}\/\d{2})[）\)]/);
      let commonDate = commonDateMatch ? new Date(commonDateMatch[1]) : null;

      let isTargetSection = false;
      
      for (let line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // 【解析開始】「■決算発表日」または「■決算カレンダー（...）更新銘柄」
        if (trimmedLine.match(/■決算発表日/) || trimmedLine.match(/■決算カレンダー.*更新銘柄/)) {
          isTargetSection = true;
          continue;
        }
        
        if (isTargetSection) {
          // 【終了条件】次の別の見出し（■）が来た場合
          if (trimmedLine.startsWith("■")) {
            isTargetSection = false;
            continue;
          }
          
          // 【終了条件】空行が来た場合
          if (trimmedLine === "") {
            isTargetSection = false;
            continue;
          }

          // 銘柄の抽出（証券コードのカッコがある行）
          if (trimmedLine.match(/\(\d{4}\)/)) {
            let eventDate = null;
            let stockName = "";

            // Bパターンチェック：銘柄名(コード):YYYY/MM/DD の形式か
            const individualDateMatch = trimmedLine.match(/(.+?):\s*(\d{4}\/\d{2}\/\d{2})/);
            
            if (individualDateMatch) {
              // 個別日付がある場合
              stockName = individualDateMatch[1];
              eventDate = new Date(individualDateMatch[2]);
            } else if (commonDate) {
              // 個別日付がなく、見出しに共通日付がある場合
              stockName = trimmedLine;
              eventDate = commonDate;
            }

            // カレンダー登録実行
            if (eventDate && stockName) {
              const eventTitle = `【決算発表】${stockName}`;
              const existingEvents = calendar.getEventsForDay(eventDate, {search: eventTitle});
              if (existingEvents.length === 0) {
                calendar.createAllDayEvent(eventTitle, eventDate);
                console.log(`登録成功: ${eventTitle} (${Utilities.formatDate(eventDate, "JST", "yyyy/MM/dd")})`);
              } else {
                console.log(`登録済みスキップ: ${eventTitle}`);
              }
            }
          }
        }
      }
    });
    thread.markRead();
  });
}
