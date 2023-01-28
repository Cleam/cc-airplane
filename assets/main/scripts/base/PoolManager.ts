import { NodePool, Prefab, Node, instantiate } from "cc";

interface IDictNodePool {
  [name: string]: NodePool;
}

// interface IDictPrefab {
//   [name: string]: Prefab;
// }

// 节点池管理类
export class PoolManager {
  private static _instance: PoolManager = null;

  private _dictNodePool: IDictNodePool = {};
  // private _dictPrefab: IDictPrefab = {};

  public static get instance() {
    if (!this._instance) {
      this._instance = new PoolManager();
    }

    return this._instance;
  }

  // 存入/回收节点
  public putNode(node: Node) {
    const name = node.name;
    // console.log("putNode name :>> ", name);
    node.parent = null;
    if (!this._dictNodePool[name]) {
      this._dictNodePool[name] = new NodePool();
    }
    this._dictNodePool[name].put(node);
  }

  // 获取节点
  public getNode(prefab: Prefab, parent: Node) {
    const name = prefab.name;
    // console.log("getNode name :>> ", name);
    let node: Node = null;
    // this._dictPrefab[name] = prefab;
    const pool = this._dictNodePool[name];

    if (pool) {
      if (pool.size() > 0) {
        node = pool.get();
      } else {
        node = instantiate(prefab);
      }
    } else {
      this._dictNodePool[name] = new NodePool();
      node = instantiate(prefab);
    }
    node.setParent(parent);
    node.active = true;
    return node;
  }
}
