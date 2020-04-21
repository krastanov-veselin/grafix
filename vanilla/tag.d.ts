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
    push(item: T): AssocList<I, T>;
    set(id: I, item: T): void;
    unshift(): T;
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
declare type TagChild = (() => any) | Tag | [Mix, (...p: any[]) => TagChild[]];
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
declare class TagProps {
    name?: string;
    text?: TagValue;
    html?: string;
    style?: TagValue;
    width?: string;
    height?: string;
    classes?: TagValue;
    attributes?: (() => Partial<Attributes> | any);
    type?: string;
    value?: TagValue;
    placeholder?: string;
    onCreate?: (tag?: Tag) => void;
    onInit?: (tag?: Tag) => void;
    onMount?: (tag?: Tag) => void;
    onUnmount?: (tag?: Tag) => void;
    onUnmountAsync: (unmount: VoidFunction, tag?: Tag) => void;
    onClick?: MouseEventFunc | null;
    onChange?: MouseEventFunc | null;
    onFocus?: MouseEventFunc | null;
    onBlur?: MouseEventFunc | null;
    onDoubleClick?: MouseEventFunc | null;
    onMouseDown?: MouseEventFunc | null;
    onMouseUp?: MouseEventFunc | null;
    onMouseMove?: MouseEventFunc | null;
    onMouseEnter?: MouseEventFunc | null;
    onMouseLeave?: MouseEventFunc | null;
    onMouseOver?: MouseEventFunc | null;
    onMouseOut?: MouseEventFunc | null;
    onRightClick?: MouseEventFunc | null;
    onKeyUp?: MouseEventFunc | null;
    onKeyDown?: MouseEventFunc | null;
    onUpdate?: (v: string) => void | null;
    onScroll?: MouseEventFunc | null;
    onMouseWheel?: MouseEventFunc | null;
    onSubmit?: MouseEventFunc | null;
    onResize?: MouseEventFunc | null;
    _onSubmit?: MouseEventFunc | null;
    constructor(data: Partial<TagProps>);
}
declare enum bindType {
    text = "text",
    styles = "styles",
    classes = "classes",
    router = "router",
    attributes = "attributes"
}
declare let bindListen: boolean;
declare let currentTag: Tag;
declare let currentBindType: bindType;
declare let currentBindFunc: () => any;
declare let bindingChanged: boolean;
/**
 * @function
 * @template A
 * @returns {A}
 * */
