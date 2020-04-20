declare type DropData = {
    onEnter?: (data?: any) => void,
    onDrop?: (data?: any) => void,
    onData?: () => any
}
declare type DropProps = {}
const drop = (props: ((p?: DropProps) => Tag[]) | DropData, tag?: (p?: DropProps) => Tag[]): Tag => {
    if (props instanceof Function) {
        tag = props
        props = {}
    }
    const mouseEnter = (ev: MouseEvent) => {
        if (!fx.dragging) return
        if (props instanceof Function) return
        if (props.onEnter) props.onEnter(props.onData ? props.onData() : null)
    }
    const mouseUp = () => {
        if (!fx.dragging) return
        if (props instanceof Function) return
        if (props.onDrop) props.onDrop(fx.dragData)
    }
    const t = tag({})[0]
    const node = t.node
    node.addEventListener("mouseenter", mouseEnter, false)
    node.addEventListener("mouseup", mouseUp, false)
    attachUnmount(t, () => node.removeEventListener("mouseenter", mouseEnter, false))
    attachUnmount(t, () => node.removeEventListener("mouseup", mouseUp, false))
    return t as Tag
}
