  // 宣告所有測驗題目資料
const questions = [
  {
    question: "p5.js 中，哪一個指令可以建立畫布？",
    options: ["createCanvas()", "makeCanvas()", "setCanvas()", "newCanvas()"],
    answer: 0
  },
  {
    question: "p5.js 中，哪一個指令可以畫出圓形？",
    options: ["circle()", "ellipse()", "round()", "drawCircle()"],
    answer: 1
  },
  {
    question: "p5.js 中，哪一個函式會在程式開始時執行一次？",
    options: ["start()", "begin()", "setup()", "init()"],
    answer: 2
  },
  {
    question: "p5.js 中，哪一個函式會持續重複執行？",
    options: ["loop()", "draw()", "repeat()", "run()"],
    answer: 1
  },
  {
    question: "p5.js 中，哪一個指令可以設定填色？",
    options: ["fill()", "color()", "paint()", "backgroundColor()"],
    answer: 0
  }
];

// 宣告目前題目索引
let currentQuestion = 0;

// 宣告答對題數
let score = 0;

// 宣告是否已經作答
let answered = false;

// 宣告使用者選擇的選項索引
let selectedOption = -1;

// 宣告測驗是否完成
let quizFinished = false;

// 宣告目前頁面的版面資料
let layout = {};

// 宣告重新開始按鈕資料
let restartButton = {};

// 宣告觸控與滑鼠事件的時間鎖
let lastInputTime = 0;

// 宣告事件鎖定時間，避免觸控後又重複觸發滑鼠事件
const INPUT_LOCK_TIME = 350;

// 宣告主要配色
const backgroundColor = "#f4f1ea";

// 宣告選項背景顏色
const optionColor = "#ffffff";

// 宣告答錯時正確選項的背景顏色
const correctColor = "#d88180";

// 宣告答對提示顏色
const successColor = "#4f927b";

// 宣告主要按鈕顏色
const buttonColor = "#527a8c";

// 設定畫布與基本文字樣式
function setup() {
  // 建立符合目前瀏覽器視窗大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 設定文字水平置中
  textAlign(CENTER, CENTER);

  // 設定文字垂直置中
  textBaseline(CENTER);

  // 設定文字平滑效果
  smooth();

  // 設定預設字型
  textFont("Arial");

  // 設定不使用瀏覽器預設觸控行為
  canvas.style("touch-action", "none");

  // 計算目前畫面的響應式版面
  calculateLayout();
}

// 每一幀重新繪製畫面
function draw() {
  // 填滿畫布背景
  background(backgroundColor);

  // 判斷測驗是否完成
  if (quizFinished) {
    // 顯示測驗結果頁
    drawResultScreen();
  } else {
    // 顯示測驗作答頁
    drawQuizScreen();
  }
}

