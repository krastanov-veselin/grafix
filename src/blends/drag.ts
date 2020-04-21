declare type DragFeed = {
    data?: Pos
    target?: () => Tag,
    onData?: () => any,
    onStart?: () => any,
    onUp?: () => any
}
declare type DragProps = {
    translate: () => string,
    style: () => string,
    moveStyle: () => string,
    dragStyle: () => string
    transform: () => string
}
const drag = (feed: DragFeed, tags: (p?: DragProps) => Tag[]): Tag => {
    if (!feed.data) feed.data = o(Pos)
    const state = o({
        style: ""
    })
    let node: HTMLElement = null
    let placeholder: HTMLDivElement = null
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
        state.style = `
            position: absolute;
            left: ${rect.left +  + document.body.scrollLeft}px;
            top: ${rect.top + document.body.scrollTop}px;
            pointer-events: none;
        `
        document.body.append(node)
        fx.dragging = true
        if (!(feed instanceof Function))
            if (feed.onData)
                fx.dragData = feed.onData()
    }
    const onUp = () => {
        fx.dragging = false
        placeholder.replaceWith(node)
        state.style = ""
        node = null
        fx.placeholder = null
        placeholder = null
        feed.data.x = 0
        feed.data.y = 0
        if (fx.dragData) fx.dragData = null
    }
    const tag = move({
        data: feed.data,
        onDown, onUp,
        target: feed.target
    }, ({
        style: moveStyle,
        transform,
        translate
    }) =>
        tags({
            style: () => moveStyle() + state.style,
            translate,
            dragStyle: () => state.style,
            moveStyle,
            transform
        }))
    return tag
}
