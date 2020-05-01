const router = (props: () => TagChild): Tag => {
    const tag = comment({
        onMount: t => {
            mountID = t.id + "_selection"
            tag.bind(bindType.router, () => bind())
        }
    })
    let unmounting = false
    let mountID: string = ""
    const bind = () => {
        if (unmounting) return
        if (tag.tags.has(mountID)) {
            unmounting = true
            return tag.tags.get(mountID).unmount(() => {
                tag.tags.delete(mountID)
                unmounting = false
                bind()
            }, true)
        }
        let t = props()
        if (!t) return
        if (t instanceof Array)
            t = t[0] as any as Tag
        t = tag.mount(t, mountID)
        tag.tags.set(mountID, t)
    }
    return tag
}