// 計算測驗頁面的響應式版面
function calculateLayout() {
  // 計算畫布短邊長度
  const shortSide = min(width, height);

  // 判斷目前是否為窄螢幕裝置
  const isNarrowScreen = width < 600;

  // 判斷目前是否為橫向畫面
  const isLandscape = width > height;

  // 計算左右邊界距離
  const horizontalPadding = constrain(width * 0.06, 16, 70);

  // 計算內容區域最大寬度
  const maxContentWidth = 900;

  // 計算實際內容寬度
  const contentWidth = min(width - horizontalPadding * 2, maxContentWidth);

  // 計算可用的垂直空間
  const availableHeight = height - 20;

  // 根據螢幕大小計算標題文字大小
  const titleSize = constrain(
    min(width * 0.055, height * 0.07),
    isNarrowScreen ? 22 : 26,
    42
  );

  // 根據螢幕大小計算題數文字大小
  const counterSize = constrain(
    min(width * 0.035, height * 0.045),
    14,
    22
  );

  // 根據螢幕大小計算題目文字大小
  const questionSize = constrain(
    min(width * 0.045, height * 0.06),
    isNarrowScreen ? 18 : 21,
    31
  );

  // 根據螢幕大小計算選項文字大小
  const optionTextSize = constrain(
    min(width * 0.038, height * 0.05),
    isNarrowScreen ? 16 : 18,
    25
  );

  // 根據螢幕大小計算選項按鈕高度
  const optionHeight = constrain(
    min(height * 0.105, width * 0.14),
    48,
    76
  );

  // 計算選項之間的間距
  const optionGap = constrain(
    min(height * 0.025, width * 0.035),
    8,
    18
  );

  // 設定頁面上方起始位置
  const topY = max(18, height * 0.035);

  // 設定標題高度
  const titleHeight = titleSize * 1.25;

  // 設定題數文字高度
  const counterHeight = counterSize * 1.4;

  // 設定題目區域最大高度
  const questionMaxHeight = isLandscape ? height * 0.2 : height * 0.18;

  // 設定題目文字可使用寬度
  const questionWidth = contentWidth * 0.96;

  // 取得目前題目文字
  const questionText = questions[currentQuestion].question;

  // 計算題目換行內容
  const questionLines = wrapTextLines(
    questionText,
    questionWidth,
    questionSize
  );

  // 計算題目實際高度
  const questionHeight = min(
    questionLines.length * questionSize * 1.35,
    questionMaxHeight
  );

  // 計算題目開始位置
  const questionY = topY + titleHeight + counterHeight + 16;

  // 計算選項區域起始位置
  const optionsStartY = questionY + questionHeight + 20;

  // 計算四個選項的總高度
  const optionsTotalHeight =
    optionHeight * 4 + optionGap * 3;

  // 計算提示文字大小
  const messageSize = constrain(
    min(width * 0.034, height * 0.045),
    14,
    21
  );

  // 計算按鈕文字大小
  const buttonTextSize = constrain(
    min(width * 0.04, height * 0.05),
    16,
    23
  );

  // 計算按鈕高度
  const buttonHeight = constrain(
    min(height * 0.09, width * 0.14),
    46,
    62
  );

  // 計算按鈕寬度
  const buttonWidth = constrain(
    min(contentWidth * 0.45, width * 0.55),
    150,
    230
  );

  // 計算提示文字位置
  const messageY = optionsStartY + optionsTotalHeight + 20;

  // 計算下一題按鈕位置
  const nextButtonY = min(
    messageY + messageSize * 1.8,
    height - buttonHeight - 15
  );

  // 將所有響應式版面資料集中儲存
  layout = {
    shortSide,
    isNarrowScreen,
    isLandscape,
    horizontalPadding,
    contentWidth,
    topY,
    titleSize,
    counterSize,
    questionSize,
    optionTextSize,
    optionHeight,
    optionGap,
    questionWidth,
    questionLines,
    questionHeight,
    questionY,
    optionsStartY,
    optionsTotalHeight,
    messageSize,
    buttonTextSize,
    buttonHeight,
    buttonWidth,
    messageY,
    nextButtonY
  };
}

// 計算結果頁的響應式版面
function calculateResultLayout() {
  // 計算畫布短邊長度
  const shortSide = min(width, height);

  // 計算結果標題文字大小
  const resultTitleSize = constrain(
    min(width * 0.075, height * 0.1),
    28,
    58
  );

  // 計算成績文字大小
  const resultScoreSize = constrain(
    min(width * 0.06, height * 0.08),
    23,
    45
  );

  // 計算鼓勵文字大小
  const resultMessageSize = constrain(
    min(width * 0.04, height * 0.05),
    16,
    25
  );

  // 計算按鈕寬度
  const buttonWidth = constrain(min(width * 0.6, 260), 170, 260);

  // 計算按鈕高度
  const buttonHeight = constrain(min(height * 0.1, 65), 48, 65);

  // 儲存結果頁版面資料
  restartButton = {
    x: width / 2 - buttonWidth / 2,
    y: min(height * 0.7, height - buttonHeight - 25),
    w: buttonWidth,
    h: buttonHeight,
    textSize: resultMessageSize
  };

  // 儲存結果文字尺寸
  layout.resultTitleSize = resultTitleSize;
  layout.resultScoreSize = resultScoreSize;
  layout.resultMessageSize = resultMessageSize;
}

