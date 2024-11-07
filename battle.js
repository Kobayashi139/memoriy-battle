// 読み取り
const field = document.getElementsByClassName("field")[0];
const movingBalls = document.getElementsByClassName("moving");
const emitBalls = document.getElementsByClassName("emit");
const enemy = document.getElementsByClassName("enemy")[0];
const player = document.getElementsByClassName("player")[0];
const limit = document.getElementsByClassName("limit")[0];

// ポップアップ情報の取得
const result_board = document.getElementsByClassName("result_board")[0];
const resultmsg = document.getElementsByClassName("resultmsg")[0];
const battleStartbtn = document.getElementsByClassName("nextbun")[0];
const backStagebtn = document.getElementsByClassName("nextbun")[1];
const limitmsg = document.getElementsByClassName("count")[0];

//各パラメータの初期化
const fps = 10;
const timeSpeed = 1000;
let score = 0;
let intervalId; //setIntervalのIDを保持
let setLimitTime; //制限時間用
let gameRunning = true; //ゲームが続いているか
let speed = 1; //速さ
let xSpeed = [];
let ySpeed = [];
let xDirection = []; //水平方向
let yDirection = []; //垂直方向

let xPos; //randomBallの座標取得用
let yPos;
const board_limit = 200; //ボードの表示する用
const estabLimit = 210000; //残り時間計算用

// cadeDataをもとにrandomBallの数を決める
let cadeData = 0;
cadeData = sessionStorage.getItem("result");
cadeData = 10;
const ballLength = movingBalls.length - cadeData;
if (cadeData < 2) {
  speed = 2.5;
} else if (cadeData < 6) {
  speed = 2;
}

window.onload = function () {
  limitmsg.innerHTML = board_limit + "秒間敵と弾を避け続けろ！";
  battleStartbtn.disabled = false;
  backStagebtn.disabled = false;
  result_board.style.display = "block";
};

function gamestart() {
  battleStartbtn.disabled = true;
  backStagebtn.disabled = true;
  result_board.style.display = "none";

  document.onmousemove = function (event) {
    playerMove(event);
  };

  for (let i = 0; i < ballLength; i++) {
    //ballにランダムな開始位置を与える
    movingBalls[i].style.left = rdm(450) + "px";
    movingBalls[i].style.top = rdm(450) + "px";
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
  intervalId = setInterval(function () {
    if (gameRunning) {
      randomMove();
      overjudge();
    }
  }, fps); //10ミリ秒ごと

  setLimitTime = new Date().getTime() + estabLimit; //タイマーの残り時間
  startTimer(); // タイマー開始
}

function playerMove(event) {
  if (gameRunning === true) {
    // // CSSから位置とサイズを取得
    // let fieldRect = window.getComputedStyle(field);
    // let fieldLeft = parseInt(fieldRect.getPropertyValue("left"));
    // let fieldWidth = parseInt(fieldRect.getPropertyValue("width"));
    // let fieldTop = parseInt(fieldRect.getPropertyValue("top"));
    // let fieldHeight = parseInt(fieldRect.getPropertyValue("height"));
    // let fieldRight = fieldLeft + fieldWidth; //左端+要素の幅=右端
    // let fieldBottom = fieldTop + fieldHeight;

    // let playerRect = window.getComputedStyle(player);
    // let playerWidth = parseInt(playerRect.getPropertyValue("width"));
    // let playerHeight = parseInt(playerRect.getPropertyValue("height"));
    // let scrollX = window.scrollX; // 横スクロールの位置
    // let scrollY = window.scrollY;
    // console.log(scrollY);

    // if (
    //   event.clientX + scrollX > fieldLeft + playerWidth / 2 &&
    //   event.clientX + scrollX < fieldRight - playerWidth / 2
    // ) {
    //   player.style.left = event.clientX + scrollX - playerWidth / 2 + "px";
    // }

    // if (
    //   event.clientY + scrollY > fieldTop + playerHeight / 2 &&
    //   event.clientY + scrollY < fieldBottom - playerHeight / 2
    // ) {
    //   player.style.top = event.clientY + scrollY - playerHeight / 2 + "px";
    // }

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
}

//getComputedStyleで実装する
// function overjudge() {
//   let playerRect = window.getComputedStyle(player);
//   let playerleft = parseInt(playerRect.getPropertyValue("left"));
//   // 左辺座標＋要素の幅＝右辺の座標
//   let playerright = playerleft + parseInt(playerRect.getPropertyValue("width"));
//   let playertop = parseInt(playerRect.getPropertyValue("top"));
//   let playerbottom =
//     playertop + parseInt(playerRect.getPropertyValue("height"));

//   for (let i = 0; i < ballLength; i++) {
//     let ballRect = window.getComputedStyle(movingBalls[i]); // 各ボールの位置とサイズを取得
//     let ballleft = parseInt(ballRect.getPropertyValue("left"));
//     let ballright = ballleft + parseInt(ballRect.getPropertyValue("width"));
//     let balltop = parseInt(ballRect.getPropertyValue("top"));
//     let ballbottom = balltop + parseInt(ballRect.getPropertyValue("height"));

//     if (
//       playerleft < ballright &&
//       playerright > ballleft &&
//       playertop < ballbottom &&
//       playerbottom > balltop
//     ) {
//       score = score + 1;
//       gameOver();
//       break;
//     }
//   }
// }

// getBoundingClientrect()で実装する
function overjudge() {
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

function randomMove() {
  for (let i = 0; i < ballLength; i++) {
    xSpeed.push(speed); //水平方向の速度
    ySpeed.push(speed); //垂直方向の速度
    xPos = parseInt(movingBalls[i].style.left) + xSpeed[i] * xDirection[i];
    yPos = parseInt(movingBalls[i].style.top) + ySpeed[i] * yDirection[i];
    movingBalls[i].style.left = xPos + "px";
    movingBalls[i].style.top = yPos + "px";
    if (xPos <= 0 || xPos >= 490) {
      xDirection[i] = xDirection[i] * -1;
    }
    if (yPos <= 0 || yPos >= 490) {
      yDirection[i] = yDirection[i] * -1;
    }
  }
  return;
}

// function releaseEmitBalls() {
//   let rad = (eventBalls[i] / 180) * Math.PI;
//   let velocityX = Math.cos(rad) * speed;
//   let velocityY = Math.sin(rad) * speed;
// }

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
  clearInterval(intervalId);
  clearInterval(timer);
  sessionStorage.clear();
  console.log("ゲーム終了");
}

function gameClear() {
  gameRunning = false;
  clearInterval(intervalId);
  clearInterval(timer);
  sessionStorage.clear();
  console.log("ゲームクリア");
}

function backPage() {
  if ("referrer" in document) {
    window.location = document.referrer;
  } else {
    window.history.back();
  }
}
