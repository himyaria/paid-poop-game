const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const targetList = document.getElementById("targetList");
const timerElement = document.getElementById("timer");
const timerBox = document.getElementById("timerBox");
const foundCount = document.getElementById("foundCount");
const totalCount = document.getElementById("totalCount");
const selectionPopover = document.getElementById("selectionPopover");
const penalty = document.getElementById("penalty");
const startModal = document.getElementById("startModal");
const resultModal = document.getElementById("resultModal");
const hintModal = document.getElementById("hintModal");
const surrenderInput = document.getElementById("surrenderInput");
const surrenderPhraseElement = document.getElementById("surrenderPhrase");
const hintError = document.getElementById("hintError");
const resultRanking = document.getElementById("resultRanking");
const globalRank = document.getElementById("globalRank");
const clearTime = document.getElementById("clearTime");
const beatPercent = document.getElementById("beatPercent");
const sceneSubtitle = document.getElementById("sceneSubtitle");
const startTitle = document.getElementById("startTitle");
const startDescription = document.getElementById("startDescription");
const tipText = document.getElementById("tipText");
const againButton = document.getElementById("againButton");
const introMusic = document.getElementById("introMusic");
const backgroundMusic = document.getElementById("backgroundMusic");

const backgroundImage = new Image();
backgroundImage.src = "assets/bedroom-comic.png";
const cleanBackgroundImage = new Image();
cleanBackgroundImage.src = "assets/bedroom-clean-ai.png";
const spriteImage = new Image();
spriteImage.src = "assets/items.png";
const extraSpriteImage = new Image();
extraSpriteImage.src = "assets/extra-items.png";
const beachItemImages = new Map();

const items = [
  { name: "金钥匙", icon: "🔑", col: 0, row: 0 },
  { name: "红苹果", icon: "🍎", col: 1, row: 0 },
  { name: "小熊", icon: "🧸", col: 2, row: 0 },
  { name: "旧相机", icon: "📷", col: 3, row: 0 },
  { name: "剪刀", icon: "✂️", col: 0, row: 1 },
  { name: "蓝帽子", icon: "🧢", col: 1, row: 1 },
  { name: "咖啡杯", icon: "☕", col: 2, row: 1 },
  { name: "放大镜", icon: "🔎", col: 3, row: 1 }
];

const nativeItems = [
  { name: "拖鞋", x: 236, y: 560, hit: 38, crop: { x: 206, y: 535, w: 82, h: 50 }, cleanCrop: { x: 182, y: 510, w: 135, h: 92 } },
  { name: "绿植", x: 72, y: 510, hit: 58, crop: { x: 18, y: 438, w: 108, h: 128 }, cleanCrop: { x: 0, y: 410, w: 145, h: 190 } },
  { name: "绿色书", x: 394, y: 622, hit: 42, crop: { x: 354, y: 590, w: 92, h: 58 }, cleanCrop: { x: 330, y: 565, w: 140, h: 105 } },
  { name: "台灯", x: 64, y: 350, hit: 54, crop: { x: 24, y: 292, w: 88, h: 120 }, cleanCrop: { x: 0, y: 270, w: 135, h: 170 } },
  { name: "背包", x: 1000, y: 590, hit: 58, crop: { x: 948, y: 525, w: 105, h: 120 }, cleanCrop: { x: 920, y: 500, w: 165, h: 180 } },
  { name: "藤篮", x: 666, y: 450, hit: 56, crop: { x: 615, y: 392, w: 105, h: 125 }, cleanCrop: { x: 590, y: 365, w: 155, h: 190 } },
  { name: "画框", x: 936, y: 330, hit: 44, crop: { x: 890, y: 292, w: 92, h: 80 }, cleanCrop: { x: 870, y: 270, w: 135, h: 125 } },
  { name: "衣架", x: 1135, y: 216, hit: 60, crop: { x: 1082, y: 145, w: 115, h: 150 }, cleanCrop: { x: 1055, y: 115, w: 175, h: 205 } },
  { name: "棕色圆帽", x: 414, y: 222, hit: 44, crop: { x: 378, y: 178, w: 82, h: 104 }, cleanCrop: { x: 355, y: 150, w: 125, h: 155 } }
];

