// 具体化しようよ
'use strict';
// このあとやること
// 1. パターンごとのテーマカラー（薄い赤、青とか）を用意→完了
// 2. パターン6はマルチイージングでやりたい。辺を消すステルスも多用する。→完了
// 3. パターン7は、複雑な迷路にしたい。分岐が数多くあり、ひとつしか正解がないみたいなやつ。
// 4. それぞれのパターンを選べる仕組みも作りたい。それで完成になります。
// 5. ボーナス欲しい？
// 6. Hubのところに新しいflowを登録するメソッドが必要ですね・・そのうち解除とかもするかも？
// GitHubに移行しました。

// ブリンクを実装

const HUB_RADIUS = 5;
const PATTERN_NUM = 6;
const GRAPHICS_NUM = 7;

let graph;
let actorGraphics = [];
let selectUI;

function setup(){
  createCanvas(400, 400);
  registActorGraphics();
  graph = new entity();
  graph.loadData();
  graph.createGraph();
  selectUI = new selectPanel();
}

function draw(){
  image(graph.baseGraph, 0, 0);
  selectUI.display();
  graph.actors.forEach(function(mf){
    mf.update();
    mf.display();
  })
}

function keyTyped(){
  if(key === 'p'){ noLoop(); }
  if(key === 'q'){
    loop();
  }
}

// グラフィックの登録
function registActorGraphics(){
  // ここにカラーの一覧をね
  let figureColors = [];
  figureColors.push([color(0, 0, 255), color(255, 0, 0), color(163, 73, 164), color(0), color(32, 168, 72), color(0, 162, 232), color(255, 242, 0)]);
  figureColors.push([color(60, 60, 255), color(255, 60, 60), color(188, 105, 188), color(70), color(55, 217, 104), color(85, 204, 255), color(255, 247, 81)]);
  figureColors.push([color(120, 120, 255), color(255, 120, 120), color(200, 135, 200), color(130), color(121, 230, 154), color(159, 226, 255), color(255, 250, 153)]);
  for(let index = 0; index < 3; index++){
    for(let i = 0; i < GRAPHICS_NUM; i++){
      let img = createGraphics(20, 20);
      img.noStroke();
      createActorGraphics(img, i, figureColors[index][i]);
      actorGraphics.push(img);
    }
  }
}


// グラフィックの詳細
function createActorGraphics(img, graphicsId, figureColor){
  img.fill(figureColor);
  if(graphicsId === 0){ // 普通の正方形
    //img.fill(0, 0, 255);
    img.rect(3, 3, 14, 14);
  }else if(graphicsId === 1){ // 三角形（火のイメージ）
    //img.fill(255, 0, 0);
    img.triangle(10, 0, 10 + 5 * sqrt(3), 15, 10 - 5 * sqrt(3), 15);
  }else if(graphicsId === 2){ // ダイヤ型（クリスタルのイメージ）（色合い工夫してもいいかも）
    //img.fill(187, 102, 187);
    img.quad(10, 0, 10 + 10 / sqrt(3), 10, 10, 20, 10 - 10 / sqrt(3), 10);
  }else if(graphicsId === 3){ // 手裏剣（忍者のイメージ）
    //img.fill(0);
    img.quad(7, 6, 13, 0, 13, 14, 7, 20);
    img.quad(0, 7, 14, 7, 20, 13, 6, 13);
    img.fill(255);
    img.ellipse(10, 10, 5, 5);
  }else if(graphicsId === 4){ // くさび型（草のイメージ・・くさびだけに（？）
    //img.fill(32, 168, 72);
    img.quad(10, 2, 2, 18, 10, 10, 18, 18);
  }else if(graphicsId === 5){ // 水色のなんか
    //img.fill(0, 162, 232);
    for(let k = 0; k < 6; k++){
      let t = 2 * PI * k / 6;
      let t1 = t + 2 * PI / 20;
      let t2 = t - 2 * PI / 20;
      img.quad(10 + 10 * sin(t), 10 - 10 * cos(t), 10 + 5 * sin(t1), 10 - 5 * cos(t1), 10, 10, 10 + 5 * sin(t2), 10 - 5 * cos(t2));
    }
  }else if(graphicsId === 6){ // 星。
    //img.fill(255, 242, 0);
    for(let k = 0; k < 5; k++){
      let t = 2 * PI * k / 5;
      let t1 = t - 2 * PI / 10;
      let t2 = t + 2 * PI / 10;
      img.triangle(10 + 10 * sin(t), 10 - 10 * cos(t), 10 + 5 * sin(t1), 10 - 5 * cos(t1), 10 + 5 * sin(t2), 10 - 5 * cos(t2));
    }
    img.ellipse(10, 10, 10, 10);
  }
}

