/**
 * pattern の配列の各要素を cnt 回繰り返した形の配列を返す。
 * @param {Array} pattern パターンを格納した配列
 * @param {Number} cnt パターンを繰り返す回数
 * @returns {Array} 繰り返しが適用された配列
 * @example
 *   var a = repeat([ 1, 2, 3 ], 4);
 *   console.log(a); // [ 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3 ]
 */
function repeat(pattern, cnt) {
  var array = [];
  for (var i = 0; i < pattern.length; i = i + 1) {
    for (var j = 0; j < cnt; j = j + 1) {
      array.push(pattern[i]);
    }
  }
  return array;
}

// Array オブジェクトにも追加する
Array.repeat || (Array.repeat = repeat);


/**
 * min から max までの間で乱数を作る
 * @param {Number} min 最小値
 * @param {Number} max 最大値
 * @returns {Number} min 〜 max までのいずれかの整数
 */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*
 * 度数法で表現された角度をラジアンに変換する
 * @param {Number} degree 角度（度数法）
 * @returns {Number} 角度（ラジアン）
 */
function toRadian (degree) {
  return degree * (Math.PI / 180.0);
}

/*
 * ラジアンで表現された角度を度数法に変換する
 * @param {Number} radian 角度（ラジアン）
 * @returns {Number} 角度（度数法）
 */
function toDegree (radian) {
  return radian * (180.0 / Math.PI);
}

// Math オブジェクトにも追加する
Math.toDegree || (Math.toDegree = toDegree);
Math.toRadian || (Math.toRadian = toRadian);
Math.rand || (Math.rand = rand);


/* 動く処理の際、 確認するプログラム */
function check(way, x, y){
    var x = Math.floor(x / 32);
    var y = Math.floor(y / 32);

/* 上下左右 に対応させる処理 */
    switch(way){
      case "right":
        x = x + 1;
        y = y + 1;
        break;
      case "left":
        x = x - 1;
        y = y + 1;
        break;
      case "up":
        y = y;
        break;
      case "down":
        y = y + 2;
        break;
      default:
        break;
    } 
    /* フィールドマップが0を返す(動かせる) */
    if(field[x][y] === 0){
        return 0
    }
    return 1
  }


function blockCheck(x, y){
  var sx = Math.floor(x / 32);
  var sy = Math.floor(y / 32);

  if(map.hitTest(x, y)){
    return 5;
  } 

  /* フィールドにブロックがあった場合、0 を返す */
  if(x < 0 || x > 448){
    return 0
  }
  if(y < 0 || y > 448){
    return 0
  }
  if(field[sx][sy] >= 4 && field[sx][sy] < 60){
    return 0;
  } else if(field[sx][sy] >= 60){
    return 0;    
  }

    /* ぐんまちゃんの判定処理 */
  if(Math.floor(gunmachan.x / 32) == sx && Math.floor(gunmachan.y / 32) + 1 == sy){
    return 0;
    gunmachan.attacked();
  } 

  /* 敵の判定処理 */ 
  for(var i = 0; i< dog.length; i++){      
    dog[i].hitTest("way", this.x, this.y, i)
  }
  /* フィールドにブロックがなかった場合、1 を返す */
  return 1;
}

