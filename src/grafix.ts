module.exports = {
    node,
    // Html Nodes
    comment,
    a,
    abbr,
    acronym,
    address,
    applet,
    area,
    article,
    aside,
    audio,
    b,
    base,
    basefont,
    bdi,
    bdo,
    big,
    blockquote,
    body,
    br,
    button,
    canvas,
    cite,
    code,
    col,
    colgroup,
    data,
    datalist,
    dd,
    del,
    details,
    dfn,
    dialog,
    dir,
    div,
    dl,
    dt,
    em,
    embed,
    fieldset,
    figcaption,
    figure,
    font,
    footer,
    form,
    frame,
    frameset,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    head,
    header,
    hr,
    i,
    iframe,
    img,
    input,
    ins,
    kbd,
    label,
    legend,
    li,
    link,
    main,
    map,
    mark,
    meta,
    meter,
    nav,
    noframes,
    noscript,
    object,
    ol,
    optgroup,
    option,
    p,
    param,
    picture,
    pre,
    progress,
    q,
    rp,
    rt,
    ruby,
    s,
    samp,
    script,
    section,
    select,
    small,
    source,
    span,
    strike,
    strong,
    style,
    sub,
    svg,
    table,
    tbody,
    td,
    template,
    textarea,
    tfoot,
    th,
    thead,
    time,
    title,
    tr,
    track,
    tt,
    u,
    ul,
    htmlVar,
    video,
    
    move,
    drag,
    drop,
    resize,
    sort,
    mountTag,
    attachUnmount,
    size: Size,
    pos: Pos,
    loop,
    val,
    arrange,
    setDefaultStyle,
    expand,
    fx,
    tag,
    bindType,
    mix,
    o,
    forward,
    filter
}
declare module "grafix" {
    export const node: (
        type: string,
        props: Partial<TagProps> | TagChild[],
        tags: TagChild[]
    ) => Tag
    
    // Html Nodes
    export const comment: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const a: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const abbr: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const acronym: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const address: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const applet: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const area: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const article: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const aside: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const audio: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const b: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const base: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const basefont: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const bdi: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const bdo: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const big: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const blockquote: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const body: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const br: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const button: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const canvas: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const cite: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const code: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const col: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const colgroup: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const data: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const datalist: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const dd: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const del: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const details: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const dfn: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const dialog: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const dir: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const div: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const dl: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const dt: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const em: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const embed: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const fieldset: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const figcaption: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const figure: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const font: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const footer: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const form: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const frame: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const frameset: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const h1: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const h2: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const h3: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const h4: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const h5: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const h6: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const head: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const header: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const hr: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const i: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const iframe: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const img: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const input: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const ins: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const kbd: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const label: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const legend: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const li: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const link: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const main: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const map: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const mark: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const meta: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const meter: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const nav: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const noframes: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const noscript: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const object: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const ol: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const optgroup: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const option: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const p: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const param: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const picture: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const pre: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const progress: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const q: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const rp: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const ruby: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const s: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const samp: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const script: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const section: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const select: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const small: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const source: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const span: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const strike: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const strong: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const style: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const sub: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const svg: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const table: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const tbody: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const td: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const template: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const textarea: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const tfoot: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const th: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const thead: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const time: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const title: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const tr: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const track: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const tt: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const u: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const ul: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const htmlVar: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    export const video: (props?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => Tag
    
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
    export const forward: (tags: TagChild[]) => Tag
    export const filter: (feed: Partial<{ target: Tag }>, tag: Tag) => Tag
}
