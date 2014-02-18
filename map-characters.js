// このゲーム用のキャラクターを定義したファイル

/**
 * 主人公
 * @extends ControllerableCharacter
 */
var Hero = Class.create(ControllerableCharacter, {
  initialize: function (x, y) {
    ControllerableCharacter.call(this, x, y);
    this.image = core.assets["./chara/vx_chara07_d_02.png"];
    this.speed = 15;
    this.fire = 2;
    this.bom = 10
  }
});

/**
 * ぶろっく
 * @extends UncontrollableItem
 */
var Block = Class.create(UncontrollableItem, {
  initialize: function (x, y) {
    UncontrollableItem.call(this, x, y);
    this.image = core.assets["./chara/block.png"];
    this.get = 1;
  },
    advent: function(){
    if(this.get){
      switch(rand(0, 9)) {
      case 1:
      /* speedUp */
        Items[item_number] = new UpItem(this.x, this.y);
        Items[item_number].frame = [0];
        core.rootScene.addChild(Items[item_number]);
        item_number = item_number + 1;
        break;
      case 2:
      /* bombUp */ 
        Items[item_number] = new UpItem(this.x, this.y);
        Items[item_number].frame = [1];
        core.rootScene.addChild(Items[item_number])
        item_number = item_number + 1;

        break;
      case 3:
      /* fireUp */
        Items[item_number] = new UpItem(this.x, this.y);
        Items[item_number].frame = [2];
        core.rootScene.addChild(Items[item_number])
        item_number = item_number + 1;
        break;

      default:
        break;
      } 
      this.get = 0;
    }
  }
});

var Bomb = Class.create(ControllableBomb, {
  initialize: function (x, y) {
    ControllableBomb.call(this, x ,y);
    this.image = core.assets["./chara/bomb.png"];
  }
});

var Fire = Class.create(ControllableFire, {
  initialize: function (way, x, y, width) {
    ControllableFire.call(this, x, y, width);
    this.frame = [1];
    this.hitted = 0;
    this.image = core.assets["./chara/explo.png"];
      switch(way){
        case "left":
          break;
        case "right":
          this.tl.rotateBy(180, 1)
          break;
        case "up":
          this.tl.rotateBy(90, 1)
          break;
        case "down":
          this.tl.rotateBy(270, 1)
          break;
        default: 
          break;
      }
      if(last_flg === 1){
        this.frame = [0];
      }
  }
});

var Enemy = Class.create(UncontrollableCharacter, {
  initialize: function(x, y) {
      UncontrollableCharacter.call(this, x ,y);
      this.image = core.assets["./chara/vx_chara01_a_01.png"]
      this.speed = 10;
  }
})

var UpItem = Class.create(UncontrollableItem, {
  initialize: function (x, y) {
    UncontrollableItem.call(this, x, y);
    this.image = core.assets["./chara/items.png"];
  }
});
