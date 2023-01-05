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
  };
}
