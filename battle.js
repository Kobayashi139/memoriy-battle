// 読み取り
const field = document.getElementsByClassName("field")[0];
const movingBalls = document.getElementsByClassName("moving");
const enemy = document.getElementsByClassName("enemy")[0];
const player = document.getElementsByClassName("player")[0];
const limit = document.getElementsByClassName("limit")[0];

// ポップアップ情報の取得
const result_board = document.getElementsByClassName("result_board")[0];
const resultmsg = document.getElementsByClassName("resultmsg")[0];
const battleStartbtn = document.getElementsByClassName("nextbun")[0];
const backStagebtn = document.getElementsByClassName("nextbun")[1];
const limitmsg = document.getElementsByClassName("count")[0];
const countdownmsg = document.getElementsByClassName("count_board")[0];

// カード情報のポップアップ
const card_board = document.getElementsByClassName("card_board")[0];
const cardmsg = document.getElementsByClassName("cardmsg")[0];
const ballmsg = document.getElementsByClassName("ballmsg")[0];
const speedmsg = document.getElementsByClassName("speedmsg")[0];
const gamestartbtn = document.getElementsByClassName("nextbun")[2];

//各パラメータの初期化
const fps = 10;
const timeSpeed = 1000;
let score = 0;
let intervalId; //setIntervalのIDを保持
let setLimitTime; //制限時間用
let gameRunning = false; //ゲームが続いているか
let speed = 2; //速さ
let xSpeed = [];
let ySpeed = [];
let xDirection = []; //水平方向
let yDirection = []; //垂直方向

let xPos; //randomBallの座標取得用
let yPos;
const board_limit = 25; //ボードに表示する用残り時間
const estabLimit = 26000; //残り時間計算用

// // cadeDataをもとにrandomBallの数を決める
let speedLank = "MAX";
let cadeData = sessionStorage.getItem("result");
if (cadeData === null) {
  cadeData = 0;
}
// cadeData = 5;
const ballLength = movingBalls.length - cadeData;
if (cadeData > 5) {
  speed = 1.5;
  speedLank = "EASY";
} else if (cadeData > 3) {
  speed = 1.8;
  speedLank = "NORMAL";
} else if (cadeData > 0) {
  speed = 2;
  speedLank = "MAX";
}

// ポップアップ表示
window.onload = function () {
  limitmsg.innerHTML = board_limit + "秒間敵と弾を避け続けろ！";
  battleStartbtn.disabled = false;
  backStagebtn.disabled = false;
  result_board.style.display = "block";
};

// カード情報表示
function start() {
  // ポップアップ非表示
  battleStartbtn.disabled = true;
  backStagebtn.disabled = true;
  result_board.style.display = "none";

  // カード情報表示
  cardmsg.innerHTML = "手に入れたカード: " + cadeData + "枚";
  ballmsg.innerHTML = "弾の数: 13 → " + ballLength;
  speedmsg.innerHTML = "スピード: MAX → " + speedLank;
  gamestartbtn.disabled = false;
  card_board.style.display = "block";
}

function sleep(msec) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, msec); //1000ミリ秒ごとにresolveを呼び出す
  });
}

async function countdown() {
  //非同期関数
  countdownmsg.style.display = "block";
  countdownmsg.innerHTML = "4";
  for (i = 0; i < 4; i++) {
    await sleep(1000); //1秒待機
    console.log("スタートまで" + i);
    countdownmsg.innerHTML = 3 - i;
  }
  countdownmsg.style.display = "none";
  gameRunning = true;
  setLimitTime = new Date().getTime() + estabLimit; //タイマーの残り時間
  startTimer(); // タイマー開始
}

function gamestart() {
  gamestartbtn.disabled = true;
  card_board.style.display = "none";
  let str = "残り時間: " + 0 + "分 " + board_limit + "秒";
  limit.innerText = str;

  countdown(); //カウントダウン

  document.onmousemove = function (event) {
    playerMove(event);
  };

  for (let i = 0; i < ballLength; i++) {
    //ballにランダムな開始位置を与える
    movingBalls[i].style.left = rdm(550) + "px";
    movingBalls[i].style.top = rdm(400) + "px";
    if (rdm(2) == 0) {
      //水平方向
      xDirection[i] = 1;
    } else {
      xDirection[i] = -1;
    }
    if (rdm(2) == 0) {
      //垂直方向
      yDirection[i] = 1;
    } else {
      yDirection[i] = -1;
    }
  }
  // console.log(gameRunning);
  // ゲームループ開始
  intervalId = setInterval(function () {
    if (gameRunning) {
      //gameRuning===trueの時だけ起動する
      randomMove();
      overjudge();
    }
  }, fps); //10ミリ秒ごと
}