// セレクトパネル
class selectPanel{
  constructor(){
    // 関数を持たせるとか・・グローバルの。状態を変える・・
    this.base = createGraphics(40, 280);
    this.base.background(90);
    this.selectArea = createGraphics(40, 40);
    this.state = 0; // 0~6
    this.count = 0;
    this.figures = [];
    for(let i = 0; i < GRAPHICS_NUM; i++){
      this.figures.push(new figure(i));
    }
  }
  getState(){ return this.state; }
  display(){
    this.count = (this.count + 1) % 360;
    this.selectArea.background(150 + 30 * cos(2 * PI * this.count / 180));
    image(this.base, 0, 0);
    image(this.selectArea, 0, 40 * this.state);
    for(let i = 0; i < GRAPHICS_NUM; i++){
      this.figures[i].display(createVector(20, 20 + 40 * i));
    }
  }
  change(newState){ this.count = 0; this.state = newState; }
}

// マウスクリックによるパターンチェンジ
function mouseClicked(){
  let mx = mouseX;
  if(mx >= 40 || mx <= 0){ return; }
  let my = mouseY;
  if(my >= 280 || my <= 0){ return; }
  selectUI.change(Math.floor(my / 40));
  graph.switchPattern(selectUI.getState());
}

// カウンター（計測用）
class counter{
  constructor(){
    this.cnt = 0;
    this.isOn = false;
    this.limit; // 限界(-1のときは無限ループ)
    this.diff;  // 増分
  }
  setting(lim, diff){
    this.cnt = 0;
    this.isOn = true;
    this.limit = lim;
    this.diff = diff;
  }
  getCnt(){ return this.cnt; }
  getState(){ return this.isOn; }
  progress(){ this.cnt += this.diff; } // 進める
  check(){
    if(this.cnt > this.limit && this.limit >= 0){ this.isOn = false; } // limit-1のときは無限ループ、
    return this.isOn;
  }
  pause(){ this.isOn = !this.isOn; } // 一時停止
  quit(){ this.cnt = 0; this.isOn = false; } // 中途終了
}

// stateからflowとhub作るの楽しいんだけど、
// とりあえず具体化もうちょっとやってからでいいです。

// hubはいろいろいじれる。
// まず、effectが発生するようにできる（convertのタイミングでアクションを起こす）
// デフォルトで何かactionって書いておいて派生形でactionだけいじるようにすれば何でもできるはず
// flowも同様
// 次に今ランダムで返してるところをinFlowに対して同じflowを返さないようにできる
// これはflowにidを付けconvertでactorを取得してそのflowから同じflowかどうか判別して・・ってやると出来る
// noBackHubみたいな
// graphがglobalになってるから問い合わせてもいいけど直接渡した方が早そう

class hub{
  // 結節点
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.outFlow = []; //outだけ。とりあえず。
  }
  // 今気付いたけどoutFlowにflowを登録するメソッドがないの割と問題だな・・何とかしようよ。
  convert(){
    let nextFlowIndex = randomInt(this.outFlow.length);
    return this.outFlow[nextFlowIndex];
  }
}

function randomInt(n){ return Math.floor(random(n)); } // 0, 1, 2, ..., n-1 のどれかを返す汎用関数

class flow{
  // 流れ
  constructor(h1, h2){
    this.from = h1; // 入口hub
    this.to = h2; // 出口hub
    this.span; // さしわたし
    this.visible = true // これをfalseにすると描画の際に軌道が表示されない
  }
  // getter大事。これで取得することにより、オーバーライドするにあたって
  // 実際の値を変えずに返す値だけいじることができる。
  getSpan(){ return this.span; }
  calcPos(pos, cnt){}
  // あとはtoにconvertしてもらうだけ。
  invisible(){ this.visible = false; }
  drawOrbit(gr){}
}

