interface StylesData {
    bindsCache: any
    binds: Binds
}
interface StyleNode {
    data: StylesData
    node: HTMLStyleElement
}
const styles: Mix<StyleNode> = new Mix()
const mountStyle = (name: string, val: Function): void => {
    if (styles.has(name)) return
    const node = document.createElement("style")
    node.type = "text/css"
    const data: StylesData = {
        bindsCache: {},
        binds: new Mix()
    }
    bind(bindType.css, data, () => node.innerHTML = val())
    styles.set(name, {
        data,
        node
    })
    document.head.appendChild(node)
}
const unmountStyle = (name: string): void => {
    if (!styles.has(name)) return
    cleanSubscriptions(styles.get(name).data)
    document.head.removeChild(styles.get(name).node)
    styles.delete(name)
}
const visuals: any = new Proxy({}, {
    defineProperty: (t, p, a) => {
        t[p] = null
        mountStyle(p as string, a.value)
        return true
    },
    deleteProperty: (t, p) => {
        delete t[p]
        unmountStyle(p as string)
        return true
    }
})
