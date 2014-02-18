var item_number = 0;
var Items = [];
var last_flg = 0;

/**
 * @extends Sprite
 */
var Character = Class.create (Sprite, {

  /**
   * マス目に沿って上下左右に動くキャラクタを作る。
   * @constructor
   * @param {Number} x X座標（単位: ピクセル）
   * @param {Number} y Y座標（単位: ピクセル）
   * @property {Boolean} moving キャラクタが移動中であるとき true
   */
  initialize: function (x, y) {
    Sprite.call(this, 32, 48);
    this.x = x;
    this.y = y;
    this.anime = {
      1: repeat([  6,  7,  8,  6, 7, 8 ], 8),
      2: repeat([  3,  4,  5,  3, 4, 5 ], 8),
      4: repeat([  0,  1,  2,  0, 1, 2 ], 8),
      8: repeat([  9, 10, 11, 9, 10, 11 ], 8)
    };
    this.frame = this.anime[4];
    this.moving = false;
  },

  /**
   * キャラクタを右に 16ピクセル動かす。
   * ただし、map を使って障害物判定を行い、障害物がある場合は向きだけ変更される。
   * @param {Function} callback 動作終了後に呼ばれるコールバック関数
   * @returns {Character} このオブジェクト自身
   */
  right: function (callback) {
    var temp = this.x;
    if (!map.hitTest(this.x + 41, this.y + 33) && !check("right", this.x, this.y)) {
      // 障害物がないときは、動く
      this.moving = true;
      this.frame = this.anime[1];
      this.tl.moveBy(32, 0, this.speed).then(function () {
        this.moving = false;
        typeof callback === "function" && callback();
        this.x = temp + 32; 
      });
    } else {
      // 障害物があるときは、向きだけ変える
      this.frame = this.anime[1];
      this.x = temp;
    }
    return this;
  },

  /**
   * キャラクタを左に 16ピクセル動かす。
   * ただし、map を使って障害物判定を行い、障害物がある場合は向きだけ変更される。
   * @param {Function} callback 動作終了後に呼ばれるコールバック関数
   * @returns {Character} このオブジェクト自身
   */
  left: function (callback) {
    var temp = this.x;

    if (!map.hitTest(this.x - 6, this.y + 33)&&
        !check("left", this.x, this.y)
        ) {
      // 障害物がないときは、動く
      this.moving = true;
      this.frame = this.anime[2];
      this.tl.moveBy(-32, 0, this.speed).then(function () {
        this.moving = false;
        typeof callback === "function" && callback();
        this.x = temp - 32;
    
      });
    } else {
      // 障害物があるときは、向きだけ変える
      this.frame = this.anime[2];
      this.x = temp;
    }
    return this;
  },

  /**
   * キャラクタを下に 16ピクセル動かす。
   * ただし、map を使って障害物判定を行い、障害物がある場合は向きだけ変更される。
   * @param {Function} callback 動作終了後に呼ばれるコールバック関数
   * @returns {Character} このオブジェクト自身
   */
  down: function (callback) {
    var temp = this.y;

    if (!map.hitTest(this.x + 24,  this.y + 49) &&
        !map.hitTest(this.x + 24, this.y + 49) &&
        !check("down", this.x, this.y)) {
      // 障害物がないときは、動く
      this.moving = true;
      this.frame = this.anime[4];
      this.tl.moveBy(0, 32, this.speed).then(function () {
        this.moving = false;
        typeof callback === "function" && callback();
        this.y = temp + 32;

      });
    } else {
      // 障害物があるときは、向きだけ変える
      this.frame = this.anime[4];
      this.y = temp;
    }
    return this;
  },

  /**
   * キャラクタを上に 16ピクセル動かす。
   * ただし、map を使って障害物判定を行い、障害物がある場合は向きだけ変更される。
   * @param {Function} callback 動作終了後に呼ばれるコールバック関数
   * @returns {Character} このオブジェクト自身
   */
  up: function (callback) {
    var temp = this.y;
    if (!map.hitTest(this.x + 12,  this.y - 12) &&
        !map.hitTest(this.x + 17, this.y - 6)  &&
        !check("up", this.x, this.y)
        ) {
      // 障害物がないときは、動く
      this.moving = true;
      this.frame = this.anime[8];
      this.tl.moveBy(0, -32, this.speed).then(function () {
        this.moving = false;
        typeof callback === "function" && callback();
        this.y = temp -32;      
      });
    } else {
      // 障害物があるときは、向きだけ変える
      this.frame = this.anime[8];
      this.y = temp;
    }
    return this;
  },

  /**
   * キャラクタがその場で待機する（時間調整用）
   * @param {Function} callback 動作終了後に呼ばれるコールバック関数
   * @returns {Character} このオブジェクト自身
   */
  wait: function (callback) {
    this.moving = true;
    this.tl.delay(12).then(function () {
      this.moving = false;
      typeof callback === "function" && callback();
    });
    return this;
  },
  attacked: function() {
    this.tl.fadeOut(30);
    alert("GAME OVER")
  }
});

