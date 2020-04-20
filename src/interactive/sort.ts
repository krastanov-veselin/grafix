declare type SortData = {
    onStart?: (dragged?: TagChild, hovered?: TagChild) => void
    onSort?: (dragged?: TagChild, hovered?: TagChild, after?: boolean) => void
    onEnd?: () => void
    mix?: Mix,
    target?: () => Tag
}
declare type SortProps = {
    // Drag props
    translate: () => string
    style: () => string
    dragStyle: () => string
    moveStyle: () => string
    tag: (props?: Partial<TagProps> | Tag[], tags?: Tag[]) => Tag
    // Drop props
}
const sort = (props?: SortData | ((p?: SortProps) => Tag[]), tag?: (p?: SortProps) => Tag[]): Tag => {
    if (props instanceof Function) {
        tag = props
        props = {}
    }
    const p: SortData = props
    const onEnter = (data: any) => {
        if (!(fx.placeholder instanceof HTMLDivElement)) return
        const node = t.node
        if (node.parentNode !== fx.placeholder.parentNode) return
        const after = (node.compareDocumentPosition(fx.placeholder) & 0x02) !== 0
        if (p.mix) {
            const hoveredTag = t
            const draggingTag = fx.dragData
            if (
                !p.mix.has(hoveredTag.props.name) ||
                !p.mix.has(draggingTag.props.name)
            ) return
            if (after)
                if (hoveredTag.props.name === p.mix.lastID())
                    p.mix.sort(draggingTag.props.name, null)
                else p.mix.sort(draggingTag.props.name, p.mix.getNode(hoveredTag.props.name).next.id)
            else p.mix.sort(draggingTag.props.name, hoveredTag.props.name)
        }
        else if (after) {
            if (node.nextSibling)
                fx.placeholder.parentNode.insertBefore(fx.placeholder, node.nextSibling)
            else fx.placeholder.parentNode.appendChild(fx.placeholder)
        }
        else fx.placeholder.parentNode.insertBefore(fx.placeholder, node)
        if (p.onSort) p.onSort(fx.dragData, t, after)
    }
    let t: Tag = null
    return drag({onStart: () => p.onStart(fx.dragData, t), onData: () => t, target: p.target}, (dragProps) => [
        drop({onEnter, onData: () => t}, (dropProps) => [
            t = tag({
                translate: dragProps.translate,
                tag: dragProps.tag,
                style: dragProps.style,
                moveStyle: dragProps.moveStyle,
                dragStyle: dragProps.style
            })[0]
        ])
    ])
}