// 繪製測驗題目畫面
function drawQuizScreen() {
  // 如果版面資料尚未建立，重新計算版面
  if (!layout.contentWidth) {
    calculateLayout();
  }

  // 取得目前題目資料
  const questionData = questions[currentQuestion];

  // 設定標題顏色
  fill("#333333");

  // 移除圖形外框
  noStroke();

  // 設定標題文字大小
  textSize(layout.titleSize);

  // 顯示測驗標題
  text("p5.js 簡易指令測驗", width / 2, layout.topY);

  // 設定題數文字大小
  textSize(layout.counterSize);

  // 顯示目前題數
  text(
    `第 ${currentQuestion + 1} 題／共 ${questions.length} 題`,
    width / 2,
    layout.topY + layout.titleSize * 1.2
  );

  // 設定題目文字大小
  textSize(layout.questionSize);

  // 設定題目文字顏色
  fill("#222222");

  // 繪製自動換行的題目文字
  drawMultilineText(
    layout.questionLines,
    width / 2,
    layout.questionY,
    layout.questionSize * 1.35
  );

  // 逐一繪製所有選項
  for (let i = 0; i < questionData.options.length; i++) {
    // 計算目前選項的垂直位置
    let optionY =
      layout.optionsStartY +
      i * (layout.optionHeight + layout.optionGap);

    // 判斷是否需要讓正確答案上下跳動
    if (
      answered &&
      selectedOption !== questionData.answer &&
      i === questionData.answer
    ) {
      // 使用正弦函式產生上下跳動效果
      optionY += sin(frameCount * 0.12) * min(10, height * 0.015);
    }

    // 繪製目前選項
    drawOption(
      questionData.options[i],
      width / 2 - layout.contentWidth / 2,
      optionY,
      layout.contentWidth,
      layout.optionHeight,
      i
    );
  }

  // 判斷是否已經作答
  if (answered) {
    // 繪製作答結果訊息
    drawAnswerMessage();

    // 設定下一題按鈕資料
    nextButton = {
      x: width / 2 - layout.buttonWidth / 2,
      y: layout.nextButtonY,
      w: layout.buttonWidth,
      h: layout.buttonHeight
    };

    // 繪製下一題按鈕
    drawButton(
      "下一題",
      nextButton.x,
      nextButton.y,
      nextButton.w,
      nextButton.h,
      buttonColor,
      layout.buttonTextSize
    );
  }
}

// 繪製單一選項
function drawOption(label, x, y, w, h, optionIndex) {
  // 取得正確答案索引
  const correctIndex = questions[currentQuestion].answer;

  // 設定選項預設背景顏色
  let currentOptionColor = optionColor;

  // 判斷是否為答錯時的正確答案
  if (
    answered &&
    selectedOption !== correctIndex &&
    optionIndex === correctIndex
  ) {
    // 將正確答案設定為指定背景顏色
    currentOptionColor = correctColor;
  }

  // 判斷是否為使用者選錯的選項
  if (
    answered &&
    selectedOption === optionIndex &&
    selectedOption !== correctIndex
  ) {
    // 將錯誤選項設定為淡紅色
    currentOptionColor = "#f2c6c2";
  }

  // 設定選項背景色
  fill(currentOptionColor);

  // 設定選項外框色
  stroke("#555555");

  // 設定選項外框粗細
  strokeWeight(2);

  // 繪製圓角選項
  rect(x, y, w, h, 12);

  // 設定選項文字顏色
  fill("#222222");

  // 移除文字外框
  noStroke();

  // 依畫面寬度設定文字大小
  textSize(layout.optionTextSize);

  // 繪製選項文字
  text(label, x + w / 2, y + h / 2);
}

// 繪製作答結果訊息
function drawAnswerMessage() {
  // 取得正確答案索引
  const correctIndex = questions[currentQuestion].answer;

  // 判斷使用者是否答對
  if (selectedOption === correctIndex) {
    // 設定答對提示顏色
    fill(successColor);

    // 設定答對提示文字大小
    textSize(layout.messageSize);

    // 顯示答對文字
    text("答對了！", width / 2, layout.messageY);
  } else {
    // 設定答錯提示顏色
    fill("#b54d4d");

    // 設定答錯提示文字大小
    textSize(layout.messageSize);

    // 建立答錯提示文字
    const message =
      `答錯了！正確答案是：${questions[currentQuestion].options[correctIndex]}`;

    // 將答錯提示文字自動換行
    const messageLines = wrapTextLines(
      message,
      layout.contentWidth,
      layout.messageSize
    );

    // 繪製答錯提示文字
    drawMultilineText(
      messageLines,
      width / 2,
      layout.messageY,
      layout.messageSize * 1.3
    );
  }
}

