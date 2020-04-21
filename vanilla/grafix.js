'use strict';
class Unit {
    static percentage(obtained, total) {
        return obtained * 100 / total;
    }
    static setTimeout(func, delay, name = "") {
        if (name.length === 0)
            name = "timeout_" + performance.now() + "_" + Unit.random(1, 99999);
        if (Unit.timeouts.has(name))
            Unit.clearTimeout(name);
        const id = setTimeout(func, delay);
        Unit.timeouts.set(name, id);
        return id;
    }
    static clearTimeout(name = "") {
        if (!Unit.timeouts.has(name))
            return;
        clearTimeout(Unit.timeouts.get(name));
        Unit.timeouts.delete(name);
    }
    static setInterval(func, delay, name = "") {
        if (name.length === 0)
            name = "interval_" + performance.now() + "_" + Unit.random(1, 99999);
        if (Unit.intervals.has(name))
            Unit.clearInterval(name);
        const id = setInterval(func, delay);
        Unit.intervals.set(name, id);
        return id;
    }
    static clearInterval(name = "") {
        if (this.intervals.has(name) === false)
            return;
        clearInterval(this.intervals.get(name));
        this.intervals.delete(name);
    }
    static uniqueNumber() {
        return parseInt(Date.now() + "" + this.random(1, 99999) + "" + this.random(1, 99999));
    }
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static uniqueID() {
        return Date.now() + "" + Unit.random(1, 99999) + "" + Unit.random(1, 99999);
    }
}
Unit.timeouts = new Map();
Unit.intervals = new Map();
class AssocList {
    constructor(items, uniqueMix = false, subscribable = true) {
        this.ids = new Map();
        this.firstNode = null;
        this.lastNode = null;
        this.size = 0;
        this.uniqueMix = false;
        this.focusNode = null;
        this.binds = null;
        this.uniqueMix = uniqueMix;
        if (subscribable)
            this.binds = {
                add: new Mix(undefined, undefined, false),
                sort: new Mix(undefined, undefined, false),
                remove: new Mix(undefined, undefined, false)
            };
        if (items)
            for (let i = 0; i < items.length; i++)
                if (items[i] instanceof Array)
                    this.set(items[i][0], items[i][1]);
                else
                    this.add(items[i]);
    }
    onAdd(event, id = null) {
        if (!id)
            id = Unit.uniqueID();
        if (this.binds.add.has(id))
            return;
        this.binds.add.set(id, event);
        return id;
    }
    onSort(event, id = null) {
        if (!id)
            id = Unit.uniqueID();
        if (this.binds.sort.has(id))
            return;
        this.binds.sort.set(id, event);
        return id;
    }
    onRemove(event, id = null) {
        if (!id)
            id = Unit.uniqueID();
        if (this.binds.remove.has(id))
            return;
        this.binds.remove.set(id, event);
        return id;
    }
    removeOnAdd(id) {
        if (!this.binds.add.has(id))
            return;
        this.binds.add.delete(id);
    }
    removeOnSort(id) {
        if (!this.binds.sort.has(id))
            return;
        this.binds.sort.delete(id);
    }
    removeOnRemove(id) {
        if (!this.binds.remove.has(id))
            return;
        this.binds.remove.delete(id);
    }
    export() {
        const arr = [];
        this.foreach((item, id) => arr.push([id, item]));
        return arr;
    }
    get first() {
        return this.firstNode;
    }
    get last() {
        return this.lastNode;
    }
    get preEnd() {
        return this.lastNode.prev.data;
    }
    firstID() {
        return this.first.id;
    }
    get firstItem() {
        return this.first.data;
    }
    lastID() {
        return this.last.id;
    }
    get lastItem() {
        return this.last.data;
    }
    start() {
        return this.firstItem;
    }
    end() {
        return this.lastItem;
    }
    get next() {
        if (this.focusNode)
            if (this.focusNode.next)
                this.focusNode = this.focusNode.next;
        return this;
    }
    get prev() {
        if (this.focusNode)
            if (this.focusNode.prev)
                this.focusNode = this.focusNode.prev;
        return this;
    }
    focus(id) {
        if (this.has(id))
            this.focusNode = this.getNode(id);
        return this;
    }
    getID() {
        if (this.focusNode)
            return this.focusNode.id;
        return null;
    }
    add(item) {
        if (this instanceof Mix &&
            typeof item === "string" &&
            this.uniqueMix) {
            this.set(item, item);
            return item;
        }
        const id = Unit.uniqueID();
        this.set(id, item);
        return id;
    }
    pre(item) {
        const id = this.add(item);
        if (this.size !== 1)
            this.sort(id, this.firstID);
        return this;
    }
    push(item) {
        this.add(item);
        return this;
    }
    set(id, item) {
        let next = null;
        if (this.has(id)) {
            next = this.getNode(id).next;
            this.delete(id);
        }
        const node = {
            data: item,
            id,
            prev: this.lastNode,
            next: null
        };
        if (this.lastNode !== null)
            this.lastNode.next = node;
        if (this.firstNode === null)
            this.firstNode = node;
        this.lastNode = node;
        this.ids.set(id, () => node);
        this.size++;
        if (this.binds)
            if (this.binds.add.size)
                this.binds.add.foreach(subscriber => subscriber(item, id));
        if (next)
            this.sort(id, next.id);
    }
    unshift() {
        if (!this.size)
            return null;
        const item = this.get(this.firstNode.id);
        this.delete(this.firstNode.id);
        return item;
    }
    pop() {
        if (!this.size)
            return null;
        const item = this.get(this.lastNode.id);
        this.delete(this.lastNode.id);
        return item;
    }
    index(n) {
        let i = 0;
        let result = null;
        this.foreach(item => {
            if (i === n) {
                result = item;
                return false;
            }
            i++;
        });
        return result;
    }
    iteratedSort(callback) { }
    sort(beforeID, afterID) {
        if (beforeID === afterID)
            return;
        if (this.ids.has(beforeID) === false)
            return;
        const before = this.getNode(beforeID);
        if (before.prev && before.next) {
            before.next.prev = before.prev;
            before.prev.next = before.next;
        }
        else if (before.prev) {
            before.prev.next = null;
            this.lastNode = before.prev;
        }
        else if (before.next) {
            before.next.prev = null;
            this.firstNode = before.next;
        }
        if (afterID === null) {
            this.lastNode.next = before;
            before.prev = this.lastNode;
            before.next = null;
            this.lastNode = before;
            if (this.binds)
                if (this.binds.sort.size)
                    this.binds.sort.foreach(subscriber => subscriber(this.get(beforeID), null, beforeID, null));
            return;
        }
        const after = this.getNode(afterID);
        if (this.ids.has(afterID) === false)
            return;
        if (after.prev) {
            after.prev.next = before;
            before.prev = after.prev;
        }
        else {
            before.prev = null;
            this.firstNode = before;
        }
        before.next = after;
        after.prev = before;
        if (after.id === this.first.id) {
            before.prev = null;
            this.firstNode = before;
        }
        if (this.binds)
            if (this.binds.sort.size)
                this.binds.sort.foreach(subscriber => subscriber(this.get(beforeID), this.get(afterID), beforeID, afterID));
    }
    has(id) {
        return this.ids.has(id);
    }
    get(id) {
        if (!id)
            if (this.focusNode)
                return this.focusNode.data;
        if (this.has(id) === false)
            return null;
        return this.ids.get(id)().data;
    }
    getNode(id) {
        return this.ids.get(id)();
    }
    clean() {
        this.foreach((item, id) => this.binds.remove.foreach(event => event(item, id)));
        this.ids = new Map();
        this.firstNode = null;
        this.lastNode = null;
        this.size = 0;
    }
    delete(id) {
        if (this.has(id) === false)
            return;
        let firstLastDelete = false;
        if (this.firstNode.id === id) {
            if (this.firstNode.next === null)
                this.firstNode = null;
            else if (this.firstNode.next.id === id) {
                this.firstNode = null;
                this.lastNode = null;
            }
            else {
                this.firstNode.next.prev = null;
                this.firstNode = this.firstNode.next;
            }
            firstLastDelete = true;
        }
        if (this.lastNode.id === id) {
            if (this.lastNode.prev === null)
                this.lastNode = null;
            else if (this.lastNode.prev.id === id) {
                this.firstNode = null;
                this.lastNode = null;
            }
            else {
                this.lastNode.prev.next = null;
                this.lastNode = this.lastNode.prev;
            }
            firstLastDelete = true;
        }
        if (firstLastDelete === false) {
            const node = this.ids.get(id)();
            if (node.prev !== null && node.next !== null) {
                node.prev.next = node.next;
                node.next.prev = node.prev;
            }
        }
        const item = this.get(id);
        this.ids.delete(id);
        this.size--;
        if (this.binds)
            if (this.binds.remove.size)
                this.binds.remove.foreach(subscriber => subscriber(item, id));
    }
    aforeach(callback, onEnd) {
        if (!this.size)
            return onEnd();
        this.doNextAsync(null, callback, onEnd);
    }
    aforeachBackward(callback, onEnd) {
        if (!this.size)
            return onEnd();
        this.doPrevAsync(null, callback, onEnd);
    }
    foreach(callback, reversed = false) {
        let next = null;
        while (true) {
            if (reversed === false)
                next = this.doNext(next, callback);
            else
                next = this.doPrev(next, callback);
            if (next === null)
                break;
        }
    }
    forEach(callback) {
        this.foreach(callback);
    }
    doNext(node, callback) {
        if (node === null)
            node = this.firstNode;
        if (node === null)
            return null;
        const result = callback(node.data, node.id);
        if (typeof result === "boolean")
            if (result === false)
                return null;
        return node.next;
    }
    doPrev(node, callback) {
        if (node === null)
            node = this.lastNode;
        if (node === null)
            return null;
        const result = callback(node.data, node.id);
        if (typeof result === "boolean")
            if (result === false)
                return null;
        return node.prev;
    }
    doNextAsync(node, callback, onEnd) {
        if (node === null)
            node = this.firstNode;
        if (node === null)
            return;
        callback(() => {
            if (node.next)
                this.doNextAsync(node.next, callback, onEnd);
            else if (onEnd)
                onEnd();
        }, node.data, node.id);
    }
    doPrevAsync(node, callback, onEnd) {
        if (node === null)
            node = this.lastNode;
        if (node === null)
            return;
        callback(() => {
            if (node.prev)
                this.doPrevAsync(node.prev, callback, onEnd);
            else if (onEnd)
                onEnd();
        }, node.data, node.id);
    }
    sum(func) {
        const sum = new Mix();
        this.foreach(item => {
            const items = func(item);
            items.foreach(subItem => sum.add(subItem));
        });
        return sum;
    }
    mix(func) {
        const sum = new Mix();
        this.foreach(item => {
            sum.add(func(item));
        });
        return sum;
    }
    copy(innerCopy = false) {
        const copy = new Arr();
        this.foreach((item, id) => {
            if (innerCopy)
                if (item instanceof Arr)
                    copy.set(id, item.copy(true));
                else
                    copy.set(id, item.copy());
            else
                copy.set(id, item);
        });
        return copy;
    }
    get array() {
        const arr = [];
        this.foreach(item => arr.push(item));
        return arr;
    }
    get map() {
        const map = new Map();
        this.foreach((item, id) => map.set(id, item));
        return map;
    }
    // Solid debug purposes
    get obj() {
        const obj = {};
        this.foreach((item, id) => {
            obj[id] = item;
        });
        return obj;
    }
    getMore(...ids) {
        const result = new Arr();
        for (let i = 0; i < ids.length; i++) {
            if (this.has(ids[i]) === false)
                continue;
            result.set(ids[i], this.get(ids[i]));
        }
        return result;
    }
    readId(id) {
        return [...this.ids.keys()][0];
    }
    readIds() {
        return Array.from(this.ids.keys());
    }
    monitor() {
        const exp = this.array;
        const arr = [];
        for (let i = 0; i < exp.length; i++)
            if (exp[i] instanceof AssocList)
                arr[i] = exp[i].monitor();
            else
                arr[i] = exp[i];
        return arr;
    }
    monitorObj() {
        const obj = this.obj;
        for (const key in obj)
            if (obj[key] instanceof AssocList)
                obj[key] = obj[key].monitorObj();
        return obj;
    }
    monitorAssoc() {
        const arr = [];
        this.foreach((item, id) => arr.push([id, item]));
        for (let i = 0; i < arr.length; i++)
            if (arr[i][1] instanceof AssocList)
                arr[i][1] = arr[i][1].monitorAssoc();
        return arr;
    }
}
class Arr extends AssocList {
}
class Mix extends Arr {
}
class UniqueMix extends Mix {
    constructor(items) {
        super(items, true);
    }
}
class TagProps {
    constructor(data) {
        this.name = typeof data.name === "undefined" ? "" : data.name;
        this.text = typeof data.text === "undefined" ? "" : data.text;
        this.html = typeof data.html === "undefined" ? "" : data.html;
        this.style = typeof data.style === "undefined" ? "" : data.style;
        this.width = typeof data.width === "undefined" ? "" : data.width;
        this.height = typeof data.height === "undefined" ? "" : data.height;
        this.classes = typeof data.classes === "undefined" ? "" : data.classes;
        this.attributes = typeof data.attributes === "undefined" ? null : data.attributes;
        this.type = typeof data.type === "undefined" ? "" : data.type;
        this.value = typeof data.value === "undefined" ? "" : data.value;
        this.placeholder = typeof data.placeholder === "undefined" ? "" : data.placeholder;
        this.onClick = typeof data.onClick === "undefined" ? null : data.onClick;
        this.onChange = typeof data.onChange === "undefined" ? null : data.onChange;
        this.onFocus = typeof data.onFocus === "undefined" ? null : data.onFocus;
        this.onBlur = typeof data.onBlur === "undefined" ? null : data.onBlur;
        this.onInit = typeof data.onInit === "undefined" ? null : data.onInit;
        this.onMount = typeof data.onMount === "undefined" ? null : data.onMount;
        this.onUnmount = typeof data.onUnmount === "undefined" ? null : data.onUnmount;
        this.onUnmountAsync = typeof data.onUnmountAsync === "undefined" ? null : data.onUnmountAsync;
        this.onDoubleClick = typeof data.onDoubleClick === "undefined" ? null : data.onDoubleClick;
        this.onMouseDown = typeof data.onMouseDown === "undefined" ? null : data.onMouseDown;
        this.onMouseUp = typeof data.onMouseUp === "undefined" ? null : data.onMouseUp;
        this.onMouseMove = typeof data.onMouseMove === "undefined" ? null : data.onMouseMove;
        this.onMouseEnter = typeof data.onMouseEnter === "undefined" ? null : data.onMouseEnter;
        this.onMouseLeave = typeof data.onMouseLeave === "undefined" ? null : data.onMouseLeave;
        this.onMouseOver = typeof data.onMouseOver === "undefined" ? null : data.onMouseOver;
        this.onMouseOut = typeof data.onMouseOut === "undefined" ? null : data.onMouseOut;
        this.onRightClick = typeof data.onRightClick === "undefined" ? null : data.onRightClick;
        this.onKeyUp = typeof data.onKeyUp === "undefined" ? null : data.onKeyUp;
        this.onKeyDown = typeof data.onKeyDown === "undefined" ? null : data.onKeyDown;
        this.onUpdate = typeof data.onUpdate === "undefined" ? null : data.onUpdate;
        this.onScroll = typeof data.onScroll === "undefined" ? null : data.onScroll;
        this.onMouseWheel = typeof data.onMouseWheel === "undefined" ? null : data.onMouseWheel;
        this.onSubmit = typeof data.onSubmit === "undefined" ? null : data.onSubmit;
        this.onResize = typeof data.onResize === "undefined" ? null : data.onResize;
        this._onSubmit = typeof data._onSubmit === "undefined" ? null : data._onSubmit;
    }
}
var bindType;
(function (bindType) {
    bindType["text"] = "text";
    bindType["styles"] = "styles";
    bindType["classes"] = "classes";
    bindType["router"] = "router";
    bindType["attributes"] = "attributes";
})(bindType || (bindType = {}));
let bindListen = false;
let currentTag = null;
let currentBindType = bindType.text;
let currentBindFunc = null;
let bindingChanged = false;
/**
 * @function
 * @template A
 * @returns {A}
 * */
