
/* 
* 模板中每个非事件指令或表达式都对应一个watcher对象
* 监视当前表达式数据的变化
* 创建的时机: 在初始化编译模板时
 */
function Watcher(vm, exp, cb) {
    this.cb = cb; // 用于更新节点的回调函数
    this.vm = vm;
    this.exp = exp;
    this.depIds = {};
    this.value = this.get(); // 表达式所对应的值
}

Watcher.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        var value = this.get();
        var oldVal = this.value;
        // 如果不相同
        if (value !== oldVal) {
            // 保存最新的值
            this.value = value;
            // 调用用于更新节点的回调函数
            this.cb.call(this.vm, value, oldVal);
        }
    },

    addDep: function(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    },
    get: function() {
        Dep.target = this;
        var value = this.getVMVal();
        Dep.target = null;

        return value;
    },

    getVMVal: function() {
        var exp = this.exp.split('.');
        var val = this.vm._data;
        exp.forEach(function(k) {
            val = val[k];
        });
        return val;
    }
};