// 繪製一般按鈕
function drawButton(label, x, y, w, h, colorValue, sizeValue) {
  // 設定按鈕背景色
  fill(colorValue);

  // 移除按鈕外框
  noStroke();

  // 繪製圓角按鈕
  rect(x, y, w, h, 12);

  // 設定按鈕文字顏色
  fill("#ffffff");

  // 設定按鈕文字大小
  textSize(sizeValue);

  // 顯示按鈕文字
  text(label, x + w / 2, y + h / 2);
}

// 繪製測驗結果頁面
function drawResultScreen() {
  // 計算結果頁版面
  calculateResultLayout();

  // 設定結果標題文字顏色
  fill("#333333");

  // 設定結果標題文字大小
  textSize(layout.resultTitleSize);

  // 顯示結果標題
  text("測驗完成！", width / 2, height * 0.25);

  // 設定成績文字顏色
  fill(buttonColor);

  // 設定成績文字大小
  textSize(layout.resultScoreSize);

  // 顯示答對題數
  text(
    `你答對了 ${score}／${questions.length} 題`,
    width / 2,
    height * 0.43
  );

  // 設定鼓勵文字顏色
  fill("#555555");

  // 設定鼓勵文字大小
  textSize(layout.resultMessageSize);

  // 取得鼓勵訊息
  const resultMessage = getResultMessage();

  // 將鼓勵訊息自動換行
  const resultLines = wrapTextLines(
    resultMessage,
    width * 0.85,
    layout.resultMessageSize
  );

  // 繪製鼓勵訊息
  drawMultilineText(
    resultLines,
    width / 2,
    height * 0.55,
    layout.resultMessageSize * 1.35
  );

  // 繪製重新開始按鈕
  drawButton(
    "重新開始",
    restartButton.x,
    restartButton.y,
    restartButton.w,
    restartButton.h,
    buttonColor,
    layout.resultMessageSize
  );
}

// 取得測驗結果鼓勵文字
function getResultMessage() {
  // 判斷是否全部答對
  if (score === questions.length) {
    // 回傳滿分訊息
    return "太棒了！你完全掌握 p5.js 基礎指令！";
  }

  // 判斷答對題數是否至少三題
  if (score >= 3) {
    // 回傳中高分訊息
    return "表現不錯！再練習一下就會更熟悉！";
  }

  // 回傳需要繼續練習的訊息
  return "繼續加油，多練習就能掌握 p5.js！";
}

// 處理滑鼠點擊事件
function mousePressed() {
  // 判斷是否處於事件鎖定時間內
  if (millis() - lastInputTime < INPUT_LOCK_TIME) {
    // 忽略重複觸發的滑鼠事件
    return false;
  }

  // 記錄本次事件時間
  lastInputTime = millis();

  // 處理滑鼠點擊
  handleInput(mouseX, mouseY);

  // 阻止瀏覽器預設行為
  return false;
}

// 處理觸控點擊事件
function touchStarted() {
  // 判斷是否有可用的觸控座標
  if (touches.length > 0) {
    // 記錄本次觸控事件時間
    lastInputTime = millis();

    // 使用第一個觸控點處理點擊
    handleInput(touches[0].x, touches[0].y);
  }

  // 阻止瀏覽器預設觸控行為
  return false;
}

