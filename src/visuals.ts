interface StylesData {
    bindsCache: any
    binds: Binds
}
interface StyleNode {
    data: StylesData
    node: HTMLStyleElement
}
const styles: Mix<StyleNode> = new Mix()
const mountStyle = (name: string, val: Function): HTMLElement => {
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
    return node
}
const unmountStyle = (name: string): void => {
    if (!styles.has(name)) return
    cleanBinding(styles.get(name).data)
    document.head.removeChild(styles.get(name).node)
    styles.delete(name)
}
const visuals: any = new Proxy({}, {
    defineProperty: (obj, p, v) => {
        obj[p] = mountStyle(p as string, v.value)
        return true
    },
    deleteProperty: (obj, p) => {
        delete obj[p]
        unmountStyle(p as string)
        return true
    }
})
