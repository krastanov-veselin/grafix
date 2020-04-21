declare type Tag = {
    id: string
    parent: Tag
    tags: Mix<Tag>
    binds: Binds
    bindsCache: any,
    unmounts: Mix<VoidFunction>
    node: HTMLElement
    props: TagProps
    addEvent: ((eventName: string, func: (ev?: any) => void) => void)
    onCreate: VoidFunction
    onMount: VoidFunction
    onInit: VoidFunction
    onUnmount: VoidFunction
    onUnmountAsync: (u: VoidFunction) => void
    unmount: (u?: VoidFunction) => void
    mount: (tag: TagChild) => Tag
    bind: (type: bindType, apply: Function) => void
    disableBinding: VoidFunction
}

const tag = (node: HTMLElement, props: TagProps, childTags: TagChild[]): Tag => {
    const data: Tag = {
        id: Unit.uniqueID(),
        parent: null,
        tags: new Mix(),
        binds: new Mix(),
        bindsCache: {},
        unmounts: new Mix(),
        node,
        props,
        addEvent: (eventName: string, func: ((ev?: any) => void)
        ) => addEvent(eventName, func),
        onCreate: () => props.onCreate(data),
        onMount: () => props.onMount(data),
        onInit: () => props.onInit(data),
        onUnmount: () => props.onUnmount(data),
        onUnmountAsync: (u: VoidFunction) => props.onUnmountAsync(() => u(), data),
        unmount: (u?: VoidFunction) => unmount(u),
        mount: (tag: TagChild) => mountTag(tag),
        bind: (type: bindType, apply: Function) => bind(type, apply),
        disableBinding: () => disableBinding()
    }
    let originalOnSubmit: (ev: Event) => void = null
    
    if (props.onCreate) props.onCreate(data)
    
    const setupProps = (): void => {
        if (!props.onInit) props.onInit = () => {}
        if (!props.onMount) props.onMount = () => {}
        if (!props.onUnmount) props.onUnmount = () => {}
        if (!props.onUnmountAsync)
            props.onUnmountAsync = (u: VoidFunction) => u()
    }
    
    const setupName = (): void => {
        if (!data.props.name.length)
            data.props.name = Unit.uniqueID()
    }
    
    const applyNodeValue = (domProp: string, value: string): void | string => {
        if (domProp === "style")
            return data.node.style.cssText = value
        data.node[domProp] = value
    }
    
    const setupNodeProp = (type: bindType, prop: string, domProp: string): void | string => {
        if (data.node instanceof Comment) return
        if (!data.props[prop]) return
        if (typeof data.props[prop] === "string" || typeof data.props[prop] === "number")
            return (data.node as any)[domProp] = data.props[prop]
        if (data.props[prop] instanceof Function) {
            bind(type, () => applyNodeValue(domProp, data.props[prop]()))
            applyNodeValue(domProp, data.props[prop]())
            disableBinding()
        }
    }
    
    const enableBinding = (type: bindType, func: () => any): void => {
        bindingChanged = false
        currentBindType = type
        currentBindFunc = func
        currentTag = data
        bindListen = true
    }
    
    const disableBinding = (): void => {
        bindingChanged = false
        bindListen = false
        currentBindType = null
        currentBindFunc = null
        currentTag = null
    }
    
    const bind = (type: bindType, apply: Function): void => {
        enableBinding(type, () => bind(type, apply))
        apply()
        disableBinding()
    }
    
    const setupText = (): void | string =>
        setupNodeProp(bindType.text, "text", "innerText")
    const setupValue = (): void | string =>
        setupNodeProp(bindType.text, "value", "value")
    const setupStyle = (): void | string =>
        setupNodeProp(bindType.styles, "style", "style")
    const setupClasses = (): void | string =>
        setupNodeProp(bindType.classes, "classes", "className")
    
    const setupAttributes = (): void | string => {
        if (data.node instanceof Comment) return
        if (!data.props.attributes) return
        const props: string[] = []
        bind(bindType.attributes,
            () => applyAttributes(props, data.props.attributes))
        const value = data.props.attributes()
        for (const prop in value) props.push(prop)
        applyAttributes(props, value)
        disableBinding()
    }
    
    const applyAttributes = (props: string[], attributes: any): void => {
        for (let i = 0; i < props.length; i++)
            if (attributes[props[i]] === null) {
                if (data.node.hasAttribute(props[i]))
                    data.node.removeAttribute(props[i])
            }
            else if (data.node.hasAttribute(props[i])) {
                if (data.node.getAttribute(props[i]) !== attributes[props[i]])
                    data.node.setAttribute(props[i], attributes[props[i]])
            }
            else data.node.setAttribute(props[i], attributes[props[i]])
    }
    
    const setupEvents = (): void => {
        if (data.props.onUpdate) data.props.onKeyDown = e => val(e, v => data.props.onUpdate(v))
        if (data.props.onClick) data.node.addEventListener("click", data.props.onClick, false)
        if (data.props.onChange) data.node.addEventListener("change", data.props.onChange, false)
        if (data.props.onFocus) data.node.addEventListener("focus", data.props.onFocus, false)
        if (data.props.onBlur) data.node.addEventListener("blur", data.props.onBlur, false)
        if (data.props.onDoubleClick) data.node.addEventListener("dblclick", data.props.onDoubleClick, false)
        if (data.props.onMouseDown) data.node.addEventListener("mousedown", data.props.onMouseDown, false)
        if (data.props.onMouseUp) data.node.addEventListener("mouseup", data.props.onMouseUp, false)
        if (data.props.onMouseMove) data.node.addEventListener("mousemove", data.props.onMouseMove, false)
        if (data.props.onMouseEnter) data.node.addEventListener("mouseenter", data.props.onMouseEnter, false)
        if (data.props.onMouseLeave) data.node.addEventListener("mouseleave", data.props.onMouseLeave, false)
        if (data.props.onMouseOver) data.node.addEventListener("mouseover", data.props.onMouseOver, false)
        if (data.props.onMouseOut) data.node.addEventListener("mouseout", data.props.onMouseOut, false)
        if (data.props.onRightClick) data.node.addEventListener("contextmenu", data.props.onRightClick, false)
        if (data.props.onKeyUp) data.node.addEventListener("keyup", data.props.onKeyUp, false)
        if (data.props.onKeyDown) data.node.addEventListener("keydown", data.props.onKeyDown, false)
        if (data.props.onScroll) data.node.addEventListener("scroll", data.props.onScroll, false)
        if (data.props.onMouseWheel) data.node.addEventListener("mousewheel", data.props.onMouseWheel, false)
        if (data.props.onSubmit) {
            originalOnSubmit = data.props.onSubmit
            data.props.onSubmit = (ev: Event) => {
                originalOnSubmit(ev)
                ev.preventDefault()
            }
            data.node.addEventListener("submit", data.props.onSubmit, false)
        }
        if (data.props.onResize) data.node.addEventListener("resize", data.props.onResize, false)
    }
    
    const cleanEvents = (): void => {
        if (data.props.onClick) data.node.removeEventListener("click", data.props.onClick, false)
        if (data.props.onChange) data.node.removeEventListener("change", data.props.onChange, false)
        if (data.props.onFocus) data.node.removeEventListener("focus", data.props.onFocus, false)
        if (data.props.onBlur) data.node.removeEventListener("blur", data.props.onBlur, false)
        if (data.props.onDoubleClick) data.node.removeEventListener("dblclick", data.props.onDoubleClick, false)
        if (data.props.onMouseDown) data.node.removeEventListener("mousedown", data.props.onMouseDown, false)
        if (data.props.onMouseUp) data.node.removeEventListener("mouseup", data.props.onMouseUp, false)
        if (data.props.onMouseMove) data.node.removeEventListener("mousemove", data.props.onMouseMove, false)
        if (data.props.onMouseEnter) data.node.removeEventListener("mouseenter", data.props.onMouseEnter, false)
        if (data.props.onMouseLeave) data.node.removeEventListener("mouseleave", data.props.onMouseLeave, false)
        if (data.props.onMouseOver) data.node.removeEventListener("mouseover", data.props.onMouseOver, false)
        if (data.props.onMouseOut) data.node.removeEventListener("mouseout", data.props.onMouseOut, false)
        if (data.props.onRightClick) data.node.removeEventListener("contextmenu", data.props.onRightClick, false)
        if (data.props.onKeyUp) data.node.removeEventListener("keyup", data.props.onKeyUp, false)
        if (data.props.onKeyDown) data.node.removeEventListener("keydown", data.props.onKeyDown, false)
        if (data.props.onScroll) data.node.removeEventListener("scroll", data.props.onScroll, false)
        if (data.props.onMouseWheel) data.node.removeEventListener("mousewheel", data.props.onMouseWheel, false)
        if (data.props.onSubmit) data.node.removeEventListener("submit", data.props.onSubmit, false)
        if (data.props.onResize) data.node.removeEventListener("resize", data.props.onResize, false)
        if (originalOnSubmit) originalOnSubmit = null
    }
    
    const addEvent = (eventName: string, func: (ev?: any) => void): void => {
        data.node.addEventListener(eventName, func, false)
        data.unmounts.add(() => data.node.removeEventListener(eventName, func, false))
    }
    
    const cleanSubscriptions = (): void => {
        data.binds.foreach(obj =>
        obj.foreach((prop, propName) =>
        prop.foreach(binding =>
            binding.objBinds.get(propName).delete(binding.id)
        )))
    }
    
    const mountTags = (tags?: TagChild[]): void => {
        for (let i = 0; i < tags.length; i++) {
            const tag = mountTag(tags[i])
            data.tags.set(tag.id, tag)
        }
    }
    
    const mountTag = (rawTag: TagChild): Tag => {
        let tag: Tag = null
        if (rawTag instanceof Array)
            tag = tagList({
                ref: rawTag[1],
                mix: rawTag[0]
            })
        else if (rawTag instanceof Function)
            tag = router(rawTag)
        else {
            tag = rawTag
            if (tag.node instanceof HTMLFormElement &&
                data.node instanceof HTMLElement
            ) {
                const submit = document.createElement("input")
                submit.type = "submit"
                submit.style.display = "none"
                tag.node.appendChild(submit)
                data.node.appendChild(tag.node)
            }
        }
        tag.parent = data
        tag.onInit()
        if (data.node instanceof Comment)
            data.node.parentNode.insertBefore(tag.node, data.node)
        else data.node.appendChild(tag.node)
        tag.onMount()
        return tag as Tag
    }
    
    const unmount = (u?: VoidFunction): void => {
        data.onUnmountAsync(() => {
            data.onUnmount()
            data.unmounts.foreach(u => u())
            if (data.tags.size)
                data.tags.foreach(t => t.unmount(() => {
                    if (!data.tags.size) continueUnmount(u)
                }))
            else continueUnmount(u)
        })
    }
    
    const continueUnmount = (u?: VoidFunction): void => {
        cleanEvents()
        cleanSubscriptions()
        unmountFromParent()
        if (u) u()
    }
    
    const unmountFromParent = () => {
        data.node.parentNode.removeChild(data.node)
        if (data.parent) data.parent.tags.delete(data.id)
    }
    
    setupProps()
    setupName()
    setupText()
    setupValue()
    setupStyle()
    setupClasses()
    setupAttributes()
    setupEvents()
    mountTags(childTags)
    
    return data
}