class straightFlow extends flow{
  constructor(h1, h2){
    super(h1, h2);
    this.span = sqrt((h1.x - h2.x) * (h1.x - h2.x) + (h1.y - h2.y) * (h1.y - h2.y));
  }
  calcPos(pos, cnt){
    pos.x = map(cnt, 0, this.span, this.from.x, this.to.x);
    pos.y = map(cnt, 0, this.span, this.from.y, this.to.y);
  }
  drawOrbit(gr){
    if(!this.visible){ return; }
    gr.push();
    gr.strokeWeight(1.0);
    gr.line(this.from.x, this.from.y, this.to.x, this.to.y);
    //gr.push();
    gr.translate(this.from.x, this.from.y); // 矢印の根元に行って
    let directionVector = createVector(this.to.x - this.from.x, this.to.y - this.from.y);
    gr.rotate(directionVector.heading()); // ぐるんってやって行先をx軸正方向に置いて
    let arrowSize = 7;
    gr.translate(this.span - HUB_RADIUS - arrowSize, 0);
    gr.fill(0);
    gr.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    gr.pop();
  }
}

class easingFlow extends straightFlow{
  // easingするやつ
  constructor(h1, h2, idX, idY){
    super(h1, h2);
    this.easingIdX = idX;
    this.easingIdY = idY;
    //console.log(this.easingIdX);
    //console.log(this.easingIdY);
  }
  calcPos(pos, cnt){
    // easedは0~1の値で、easing functionでconvertした後のもの。
    let easedX = easingFlow.easing(cnt / this.span, this.easingIdX);
    let easedY = easingFlow.easing(cnt / this.span, this.easingIdY);
    pos.x = map(easedX, 0, 1, this.from.x, this.to.x);
    pos.y = map(easedY, 0, 1, this.from.y, this.to.y);
  }
  static easing(x, id){
    // xは0以上1以下の値で、返すのは0付近のある値(x=0とx=1で0になる)
    let y = x;
    if(id === 1){
      y = 3 * pow(x, 2) - 2 * pow(x, 3); // 入口は2乗、出口は3乗。
    }else if(id === 2){
      y = 0.5 * (1 - cos(PI * x)); // cosを使った簡単なもの。
    }else if(id === 3){
      y = (50 / 23) * (-2 * pow(x, 3) + 3 * pow(x, 2) - 0.54 * x); // いわゆるBackInOutというやつ。0.1と0.9で極値。
    }else if(id === 4){
      y = 3 * pow(x, 4) - 2 * pow(x, 6); // 入口は4乗、出口は6乗。
    }else if(id === 5){
      y = x * (2 * x - 1); // 多分バックインになるはず
    }else if(id === 6){
      y = 1 + (1 - x) * (2 * x - 1); // 多分バックアウト？
    }else if(id === 7){
      y = x + 0.1 * sin(8 * PI * x); // ぐらぐら
    }else if(id === 8){
      y = constrain(-12 * pow(x, 3) + 18 * pow(x, 2) - 5 * x, 0, 1); // 停止→移動→停止
    }else if(id === 9){
      y = -12 * pow(x, 3) + 18 * pow(x, 2) - 5 * x; // さっきのやつで普通にバックインアウト
    }else if(id === 10){
      y = (x / 8) + (7 / 8) * pow(x, 4); // ゆっくり→ぎゅーん
    }else if(id === 11){
      y = (7 / 8) + (x / 8) - (7 / 8) * pow(1 - x, 4); // ぎゅーん→ゆっくり
    }
    return y;
  }
}

class factorFlow extends straightFlow{
  // スピード可変. 例えばfactor0.5ならスピード半分、2.0ならスピード2倍
  // spanを変化させると矢印の長さまで変化してしまうので、getterを上書きして、
  // timerに返す値だけいじることにする。位置計算の際にもspanの値自体は変えないようにする。
  constructor(h1, h2, factor){
    super(h1, h2);
    this.speedFactor = factor;
  }
  getSpan(){
    // spanの値はタイマーセットの時しか使わないから、ここをいじってタイマーを伸び縮みさせる。
    return this.span / this.speedFactor;
  }
  calcPos(pos, cnt){
    // spanに相当するところをfactorで割る うまくいったね。
    pos.x = map(cnt, 0, this.span / this.speedFactor, this.from.x, this.to.x);
    pos.y = map(cnt, 0, this.span / this.speedFactor, this.from.y, this.to.y);
  }
}

