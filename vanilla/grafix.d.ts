/// <reference types="node" />
declare class Unit<T = any> {
    static timeouts: Map<string, NodeJS.Timeout>;
    static intervals: Map<string, NodeJS.Timeout>;
    static percentage(obtained: number, total: number): number;
    static setTimeout(func: VoidFunction, delay: number, name?: string): NodeJS.Timeout;
    static clearTimeout(name?: string): void;
    static setInterval(func: VoidFunction, delay: number, name?: string): NodeJS.Timeout;
    static clearInterval(name?: string): void;
    static uniqueNumber(): number;
    static random(min: number, max: number): number;
    static uniqueID(): string;
}
declare type AssocNode<T, I> = {
    data: T;
    id: I;
    prev: AssocNode<T, I> | null;
    next: AssocNode<T, I> | null;
};
declare type MixEvent<T, I> = (item?: T, id?: I) => void;
declare type MixSortEvent<T, I> = (item1?: T, item2?: T, id1?: I, id2?: I) => void;
declare type MixSubscriberSet<T, I> = {
    add: Mix<MixEvent<T, I>>;
    sort: Mix<MixSortEvent<T, I>>;
    remove: Mix<MixEvent<T, I>>;
};
declare class AssocList<I, T> {
    protected ids: Map<I, () => AssocNode<T, I>>;
    firstNode: AssocNode<T, I> | null;
    lastNode: AssocNode<T, I> | null;
    size: number;
    protected uniqueMix: boolean;
    private focusNode;
    protected binds: MixSubscriberSet<T, I>;
    constructor(items?: [I, T][] | T[], uniqueMix?: boolean, subscribable?: boolean);
    onAdd(event: MixEvent<T, I>, id?: string): string;
    onSort(event: MixSortEvent<T, I>, id?: string): string;
    onRemove(event: MixEvent<T, I>, id?: string): string;
    removeOnAdd(id: string): void;
    removeOnSort(id: string): void;
    removeOnRemove(id: string): void;
    export(): [I, T][];
    get first(): AssocNode<T, I> | null;
    get last(): AssocNode<T, I> | null;
    get preEnd(): T;
    firstID(): I;
    get firstItem(): T;
    lastID(): I;
    get lastItem(): T;
    start(): T;
    end(): T;
    get next(): this;
    get prev(): this;
    focus(id: I): AssocList<I, T>;
    getID(): I;
    add(item: T): string;
    pre(item: T): AssocList<I, T>;
    preAssoc(id: I, item: T): AssocList<I, T>;
    push(item: T): AssocList<I, T>;
    set(id: I, item: T): void;
    shift(): T;
    pop(): T;
    index(n: number): T;
    iteratedSort(callback: (a: T, b: T) => number): void;
    sort(beforeID: I, afterID: I): void;
    has(id: I): boolean;
    get(id?: I): T;
    getNode(id: I): AssocNode<T, I>;
    clean(): void;
    delete(id: I): void;
    aforeach(callback: (next: VoidFunction, item: T, id?: I) => boolean | unknown, onEnd?: VoidFunction): void;
    aforeachBackward(callback: (next: VoidFunction, item: T, id?: I) => boolean | unknown, onEnd?: VoidFunction): void;
    foreach(callback: (item: T, id?: I) => boolean | unknown, reversed?: boolean): void;
    forEach(callback: (item: T, id?: I) => boolean | unknown): void;
    protected doNext(node: AssocNode<T, I> | null, callback: (item: T, id?: I) => boolean | unknown): AssocNode<T, I> | null;
    protected doPrev(node: AssocNode<T, I> | null, callback: (item: T, id?: I) => boolean | unknown): AssocNode<T, I> | null;
    protected doNextAsync(node: AssocNode<T, I> | null, callback: (next: VoidFunction, item: T, id?: I) => boolean | unknown, onEnd?: VoidFunction): void;
    protected doPrevAsync(node: AssocNode<T, I> | null, callback: (prev: VoidFunction, item: T, id?: I) => boolean | unknown, onEnd?: VoidFunction): void;
    sum<N = any>(func: (item: T) => Mix<N>): Mix<N>;
    mix<N = any>(func: (item: T) => N): Mix<N>;
    copy(innerCopy?: boolean): Arr<I, T>;
    get array(): T[];
    get map(): Map<I, T>;
    get obj(): any;
    getMore(...ids: I[]): Arr<I, T>;
    readId(id: number): I;
    readIds(): Array<I>;
    monitor(): T[];
    monitorObj(): T[];
    monitorAssoc(): [I, T][];
}
declare class Arr<I = any, T = any> extends AssocList<I, T> {
}
declare class Mix<T = any> extends Arr<string, T> {
}
declare class UniqueMix<T = any> extends Mix<T> {
    constructor(items?: T[] | [string, T][]);
}
declare type MouseEventFunc = (ev?: MouseEvent) => void;
declare type TagChild = Tag | [Mix, (...p: any[]) => TagChild[]] | (() => any);
declare type Binding = [Unit<any>, string];
declare type Bindings = Binding[];
declare type TagValue = string | (() => string);
declare type TagObjBind = {
    objBinds: ObjBinds;
    func: () => any;
    id: string;
};
/**
 * @description
 *  objID->prop->bindType->{
 *      objBinds: ObjBinds,
 *      func: () => any,
 *      id: string
 *  }
 */
