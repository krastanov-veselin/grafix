const router = (props: () => Tag): Tag => {
    const tag = comment()
    let unmounting = false
    const bind = () => {
        if (unmounting) return
        let t = props()
        if (t instanceof Array) t = t[0]
        if (tag.tags.has("selection"))
            tag.tags.get("selection").unmount()
        if (!t) return
        t = tag.mount(t)
        t.id = "selection"
        t.props.name = "selection"
        tag.tags.set(t.id, t)
    }
    tag.onMount = () => {
        tag.bind(bindType.router, () => bind())
        bind()
        tag.disableBinding()
    }
    return tag
}