class torusFlow extends factorFlow{
  // 反対側にとんでいって戻ってくる。長いのでfactorFlowの継承で作る。
  // modはマイナスの場合マイナスで返るので足し算するのを忘れずに。
  constructor(h1, h2, factor, m, n){
    super(h1, h2, factor);
    this.m = m; // x方向調整用の整数（0が無修正）
    this.n = n; // y方向調整用の整数（0が無修正）
    // 矢印使わないからそのままspanいじっちゃおう
    this.span = sqrt(pow(h2.x - h1.x + width * m, 2) + pow(h2.y - h1.y + height * n, 2));
  }
  calcPos(pos, cnt){
    // modを取る。ただしマイナスの場合はwidthなりheightを足す。
    pos.x = map(cnt, 0, this.span / this.speedFactor, this.from.x, this.to.x + this.m * width);
    pos.y = map(cnt, 0, this.span / this.speedFactor, this.from.y, this.to.y + this.n * height);
    pos.x = pos.x % width;
    pos.y = pos.y % height;
    if(pos.x < 0){ pos.x += width; }
    if(pos.y < 0){ pos.y += height; }
  }
  drawOrbit(gr){ return; } // 軌道は描かない
}

class jumpFlow extends flow{
  // ジャンプするやつ
  constructor(h1, h2){
    super(h1, h2);
    this.span = sqrt((h1.x - h2.x) * (h1.x - h2.x) + (h1.y - h2.y) * (h1.y - h2.y));
  }
  calcPos(pos, cnt){
    pos.x = map(cnt, 0, this.span, this.from.x, this.to.x);
    pos.y = map(cnt, 0, this.span, this.from.y, this.to.y);
    pos.y -= (2 / this.span) * cnt * (this.span - cnt); // 高さはとりあえずthis.span/2にしてみる
  }
  drawOrbit(gr){ return; }
}

class circleFlow extends flow{
  constructor(h1, h2, cx, cy, radius, rad1, rad2){
    // rad1, rad2はふたつのラジアンで反時計回りに進む、はず。
    // あー・・えっと、たとえば2π→π・・・あっ。。んー下がります。そうです。（下を回る）
    // で、上がるときは0→πってやるんですよ。そうです。上がります。そうです。（上を回る）
    // mapでやる。
    super(h1, h2);
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.rad1 = rad1; // 開始位相
    this.rad2 = rad2; // 終了位相（補間で変化する）
    this.span = radius * abs(rad2 - rad1); //ここを円弧の長さにします
  }
  calcPos(pos, cnt){
    pos.x = this.cx + this.radius * cos(map(cnt, 0, this.span, this.rad1, this.rad2));
    pos.y = this.cy + this.radius * sin(map(cnt, 0, this.span, this.rad1, this.rad2));
  }
  drawOrbit(gr){
    if(!this.visible){ return; }
    let minRad = min(this.rad1, this.rad2);
    let maxRad = max(this.rad1, this.rad2);
    // 矢印描くところはメソッド化するべきかも。
    // 先っちょの座標とベクトルさえあればいいので。
    gr.push();
    gr.strokeWeight(1.0);
    gr.noFill();
    gr.arc(this.cx, this.cy, 2 * this.radius, 2 * this.radius, minRad, maxRad);
    gr.translate(this.to.x, this.to.y);
    let directionVector = createVector(-(this.to.y - this.cy), this.to.x - this.cx);
    if(this.rad1 > this.rad2){ directionVector.mult(-1); }
    gr.rotate(directionVector.heading());
    let arrowSize = 7;
    gr.translate(-HUB_RADIUS - arrowSize, 0);
    gr.fill(0);
    gr.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    gr.pop();
  }
}

// class parabolaFlow{} 作成したい
// 仕様としてはその・・

