const router = (props: (route: RouteFunc) => () => TagChild): Tag => {
    const tag = comment({
        onMount: () => {
            bind()
        }
    })
    let unmounting = false
    let lastAsyncName = ""
    let shouldContinue = false
    const bind = () => {
        if (unmounting) return
        
        shouldContinue = true
        if (!bindListen) enableBinding(bindType.router, tag, () => bind())
        let tFunc = props((tag: () => TagChild, name?: string) => {
            if (name && name === lastAsyncName)
                return shouldContinue = false
            lastAsyncName = ""
            unmount((result: boolean) => {
                if (result) return bind()
                lastAsyncName = name
                const t = tag()
                mount(t)
                if (!t) lastAsyncName = ""
            })
            shouldContinue = false
        })
        if (bindListen) disableBinding()
        if (!shouldContinue) return
        if (
            typeof tFunc === "string" ||
            typeof tFunc === "number"
        ) return
        
        unmount((result: boolean) => {
            lastAsyncName = ""
            if (result) return bind()
            if (!tFunc) return
            if (!(tFunc instanceof Function))
                return console.error(
                    "As of Grafix 1.1.0 routers must return a lambda, e.g. () => div() " +
                    "in order to prevent unwanted autobinding propagation.")
            mount(tFunc())
        })
    }
    const unmount = (ready: (result: boolean) => void) => {
        if (tag.tags.size) {
            unmounting = true
            return tag.tags.aforeach((next, t) =>
                t.unmount(() => {
                    tag.tags.delete(t.id)
                    unmounting = false
                    ready(true)
                }, true))
        }
        else ready(false)
    }
    const mount = (t: TagChild) => {
        if (bindListen) disableBinding()
        if (!t) return lastAsyncName = ""
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
