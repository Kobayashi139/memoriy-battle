// let=再宣言・再代入可能　const=再宣言・再代入不可能

// カードめくり用 タイマーID(動作中はカードがめくれないように)
let backTimer;
// 1枚目かどうかのフラグ(1枚目: true 2枚目: false)
let flgFirst = true;
// 1枚目のカードを格納
let cardFirst;
// そろえた枚数(ペアができるたびに+1 10ペアで終了)
let countUnit = 0;
//初期ターン数
const initTurns = 5;
//残りターン数
let turns = initTurns;
// ゲーム中
let gamePlaying = false;
// テスト用強制配列
let cheat = true;
// カードチェック中
let isChecking = false;
// クラスリセット用
let cardClsReset;

// imgのURL一覧
let img_arr = [
  "axe",
  "bow",
  "cane",
  "dagger",
  "great-axe",
  "morning-star",
  "saber",
  "sword",
  "test1",
  "test2",
];

// ポップアップ情報の取得
const result_board = document.getElementsByClassName("result_board")[0];
const resultmsg = document.getElementsByClassName("resultmsg")[0];
const restartbtn = document.getElementsByClassName("nextbun")[0];
const nextstgbtn = document.getElementsByClassName("nextbun")[1];

// 画面下部のカウント
const setturns = document.getElementsByClassName("turns")[1];
const count = document.getElementsByClassName("count")[1];

// submitボタン
const battleBtn = document.getElementsByClassName("nextbun")[1];

//上記したimg名をURLの形式に変換して、一つの配列にいれる
let img_tag_arr = [];
for (let i = 0; i < 10; i++) {
  img_tag_arr.push("/images/weapon/" + img_arr[i] + ".png");
}

window.onload = function () {
  restartbtn.disabled = false;
  nextstgbtn.disabled = false;
  result_board.style.display = "block";
};

// 始まった瞬間の処理
function gamestart() {
  // ポップアップを消す
  restartbtn.disabled = true;
  nextstgbtn.disabled = true;
  result_board.style.display = "none";

  //　カウントリセット
  setturns.innerHTML = "残りターン数: " + turns + "ターン";
  count.innerHTML = "ペアになったカード: " + countUnit + "組";
  sessionStorage.clear();
  gamePlaying = true;
  isChecking = false;

  let arr = []; //カードの種別番号格納
  for (let i = 0; i < 10; i++) {
    // カードが10種類
    arr.push(i); //2枚同じカードを入れる必要があるため
    arr.push(i);
  } //[0,0,1,1,2,2,...........8,8,9,9] 合計20の要素
  shuffle(arr); // シャッフル関数起動：結果＝ [1,7,3,4,4,5......]

  // カードの位置を設定
  const cards = document.getElementsByClassName("card"); //カードを取得
  for (let i = 0; i < cards.length; i++) {
    // カードの初期化
    cards[i].style.backgroundImage = ""; // 画像をリセット
    cards[i].className = "card";

    let cx = (i % 5) * 100; // X座標（例: 100px間隔）
    let cy = Math.floor(i / 5) * 100; // Y座標（例: 100px間隔）
    cards[i].style.left = cx + "px";
    cards[i].style.top = cy + "px";
    cards[i].classList.add(`${arr[i]}`);
    cards[i].classList.add("back"); // 全てのカードを裏向きにする
    cards[i].onclick = turn.bind(null, arr[i]); // クリックイベント設定
  }
}

//Fisher-Yatesシャッフル関数
function shuffle(arr) {
  if (cheat) {
    console.log("チートタイム");
    const cheatArr = [
      1, 1, 5, 3, 0, 7, 4, 8, 6, 7, 9, 6, 2, 2, 5, 4, 0, 8, 3, 9,
    ];
    for (let i = 0; i < arr.length; i++) {
      arr[i] = cheatArr[i];
    }
    cheat = false;
  } else {
    let n = arr.length; //配列の末尾を知る 20
    while (n) {
      //nが0になったら終了      ここで毎回-1
      i = Math.floor(Math.random() * n--);
      [arr[n], arr[i]] = [arr[i], arr[n]];
    }
  }
  console.log(arr);
  return arr;
}

// フラグを付けて、カードをめくれなくするなど
// カードクリック時の処理
function turn(cardnum, e) {
  if (!gamePlaying || isChecking) {
    //ゲームプレイ中またはカードチェック中は何もしない
    return;
  }
  let element = e.target; //クリックしたカード
  // カードのタイマー処理が動作中は return
  if (backTimer) return; //カードの表を表示している時間の場合何もしない
  //この処理を掛けることで、他の処理を上書きさせない>>ダブルクリック対策

  // 裏向きのカードをクリックした場合は画像を表示する
  if (element.classList.contains("back")) {
    element.classList.remove("back");
    element.style.backgroundImage = `url(${img_tag_arr[cardnum]})`;
  } else {
    return; // 表示されているカードは return
  }
  console.log(element.classList); //正しく情報を得ているか確認

  if (flgFirst) {
    // 1枚目の処理 一枚目ならtrue
    cardFirst = element; //最初にクリックしたカード
    flgFirst = false; //次は２枚目だから
  } else {
    // ２枚目の処理
    //ターン数計算
    isChecking = true;
    turns--;
    setturns.innerHTML = "残りターン数: " + turns + "ターン";
    console.log(turns + "ターン");

    if (cardFirst.className === element.className) {
      countUnit++; //揃ったペアの数
      element.classList.add("shine"); // ペアが揃ったカードに「shine」クラスを追加
      cardFirst.classList.add("shine");
      console.log("そろいました" + countUnit);
      count.innerHTML = "ペアになったカード: " + countUnit + "組";

      backTimer = setTimeout(function () {
        element.classList.add("finish"); // ペアが揃ったカードに「finish」クラスを追加
        cardFirst.classList.add("finish");
        backTimer = null;
        isChecking = false;
        flgFirst = true;

        if (countUnit === 10) {
          // すべてのペアが揃ったら停止
          gamePlaying = false;
          gameend(countUnit);
        }
      }, 650); //0.65秒後に行う（２枚目のカードを表示する時間）
    }
    if (turns <= 0) {
      console.log("turn0");
      gamePlaying = false;
      isChecking = false;
      gameend(countUnit);
    } else {
      backTimer = setTimeout(function () {
        element.classList.add("back");
        cardFirst.classList.add("back");
        element.style.backgroundImage = "";
        cardFirst.style.backgroundImage = "";
        cardFirst = null;
        backTimer = null;
        flgFirst = true;
        isChecking = false;
      }, 650);
    }
  }
}

function gameend(unit) {
  if (unit === 10) {
    alert("全てのペアが揃いました、おめでとうございます");
  }
  // 結果表示
  let resultturns = document.getElementsByClassName("turns")[0];
  resultturns.innerHTML = "残りターン数: " + turns + "ターン";
  let recount = document.getElementsByClassName("count")[0];
  recount.innerHTML = "ペアになったカード: " + countUnit + "組";

  // データ保存
  sessionStorage.setItem("result", countUnit);

  restartbtn.disabled = false;
  restartbtn.innerHTML = "もう一度神経衰弱をする";
  nextstgbtn.disabled = false;
  nextstgbtn.innerHTML = "バトルを始める";
  result_board.style.display = "block";
  resultmsg.innerHTML = "結果発表";
  // リセット
  cardFirst = null;
  backTimer = NaN;
  flgFirst = true;
  countUnit = 0;
  turns = initTurns;
}

function moveBattle() {
  window.location.href = "../battle.html";
}