class actor{
  constructor(h, speed, kind){
    this.pos = createVector(h.x, h.y);
    this.move = h.convert(); // 所持flow.
    this.speed = speed;
    this.timer = new counter(); // ()忘れてた。ごめんなさい。
    //this.timer.setting(this.move.span, this.speed);
    this.timer.setting(this.move.getSpan(), this.speed); // getterで取得するように変更
    // ブリンクが出るようにいじる
    this.posArray = []; // ブリンク表示用
    for(let i = 0; i < 11; i++){ this.posArray.push(createVector(h.x, h.y)); }
    // visualをブリンクを含む配列にする
    this.visual = [new figure(kind), new figure(kind + GRAPHICS_NUM), new figure(kind + 2 * GRAPHICS_NUM)];
    for(let i = 0; i < 3; i++){ // 回転パターンを揃える
      this.visual[1].rotation = this.visual[0].rotation;
      this.visual[2].rotation = this.visual[0].rotation;
    }
  }
  setting(){
    this.move = this.move.to.convert();
    //this.timer.setting(this.move.span, this.speed);
    this.timer.setting(this.move.getSpan(), this.speed); // getterで取得するように変更
  }
  update(){
    if(!this.timer.getState()){ return; }
    this.timer.progress();
    this.move.calcPos(this.pos, this.timer.getCnt());
    // posArrayの更新
    this.posArray.shift();
    this.posArray.push(createVector(this.pos.x, this.pos.y));
    // 多分イージング入れるとしたら、ここ。加法的か乗法的か知らないけど。
    if(!this.timer.check()){ this.setting(); } // counter check.
  }
  display(){
    // ブリンクもまとめて表示
    this.visual[0].display(this.pos);
    this.visual[1].display(this.posArray[5]);
    this.visual[2].display(this.posArray[0]);
  }
}

class figure{
  constructor(kind){
    this.kind = kind;
    this.rotation = random(2 * PI);
  }
  display(pos){
    push();
    translate(pos.x, pos.y);
    this.rotation += 0.1;
    rotate(this.rotation);
    image(actorGraphics[this.kind], -10, -10);
    pop();
  }
}

class entity{
  constructor(){
    this.hubs = [];
    this.flows = [];
    this.actors = [];
    this.baseGraph = createGraphics(width, height); // これがグラフィック
    // ここ↑に問題があって、グラフをクラスにしてここから上をひとまとめにして、
    // その集合体としてentityを考える必要がある。それにより、
    // 個々のグラフの回転や平行移動が可能になるけどそれは別のsketchでやりましょうね・・
    this.patternIndex = 0;
  }
  reset(){
    this.hubs = [];
    this.flows = [];
    this.actors = [];
  }
  loadData(){
    let id = this.patternIndex;
    if(id === 0){ createPattern0(); }
    else if(id === 1){ createPattern1(); }
    else if(id === 2){ createPattern2(); }
    else if(id === 3){ createPattern3(); }
    else if(id === 4){ createPattern4(); }
    else if(id === 5){ createPattern5(); }
    else if(id === 6){ createPattern6(); }
    //console.log(2);
  }
  createGraph(){
    if(this.patternIndex === 6){ this.baseGraph.stroke(255); } // 最後のパターンだけ白
    this.flows.forEach(function(f){
      f.drawOrbit(this.baseGraph);
    }, this)
    this.baseGraph.stroke(0); // 戻す。
    this.hubs.forEach(function(h){
      this.baseGraph.ellipse(h.x, h.y, HUB_RADIUS * 2, HUB_RADIUS * 2); // ここをhubごとにdrawさせたい気持ちもある・・
    }, this)
    // 将来的にはここでは固定部分だけを描画して可変部分は毎フレーム描画みたいな感じにしたい。
  }
  switchPattern(newIndex){
    this.reset();
    this.patternIndex = newIndex;
    this.loadData();
    this.createGraph();
  }
  registHub(posX, posY){
    let n = posX.length;
    for(let i = 0; i < n; i++){ this.hubs.push(new hub(posX[i], posY[i])); }
  }
  // registFlowはパラメータを辞書に放り込んでコードの再利用をするもの。
  registFlow(inHubsId, outHubsId, params){
    // paramsは辞書の配列
    let n = inHubsId.length;
    for(let i = 0; i < n; i++){
      let inHub = this.hubs[inHubsId[i]];
      let outHub = this.hubs[outHubsId[i]];
      let newFlow = this.createFlow(inHub, outHub, params[i]);
      this.flows.push(newFlow);
      inHub.outFlow.push(newFlow);
    }
  }
  createFlow(h1, h2, pr){
    if(pr['type'] === 'straight'){
      return new straightFlow(h1, h2);
    }else if(pr['type'] === 'easing'){
      return new easingFlow(h1, h2, pr['easingIdX'], pr['easingIdY']);
    }else if(pr['type'] === 'circle'){
      return new circleFlow(h1, h2, pr['cx'], pr['cy'], pr['radius'], pr['rad1'], pr['rad2']);
    }else if(pr['type'] === 'jump'){
      return new jumpFlow(h1, h2);
    }else if(pr['type'] === 'factor'){
      return new factorFlow(h1, h2, pr['factor']);
    }else if(pr['type'] === 'torus'){
      return new torusFlow(h1, h2, pr['factor'], pr['m'], pr['n']);
    }
  }
  registActor(defaultHubsId, speeds, kinds){
    let n = defaultHubsId.length;
    for(let i = 0; i < n; i++){
      let newActor = new actor(this.hubs[defaultHubsId[i]], speeds[i], kinds[i]);
      this.actors.push(newActor);
    }
  }
  setInvisibleFlow(flowIds){
    // まとめてinvisibleを指定する
    flowIds.forEach(function(id){
      let f = this.flows[id];
      f.invisible();
    }, this)
  }
}

