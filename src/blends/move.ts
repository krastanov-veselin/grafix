declare type MoveFeed = {
    data: Pos,
    target?: () => Tag,
    onDown?: (ev?: MouseEvent) => void,
    onMove?: (ev?: MouseEvent) => void,
    onUp?: (ev?: MouseEvent) => void
}
declare type MoveProps = {
    style: () => string,
    translate: () => string,
    transform: () => any
}
const move = (feed: MoveFeed, tags?: ((p: MoveProps) => Tag[])) => {
    const props: MoveProps = {
        translate: () => `
            translate3d(${ feed.data.x }px, ${ feed.data.y }px, 0)
        `,
        transform: () => `
            transform: ${ props.translate() };
        `,
        style: () => props.transform()
    }
    const tag = forward(tags(props))
    const target = filter(feed, tag)
    
    // Blend Logic
    const start = { x: 0, y: 0 }
    const onDown = (ev: MouseEvent) => {
        if (feed.onDown)
            feed.onDown(ev)
        start.x = ev.pageX - feed.data.x
        start.y = ev.pageY - feed.data.y
        window.onmousemove = onMove
        window.onmouseup = onUp
    }
    const onMove = (ev: MouseEvent) => {
        feed.data.x = ev.pageX - start.x
        feed.data.y = ev.pageY - start.y
        if (feed.onMove) feed.onMove(ev)
    }
    const onUp = (ev: MouseEvent) => {
        window.onmousemove = null
        window.onmouseup = null
        if (feed.onUp) feed.onUp(ev)
    }
    // ~Blend Logic
    
    target.addEvent("mousedown", onDown)
    
    return tag
}
