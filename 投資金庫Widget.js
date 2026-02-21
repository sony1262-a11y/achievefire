// 投資金庫 Scriptable Widget
// ==========================================
// 安裝步驟：
// 1. 從 App Store 安裝「Scriptable」
// 2. 打開 Scriptable → 點右上角 + 新增腳本
// 3. 貼上這段程式碼
// 4. 把第 10 行的網址換成你的 GitHub Pages 網址
// 5. 長按主畫面 → 新增 Widget → 選 Scriptable
// 6. 長按 Widget → Edit → 選這個腳本
// ==========================================

const APP_URL = "https://你的帳號.github.io/fire-tracker/?widget=1"
// ↑↑↑ 換成你的網址，後面記得加 ?widget=1

// ── Fetch data ──
let data = null
try {
  const req = new Request(APP_URL)
  req.timeoutInterval = 10
  const html = await req.loadString()
  // Extract JSON from <pre> tag
  const match = html.match(/<pre[^>]*>([\s\S]+?)<\/pre>/)
  if (match) data = JSON.parse(match[1])
} catch(e) {
  data = null
}

// ── Colors ──
const C = {
  bg:     new Color("#5f8571"),
  bgDark: new Color("#4a6b5a"),
  gold:   new Color("#e8c96a"),
  white:  new Color("#ffffff"),
  dim:    new Color("rgba(255,255,255,0.6)"),
  green:  new Color("#c5ffd9"),
  red:    new Color("#ffb3b3"),
  warn:   new Color("#ffd080"),
}

// ── Widget ──
const w = new ListWidget()
w.backgroundColor = C.bg
w.setPadding(14, 16, 14, 16)
w.url = APP_URL.replace("?widget=1", "")

if (!data) {
  // Error state
  const t = w.addText("⚠️ 無法載入資料")
  t.textColor = C.white
  t.font = Font.boldSystemFont(13)
  w.addSpacer(4)
  const s = w.addText("請確認網路連線")
  s.textColor = C.dim
  s.font = Font.systemFont(11)
} else {
  // ── Header ──
  const hStack = w.addStack()
  hStack.layoutHorizontally()
  hStack.centerAlignContent()

  const title = hStack.addText("💰 投資金庫")
  title.textColor = C.white
  title.font = Font.boldSystemFont(13)
  hStack.addSpacer()
  const mo = hStack.addText(data.month)
  mo.textColor = C.dim
  mo.font = Font.systemFont(11)

  w.addSpacer(8)

  // ── Daily budget (big number) ──
  const dailyStack = w.addStack()
  dailyStack.layoutVertically()
  
  const dailyLabel = dailyStack.addText("今日可用預算")
  dailyLabel.textColor = C.dim
  dailyLabel.font = Font.systemFont(10)
  dailyStack.addSpacer(2)

  const daily = dailyStack.addText("$" + data.dailyLeft.toLocaleString())
  daily.textColor = data.livingLeft > 0 ? C.gold : C.red
  daily.font = Font.boldSystemFont(28)

  const sub = dailyStack.addText("生活費剩 $" + data.livingLeft.toLocaleString() + "，還有 " + data.daysLeft + " 天")
  sub.textColor = C.dim
  sub.font = Font.systemFont(10)

  w.addSpacer(8)

  // ── Progress bar ──
  const pct = Math.min(data.livingSpent / data.livingBudget, 1)
  const barStack = w.addStack()
  barStack.layoutHorizontally()
  barStack.spacing = 0

  // Draw progress bar using stacks
  const totalW = 150
  const usedW = Math.round(totalW * pct)
  const remW = totalW - usedW

  const barBg = barStack.addStack()
  barBg.layoutHorizontally()
  barBg.cornerRadius = 3
  barBg.size = new Size(totalW, 5)
  barBg.backgroundColor = new Color("rgba(255,255,255,0.2)")

  if (usedW > 0) {
    const usedBar = barBg.addStack()
    usedBar.size = new Size(usedW, 5)
    usedBar.backgroundColor = pct > 0.85 ? C.red : pct > 0.6 ? C.warn : C.gold
    usedBar.cornerRadius = 3
  }

  w.addSpacer(6)

  // ── Bottom row ──
  const botStack = w.addStack()
  botStack.layoutHorizontally()
  botStack.spacing = 12

  // Income
  const incStack = botStack.addStack()
  incStack.layoutVertically()
  const incL = incStack.addText("收入")
  incL.textColor = C.dim
  incL.font = Font.systemFont(9)
  const incV = incStack.addText("+" + data.totalIncome.toLocaleString())
  incV.textColor = C.green
  incV.font = Font.boldSystemFont(12)

  // Expense
  const expStack = botStack.addStack()
  expStack.layoutVertically()
  const expL = expStack.addText("支出")
  expL.textColor = C.dim
  expL.font = Font.systemFont(9)
  const expV = expStack.addText("-" + data.totalExpense.toLocaleString())
  expV.textColor = C.red
  expV.font = Font.boldSystemFont(12)

  botStack.addSpacer()

  // Quick add button hint
  const addHint = botStack.addText("＋ 記一筆 →")
  addHint.textColor = C.dim
  addHint.font = Font.systemFont(10)
  addHint.url = APP_URL.replace("?widget=1", "?add")
}

// ── Present ──
if (config.runsInWidget) {
  Script.setWidget(w)
} else {
  w.presentSmall()
}
Script.complete()
