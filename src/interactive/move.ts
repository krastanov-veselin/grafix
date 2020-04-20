class Pos {
    public x = 0
    public y = 0
}
declare type MoveData = {
    pos: Pos,
    target?: () => Tag,
    onDown?: (ev?: MouseEvent) => void,
    onMove?: (ev?: MouseEvent) => void,
    onUp?: (ev?: MouseEvent) => void
}
declare type MoveProps = {
    translate: () => string,
    transform: () => any,
    tag: (props?: Partial<TagProps> | Tag[], tags?: Tag[]) => Tag
}
const move = (props: MoveData | ((p: MoveProps) => Tag[]), tags?: ((p: MoveProps) => Tag[])) => {
    if (props instanceof Function) {
        tags = props
        props = {
            pos: o(Pos)
        }
    }
    const localProps: MoveData = props
    const start = {
        x: 0,
        y: 0
    }
    const onDown = (ev: MouseEvent) => {
        if (localProps.onDown)
            localProps.onDown(ev)
        start.x = ev.pageX - localProps.pos.x
        start.y = ev.pageY - localProps.pos.y
        window.onmousemove = onMove
        window.onmouseup = onUp
    }
    const onMove = (ev: MouseEvent) => {
        localProps.pos.x = ev.pageX - start.x
        localProps.pos.y = ev.pageY - start.y
        if (localProps.onMove)
            localProps.onMove(ev)
    }
    const onUp = (ev: MouseEvent) => {
        window.onmousemove = null
        window.onmouseup = null
        if (localProps.onUp)
            localProps.onUp(ev)
    }
    const tag = tags({
        translate: () => "translate3d(" + localProps.pos.x + "px, " + localProps.pos.y + "px, 0)",
        transform: () => `
            transform: translate3d(${localProps.pos.x}px, ${localProps.pos.y}px, 0);
        `,
        tag: (p?: Partial<TagProps> | TagChild[], tags?: TagChild[]) => {
            const style = () => `
                transform: translate3d(${localProps.pos.x}px, ${localProps.pos.y}px, 0);
            `
            if (p instanceof Array) {
                tags = p
                p = new TagProps({style})
            }
            else if (p)
                if (p.style) {
                    const oldStyle = p.style instanceof Function ? p.style() : p.style
                    p.style = () => `
                        transform: translate3d(${localProps.pos.x}px, ${localProps.pos.y}px, 0);
                        ${oldStyle}
                    `
                }
                else p.style = style
            if (!localProps)
                p = new TagProps({style})
            return div(p, tags)
        }
    })[0]
    const target = props.target ? props.target() : tag
    target.node.addEventListener("mousedown", onDown, false)
    target.unmounts.add(() => target.node.removeEventListener("mousedown", onDown, false))
    return tag
}
