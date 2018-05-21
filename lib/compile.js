
/* 
* 用来解析模板页面的对象的构造函数(一个实例)
* 利用compile对象解析模板页面
* complie与watcher关系: 一对多的关系
 */
function Compile(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
        // 1. 取出el中所有的子节点存放到一个fragment对象, 并保存fragment
        this.$fragment = this.node2Fragment(this.$el);
        // 2. 编译fragment中所有的子节点
        this.compileElement(this.$fragment);
        // 3. 将编译好的fragment插入el元素
        this.$el.appendChild(this.$fragment); 
    }
}


Compile.prototype = {
    node2Fragment: function(el) {

        const innerStr = el.innerHTML
        el.innerHTML = ''  

        const div = document.createElement('div')
        div.innerHTML = innerStr

        var fragment = document.createDocumentFragment(),
            child;
        while (child = div.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    },

    // 编译指定节点的所有层次的子节点
    compileElement: function(el) {
        var childNodes = el.childNodes,
            me = this;
        [].slice.call(childNodes).forEach(function(node) {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/;
            if (me.isElementNode(node)) {
                // 编译节点中所有指令属性，根据不同的指令做出不同的处理
                me.compile(node);
            } else if (me.isTextNode(node) && reg.test(text)) {
                me.compileText(node, RegExp.$1);
            }

            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    }
}