declare type Binds = Mix<Mix<Mix<TagObjBind>>>;
/**
 * @description prop->bindFuncs
 */
declare type ObjBinds = Mix<Mix<VoidFunction>>;
declare type Attributes = {
    src: string;
    href: string;
    type: string;
    rel: string;
    media: string;
    value: string;
    placeholder: string;
    disabled: boolean;
    width: string;
    height: string;
    class: string;
    style: string;
    id: string;
};
declare type NodeProps = Partial<TagProps> | TagChild[];
declare type NodeTags = TagChild[];
declare class TagProps {
    name?: string;
    text?: string | (() => string);
    style?: string | (() => string);
    classes?: string | (() => string);
    type?: string | (() => string);
    value?: string | (() => string);
    placeholder?: string | (() => string);
    attributes?: (() => Partial<Attributes> | any);
    onCreate?: (tag?: Tag) => void;
    onInit?: (tag?: Tag) => void;
    onMount?: (tag?: Tag) => void;
    onUnmount?: (tag?: Tag) => void;
    onUnmountAsync: (unmount: VoidFunction, tag?: Tag) => void;
    onAbort?: MouseEventFunc | null;
    onAfterPrint?: MouseEventFunc | null;
    onAnimationEnd?: MouseEventFunc | null;
    onAnimationIteration?: MouseEventFunc | null;
    onAnimationStart?: MouseEventFunc | null;
    onBeforePrint?: MouseEventFunc | null;
    onBeforeUnload?: MouseEventFunc | null;
    onBlur?: MouseEventFunc | null;
    onCanPlay?: MouseEventFunc | null;
    onCanPlayThough?: MouseEventFunc | null;
    onChange?: MouseEventFunc | null;
    onClick?: MouseEventFunc | null;
    onContextMenu?: MouseEventFunc | null;
    onCopy?: MouseEventFunc | null;
    onCut?: MouseEventFunc | null;
    onDoubleClick?: MouseEventFunc | null;
    onDrag?: MouseEventFunc | null;
    onDragEnd?: MouseEventFunc | null;
    onDragEnter?: MouseEventFunc | null;
    onDragLeave?: MouseEventFunc | null;
    onDragOver?: MouseEventFunc | null;
    onDragStart?: MouseEventFunc | null;
    onDrop?: MouseEventFunc | null;
    onDurationChange?: MouseEventFunc | null;
    onEnded?: MouseEventFunc | null;
    onError?: MouseEventFunc | null;
    onFocus?: MouseEventFunc | null;
    onFocusIn?: MouseEventFunc | null;
    onFocusOut?: MouseEventFunc | null;
    onFullScreenChange?: MouseEventFunc | null;
    onFullScreenError?: MouseEventFunc | null;
    onHashChange?: MouseEventFunc | null;
    onInput?: MouseEventFunc | null;
    onInvalid?: MouseEventFunc | null;
    onKeyDown?: MouseEventFunc | null;
    onKeyPress?: MouseEventFunc | null;
    onKeyUp?: MouseEventFunc | null;
    onLoad?: MouseEventFunc | null;
    onLoadedData?: MouseEventFunc | null;
    onLoadedMetaData?: MouseEventFunc | null;
    onLoadStart?: MouseEventFunc | null;
    onMessage?: MouseEventFunc | null;
    onMouseDown?: MouseEventFunc | null;
    onMouseEnter?: MouseEventFunc | null;
    onMouseLeave?: MouseEventFunc | null;
    onMouseMove?: MouseEventFunc | null;
    onMouseOver?: MouseEventFunc | null;
    onMouseOut?: MouseEventFunc | null;
    onMouseUp?: MouseEventFunc | null;
    /** @deprecated Use the onWheel event instead */
    onMouseWheel?: MouseEventFunc | null;
    onOffline?: MouseEventFunc | null;
    onOnline?: MouseEventFunc | null;
    onOpen?: MouseEventFunc | null;
    onPageHide?: MouseEventFunc | null;
    onPageShow?: MouseEventFunc | null;
    onPaste?: MouseEventFunc | null;
    onPause?: MouseEventFunc | null;
    onPlay?: MouseEventFunc | null;
    onPlaying?: MouseEventFunc | null;
    onPopState?: MouseEventFunc | null;
    onProgress?: MouseEventFunc | null;
    onRateChange?: MouseEventFunc | null;
    onResize?: MouseEventFunc | null;
    onReset?: MouseEventFunc | null;
    onScroll?: MouseEventFunc | null;
    onSearch?: MouseEventFunc | null;
    onSeeked?: MouseEventFunc | null;
    onSeeking?: MouseEventFunc | null;
    onSelect?: MouseEventFunc | null;
    onShow?: MouseEventFunc | null;
    onStalled?: MouseEventFunc | null;
    onStorage?: MouseEventFunc | null;
    onSubmit?: MouseEventFunc | null;
    onSuspend?: MouseEventFunc | null;
    onTimeUpdate?: MouseEventFunc | null;
    onToggle?: MouseEventFunc | null;
    onTouchCancel?: MouseEventFunc | null;
    onTouchEnd?: MouseEventFunc | null;
    onTouchMove?: MouseEventFunc | null;
    onTouchStart?: MouseEventFunc | null;
    onTransitionEnd?: MouseEventFunc | null;
    onUnload?: MouseEventFunc | null;
    onVolumeChange?: MouseEventFunc | null;
    onWaiting?: MouseEventFunc | null;
    onWheel?: MouseEventFunc | null;
    onUpdate?: (v: string) => void | null;
    _onSubmit?: MouseEventFunc | null;
    constructor(data: Partial<TagProps>);
}
declare enum bindType {
    text = "text",
    styles = "styles",
    classes = "classes",
    router = "router",
    attributes = "attributes",
    css = "css"
}
declare let bindListen: boolean;
declare let currentTag: Tag;
declare let currentBindType: bindType;
declare let currentBindFunc: () => any;
declare let bindingChanged: boolean;
declare const enableBinding: (type: bindType, data: any, func: () => any) => void;
declare const disableBinding: () => void;
declare const bind: (type: bindType, data: any, apply: Function) => void;
declare const cleanSubscriptions: (data: any) => void;
/**
 * @function
 * @template A
 * @returns {A}
 * */
