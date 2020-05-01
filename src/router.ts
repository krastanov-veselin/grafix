const router = (props: () => TagChild): Tag => {
    const tag = comment({
        onMount: t => {
            tag.bind(bindType.router, () => bind())
        }
    })
    const bind = () => {
        if (tag.tags.size)
            return tag.tags.aforeach((next, t) =>
                t.unmount(() => {
                    tag.tags.delete(t.id)
                    next()
                }, true), () => bind())
        let t = props()
        if (!t) return
        if (t instanceof Array && !t.length) return
        if (!(t instanceof Array)) t = [t]
        for (let i = 0; i < t.length; i++) {
            const id = i.toString()
            t[i] = tag.mount(t[i] as Tag, id)
            tag.tags.set(id, t[i] as Tag)
        }
    }
    return tag
}
