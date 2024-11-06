// 読み取り
const field = document.getElementsByClassName("field")[0];
const movingBalls = document.getElementsByClassName("moving");
const emitBalls = document.getElementsByClassName("emit");
const enemy = document.getElementsByClassName("enemy")[0];
const player = document.getElementsByClassName("player")[0];

// ポップアップ情報の取得
const result_board = document.getElementsByClassName("result_board")[0];
const resultmsg = document.getElementsByClassName("resultmsg")[0];
const battleStartbtn = document.getElementsByClassName("nextbun")[0];
const backStagebtn = document.getElementsByClassName("nextbun")[1];

//各パラメータの初期化
const fps = 10;
const timeSpeed = 1000;
let score = 0;
let intervalId; //setIntervalのIDを保持
let gameRunning = true; //ゲームが続いているか
let speed = 1; //速さ
let xSpeed = [];
let ySpeed = [];
let xDirection = []; //水平方向
let yDirection = []; //垂直方向

let xPos; //randomBallの座標取得用
let yPos;

// cadeDataをもとにrandomBallの数を決める
let cadeData = 0;
cadeData = sessionStorage.getItem("result");
cadeData = 9;
const ballLength = movingBalls.length - cadeData;
if (cadeData < 2) {
  speed = 2.5;
} else if (cadeData < 6) {
  speed = 2;
}

window.onload = function () {
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
}

function playerMove(event) {
  if (gameRunning === true) {
    let fieldRect = field.getBoundingClientRect();
    let playerRect = player.getBoundingClientRect();
    //1コマの移動処理
    if (
      event.clientX > fieldRect.left + playerRect.width / 2 && //要素のサイズを考慮する
      event.clientX < fieldRect.right - playerRect.width / 2
    ) {
      //フィールドの範囲で動ける
      player.style.left = event.clientX - playerRect.width / 2 - 7 + "px"; //カーソルを中心にする
    }
    if (
      event.clientY > fieldRect.top + playerRect.height / 2 &&
      event.clientY < fieldRect.bottom - playerRect.height / 2
    ) {
      player.style.top = event.clientY - playerRect.height / 2 - 88 + "px";
    }
    overjudge();
    return;
  }
}

//getComputedStyleで実装する
function overjudge() {
  let playerRect = window.getComputedStyle(player);
  let playerleft = parseInt(playerRect.getPropertyValue("left"));
  // 左辺座標＋要素の幅＝右辺の座標
  let playerright = playerleft + parseInt(playerRect.getPropertyValue("width"));
  let playertop = parseInt(playerRect.getPropertyValue("top"));
  let playerbottom =
    playertop + parseInt(playerRect.getPropertyValue("height"));

  for (let i = 0; i < ballLength; i++) {
    let ballRect = window.getComputedStyle(movingBalls[i]); // 各ボールの位置とサイズを取得
    let ballleft = parseInt(ballRect.getPropertyValue("left"));
    let ballright = ballleft + parseInt(ballRect.getPropertyValue("width"));
    let balltop = parseInt(ballRect.getPropertyValue("top"));
    let ballbottom = balltop + parseInt(ballRect.getPropertyValue("height"));

    if (
      playerleft < ballright &&
      playerright > ballleft &&
      playertop < ballbottom &&
      playerbottom > balltop
    ) {
      score = score + 1;
      gameOver();
      break;
    }
  }
}

//getBoundingClientrect()で実装する
// function overjudge() {
//   let playerRect = player.getBoundingClientRect(); // プレイヤーの位置とサイズを取得
//   for (let i = 0; i < movingBalls.length; i++) {
//     let ballRect = movingBalls[i].getBoundingClientRect(); // 各ボールの位置とサイズを取得
//     if (
//       playerRect.left < ballRect.right &&
//       playerRect.right > ballRect.left &&
//       playerRect.top < ballRect.bottom &&
//       playerRect.bottom > ballRect.top
//     ) {
//       score = score + 1;
//       gameOver();
//       break;
//     }
//   }
// }

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

function gameOver() {
  gameRunning = false;
  clearInterval(intervalId);
  sessionStorage.clear();
  console.log("ゲーム終了");
}

function backPage() {
  if ("referrer" in document) {
    window.location = document.referrer;
  } else {
    window.history.back();
  }
}
