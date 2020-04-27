class Pos {
    public x = 0
    public y = 0
}

class Size {
    public x = 0
    public y = 0
}

const node = (
    type: string,
    props: Partial<TagProps> | TagChild[] = {},
    tags: TagChild[] = []
): Tag => {
    if (type === "document")
        return tag(
            document.implementation.createDocument("doc", "doc",
            document.implementation.createDocumentType("doc", "doc", Unit.uniqueID())
        ) as any as HTMLElement, new TagProps({}), [])
    if (type === "comment")
        return tag(
            document.createComment("Grafix Magic Here!") as any as HTMLElement,
            new TagProps(props as Partial<TagProps>), [])
    if (props instanceof Array)
        return tag(document.createElement(type), new TagProps({}), props)
    return tag(document.createElement(type), new TagProps(props), tags)
}
const mountTag = (
    query: string,
    elementFunc: (...p) => Tag,
    data?: any
): Tag => {
    const element = elementFunc(data)
    element.onInit()
    document.querySelector(query).appendChild(element.node)
    element.onMount()
    return element
}

const mix = <T = any>(
    items?: T[] | [string, T][],
    unique?: boolean,
    subscribable?: boolean
) => new Mix(items, unique, subscribable)

const attachUnmount = (tag: Tag, unmount: VoidFunction) => {
    return tag.unmounts.add(unmount)
}

const loop = (n: any[] | number | Mix, func: (data?: any, id?: any) => TagChild[]): TagChild[] => {
    if (n instanceof Mix)
        return [[n, func]]
    if (n instanceof Array) {
        const localFunc = (data?: any, index?: number) => func(data, index)
        const tags: TagChild[] = []
        for (let i = 0; i < n.length; i++)
            tags.push(...localFunc(n[i], i))
        return tags
    }
    const localFunc = (i: number) => func(i)
    const tags: TagChild[] = []
    for (let i = 0; i < n; i++)
        tags.push(...localFunc(i))
    return tags
}

const val = (e: any, u: (v: string) => void) =>
    Unit.setTimeout(() => u(e.target.value), 0, "u")

const arrange = (
    props: Partial<TagProps> | TagChild[],
    tags: TagChild[]
): [Partial<TagProps>, TagChild[]] => {
    if (typeof props === "undefined") {
        props = {}
        tags = []
    }
    else if (props instanceof Array) {
        tags = props
        props = {}
    }
    if (typeof tags === "undefined")
        tags = []
    return [props, tags]
}

const setDefaultStyle = (props: Partial<TagProps>, defaultStyle: string) => {
    const style = props.style
    props.style = () => defaultStyle + expand(style)
}

const expand = (style: string | (() => string)) => {
    if (typeof style === "undefined")
        return ""
    if (typeof style === "string")
        return style
    return style()
}

const forward = (tags: any[]): Tag => tags[0]

const filter = (feed: Partial<{ target: () => any }>, tag: Tag): Tag => {
    if (feed.target) return feed.target()
    else return tag
} 

const fx = o({
    dragging: false,
    dragData: null,
    placeholder: null
})
