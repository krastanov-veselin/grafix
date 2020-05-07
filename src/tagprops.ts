class TagProps {
    // Attributes
    public name?: string
    public text?: string | (() => string)
    public style?: string | (() => string)
    public classes?: string | (() => string)
    public type?: string | (() => string)
    public value?: string | (() => string)
    public placeholder?: string | (() => string)
    public attributes?: (() => Partial<Attributes> | any)
    
    // LifeCycle Events
    public onCreate?: (tag?: Tag) => void
    public onInit?: (tag?: Tag) => void
    public onMount?: (tag?: Tag) => void
    public onUnmount?: (tag?: Tag) => void
    public onUnmountAsync: 
        (unmount: VoidFunction, tag?: Tag, forced?: VoidFunction) => void
    
    // DOM Events
    public onAbort?: MouseEventFunc | null
    public onAfterPrint?: MouseEventFunc | null
    public onAnimationEnd?: MouseEventFunc | null
    public onAnimationIteration?: MouseEventFunc | null
    public onAnimationStart?: MouseEventFunc | null
    public onBeforePrint?: MouseEventFunc | null
    public onBeforeUnload?: MouseEventFunc | null
    public onBlur?: MouseEventFunc | null
    public onCanPlay?: MouseEventFunc | null
    public onCanPlayThough?: MouseEventFunc | null
    public onChange?: MouseEventFunc | null
    public onClick?: MouseEventFunc | null
    public onContextMenu?: MouseEventFunc | null
    public onCopy?: MouseEventFunc | null
    public onCut?: MouseEventFunc | null
    public onDoubleClick?: MouseEventFunc | null
    public onDrag?: MouseEventFunc | null
    public onDragEnd?: MouseEventFunc | null
    public onDragEnter?: MouseEventFunc | null
    public onDragLeave?: MouseEventFunc | null
    public onDragOver?: MouseEventFunc | null
    public onDragStart?: MouseEventFunc | null
    public onDrop?: MouseEventFunc | null
    public onDurationChange?: MouseEventFunc | null
    public onEnded?: MouseEventFunc | null
    public onError?: MouseEventFunc | null
    public onFocus?: MouseEventFunc | null
    public onFocusIn?: MouseEventFunc | null
    public onFocusOut?: MouseEventFunc | null
    public onFullScreenChange?: MouseEventFunc | null
    public onFullScreenError?: MouseEventFunc | null
    public onHashChange?: MouseEventFunc | null
    public onInput?: MouseEventFunc | null
    public onInvalid?: MouseEventFunc | null
    public onKeyDown?: MouseEventFunc | null
    public onKeyPress?: MouseEventFunc | null
    public onKeyUp?: MouseEventFunc | null
    public onLoad?: MouseEventFunc | null
    public onLoadedData?: MouseEventFunc | null
    public onLoadedMetaData?: MouseEventFunc | null
    public onLoadStart?: MouseEventFunc | null
    public onMessage?: MouseEventFunc | null
    public onMouseDown?: MouseEventFunc | null
    public onMouseEnter?: MouseEventFunc | null
    public onMouseLeave?: MouseEventFunc | null
    public onMouseMove?: MouseEventFunc | null
    public onMouseOver?: MouseEventFunc | null
    public onMouseOut?: MouseEventFunc | null
    public onMouseUp?: MouseEventFunc | null
    /** @deprecated Use the onWheel event instead */
    public onMouseWheel?: MouseEventFunc | null
    public onOffline?: MouseEventFunc | null
    public onOnline?: MouseEventFunc | null
    public onOpen?: MouseEventFunc | null
    public onPageHide?: MouseEventFunc | null
    public onPageShow?: MouseEventFunc | null
    public onPaste?: MouseEventFunc | null
    public onPause?: MouseEventFunc | null
    public onPlay?: MouseEventFunc | null
    public onPlaying?: MouseEventFunc | null
    public onPopState?: MouseEventFunc | null
    public onProgress?: MouseEventFunc | null
    public onRateChange?: MouseEventFunc | null
    public onResize?: MouseEventFunc | null
    public onReset?: MouseEventFunc | null
    public onScroll?: MouseEventFunc | null
    public onSearch?: MouseEventFunc | null
    public onSeeked?: MouseEventFunc | null
    public onSeeking?: MouseEventFunc | null
    public onSelect?: MouseEventFunc | null
    public onShow?: MouseEventFunc | null
    public onStalled?: MouseEventFunc | null
    public onStorage?: MouseEventFunc | null
    public onSubmit?: MouseEventFunc | null
    public onSuspend?: MouseEventFunc | null
    public onTimeUpdate?: MouseEventFunc | null
    public onToggle?: MouseEventFunc | null
    public onTouchCancel?: MouseEventFunc | null
    public onTouchEnd?: MouseEventFunc | null
    public onTouchMove?: MouseEventFunc | null
    public onTouchStart?: MouseEventFunc | null
    public onTransitionEnd?: MouseEventFunc | null
    public onUnload?: MouseEventFunc | null
    public onVolumeChange?: MouseEventFunc | null
    public onWaiting?: MouseEventFunc | null
    public onWheel?: MouseEventFunc | null
    
    // Custom Events
    public onUpdate?: (v: string) => void | null
    public _onSubmit?: MouseEventFunc | null
    
    constructor(data: Partial<TagProps>) {
        // Attributes
        this.name = typeof data.name === "undefined" ? "" : data.name
        this.text = typeof data.text === "undefined" ? "" : data.text
        this.style = typeof data.style === "undefined" ? "" : data.style
        this.classes = typeof data.classes === "undefined" ? "" : data.classes
        this.attributes = typeof data.attributes === "undefined" ? null : data.attributes
        this.type = typeof data.type === "undefined" ? "" : data.type
        this.value = typeof data.value === "undefined" ? "" : data.value
        this.placeholder = typeof data.placeholder === "undefined" ? "" : data.placeholder
        // LifeCycle Events
        this.onCreate = typeof data.onCreate === "undefined" ? null : data.onCreate
        this.onInit = typeof data.onInit === "undefined" ? null : data.onInit
        this.onMount = typeof data.onMount === "undefined" ? null : data.onMount
        this.onUnmount = typeof data.onUnmount === "undefined" ? null : data.onUnmount
        this.onUnmountAsync = typeof data.onUnmountAsync === "undefined" ? null : data.onUnmountAsync
        // DOM Events
        this.onAbort = typeof data.onAbort === "undefined" ? null : data.onAbort
        this.onAfterPrint = typeof data.onAfterPrint === "undefined" ? null : data.onAfterPrint
        this.onAnimationEnd = typeof data.onAnimationEnd === "undefined" ? null : data.onAnimationEnd
        this.onAnimationIteration = typeof data.onAnimationIteration === "undefined" ? null : data.onAnimationIteration
        this.onAnimationStart = typeof data.onAnimationStart === "undefined" ? null : data.onAnimationStart
        this.onBeforePrint = typeof data.onBeforePrint === "undefined" ? null : data.onBeforePrint
        this.onBlur = typeof data.onBlur === "undefined" ? null : data.onBlur
        this.onCanPlay = typeof data.onCanPlay === "undefined" ? null : data.onCanPlay
        this.onCanPlayThough = typeof data.onCanPlayThough === "undefined" ? null : data.onCanPlayThough
        this.onChange = typeof data.onChange === "undefined" ? null : data.onChange
        this.onClick = typeof data.onClick === "undefined" ? null : data.onClick
        this.onContextMenu = typeof data.onContextMenu === "undefined" ? null : data.onContextMenu
        this.onCopy = typeof data.onCopy === "undefined" ? null : data.onCopy
        this.onCut = typeof data.onCut === "undefined" ? null : data.onCut
        this.onDoubleClick = typeof data.onDoubleClick === "undefined" ? null : data.onDoubleClick
        this.onDrag = typeof data.onDrag === "undefined" ? null : data.onDrag
        this.onDragEnd = typeof data.onDragEnd === "undefined" ? null : data.onDragEnd
        this.onDragEnter = typeof data.onDragEnter === "undefined" ? null : data.onDragEnter
        this.onDragLeave = typeof data.onDragLeave === "undefined" ? null : data.onDragLeave
        this.onDragOver = typeof data.onDragOver === "undefined" ? null : data.onDragOver
        this.onDragStart = typeof data.onDragStart === "undefined" ? null : data.onDragStart
        this.onDrop = typeof data.onDrop === "undefined" ? null : data.onDrop
        this.onDurationChange = typeof data.onDurationChange === "undefined" ? null : data.onDurationChange
        this.onEnded = typeof data.onEnded === "undefined" ? null : data.onEnded
        this.onError = typeof data.onError === "undefined" ? null : data.onError
        this.onFocus = typeof data.onFocus === "undefined" ? null : data.onFocus
        this.onFocusIn = typeof data.onFocusIn === "undefined" ? null : data.onFocusIn
        this.onFocusOut = typeof data.onFocusOut === "undefined" ? null : data.onFocusOut
        this.onFullScreenChange = typeof data.onFullScreenChange === "undefined" ? null : data.onFullScreenChange
        this.onFullScreenError = typeof data.onFullScreenError === "undefined" ? null : data.onFullScreenError
        this.onHashChange = typeof data.onHashChange === "undefined" ? null : data.onHashChange
        this.onInput = typeof data.onInput === "undefined" ? null : data.onInput
        this.onInvalid = typeof data.onInvalid === "undefined" ? null : data.onInvalid
        this.onKeyDown = typeof data.onKeyDown === "undefined" ? null : data.onKeyDown
        this.onKeyPress = typeof data.onKeyPress === "undefined" ? null : data.onKeyPress
        this.onKeyUp = typeof data.onKeyUp === "undefined" ? null : data.onKeyUp
        this.onLoad = typeof data.onLoad === "undefined" ? null : data.onLoad
        this.onLoadedData = typeof data.onLoadedData === "undefined" ? null : data.onLoadedData
        this.onLoadedMetaData = typeof data.onLoadedMetaData === "undefined" ? null : data.onLoadedMetaData
        this.onLoadStart = typeof data.onLoadStart === "undefined" ? null : data.onLoadStart
        this.onMessage = typeof data.onMessage === "undefined" ? null : data.onMessage
        this.onMouseDown = typeof data.onMouseDown === "undefined" ? null : data.onMouseDown
        this.onMouseEnter = typeof data.onMouseEnter === "undefined" ? null : data.onMouseEnter
        this.onMouseLeave = typeof data.onMouseLeave === "undefined" ? null : data.onMouseLeave
        this.onMouseMove = typeof data.onMouseMove === "undefined" ? null : data.onMouseMove
        this.onMouseOver = typeof data.onMouseOver === "undefined" ? null : data.onMouseOver
        this.onMouseOut = typeof data.onMouseOut === "undefined" ? null : data.onMouseOut
        this.onMouseUp = typeof data.onMouseUp === "undefined" ? null : data.onMouseUp
        this.onMouseWheel = typeof data.onMouseWheel === "undefined" ? null : data.onMouseWheel
        this.onOffline = typeof data.onOffline === "undefined" ? null : data.onOffline
        this.onOnline = typeof data.onOnline === "undefined" ? null : data.onOnline
        this.onOpen = typeof data.onOpen === "undefined" ? null : data.onOpen
        this.onPageHide = typeof data.onPageHide === "undefined" ? null : data.onPageHide
        this.onPageShow = typeof data.onPageShow === "undefined" ? null : data.onPageShow
        this.onPaste = typeof data.onPaste === "undefined" ? null : data.onPaste
        this.onPause = typeof data.onPause === "undefined" ? null : data.onPause
        this.onPlay = typeof data.onPlay === "undefined" ? null : data.onPlay
        this.onPlaying = typeof data.onPlaying === "undefined" ? null : data.onPlaying
        this.onPopState = typeof data.onPopState === "undefined" ? null : data.onPopState
        this.onProgress = typeof data.onProgress === "undefined" ? null : data.onProgress
        this.onRateChange = typeof data.onRateChange === "undefined" ? null : data.onRateChange
        this.onResize = typeof data.onResize === "undefined" ? null : data.onResize
        this.onReset = typeof data.onReset === "undefined" ? null : data.onReset
        this.onScroll = typeof data.onScroll === "undefined" ? null : data.onScroll
        this.onSearch = typeof data.onSearch === "undefined" ? null : data.onSearch
        this.onSeeked = typeof data.onSeeked === "undefined" ? null : data.onSeeked
        this.onSeeking = typeof data.onSeeking === "undefined" ? null : data.onSeeking
        this.onSelect = typeof data.onSelect === "undefined" ? null : data.onSelect
        this.onShow = typeof data.onShow === "undefined" ? null : data.onShow
        this.onStalled = typeof data.onStalled === "undefined" ? null : data.onStalled
        this.onStorage = typeof data.onStorage === "undefined" ? null : data.onStorage
        this.onSubmit = typeof data.onSubmit === "undefined" ? null : data.onSubmit
        this.onSuspend = typeof data.onSuspend === "undefined" ? null : data.onSuspend
        this.onTimeUpdate = typeof data.onTimeUpdate === "undefined" ? null : data.onTimeUpdate
        this.onToggle = typeof data.onToggle === "undefined" ? null : data.onToggle
        this.onTouchCancel = typeof data.onTouchCancel === "undefined" ? null : data.onTouchCancel
        this.onTouchEnd = typeof data.onTouchEnd === "undefined" ? null : data.onTouchEnd
        this.onTouchMove = typeof data.onTouchMove === "undefined" ? null : data.onTouchMove
        this.onTouchStart = typeof data.onTouchStart === "undefined" ? null : data.onTouchStart
        this.onTransitionEnd = typeof data.onTransitionEnd === "undefined" ? null : data.onTransitionEnd
        this.onUnload = typeof data.onUnload === "undefined" ? null : data.onUnload
        this.onVolumeChange = typeof data.onVolumeChange === "undefined" ? null : data.onVolumeChange
        this.onWaiting = typeof data.onWaiting === "undefined" ? null : data.onWaiting
        this.onWheel = typeof data.onWheel === "undefined" ? null : data.onWheel
        // Custom Events
        this.onUpdate = typeof data.onUpdate === "undefined" ? null : data.onUpdate
        this._onSubmit = typeof data._onSubmit === "undefined" ? null : data._onSubmit
    }
}