declare const o: <C = any>(ref: C | (new () => C), d?: Partial<C>, refreshable?: boolean) => C;
declare const comment: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const a: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const abbr: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const acronym: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const address: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const applet: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const area: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const article: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const aside: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const audio: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const b: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const base: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const basefont: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const bdi: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const bdo: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const big: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const blockquote: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const body: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const br: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const button: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const canvas: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const cite: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const code: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const col: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const colgroup: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const data: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const datalist: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const dd: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const del: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const details: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const dfn: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const dialog: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const dir: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const div: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const dl: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const dt: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const doc: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const em: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const embed: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const fieldset: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const figcaption: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const figure: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const font: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const footer: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const form: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const frame: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const frameset: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const h1: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const h2: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const h3: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const h4: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const h5: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const h6: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const head: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const header: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const hr: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const html: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const i: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const iframe: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const img: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const input: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const ins: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const kbd: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const label: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const legend: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const li: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const link: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const main: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const map: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const mark: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const meta: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const meter: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const nav: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const noframes: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const noscript: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const object: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const ol: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const optgroup: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const option: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const p: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const param: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const picture: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const pre: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const progress: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const q: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const rp: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const rt: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const ruby: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const s: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const samp: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const script: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const section: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const select: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const small: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const source: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const span: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const strike: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const strong: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const style: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const sub: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const svg: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const table: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const tbody: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const td: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const template: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const textarea: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const tfoot: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const th: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const thead: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const time: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const title: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const tr: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const track: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const tt: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const u: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const ul: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const htmlVar: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const video: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare class Pos {
    x: number;
    y: number;
}
declare class Size {
    x: number;
    y: number;
}
declare const node: (type: string, props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const mountTag: (query: string, elementFunc: (...p: any[]) => Tag, data?: any) => Tag;
declare const mix: <T = any>(items?: T[] | [string, T][], unique?: boolean, subscribable?: boolean) => Mix<T>;
declare const attachUnmount: (tag: Tag, unmount: VoidFunction) => string;
declare const loop: (n: number | any[] | Mix<any>, func: (data?: any, id?: any) => TagChild[]) => TagChild[];
declare const val: (e: any, u: (v: string) => void) => NodeJS.Timeout;
declare const arrange: (props: Partial<TagProps> | TagChild[], tags: TagChild[]) => [Partial<TagProps>, TagChild[]];
declare const setDefaultStyle: (props: Partial<TagProps>, defaultStyle: string) => void;
declare const expand: (style: string | (() => string)) => string;
declare const forward: (tags: any[]) => Tag;
declare const filter: (feed: Partial<{
    target: () => any;
}>, tag: Tag) => Tag;
declare const prepare: (props: Partial<TagProps>, prop: string) => void;
declare const allow: (condition: () => any, tags: () => NodeTags) => () => NodeTags;
declare const fx: {
    dragging: boolean;
    dragData: any;
    placeholder: any;
};
declare type Tag = {
    id: string;
    name: () => string;
    parent: Tag;
    tags: Mix<Tag>;
    bindsCache: any;
    binds: Binds;
    unmounts: Mix<VoidFunction>;
    node: HTMLElement;
    props: TagProps;
    mounted: boolean;
    addEvent: ((eventName: string, func: (ev?: any) => void) => void);
    onCreate: (tag?: Tag) => void;
    onMount: (tag?: Tag) => void;
    onInit: (tag?: Tag) => void;
    onUnmount: (tag?: Tag) => void;
    onUnmountAsync: (u: VoidFunction, tag?: Tag) => void;
    unmount: (u?: VoidFunction, direct?: boolean) => void;
    mount: (tag: TagChild, id?: string) => Tag;
    bind: (type: bindType, apply: Function) => void;
    disableBinding: VoidFunction;
};
declare const tag: (node: HTMLElement, props: TagProps, childTags: TagChild[]) => Tag;
declare type ListData = {
    ref: ((...p: any[]) => TagChild[]);
    mix: Mix;
};
declare const tagList: (props: ListData) => Tag;
declare const router: (props: () => TagChild) => Tag;
interface StylesData {
    bindsCache: any;
    binds: Binds;
}
interface StyleNode {
    data: StylesData;
    node: HTMLStyleElement;
}
declare const styles: Mix<StyleNode>;
declare const mountStyle: (name: string, val: Function) => void;
declare const unmountStyle: (name: string) => void;
declare const visuals: any;
declare type MoveFeed = {
    data: Pos;
    target?: () => Tag;
    onDown?: (ev?: MouseEvent) => void;
    onMove?: (ev?: MouseEvent) => void;
    onUp?: (ev?: MouseEvent) => void;
};
declare type MoveProps = {
    style: () => string;
    translate: () => string;
    transform: () => any;
};
declare const move: (feed: MoveFeed, tags?: (p: MoveProps) => Tag[]) => Tag;
declare type ResizeFeed = {
    size?: Size;
    pos?: Pos;
};
declare type ResizeProps = {
    width: () => string;
    height: () => string;
    translate: () => string;
    style: () => string;
    resizers: () => Tag[];
};
declare const resize: (feed: ResizeFeed, tags: (p?: ResizeProps) => Tag[]) => Tag;
declare type DragFeed = {
    data?: Pos;
    target?: () => Tag;
    onData?: () => any;
    onStart?: () => any;
    onUp?: () => any;
};
declare type DragProps = {
    translate: () => string;
    style: () => string;
    moveStyle: () => string;
    dragStyle: () => string;
    transform: () => string;
};
declare const drag: (feed: DragFeed, tags: (p?: DragProps) => Tag[]) => Tag;
declare type DropFeed = {
    target?: () => Tag;
    onEnter?: (data?: any) => void;
    onDrop?: (data?: any) => void;
    onData?: () => any;
};
declare type DropProps = {};
declare const drop: (feed: DropFeed, tags: (p?: DropProps) => Tag[]) => Tag;
declare type SortFeed = {
    onStart?: (dragged?: TagChild, hovered?: TagChild) => void;
    onSort?: (dragged?: TagChild, hovered?: TagChild, after?: boolean) => void;
    onEnd?: () => void;
    data?: Mix;
    target?: () => Tag;
};
declare type SortProps = {
    translate: () => string;
    style: () => string;
    dragStyle: () => string;
    moveStyle: () => string;
};
declare const sort: (feed: SortFeed, tags: (p?: SortProps) => Tag[]) => Tag;
