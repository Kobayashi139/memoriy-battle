let balls = document.getElementsByClassName("ball");
let movingBalls = document.getElementsByClassName("moving");
let emitBalls = document.getElementsByClassName("emit");
let enemy = document.getElementsByClassName("enemy")[0];
let player = document.getElementsByClassName("player")[0];

let speed = 1;
let xSpeed = [1, 1, 1, 1, 1, 1]; //水平方向の速度
let ySpeed = [1, 1, 1, 1, 1, 1]; //垂直方向の速度
let xDirection = []; //水平方向
let yDirection = []; //垂直方向
let fps = 10;
let timeSpeed = 1000;
let score = 0;
let intervalId; //setIntervalのIDを保持
let gameRunning = true; //ゲームが続いているか

let xPos; //randomBallの座標取得用
let yPos;

window.onload = function () {
  document.onmousemove = function (event) {
    playerMove(event);
  };

  for (let i = 0; i < movingBalls.length; i++) {
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
};

function playerMove(event) {
  if (gameRunning === true) {
    //パドルの1コマの移動処理
    if (event.clientX > 23 && event.clientX < 492) {
      //フィールドの範囲で動ける
      player.style.left = event.clientX - 23 + "px";
    }
    if (event.clientY > 23 && event.clientY < 492) {
      player.style.top = event.clientY - 23 + "px";
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

  for (let i = 0; i < movingBalls.length; i++) {
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
  for (let i = 0; i < movingBalls.length; i++) {
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
  console.log("ゲーム終了");
}
