let budgetInput;
let giftDescriptionInput;
let submitButton;
let budgetError = "";
let descriptionError = "";
let bgColor;
let gifts = []; // 定义全局礼物列表
let currentPage = "input"; // 添加页面状态变量
let resultPage;
let inputPage;
let loadingElement;
let resultsContainer;
let backButton;
let isLoading = false; // 添加加载状态变量
let loadingDots = 0; // 用于加载动画的点数
let loadingText = "正在为您寻找合适的礼物"; // 加载文本
let loadingStartTime = 0; // 添加加载开始时间

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(245, 245, 250);
  background(bgColor);
  
  // 标题
  textSize(32);
  fill(70, 80, 100);
  textAlign(CENTER, CENTER);
  text("智能赠礼助手", width/2, 80);
  
  // 预算输入部分
  textSize(18);
  fill(70, 80, 100);
  textAlign(LEFT, CENTER);
  text("您的赠礼预算 (¥):", width/2 - 200, 150);
  
  budgetInput = createInput('');
  budgetInput.position(width/2 - 200, 170);
  budgetInput.size(400, 40);
  budgetInput.style('font-size', '16px');
  budgetInput.style('padding', '8px');
  budgetInput.style('border-radius', '8px');
  budgetInput.style('border', '1px solid #ccc');
  
  textSize(14);
  fill(120);
  text("请输入0.01到10000之间的金额", width/2 - 200, 220);
  
  // 礼物需求描述部分
  textSize(18);
  fill(70, 80, 100);
  text("请描述您的礼物需求:", width/2 - 200, 280);
  
  giftDescriptionInput = createElement('textarea');
  giftDescriptionInput.position(width/2 - 200, 300);
  giftDescriptionInput.size(400, 150);
  giftDescriptionInput.style('font-size', '16px');
  giftDescriptionInput.style('padding', '8px');
  giftDescriptionInput.style('border-radius', '8px');
  giftDescriptionInput.style('border', '1px solid #ccc');
  giftDescriptionInput.style('resize', 'none');
  
  // 创建提示词容器
  let exampleContainer = createDiv('');
  exampleContainer.position(width/2 - 200, 470);
  exampleContainer.size(400, 100);
  exampleContainer.style('background', '#f8f9fa');
  exampleContainer.style('border-radius', '8px');
  exampleContainer.style('padding', '15px');
  
  // 添加提示词标题
  let exampleTitle = createDiv('示例：');
  exampleTitle.parent(exampleContainer);
  exampleTitle.style('color', '#6C63FF');
  exampleTitle.style('font-weight', 'bold');
  exampleTitle.style('margin-bottom', '10px');
  
  // 添加示例文本
  // let example1 = createDiv('- 我的npy是istp，朋友中的高手型人物，最近迷上了极限运动。上个月她拉着我去攀岩，虽然我有点怕高，但她总能冷静地指导我一步一步克服心理障碍，最后我们成功登顶，成了我人生中最难忘的一次经历。');
  // example1.parent(exampleContainer);
  // example1.style('color', '#666');
  // example1.style('margin', '8px 0');
  // example1.style('line-height', '1.5');
  
  let example2 = createDiv('- 我的爸爸是istp，工作上是个高效能手，喜欢动手做各种维修和改装。上个月他带我一起修理家里的老式摩托车，虽然我完全不懂，但他耐心地教我每一个步骤，让我第一次感受到了维修的乐趣');
  example2.parent(exampleContainer);
  example2.style('color', '#666');
  example2.style('margin', '8px 0');
  example2.style('line-height', '1.5');
  
  // 提交按钮
  submitButton = createButton('生成礼物推荐');
  submitButton.position(width/2 - 100, 650);
  submitButton.size(200, 50);
  submitButton.style('background-color', '#6C63FF');
  submitButton.style('color', 'white');
  submitButton.style('border', 'none');
  submitButton.style('border-radius', '8px');
  submitButton.style('font-size', '18px');
  submitButton.style('cursor', 'pointer');
  submitButton.mousePressed(submitForm);
  
  // 错误信息
  textSize(14);
  fill(220, 50, 50);
  
  // 初始化 DOM 元素引用
  resultPage = document.getElementById('result-page');
  inputPage = document.getElementById('input-page');
  loadingElement = document.getElementById('loading-overlay');
  resultsContainer = document.getElementById('results-container');
  backButton = document.getElementById('back-button');

  // 确保元素存在
  if (backButton) {
    backButton.onclick = function() {
      switchToInputPage();
    };
  }
}

function switchToResultPage() {
  currentPage = "result";
  if (inputPage) inputPage.style.display = 'none';
  if (resultPage) resultPage.classList.remove('hidden');
  window.location.href = "change_gift.html";
}

function switchToInputPage() {
  currentPage = "input";
  if (resultPage) resultPage.classList.add('hidden');
  if (inputPage) style.display = 'block';
}