declare const o: <C = any>(ref: C | (new () => C), d?: Partial<C>) => C;
declare const htmlNode: (type: string, props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const div: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const input: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const form: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const style: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const comment: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag;
declare const mountTag: (query: string, elementFunc: (...p: any[]) => Tag, data?: any) => Tag;
declare const mix: <T = any>(items?: T[] | [string, T][], unique?: boolean, subscribable?: boolean) => Mix<T>;
declare const attachUnmount: (tag: Tag, unmount: VoidFunction) => string;
declare const loop: (n: number | any[] | Mix<any>, func: (data?: any, id?: any) => TagChild[]) => TagChild[];
declare const val: (e: any, u: (v: string) => void) => NodeJS.Timeout;
declare const arrange: (props: Partial<TagProps> | TagChild[], tags: TagChild[]) => [Partial<TagProps>, TagChild[]];
declare const setDefaultStyle: (props: Partial<TagProps>, defaultStyle: string) => void;
declare const expand: (style: string | (() => string)) => string;
declare const fx: {
    dragging: boolean;
    dragData: any;
    placeholder: any;
};
declare type Tag = {
    id: string;
    parent: Tag;
    tags: Mix<Tag>;
    binds: Binds;
    bindsCache: any;
    unmounts: Mix<VoidFunction>;
    node: HTMLElement;
    props: TagProps;
    addEvent: ((eventName: string, func: (ev?: any) => void) => void);
    onCreate: VoidFunction;
    onMount: VoidFunction;
    onInit: VoidFunction;
    onUnmount: VoidFunction;
    onUnmountAsync: (u: VoidFunction) => void;
    unmount: (u?: VoidFunction) => void;
    mount: (tag: TagChild) => Tag;
    bind: (type: bindType, apply: Function) => void;
    disableBinding: VoidFunction;
};
declare const tag: (node: HTMLElement, props: TagProps, childTags: TagChild[]) => Tag;
declare type ListData = {
    ref: ((...p: any[]) => TagChild[]);
    mix: Mix;
};
declare const tagList: (props: ListData) => Tag;
declare const router: (props: () => Tag) => Tag;
declare class Pos {
    x: number;
    y: number;
}
declare type MoveData = {
    pos: Pos;
    target?: () => Tag;
    onDown?: (ev?: MouseEvent) => void;
    onMove?: (ev?: MouseEvent) => void;
    onUp?: (ev?: MouseEvent) => void;
};
declare type MoveProps = {
    translate: () => string;
    transform: () => any;
    tag: (props?: Partial<TagProps> | Tag[], tags?: Tag[]) => Tag;
};
declare const move: (props: MoveData | ((p: MoveProps) => Tag[]), tags?: (p: MoveProps) => Tag[]) => Tag;
declare class Size {
    x: number;
    y: number;
}
declare type ResizeData = {
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
declare const resize: (props: ResizeData, tags?: (p?: ResizeProps) => Tag[]) => Tag;
declare type DragData = {
    onData?: () => any;
    onStart?: () => any;
    onUp?: () => any;
    target?: () => Tag;
};
declare type DragProps = {
    translate: () => string;
    style: () => string;
    moveStyle: () => string;
    dragStyle: () => string;
    tag: (props?: Partial<TagProps> | TagChild[], tags?: Tag[]) => Tag;
};
declare const drag: (props?: DragData | ((p?: DragProps) => Tag[]), tags?: (p?: DragProps) => Tag[]) => Tag;
declare type DropData = {
    onEnter?: (data?: any) => void;
    onDrop?: (data?: any) => void;
    onData?: () => any;
};
declare type DropProps = {};
declare const drop: (props: DropData | ((p?: DropProps) => Tag[]), tag?: (p?: DropProps) => Tag[]) => Tag;
declare type SortData = {
    onStart?: (dragged?: TagChild, hovered?: TagChild) => void;
    onSort?: (dragged?: TagChild, hovered?: TagChild, after?: boolean) => void;
    onEnd?: () => void;
    mix?: Mix;
    target?: () => Tag;
};
declare type SortProps = {
    translate: () => string;
    style: () => string;
    dragStyle: () => string;
    moveStyle: () => string;
    tag: (props?: Partial<TagProps> | Tag[], tags?: Tag[]) => Tag;
};
declare const sort: (props?: SortData | ((p?: SortProps) => Tag[]), tag?: (p?: SortProps) => Tag[]) => Tag;
declare module "ts-tagjs" {
    export const htmlNode: (
        type: string,
        props: Partial<TagProps> | TagChild[],
        tags: TagChild[]
    ) => Tag
    export const comment: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const div: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const input: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const form: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const move: (props?: MoveData | ((p: MoveProps) => Tag[]), tags?: ((p: MoveProps) => Tag[])) => Tag
    export const drag: (props?: DragData | ((p?: DragProps) => Tag[]), tags?: (p?: DragProps) => Tag[]) => Tag
    export const drop: (props?: ((p?: DropProps) => Tag[]) | DropData, tag?: (p?: DropProps) => Tag[]) => Tag
    export const resize: (props?: ResizeData, tags?: (p?: ResizeProps) => Tag[]) => Tag
    export const sort: (props?: SortData | ((p?: SortProps) => Tag[]), tag?: (p?: SortProps) => Tag[]) => Tag
    export const mountTag: (
        query: string,
        elementFunc: (...p: any[]) => Tag,
        data?: any
    ) => Tag
    export const attachUnmount: (tag: Tag, unmount: VoidFunction) => any
    export const size: Size
    export const pos: Pos
    export const loop: (n: any[] | number | Mix, func: (data?: any, id?: any) => TagChild[]) => TagChild[]
    export const val: (e: any, u: (v: string) => void) => void
    export const arrange: (
        props: Partial<TagProps> | TagChild[],
        tags: TagChild[]
    ) => [Partial<TagProps>, TagChild[]]
    export const setDefaultStyle: (props: Partial<TagProps>, defaultStyle: string) => void
    export const expand: (style: string | (() => string)) => string
    export const fx: {
        dragging: boolean,
        dragData: any,
        placeholder: HTMLDivElement
    }
    export const tag: (node: HTMLElement, props: TagProps, childTags: TagChild[]) => Tag
    export const bindType: {
        text: "text",
        styles: "styles",
        classes: "classes",
        router: "router",
        attributes: "attributes"
    }
    export const o: <C = any>(/** @type {(new() => A)|A} */ref: (new () => C) | C, /** @type {A} */d?: Partial<C>) => C
    export const mix: <T = any>() => Mix<T>
}