// そのうち登録・・なんだっけregist？registメソッド作って簡単にするから待ってて

function createPattern0(){
  // 四角形パターン
  let posX = [];
  let posY = [];
  for(let x1 = 0; x1 < 5; x1++){
    for(let x2 = 0; x2 <= x1; x2++){
      posX.push(200 - 30 * x1 + 60 * x2);
      posY.push(100 + 30 * sqrt(3) * x1);
    }
  }
  graph.registHub(posX, posY);
  let inHubsId = [0, 1, 3, 6, 2, 4, 7, 5, 8, 9, 14, 9, 5, 2, 13, 8, 4, 12, 7, 11, 1, 3, 4, 6, 7, 8, 10, 11, 12, 13];
  let outHubsId = [1, 3, 6, 10, 4, 7, 11, 8, 12, 13, 9, 5, 2, 0, 8, 4, 1, 7, 3, 6, 2, 4, 5, 7, 8, 9, 11, 12, 13, 14];
  graph.registFlow(inHubsId, outHubsId, typeSeq('straight', inHubsId.length));
  graph.registActor([0, 10, 14], [2, 2, 2], [0, 0, 0]);
  // ちょっと実験
  //graph.flows[8].invisible(); // 無事消えました！！！
  graph.baseGraph.background(186, 190, 237);
}

function createPattern1(){
  // 三角形
  let posX = [200].concat(arCosSeq(0, PI / 4, 8, 60, 200)).concat(arCosSeq(0, PI / 4, 8, 120, 200));
  let posY = [200].concat(arSinSeq(0, PI / 4, 8, 60, 200)).concat(arSinSeq(0, PI / 4, 8, 120, 200));
  graph.registHub(posX, posY);
  // 初めの16個が直線で残りの16個が円軌道。
  let inHubsId = [0, 0, 0, 0, 9, 11, 13, 15, 2, 4, 6, 8, 2, 4, 6, 8, 1, 2, 3, 4, 5, 6, 7, 8, 9, 16, 15, 14, 13, 12, 11, 10];
  let outHubsId = [1, 3, 5, 7, 1, 3, 5, 7, 0, 0, 0, 0, 10, 12, 14, 16, 2, 3, 4, 5, 6, 7, 8, 1, 16, 15, 14, 13, 12, 11, 10, 9];
  let params = typeSeq('straight', 16).concat(typeSeq('circle', 16));
  let cxs = constSeq(200, 16);
  let cys = constSeq(200, 16);
  let radiuses = constSeq(60, 8).concat(constSeq(120, 8));
  let rad1s = arSeq(0, PI / 4, 8).concat(arSeq(2 * PI, -PI / 4, 8));
  let rad2s = arSeq(PI / 4, PI / 4, 8).concat(arSeq(7 * PI / 4, -PI / 4, 8));
  for(let i = 0; i < 16; i++){
    params[16 + i]['cx'] = cxs[i]; params[16 + i]['cy'] = cys[i]; params[16 + i]['radius'] = radiuses[i];
    params[16 + i]['rad1'] = rad1s[i]; params[16 + i]['rad2'] = rad2s[i];
  }
  graph.registFlow(inHubsId, outHubsId, params);
  graph.registActor([0, 0, 0, 0], [2, 3, 2, 3], [1, 1, 1, 1]);
  graph.baseGraph.background(248, 160, 165);
}