const beachItems = [
  { name: "旧望远镜", group: "scene", col: 0, row: 0, x: 1160, y: 241, width: 72, height: 47, angle: -0.06, hit: 42 },
  { name: "编织团扇", group: "scene", col: 1, row: 0, x: 1095, y: 547, width: 76, height: 65, angle: 0.36, hit: 45 },
  { name: "相机皮套", group: "scene", col: 2, row: 0, x: 735, y: 605, width: 68, height: 53, angle: -0.12, hit: 42 },
  { name: "蓝色搪瓷杯", group: "scene", col: 3, row: 0, x: 791, y: 421, width: 43, height: 45, angle: 0, hit: 34 },
  { name: "旧绳圈", group: "scene", col: 4, row: 0, x: 1115, y: 688, width: 112, height: 62, angle: 0.05, hit: 59 },
  { name: "草编空顶帽", group: "scene", col: 0, row: 1, x: 825, y: 494, width: 106, height: 61, angle: -0.16, hit: 53 },
  { name: "琥珀防晒霜", group: "scene", col: 1, row: 1, x: 1210, y: 245, width: 34, height: 60, angle: 0, hit: 34 },
  { name: "木质帆船", group: "scene", col: 2, row: 1, x: 1040, y: 245, width: 68, height: 61, angle: 0, hit: 39 },
  { name: "旧沙滩球", group: "scene", col: 3, row: 1, x: 1170, y: 570, width: 78, height: 78, angle: 0.08, hit: 48 },
  { name: "带扣野餐篮", group: "scene", col: 4, row: 1, x: 555, y: 615, width: 106, height: 101, angle: -0.04, hit: 58 },
  { name: "黄铜钥匙", group: "hidden", col: 0, row: 0, x: 197, y: 657, width: 50, height: 62, angle: 1.0, hit: 37 },
  { name: "蓝灰围巾", group: "hidden", col: 1, row: 0, x: 930, y: 665, width: 330, height: 108, angle: -0.04, hit: 120, stretch: true },
  { name: "黄铜指南针", group: "hidden", col: 2, row: 0, x: 754, y: 421, width: 36, height: 36, angle: 0.05, hit: 30 },
  { name: "贝壳香皂", group: "hidden", col: 3, row: 0, x: 935, y: 665, width: 47, height: 36, angle: 0.2, hit: 32 },
  { name: "棕色钢笔", group: "hidden", col: 4, row: 0, x: 905, y: 338, width: 72, height: 18, angle: -0.03, hit: 31 },
  { name: "行李牌", group: "hidden", col: 0, row: 1, x: 735, y: 122, width: 50, height: 59, angle: 0.03, hit: 37 },
  { name: "花纹布袋", group: "hidden", col: 1, row: 1, x: 684, y: 355, width: 66, height: 44, angle: 0.12, hit: 39, occluders: [{ type: "rect", x: 653, y: 353, w: 59, h: 37 }] },
  { name: "干木槿花", group: "hidden", col: 2, row: 1, x: 600, y: 300, width: 42, height: 37, angle: -0.2, hit: 30 },
  { name: "星纹石头", group: "hidden", col: 3, row: 1, x: 402, y: 648, width: 18, height: 14, angle: 0.13, hit: 20 },
  { name: "木质书签", group: "hidden", col: 4, row: 1, x: 438, y: 390, width: 66, height: 18, angle: 0.42, hit: 31 }
];

