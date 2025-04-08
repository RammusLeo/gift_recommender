let gifts = [];
let currentGifts = [];
let loading = false;
let cardY = []; // 用于卡片动画的Y位置
let cardAnimating = false;
let bgColor;

function setup() {
  // 修改画布大小为窗口大小
  createCanvas(windowWidth, windowHeight);
  // 修改文本对齐方式
  textAlign('center', 'middle');
  
  // 更现代的配色方案
  bgColor = color(250, 245, 255); // 非常浅的紫色背景
  background(bgColor);
  
  // 从 localStorage 读取礼物数据
  const savedGifts = localStorage.getItem('giftOptions');
  console.log('从localStorage读取的原始数据:', savedGifts);
  
  if (savedGifts) {
    try {
      gifts = JSON.parse(savedGifts);
      console.log('解析后的礼物数据:', gifts);
      
      // 确保礼物数据是数组且不为空
      if (Array.isArray(gifts) && gifts.length > 0) {
        currentGifts = [...gifts];
        console.log('成功加载礼物数据:', currentGifts);
        
        // 初始化卡片位置
        for (let i = 0; i < gifts.length; i++) {
          cardY[i] = 120 + i * 160;
        }
      } else {
        console.error('礼物数据格式不正确');
        return;
      }
    } catch (error) {
      console.error('解析礼物数据失败:', error);
      return;
    }
  } else {
    console.error('没有找到礼物数据');
    return;
  }
}

function draw() {
  background(bgColor);
  
  // 绘制顶部装饰
  drawHeader();
  
  // 显示礼物卡片
  displayGifts();
  
  // 显示底部按钮
  drawButtons();
  
  // 加载指示器
  if (loading) {
    drawLoadingIndicator();
  }
}

function drawHeader() {
  // 顶部渐变装饰
  let gradient = drawingContext.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, color(255, 182, 193));
  gradient.addColorStop(1, color(255, 105, 180));
  drawingContext.fillStyle = gradient;
  noStroke();
  rect(0, 0, width, 80, 0, 0, 20, 20);
  
  // 标题文本
  fill(255);
  textSize(18);
  textStyle('bold');
  text("🎁 为您精心挑选的礼物", width/2, 40);
  textStyle('normal');
}

function displayGifts() {
  if (!currentGifts || currentGifts.length === 0) {
    console.error('没有可显示的礼物');
    return;
  }
  
  console.log('正在显示礼物:', currentGifts);
  
  // 显示3个礼物推荐
  for (let i = 0; i < min(3, currentGifts.length); i++) {
    // 动画效果处理
    let targetY = 120 + i * 160;
    if (cardY[i] === undefined) cardY[i] = targetY;
    if (abs(cardY[i] - targetY) > 0.1) {
      cardY[i] = lerp(cardY[i], targetY, 0.1);
      cardAnimating = true;
    } else {
      cardY[i] = targetY;
      cardAnimating = false;
    }
    
    // 礼物卡片
    push();
    translate(0, cardY[i] - targetY); // 动画偏移
    
    // 卡片阴影
    drawingContext.shadowColor = color(0, 0, 0, 50);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowOffsetY = 3;
    
    // 卡片背景
    fill(255);
    rect(30, targetY - 60, width - 60, 140, 15);
    
    // 重置阴影
    drawingContext.shadowColor = 'transparent';
    
    // 礼物图标
    fill(255, 182, 193);
    textSize(24);
    text("🎁", 60, targetY - 20);
    
    // 礼物文本
    fill(70);
    textSize(16);
    textAlign('left', 'top');
    // 确保礼物文本存在且是字符串
    const giftText = currentGifts[i].text || '未知礼物';
    console.log(`显示第${i+1}个礼物:`, giftText);
    // 修改文本显示区域
    text(giftText, 90, targetY - 30, width - 120, 80);
    textAlign('center', 'middle');
    
    // 喜欢按钮
    drawLikeButton(width - 100, targetY + 30);
    
    pop();
  }
}

function drawLikeButton(x, y) {
  // 按钮背景
  fill(255, 105, 180);
  rect(x - 60, y - 15, 120, 30, 20);
  
  // 按钮文本
  fill(255);
  textSize(14);
  textAlign('center', 'middle');
  text("❤️ 太喜欢了", x, y);
  
  // 悬停效果
  if (mouseX > x - 60 && mouseX < x + 60 && mouseY > y - 15 && mouseY < y + 15) {
    cursor(HAND);
  }
}

