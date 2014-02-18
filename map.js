// グローバル変数（お行儀は悪いが…）
var core;
var block = []
var flg = 0;
var dog = [];
var teki = 20;
/* フィールド管理
 * 0 通れる
 * 1 collisitonDate が設定してある場所 通れない
 * 3 ボムが置かれている場所 通れない
 * 54 >= x >= 4 ブロック番号を保管している、削除の際に用いる 通れない
 * 60 >= ボム番号を保管している、削除の際に用いる 通れない 
 */
var field =[
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
var xtemp = 0;
var ytemp = 0;
var bombs = []
var volume = 0;



// 初期化処理
window.onload = function () {
	
	//画面の大きさを指定
	core = new Core(640, 640);

	core.preload(
	  "./chara/vx_chara01_a_01.png",        // 主人公
    "./chara/vx_chara07_d_02.png",    // 犬
    "./chara/vx_chara07_d_03.png",    // ねこ
    "./mapparts/combined.png",        // マップパーツ
    "./chara/block.png",
    "./chara/bomb.png",
    "./chara/explo.png",
    "./chara/items.png",
    "./chara/vx_chara07_d_02.png"
  );
	core.scale = 1;
	core.fps = 60;
  core.keybind(32, "a");
	core.onload = function () {
    // マップエディタが作った JSON 形式のマップデータを読み込む
    xhr = new XMLHttpRequest();
    xhr.open("GET", "./map.json", true);
    xhr.onload = function () {

      // マップデータの読み込み完了
      data = JSON.parse(this.responseText);

      // マップエディタが作る衝突判定用データが enchant.js で扱えるものと若干違うので修正する
      data.collision.tiles = data.collision.tiles.map(function (es) {
        return es.map(function (e) {
          return e === -1 ? 0 : e;
        });
      });

      // 背景マップの設定
      map = new Map(data.tileWidth, data.tileHeight);     // マップの広さの指定
      // map.image = core.assets[data.chipSet];
      map.image = core.assets["./mapparts/combined.png"]; // チップセットの指定
      map.loadData(data.layers[0].tiles);                 // データの設定    
      core.rootScene.addChild(map);                       // シーンに追加
      
      // 背景マップ（障害物）の設定
      map2 = new Map(data.tileWidth, data.tileHeight);     // マップの広さの指定
      // map2.image = core.assets[data.chipSet];
      map2.image = core.assets["./mapparts/combined.png"]; // チップセットの指定
      map2.loadData(data.layers[1].tiles);                 // データの設定
      core.rootScene.addChild(map2);                       // シーンに追加


      // ブロックの表示
      for(var i=0;i<50;i++){
      while(flg ===0){
        xtemp = Math.floor((rand(0, 448) / 32),0)
        ytemp = Math.floor((rand(0, 512) / 32),0)
        if(field[xtemp][ytemp] === 0){
          flg = 1;
          /* フィールドマップ座標に、ブロックの番号 ( i + 4) を追加する。 */
          field[xtemp][ytemp] = i + 4;
        }
      }        
        block[i] = new Block((xtemp * 32), (ytemp * 32));
        block[i].id = i;
        core.rootScene.addChild(block[i])
        flg = 0;
      }
      /* グローバル変数 teki の数だけ、敵の召喚をする */
      for(var i=0;i<teki;i++){
      while(flg ===0){
        xtemp = Math.floor((rand(32, 412) / 32),0)
        ytemp = Math.floor((rand(32, 448) / 32),0)
        if(field[xtemp][ytemp] === 0){
          flg = 1;
        }
      }        
        dog[i] = new Enemy((xtemp * 32), (ytemp * 32) + 16);
        dog.id = i;
        core.rootScene.addChild(dog[i])
        flg = 0;
      }
      // キャラクターを登場させる
      hero = new Hero(32, 16);
      core.rootScene.addChild(hero);



      /* 初期位置の周辺にブロックを置かないようにしたものをとる */
      field[1][1] = field[1][2] = field[2][1] = 0;
      // 衝突判定（通れる・通れない）のデータの設定
      map.collisionData = data.collision.tiles;

      /* 敵が0か判定する */
      core.rootScene.on(Event.ENTER_FRAME, function (){
        if(dog.length === 0){
          alert("end")
          dog.length = 1;
        }
      })
    }
    xhr.send(null);

	};
	core.start();

};