// 統一處理滑鼠與觸控輸入
function handleInput(inputX, inputY) {
  // 判斷測驗是否完成
  if (quizFinished) {
    // 判斷是否點擊重新開始按鈕
    if (isInsideButton(inputX, inputY, restartButton)) {
      // 重新開始測驗
      restartQuiz();
    }

    // 結束結果頁輸入處理
    return;
  }

  // 判斷目前題目是否已經作答
  if (answered) {
    // 判斷是否點擊下一題按鈕
    if (isInsideButton(inputX, inputY, nextButton)) {
      // 前往下一題
      goToNextQuestion();
    }

    // 結束已作答狀態的輸入處理
    return;
  }

  // 取得目前題目資料
  const questionData = questions[currentQuestion];

  // 計算選項區域左側位置
  const optionX = width / 2 - layout.contentWidth / 2;

  // 逐一檢查所有選項
  for (let i = 0; i < questionData.options.length; i++) {
    // 計算選項垂直位置
    const optionY =
      layout.optionsStartY +
      i * (layout.optionHeight + layout.optionGap);

    // 判斷輸入位置是否位於目前選項
    if (
      inputX >= optionX &&
      inputX <= optionX + layout.contentWidth &&
      inputY >= optionY &&
      inputY <= optionY + layout.optionHeight
    ) {
      // 記錄使用者選擇的選項
      selectedOption = i;

      // 設定目前題目為已作答
      answered = true;

      // 判斷是否答對
      if (selectedOption === questionData.answer) {
        // 答對題數加一
        score++;
      }

      // 結束選項檢查
      break;
    }
  }
}

// 判斷輸入位置是否位於按鈕內
function isInsideButton(inputX, inputY, button) {
  // 回傳輸入位置是否在按鈕範圍內
  return (
    inputX >= button.x &&
    inputX <= button.x + button.w &&
    inputY >= button.y &&
    inputY <= button.y + button.h
  );
}

// 前往下一題
function goToNextQuestion() {
  // 判斷是否已經完成最後一題
  if (currentQuestion === questions.length - 1) {
    // 設定測驗完成
    quizFinished = true;

    // 計算結果頁版面
    calculateResultLayout();
  } else {
    // 題目索引加一
    currentQuestion++;

    // 清除作答狀態
    answered = false;

    // 清除選項選擇紀錄
    selectedOption = -1;

    // 重新計算新版面
    calculateLayout();
  }
}

// 重新開始測驗
function restartQuiz() {
  // 將題目重設為第一題
  currentQuestion = 0;

  // 將分數歸零
  score = 0;

  // 清除作答狀態
  answered = false;

  // 清除選項紀錄
  selectedOption = -1;

  // 設定測驗尚未完成
  quizFinished = false;

  // 重新計算響應式版面
  calculateLayout();
}

// 將文字依照指定寬度自動換行
function wrapTextLines(message, maxWidth, fontSizeValue) {
  // 設定目前文字大小
  textSize(fontSizeValue);

  // 將文字切割成單字或中文字元
  const characters = Array.from(message);

  // 建立換行文字陣列
  const lines = [];

  // 建立目前正在組合的文字
  let currentLine = "";

  // 逐一處理每個字元
  for (let i = 0; i < characters.length; i++) {
    // 取得目前字元
    const character = characters[i];

    // 建立加入目前字元後的文字
    const testLine = currentLine + character;

    // 判斷加入後是否超出最大寬度
    if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
      // 將目前文字加入換行陣列
      lines.push(currentLine);

      // 將目前字元設定為下一行的開頭
      currentLine = character;
    } else {
      // 將目前字元加入目前行
      currentLine = testLine;
    }
  }

  // 判斷是否還有尚未加入的文字
  if (currentLine.length > 0) {
    // 將最後一行文字加入陣列
    lines.push(currentLine);
  }

  // 回傳換行後的文字陣列
  return lines;
}

// 繪製多行文字
function drawMultilineText(lines, centerX, centerY, lineHeight) {
  // 計算全部文字的總高度
  const totalHeight = lines.length * lineHeight;

  // 計算第一行文字的垂直位置
  const firstLineY = centerY - totalHeight / 2 + lineHeight / 2;

  // 逐一繪製每一行文字
  for (let i = 0; i < lines.length; i++) {
    // 繪製目前這一行文字
    text(lines[i], centerX, firstLineY + i * lineHeight);
  }
}

// 當瀏覽器視窗大小改變時執行
function windowResized() {
  // 重新設定畫布大小
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算目前畫面版面
  if (quizFinished) {
    // 計算結果頁版面
    calculateResultLayout();
  } else {
    // 計算測驗頁版面
    calculateLayout();
  }
}