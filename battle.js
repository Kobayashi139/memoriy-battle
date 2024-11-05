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

window.onload = function () {
  document.getElementsByClassName("field")[0].onclick = function () {
    loop();
  };
  document.onmousemove = function (event) {
    playerMove(event);
  };

  for (let i = 0; i < movingBalls.length; i++) {
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
  setInterval(randomMove, 5);

  //   setInterval(() => {
  //     for (let i = 0; i < eventBalls.length; i++) {
  //       releaseEmitBalls(emitBalls[i], i, enemy);
  //     }
  //   }, timeSpeed);
};

function loop() {
  loopstart = setInterval("fpsMove", fps);
  return;
}

function fpsMove() {
  hitJudge();
}

function hitJudge() {}

function playerMove(event) {
  //パドルの1コマの移動処理
  player.style.left = event.clientX - 15 + "px";
  player.style.top = event.clientY - 15 + "px";
  return;
}

function randomMove() {
  for (let i = 0; i < movingBalls.length; i++) {
    let xPos = parseInt(movingBalls[i].style.left) + xSpeed[i] * xDirection[i];
    let yPos = parseInt(movingBalls[i].style.top) + ySpeed[i] * yDirection[i];
    movingBalls[i].style.left = xPos + "px";
    movingBalls[i].style.top = yPos + "px";
    if (xPos <= 0 || xPos >= 450) {
      xDirection[i] = xDirection[i] * -1;
    }
    if (yPos <= 0 || yPos >= 450) {
      yDirection[i] = yDirection[i] * -1;
    }
  }
  return;
}

function releaseEmitBalls() {
  let rad = (eventBalls[i] / 180) * Math.PI;
  let velocityX = Math.cos(rad) * speed;
  let velocityY = Math.sin(rad) * speed;
}

function rdm(n) {
  return Math.floor(Math.random() * n);
}
