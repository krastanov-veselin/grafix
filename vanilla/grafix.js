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
            this.sort(id, this.firstID());
        return this;
    }
    preAssoc(id, item) {
        this.set(id, item);
        if (this.size !== 1)
            this.sort(id, this.firstID());
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
    shift() {
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
        // Attributes
        this.name = typeof data.name === "undefined" ? "" : data.name;
        this.text = typeof data.text === "undefined" ? "" : data.text;
        this.style = typeof data.style === "undefined" ? "" : data.style;
        this.classes = typeof data.classes === "undefined" ? "" : data.classes;
        this.attributes = typeof data.attributes === "undefined" ? null : data.attributes;
        this.type = typeof data.type === "undefined" ? "" : data.type;
        this.value = typeof data.value === "undefined" ? "" : data.value;
        this.placeholder = typeof data.placeholder === "undefined" ? "" : data.placeholder;
        // LifeCycle Events
        this.onCreate = typeof data.onCreate === "undefined" ? null : data.onCreate;
        this.onInit = typeof data.onInit === "undefined" ? null : data.onInit;
        this.onMount = typeof data.onMount === "undefined" ? null : data.onMount;
        this.onUnmount = typeof data.onUnmount === "undefined" ? null : data.onUnmount;
        this.onUnmountAsync = typeof data.onUnmountAsync === "undefined" ? null : data.onUnmountAsync;
        // DOM Events
        this.onAbort = typeof data.onAbort === "undefined" ? null : data.onAbort;
        this.onAfterPrint = typeof data.onAfterPrint === "undefined" ? null : data.onAfterPrint;
        this.onAnimationEnd = typeof data.onAnimationEnd === "undefined" ? null : data.onAnimationEnd;
        this.onAnimationIteration = typeof data.onAnimationIteration === "undefined" ? null : data.onAnimationIteration;
        this.onAnimationStart = typeof data.onAnimationStart === "undefined" ? null : data.onAnimationStart;
        this.onBeforePrint = typeof data.onBeforePrint === "undefined" ? null : data.onBeforePrint;
        this.onBlur = typeof data.onBlur === "undefined" ? null : data.onBlur;
        this.onCanPlay = typeof data.onCanPlay === "undefined" ? null : data.onCanPlay;
        this.onCanPlayThough = typeof data.onCanPlayThough === "undefined" ? null : data.onCanPlayThough;
        this.onChange = typeof data.onChange === "undefined" ? null : data.onChange;
        this.onClick = typeof data.onClick === "undefined" ? null : data.onClick;
        this.onContextMenu = typeof data.onContextMenu === "undefined" ? null : data.onContextMenu;
        this.onCopy = typeof data.onCopy === "undefined" ? null : data.onCopy;
        this.onCut = typeof data.onCut === "undefined" ? null : data.onCut;
        this.onDoubleClick = typeof data.onDoubleClick === "undefined" ? null : data.onDoubleClick;
        this.onDrag = typeof data.onDrag === "undefined" ? null : data.onDrag;
        this.onDragEnd = typeof data.onDragEnd === "undefined" ? null : data.onDragEnd;
        this.onDragEnter = typeof data.onDragEnter === "undefined" ? null : data.onDragEnter;
        this.onDragLeave = typeof data.onDragLeave === "undefined" ? null : data.onDragLeave;
        this.onDragOver = typeof data.onDragOver === "undefined" ? null : data.onDragOver;
        this.onDragStart = typeof data.onDragStart === "undefined" ? null : data.onDragStart;
        this.onDrop = typeof data.onDrop === "undefined" ? null : data.onDrop;
        this.onDurationChange = typeof data.onDurationChange === "undefined" ? null : data.onDurationChange;
        this.onEnded = typeof data.onEnded === "undefined" ? null : data.onEnded;
        this.onError = typeof data.onError === "undefined" ? null : data.onError;
        this.onFocus = typeof data.onFocus === "undefined" ? null : data.onFocus;
        this.onFocusIn = typeof data.onFocusIn === "undefined" ? null : data.onFocusIn;
        this.onFocusOut = typeof data.onFocusOut === "undefined" ? null : data.onFocusOut;
        this.onFullScreenChange = typeof data.onFullScreenChange === "undefined" ? null : data.onFullScreenChange;
        this.onFullScreenError = typeof data.onFullScreenError === "undefined" ? null : data.onFullScreenError;
        this.onHashChange = typeof data.onHashChange === "undefined" ? null : data.onHashChange;
        this.onInput = typeof data.onInput === "undefined" ? null : data.onInput;
        this.onInvalid = typeof data.onInvalid === "undefined" ? null : data.onInvalid;
        this.onKeyDown = typeof data.onKeyDown === "undefined" ? null : data.onKeyDown;
        this.onKeyPress = typeof data.onKeyPress === "undefined" ? null : data.onKeyPress;
        this.onKeyUp = typeof data.onKeyUp === "undefined" ? null : data.onKeyUp;
        this.onLoad = typeof data.onLoad === "undefined" ? null : data.onLoad;
        this.onLoadedData = typeof data.onLoadedData === "undefined" ? null : data.onLoadedData;
        this.onLoadedMetaData = typeof data.onLoadedMetaData === "undefined" ? null : data.onLoadedMetaData;
        this.onLoadStart = typeof data.onLoadStart === "undefined" ? null : data.onLoadStart;
        this.onMessage = typeof data.onMessage === "undefined" ? null : data.onMessage;
        this.onMouseDown = typeof data.onMouseDown === "undefined" ? null : data.onMouseDown;
        this.onMouseEnter = typeof data.onMouseEnter === "undefined" ? null : data.onMouseEnter;
        this.onMouseLeave = typeof data.onMouseLeave === "undefined" ? null : data.onMouseLeave;
        this.onMouseMove = typeof data.onMouseMove === "undefined" ? null : data.onMouseMove;
        this.onMouseOver = typeof data.onMouseOver === "undefined" ? null : data.onMouseOver;
        this.onMouseOut = typeof data.onMouseOut === "undefined" ? null : data.onMouseOut;
        this.onMouseUp = typeof data.onMouseUp === "undefined" ? null : data.onMouseUp;
        this.onMouseWheel = typeof data.onMouseWheel === "undefined" ? null : data.onMouseWheel;
        this.onOffline = typeof data.onOffline === "undefined" ? null : data.onOffline;
        this.onOnline = typeof data.onOnline === "undefined" ? null : data.onOnline;
        this.onOpen = typeof data.onOpen === "undefined" ? null : data.onOpen;
        this.onPageHide = typeof data.onPageHide === "undefined" ? null : data.onPageHide;
        this.onPageShow = typeof data.onPageShow === "undefined" ? null : data.onPageShow;
        this.onPaste = typeof data.onPaste === "undefined" ? null : data.onPaste;
        this.onPause = typeof data.onPause === "undefined" ? null : data.onPause;
        this.onPlay = typeof data.onPlay === "undefined" ? null : data.onPlay;
        this.onPlaying = typeof data.onPlaying === "undefined" ? null : data.onPlaying;
        this.onPopState = typeof data.onPopState === "undefined" ? null : data.onPopState;
        this.onProgress = typeof data.onProgress === "undefined" ? null : data.onProgress;
        this.onRateChange = typeof data.onRateChange === "undefined" ? null : data.onRateChange;
        this.onResize = typeof data.onResize === "undefined" ? null : data.onResize;
        this.onReset = typeof data.onReset === "undefined" ? null : data.onReset;
        this.onScroll = typeof data.onScroll === "undefined" ? null : data.onScroll;
        this.onSearch = typeof data.onSearch === "undefined" ? null : data.onSearch;
        this.onSeeked = typeof data.onSeeked === "undefined" ? null : data.onSeeked;
        this.onSeeking = typeof data.onSeeking === "undefined" ? null : data.onSeeking;
        this.onSelect = typeof data.onSelect === "undefined" ? null : data.onSelect;
        this.onShow = typeof data.onShow === "undefined" ? null : data.onShow;
        this.onStalled = typeof data.onStalled === "undefined" ? null : data.onStalled;
        this.onStorage = typeof data.onStorage === "undefined" ? null : data.onStorage;
        this.onSubmit = typeof data.onSubmit === "undefined" ? null : data.onSubmit;
        this.onSuspend = typeof data.onSuspend === "undefined" ? null : data.onSuspend;
        this.onTimeUpdate = typeof data.onTimeUpdate === "undefined" ? null : data.onTimeUpdate;
        this.onToggle = typeof data.onToggle === "undefined" ? null : data.onToggle;
        this.onTouchCancel = typeof data.onTouchCancel === "undefined" ? null : data.onTouchCancel;
        this.onTouchEnd = typeof data.onTouchEnd === "undefined" ? null : data.onTouchEnd;
        this.onTouchMove = typeof data.onTouchMove === "undefined" ? null : data.onTouchMove;
        this.onTouchStart = typeof data.onTouchStart === "undefined" ? null : data.onTouchStart;
        this.onTransitionEnd = typeof data.onTransitionEnd === "undefined" ? null : data.onTransitionEnd;
        this.onUnload = typeof data.onUnload === "undefined" ? null : data.onUnload;
        this.onVolumeChange = typeof data.onVolumeChange === "undefined" ? null : data.onVolumeChange;
        this.onWaiting = typeof data.onWaiting === "undefined" ? null : data.onWaiting;
        this.onWheel = typeof data.onWheel === "undefined" ? null : data.onWheel;
        // Custom Events
        this.onUpdate = typeof data.onUpdate === "undefined" ? null : data.onUpdate;
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
    bindType["css"] = "css";
})(bindType || (bindType = {}));
let bindListen = false;
let currentTag = null;
let currentBindType = bindType.text;
let currentBindFunc = null;
let bindingChanged = false;
const enableBinding = (type, data, func) => {
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
const bind = (type, data, apply) => {
    enableBinding(type, data, () => bind(type, data, apply));
    apply();
    disableBinding();
};
const cleanSubscriptions = (data) => {
    data.binds.foreach(obj => obj.foreach((prop, propName) => prop.foreach(binding => binding.objBinds.get(propName).delete(binding.id))));
};
/**
 * @function
 * @template A
 * @returns {A}
 * */
const o = (/** @type {(new() => A)|A} */ ref, /** @type {A} */ d, refreshable = false) => {
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
        binds.get(prop).preAssoc(bindID, currentBindFunc);
        bindingChanged = true;
    };
    const p = new Proxy(object, {
        get: (obj, prop) => {
            if (bindListen)
                reg(prop);
            return obj[prop];
        },
        set: (obj, prop, val) => {
            if (obj[prop] === val && refreshable === false)
                return true;
            obj[prop] = val;
            if (binds.has(prop))
                binds.get(prop).foreach(u => u());
            return true;
        }
    });
    object = null;
    return p;
};
const comment = (props = {}, tags = []) => node("comment", props, tags);
const a = (props = {}, tags = []) => node("a", props, tags);
const abbr = (props = {}, tags = []) => node("abbr", props, tags);
const acronym = (props = {}, tags = []) => node("acronym", props, tags);
const address = (props = {}, tags = []) => node("address", props, tags);
const applet = (props = {}, tags = []) => node("applet", props, tags);
const area = (props = {}, tags = []) => node("area", props, tags);
const article = (props = {}, tags = []) => node("article", props, tags);
const aside = (props = {}, tags = []) => node("aside", props, tags);
const audio = (props = {}, tags = []) => node("audio", props, tags);
const b = (props = {}, tags = []) => node("b", props, tags);
const base = (props = {}, tags = []) => node("base", props, tags);
const basefont = (props = {}, tags = []) => node("basefont", props, tags);
const bdi = (props = {}, tags = []) => node("bdi", props, tags);
const bdo = (props = {}, tags = []) => node("bdo", props, tags);
const big = (props = {}, tags = []) => node("big", props, tags);
const blockquote = (props = {}, tags = []) => node("blockquote", props, tags);
const body = (props = {}, tags = []) => node("body", props, tags);
const br = (props = {}, tags = []) => node("br", props, tags);
const button = (props = {}, tags = []) => node("button", props, tags);
const canvas = (props = {}, tags = []) => node("canvas", props, tags);
const cite = (props = {}, tags = []) => node("cite", props, tags);
const code = (props = {}, tags = []) => node("code", props, tags);
const col = (props = {}, tags = []) => node("col", props, tags);
const colgroup = (props = {}, tags = []) => node("colgroup", props, tags);
const data = (props = {}, tags = []) => node("data", props, tags);
const datalist = (props = {}, tags = []) => node("datalist", props, tags);
const dd = (props = {}, tags = []) => node("dd", props, tags);
const del = (props = {}, tags = []) => node("del", props, tags);
const details = (props = {}, tags = []) => node("details", props, tags);
const dfn = (props = {}, tags = []) => node("dfn", props, tags);
const dialog = (props = {}, tags = []) => node("dialog", props, tags);
const dir = (props = {}, tags = []) => node("dir", props, tags);
const div = (props = {}, tags = []) => node("div", props, tags);
const dl = (props = {}, tags = []) => node("dl", props, tags);
const dt = (props = {}, tags = []) => node("dt", props, tags);
const doc = (props = {}, tags = []) => node("document", props, tags);
const em = (props = {}, tags = []) => node("em", props, tags);
const embed = (props = {}, tags = []) => node("embed", props, tags);
const fieldset = (props = {}, tags = []) => node("fieldset", props, tags);
const figcaption = (props = {}, tags = []) => node("figcaption", props, tags);
const figure = (props = {}, tags = []) => node("figure", props, tags);
const font = (props = {}, tags = []) => node("font", props, tags);
const footer = (props = {}, tags = []) => node("footer", props, tags);
const form = (props = {}, tags = []) => node("form", props, tags);
const frame = (props = {}, tags = []) => node("frame", props, tags);
const frameset = (props = {}, tags = []) => node("frameset", props, tags);
const h1 = (props = {}, tags = []) => node("h1", props, tags);
const h2 = (props = {}, tags = []) => node("h2", props, tags);
const h3 = (props = {}, tags = []) => node("h3", props, tags);
const h4 = (props = {}, tags = []) => node("h4", props, tags);
const h5 = (props = {}, tags = []) => node("h5", props, tags);
const h6 = (props = {}, tags = []) => node("h6", props, tags);
const head = (props = {}, tags = []) => node("head", props, tags);
const header = (props = {}, tags = []) => node("header", props, tags);
const hr = (props = {}, tags = []) => node("hr", props, tags);
const html = (props = {}, tags = []) => node("html", props, tags);
const i = (props = {}, tags = []) => node("i", props, tags);
const iframe = (props = {}, tags = []) => node("iframe", props, tags);
const img = (props = {}, tags = []) => node("img", props, tags);
const input = (props = {}, tags = []) => node("input", props, tags);
const ins = (props = {}, tags = []) => node("ins", props, tags);
const kbd = (props = {}, tags = []) => node("kbd", props, tags);
const label = (props = {}, tags = []) => node("label", props, tags);
const legend = (props = {}, tags = []) => node("legend", props, tags);
const li = (props = {}, tags = []) => node("li", props, tags);
const link = (props = {}, tags = []) => node("link", props, tags);
const main = (props = {}, tags = []) => node("main", props, tags);
const map = (props = {}, tags = []) => node("map", props, tags);
const mark = (props = {}, tags = []) => node("mark", props, tags);
const meta = (props = {}, tags = []) => node("meta", props, tags);
const meter = (props = {}, tags = []) => node("meter", props, tags);
const nav = (props = {}, tags = []) => node("nav", props, tags);
const noframes = (props = {}, tags = []) => node("noframes", props, tags);
const noscript = (props = {}, tags = []) => node("noscript", props, tags);
const object = (props = {}, tags = []) => node("object", props, tags);
const ol = (props = {}, tags = []) => node("ol", props, tags);
const optgroup = (props = {}, tags = []) => node("optgroup", props, tags);
const option = (props = {}, tags = []) => node("option", props, tags);
const p = (props = {}, tags = []) => node("p", props, tags);
const param = (props = {}, tags = []) => node("param", props, tags);
const picture = (props = {}, tags = []) => node("picture", props, tags);
const pre = (props = {}, tags = []) => node("pre", props, tags);
const progress = (props = {}, tags = []) => node("progress", props, tags);
const q = (props = {}, tags = []) => node("q", props, tags);
const rp = (props = {}, tags = []) => node("rp", props, tags);
const rt = (props = {}, tags = []) => node("rt", props, tags);
const ruby = (props = {}, tags = []) => node("ruby", props, tags);
const s = (props = {}, tags = []) => node("s", props, tags);
const samp = (props = {}, tags = []) => node("samp", props, tags);
const script = (props = {}, tags = []) => node("script", props, tags);
const section = (props = {}, tags = []) => node("section", props, tags);
const select = (props = {}, tags = []) => node("select", props, tags);
const small = (props = {}, tags = []) => node("small", props, tags);
const source = (props = {}, tags = []) => node("source", props, tags);
const span = (props = {}, tags = []) => node("span", props, tags);
const strike = (props = {}, tags = []) => node("strike", props, tags);
const strong = (props = {}, tags = []) => node("strong", props, tags);
const style = (props = {}, tags = []) => node("style", props, tags);
const sub = (props = {}, tags = []) => node("sub", props, tags);
const svg = (props = {}, tags = []) => node("svg", props, tags);
const table = (props = {}, tags = []) => node("table", props, tags);
const tbody = (props = {}, tags = []) => node("tbody", props, tags);
const td = (props = {}, tags = []) => node("td", props, tags);
const template = (props = {}, tags = []) => node("template", props, tags);
const textarea = (props = {}, tags = []) => node("textarea", props, tags);
const tfoot = (props = {}, tags = []) => node("tfoot", props, tags);
const th = (props = {}, tags = []) => node("th", props, tags);
const thead = (props = {}, tags = []) => node("thead", props, tags);
const time = (props = {}, tags = []) => node("time", props, tags);
const title = (props = {}, tags = []) => node("title", props, tags);
const tr = (props = {}, tags = []) => node("tr", props, tags);
const track = (props = {}, tags = []) => node("track", props, tags);
const tt = (props = {}, tags = []) => node("tt", props, tags);
const u = (props = {}, tags = []) => node("ul", props, tags);
const ul = (props = {}, tags = []) => node("ul", props, tags);
const htmlVar = (props = {}, tags = []) => node("var", props, tags);
const video = (props = {}, tags = []) => node("video", props, tags);
class Pos {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}
class Size {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}
const node = (type, props = {}, tags = []) => {
    if (type === "document")
        return tag(document.implementation.createDocument("doc", "doc", document.implementation.createDocumentType("doc", "doc", Unit.uniqueID())), new TagProps({}), []);
    if (type === "comment")
        return tag(document.createComment("Grafix Magic Here!"), new TagProps(props), []);
    if (props instanceof Array)
        return tag(document.createElement(type), new TagProps({}), props);
    return tag(document.createElement(type), new TagProps(props), tags);
};
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
const forward = (tags) => tags[0];
const filter = (feed, tag) => {
    if (feed.target)
        return feed.target();
    else
        return tag;
};
const prepare = (props, prop) => {
    let defaultValue = null;
    if (prop === "text")
        defaultValue = "";
    else if (prop === "classes")
        defaultValue = "";
    else if (prop === "style")
        defaultValue = "";
    else if (prop === "placeholder")
        defaultValue = "";
    else if (prop === "type")
        defaultValue = "";
    else if (prop === "value")
        defaultValue = "";
    if (!props[prop])
        props[prop] = defaultValue;
};
const allow = (condition, tags) => () => condition() ? tags() : null;
const fx = o({
    dragging: false,
    dragData: null,
    placeholder: null
});
const tag = (node, props, childTags) => {
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
    setupProps();
    const data = {
        id: Unit.uniqueID(),
        name: () => props.name,
        parent: null,
        tags: new Mix(),
        bindsCache: {},
        binds: new Mix(),
        unmounts: new Mix(),
        node,
        props,
        mounted: false,
        addEvent: (eventName, func) => addEvent(eventName, func),
        onCreate: () => props.onCreate(data),
        onMount: () => props.onMount(data),
        onInit: () => props.onInit(data),
        onUnmount: () => props.onUnmount(data),
        onUnmountAsync: (u) => props.onUnmountAsync(() => u(), data),
        unmount: (u, direct = false) => unmount(u, direct),
        mount: (tag, id) => mountTag(tag, id),
        bind: (type, apply) => bind(type, data, apply),
        disableBinding: () => disableBinding()
    };
    let originalOnSubmit = null;
    if (props.onCreate)
        props.onCreate(data);
    const setupName = () => {
        if (!data.props.name.length)
            data.props.name = Unit.uniqueID();
    };
    const applyNodeValue = (domProp, value) => {
        if (domProp === "innerText") {
            if (data.node.innerText === value)
                return;
            return data.node.innerText = value;
        }
        if (domProp === "value") {
            if (data.node.value === value)
                return;
            return data.node.value = value;
        }
        if (domProp === "placeholder") {
            if (data.node.placeholder === value)
                return;
            return data.node.placeholder = value;
        }
        if (domProp === "style") {
            if (data.node.style.cssText === value)
                return;
            return data.node.style.cssText = value;
        }
        if (domProp === "className") {
            const val = value.replace(/\s\s+/g, ' ').trim();
            if (val === data.node.className)
                return;
            return data.node.className = value.replace(/\s\s+/g, ' ').trim();
        }
        data.node[domProp] = value;
    };
    const setupNodeProp = (type, prop, domProp) => {
        if (data.node instanceof Comment)
            return;
        if (!data.props[prop])
            return;
        if (typeof data.props[prop] === "string" || typeof data.props[prop] === "number")
            return applyNodeValue(domProp, data.props[prop]);
        if (data.props[prop] instanceof Function) {
            bind(type, data, () => applyNodeValue(domProp, data.props[prop]()));
        }
    };
    const setupText = () => setupNodeProp(bindType.text, "text", "innerText");
    const setupValue = () => setupNodeProp(bindType.text, "value", "value");
    const setupStyle = () => setupNodeProp(bindType.styles, "style", "style");
    const setupClasses = () => setupNodeProp(bindType.classes, "classes", "className");
    const setupPlaceholder = () => setupAttribute("placeholder", "placeholder");
    const setupType = () => setupAttribute("type", "type");
    const setupAttribute = (name, prop) => {
        if (data.node instanceof Comment)
            return;
        if (!data.props[prop])
            return;
        bind(bindType.attributes, data, () => applyAttribute(name, data.props[prop]));
    };
    const applyAttribute = (name, val) => {
        let value;
        if (typeof val === "string")
            value = val;
        else
            value = val();
        if (!value)
            return data.node.removeAttribute(name);
        data.node.setAttribute(name, value);
    };
    const setupAttributes = () => {
        if (data.node instanceof Comment)
            return;
        if (!data.props.attributes)
            return;
        const props = [];
        const value = data.props.attributes();
        for (const prop in value)
            props.push(prop);
        bind(bindType.attributes, data, () => applyAttributes(props, data.props.attributes()));
    };
    const applyAttributes = (props, attributes) => {
        for (let i = 0; i < props.length; i++) {
            let value = null;
            if (attributes[props[i]] instanceof Function)
                value = attributes[props[i]]();
            else if (typeof attributes[props[i]] === "string")
                value = attributes[props[i]];
            if (value === null) {
                if (data.node.hasAttribute(props[i]))
                    data.node.removeAttribute(props[i]);
            }
            else if (data.node.hasAttribute(props[i])) {
                if (data.node.getAttribute(props[i]) !== value)
                    data.node.setAttribute(props[i], value);
            }
            else
                data.node.setAttribute(props[i], value);
        }
    };
    const setupEvents = () => {
        // Custom Events
        if (data.props.onUpdate)
            data.props.onKeyDown = e => val(e, v => data.props.onUpdate(v));
        // DOM Events
        if (data.props.onAbort)
            data.node.addEventListener("abort", data.props.onAbort, false);
        if (data.props.onAfterPrint)
            data.node.addEventListener("afterprint", data.props.onAfterPrint, false);
        if (data.props.onAnimationEnd)
            data.node.addEventListener("animationend", data.props.onAnimationEnd, false);
        if (data.props.onAnimationIteration)
            data.node.addEventListener("animationiteration", data.props.onAnimationIteration, false);
        if (data.props.onAnimationStart)
            data.node.addEventListener("animationstart", data.props.onAnimationStart, false);
        if (data.props.onBeforePrint)
            data.node.addEventListener("beforeprint", data.props.onBeforePrint, false);
        if (data.props.onBeforeUnload)
            data.node.addEventListener("beforeunload", data.props.onBeforeUnload, false);
        if (data.props.onBlur)
            data.node.addEventListener("blur", data.props.onBlur, false);
        if (data.props.onCanPlay)
            data.node.addEventListener("canplay", data.props.onCanPlay, false);
        if (data.props.onCanPlayThough)
            data.node.addEventListener("canplaythrough", data.props.onCanPlayThough, false);
        if (data.props.onChange)
            data.node.addEventListener("change", data.props.onChange, false);
        if (data.props.onClick)
            data.node.addEventListener("click", data.props.onClick, false);
        if (data.props.onContextMenu)
            data.node.addEventListener("contextmenu", data.props.onContextMenu, false);
        if (data.props.onCopy)
            data.node.addEventListener("copy", data.props.onCopy, false);
        if (data.props.onCut)
            data.node.addEventListener("cut", data.props.onCut, false);
        if (data.props.onDoubleClick)
            data.node.addEventListener("dblclick", data.props.onDoubleClick, false);
        if (data.props.onDrag)
            data.node.addEventListener("drag", data.props.onDrag, false);
        if (data.props.onDragEnd)
            data.node.addEventListener("dragend", data.props.onDragEnd, false);
        if (data.props.onDragEnter)
            data.node.addEventListener("dragenter", data.props.onDragEnter, false);
        if (data.props.onDragLeave)
            data.node.addEventListener("dragleave", data.props.onDragLeave, false);
        if (data.props.onDragOver)
            data.node.addEventListener("dragover", data.props.onDragOver, false);
        if (data.props.onDragStart)
            data.node.addEventListener("dragstart", data.props.onDragStart, false);
        if (data.props.onDrop)
            data.node.addEventListener("drop", data.props.onDrop, false);
        if (data.props.onDurationChange)
            data.node.addEventListener("durationchange", data.props.onDurationChange, false);
        if (data.props.onEnded)
            data.node.addEventListener("ended", data.props.onEnded, false);
        if (data.props.onError)
            data.node.addEventListener("error", data.props.onError, false);
        if (data.props.onFocus)
            data.node.addEventListener("focus", data.props.onFocus, false);
        if (data.props.onFocusIn)
            data.node.addEventListener("focusin", data.props.onFocusIn, false);
        if (data.props.onFocusOut)
            data.node.addEventListener("focusout", data.props.onFocusOut, false);
        if (data.props.onFullScreenChange)
            data.node.addEventListener("fullscreenchange", data.props.onFullScreenChange, false);
        if (data.props.onFullScreenError)
            data.node.addEventListener("fullscreenerror", data.props.onFullScreenError, false);
        if (data.props.onHashChange)
            data.node.addEventListener("hashchange", data.props.onHashChange, false);
        if (data.props.onInput)
            data.node.addEventListener("input", data.props.onInput, false);
        if (data.props.onKeyDown)
            data.node.addEventListener("keydown", data.props.onKeyDown, false);
        if (data.props.onKeyPress)
            data.node.addEventListener("keypress", data.props.onKeyPress, false);
        if (data.props.onKeyUp)
            data.node.addEventListener("keyup", data.props.onKeyUp, false);
        if (data.props.onLoad)
            data.node.addEventListener("load", data.props.onLoad, false);
        if (data.props.onLoadedData)
            data.node.addEventListener("loadeddata", data.props.onLoadedData, false);
        if (data.props.onLoadedMetaData)
            data.node.addEventListener("loadedmetadata", data.props.onLoadedMetaData, false);
        if (data.props.onLoadStart)
            data.node.addEventListener("loadstart", data.props.onLoadStart, false);
        if (data.props.onMessage)
            data.node.addEventListener("message", data.props.onMessage, false);
        if (data.props.onMouseDown)
            data.node.addEventListener("mousedown", data.props.onMouseDown, false);
        if (data.props.onMouseEnter)
            data.node.addEventListener("mouseenter", data.props.onMouseEnter, false);
        if (data.props.onMouseLeave)
            data.node.addEventListener("mouseleave", data.props.onMouseLeave, false);
        if (data.props.onMouseMove)
            data.node.addEventListener("mousemove", data.props.onMouseMove, false);
        if (data.props.onMouseOver)
            data.node.addEventListener("mouseover", data.props.onMouseOver, false);
        if (data.props.onMouseOut)
            data.node.addEventListener("mouseout", data.props.onMouseOut, false);
        if (data.props.onMouseUp)
            data.node.addEventListener("mouseup", data.props.onMouseUp, false);
        if (data.props.onMouseWheel)
            data.node.addEventListener("mousewheel", data.props.onMouseWheel, false);
        if (data.props.onOffline)
            data.node.addEventListener("offline", data.props.onOffline, false);
        if (data.props.onOnline)
            data.node.addEventListener("online", data.props.onOnline, false);
        if (data.props.onOpen)
            data.node.addEventListener("open", data.props.onOpen, false);
        if (data.props.onPageHide)
            data.node.addEventListener("pagehide", data.props.onPageHide, false);
        if (data.props.onPageShow)
            data.node.addEventListener("pageshow", data.props.onPageShow, false);
        if (data.props.onPaste)
            data.node.addEventListener("paste", data.props.onPaste, false);
        if (data.props.onPause)
            data.node.addEventListener("pause", data.props.onPause, false);
        if (data.props.onPlay)
            data.node.addEventListener("play", data.props.onPlay, false);
        if (data.props.onPlaying)
            data.node.addEventListener("playing", data.props.onPlaying, false);
        if (data.props.onPopState)
            data.node.addEventListener("popstate", data.props.onPopState, false);
        if (data.props.onProgress)
            data.node.addEventListener("progress", data.props.onProgress, false);
        if (data.props.onRateChange)
            data.node.addEventListener("ratechange", data.props.onRateChange, false);
        if (data.props.onResize)
            data.node.addEventListener("resize", data.props.onResize, false);
        if (data.props.onReset)
            data.node.addEventListener("reset", data.props.onReset, false);
        if (data.props.onScroll)
            data.node.addEventListener("scroll", data.props.onScroll, false);
        if (data.props.onSearch)
            data.node.addEventListener("search", data.props.onSearch, false);
        if (data.props.onSeeked)
            data.node.addEventListener("seeked", data.props.onSeeked, false);
        if (data.props.onSelect)
            data.node.addEventListener("select", data.props.onSelect, false);
        if (data.props.onShow)
            data.node.addEventListener("show", data.props.onShow, false);
        if (data.props.onStalled)
            data.node.addEventListener("stalled", data.props.onStalled, false);
        if (data.props.onStorage)
            data.node.addEventListener("storage", data.props.onStorage, false);
        if (data.props.onSuspend)
            data.node.addEventListener("suspend", data.props.onSuspend, false);
        if (data.props.onTimeUpdate)
            data.node.addEventListener("timeupdate", data.props.onTimeUpdate, false);
        if (data.props.onToggle)
            data.node.addEventListener("toggle", data.props.onToggle, false);
        if (data.props.onTouchCancel)
            data.node.addEventListener("touchcancel", data.props.onTouchCancel, false);
        if (data.props.onTouchEnd)
            data.node.addEventListener("touchend", data.props.onTouchEnd, false);
        if (data.props.onTouchMove)
            data.node.addEventListener("touchmove", data.props.onTouchMove, false);
        if (data.props.onTouchStart)
            data.node.addEventListener("touchstart", data.props.onTouchStart, false);
        if (data.props.onTransitionEnd)
            data.node.addEventListener("transitionend", data.props.onTransitionEnd, false);
        if (data.props.onUnload)
            data.node.addEventListener("unload", data.props.onUnload, false);
        if (data.props.onVolumeChange)
            data.node.addEventListener("volumechange", data.props.onVolumeChange, false);
        if (data.props.onWaiting)
            data.node.addEventListener("waiting", data.props.onWaiting, false);
        if (data.props.onWheel)
            data.node.addEventListener("wheel", data.props.onWheel, false);
        if (data.props.onSubmit) {
            originalOnSubmit = data.props.onSubmit;
            data.props.onSubmit = (ev) => {
                ev.preventDefault();
                originalOnSubmit(ev);
            };
            data.node.addEventListener("submit", data.props.onSubmit, false);
        }
    };
    const cleanEvents = () => {
        if (data.props.onAbort)
            data.node.removeEventListener("abort", data.props.onAbort, false);
        if (data.props.onAfterPrint)
            data.node.removeEventListener("afterprint", data.props.onAfterPrint, false);
        if (data.props.onAnimationEnd)
            data.node.removeEventListener("animationend", data.props.onAnimationEnd, false);
        if (data.props.onAnimationIteration)
            data.node.removeEventListener("animationiteration", data.props.onAnimationIteration, false);
        if (data.props.onAnimationStart)
            data.node.removeEventListener("animationstart", data.props.onAnimationStart, false);
        if (data.props.onBeforePrint)
            data.node.removeEventListener("beforeprint", data.props.onBeforePrint, false);
        if (data.props.onBeforeUnload)
            data.node.removeEventListener("beforeunload", data.props.onBeforeUnload, false);
        if (data.props.onBlur)
            data.node.removeEventListener("blur", data.props.onBlur, false);
        if (data.props.onCanPlay)
            data.node.removeEventListener("canplay", data.props.onCanPlay, false);
        if (data.props.onCanPlayThough)
            data.node.removeEventListener("canplaythrough", data.props.onCanPlayThough, false);
        if (data.props.onChange)
            data.node.removeEventListener("change", data.props.onChange, false);
        if (data.props.onClick)
            data.node.removeEventListener("click", data.props.onClick, false);
        if (data.props.onContextMenu)
            data.node.removeEventListener("contextmenu", data.props.onContextMenu, false);
        if (data.props.onCopy)
            data.node.removeEventListener("copy", data.props.onCopy, false);
        if (data.props.onCut)
            data.node.removeEventListener("cut", data.props.onCut, false);
        if (data.props.onDoubleClick)
            data.node.removeEventListener("dblclick", data.props.onDoubleClick, false);
        if (data.props.onDrag)
            data.node.removeEventListener("drag", data.props.onDrag, false);
        if (data.props.onDragEnd)
            data.node.removeEventListener("dragend", data.props.onDragEnd, false);
        if (data.props.onDragEnter)
            data.node.removeEventListener("dragenter", data.props.onDragEnter, false);
        if (data.props.onDragLeave)
            data.node.removeEventListener("dragleave", data.props.onDragLeave, false);
        if (data.props.onDragOver)
            data.node.removeEventListener("dragover", data.props.onDragOver, false);
        if (data.props.onDragStart)
            data.node.removeEventListener("dragstart", data.props.onDragStart, false);
        if (data.props.onDrop)
            data.node.removeEventListener("drop", data.props.onDrop, false);
        if (data.props.onDurationChange)
            data.node.removeEventListener("durationchange", data.props.onDurationChange, false);
        if (data.props.onEnded)
            data.node.removeEventListener("ended", data.props.onEnded, false);
        if (data.props.onError)
            data.node.removeEventListener("error", data.props.onError, false);
        if (data.props.onFocus)
            data.node.removeEventListener("focus", data.props.onFocus, false);
        if (data.props.onFocusIn)
            data.node.removeEventListener("focusin", data.props.onFocusIn, false);
        if (data.props.onFocusOut)
            data.node.removeEventListener("focusout", data.props.onFocusOut, false);
        if (data.props.onFullScreenChange)
            data.node.removeEventListener("fullscreenchange", data.props.onFullScreenChange, false);
        if (data.props.onFullScreenError)
            data.node.removeEventListener("fullscreenerror", data.props.onFullScreenError, false);
        if (data.props.onHashChange)
            data.node.removeEventListener("hashchange", data.props.onHashChange, false);
        if (data.props.onInput)
            data.node.removeEventListener("input", data.props.onInput, false);
        if (data.props.onKeyDown)
            data.node.removeEventListener("keydown", data.props.onKeyDown, false);
        if (data.props.onKeyPress)
            data.node.removeEventListener("keypress", data.props.onKeyPress, false);
        if (data.props.onKeyUp)
            data.node.removeEventListener("keyup", data.props.onKeyUp, false);
        if (data.props.onLoad)
            data.node.removeEventListener("load", data.props.onLoad, false);
        if (data.props.onLoadedData)
            data.node.removeEventListener("loadeddata", data.props.onLoadedData, false);
        if (data.props.onLoadedMetaData)
            data.node.removeEventListener("loadedmetadata", data.props.onLoadedMetaData, false);
        if (data.props.onLoadStart)
            data.node.removeEventListener("loadstart", data.props.onLoadStart, false);
        if (data.props.onMessage)
            data.node.removeEventListener("message", data.props.onMessage, false);
        if (data.props.onMouseDown)
            data.node.removeEventListener("mousedown", data.props.onMouseDown, false);
        if (data.props.onMouseEnter)
            data.node.removeEventListener("mouseenter", data.props.onMouseEnter, false);
        if (data.props.onMouseLeave)
            data.node.removeEventListener("mouseleave", data.props.onMouseLeave, false);
        if (data.props.onMouseMove)
            data.node.removeEventListener("mousemove", data.props.onMouseMove, false);
        if (data.props.onMouseOver)
            data.node.removeEventListener("mouseover", data.props.onMouseOver, false);
        if (data.props.onMouseOut)
            data.node.removeEventListener("mouseout", data.props.onMouseOut, false);
        if (data.props.onMouseUp)
            data.node.removeEventListener("mouseup", data.props.onMouseUp, false);
        if (data.props.onMouseWheel)
            data.node.removeEventListener("mousewheel", data.props.onMouseWheel, false);
        if (data.props.onOffline)
            data.node.removeEventListener("offline", data.props.onOffline, false);
        if (data.props.onOnline)
            data.node.removeEventListener("online", data.props.onOnline, false);
        if (data.props.onOpen)
            data.node.removeEventListener("open", data.props.onOpen, false);
        if (data.props.onPageHide)
            data.node.removeEventListener("pagehide", data.props.onPageHide, false);
        if (data.props.onPageShow)
            data.node.removeEventListener("pageshow", data.props.onPageShow, false);
        if (data.props.onPaste)
            data.node.removeEventListener("paste", data.props.onPaste, false);
        if (data.props.onPause)
            data.node.removeEventListener("pause", data.props.onPause, false);
        if (data.props.onPlay)
            data.node.removeEventListener("play", data.props.onPlay, false);
        if (data.props.onPlaying)
            data.node.removeEventListener("playing", data.props.onPlaying, false);
        if (data.props.onPopState)
            data.node.removeEventListener("popstate", data.props.onPopState, false);
        if (data.props.onProgress)
            data.node.removeEventListener("progress", data.props.onProgress, false);
        if (data.props.onRateChange)
            data.node.removeEventListener("ratechange", data.props.onRateChange, false);
        if (data.props.onResize)
            data.node.removeEventListener("resize", data.props.onResize, false);
        if (data.props.onReset)
            data.node.removeEventListener("reset", data.props.onReset, false);
        if (data.props.onScroll)
            data.node.removeEventListener("scroll", data.props.onScroll, false);
        if (data.props.onSearch)
            data.node.removeEventListener("search", data.props.onSearch, false);
        if (data.props.onSeeked)
            data.node.removeEventListener("seeked", data.props.onSeeked, false);
        if (data.props.onSelect)
            data.node.removeEventListener("select", data.props.onSelect, false);
        if (data.props.onShow)
            data.node.removeEventListener("show", data.props.onShow, false);
        if (data.props.onStalled)
            data.node.removeEventListener("stalled", data.props.onStalled, false);
        if (data.props.onStorage)
            data.node.removeEventListener("storage", data.props.onStorage, false);
        if (data.props.onSuspend)
            data.node.removeEventListener("suspend", data.props.onSuspend, false);
        if (data.props.onTimeUpdate)
            data.node.removeEventListener("timeupdate", data.props.onTimeUpdate, false);
        if (data.props.onToggle)
            data.node.removeEventListener("toggle", data.props.onToggle, false);
        if (data.props.onTouchCancel)
            data.node.removeEventListener("touchcancel", data.props.onTouchCancel, false);
        if (data.props.onTouchEnd)
            data.node.removeEventListener("touchend", data.props.onTouchEnd, false);
        if (data.props.onTouchMove)
            data.node.removeEventListener("touchmove", data.props.onTouchMove, false);
        if (data.props.onTouchStart)
            data.node.removeEventListener("touchstart", data.props.onTouchStart, false);
        if (data.props.onTransitionEnd)
            data.node.removeEventListener("transitionend", data.props.onTransitionEnd, false);
        if (data.props.onUnload)
            data.node.removeEventListener("unload", data.props.onUnload, false);
        if (data.props.onVolumeChange)
            data.node.removeEventListener("volumechange", data.props.onVolumeChange, false);
        if (data.props.onWaiting)
            data.node.removeEventListener("waiting", data.props.onWaiting, false);
        if (data.props.onWheel)
            data.node.removeEventListener("wheel", data.props.onWheel, false);
        if (data.props.onSubmit)
            data.node.removeEventListener("submit", data.props.onSubmit, false);
        if (originalOnSubmit)
            originalOnSubmit = null;
    };
    const addEvent = (eventName, func) => {
        data.node.addEventListener(eventName, func, false);
        data.unmounts.add(() => data.node.removeEventListener(eventName, func, false));
    };
    const mountTags = (tags) => {
        for (let i = 0; i < tags.length; i++) {
            const tag = mountTag(tags[i]);
            data.tags.set(tag.id, tag);
        }
    };
    const mountTag = (rawTag, id) => {
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
        if (id)
            tag.id = id;
        tag.mounted = true;
        tag.onMount();
        return tag;
    };
    const unmount = (u, direct = false) => {
        data.onUnmountAsync(() => {
            data.onUnmount();
            data.unmounts.foreach(u => u());
            if (data.tags.size) {
                let deleted = 0;
                data.tags.foreach(t => t.unmount(() => {
                    if (++deleted === data.tags.size)
                        continueUnmount(u, direct);
                }));
            }
            else
                continueUnmount(u, direct);
        });
    };
    const continueUnmount = (u, direct = false) => {
        cleanEvents();
        cleanSubscriptions(data);
        if (direct)
            unmountFromParent();
        if (u)
            u();
    };
    const unmountFromParent = () => {
        // Animation overlapping can occur naturally
        // in complex situations, which means that a node is always cleaned
        // so we don't have to rely on the parent unmounting?
        if (data.node.parentNode)
            data.node.parentNode.removeChild(data.node);
        if (data.parent)
            if (data.parent.tags.has(data.id))
                data.parent.tags.delete(data.id);
    };
    setupName();
    setupText();
    setupValue();
    setupStyle();
    setupClasses();
    setupPlaceholder();
    setupType();
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
    const remove = (id) => tag.tags.get(id).unmount(undefined, true);
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
    const tag = comment({
        onMount: t => {
            mountID = t.id + "_selection";
            tag.bind(bindType.router, () => bind());
        }
    });
    let unmounting = false;
    let mountID = "";
    const bind = () => {
        if (unmounting)
            return;
        if (tag.tags.has(mountID)) {
            unmounting = true;
            return tag.tags.get(mountID).unmount(() => {
                tag.tags.delete(mountID);
                unmounting = false;
                bind();
            }, true);
        }
        let t = props();
        if (!t)
            return;
        if (t instanceof Array)
            t = t[0];
        t = tag.mount(t, mountID);
        tag.tags.set(mountID, t);
    };
    return tag;
};
const styles = new Mix();
const mountStyle = (name, val) => {
    if (styles.has(name))
        return;
    const node = document.createElement("style");
    node.type = "text/css";
    const data = {
        bindsCache: {},
        binds: new Mix()
    };
    bind(bindType.css, data, () => node.innerHTML = val());
    styles.set(name, {
        data,
        node
    });
    document.head.appendChild(node);
};
const unmountStyle = (name) => {
    if (!styles.has(name))
        return;
    cleanSubscriptions(styles.get(name).data);
    document.head.removeChild(styles.get(name).node);
    styles.delete(name);
};
const visuals = new Proxy({}, {
    defineProperty: (t, p, a) => {
        t[p] = null;
        mountStyle(p, a.value);
        return true;
    },
    deleteProperty: (t, p) => {
        delete t[p];
        unmountStyle(p);
        return true;
    }
});
const move = (feed, tags) => {
    const props = {
        translate: () => `
            translate3d(${feed.data.x}px, ${feed.data.y}px, 0)
        `,
        transform: () => `
            transform: ${props.translate()};
        `,
        style: () => props.transform()
    };
    const tag = forward(tags(props));
    const target = filter(feed, tag);
    // Blend Logic
    const start = { x: 0, y: 0 };
    const onDown = (ev) => {
        if (feed.onDown)
            feed.onDown(ev);
        start.x = ev.pageX - feed.data.x;
        start.y = ev.pageY - feed.data.y;
        window.onmousemove = onMove;
        window.onmouseup = onUp;
    };
    const onMove = (ev) => {
        feed.data.x = ev.pageX - start.x;
        feed.data.y = ev.pageY - start.y;
        if (feed.onMove)
            feed.onMove(ev);
    };
    const onUp = (ev) => {
        window.onmousemove = null;
        window.onmouseup = null;
        if (feed.onUp)
            feed.onUp(ev);
    };
    // ~Blend Logic
    target.addEvent("mousedown", onDown);
    return tag;
};
const resize = (feed, tags) => {
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
    const resizerStyle = `
        position: absolute;
        background-color: pink;
    `;
    return forward(tags({
        width: () => "width: " + feed.size.x + "px;",
        height: () => "height: " + feed.size.y + "px;",
        translate: () => "translate3d(" + feed.pos.x + "px, " + feed.pos.y + "px, 0)",
        style: () => `
            width: ${feed.size.x}px;
            height: ${feed.size.y}px;
            transform: translate3d(${feed.pos.x}px, ${feed.pos.y}px, 0);
        `,
        resizers: () => [
            move({ data: pos.top, onDown: () => {
                    pos.top.y = 0;
                    start.x = feed.size.x;
                    start.y = feed.size.y;
                    if (feed.pos) {
                        start.posX = feed.pos.x;
                        start.posY = feed.pos.y;
                    }
                }, onMove: () => {
                    feed.size.y = start.y - pos.top.y;
                    if (feed.pos)
                        feed.pos.y = start.posY + pos.top.y;
                } }, () => [
                div({
                    classes: "ResizerTop Resizer",
                    style: `
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 10px;
                        cursor: move;
                        ${resizerStyle}
                    `
                })
            ]),
            move({ data: pos.bottom, onDown: () => {
                    pos.bottom.y = 0;
                    start.x = feed.size.x;
                    start.y = feed.size.y;
                    if (feed.pos) {
                        start.posX = feed.pos.x;
                        start.posY = feed.pos.y;
                    }
                }, onMove: () => {
                    feed.size.y = start.y + pos.bottom.y;
                } }, () => [
                div({
                    classes: "ResizerBottom Resizer",
                    style: `
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 10px;
                        cursor: move;
                        ${resizerStyle}
                    `
                })
            ]),
            move({ data: pos.left, onDown: () => {
                    pos.left.x = 0;
                    start.x = feed.size.x;
                    start.y = feed.size.y;
                    if (feed.pos) {
                        start.posX = feed.pos.x;
                        start.posY = feed.pos.y;
                    }
                }, onMove: () => {
                    feed.size.x = start.x - pos.left.x;
                    if (feed.pos)
                        feed.pos.x = start.posX + pos.left.x;
                } }, () => [
                div({
                    classes: "ResizerLeft Resizer",
                    style: `
                        top: 0;
                        left: 0;
                        width: 10px;
                        height: 100%;
                        cursor: move;
                        ${resizerStyle}
                    `
                })
            ]),
            move({ data: pos.right, onDown: () => {
                    pos.right.x = 0;
                    start.x = feed.size.x;
                    start.y = feed.size.y;
                    if (feed.pos) {
                        start.posX = feed.pos.x;
                        start.posY = feed.pos.y;
                    }
                }, onMove: () => {
                    feed.size.x = start.x + pos.right.x;
                } }, () => [
                div({
                    classes: "ResizerRight Resizer",
                    style: `
                        top: 0;
                        right: 0;
                        width: 10px;
                        height: 100%;
                        cursor: move;
                        ${resizerStyle}
                    `
                })
            ])
        ]
    }));
};
const drag = (feed, tags) => {
    if (!feed.data)
        feed.data = o(Pos);
    const state = o({
        style: ""
    });
    let node = null;
    let placeholder = null;
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
        state.style = `
            position: absolute;
            left: ${rect.left + +document.body.scrollLeft}px;
            top: ${rect.top + document.body.scrollTop}px;
            pointer-events: none;
        `;
        document.body.append(node);
        fx.dragging = true;
        if (!(feed instanceof Function))
            if (feed.onData)
                fx.dragData = feed.onData();
    };
    const onUp = () => {
        fx.dragging = false;
        placeholder.replaceWith(node);
        state.style = "";
        node = null;
        fx.placeholder = null;
        placeholder = null;
        feed.data.x = 0;
        feed.data.y = 0;
        if (fx.dragData)
            fx.dragData = null;
    };
    const tag = move({
        data: feed.data,
        onDown, onUp,
        target: feed.target
    }, ({ style: moveStyle, transform, translate }) => tags({
        style: () => moveStyle() + state.style,
        translate,
        dragStyle: () => state.style,
        moveStyle,
        transform
    }));
    return tag;
};
const drop = (feed, tags) => {
    const props = {};
    const tag = forward(tags(props));
    const target = filter(feed, tag);
    const mouseEnter = (ev) => {
        if (!fx.dragging)
            return;
        if (feed.onEnter)
            feed.onEnter(feed.onData ? feed.onData() : null);
    };
    const mouseUp = () => {
        if (!fx.dragging)
            return;
        if (feed.onDrop)
            feed.onDrop(fx.dragData);
    };
    target.addEvent("mouseenter", mouseEnter);
    target.addEvent("mouseup", mouseUp);
    return tag;
};
const sort = (feed, tags) => {
    const onEnter = (data) => {
        if (!(fx.placeholder instanceof HTMLDivElement))
            return;
        const node = tag.node;
        if (node.parentNode !== fx.placeholder.parentNode)
            return;
        const after = (node.compareDocumentPosition(fx.placeholder) & 0x02) !== 0;
        if (feed.data) {
            const hoveredTag = tag;
            const draggingTag = fx.dragData;
            if (!feed.data.has(hoveredTag.props.name) ||
                !feed.data.has(draggingTag.props.name))
                return;
            if (after)
                if (hoveredTag.props.name === feed.data.lastID())
                    feed.data.sort(draggingTag.props.name, null);
                else
                    feed.data.sort(draggingTag.props.name, feed.data.getNode(hoveredTag.props.name).next.id);
            else
                feed.data.sort(draggingTag.props.name, hoveredTag.props.name);
        }
        else if (after) {
            if (node.nextSibling)
                fx.placeholder.parentNode.insertBefore(fx.placeholder, node.nextSibling);
            else
                fx.placeholder.parentNode.appendChild(fx.placeholder);
        }
        else
            fx.placeholder.parentNode.insertBefore(fx.placeholder, node);
        if (feed.onSort)
            feed.onSort(fx.dragData, tag, after);
    };
    const tag = drag({
        onStart: () => feed.onStart(fx.dragData, tag),
        onData: () => tag,
        target: feed.target
    }, (dragProps) => [
        drop({ onEnter, onData: () => tag }, () => [
            forward(tags({
                translate: dragProps.translate,
                style: () => `
                    user-select: none;
                    ${dragProps.style()}
                `,
                moveStyle: dragProps.moveStyle,
                dragStyle: dragProps.style
            }))
        ])
    ]);
    return tag;
};
//# sourceMappingURL=index.js.map