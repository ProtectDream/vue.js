
/* 
* 用来对data所有属性数据进行劫持的构造函数
* 给data中所有属性重新定义属性描述(get/set)
* 为data中的每个属性创建对应的dep对象
 */
function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function (data) {
    var me = this;
    // 遍历data中外层的所有属性
    Object.keys(data).forEach(function (key) {
      // 对指定的属性进行数据劫持
      me.defineReactive(data, key, data[key])
    });
  },

  defineReactive: function (data, key, val) {
    var dep = new Dep();
    var childObj = observe(val);
    Object.defineProperty(data, key, {
      enumerable: true, 
      configurable: false,
      get: function () {
        if (Dep.target) {
          dep.depend();
        }
        return val;
      },
      set: function (newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        childObj = observe(newVal);
        dep.notify();
      }
    });
  }
};