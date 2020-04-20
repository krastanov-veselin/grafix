declare type DragData = {
    onData?: () => any,
    onStart?: () => any,
    onUp?: () => any,
    target?: () => Tag
}
declare type DragProps = {
    translate: () => string,
    style: () => string,
    moveStyle: () => string,
    dragStyle: () => string,
    tag: (props?: Partial<TagProps> | TagChild[], tags?: Tag[]) => Tag
}
const drag = (props?: DragData | ((p?: DragProps) => Tag[]), tags?: (p?: DragProps) => Tag[]): Tag => {
    if (props instanceof Function) {
        tags = props
        props = {}
    }
    const pos = o(Pos)
    let node: HTMLElement = null
    let placeholder: HTMLDivElement = null
    let position = null
    let top = null
    let left = null
    let style = o({
        value: ""
    })
    const onDown = (ev: MouseEvent) => {
        node = tag.node
        if (!node) return
        const rect = node.getBoundingClientRect()
        const css = window.getComputedStyle(node)
        placeholder = document.createElement("div")
        fx.placeholder = placeholder
        placeholder.style.width = rect.width + "px"
        placeholder.style.height = rect.height + "px"
        if (css.float || node.style.float)
            placeholder.style.float = (css.float || node.style.float)
        node.parentNode.insertBefore(placeholder, node)
        style.value = `
            position: absolute;
            left: ${rect.left +  + document.body.scrollLeft}px;
            top: ${rect.top + document.body.scrollTop}px;
            pointer-events: none;
        `
        document.body.append(node)
        fx.dragging = true
        if (!(props instanceof Function))
            if (props.onData)
                fx.dragData = props.onData()
    }
    const onUp = () => {
        fx.dragging = false
        placeholder.replaceWith(node)
        style.value = ``
        node = null
        fx.placeholder = null
        placeholder = null
        pos.x = 0
        pos.y = 0
        if (fx.dragData) fx.dragData = null
    }
    const tag = move({pos, onDown, onUp, target: props.target}, ({transform: moveStyle, tag, translate}) => tags({
        style: () => moveStyle() + style.value,
        tag,
        translate,
        dragStyle: () => style.value,
        moveStyle
    }))
    return tag
}
