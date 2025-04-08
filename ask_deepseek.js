let inputBox;
let submitButton;
let responseArea;
let loadingText;

function setup() {
  // 创建画布
  createCanvas(800, 600);
  background(240);

  // 创建加载提示
  loadingText = createDiv('');
  loadingText.position(50, 100);
  loadingText.style('color', '#666');
  loadingText.style('font-size', '14px');

  // 创建输入框
  inputBox = createInput('请输入您的问题...');
  inputBox.position(50, 50);
  inputBox.size(700, 40);
  inputBox.style('font-size', '16px');
  inputBox.style('padding', '8px');
  
  // 使用正确的事件处理方法
  inputBox.input(function() {
    if (this.value() === '请输入您的问题...') {
      this.value('');
    }
  });

  // 创建提交按钮
  submitButton = createButton('发送');
  submitButton.position(750, 50);
  submitButton.size(80, 40);
  submitButton.style('font-size', '16px');
  submitButton.mousePressed(sendQuestion);

  // 创建响应显示区域
  responseArea = createDiv('');
  responseArea.position(50, 120);
  responseArea.size(700, 450);
  responseArea.style('background-color', 'white');
  responseArea.style('padding', '20px');
  responseArea.style('border-radius', '5px');
  responseArea.style('overflow-y', 'auto');
  responseArea.style('font-size', '16px');
  responseArea.style('line-height', '1.5');
}

function draw() {
  // 绘制标题
  fill(0);
  noStroke();
  textSize(24);
  text('DeepSeek 问答系统', 50, 30);
}

async function sendQuestion() {
  const question = inputBox.value();
  if (!question || question === '请输入您的问题...') return;

  // 显示加载状态
  if (loadingText) {
    loadingText.html('正在获取回答...');
  }
  if (responseArea) {
    responseArea.html('');
  }

  try {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: question
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
    
    // 在console中显示完整返回数据
    console.log('DeepSeek API Response:', JSON.stringify(data, null, 2));
    
    // 显示回答
    if (responseArea) {
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        // 在console中显示回答内容
        console.log('DeepSeek Answer:', content);
        
        // 创建格式化的显示内容
        const formattedContent = `
          <div style="margin-bottom: 20px;">
            <strong>问题：</strong> ${question}
          </div>
          <div>
            <strong>回答：</strong> ${content}
          </div>
          <div style="margin-top: 20px; font-size: 14px; color: #666;">
            <strong>Token 使用情况：</strong><br>
            - 提示词 Token：${data.usage.prompt_tokens}<br>
            - 完成 Token：${data.usage.completion_tokens}<br>
            - 总 Token：${data.usage.total_tokens}
          </div>
        `;
        
        // 在页面上显示格式化的回答
        responseArea.html(formattedContent);
      } else {
        const errorMsg = '抱歉，无法解析API返回的数据';
        console.error('Error: Invalid API response format');
        responseArea.html(errorMsg);
      }
    }
  } catch (error) {
    if (responseArea) {
      responseArea.html('抱歉，获取回答时出现错误：' + error.message);
    }
  } finally {
    if (loadingText) {
      loadingText.html('');
    }
  }
}

// 添加回车键发送功能
function keyPressed() {
  if (keyCode === ENTER) {
    sendQuestion();
  }
}