function draw() {
  background(bgColor);
  
  if (isLoading) {
    drawLoadingScreen();
    return;
  }
  
  // 重新绘制静态内容
  textSize(32);
  fill(70, 80, 100);
  textAlign(CENTER, CENTER);
  text("智能赠礼助手", width/2, 80);
  
  // 预算部分
  textSize(18);
  fill(70, 80, 100);
  textAlign(LEFT, CENTER);
  text("您的赠礼预算 (¥):", width/2 - 200, 150);
  
  textSize(14);
  fill(120);
  text("请输入0.01到10000之间的金额", width/2 - 200, 220);
  
  // 显示预算错误
  if (budgetError) {
    fill(220, 50, 50);
    text(budgetError, width/2 - 200, 250);
  }
  
  // 描述部分
  textSize(18);
  fill(70, 80, 100);
  text("请描述您的礼物需求:", width/2 - 200, 280);
  
  // 显示描述错误
  if (descriptionError) {
    fill(220, 50, 50);
    text(descriptionError, width/2 - 200, 460);
  }
}

function drawLoadingScreen() {
  // 绘制半透明背景
  fill(245, 245, 250, 200);
  noStroke();
  rect(0, 0, width, height);
  
  // 绘制加载动画
  push();
  translate(width/2, height/2);
  
  // 绘制加载圆圈
  noFill();
  stroke(108, 99, 255);
  strokeWeight(4);
  let radius = 40;
  let angle = (millis() - loadingStartTime) * 0.01; // 使用实际时间计算角度
  arc(0, 0, radius * 2, radius * 2, angle, angle + PI/2);
  
  // 绘制加载文本
  fill(70, 80, 100);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(loadingText + ".".repeat(loadingDots), 0, 60);
  
  // 更新加载动画
  if (frameCount % 30 === 0) {
    loadingDots = (loadingDots + 1) % 4;
  }
  
  pop();
}

function showLoading() {
  if (loadingElement) {
    loadingElement.style.display = 'flex';
  }
}

function hideLoading() {
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
}

function submitForm() {
  // 验证预算
  const budget = parseFloat(budgetInput.value());
  if (isNaN(budget)) {
    budgetError = "请输入有效的数字";
    descriptionError = "";
  } else if (budget < 0.01 || budget > 10000) {
    budgetError = "预算必须在0.01到10000之间";
    descriptionError = "";
  } else {
    budgetError = "";
  }
  
  // 验证描述
  if (giftDescriptionInput.value().trim() === "") {
    descriptionError = "请描述您的礼物需求";
    if (!budgetError) budgetError = "";
  } else {
    descriptionError = "";
  }
  
  // 如果验证通过
  if (!budgetError && !descriptionError) {
    showLoading();
    callGiftAPI(budget, giftDescriptionInput.value());
  }
}

async function callGiftAPI(budget, description) {
  try {
    // 调用 DeepSeek API
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "你是一个专业的礼物推荐助手。请根据用户的预算和需求，推荐3个合适的礼物选项，每个礼物名称不多于20个字符。每个选项需要包含礼物名称、预估精确单价和不多于50字的简要说明。请确保价格信息格式为：'礼物名称 - ¥价格 - 说明'"
          },
          {
            role: "user",
            content: `预算：${budget}元\n需求：${description}\n\n请推荐3个合适的礼物选项。`
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
    const giftOptions = content.split('\n')
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
    
    // 确保礼物选项是有效的
    if (giftOptions.length === 0) {
      throw new Error('没有获取到有效的礼物选项');
    }
    
    // 保存礼物数据到 localStorage
    localStorage.setItem('giftOptions', JSON.stringify(giftOptions));
    localStorage.setItem('giftBudget', budget);
    localStorage.setItem('giftDescription', description);
    
    console.log('保存的礼物数据:', giftOptions);
    
    // 显示结果
    displayResults(data);
    
    // 等待数据保存完成后再跳转
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.href = "change_gift.html";
    
  } catch (error) {
    console.error('API调用失败:', error);
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="result-item" style="color: #d32f2f;">
          <h3>请求失败</h3>
          <p>${error.message || '无法获取礼物推荐，请稍后再试'}</p>
        </div>
      `;
    }
  } finally {
    hideLoading();
  }
}

function displayResults(apiResponse) {
if (!resultsContainer) return;

const messageContent = apiResponse.choices[0].message.content;
const formattedContent = messageContent.split('\n')
.map(paragraph => paragraph.trim() ? `<p>${paragraph}</p>` : '')
.join('');

resultsContainer.innerHTML = `
<div class="result-item">
  <h3>为您推荐的礼物选项</h3>
  <div>${formattedContent}</div>
</div>
`;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新定位元素
  if (budgetInput) budgetInput.position(width/2 - 200, 170);
  if (giftDescriptionInput) giftDescriptionInput.position(width/2 - 200, 300);
  if (submitButton) submitButton.position(width/2 - 100, 650);
}