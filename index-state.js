// 開始時間
let startTime;
// タイマーごとにIDをつけなければどのタイマーを止めたいのかわからなくなる
// 経過秒数用 タイマーID
let timer;
// カードめくり用 タイマーID(動作中はカードがめくれないように)
let backTimer;
// 1枚目かどうかのフラグ(1枚目: true 2枚目: false)
let flgFirst = true;
// 1枚目のカードを格納
let cardFirst;
// そろえた枚数(ペアができるたびに+1 10ペアで終了)
let countUnit = 0;

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

//上記したimg名をURLの形式に変換して、一つの配列にいれる
let img_tag_arr = [];
for (let i = 0; i < 10; i++) {
  img_tag_arr.push("<img src='/images/weapon/" + img_arr[i] + ".png'>");
}

// 始まった瞬間の処理
window.onload = function () {
  let arr = []; //カードの種別番号格納
  for (let i = 0; i < 10; i++) {
    // カードが10種類
    arr.push(i); //2枚同じカードを入れる必要があるため
    arr.push(i);
  } //[0,0,1,1,2,2,...........8,8,9,9] 合計20の要素

  shuffle(arr); // シャッフル関数起動：結果＝ [1,7,3,4,4,5......]
  let game_board = document.getElementById("game_board"); //カードを並べる領域確保

  // 要素作成(カード)
  for (i = 0; i < 20; i++) {
    let element = document.createElement("button");
    element.className = "card back"; //カードの裏側を表示するクラスを付与
    element.number = arr[i]; //プロパティを設定、シャッフル結果の番号を順に入れていく
    //console.log(Object.keys(div));
    //console.log(Object.values(div));
    element.onclick = turn; //div要素にonclickするのは拡張性が悪く非推奨
    // onclick="turn()"を起動するという意味
    game_board.appendChild(element);
    //appendChild:指定された親ノードの子ノードリストの末尾にノードを追加する（HTMLに追加するみたいな）
  }
  startTime = new Date(); // 開始時刻を取得
  startTimer(); // タイマー開始
};

//Fisher-Yatesシャッフル関数
function shuffle(arr) {
  let n = arr.length; //配列の末尾を知る 多分20
  while (n) {
    //nが0になったら終了      ここで毎回-1
    i = Math.floor(Math.random() * n--);
    [arr[n], arr[i]] = [arr[i], arr[n]];
  }
  return arr;
}

// カードクリック時の処理
function turn(e) {
  let element = e.target; //クリックしたカード
  // カードのタイマー処理が動作中は return
  if (backTimer) return; //連続で押せないように
  //element.disabled = true;
  //押している間にこの処理を掛けることで、他の処理を上書きさせない>>ダブルクリック対策
  // 裏向きのカードをクリックした場合は画像を表示する
  if (element.innerHTML == "") {
    element.className = "card"; //backというクラス名を取り除いた
    element.innerHTML = img_tag_arr[element.number];
  } else {
    return; // 数字が表示されているカードは return
  }
  if (flgFirst) {
    // 1枚目の処理 一枚目ならtrue
    cardFirst = element; //最初にクリックしたカード
    flgFirst = false; //次は２枚目だから
  } else {
    // ２枚目の処理
    if (cardFirst.number == element.number) {
      countUnit++; //揃ったペアの数
      backTimer = setTimeout(function () {
        element.className = "card finish"; //0.5秒で透明
        cardFirst.className = "card finish";
        backTimer = NaN;
        if (countUnit == 10) {
          //すべてカードが揃ったら
          clearInterval(timer); // timer終了
          //setInterval(showSecond, 1000)
        }
      }, 500);
    } else {
      backTimer = setTimeout(function () {
        element.className = "card back";
        element.innerHTML = ""; // カードを裏側に戻す
        cardFirst.className = "card back";
        cardFirst.innerHTML = "";
        cardFirst = null;
        backTimer = NaN;
      }, 500);
    }
    flgFirst = true;
  }
}
// タイマー開始
function startTimer() {
  timer = setInterval(showSecond, 1000);
}
// 秒数表示
function showSecond() {
  let nowTime = new Date();
  let elapsedTime = Math.floor((nowTime - startTime) / 1000);
  let str = "経過秒数: " + elapsedTime + "秒";
  let re = document.getElementById("result");
  re.innerHTML = str;
}