const levels = [
  {
    name: "漫画卧室",
    title: "卧室里藏着什么？",
    description: "在五分钟内找到清单中的全部物品。它们会伪装成家具细节或只露出一角，每次点错会扣除 5 秒。",
    tip: "寻找藏入场景的物品，也别忽略房间原有陈设",
    image: "assets/bedroom-comic.png",
    cleanImage: "assets/bedroom-clean-ai.png",
    type: "bedroom"
  },
  {
    name: "真实海滩度假",
    title: "海滩假期藏着什么？",
    description: "在阳光海滩中找到 20 件度假物品。留心沙地、躺椅和海滩酒吧，每次点错会扣除 5 秒。",
    tip: "寻找藏入场景的物品，也别忽略房间原有陈设",
    image: "assets/beach-vacation-complex.png",
    cleanImage: "",
    type: "beach"
  }
];

const surrenderPhrases = ["我是大笨蛋", "我真的找不到", "请给我一点提示", "眼睛投降了"];

const extraItems = [
  { name: "花纹围巾", col: 0, x: 610, y: 635, width: 285, height: 150, angle: 0.05, hit: 105 },
  { name: "绿色钢笔", col: 1, x: 330, y: 172, width: 54, height: 22, angle: -1.5, hit: 28 },
  { name: "粉色小花", col: 2, x: 575, y: 188, width: 30, height: 30, angle: 0.12, hit: 25 }
];

const placements = {
  金钥匙: [
    { x: 690, y: 648, size: 52, angle: 0.35, surface: "rug" }
  ],
  红苹果: [
    { x: 146, y: 344, size: 46, angle: -0.03, surface: "nightstand-top" }
  ],
  小熊: [
    { x: 310, y: 646, size: 58, angle: -0.12, surface: "floor-cushion", occluders: [{ type: "ellipse", x: 310, y: 668, rx: 58, ry: 24 }] }
  ],
  旧相机: [
    { x: 150, y: 164, size: 46, angle: -0.04, surface: "left-shelf" }
  ],
  剪刀: [
    { x: 1002, y: 326, size: 48, angle: -0.32, surface: "pencil-cup", occluders: [{ type: "rect", x: 974, y: 346, w: 62, h: 48 }] }
  ],
  蓝帽子: [
    { x: 470, y: 402, size: 58, angle: -0.08, surface: "bed-top" }
  ],
  咖啡杯: [
    { x: 1050, y: 344, size: 44, angle: -0.03, surface: "desk-top" }
  ],
  放大镜: [
    { x: 894, y: 344, size: 48, angle: -0.24, surface: "desk-top" }
  ]
};

let targets = [];
let sceneObjects = [];
let selectedPoint = null;
let selectedObject = null;
let timeLeft = 300;
let timerId = null;
let gameActive = false;
let round = 0;
let soundOn = true;
let audioContext = null;
let hintMarker = null;
let wrongMarker = null;
let currentSurrenderPhrase = "";
let hintPulseStarted = 0;
let currentLevelIndex = new URLSearchParams(window.location.search).get("level") === "2" ? 1 : 0;
introMusic.volume = 0.48;
backgroundMusic.volume = 0.78;

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function drawSprite(item, x, y, size, angle = 0) {
  const cellWidth = spriteImage.naturalWidth / 4;
  const cellHeight = spriteImage.naturalHeight / 2;
  const drawHeight = size * 1.45;
  const drawWidth = drawHeight * (cellWidth / cellHeight);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.drawImage(
    spriteImage,
    item.col * cellWidth,
    item.row * cellHeight,
    cellWidth,
    cellHeight,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight
  );
  ctx.restore();
}

function drawExtraSprite(item) {
  const cellWidth = extraSpriteImage.naturalWidth / 3;
  const cellHeight = extraSpriteImage.naturalHeight;
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.angle);
  ctx.drawImage(
    extraSpriteImage,
    item.col * cellWidth,
    0,
    cellWidth,
    cellHeight,
    -item.width / 2,
    -item.height / 2,
    item.width,
    item.height
  );
  ctx.restore();
}