/**
 * @extends Character
 * 操作できるキャラクター
 */
var ControllerableCharacter = Class.create(Character, {
  initialize: function (x, y) {
    Character.call(this, x, y);
    this.on(Event.ENTER_FRAME, this.control);
  },

  control: function () {
    if (this.moving) {
      // 移動中は、新たな入力を受け付けない
      return;
    }

    if (core.input.right) {
      this.right();
      for(var i = 0; i < item_number; i++){
        Items[i].hitTest(this.x + 32, this.y);
      }
    } else if (core.input.left) {
      this.left();
      for(var i = 0; i < item_number; i++){
        Items[i].hitTest(this.x - 32, this.y);
      }
    } else if (core.input.up) {
      this.up();
      for(var i = 0; i < item_number; i++){
        Items[i].hitTest(this.x, this.y - 32);
      }
    } else if (core.input.down) {
      this.down();
      for(var i = 0; i < item_number; i++){
        Items[i].hitTest(this.x, this.y + 32);
      }
    }
    if(core.input.a){
      this.bomb()
    }
  },

  bomb: function(){

    /* movingのように制御する */ 
    if(hero.bom === 0){
      return;
    };
    if(!(field[Math.floor(this.x/32)][Math.floor(this.y/32)+1] >= 60)){
      hero.bom = hero.bom - 1;
      bombs[volume] = new Bomb(this.x, this.y + 16)
      bombs[volume].hoge = 0;
      core.rootScene.addChild(bombs[volume]);
      field[Math.floor(this.x/32)][Math.floor(this.y/32)+1] = 60 + volume;
      bombs[volume].explosion(this.x, this.y);
      volume ++;
    }
  }

});


/* 
@extend Character
*/ 

var UncontrollableCharacter = Class.create(Character, {
  initialize: function (x, y) {
    Character.call(this, x, y);
    this.on(Event.ENTER_FRAME, this.randomMove);
  },

  /**
   * キャラクターを適当に動かす
   */
  randomMove: function () {
    if (this.moving) {
      // 移動中は、新たな移動を行わない
      return;
    }

    switch(rand(0, 9)) {
    case 1:
      this.right();
      break;

    case 2:
      this.left();
      break;

    case 3:
      this.up();
      break;

    case 4:
      this.down();
      break;

    default:
      this.wait();
    }
   },
   /* ボム判定 */
  hitTest: function (way, x, y, i){

    x = Math.floor(x / 32);
    y = Math.floor(y / 32);
    sx = Math.floor(this.x / 32) ;
    sy = Math.floor(this.y / 32) + 1;

    if(sx === x && sy === y) {
      this.break(i);

      switch(way){
        case "left":
          left_hit = 1;
          break;
        case "right":
          right_hit = 1;
          break;
        case "up":
          up_hit = 1;
          break;
        case "down":
          down_hit = 1;
          break;
        default: 
          break;
      }
  
    }
  }, 
  break: function(i) {
    // キャラクターが消える処理
    this.tl.fadeOut(20);
    dog.splice(i, 1)
    teki --;
  }

})
