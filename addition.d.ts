declare module "ts-tagjs" {
    export const htmlNode: (
        type: string,
        props: Partial<TagProps> | TagChild[],
        tags: TagChild[]
    ) => Tag
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