function drawBeachSprite(item) {
  const image = getBeachItemImage(item);
  if (!image.complete || !image.naturalWidth) return;
  const maxSize = Math.max(item.width, item.height);
  const scale = maxSize / Math.max(image.naturalWidth, image.naturalHeight);
  const drawWidth = item.stretch ? item.width : image.naturalWidth * scale;
  const drawHeight = item.stretch ? item.height : image.naturalHeight * scale;
  ctx.save();
  ctx.filter = item.group === "hidden"
    ? "saturate(0.68) contrast(0.88) brightness(0.9)"
    : "saturate(0.76) contrast(0.92) brightness(0.94)";
  ctx.translate(item.x, item.y);
  ctx.rotate(item.angle);
  ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();
}

function getBeachItemImage(item) {
  const index = item.row * 5 + item.col;
  const key = `${item.group}-${index}`;
  if (!beachItemImages.has(key)) {
    const image = new Image();
    image.src = `assets/beach-items-v2/${key}.png`;
    image.onload = () => {
      drawScene();
      if (levels[currentLevelIndex]?.type === "beach") renderTargets();
    };
    beachItemImages.set(key, image);
  }
  return beachItemImages.get(key);
}

function drawBackgroundPatch(shape) {
  if (!backgroundImage.complete) return;
  ctx.save();
  ctx.beginPath();
  if (shape.type === "ellipse") {
    ctx.ellipse(shape.x, shape.y, shape.rx, shape.ry, 0, 0, Math.PI * 2);
  } else {
    ctx.rect(shape.x, shape.y, shape.w, shape.h);
  }
  ctx.clip();
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawCleanNativePatch(item) {
  if (!levels[currentLevelIndex].cleanImage || !cleanBackgroundImage.complete || !item.crop) return;
  const cleanCrop = item.cleanCrop || item.crop;
  const padding = Math.max(8, Math.round(Math.min(cleanCrop.w, cleanCrop.h) * 0.12));
  const x = Math.max(0, cleanCrop.x - padding);
  const y = Math.max(0, cleanCrop.y - padding);
  const width = Math.min(canvas.width - x, cleanCrop.w + padding * 2);
  const height = Math.min(canvas.height - y, cleanCrop.h + padding * 2);
  const patchCanvas = document.createElement("canvas");
  patchCanvas.width = Math.ceil(width);
  patchCanvas.height = Math.ceil(height);
  const patchContext = patchCanvas.getContext("2d");
  const scaleX = cleanBackgroundImage.naturalWidth / canvas.width;
  const scaleY = cleanBackgroundImage.naturalHeight / canvas.height;
  patchContext.drawImage(
    cleanBackgroundImage,
    x * scaleX,
    y * scaleY,
    width * scaleX,
    height * scaleY,
    0,
    0,
    width,
    height
  );
  patchContext.globalCompositeOperation = "destination-in";
  const feather = patchContext.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.28,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.68
  );
  feather.addColorStop(0, "rgba(0,0,0,1)");
  feather.addColorStop(0.72, "rgba(0,0,0,0.96)");
  feather.addColorStop(1, "rgba(0,0,0,0)");
  patchContext.fillStyle = feather;
  patchContext.fillRect(0, 0, width, height);
  ctx.drawImage(patchCanvas, x, y);
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (backgroundImage.complete) {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }
  sceneObjects.forEach((item) => {
    if (item.kind === "native" && item.found) drawCleanNativePatch(item);
  });
  sceneObjects.forEach((item) => {
    if (item.kind === "sprite" && !item.found && spriteImage.complete) {
      drawSprite(item, item.x, item.y, item.size, item.angle);
      item.occluders?.forEach(drawBackgroundPatch);
    }
    if (item.kind === "extra" && !item.found && extraSpriteImage.complete) {
      drawExtraSprite(item);
    }
    if (item.kind === "beach" && !item.found) {
      drawBeachSprite(item);
      item.occluders?.forEach(drawBackgroundPatch);
    }
  });
  if (selectedPoint) {
    ctx.save();
    ctx.strokeStyle = "#f0c35f";
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 7]);
    ctx.beginPath();
    ctx.arc(selectedPoint.x, selectedPoint.y, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  if (hintMarker && !hintMarker.found) {
    const elapsed = performance.now() - hintPulseStarted;
    const pulse = (Math.sin(elapsed / 180) + 1) / 2;
    const radius = Math.max(34, hintMarker.hit || hintMarker.size * 0.82);
    ctx.save();
    ctx.shadowColor = "#fff35a";
    ctx.shadowBlur = 18 + pulse * 22;
    ctx.strokeStyle = "#fff200";
    ctx.lineWidth = 6 + pulse * 3;
    ctx.beginPath();
    ctx.arc(hintMarker.x, hintMarker.y, radius + pulse * 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 242, 0, ${0.12 + pulse * 0.1})`;
    ctx.fill();
    ctx.restore();
    requestAnimationFrame(drawScene);
  }
  if (wrongMarker) {
    const elapsed = performance.now() - wrongMarker.started;
    const progress = Math.min(elapsed / 650, 1);
    const size = 18 + Math.sin(progress * Math.PI) * 10;
    ctx.save();
    ctx.globalAlpha = 1 - progress;
    ctx.strokeStyle = "#ff4938";
    ctx.shadowColor = "#ff4938";
    ctx.shadowBlur = 12;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(wrongMarker.x - size, wrongMarker.y - size);
    ctx.lineTo(wrongMarker.x + size, wrongMarker.y + size);
    ctx.moveTo(wrongMarker.x + size, wrongMarker.y - size);
    ctx.lineTo(wrongMarker.x - size, wrongMarker.y + size);
    ctx.stroke();
    ctx.restore();
    if (progress < 1) {
      requestAnimationFrame(drawScene);
    } else {
      wrongMarker = null;
    }
  }
}

function generateObjects() {
  if (levels[currentLevelIndex].type === "beach") {
    sceneObjects = beachItems.map((item) => ({
      ...item,
      kind: "beach",
      found: false,
      target: true
    }));
    targets = sceneObjects.map((item) => ({ ...item }));
    return;
  }
  const spriteObjects = shuffle(items).map((item) => ({
    ...item,
    ...pickPlacement(item.name),
    kind: "sprite",
    found: false,
    target: true
  }));
  const backgroundObjects = nativeItems.map((item) => ({
    ...item,
    icon: "",
    kind: "native",
    found: false,
    target: true
  }));
  const extraObjects = extraItems.map((item) => ({
    ...item,
    kind: "extra",
    found: false,
    target: true
  }));
  sceneObjects = [...spriteObjects, ...backgroundObjects, ...extraObjects];
  targets = sceneObjects.map((item) => ({ ...item }));
}

function pickPlacement(name) {
  return shuffle(placements[name])[0];
}

function renderTargets() {
  targetList.innerHTML = "";
  targets.forEach((item) => {
    const element = document.createElement("div");
    element.className = `target-item${item.found ? " found" : ""}`;
    const sprite = item.kind === "native"
      ? createNativeIcon(item)
      : item.kind === "beach"
        ? createBeachIcon(item)
      : item.kind === "extra"
        ? createExtraIcon(item)
        : createSpriteIcon(item);
    const label = document.createElement("span");
    label.className = "object-name";
    label.textContent = item.name;
    element.append(sprite, label);
    targetList.appendChild(element);
  });
  foundCount.textContent = targets.filter((item) => item.found).length;
  totalCount.textContent = targets.length;
}

function createSpriteIcon(item) {
  const sprite = document.createElement("span");
  sprite.className = "sprite-icon";
  sprite.style.backgroundPosition = `${item.col * 33.333}% ${item.row * 100}%`;
  return sprite;
}

function createNativeIcon(item) {
  const icon = document.createElement("canvas");
  icon.className = "native-icon";
  icon.width = 70;
  icon.height = 52;
  const iconContext = icon.getContext("2d");
  if (backgroundImage.complete) {
    const scaleX = backgroundImage.naturalWidth / canvas.width;
    const scaleY = backgroundImage.naturalHeight / canvas.height;
    iconContext.drawImage(
      backgroundImage,
      item.crop.x * scaleX,
      item.crop.y * scaleY,
      item.crop.w * scaleX,
      item.crop.h * scaleY,
      0,
      0,
      icon.width,
      icon.height
    );
  }
  return icon;
}

function createExtraIcon(item) {
  const icon = document.createElement("span");
  icon.className = "extra-icon";
  icon.style.backgroundPosition = `${item.col * 50}% 0`;
  return icon;
}

function createBeachIcon(item) {
  const icon = document.createElement("canvas");
  icon.className = "native-icon";
  icon.width = 70;
  icon.height = 52;
  const iconContext = icon.getContext("2d");
  const image = getBeachItemImage(item);
  if (image.complete && image.naturalWidth) {
    const scale = Math.min(icon.width / image.naturalWidth, icon.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    iconContext.drawImage(image, (icon.width - width) / 2, (icon.height - height) / 2, width, height);
  }
  return icon;
}

function updateTimer() {
  timerElement.textContent = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`;
  timerBox.classList.toggle("warning", timeLeft <= 60 && timeLeft > 15);
  timerBox.classList.toggle("danger", timeLeft <= 15);
}

function tone(frequency, duration) {
  if (!soundOn) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioContext ||= new AudioContextClass();
  audioContext.resume();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.1, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function playVictoryFanfare() {
  if (!soundOn) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioContext ||= new AudioContextClass();
  audioContext.resume();
  const notes = [
    [523.25, 0, 0.14],
    [659.25, 0.14, 0.14],
    [783.99, 0.28, 0.18],
    [659.25, 0.47, 0.11],
    [880, 0.58, 0.22],
    [1046.5, 0.81, 0.42]
  ];
  notes.forEach(([frequency, delay, duration]) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    const start = audioContext.currentTime + delay;
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(0.14, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.start(start);
    oscillator.stop(start + duration);
  });
}

function normalCdf(value) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * x);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * erf);
}

