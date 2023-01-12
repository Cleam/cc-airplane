const rowLen = 5;
const colLen = 5;
let delArr = [];
const arr = [
  [1, 1, 0, 3, 2],
  [0, 0, 4, 4, 0],
  [2, 3, 4, 1, 0],
  [1, 0, 2, 2, 3],
  [1, 2, 2, 3, 2],
];

const pos = {
  left: 1,
  right: 2,
  up: 3,
  down: 4,
};

// 找出与(x, y)位置相连的相同的类型
function check(x, y) {
  delArr[x][y] = 1; // 标记要删除的为1

  let left = 0;
  if (x > 0) {
    // 检查左边，如果左边未被标记且类型和自己一样
    if (delArr[x - 1][y] !== 1 && arr[x - 1][y] === arr[x][y]) {
      delArr[x - 1][y] = 1;
      left = check(x - 1, y, pos.right);
    }
  }

  let right = 0;
  if (x < rowLen - 1) {
    // 检查左边，如果右边未被标记且类型和自己一样
    if (delArr[x + 1][y] !== 1 && arr[x + 1][y] === arr[x][y]) {
      delArr[x + 1][y] = 1;
      right = check(x + 1, y, pos.left);
    }
  }

  let up = 0;
  if (y > 0) {
    // 检查上边，如果上边未被标记且类型和自己一样
    if (delArr[x][y - 1] !== 1 && arr[x][y - 1] === arr[x][y]) {
      delArr[x][y - 1] = 1;
      up = check(x, y - 1, pos.down);
    }
  }

  let down = 0;
  if (y < colLen - 1) {
    // 检查下边，如果下边未被标记且类型和自己一样
    if (delArr[x][y + 1] !== 1 && arr[x][y + 1] === arr[x][y]) {
      delArr[x][y + 1] = 1;
      down = check(x, y + 1, pos.up);
    }
  }

  return left + right + up + down + 1; // 如果小于2，表示不需要消除。
}

function resetDelArr() {
  delArr = [];
  for (let i = 0; i < colLen; i++) {
    const rArr = Array.from({ length: rowLen }).fill(0);
    delArr.push(rArr);
  }
}

function checkPos(x, y) {
  resetDelArr();
  return check(x, y);
}

console.log("地图数据：", arr);

// 找出位置(1,2)相连的同类型地块
console.log(checkPos(1, 2)); // 判断值是否大于3，大于3个可以消除
console.log("相连数据：", delArr);

// 找出位置(4,2)相连的同类型地块
console.log(checkPos(4, 2)); // 判断值是否大于3，大于3个可以消除
console.log("相连数据：", delArr);
