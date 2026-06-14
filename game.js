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
const introMusic = document.getElementById("introMusic");
const backgroundMusic = document.getElementById("backgroundMusic");

const backgroundImage = new Image();
backgroundImage.src = "assets/bedroom-comic.png";
const spriteImage = new Image();
spriteImage.src = "assets/items.png";
const extraSpriteImage = new Image();
extraSpriteImage.src = "assets/extra-items.png";

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
  { name: "拖鞋", x: 236, y: 560, hit: 38, crop: { x: 206, y: 535, w: 82, h: 50 } },
  { name: "绿植", x: 72, y: 510, hit: 58, crop: { x: 18, y: 438, w: 108, h: 128 } },
  { name: "绿色书", x: 394, y: 622, hit: 42, crop: { x: 354, y: 590, w: 92, h: 58 } },
  { name: "台灯", x: 64, y: 350, hit: 54, crop: { x: 24, y: 292, w: 88, h: 120 } },
  { name: "背包", x: 1000, y: 590, hit: 58, crop: { x: 948, y: 525, w: 105, h: 120 } },
  { name: "藤篮", x: 666, y: 450, hit: 56, crop: { x: 615, y: 392, w: 105, h: 125 } },
  { name: "画框", x: 936, y: 330, hit: 44, crop: { x: 890, y: 292, w: 92, h: 80 } },
  { name: "衣架", x: 1135, y: 216, hit: 60, crop: { x: 1082, y: 145, w: 115, h: 150 } },
  { name: "棕色圆帽", x: 414, y: 222, hit: 44, crop: { x: 378, y: 178, w: 82, h: 104 } }
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
let currentSurrenderPhrase = "";
let hintPulseStarted = 0;
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

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (backgroundImage.complete) {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }
  sceneObjects.forEach((item) => {
    if (item.kind === "sprite" && !item.found && spriteImage.complete) {
      drawSprite(item, item.x, item.y, item.size, item.angle);
      item.occluders?.forEach(drawBackgroundPatch);
    }
    if (item.kind === "extra" && !item.found && extraSpriteImage.complete) {
      drawExtraSprite(item);
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
}

function generateObjects() {
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

function positionMobileScene() {
  if (window.matchMedia("(max-width: 600px) and (orientation: portrait)").matches) {
    sceneWrap.scrollLeft = Math.max(0, (sceneWrap.scrollWidth - sceneWrap.clientWidth) / 2);
    sceneWrap.scrollTop = Math.max(0, (sceneWrap.scrollHeight - sceneWrap.clientHeight) / 2);
  } else {
    sceneWrap.scrollLeft = 0;
    sceneWrap.scrollTop = 0;
  }
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
  document.getElementById("resultText").textContent = won
    ? `你还剩 ${Math.floor(timeLeft / 60)} 分 ${timeLeft % 60} 秒，眼力相当不错。`
    : `本局找到 ${targets.filter((item) => item.found).length} 件物品，再试一次一定更快。`;
  resultModal.classList.add("visible");
  tone(won ? 660 : 180, 0.5);
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
  if (selectedObject?.target) {
    selectedObject.found = true;
    targets.find((item) => item.name === selectedObject.name).found = true;
    if (hintMarker?.name === selectedObject.name) hintMarker = null;
    renderTargets();
    tone(520, 0.22);
    resetSelection();
    if (targets.every((item) => item.found)) finishGame(true);
  } else {
    applyMistake();
    resetSelection();
  }
});

document.getElementById("cancelButton").addEventListener("click", (event) => {
  event.stopPropagation();
  resetSelection();
});
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("againButton").addEventListener("click", startGame);
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
spriteImage.onload = drawScene;
extraSpriteImage.onload = drawScene;

document.addEventListener("pointerdown", startIntroMusic, { once: true });
document.addEventListener("keydown", startIntroMusic, { once: true });
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
