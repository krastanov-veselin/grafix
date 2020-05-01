const router = (props: () => TagChild): Tag => {
    const tag = comment({
        onMount: t => {
            tag.bind(bindType.router, () => bind())
        }
    })
    let unmounting = false
    let count = 0
    const bind = () => {
        if (unmounting) return
        if (count)
            if (!tag.tags.size) count = 0
            else {
                for (let i = 0; i < count; i++) {
                    const id = i.toString()
                    if (!tag.tags.has(id)) continue
                    unmounting = true
                    tag.tags.get(id).unmount(() => {
                        tag.tags.delete(id)
                        unmounting = false
                        bind()
                    }, true)
                    break
                }
                return
            }
        let t = props()
        if (!t) return
        if (t instanceof Array && !t.length) return
        if (t instanceof Array && t[0] instanceof Array)
            t = t[0] as any as Tag
        if (!(t instanceof Array)) t = [t]
        for (let i = 0; i < (t as []).length; i++) {
            const id = i.toString()
            t[i] = tag.mount((t as [])[i], id)
            tag.tags.set(id, (t as [])[i])
        }
        count = t.length
    }
    return tag
}