function drawButtons() {
  // 换一批按钮
  let btnY = height - 100;
  
  // 悬停效果
  let btnHover = mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
                 mouseY > btnY - 20 && mouseY < btnY + 20;
  
  fill(btnHover ? color(230, 230, 250) : color(240, 240, 250));
  stroke(200);
  strokeWeight(1);
  rect(width/2 - 100, btnY - 20, 200, 40, 20);
  
  fill(100);
  noStroke();
  textSize(14);
  textAlign('center', 'middle');
  text("🔄 换一批推荐", width/2, btnY);
  
  if (btnHover) {
    cursor(HAND);
  }
}

function drawLoadingIndicator() {
  fill(0, 150);
  textSize(14);
  textAlign('center', 'middle');
  text("正在为您寻找更棒的礼物...", width/2, height - 60);
  
  // 简单的加载动画
  let dots = ceil((millis() % 1000) / 250);
  text(".".repeat(dots), width/2, height - 40);
}

function mousePressed() {
  // 换一批按钮
  if (mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
      mouseY > height - 120 && mouseY < height - 80) {
    refreshGifts();
  }
  
  // 喜欢按钮
  for (let i = 0; i < min(3, currentGifts.length); i++) {
    let y = 120 + i * 160 + 30;
    if (mouseX > width - 160 && mouseX < width - 40 &&
        mouseY > y - 15 && mouseY < y + 15) {
      selectGift(currentGifts[i]);
    }
  }
}

function selectGift(gift) {
  console.log("已选择礼物:", gift);
  
  // 使用确认对话框替代alert
  const isConfirmed = confirm(`您选择了: ${gift.text}\n价格: ¥${gift.price}\n\n确认选择这个礼物吗？`);
  
  if (isConfirmed) {
    // 保存选中的礼物价格到 localStorage
    localStorage.setItem('selectedGiftPrice', gift.price);
    // 方法1：使用p5.js的createA方法（更可靠）
    const link = createA('pay.html', '', '_self');
    link.style('display', 'none'); // 隐藏链接
    link.elt.click(); // 模拟点击
    link.remove(); // 移除链接
  }
}

async function refreshGifts() {
  if (loading || cardAnimating) return;
  
  loading = true;
  
  try {
    // 从 localStorage 获取原始预算和描述
    const budget = localStorage.getItem('giftBudget');
    const description = localStorage.getItem('giftDescription');
    
    if (!budget || !description) {
      throw new Error('找不到原始需求信息');
    }

    // 调用 DeepSeek API 获取新的推荐
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "你是一个专业的礼物推荐助手。请根据用户的预算和需求，推荐3个与之前不同的礼物选项，每个礼物名称不多于20个字符。每个选项需要包含礼物名称、预估精确单价和不多于50字的简要说明。请确保价格信息格式为：'礼物名称 - ¥价格 - 说明'"
          },
          {
            role: "user",
            content: `预算：${budget}元\n需求：${description}\n\n请推荐3个与之前不同的礼物选项。`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // 解析 API 返回的内容，提取礼物选项和价格
    const content = data.choices[0].message.content;
    const newGiftOptions = content.split('\n')
      .filter(line => line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.'))
      .map(line => {
        const text = line.replace(/^\d+\.\s*/, '').trim();
        // 解析价格信息
        const priceMatch = text.match(/¥(\d+(\.\d{1,2})?)/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : null;
        return {
          text: text,
          price: price
        };
      });
    
    // 更新礼物列表
    gifts = newGiftOptions;
    currentGifts = [...gifts];
    
    // 保存新的礼物数据到 localStorage
    localStorage.setItem('giftOptions', JSON.stringify(newGiftOptions));
    
  } catch (error) {
    console.error('获取新推荐失败:', error);
    // 如果获取新推荐失败，保持原有推荐
    currentGifts = [...gifts];
  } finally {
    loading = false;
  }
}

// 后续可以添加GPT集成函数
async function fetchGiftsFromGPT(prompt) {
  // 这里可以集成GPT API调用
}

// 添加窗口大小改变的处理
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新计算卡片位置
  for (let i = 0; i < currentGifts.length; i++) {
    cardY[i] = 120 + i * 160;
  }
}