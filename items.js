var right_fire;
var left_fire;
var up_fire;
var down_fire;
/**
 * @extends Sprite
 */
var Item = Class.create (Sprite, {

  /**
   * マス目に沿って上下左右に動くキャラクタを作る。
   * @constructor
   * @param {Number} x X座標（単位: ピクセル）
   * @param {Number} y Y座標（単位: ピクセル）
   * @property {Boolean} moving キャラクタが移動中であるとき true
   */
  initialize: function (x, y) {
    Sprite.call(this, 32, 32);
    this.x = x;
    this.y = y;
    this.moving = false;
  }});

var UncontrollableItem = Class.create(Item, {
  initialize: function (x, y) {
    Item.call(this, x, y);
  },
  hitTest: function (x, y){

    x = Math.floor(x / 32);
    y = Math.floor(y / 32) + 1;
    sx = Math.floor(this.x / 32);
    sy = Math.floor(this.y / 32);

    if(sx === x && sy === y) {
      switch(this.frame){
        case 0:
          hero.speed = hero.speed - 2;
          break;
        case 1:
          hero.bom = hero.bom + 1;
          break;
        case 2:

          hero.fire = hero.fire + 1;
          break;
        default:
          break;
      }
      this.break();
    }
  },
  break: function(){
    this.frame = this.frame + 3;
    this.tl.fadeOut(10)
  }
})


var ControllableBomb = Class.create(Item, {
  initialize: function (x, y) {
    Item.call(this, x, y);
    this.frame = [
         1,   1,   1,   1,   1,   1,  1,  1,  1,  1,  1,  1,         
        ]
  },

  explosion: function(x , y) {
    /* 全方向に火を召還 */        
        this.frame = [
         1,   1,   1,   1,   1,   1,  1,  1,  1,  1,  1,  1,
         2,   2,   2,   2,   2,   2,  2,  2,  2,  2,  2,  2,
         1,   1,   1,   1,   1,   1,  1,  1,  1,  1,  1,  1,
         2,   2,   2,   2,   2,   2,  2,  2,  2,  2,  2,  2,
         1,   1,   1,   1,   1,   1,  1,  1,  1,  1,  1,  1,
         2,   2,   2,   2,   2,   2,  2,  2,  2,  2,  2,  2,
         3,   3,   3,   3,   3,   3,  3,  3,  3,  1,  1,  1,
         4,   4,   4,   4,   4,   4,  4,  4,  4,  4,  4,  4,
         5,   5,   5,   5,   5,   5,  5,  5,  5,  5,  5,  5,
         6,   6,   6,   6,   6,   6,  6,  6,  6,  6,  6,  6,
         ]
      this.tl.delay(110).then( function() {

        this.check();
      })
    },
    check: function(x, y) {
      this.frame = [
         7,   7,   7,   7,   7,   7,  7,  7,  7,  7,  7,  7,
      ]
      field[Math.floor((this.x)/32)][Math.floor((this.y)/32)] = 0;

      var iryoku = 0;
      last_flg = 0;
      var left_hit = right_hit = up_hit = down_hit = 0;

        /* 左のブロックを確認し、破壊する */
        for(var h = 0;h < hero.fire; h++){
          hx = this.x - (h * 32) - 32;
          hy = this.y;
          hCheck = blockCheck(hx, hy);
          if(left_hit === 0){
            switch(hCheck){
              case 1: 
                left_fire = new Fire("left", hx, hy);
                break;
              case 5:
                left_fire = new Fire("left", hx　+ 32, hy);
                left_hit = 1;
                break;
              default: 
                left_fire = new Fire("left", hx, hy)
                left_hit = 1;
                break;
            }
            left_fire.break()
            core.rootScene.addChild(left_fire)
          }
            if((h + 1) >= hero.fire || left_hit > 0){
            left_fire.frame = [0]
            h = hero.fire
          }
        }
        /* 右のブロックを確認し、破壊する */
        for(var i = 0;i < hero.fire; i++){
          ix = this.x + (i * 32) + 32;
          iy = this.y;
          iCheck = blockCheck(ix, iy);
          if(right_hit === 0){
            switch(iCheck){
              case 1: 
                right_fire = new Fire("right", ix, iy);
                break;
              case 5:
                right_fire = new Fire("right", ix - 32, iy);
                right_hit = 1;
                break;
              default: 
                right_fire = new Fire("right", ix, iy)
                right_hit = 1;
                break;
            }
            right_fire.break()
            core.rootScene.addChild(right_fire)
          }
          if((i + 1) >= hero.fire || right_hit == 1){
            right_fire.frame = [0]
            i = hero.fire
          }
        }

        /* 上のブロックを確認し、破壊する */
        for(var j = 0;j < hero.fire; j++){
          jx = this.x
          jy = this.y - (j * 32) -32;
          jCheck = blockCheck(jx, jy);

          if(up_hit === 0){
            switch(jCheck){
              case 1: 
                up_fire = new Fire("up", jx, jy);
                break;
              case 5:
                up_fire = new Fire("up", jx, jy + 32);
                up_hit = 1;
                break;
              default: 
                up_fire = new Fire("up", jx, jy + 16)

                up_hit = 1;
                break;
            }
            up_fire.break()
            core.rootScene.addChild(up_fire)
          }
          if((j + 1) >= hero.fire || up_hit == 1){
            up_fire.frame = [0]
            j = hero.fire
          }
        }

        /* 下のブロックを確認し、破壊する */
        for(var k = 0;k < hero.fire; k++){
          kx = this.x
          ky = this.y + (k * 32) + 32;
          kCheck = blockCheck(kx, ky);

          if(down_hit === 0){
            switch(kCheck){
              case 1: 
                down_fire = new Fire("down", kx, ky);
                break;
              case 5:
                down_fire = new Fire("down", kx, ky - 32);
                down_hit = 1;
                break;
              default: 
                down_fire = new Fire("down", kx, ky)
                down_hit = 1;
                break;
            }
            down_fire.break()
            core.rootScene.addChild(down_fire)
          }
          if((k + 1) >= hero.fire || down_hit == 1){
            down_fire.frame = [0]
            k = hero.fire
          }
        }

      /* 微妙に調整するために 各座標に足している 
       * フィールドマップを 0 に書き換え、thisを削除する
       */
      field[Math.floor((this.x)/32)][Math.floor((this.y)/32)] = 0;
      this.parentNode.removeChild(this);
      hero.bom = hero.bom + 1;

  }
})


/**
 * @extends Item
 * 火
 */
var ControllableFire = Class.create(Item, {
  initialize: function (x, y) {
    Item.call(this, x, y);
  },
  break: function(x , y) {
    x = Math.floor(this.x/32)
    y = Math.floor(this.y/32)

    /* ぐんまちゃんの判定処理 */
    if(Math.floor(hero.x / 32) == x && Math.floor(hero.y / 32) + 1 == y){
      hero.attacked();
    } 

    /* 敵の判定処理 */ 
    for(var i = 0; i< dog.length; i++){      
      dog[i].hitTest("way", this.x, this.y, i)
    }

    /* フィールドマップが 4 以上, 60 未満(壊れるブロック) なら破壊する 
     * フィールドマップを 0 に置き換える */
    if(field[x][y] >= 4 && field[x][y] < 60){
      block[field[x][y] -4 ].break();
      block[field[x][y] -4 ].advent();
      field[x][y] = 0;
    }
    /* これを消す*/
    this.tl.fadeOut(20).then(function (){
      this.parentNode.removeChild(this);

    })
  }
})