function createPattern2(){
  // ひしがた
  for(let y = 0; y < 4; y++){
    for(let x = 0; x < 4; x++){
      graph.hubs.push(new hub(80 + x * 80, 80 + y * 80));
    }
  }
  let params = [];
  // easing / jump
  for(let i = 0; i < 24; i++){ params.push({type:'easing', easingId: Math.floor(i / 8)}); }
  let inHubsId = [1, 0, 8, 12, 14, 15, 7, 3, 1, 5, 8, 9, 14, 10, 7, 6, 4, 9, 13, 10, 11, 6, 2, 5];
  let outHubsId = [0, 4, 12, 13, 15, 11, 3, 2, 5, 4, 9, 13, 10, 11, 6, 2, 8, 5, 14, 9, 7, 10, 1, 6];
  for(let i = 0; i < 8; i++){ params.push({type:'jump'}); }
  inHubsId = inHubsId.concat([1, 8, 14, 7, 4, 2, 11, 13]);
  outHubsId = outHubsId.concat([8, 14, 7, 1, 2, 11, 13, 4]);
  graph.registFlow(inHubsId, outHubsId, params);
  graph.registActor([0, 3, 15, 12], [2, 2, 3, 3], [2, 2, 2, 2]);
  graph.baseGraph.background(220, 175, 220);
}

function createPattern3(){
  // factorFlowの実験
  // しゅりけん
  let posX = [];
  let posY = [];
  for(let i = 0; i < 3; i++){
    posX = posX.concat([220 - 60 * i, 340 - 60 * i, 300 - 60 * i, 180 - 60 * i, 140 - 60 * i, 380 - 60 * i]);
    posY = posY.concat([40 + 120 * i, 40 + 120 * i, 120 + 120 * i, 120 + 120 * i, 120 + 120 * i, 40 + 120 * i]);
  }
  graph.registHub(posX, posY);
  graph.registFlow([0, 1, 2, 3, 6, 7, 8, 9, 12, 13, 14, 15], [1, 2, 3, 0, 7, 8, 9, 6, 13, 14, 15, 12], typeSeq('straight', 12));
  graph.registFlow([17, 11, 5], [10, 4, 16], typeSeq('jump', 3));
  let params = typeSeq('factor', 12);
  for(let i = 0; i < 6; i++){ params[i]['factor'] = 2; params[i + 6]['factor'] = 4; }
  graph.registFlow([0, 3, 6, 9, 12, 15, 4, 1, 10, 7, 16, 13], [2, 1, 8, 7, 14, 13, 3, 5, 9, 11, 15, 17], params);
  graph.registActor([4, 10, 16], [1, 2, 3], [3, 3, 3]);
  graph.baseGraph.background(221, 189, 172);
}

function createPattern4(){
  // easingの実験
  graph.registHub(constSeq(100, 12).concat(constSeq(300, 12)), arSeq(30, 30, 12).concat(arSeq(30, 30, 12)));
  let params = typeSeq('easing', 12);
  for(let i = 0; i < 12; i++){ params[i]['easingIdX'] = i; params[i]['easingIdY'] = i; }
  graph.registFlow(arSeq(0, 1, 12), arSeq(12, 1, 12), params);
  graph.registFlow(arSeq(12, 1, 12), arSeq(0, 1, 12), typeSeq('straight', 12)); // 帰り道はストレート
  graph.registActor(arSeq(0, 1, 12), constSeq(2, 12), constSeq(4, 12));
  graph.baseGraph.background(169, 239, 190);
}