const o = (/** @type {(new() => A)|A} */ ref, /** @type {A} */ d) => {
    const id = Unit.uniqueID();
    let object = ref instanceof Function ?
        new ref() : ref;
    if (d)
        for (const key in d)
            if (typeof object[key] !== "undefined")
                object[key] = d[key];
    const binds = new Mix();
    const propCache = {};
    const reg = (prop) => {
        if (!propCache[prop])
            propCache[prop] = prop + id + currentBindType;
        if (currentTag.bindsCache[propCache[prop]])
            return;
        else
            currentTag.bindsCache[propCache[prop]] = true;
        if (currentTag.binds.has(id))
            if (currentTag.binds.get(id).has(prop))
                if (currentTag.binds.get(id).get(prop).has(currentBindType))
                    return;
        if (!currentTag.binds.has(id))
            currentTag.binds.set(id, new Mix());
        if (!currentTag.binds.get(id).has(prop))
            currentTag.binds.get(id).set(prop, new Mix());
        const bindID = Unit.uniqueID();
        currentTag.binds.get(id).get(prop).set(currentBindType, {
            objBinds: binds,
            func: currentBindFunc,
            id: bindID
        });
        if (!binds.has(prop))
            binds.set(prop, new Mix());
        binds.get(prop).set(bindID, currentBindFunc);
        bindingChanged = true;
    };
    const p = new Proxy(object, {
        get: (obj, prop) => {
            if (bindListen)
                reg(prop);
            return obj[prop];
        },
        set: (obj, prop, val) => {
            obj[prop] = val;
            if (binds.has(prop))
                binds.get(prop).foreach(u => u());
            return true;
        }
    });
    object = null;
    return p;
};
const htmlNode = (type, props = {}, tags = []) => {
    if (type === "comment")
        return tag(document.createComment("Grafix Magic Here!"), new TagProps({}), []);
    if (props instanceof Array)
        return tag(document.createElement(type), new TagProps({}), props);
    return tag(document.createElement(type), new TagProps(props), tags);
};
const div = (props = {}, tags = []) => htmlNode("div", props, tags);
const input = (props = {}, tags = []) => htmlNode("input", props, tags);
const form = (props = {}, tags = []) => htmlNode("form", props, tags);
const style = (props = {}, tags = []) => htmlNode("style", props, tags);
const comment = (props = {}, tags = []) => htmlNode("comment", props, tags);
const mountTag = (query, elementFunc, data) => {
    const element = elementFunc(data);
    element.onInit();
    document.querySelector(query).appendChild(element.node);
    element.onMount();
    return element;
};
const mix = (items, unique, subscribable) => new Mix(items, unique, subscribable);
const attachUnmount = (tag, unmount) => {
    return tag.unmounts.add(unmount);
};
const loop = (n, func) => {
    if (n instanceof Mix)
        return [[n, func]];
    if (n instanceof Array) {
        const localFunc = (data, index) => func(data, index);
        const tags = [];
        for (let i = 0; i < n.length; i++)
            tags.push(...localFunc(n[i], i));
        return tags;
    }
    const localFunc = (i) => func(i);
    const tags = [];
    for (let i = 0; i < n; i++)
        tags.push(...localFunc(i));
    return tags;
};
const val = (e, u) => Unit.setTimeout(() => u(e.target.value), 0, "u");
const arrange = (props, tags) => {
    if (typeof props === "undefined") {
        props = {};
        tags = [];
    }
    else if (props instanceof Array) {
        tags = props;
        props = {};
    }
    if (typeof tags === "undefined")
        tags = [];
    return [props, tags];
};
const setDefaultStyle = (props, defaultStyle) => {
    const style = props.style;
    props.style = () => defaultStyle + expand(style);
};
const expand = (style) => {
    if (typeof style === "undefined")
        return "";
    if (typeof style === "string")
        return style;
    return style();
};
const fx = o({
    dragging: false,
    dragData: null,
    placeholder: null
});
const tag = (node, props, childTags) => {
    const data = {
        id: Unit.uniqueID(),
        parent: null,
        tags: new Mix(),
        binds: new Mix(),
        bindsCache: {},
        unmounts: new Mix(),
        node,
        props,
        addEvent: (eventName, func) => addEvent(eventName, func),
        onCreate: () => props.onCreate(data),
        onMount: () => props.onMount(data),
        onInit: () => props.onInit(data),
        onUnmount: () => props.onUnmount(data),
        onUnmountAsync: (u) => props.onUnmountAsync(() => u(), data),
        unmount: (u) => unmount(u),
        mount: (tag) => mountTag(tag),
        bind: (type, apply) => bind(type, apply),
        disableBinding: () => disableBinding()
    };
    let originalOnSubmit = null;
    if (props.onCreate)
        props.onCreate(data);
    const setupProps = () => {
        if (!props.onInit)
            props.onInit = () => { };
        if (!props.onMount)
            props.onMount = () => { };
        if (!props.onUnmount)
            props.onUnmount = () => { };
        if (!props.onUnmountAsync)
            props.onUnmountAsync = (u) => u();
    };
    const setupName = () => {
        if (!data.props.name.length)
            data.props.name = Unit.uniqueID();
    };
    const applyNodeValue = (domProp, value) => {
        if (domProp === "style")
            return data.node.style.cssText = value;
        data.node[domProp] = value;
    };
    const setupNodeProp = (type, prop, domProp) => {
        if (data.node instanceof Comment)
            return;
        if (!data.props[prop])
            return;
        if (typeof data.props[prop] === "string" || typeof data.props[prop] === "number")
            return data.node[domProp] = data.props[prop];
        if (data.props[prop] instanceof Function) {
            bind(type, () => applyNodeValue(domProp, data.props[prop]()));
            applyNodeValue(domProp, data.props[prop]());
            disableBinding();
        }
    };
    const enableBinding = (type, func) => {
        bindingChanged = false;
        currentBindType = type;
        currentBindFunc = func;
        currentTag = data;
        bindListen = true;
    };
    const disableBinding = () => {
        bindingChanged = false;
        bindListen = false;
        currentBindType = null;
        currentBindFunc = null;
        currentTag = null;
    };
    const bind = (type, apply) => {
        enableBinding(type, () => bind(type, apply));
        apply();
        disableBinding();
    };
    const setupText = () => setupNodeProp(bindType.text, "text", "innerText");
    const setupValue = () => setupNodeProp(bindType.text, "value", "value");
    const setupStyle = () => setupNodeProp(bindType.styles, "style", "style");
    const setupClasses = () => setupNodeProp(bindType.classes, "classes", "className");
    const setupAttributes = () => {
        if (data.node instanceof Comment)
            return;
        if (!data.props.attributes)
            return;
        const props = [];
        bind(bindType.attributes, () => applyAttributes(props, data.props.attributes));
        const value = data.props.attributes();
        for (const prop in value)
            props.push(prop);
        applyAttributes(props, value);
        disableBinding();
    };
    const applyAttributes = (props, attributes) => {
        for (let i = 0; i < props.length; i++)
            if (attributes[props[i]] === null) {
                if (data.node.hasAttribute(props[i]))
                    data.node.removeAttribute(props[i]);
            }
            else if (data.node.hasAttribute(props[i])) {
                if (data.node.getAttribute(props[i]) !== attributes[props[i]])
                    data.node.setAttribute(props[i], attributes[props[i]]);
            }
            else
                data.node.setAttribute(props[i], attributes[props[i]]);
    };
    const setupEvents = () => {
        if (data.props.onUpdate)
            data.props.onKeyDown = e => val(e, v => data.props.onUpdate(v));
        if (data.props.onClick)
            data.node.addEventListener("click", data.props.onClick, false);
        if (data.props.onChange)
            data.node.addEventListener("change", data.props.onChange, false);
        if (data.props.onFocus)
            data.node.addEventListener("focus", data.props.onFocus, false);
        if (data.props.onBlur)
            data.node.addEventListener("blur", data.props.onBlur, false);
        if (data.props.onDoubleClick)
            data.node.addEventListener("dblclick", data.props.onDoubleClick, false);
        if (data.props.onMouseDown)
            data.node.addEventListener("mousedown", data.props.onMouseDown, false);
        if (data.props.onMouseUp)
            data.node.addEventListener("mouseup", data.props.onMouseUp, false);
        if (data.props.onMouseMove)
            data.node.addEventListener("mousemove", data.props.onMouseMove, false);
        if (data.props.onMouseEnter)
            data.node.addEventListener("mouseenter", data.props.onMouseEnter, false);
        if (data.props.onMouseLeave)
            data.node.addEventListener("mouseleave", data.props.onMouseLeave, false);
        if (data.props.onMouseOver)
            data.node.addEventListener("mouseover", data.props.onMouseOver, false);
        if (data.props.onMouseOut)
            data.node.addEventListener("mouseout", data.props.onMouseOut, false);
        if (data.props.onRightClick)
            data.node.addEventListener("contextmenu", data.props.onRightClick, false);
        if (data.props.onKeyUp)
            data.node.addEventListener("keyup", data.props.onKeyUp, false);
        if (data.props.onKeyDown)
            data.node.addEventListener("keydown", data.props.onKeyDown, false);
        if (data.props.onScroll)
            data.node.addEventListener("scroll", data.props.onScroll, false);
        if (data.props.onMouseWheel)
            data.node.addEventListener("mousewheel", data.props.onMouseWheel, false);
        if (data.props.onSubmit) {
            originalOnSubmit = data.props.onSubmit;
            data.props.onSubmit = (ev) => {
                originalOnSubmit(ev);
                ev.preventDefault();
            };
            data.node.addEventListener("submit", data.props.onSubmit, false);
        }
        if (data.props.onResize)
            data.node.addEventListener("resize", data.props.onResize, false);
    };
    const cleanEvents = () => {
        if (data.props.onClick)
            data.node.removeEventListener("click", data.props.onClick, false);
        if (data.props.onChange)
            data.node.removeEventListener("change", data.props.onChange, false);
        if (data.props.onFocus)
            data.node.removeEventListener("focus", data.props.onFocus, false);
        if (data.props.onBlur)
            data.node.removeEventListener("blur", data.props.onBlur, false);
        if (data.props.onDoubleClick)
            data.node.removeEventListener("dblclick", data.props.onDoubleClick, false);
        if (data.props.onMouseDown)
            data.node.removeEventListener("mousedown", data.props.onMouseDown, false);
        if (data.props.onMouseUp)
            data.node.removeEventListener("mouseup", data.props.onMouseUp, false);
        if (data.props.onMouseMove)
            data.node.removeEventListener("mousemove", data.props.onMouseMove, false);
        if (data.props.onMouseEnter)
            data.node.removeEventListener("mouseenter", data.props.onMouseEnter, false);
        if (data.props.onMouseLeave)
            data.node.removeEventListener("mouseleave", data.props.onMouseLeave, false);
        if (data.props.onMouseOver)
            data.node.removeEventListener("mouseover", data.props.onMouseOver, false);
        if (data.props.onMouseOut)
            data.node.removeEventListener("mouseout", data.props.onMouseOut, false);
        if (data.props.onRightClick)
            data.node.removeEventListener("contextmenu", data.props.onRightClick, false);
        if (data.props.onKeyUp)
            data.node.removeEventListener("keyup", data.props.onKeyUp, false);
        if (data.props.onKeyDown)
            data.node.removeEventListener("keydown", data.props.onKeyDown, false);
        if (data.props.onScroll)
            data.node.removeEventListener("scroll", data.props.onScroll, false);
        if (data.props.onMouseWheel)
            data.node.removeEventListener("mousewheel", data.props.onMouseWheel, false);
        if (data.props.onSubmit)
            data.node.removeEventListener("submit", data.props.onSubmit, false);
        if (data.props.onResize)
            data.node.removeEventListener("resize", data.props.onResize, false);
        if (originalOnSubmit)
            originalOnSubmit = null;
    };
    const addEvent = (eventName, func) => {
        data.node.addEventListener("mousedown", func, false);
        data.unmounts.add(() => data.node.removeEventListener("mousedown", func, false));
    };
    const cleanSubscriptions = () => {
        data.binds.foreach(obj => obj.foreach((prop, propName) => prop.foreach(binding => binding.objBinds.get(propName).delete(binding.id))));
    };
    const mountTags = (tags) => {
        for (let i = 0; i < tags.length; i++) {
            const tag = mountTag(tags[i]);
            data.tags.set(tag.id, tag);
        }
    };
    const mountTag = (rawTag) => {
        let tag = null;
        if (rawTag instanceof Array)
            tag = tagList({
                ref: rawTag[1],
                mix: rawTag[0]
            });
        else if (rawTag instanceof Function)
            tag = router(rawTag);
        else {
            tag = rawTag;
            if (tag.node instanceof HTMLFormElement &&
                data.node instanceof HTMLElement) {
                const submit = document.createElement("input");
                submit.type = "submit";
                submit.style.display = "none";
                tag.node.appendChild(submit);
                data.node.appendChild(tag.node);
            }
        }
        tag.parent = data;
        tag.onInit();
        if (data.node instanceof Comment)
            data.node.parentNode.insertBefore(tag.node, data.node);
        else
            data.node.appendChild(tag.node);
        tag.onMount();
        return tag;
    };
    const unmount = (u) => {
        data.onUnmountAsync(() => {
            data.onUnmount();
            data.unmounts.foreach(u => u());
            if (data.tags.size)
                data.tags.foreach(t => t.unmount(() => {
                    if (!data.tags.size)
                        continueUnmount(u);
                }));
            else
                continueUnmount(u);
        });
    };
    const continueUnmount = (u) => {
        cleanEvents();
        cleanSubscriptions();
        unmountFromParent();
        if (u)
            u();
    };
    const unmountFromParent = () => {
        data.node.parentNode.removeChild(data.node);
        if (data.parent)
            data.parent.tags.delete(data.id);
    };
    setupProps();
    setupName();
    setupText();
    setupValue();
    setupStyle();
    setupClasses();
    setupAttributes();
    setupEvents();
    mountTags(childTags);
    return data;
};
const tagList = (props) => {
    const tag = comment();
    const onAddID = Unit.uniqueID();
    const onSortID = Unit.uniqueID();
    const onRemoveID = Unit.uniqueID();
    const add = (data, id) => {
        const element = props.ref(data, id)[0];
        element.props.name = id;
        element.id = id;
        tag.mount(element);
        tag.tags.set(id, element);
    };
    const getNode = (id) => tag.tags.get(id).node;
    const isUnderSameParent = (id) => {
        const node = getNode(id);
        let same = true;
        tag.tags.foreach((tag, tagID) => {
            if (tagID === id)
                return;
            if (tag.node.parentNode !== node.parentNode) {
                same = false;
                return false;
            }
        });
        return same;
    };
    const sort = (id1, id2) => {
        if (!id2) {
            if (fx.placeholder)
                if (!isUnderSameParent(id1))
                    return fx.placeholder.parentNode.appendChild(fx.placeholder);
            return getNode(id1).parentNode.appendChild(getNode(id1));
        }
        else {
            if (fx.placeholder)
                if (fx.placeholder.parentNode === getNode(id1).parentNode ||
                    fx.placeholder.parentNode === getNode(id2).parentNode)
                    if (fx.placeholder.parentNode === getNode(id1).parentNode) {
                        const node = getNode(id1);
                        if (node.nextSibling)
                            return fx.placeholder.parentNode.insertBefore(fx.placeholder, node.nextSibling);
                        else
                            return fx.placeholder.parentNode.appendChild(fx.placeholder);
                    }
                    else if (fx.placeholder.parentNode === getNode(id2).parentNode)
                        return getNode(id2).parentNode.insertBefore(fx.placeholder, getNode(id2));
            getNode(id1).parentNode.insertBefore(getNode(id1), getNode(id2));
        }
    };
    const remove = (id) => tag.tags.get(id).unmount();
    tag.onInit = () => {
        props.mix.onAdd((item, id) => add(item, id), onAddID);
        props.mix.onSort((item1, item2, id1, id2) => sort(id1, id2), onSortID);
        props.mix.onRemove((item, id) => remove(id), onRemoveID);
    };
    tag.onMount = () => props.mix.foreach((data, id) => add(data, id));
    tag.onUnmount = () => {
        props.mix.removeOnAdd(onAddID);
        props.mix.removeOnSort(onSortID);
        props.mix.removeOnRemove(onRemoveID);
    };
    return tag;
};
const router = (props) => {
    const tag = comment();
    let unmounting = false;
    const bind = () => {
        if (unmounting)
            return;
        let t = props();
        if (t instanceof Array)
            t = t[0];
        if (tag.tags.has("selection"))
            tag.tags.get("selection").unmount();
        if (!t)
            return;
        t = tag.mount(t);
        t.id = "selection";
        t.props.name = "selection";
        tag.tags.set(t.id, t);
    };
    tag.onMount = () => {
        tag.bind(bindType.router, () => bind());
        bind();
        tag.disableBinding();
    };
    return tag;
};
class Pos {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}
const move = (props, tags) => {
    if (props instanceof Function) {
        tags = props;
        props = {
            pos: o(Pos)
        };
    }
    const localProps = props;
    const start = {
        x: 0,
        y: 0
    };
    const onDown = (ev) => {
        if (localProps.onDown)
            localProps.onDown(ev);
        start.x = ev.pageX - localProps.pos.x;
        start.y = ev.pageY - localProps.pos.y;
        window.onmousemove = onMove;
        window.onmouseup = onUp;
    };
    const onMove = (ev) => {
        localProps.pos.x = ev.pageX - start.x;
        localProps.pos.y = ev.pageY - start.y;
        if (localProps.onMove)
            localProps.onMove(ev);
    };
    const onUp = (ev) => {
        window.onmousemove = null;
        window.onmouseup = null;
        if (localProps.onUp)
            localProps.onUp(ev);
    };
    const tag = tags({
        translate: () => "translate3d(" + localProps.pos.x + "px, " + localProps.pos.y + "px, 0)",
        transform: () => `
            transform: translate3d(${localProps.pos.x}px, ${localProps.pos.y}px, 0);
        `,
        tag: (p, tags) => {
            const style = () => `
                transform: translate3d(${localProps.pos.x}px, ${localProps.pos.y}px, 0);
            `;
            if (p instanceof Array) {
                tags = p;
                p = new TagProps({ style });
            }
            else if (p)
                if (p.style) {
                    const oldStyle = p.style instanceof Function ? p.style() : p.style;
                    p.style = () => `
                        transform: translate3d(${localProps.pos.x}px, ${localProps.pos.y}px, 0);
                        ${oldStyle}
                    `;
                }
                else
                    p.style = style;
            if (!localProps)
                p = new TagProps({ style });
            return div(p, tags);
        }
    })[0];
    const target = props.target ? props.target() : tag;
    target.node.addEventListener("mousedown", onDown, false);
    target.unmounts.add(() => target.node.removeEventListener("mousedown", onDown, false));
    return tag;
};
class Size {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}
const resize = (props, tags) => {
    const start = {
        x: 0,
        y: 0,
        posX: 0,
        posY: 0
    };
    const pos = {
        top: o(Pos),
        bottom: o(Pos),
        left: o(Pos),
        right: o(Pos),
    };
    return tags({
        width: () => "width: " + props.size.x + "px;",
        height: () => "height: " + props.size.y + "px;",
        translate: () => "translate3d(" + props.pos.x + "px, " + props.pos.y + "px, 0)",
        style: () => `
            width: ${props.size.x}px;
            height: ${props.size.y}px;
            transform: translate3d(${props.pos.x}px, ${props.pos.y}px, 0);
        `,
        resizers: () => [
            move({ pos: pos.top, onDown: () => {
                    pos.top.y = 0;
                    start.x = props.size.x;
                    start.y = props.size.y;
                    if (props.pos) {
                        start.posX = props.pos.x;
                        start.posY = props.pos.y;
                    }
                }, onMove: () => {
                    props.size.y = start.y - pos.top.y;
                    if (props.pos)
                        props.pos.y = start.posY + pos.top.y;
                } }, () => [
                div({ classes: "ResizerTop Resizer" })
            ]),
            move({ pos: pos.bottom, onDown: () => {
                    pos.bottom.y = 0;
                    start.x = props.size.x;
                    start.y = props.size.y;
                    if (props.pos) {
                        start.posX = props.pos.x;
                        start.posY = props.pos.y;
                    }
                }, onMove: () => {
                    props.size.y = start.y + pos.bottom.y;
                } }, () => [
                div({ classes: "ResizerBottom Resizer" })
            ]),
            move({ pos: pos.left, onDown: () => {
                    pos.left.x = 0;
                    start.x = props.size.x;
                    start.y = props.size.y;
                    if (props.pos) {
                        start.posX = props.pos.x;
                        start.posY = props.pos.y;
                    }
                }, onMove: () => {
                    props.size.x = start.x - pos.left.x;
                    if (props.pos)
                        props.pos.x = start.posX + pos.left.x;
                } }, () => [
                div({ classes: "ResizerLeft Resizer" })
            ]),
            move({ pos: pos.right, onDown: () => {
                    pos.right.x = 0;
                    start.x = props.size.x;
                    start.y = props.size.y;
                    if (props.pos) {
                        start.posX = props.pos.x;
                        start.posY = props.pos.y;
                    }
                }, onMove: () => {
                    props.size.x = start.x + pos.right.x;
                } }, () => [
                div({ classes: "ResizerRight Resizer" })
            ])
        ]
    })[0];
};
const drag = (props, tags) => {
    if (props instanceof Function) {
        tags = props;
        props = {};
    }
    const pos = o(Pos);
    let node = null;
    let placeholder = null;
    let position = null;
    let top = null;
    let left = null;
    let style = o({
        value: ""
    });
    const onDown = (ev) => {
        node = tag.node;
        if (!node)
            return;
        const rect = node.getBoundingClientRect();
        const css = window.getComputedStyle(node);
        placeholder = document.createElement("div");
        fx.placeholder = placeholder;
        placeholder.style.width = rect.width + "px";
        placeholder.style.height = rect.height + "px";
        if (css.float || node.style.float)
            placeholder.style.float = (css.float || node.style.float);
        node.parentNode.insertBefore(placeholder, node);
        style.value = `
            position: absolute;
            left: ${rect.left + +document.body.scrollLeft}px;
            top: ${rect.top + document.body.scrollTop}px;
            pointer-events: none;
        `;
        document.body.append(node);
        fx.dragging = true;
        if (!(props instanceof Function))
            if (props.onData)
                fx.dragData = props.onData();
    };
    const onUp = () => {
        fx.dragging = false;
        placeholder.replaceWith(node);
        style.value = ``;
        node = null;
        fx.placeholder = null;
        placeholder = null;
        pos.x = 0;
        pos.y = 0;
        if (fx.dragData)
            fx.dragData = null;
    };
    const tag = move({ pos, onDown, onUp, target: props.target }, ({ transform: moveStyle, tag, translate }) => tags({
        style: () => moveStyle() + style.value,
        tag,
        translate,
        dragStyle: () => style.value,
        moveStyle
    }));
    return tag;
};
const drop = (props, tag) => {
    if (props instanceof Function) {
        tag = props;
        props = {};
    }
    const mouseEnter = (ev) => {
        if (!fx.dragging)
            return;
        if (props instanceof Function)
            return;
        if (props.onEnter)
            props.onEnter(props.onData ? props.onData() : null);
    };
    const mouseUp = () => {
        if (!fx.dragging)
            return;
        if (props instanceof Function)
            return;
        if (props.onDrop)
            props.onDrop(fx.dragData);
    };
    const t = tag({})[0];
    const node = t.node;
    node.addEventListener("mouseenter", mouseEnter, false);
    node.addEventListener("mouseup", mouseUp, false);
    attachUnmount(t, () => node.removeEventListener("mouseenter", mouseEnter, false));
    attachUnmount(t, () => node.removeEventListener("mouseup", mouseUp, false));
    return t;
};
const sort = (props, tag) => {
    if (props instanceof Function) {
        tag = props;
        props = {};
    }
    const p = props;
    const onEnter = (data) => {
        if (!(fx.placeholder instanceof HTMLDivElement))
            return;
        const node = t.node;
        if (node.parentNode !== fx.placeholder.parentNode)
            return;
        const after = (node.compareDocumentPosition(fx.placeholder) & 0x02) !== 0;
        if (p.mix) {
            const hoveredTag = t;
            const draggingTag = fx.dragData;
            if (!p.mix.has(hoveredTag.props.name) ||
                !p.mix.has(draggingTag.props.name))
                return;
            if (after)
                if (hoveredTag.props.name === p.mix.lastID())
                    p.mix.sort(draggingTag.props.name, null);
                else
                    p.mix.sort(draggingTag.props.name, p.mix.getNode(hoveredTag.props.name).next.id);
            else
                p.mix.sort(draggingTag.props.name, hoveredTag.props.name);
        }
        else if (after) {
            if (node.nextSibling)
                fx.placeholder.parentNode.insertBefore(fx.placeholder, node.nextSibling);
            else
                fx.placeholder.parentNode.appendChild(fx.placeholder);
        }
        else
            fx.placeholder.parentNode.insertBefore(fx.placeholder, node);
        if (p.onSort)
            p.onSort(fx.dragData, t, after);
    };
    let t = null;
    return drag({ onStart: () => p.onStart(fx.dragData, t), onData: () => t, target: p.target }, (dragProps) => [
        drop({ onEnter, onData: () => t }, (dropProps) => [
            t = tag({
                translate: dragProps.translate,
                tag: dragProps.tag,
                style: dragProps.style,
                moveStyle: dragProps.moveStyle,
                dragStyle: dragProps.style
            })[0]
        ])
    ]);
};
//# sourceMappingURL=grafix.js.map