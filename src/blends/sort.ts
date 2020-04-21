declare type SortFeed = {
    onStart?: (dragged?: TagChild, hovered?: TagChild) => void
    onSort?: (dragged?: TagChild, hovered?: TagChild, after?: boolean) => void
    onEnd?: () => void
    data?: Mix,
    target?: () => Tag
}
declare type SortProps = {
    translate: () => string
    style: () => string
    dragStyle: () => string
    moveStyle: () => string
}
const sort = (feed: SortFeed, tags: (p?: SortProps) => Tag[]): Tag => {
    const onEnter = (data: any) => {
        if (!(fx.placeholder instanceof HTMLDivElement)) return
        const node = tag.node
        if (node.parentNode !== fx.placeholder.parentNode) return
        const after = (node.compareDocumentPosition(fx.placeholder) & 0x02) !== 0
        if (feed.data) {
            const hoveredTag = tag
            const draggingTag = fx.dragData
            if (
                !feed.data.has(hoveredTag.props.name) ||
                !feed.data.has(draggingTag.feed.name)
            ) return
            if (after)
                if (hoveredTag.props.name === feed.data.lastID())
                    feed.data.sort(draggingTag.feed.name, null)
                else feed.data.sort(draggingTag.feed.name, feed.data.getNode(hoveredTag.props.name).next.id)
            else feed.data.sort(draggingTag.feed.name, hoveredTag.props.name)
        }
        else if (after) {
            if (node.nextSibling)
                fx.placeholder.parentNode.insertBefore(fx.placeholder, node.nextSibling)
            else fx.placeholder.parentNode.appendChild(fx.placeholder)
        }
        else fx.placeholder.parentNode.insertBefore(fx.placeholder, node)
        if (feed.onSort) feed.onSort(fx.dragData, tag, after)
    }
    const tag = drag({
        onStart: () => feed.onStart(fx.dragData, tag),
        onData: () => tag,
        target: feed.target
    }, (dragProps) => [
        drop({onEnter, onData: () => tag}, () => [
            forward(tags({
                translate: dragProps.translate,
                style: dragProps.style,
                moveStyle: dragProps.moveStyle,
                dragStyle: dragProps.style
            }))
        ])
    ])
    return tag
}