function calculateGlobalRanking(elapsedSeconds) {
  const playerPool = 7980;
  const averageSeconds = 60.854;
  const standardDeviation = 25;
  const fasterPercentile = normalCdf((elapsedSeconds - averageSeconds) / standardDeviation);
  const beaten = (1 - fasterPercentile) * 100;
  const rank = Math.max(100, Math.min(9999, Math.round(fasterPercentile * playerPool)));
  return {
    rank,
    beaten: Math.min(99.99, Math.max(0.01, beaten))
  };
}

function formatDuration(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function startBackgroundMusic() {
  if (!soundOn) return;
  introMusic.pause();
  backgroundMusic.currentTime = 0;
  backgroundMusic.play().catch(() => {
    soundOn = false;
    document.getElementById("soundButton").style.opacity = ".4";
    document.getElementById("soundButton").title = "点击开启声音";
  });
}

function stopBackgroundMusic() {
  backgroundMusic.pause();
}

function startIntroMusic() {
  if (!soundOn || gameActive || !startModal.classList.contains("visible")) return;
  introMusic.play().catch(() => {});
}

function applyMistake() {
  timeLeft = Math.max(0, timeLeft - 5);
  updateTimer();
  penalty.classList.remove("show");
  void penalty.offsetWidth;
  penalty.classList.add("show");
  tone(145, 0.16);
  if (timeLeft === 0) finishGame(false);
}

function resetSelection() {
  selectedPoint = null;
  selectedObject = null;
  selectionPopover.classList.remove("visible");
  drawScene();
}

function findSelectedObject() {
  if (!selectedObject?.target) return false;
  selectedObject.found = true;
  targets.find((item) => item.name === selectedObject.name).found = true;
  if (hintMarker?.name === selectedObject.name) hintMarker = null;
  renderTargets();
  tone(520, 0.22);
  resetSelection();
  if (targets.every((item) => item.found)) finishGame(true);
  return true;
}

function positionMobileScene() {
  if (window.matchMedia("(max-width: 600px) and (orientation: portrait)").matches) {
    sceneWrap.scrollLeft = Math.max(0, (sceneWrap.scrollWidth - sceneWrap.clientWidth) / 2);
    sceneWrap.scrollTop = Math.max(0, (sceneWrap.scrollHeight - sceneWrap.clientHeight) / 2);
  } else {
    sceneWrap.scrollLeft = 0;
    sceneWrap.scrollTop = 0;
  }
}

function loadCurrentLevel() {
  const level = levels[currentLevelIndex];
  sceneSubtitle.textContent = `今日场景 · ${level.name}`;
  startTitle.textContent = level.title;
  startDescription.textContent = level.description;
  tipText.textContent = level.tip;
  backgroundImage.src = level.image;
  cleanBackgroundImage.src = level.cleanImage || level.image;
}

function startGame() {
  clearInterval(timerId);
  stopBackgroundMusic();
  round += 1;
  document.getElementById("roundNumber").textContent = String(round).padStart(2, "0");
  timeLeft = 300;
  gameActive = true;
  selectedPoint = null;
  selectedObject = null;
  hintMarker = null;
  wrongMarker = null;
  generateObjects();
  renderTargets();
  updateTimer();
  drawScene();
  startModal.classList.remove("visible");
  resultModal.classList.remove("visible");
  hintModal.classList.remove("visible");
  selectionPopover.classList.remove("visible");
  hintModal.classList.remove("visible");
  startBackgroundMusic();
  requestAnimationFrame(positionMobileScene);
  timerId = setInterval(() => {
    if (!gameActive) return;
    timeLeft -= 1;
    updateTimer();
    if (timeLeft <= 0) finishGame(false);
  }, 1000);
}

function finishGame(won) {
  gameActive = false;
  clearInterval(timerId);
  stopBackgroundMusic();
  selectionPopover.classList.remove("visible");
  document.getElementById("resultSymbol").textContent = won ? "✓" : "⌛";
  document.getElementById("resultEyebrow").textContent = won ? "寻物完成" : "时间到";
  document.getElementById("resultTitle").textContent = won ? "全部找到了！" : "差一点就找齐了";
  if (won) {
    const elapsedSeconds = 300 - timeLeft;
    const ranking = calculateGlobalRanking(elapsedSeconds);
    document.getElementById("resultText").textContent = "眼力和速度都相当不错，看看你排在全球什么位置。";
    globalRank.textContent = ranking.rank.toLocaleString("zh-CN");
    clearTime.textContent = formatDuration(elapsedSeconds);
    beatPercent.textContent = `${ranking.beaten.toFixed(2)}%`;
    resultRanking.hidden = false;
    againButton.textContent = currentLevelIndex < levels.length - 1 ? "进入海滩关" : "重新挑战";
  } else {
    document.getElementById("resultText").textContent = `本局找到 ${targets.filter((item) => item.found).length} 件物品，再试一次一定更快。`;
    resultRanking.hidden = true;
    againButton.textContent = "再试一次";
  }
  resultModal.classList.add("visible");
  if (won) {
    playVictoryFanfare();
  } else {
    tone(180, 0.5);
  }
}

canvas.addEventListener("click", (event) => {
  if (!gameActive) return;
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (canvas.width / rect.width);
  const y = (event.clientY - rect.top) * (canvas.height / rect.height);
  selectedPoint = { x, y };
  selectedObject = sceneObjects
    .filter((item) => !item.found)
    .map((item) => ({ item, distance: Math.hypot(item.x - x, item.y - y) }))
    .filter(({ item, distance }) => distance < (item.hit || item.size * 0.7))
    .sort((a, b) => a.distance - b.distance)[0]?.item || null;
  if (window.matchMedia("(max-width: 600px)").matches) {
    if (!findSelectedObject()) {
      wrongMarker = { x, y, started: performance.now() };
      applyMistake();
      resetSelection();
    }
    return;
  }
  const displayX = event.clientX - rect.left;
  const displayY = event.clientY - rect.top;
  selectionPopover.style.left = `${Math.min(Math.max(displayX, 112), rect.width - 112)}px`;
  selectionPopover.style.top = `${Math.max(displayY, 62)}px`;
  selectionPopover.classList.add("visible");
  drawScene();
});

document.getElementById("confirmButton").addEventListener("click", (event) => {
  event.stopPropagation();
  if (!gameActive) return;
  if (!findSelectedObject()) {
    applyMistake();
    resetSelection();
  }
});

document.getElementById("cancelButton").addEventListener("click", (event) => {
  event.stopPropagation();
  resetSelection();
});
document.getElementById("startButton").addEventListener("click", startGame);
againButton.addEventListener("click", () => {
  if (targets.length && targets.every((item) => item.found)) {
    currentLevelIndex = (currentLevelIndex + 1) % levels.length;
    loadCurrentLevel();
  }
  startGame();
});
document.getElementById("restartButton").addEventListener("click", startGame);
document.getElementById("hintButton").addEventListener("click", () => {
  if (!gameActive || targets.every((item) => item.found)) return;
  currentSurrenderPhrase = shuffle(surrenderPhrases)[0];
  surrenderPhraseElement.textContent = currentSurrenderPhrase;
  surrenderInput.value = "";
  hintError.textContent = "";
  hintModal.classList.add("visible");
  setTimeout(() => surrenderInput.focus(), 0);
});
document.getElementById("submitHintButton").addEventListener("click", submitHint);
document.getElementById("cancelHintButton").addEventListener("click", () => {
  hintModal.classList.remove("visible");
});
surrenderInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") submitHint();
});
document.getElementById("soundButton").addEventListener("click", () => {
  soundOn = !soundOn;
  document.getElementById("soundButton").style.opacity = soundOn ? "1" : ".4";
  document.getElementById("soundButton").title = soundOn ? "关闭声音" : "开启声音";
  if (soundOn && gameActive) {
    startBackgroundMusic();
  } else if (soundOn) {
    startIntroMusic();
  } else {
    stopBackgroundMusic();
    introMusic.pause();
  }
});

