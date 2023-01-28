export class Const {
  // 敌机类型
  public static enemyType = {
    TYPE1: 1,
    TYPE2: 2,
  };
  // 组合类型
  public static combination = {
    TYPE1: 1,
    TYPE2: 2,
    TYPE3: 3,
  };

  // 碰撞类型
  public static collisionType = {
    SELF_PLANE: 1 << 1,
    ENEMY_PLANE: 1 << 2,
    SELF_BULLET: 1 << 3,
    ENEMY_BULLET: 1 << 4,
    BULLET_PROP: 1 << 5,
  };

  public static propType = {
    M: 1,
    H: 2,
    S: 3,
  };

  public static direction = {
    LEFT: 1,
    MIDDLE: 2,
    RIGHT: 3,
  };

  public static boundary = {
    // 左右（x轴）边界
    x: 12,
    // 上下（z轴）边界
    z: 25,
  };

  public static outOfScreen = {
    // 左右（x轴）
    x: 20,
    // 上下（z轴）
    z: 40,
  };
}