function playerMove(event) {
  let fieldRect = field.getBoundingClientRect();
  let playerRect = player.getBoundingClientRect();
  let scrollX = window.scrollX; // 横スクロールの位置
  let scrollY = window.scrollY; // 縦スクロールの位置

  // //1コマの移動処理
  if (
    // pageX,Y：ページ全体でのマウスの位置座標を取得
    event.pageX > scrollX + fieldRect.left &&
    event.pageX < scrollX + fieldRect.right - playerRect.width //左上に座標点があるので
  ) {
    //フィールドの範囲で動ける
    player.style.left = event.pageX - scrollX - fieldRect.left + "px";
  }
  if (
    event.pageY > scrollY + fieldRect.top &&
    event.pageY < scrollY + fieldRect.bottom - playerRect.height //上側に座標点があるので
  ) {
    player.style.top = event.pageY - scrollY - fieldRect.top + "px";
  }
  overjudge();
  return;
}

// getBoundingClientrect()で実装する
function overjudge() {
  if (gameRunning) {
    let playerRect = player.getBoundingClientRect(); // プレイヤーの位置とサイズを取得
    let enemyRect = enemy.getBoundingClientRect(); // プレイヤーの位置とサイズを取得
    for (let i = 0; i < movingBalls.length; i++) {
      let ballRect = movingBalls[i].getBoundingClientRect(); // 各ボールの位置とサイズを取得
      if (
        playerRect.left < ballRect.right &&
        playerRect.right > ballRect.left &&
        playerRect.top < ballRect.bottom &&
        playerRect.bottom > ballRect.top
      ) {
        score = score + 1;
        gameOver();
        break;
      }
    }
    // 敵に当たったときの判定
    if (
      playerRect.left < enemyRect.right &&
      playerRect.right > enemyRect.left &&
      playerRect.top < enemyRect.bottom &&
      playerRect.bottom > enemyRect.top
    ) {
      score = score + 1;
      gameOver();
    }
  }
}

function randomMove() {
  for (let i = 0; i < ballLength; i++) {
    xSpeed.push(speed); //水平方向の速度
    ySpeed.push(speed); //垂直方向の速度
    xPos = parseInt(movingBalls[i].style.left) + xSpeed[i] * xDirection[i];
    yPos = parseInt(movingBalls[i].style.top) + ySpeed[i] * yDirection[i];
    movingBalls[i].style.left = xPos + "px";
    movingBalls[i].style.top = yPos + "px";
    if (xPos <= 0 || xPos >= 590) {
      xDirection[i] = xDirection[i] * -1;
    }
    if (yPos <= 0 || yPos >= 440) {
      yDirection[i] = yDirection[i] * -1;
    }
  }
  return;
}

function rdm(n) {
  return Math.floor(Math.random() * n);
}

function startTimer() {
  timer = setInterval(showSecond, 1000);
}

// 秒数表示
function showSecond() {
  let nowTime = new Date().getTime(); //現在時刻をミリ秒取得
  let distance = setLimitTime - nowTime; //設定した時間までの残り時間を計算
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); // 1時間のミリ秒（残り時間％1日のミリ秒)％1時間のミリ秒
  let seconds = Math.floor((distance % (1000 * 60)) / 1000); // 1分のミリ秒
  if (minutes == 0 && seconds == 0) {
    gameClear();
  }
  let str = "残り時間: " + minutes + "分 " + seconds + "秒";
  console.log(str);
  limit.innerText = str;
}

function gameOver() {
  gameRunning = false;
  displayBoard(1);
  clearInterval(intervalId);
  clearInterval(timer);
  sessionStorage.clear();
  console.log("ゲーム終了");
}
function gameClear() {
  gameRunning = false;
  displayBoard(2);
  clearInterval(intervalId);
  clearInterval(timer);
  sessionStorage.clear();
  console.log("ゲームクリア");
}

function displayBoard(result) {
  if (result === 1) {
    resultmsg.innerHTML = "-GAME OVER-";
    limitmsg.innerHTML = "敵の攻撃にやられてしまった……";
  } else {
    alert("ゲームクリア！遊んでくれてありがとう");
    resultmsg.innerHTML = "-GAME CLEAR!!-";
    limitmsg.innerHTML = "敵は疲れ果てて死んだようだ";
  }
  battleStartbtn.innerText = "もう一度バトルを開始する";
  backStagebtn.innerText = "神経衰弱から始める";
  battleStartbtn.disabled = false;
  backStagebtn.disabled = false;
  result_board.style.display = "block";
}

function backPage() {
  sessionStorage.clear();
  window.location.href = "../index.html";
}
