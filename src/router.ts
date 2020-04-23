const router = (props: () => Tag): Tag => {
    const tag = comment()
    let unmounting = false
    const bind = () => {
        if (unmounting) return
        if (tag.tags.has("selection")) {
            unmounting = true
            return tag.tags.get("selection").unmount(() => {
                unmounting = false
                bind()
            })
        }
        let t = props()
        if (t instanceof Array) t = t[0]
        if (!t) return
        t = tag.mount(t)
        t.id = "selection"
        t.props.name = "selection"
        tag.tags.set(t.id, t)
    }
    tag.onMount = () => {
        tag.bind(bindType.router, () => bind())
    }
    return tag
}
