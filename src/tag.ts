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
    const setupProps = (): void => {
        if (!props.onInit) props.onInit = () => {}
        if (!props.onMount) props.onMount = () => {}
        if (!props.onUnmount) props.onUnmount = () => {}
        if (!props.onUnmountAsync)
            props.onUnmountAsync = (u: VoidFunction) => u()
    }
    
    setupProps()
    
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
    
    const setupName = (): void => {
        if (!data.props.name.length)
            data.props.name = Unit.uniqueID()
    }
    
    const applyNodeValue = (domProp: string, value: string): void | string => {
        if (domProp === "style")
            return data.node.style.cssText = value
        if (domProp === "className")
            return data.node[domProp] = value.trim()
        data.node[domProp] = value
    }
    
    const setupNodeProp = (type: bindType, prop: string, domProp: string): void | string => {
        if (data.node instanceof Comment) return
        if (!data.props[prop]) return
        if (typeof data.props[prop] === "string" || typeof data.props[prop] === "number")
            return applyNodeValue(domProp, data.props[prop])
        if (data.props[prop] instanceof Function) {
            bind(type, () => applyNodeValue(domProp, data.props[prop]()))
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
    const setupPlaceholder = () =>
        setupAttribute("placeholder", "placeholder")
    const setupType = () =>
        setupAttribute("type", "type")
    
    const setupAttribute = (name: string, prop: string) => {
        if (data.node instanceof Comment) return
        if (!data.props[prop]) return
        bind(bindType.attributes,
            () => applyAttribute(name, data.props[prop]))
    }
    
    const applyAttribute = (name: string, val: string | (() => string)) => {
        let value: string
        if (typeof val === "string")
            value = val
        else value = val()
        if (!value) return data.node.removeAttribute(name)
        data.node.setAttribute(name, value)
    }
    
    const setupAttributes = (): void | string => {
        if (data.node instanceof Comment) return
        if (!data.props.attributes) return
        const props: string[] = []
        const value = data.props.attributes()
        for (const prop in value) props.push(prop)
        bind(bindType.attributes,
            () => applyAttributes(props, data.props.attributes()))
    }
    
    const applyAttributes = (props: string[], attributes: any): void => {
        for (let i = 0; i < props.length; i++) {
            let value = null
            if (attributes[props[i]] instanceof Function)
                value = attributes[props[i]]()
            else if (typeof attributes[props[i]] === "string")
                value = attributes[props[i]]
            if (value === null) {
                if (data.node.hasAttribute(props[i]))
                    data.node.removeAttribute(props[i])
            }
            else if (data.node.hasAttribute(props[i])) {
                if (data.node.getAttribute(props[i]) !== value)
                    data.node.setAttribute(props[i], value)
            }
            else data.node.setAttribute(props[i], value)
        }
    }
    
    const setupEvents = (): void => {
        // Custom Events
        if (data.props.onUpdate) data.props.onKeyDown = e => val(e, v => data.props.onUpdate(v))
        // DOM Events
        if (data.props.onAbort) data.node.addEventListener("abort", data.props.onAbort, false)
        if (data.props.onAfterPrint) data.node.addEventListener("afterprint", data.props.onAfterPrint, false)
        if (data.props.onAnimationEnd) data.node.addEventListener("animationend", data.props.onAnimationEnd, false)
        if (data.props.onAnimationIteration) data.node.addEventListener("animationiteration", data.props.onAnimationIteration, false)
        if (data.props.onAnimationStart) data.node.addEventListener("animationstart", data.props.onAnimationStart, false)
        if (data.props.onBeforePrint) data.node.addEventListener("beforeprint", data.props.onBeforePrint, false)
        if (data.props.onBeforeUnload) data.node.addEventListener("beforeunload", data.props.onBeforeUnload, false)
        if (data.props.onBlur) data.node.addEventListener("blur", data.props.onBlur, false)
        if (data.props.onCanPlay) data.node.addEventListener("canplay", data.props.onCanPlay, false)
        if (data.props.onCanPlayThough) data.node.addEventListener("canplaythrough", data.props.onCanPlayThough, false)
        if (data.props.onChange) data.node.addEventListener("change", data.props.onChange, false)
        if (data.props.onClick) data.node.addEventListener("click", data.props.onClick, false)
        if (data.props.onContextMenu) data.node.addEventListener("contextmenu", data.props.onContextMenu, false)
        if (data.props.onCopy) data.node.addEventListener("copy", data.props.onCopy, false)
        if (data.props.onCut) data.node.addEventListener("cut", data.props.onCut, false)
        if (data.props.onDoubleClick) data.node.addEventListener("dblclick", data.props.onDoubleClick, false)
        if (data.props.onDrag) data.node.addEventListener("drag", data.props.onDrag, false)
        if (data.props.onDragEnd) data.node.addEventListener("dragend", data.props.onDragEnd, false)
        if (data.props.onDragEnter) data.node.addEventListener("dragenter", data.props.onDragEnter, false)
        if (data.props.onDragLeave) data.node.addEventListener("dragleave", data.props.onDragLeave, false)
        if (data.props.onDragOver) data.node.addEventListener("dragover", data.props.onDragOver, false)
        if (data.props.onDragStart) data.node.addEventListener("dragstart", data.props.onDragStart, false)
        if (data.props.onDrop) data.node.addEventListener("drop", data.props.onDrop, false)
        if (data.props.onDurationChange) data.node.addEventListener("durationchange", data.props.onDurationChange, false)
        if (data.props.onEnded) data.node.addEventListener("ended", data.props.onEnded, false)
        if (data.props.onError) data.node.addEventListener("error", data.props.onError, false)
        if (data.props.onFocus) data.node.addEventListener("focus", data.props.onFocus, false)
        if (data.props.onFocusIn) data.node.addEventListener("focusin", data.props.onFocusIn, false)
        if (data.props.onFocusOut) data.node.addEventListener("focusout", data.props.onFocusOut, false)
        if (data.props.onFullScreenChange) data.node.addEventListener("fullscreenchange", data.props.onFullScreenChange, false)
        if (data.props.onFullScreenError) data.node.addEventListener("fullscreenerror", data.props.onFullScreenError, false)
        if (data.props.onHashChange) data.node.addEventListener("hashchange", data.props.onHashChange, false)
        if (data.props.onInput) data.node.addEventListener("input", data.props.onInput, false)
        if (data.props.onKeyDown) data.node.addEventListener("keydown", data.props.onKeyDown, false)
        if (data.props.onKeyPress) data.node.addEventListener("keypress", data.props.onKeyPress, false)
        if (data.props.onKeyUp) data.node.addEventListener("keyup", data.props.onKeyUp, false)
        if (data.props.onLoad) data.node.addEventListener("load", data.props.onLoad, false)
        if (data.props.onLoadedData) data.node.addEventListener("loadeddata", data.props.onLoadedData, false)
        if (data.props.onLoadedMetaData) data.node.addEventListener("loadedmetadata", data.props.onLoadedMetaData, false)
        if (data.props.onLoadStart) data.node.addEventListener("loadstart", data.props.onLoadStart, false)
        if (data.props.onMessage) data.node.addEventListener("message", data.props.onMessage, false)
        if (data.props.onMouseDown) data.node.addEventListener("mousedown", data.props.onMouseDown, false)
        if (data.props.onMouseEnter) data.node.addEventListener("mouseenter", data.props.onMouseEnter, false)
        if (data.props.onMouseLeave) data.node.addEventListener("mouseleave", data.props.onMouseLeave, false)
        if (data.props.onMouseMove) data.node.addEventListener("mousemove", data.props.onMouseMove, false)
        if (data.props.onMouseOver) data.node.addEventListener("mouseover", data.props.onMouseOver, false)
        if (data.props.onMouseOut) data.node.addEventListener("mouseout", data.props.onMouseOut, false)
        if (data.props.onMouseUp) data.node.addEventListener("mouseup", data.props.onMouseUp, false)
        if (data.props.onMouseWheel) data.node.addEventListener("mousewheel", data.props.onMouseWheel, false)
        if (data.props.onOffline) data.node.addEventListener("offline", data.props.onOffline, false)
        if (data.props.onOnline) data.node.addEventListener("online", data.props.onOnline, false)
        if (data.props.onOpen) data.node.addEventListener("open", data.props.onOpen, false)
        if (data.props.onPageHide) data.node.addEventListener("pagehide", data.props.onPageHide, false)
        if (data.props.onPageShow) data.node.addEventListener("pageshow", data.props.onPageShow, false)
        if (data.props.onPaste) data.node.addEventListener("paste", data.props.onPaste, false)
        if (data.props.onPause) data.node.addEventListener("pause", data.props.onPause, false)
        if (data.props.onPlay) data.node.addEventListener("play", data.props.onPlay, false)
        if (data.props.onPlaying) data.node.addEventListener("playing", data.props.onPlaying, false)
        if (data.props.onPopState) data.node.addEventListener("popstate", data.props.onPopState, false)
        if (data.props.onProgress) data.node.addEventListener("progress", data.props.onProgress, false)
        if (data.props.onRateChange) data.node.addEventListener("ratechange", data.props.onRateChange, false)
        if (data.props.onResize) data.node.addEventListener("resize", data.props.onResize, false)
        if (data.props.onReset) data.node.addEventListener("reset", data.props.onReset, false)
        if (data.props.onScroll) data.node.addEventListener("scroll", data.props.onScroll, false)
        if (data.props.onSearch) data.node.addEventListener("search", data.props.onSearch, false)
        if (data.props.onSeeked) data.node.addEventListener("seeked", data.props.onSeeked, false)
        if (data.props.onSelect) data.node.addEventListener("select", data.props.onSelect, false)
        if (data.props.onShow) data.node.addEventListener("show", data.props.onShow, false)
        if (data.props.onStalled) data.node.addEventListener("stalled", data.props.onStalled, false)
        if (data.props.onStorage) data.node.addEventListener("storage", data.props.onStorage, false)
        if (data.props.onSuspend) data.node.addEventListener("suspend", data.props.onSuspend, false)
        if (data.props.onTimeUpdate) data.node.addEventListener("timeupdate", data.props.onTimeUpdate, false)
        if (data.props.onToggle) data.node.addEventListener("toggle", data.props.onToggle, false)
        if (data.props.onTouchCancel) data.node.addEventListener("touchcancel", data.props.onTouchCancel, false)
        if (data.props.onTouchEnd) data.node.addEventListener("touchend", data.props.onTouchEnd, false)
        if (data.props.onTouchMove) data.node.addEventListener("touchmove", data.props.onTouchMove, false)
        if (data.props.onTouchStart) data.node.addEventListener("touchstart", data.props.onTouchStart, false)
        if (data.props.onTransitionEnd) data.node.addEventListener("transitionend", data.props.onTransitionEnd, false)
        if (data.props.onUnload) data.node.addEventListener("unload", data.props.onUnload, false)
        if (data.props.onVolumeChange) data.node.addEventListener("volumechange", data.props.onVolumeChange, false)
        if (data.props.onWaiting) data.node.addEventListener("waiting", data.props.onWaiting, false)
        if (data.props.onWheel) data.node.addEventListener("wheel", data.props.onWheel, false)
        if (data.props.onSubmit) {
            originalOnSubmit = data.props.onSubmit
            data.props.onSubmit = (ev: Event) => {
                ev.preventDefault()
                originalOnSubmit(ev)
            }
            data.node.addEventListener("submit", data.props.onSubmit, false)
        }
    }
    
    const cleanEvents = (): void => {
        if (data.props.onAbort) data.node.removeEventListener("abort", data.props.onAbort, false)
        if (data.props.onAfterPrint) data.node.removeEventListener("afterprint", data.props.onAfterPrint, false)
        if (data.props.onAnimationEnd) data.node.removeEventListener("animationend", data.props.onAnimationEnd, false)
        if (data.props.onAnimationIteration) data.node.removeEventListener("animationiteration", data.props.onAnimationIteration, false)
        if (data.props.onAnimationStart) data.node.removeEventListener("animationstart", data.props.onAnimationStart, false)
        if (data.props.onBeforePrint) data.node.removeEventListener("beforeprint", data.props.onBeforePrint, false)
        if (data.props.onBeforeUnload) data.node.removeEventListener("beforeunload", data.props.onBeforeUnload, false)
        if (data.props.onBlur) data.node.removeEventListener("blur", data.props.onBlur, false)
        if (data.props.onCanPlay) data.node.removeEventListener("canplay", data.props.onCanPlay, false)
        if (data.props.onCanPlayThough) data.node.removeEventListener("canplaythrough", data.props.onCanPlayThough, false)
        if (data.props.onChange) data.node.removeEventListener("change", data.props.onChange, false)
        if (data.props.onClick) data.node.removeEventListener("click", data.props.onClick, false)
        if (data.props.onContextMenu) data.node.removeEventListener("contextmenu", data.props.onContextMenu, false)
        if (data.props.onCopy) data.node.removeEventListener("copy", data.props.onCopy, false)
        if (data.props.onCut) data.node.removeEventListener("cut", data.props.onCut, false)
        if (data.props.onDoubleClick) data.node.removeEventListener("dblclick", data.props.onDoubleClick, false)
        if (data.props.onDrag) data.node.removeEventListener("drag", data.props.onDrag, false)
        if (data.props.onDragEnd) data.node.removeEventListener("dragend", data.props.onDragEnd, false)
        if (data.props.onDragEnter) data.node.removeEventListener("dragenter", data.props.onDragEnter, false)
        if (data.props.onDragLeave) data.node.removeEventListener("dragleave", data.props.onDragLeave, false)
        if (data.props.onDragOver) data.node.removeEventListener("dragover", data.props.onDragOver, false)
        if (data.props.onDragStart) data.node.removeEventListener("dragstart", data.props.onDragStart, false)
        if (data.props.onDrop) data.node.removeEventListener("drop", data.props.onDrop, false)
        if (data.props.onDurationChange) data.node.removeEventListener("durationchange", data.props.onDurationChange, false)
        if (data.props.onEnded) data.node.removeEventListener("ended", data.props.onEnded, false)
        if (data.props.onError) data.node.removeEventListener("error", data.props.onError, false)
        if (data.props.onFocus) data.node.removeEventListener("focus", data.props.onFocus, false)
        if (data.props.onFocusIn) data.node.removeEventListener("focusin", data.props.onFocusIn, false)
        if (data.props.onFocusOut) data.node.removeEventListener("focusout", data.props.onFocusOut, false)
        if (data.props.onFullScreenChange) data.node.removeEventListener("fullscreenchange", data.props.onFullScreenChange, false)
        if (data.props.onFullScreenError) data.node.removeEventListener("fullscreenerror", data.props.onFullScreenError, false)
        if (data.props.onHashChange) data.node.removeEventListener("hashchange", data.props.onHashChange, false)
        if (data.props.onInput) data.node.removeEventListener("input", data.props.onInput, false)
        if (data.props.onKeyDown) data.node.removeEventListener("keydown", data.props.onKeyDown, false)
        if (data.props.onKeyPress) data.node.removeEventListener("keypress", data.props.onKeyPress, false)
        if (data.props.onKeyUp) data.node.removeEventListener("keyup", data.props.onKeyUp, false)
        if (data.props.onLoad) data.node.removeEventListener("load", data.props.onLoad, false)
        if (data.props.onLoadedData) data.node.removeEventListener("loadeddata", data.props.onLoadedData, false)
        if (data.props.onLoadedMetaData) data.node.removeEventListener("loadedmetadata", data.props.onLoadedMetaData, false)
        if (data.props.onLoadStart) data.node.removeEventListener("loadstart", data.props.onLoadStart, false)
        if (data.props.onMessage) data.node.removeEventListener("message", data.props.onMessage, false)
        if (data.props.onMouseDown) data.node.removeEventListener("mousedown", data.props.onMouseDown, false)
        if (data.props.onMouseEnter) data.node.removeEventListener("mouseenter", data.props.onMouseEnter, false)
        if (data.props.onMouseLeave) data.node.removeEventListener("mouseleave", data.props.onMouseLeave, false)
        if (data.props.onMouseMove) data.node.removeEventListener("mousemove", data.props.onMouseMove, false)
        if (data.props.onMouseOver) data.node.removeEventListener("mouseover", data.props.onMouseOver, false)
        if (data.props.onMouseOut) data.node.removeEventListener("mouseout", data.props.onMouseOut, false)
        if (data.props.onMouseUp) data.node.removeEventListener("mouseup", data.props.onMouseUp, false)
        if (data.props.onMouseWheel) data.node.removeEventListener("mousewheel", data.props.onMouseWheel, false)
        if (data.props.onOffline) data.node.removeEventListener("offline", data.props.onOffline, false)
        if (data.props.onOnline) data.node.removeEventListener("online", data.props.onOnline, false)
        if (data.props.onOpen) data.node.removeEventListener("open", data.props.onOpen, false)
        if (data.props.onPageHide) data.node.removeEventListener("pagehide", data.props.onPageHide, false)
        if (data.props.onPageShow) data.node.removeEventListener("pageshow", data.props.onPageShow, false)
        if (data.props.onPaste) data.node.removeEventListener("paste", data.props.onPaste, false)
        if (data.props.onPause) data.node.removeEventListener("pause", data.props.onPause, false)
        if (data.props.onPlay) data.node.removeEventListener("play", data.props.onPlay, false)
        if (data.props.onPlaying) data.node.removeEventListener("playing", data.props.onPlaying, false)
        if (data.props.onPopState) data.node.removeEventListener("popstate", data.props.onPopState, false)
        if (data.props.onProgress) data.node.removeEventListener("progress", data.props.onProgress, false)
        if (data.props.onRateChange) data.node.removeEventListener("ratechange", data.props.onRateChange, false)
        if (data.props.onResize) data.node.removeEventListener("resize", data.props.onResize, false)
        if (data.props.onReset) data.node.removeEventListener("reset", data.props.onReset, false)
        if (data.props.onScroll) data.node.removeEventListener("scroll", data.props.onScroll, false)
        if (data.props.onSearch) data.node.removeEventListener("search", data.props.onSearch, false)
        if (data.props.onSeeked) data.node.removeEventListener("seeked", data.props.onSeeked, false)
        if (data.props.onSelect) data.node.removeEventListener("select", data.props.onSelect, false)
        if (data.props.onShow) data.node.removeEventListener("show", data.props.onShow, false)
        if (data.props.onStalled) data.node.removeEventListener("stalled", data.props.onStalled, false)
        if (data.props.onStorage) data.node.removeEventListener("storage", data.props.onStorage, false)
        if (data.props.onSuspend) data.node.removeEventListener("suspend", data.props.onSuspend, false)
        if (data.props.onTimeUpdate) data.node.removeEventListener("timeupdate", data.props.onTimeUpdate, false)
        if (data.props.onToggle) data.node.removeEventListener("toggle", data.props.onToggle, false)
        if (data.props.onTouchCancel) data.node.removeEventListener("touchcancel", data.props.onTouchCancel, false)
        if (data.props.onTouchEnd) data.node.removeEventListener("touchend", data.props.onTouchEnd, false)
        if (data.props.onTouchMove) data.node.removeEventListener("touchmove", data.props.onTouchMove, false)
        if (data.props.onTouchStart) data.node.removeEventListener("touchstart", data.props.onTouchStart, false)
        if (data.props.onTransitionEnd) data.node.removeEventListener("transitionend", data.props.onTransitionEnd, false)
        if (data.props.onUnload) data.node.removeEventListener("unload", data.props.onUnload, false)
        if (data.props.onVolumeChange) data.node.removeEventListener("volumechange", data.props.onVolumeChange, false)
        if (data.props.onWaiting) data.node.removeEventListener("waiting", data.props.onWaiting, false)
        if (data.props.onWheel) data.node.removeEventListener("wheel", data.props.onWheel, false)
        if (data.props.onSubmit) data.node.removeEventListener("submit", data.props.onSubmit, false)
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
        // Animation overlapping can occur naturally
        // in complex situations, which means that a node is always cleaned
        // so we don't have to rely on the parent unmounting?
        if (data.node.parentNode)
            data.node.parentNode.removeChild(data.node)
        if (data.parent)
        if (data.parent.tags.has(data.id))
            data.parent.tags.delete(data.id)
    }
    
    setupName()
    setupText()
    setupValue()
    setupStyle()
    setupClasses()
    setupPlaceholder()
    setupType()
    setupAttributes()
    setupEvents()
    mountTags(childTags)
    
    return data
}
