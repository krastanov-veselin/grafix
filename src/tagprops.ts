class TagProps {
    public name?: string
    public text?: TagValue
    public html?: string
    public style?: TagValue
    public width?: string
    public height?: string
    public classes?: TagValue
    public attributes?: (() => Partial<Attributes> | any)
    public type?: string
    public value?: TagValue
    public placeholder?: string
    public onCreate?: (tag?: Tag) => void
    public onInit?: (tag?: Tag) => void
    public onMount?: (tag?: Tag) => void
    public onUnmount?: (tag?: Tag) => void
    public onUnmountAsync: (unmount: VoidFunction, tag?: Tag) => void
    public onClick?: MouseEventFunc | null
    public onChange?: MouseEventFunc | null
    public onFocus?: MouseEventFunc | null
    public onBlur?: MouseEventFunc | null
    public onDoubleClick?: MouseEventFunc | null
    public onMouseDown?: MouseEventFunc | null
    public onMouseUp?: MouseEventFunc | null
    public onMouseMove?: MouseEventFunc | null
    public onMouseEnter?: MouseEventFunc | null
    public onMouseLeave?: MouseEventFunc | null
    public onMouseOver?: MouseEventFunc | null
    public onMouseOut?: MouseEventFunc | null
    public onRightClick?: MouseEventFunc | null
    public onKeyUp?: MouseEventFunc | null
    public onKeyDown?: MouseEventFunc | null
    public onUpdate?: (v: string) => void | null
    public onScroll?: MouseEventFunc | null
    public onMouseWheel?: MouseEventFunc | null
    public onSubmit?: MouseEventFunc | null
    public onResize?: MouseEventFunc | null
    public _onSubmit?: MouseEventFunc | null
    
    constructor(data: Partial<TagProps>) {
        this.name = typeof data.name === "undefined" ? "" : data.name
        this.text = typeof data.text === "undefined" ? "" : data.text
        this.html = typeof data.html === "undefined" ? "" : data.html
        this.style = typeof data.style === "undefined" ? "" : data.style
        this.width = typeof data.width === "undefined" ? "" : data.width
        this.height = typeof data.height === "undefined" ? "" : data.height
        this.classes = typeof data.classes === "undefined" ? "" : data.classes
        this.attributes = typeof data.attributes === "undefined" ? null : data.attributes
        this.type = typeof data.type === "undefined" ? "" : data.type
        this.value = typeof data.value === "undefined" ? "" : data.value
        this.placeholder = typeof data.placeholder === "undefined" ? "" : data.placeholder
        this.onClick = typeof data.onClick === "undefined" ? null : data.onClick
        this.onChange = typeof data.onChange === "undefined" ? null : data.onChange
        this.onFocus = typeof data.onFocus === "undefined" ? null : data.onFocus
        this.onBlur = typeof data.onBlur === "undefined" ? null : data.onBlur
        this.onInit = typeof data.onInit === "undefined" ? null : data.onInit
        this.onMount = typeof data.onMount === "undefined" ? null : data.onMount
        this.onUnmount = typeof data.onUnmount === "undefined" ? null : data.onUnmount
        this.onUnmountAsync = typeof data.onUnmountAsync === "undefined" ? null : data.onUnmountAsync
        this.onDoubleClick = typeof data.onDoubleClick === "undefined" ? null : data.onDoubleClick
        this.onMouseDown = typeof data.onMouseDown === "undefined" ? null : data.onMouseDown
        this.onMouseUp = typeof data.onMouseUp === "undefined" ? null : data.onMouseUp
        this.onMouseMove = typeof data.onMouseMove === "undefined" ? null : data.onMouseMove
        this.onMouseEnter = typeof data.onMouseEnter === "undefined" ? null : data.onMouseEnter
        this.onMouseLeave = typeof data.onMouseLeave === "undefined" ? null : data.onMouseLeave
        this.onMouseOver = typeof data.onMouseOver === "undefined" ? null : data.onMouseOver
        this.onMouseOut = typeof data.onMouseOut === "undefined" ? null : data.onMouseOut
        this.onRightClick = typeof data.onRightClick === "undefined" ? null : data.onRightClick
        this.onKeyUp = typeof data.onKeyUp === "undefined" ? null : data.onKeyUp
        this.onKeyDown = typeof data.onKeyDown === "undefined" ? null : data.onKeyDown
        this.onUpdate = typeof data.onUpdate === "undefined" ? null : data.onUpdate
        this.onScroll = typeof data.onScroll === "undefined" ? null : data.onScroll
        this.onMouseWheel = typeof data.onMouseWheel === "undefined" ? null : data.onMouseWheel
        this.onSubmit = typeof data.onSubmit === "undefined" ? null : data.onSubmit
        this.onResize = typeof data.onResize === "undefined" ? null : data.onResize
        this._onSubmit = typeof data._onSubmit === "undefined" ? null : data._onSubmit
    }
}