function createPattern5(){
  // torusFlow使いましょー
  let posX = [80, 160, 240, 320, 320, 320, 320, 240, 160, 80, 80, 80];
  let posY = [80, 80, 80, 80, 160, 240, 320, 320, 320, 320, 240, 160];
  graph.registHub(posX, posY);
  // straightFlow.
  graph.registFlow(arSeq(0, 1, 12), arSeq(1, 1, 11).concat([0]), typeSeq('straight', 12));
  // torusFlow.
  let params = typeSeq('torus', 8);
  let mSeq = [-2, -2, 0, 2, 2, 2, 0, -2];
  let nSeq = [-2, 0, -2, -2, 0, 2, 2, 2];
  for(let i = 0; i < 8; i++){ params[i]['factor'] = 4; params[i]['m'] = mSeq[i]; params[i]['n'] = nSeq[i]; }
  graph.registFlow([0, 10, 1, 3, 4, 6, 7, 9], [5, 3, 6, 8, 9, 11, 0, 2], params);
  // easingFlow.
  params = typeSeq('easing', 6);
  for(let i = 0; i < 6; i++){
    params[i]['easingIdX'] = randomInt(12); params[i]['easingIdY'] = randomInt(12);
  }
  graph.registFlow([1, 2, 11, 4, 6, 9], [7, 8, 5, 10, 0, 3], params);
  graph.setInvisibleFlow(arSeq(20, 1, 6));
  graph.registActor([0, 3, 6, 9, 1, 7], [2, 1.5, 2, 1.5, 1, 1], [5, 5, 5, 5, 5, 5]);
  graph.baseGraph.background(181, 233, 255);
}

function createPattern6(){
  // これで最後。迷路。
  let posX = [70, 170, 320, 370, 220, 270, 120, 170, 270, 70, 270, 370, 170, 220, 270, 120, 320, 70, 170, 270, 320, 370, 370, 70, 270, 170];
  let posY = [50, 50, 50, 50, 100, 100, 150, 150, 150, 200, 200, 200, 250, 250, 250, 300, 300, 350, 350, 350, 350, 350, 380, 380, 20, 20];
  graph.registHub(posX, posY);
  let inHubsId = [0, 2, 3, 5, 7, 7, 9, 10, 12, 14, 15, 18, 19, 20, 21, 17, 6, 1, 7, 18, 4, 8, 10, 10, 19, 16, 16, 11, 11, 13, 22, 23, 3, 24, 25];
  let outHubsId = [1, 1, 2, 4, 6, 8, 10, 11, 13, 13, 16, 17, 18, 19, 20, 9, 15, 7, 12, 12, 13, 5, 8, 14, 14, 2, 20, 3, 21, 22, 23, 0, 24, 25, 0];
  let params = typeSeq('straight', 29).concat(typeSeq('jump', 1)).concat(typeSeq('factor', 1)).concat(typeSeq('jump', 1)).concat(typeSeq('easing', 3));
  params[30]['factor'] = 5;
  for(let i = 32; i <= 34; i++){
    params[i]['easingIdX'] = 9;
    params[i]['easingIdY'] = 10;
  }
  graph.registFlow(inHubsId, outHubsId, params);
  graph.setInvisibleFlow([32, 33, 34]);
  graph.registActor([0, 0, 0, 0, 0], [2, 2.5, 3, 3.5, 4], [6, 6, 6, 6, 6]);
  graph.baseGraph.background(0);
}

// 配列関数
// これとconcutを組み合わせる。
// [1, 2, 3].concat([4, 5])で[1, 2, 3, 4, 5]になる。

function constSeq(c, n){
  // cがn個。
  let array = [];
  for(let i = 0; i < n; i++){ array.push(c); }
  return array;
}

function typeSeq(typename, n){
  // typenameの辞書がn個。
  let array = [];
  for(let i = 0; i < n; i++){ array.push({type: typename}); }
  return array;
}

function arSeq(start, interval, n){
  // startからintervalずつn個
  let array = [];
  for(let i = 0; i < n; i++){ array.push(start + interval * i); }
  return array;
}

function arCosSeq(start, interval, n, radius = 1, pivot = 0){
  // startからintervalずつn個をradius * cos([]) の[]に放り込む。pivotは定数ずらし。
  let array = [];
  for(let i = 0; i < n; i++){ array.push(pivot + radius * cos(start + interval * i)); }
  return array;
}

function arSinSeq(start, interval, n, radius = 1, pivot = 0){
  // startからintervalずつn個をradius * sin([]) の[]に放り込む。pivotは定数ずらし。
  let array = [];
  for(let i = 0; i < n; i++){ array.push(pivot + radius * sin(start + interval * i)); }
  return array;
}