function submitHint() {
  if (surrenderInput.value.trim() !== currentSurrenderPhrase) {
    hintError.textContent = "输入不一致，再认真认输一次。";
    return;
  }
  const remaining = sceneObjects.filter((item) => !item.found);
  hintMarker = shuffle(remaining)[0] || null;
  hintModal.classList.remove("visible");
  selectionPopover.classList.remove("visible");
  selectedPoint = null;
  selectedObject = null;
  if (hintMarker) {
    hintPulseStarted = performance.now();
    tone(420, 0.2);
    drawScene();
  }
}

backgroundImage.onload = drawScene;
cleanBackgroundImage.onload = drawScene;
spriteImage.onload = drawScene;
extraSpriteImage.onload = drawScene;

document.addEventListener("pointerdown", startIntroMusic, { once: true });
document.addEventListener("keydown", startIntroMusic, { once: true });
loadCurrentLevel();
startIntroMusic();

let targetDragActive = false;
let targetDragStartX = 0;
let targetDragScrollLeft = 0;

targetList.addEventListener("pointerdown", (event) => {
  targetDragActive = true;
  targetDragStartX = event.clientX;
  targetDragScrollLeft = targetList.scrollLeft;
  targetList.setPointerCapture(event.pointerId);
});

targetList.addEventListener("pointermove", (event) => {
  if (!targetDragActive) return;
  targetList.scrollLeft = targetDragScrollLeft - (event.clientX - targetDragStartX);
});

targetList.addEventListener("pointerup", () => {
  targetDragActive = false;
});

targetList.addEventListener("pointercancel", () => {
  targetDragActive = false;
});

window.addEventListener("orientationchange", () => {
  setTimeout(positionMobileScene, 120);
});
