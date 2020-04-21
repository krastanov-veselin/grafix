declare type DropFeed = {
    target?: () => Tag,
    onEnter?: (data?: any) => void,
    onDrop?: (data?: any) => void,
    onData?: () => any
}
declare type DropProps = {}

const drop = (feed: DropFeed, tags: (p?: DropProps) => Tag[]): Tag => {
    const props: DropProps = {}
    const tag = forward(tags(props))
    const target = filter(feed, tag)
    const mouseEnter = (ev: MouseEvent) => {
        if (!fx.dragging) return
        if (feed.onEnter) feed.onEnter(feed.onData ? feed.onData() : null)
    }
    const mouseUp = () => {
        if (!fx.dragging) return
        if (feed.onDrop) feed.onDrop(fx.dragData)
    }
    target.addEvent("mouseenter", mouseEnter)
    target.addEvent("mouseup", mouseUp)
    return tag
}
