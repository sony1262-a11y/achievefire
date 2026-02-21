// 投資金庫 Widget
const URL = "https://sony1262-a11y.github.io/achievefire/?widget=1"

let data = null
try {
  const r = new Request(URL)
  r.timeoutInterval = 8
  const html = await r.loadString()
  const start = html.indexOf("<pre")
  const end = html.indexOf("</pre>")
  if (start > -1 && end > -1) {
    const inner = html.substring(html.indexOf(">", start) + 1, end)
    data = JSON.parse(inner)
  }
} catch(e) {
  data = null
}

const w = new ListWidget()
w.backgroundColor = new Color("#5f8571")
w.setPadding(14,16,14,16)
w.url = "https://sony1262-a11y.github.io/achievefire/?add"

if (!data) {
  const t = w.addText("⚠️ 載入失敗")
  t.textColor = Color.white()
  t.font = Font.boldSystemFont(13)
  w.addSpacer(4)
  const s = w.addText("請確認網路或重新整理")
  s.textColor = new Color("#ffffff88")
  s.font = Font.systemFont(11)
} else {
  // 標題列
  const h = w.addStack()
  h.layoutHorizontally()
  const title = h.addText("💰 投資金庫")
  title.textColor = Color.white()
  title.font = Font.boldSystemFont(13)
  h.addSpacer()
  const mo = h.addText(data.month)
  mo.textColor = new Color("#ffffff88")
  mo.font = Font.systemFont(11)

  w.addSpacer(8)

  // 每日預算
  const lbl = w.addText("今日可用")
  lbl.textColor = new Color("#ffffff88")
  lbl.font = Font.systemFont(10)
  w.addSpacer(2)

  const pct = data.livingSpent / data.livingBudget
  const daily = w.addText("$" + data.dailyLeft.toLocaleString())
  daily.textColor = pct > 0.85 ? new Color("#ffb3b3") : new Color("#e8c96a")
  daily.font = Font.boldSystemFont(30)

  w.addSpacer(2)
  const sub = w.addText("生活費剩 $" + data.livingLeft.toLocaleString() + " · 還有" + data.daysLeft + "天")
  sub.textColor = new Color("#ffffff55")
  sub.font = Font.systemFont(10)

  w.addSpacer(8)

  // 收支列
  const bot = w.addStack()
  bot.layoutHorizontally()
  bot.spacing = 14

  const incS = bot.addStack()
  incS.layoutVertically()
  const incL = incS.addText("收入")
  incL.textColor = new Color("#ffffff55")
  incL.font = Font.systemFont(9)
  const incV = incS.addText("+" + data.totalIncome.toLocaleString())
  incV.textColor = new Color("#c5ffd9")
  incV.font = Font.boldSystemFont(13)

  const expS = bot.addStack()
  expS.layoutVertically()
  const expL = expS.addText("支出")
  expL.textColor = new Color("#ffffff55")
  expL.font = Font.systemFont(9)
  const expV = expS.addText("-" + data.totalExpense.toLocaleString())
  expV.textColor = new Color("#ffb3b3")
  expV.font = Font.boldSystemFont(13)

  bot.addSpacer()
  const hint = bot.addText("記一筆 →")
  hint.textColor = new Color("#ffffff44")
  hint.font = Font.systemFont(10)
}

if (config.runsInWidget) {
  Script.setWidget(w)
} else {
  await w.presentSmall()
}
Script.complete()
