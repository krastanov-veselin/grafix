interface EditorInputProps {
    onUpdate: (val?: string, state?: InputState, ev?: KeyboardEvent) => void
    onChange: (val?: string, state?: InputState, ev?: KeyboardEvent) => void
    state: () => string
    initial: () => string
    animation: () => boolean
    autoFocus: boolean
    layer: () => string
    placeholder: () => string
    placeholderColor: () => string
    style: () => string
    classes: () => string
    raid: () => string
    getRaid: (raid: Mix<InputState>) => void
    getState: (inputState: InputState) => void
    onDelete: (state: InputState, value: string) => void
    onMount: (t?: Tag) => void
    onUnmount: (t?: Tag) => void
}

interface InputState {
    id: string
    focused: boolean
    selecting: boolean
    entered: boolean
    props: Partial<EditorInputProps>
    selected: Mix<Letter>
    shift: boolean
    control: boolean
    valueSize: number
    animation: boolean
    mounted: boolean
    value: Mix<Letter>
    raid: string
    updateMutex: boolean
    onDelete: (state: InputState, value: string) => void
}

interface Letter {
    value: string
    selected: boolean
    node: HTMLElement
    color: string
    bold: boolean
    italic: boolean
}

const raids: Mix<Mix<InputState>> = new Mix()

let currentInputCancellation: (ev: MouseEvent) => void = null

const write = (key: string, state: InputState) => {
    const id = state.value.add(o({
        value: key,
        selected: false,
        node: null,
        color: null,
        bold: false,
        italic: false
    }))
    state.value.sort(id, "cursor")
    increaseValueSize(state)
}

const highlight = (state: InputState) => {
    let currentColor: string = null
    let bold = false
    let italic = false
    let currentWord = ""
    let currentLetters = mix<Letter>()
    state.value.foreach((letter, id) => {
        if (letter.value === "cursor") return
        if (letter.value === " ") {
            currentWord = ""
            currentLetters = mix()
            currentColor = null
            bold = false
            italic = false
            return
        }
        let special = false
        if (
            letter.value === "(" ||
            letter.value === ")" ||
            letter.value === "[" ||
            letter.value === "]"
        ) {
            currentColor = "#fff"
            bold = false
            italic = false
        }
        if (letter.value === "&") {
            currentColor = "#ff6ab3"
            bold = false
            italic = false
        }
        if (letter.value === "|") {
            currentColor = "#ff6ab3"
            bold = false
            italic = false
        }
        if (letter.value === "@") {
            currentColor = "#6495ee"
            bold = true
            italic = false
            special = true
        }
        if (letter.value === "^") {
            currentColor = "#cf68e1"
            bold = true
            italic = false
            special = true
        }
        if (letter.value === "-") {
            currentColor = "#676e95"
            italic = true
            bold = false
            special = true
        }
        if (letter.value === "*") {
            currentColor = "#cf68e1"
            bold = true
            italic = false
            special = true
        }
        currentWord += letter.value
        currentLetters.set(id, letter)
        if (currentWord === "casters" || currentWord === "props")
            return currentLetters.foreach(sibling =>
                sibling.color = "#98c379")
        if (currentWord === "as")
            return currentLetters.foreach(sibling =>
                sibling.color = "#98c379")
        if (
            currentWord === "set" ||
            currentWord === "unset" ||
            currentWord === "before" ||
            currentWord === "after" ||
            currentWord === "while"
        )
            return currentLetters.foreach(sibling =>
                sibling.color = "#ff6ab3")
        if (!currentColor) {
            if (letter.color) letter.color = null
            if (letter.bold) letter.bold = false
            if (letter.italic) letter.italic = false
            return
        }
        letter.color = currentColor
        letter.bold = bold
        letter.italic = italic
    })
}

const getValue = (state: InputState, selected: boolean = false) => {
    const arr = state.value.array
    let val = ""
    for (let i = 0; i < arr.length; i++)
    if (arr[i].value !== "cursor") {
        if (selected && !arr[i].selected)
            continue
        val += arr[i].value
    }
    return val
}

const left = (state: InputState) => {
    if (!state.value.getNode("cursor").prev) return
    if (state.shift) 
    if (state.value.getNode("cursor").prev.data.selected)
        unselect(
            state,
            state.value.getNode("cursor").prev.data,
            state.value.getNode("cursor").prev.id)
    else inputSelect(
            state,
            state.value.getNode("cursor").prev.data,
            state.value.getNode("cursor").prev.id)
    state.value.sort("cursor", state.value.getNode("cursor").prev.id)
    if (state.selected && !state.shift)
        unselectAll(state)
}

const right = (state: InputState) => {
    if (!state.value.getNode("cursor").next) return
    if (state.shift)
    if (state.value.getNode("cursor").next.data.selected)
        unselect(
            state,
            state.value.getNode("cursor").next.data,
            state.value.getNode("cursor").next.id)
    else inputSelect(
        state,
        state.value.getNode("cursor").next.data,
        state.value.getNode("cursor").next.id)
    if (!state.value.getNode("cursor").next.next)
        return state.value.sort("cursor", null)
        state.value.sort("cursor", state.value.getNode("cursor").next.next.id)
    if (state.selected && !state.shift)
        unselectAll(state)
}

const up = (state: InputState) => {
    if (!state.raid) return
    const node = raids.get(state.raid).getNode(state.id)
    if (node.prev) applyCursor(node.prev.data)
}

const down = (state: InputState) => {
    if (!state.raid) return
    const node = raids.get(state.raid).getNode(state.id)
    if (node.next) applyCursor(node.next.data)
}

const backspace = (state: InputState) => {
    if (state.selected.size) {
        triggerOnDelete(state)
        removeSelected(state)
        state.selected.clean()
        return
    }
    if (!state.value.getNode("cursor").prev)
        return triggerOnDelete(state)
    triggerOnDelete(state)
    state.value.delete(state.value.getNode("cursor").prev.id)
    decreaseValueSize(state)
}

const triggerOnDelete = (state: InputState) => {
    if (!state.onDelete) return
    state.onDelete(state, "")
}

const inputFocus = (state: InputState) => {
    purify()
    if (currentInputCancellation)
        currentInputCancellation(null)
    currentInputCancellation = (ev: MouseEvent) => {
        if (state.entered && ev !== null) return
        state.focused = false
    }
    window.onmousedown = currentInputCancellation
    window.onkeydown = (ev: KeyboardEvent) => {
        ev.stopPropagation()
        ev.preventDefault()
        if (ev.key === "Escape")
            return inputBlur(state)
        if (ev.key === "ArrowLeft")
            return left(state)
        if (ev.key === "ArrowRight")
            return right(state)
        if (ev.key === "ArrowUp")
            return up(state)
        if (ev.key === "ArrowDown")
            return down(state)
        if (ev.key === "Shift")
            return state.shift = true
        if (ev.key === "Control")
            return state.control = true
        if (ev.key === "CapsLock")
            return
        if (ev.key === "Enter") {
            if (state.props) if (state.props.onChange)
                state.props.onChange(getValue(state), state, ev)
            return
        }
        if (ev.key === "Backspace")
            return backspace(state)
        if (state.control) {
            if (ev.key === "c")
                return copy(state)
            if (ev.key === "x")
                return cut(state)
            if (ev.key === "v")
                return paste(state)
            if (ev.key === "a")
                return selectAll(state)
            return
        }
        if (state.selected.size)
            removeSelected(state)
        write(ev.key, state)
    }
    window.onkeyup = (ev: KeyboardEvent) => {
        if (ev.key === "Shift")
            return state.shift = false
        if (ev.key === "Control")
            return state.control = false
    }
}

const inputBlur = (state: InputState) => {
    purify()
    window.onkeydown = null
    window.onkeyup = null
    window.onmousedown = null
    state.focused = false
    currentInputCancellation = null
    clearSelection(state)
}

const clearSelection = (state: InputState) =>
    state.value.foreach((letter, id) => {
        if (!letter.selected) return
        unselect(state, letter, id)
    })

const increaseValueSize = (state: InputState) => {
    state.valueSize++
    triggerChange(state)
}

const decreaseValueSize = (state: InputState) => {
    state.valueSize--
    triggerChange(state)
}

const triggerChange = (state: InputState) => {
    if (!state.props) return
    if (!state.props.onUpdate) return
    state.updateMutex = true
    state.props.onUpdate(getValue(state), state)
    state.updateMutex = false
}

const removeAll = (state: InputState) => {
    state.value.foreach((letter, id) => {
        if (letter.value === "cursor")
            return
        state.value.delete(id)
        decreaseValueSize(state)
    })
    state.selected.clean()
}

const removeSelected = (state: InputState) => {
    state.value.foreach((letter, id) => {
        if (letter.selected) {
            state.value.delete(id)
            decreaseValueSize(state)
        }
    })
    state.selected.clean()
}

const copy = (state: InputState) => {
    if (!state.selected.size) return
    const val = getValue(state, true)
    navigator.clipboard.writeText(val)
}

const cut = (state: InputState) => {
    if (!state.selected.size) return
    copy(state)
    removeSelected(state)
}

const paste = (state: InputState) =>
    navigator.clipboard.readText().then(val => {
        removeSelected(state)
        setValue(state, val, false)
    })

const selectAll = (state: InputState) =>
    state.value.foreach((item, id) => {
        if (item.value === "cursor")
            return
        if (item.selected) return
        inputSelect(state, item, id)
    })

const setValue = (
    state: InputState,
    val: string,
    remove: boolean = true
) => {
    if (remove) removeAll(state)
    if (!val) return
    if (!val.length) return
    for (let i = 0; i < val.length; i++)
        write(val[i], state)
}

const cursor = (item: Letter, state: InputState) =>
div({
    onMount: t => item.node = t.node,
    classes: () => `
        EditorInputCursor FloatLeft
        ${ state.focused ? "active" : "" }
    `
}, [
    div()
])

const enableSelection = (item: Letter, id: string, state: InputState) => {
    if (item.selected)
    if (state.value.getNode(id).prev)
    if (state.value.getNode(id).prev.data.value === "cursor")
        return
    if (state.selected.size)
        state.selected.clean()
    state.value.foreach(sibling => {
        sibling.selected = false
    })
    state.selecting = true
    window.onmouseup = () => {
        state.selecting = false
        if (window.onmousemove)
            window.onmousemove = null
        if (window.onmouseup)
            window.onmouseup = null
    }
}

const inputSelect = (state: InputState, item: Letter, id: string) => {
    if (!state.selected.has(id))
        state.selected.set(id, item)
        item.selected = true
}

const unselect = (state: InputState, item: Letter, id: string) => {
    if (state.selected.has(id))
        state.selected.delete(id)
    item.selected = false
}

const unselectAll = (state: InputState) =>
    state.value.foreach((item, id) => {
        if (!item.selected || item.value === "cursor")
            return
        unselect(state, item, id)
    })

const selectCursorWord = (id: string, state: InputState) => {
    let currentWord = mix<Letter>()
    let wordReached = false
    state.value.foreach((item, itemID) => {
        if (item.value === "cursor")
            return true
        if (item.value === " ") {
            if (wordReached) return false
            currentWord = mix()
            return true
        }
        if (itemID === id) wordReached = true
        currentWord.set(itemID, item)
        return true
    })
    if (currentWord.size)
        currentWord.foreach((item, itemID) =>
            inputSelect(state, item, itemID))
}

const letter = (
    item: Letter, id: string,
    state: InputState
) => {
    const letterState = o({
        mounted: false
    })
    let tag: Tag = null
    const select = () => window.onmousemove = ev => {
        state.value.foreach((sibling, siblingID) => {
            if (sibling.value === "cursor") return
            const x = ev.pageX
            const rect = sibling.node.getBoundingClientRect()
            const cursorRect =
                state.value.get("cursor").node.getBoundingClientRect()
            if (x < rect.x + rect.width && cursorRect.x > rect.x ||
                x > rect.x && cursorRect.x <= rect.x
            ) inputSelect(state, sibling, siblingID)
            else unselect(state, sibling, siblingID)
        })
    }
    return div({
        onMount: t => {
            tag = t
            item.node = t.node
            if (!state.mounted) return letterState.mounted = true
            Unit.setTimeout(() => letterState.mounted = true, 30)
        },
        onUnmountAsync: u => {
            letterState.mounted = false
            if (!state.animation) return u()
            Unit.setTimeout(() => u(), 500)
        },
        text: () => {
            if (item.value === "Tab")
                return "    "
            return item.value
        },
        onDoubleClick: ev => {
            if (item.selected) return
            selectCursorWord(id, state)
            ev.stopPropagation()
        },
        onMouseDown: ev => {
            ev.stopPropagation()
            if (!state.focused) state.focused = true
            enableSelection(item, id, state)
            const rect = tag.node.getBoundingClientRect()
            if (ev.pageX >= rect.left + (rect.width / 2)) {
                if (state.value.getNode(id).next)
                    state.value.sort("cursor", state.value.getNode(id).next.id)
                else state.value.sort("cursor", null)
                select()
            }
            else state.value.sort("cursor", id)
        },
        onMouseEnter: () => {
            if (!state.selecting) return
            select()
        },
        classes: () => `
            EditorInputLetter FloatLeft
            ${ item.value === "Tab" ? "tab" : "" }
            ${ item.selected ? "selected" : "" }
            ${ letterState.mounted ? "active" : "" }
            ${ state.animation ? "animation" : "" }
            ${ item.bold ? "bold" : "" }
            ${ item.italic ? "italic" : "" }
        `,
        style: () => `
            ${ item.color ? "color: " + item.color : "" }
        `
    })
}

const applyCursor = (state: InputState) => {
    if (!state.focused) state.focused = true
    if (state.value.getNode("cursor").next)
        state.value.sort("cursor", null)
}

const addRaid = (state: InputState) => {
    if (!state.raid) return
    if (!raids.has(state.raid))
        raids.set(state.raid, new Mix())
    raids.get(state.raid).set(state.id, state)
}

const cleanRaid = (state: InputState) => {
    if (!state.raid) return
    if (!raids.has(state.raid)) return
    raids.get(state.raid).delete(state.id)
    if (!raids.get(state.raid).size)
        raids.delete(state.raid)
}

const inputgfx = (props?: Partial<EditorInputProps>) => {
    const state: InputState = o({
        id: Unit.uniqueID(),
        focused: false,
        selecting: false,
        entered: false,
        selected: mix(),
        shift: false,
        control: false,
        valueSize: 0,
        animation: true,
        mounted: false,
        value: mix<Letter>([
            ["cursor", o({
                value: "cursor",
                selected: false,
                node: null,
                color: null,
                bold: false,
                italic: false
            })]
        ]),
        raid: props ?
            props.raid ? props.raid() : null
        : null,
        updateMutex: false,
        props,
        onDelete: props ?
            props.onDelete ? props.onDelete : null
        : null
    })
    let initialized = false
    const binding = stateful(() => {
        state.focused
        if (!initialized) {
            initialized = true
            return
        }
        if (state.focused)
            inputFocus(state)
        else inputBlur(state)
    })
    const hlBinding = stateful(() => {
        if (state.valueSize) {
            purify()
            highlight(state)
        }
    })
    let stateBinding: BindData = null
    let animBinding: BindData = null
    const timeoutID = Unit.uniqueID()
    Unit.setTimeout(() => state.mounted = true, 30, timeoutID)
    if (props && props.animation)
        animBinding = stateful(() =>
            state.animation = props.animation())
    return div({
        classes: () => `
            Input  EditorInput
            ${ props.layer ? props.layer() : "Layer-1" }
            ${ props.classes ? props.classes() : "" }
        `,
        style: () => `
            width: ${ 30 + (state.valueSize * 12) }px;
            ${ props.style ? props.style() : "" }
        `,
        onMouseEnter: () => state.entered = true,
        onMouseLeave: () => state.entered = false,
        onMouseDown: () => {
            applyCursor(state)
            if (state.value.size)
                enableSelection(state.value.lastItem, state.value.lastID(), state)
        },
        onDoubleClick: () => selectAll(state),
        onMount: t => {
            if (!props) return
            if (props.initial)
                setValue(state, props.initial())
            if (props.state)
                stateBinding = stateful(() => {
                    const val = props.state()
                    purify()
                    if (state.updateMutex) return
                    setValue(state, val)
                })
            if (props.autoFocus)
                applyCursor(state)
            addRaid(state)
            if (state.raid && props.getRaid)
                props.getRaid(raids.get(state.raid))
            if (props.getState) props.getState(state)
            if (props.onMount) props.onMount(t)
        },
        onUnmountAsync: (u, t, f) => f(),
        onUnmount: t => {
            cleanBinding(binding)
            cleanBinding(hlBinding)
            if (stateBinding) cleanBinding(stateBinding)
            if (animBinding) cleanBinding(animBinding)
            Unit.clearTimeout(timeoutID)
            cleanRaid(state)
            if (!props) return
            if (props.onUnmount) props.onUnmount(t)
        }
    }, [
        div({ classes: "EditorInputValue FloatFix" }, [
            div({
                classes: () => `
                    InputPlaceholder
                    ${ (props.placeholder && state.valueSize === 0) ? "active" : "" }
                `,
                style: () => `
                    color: ${ props.placeholderColor ? props.placeholderColor() : "#fff2" };
                `,
                text: props.placeholder
            }),
            ...loop(state.value, (item: Letter, id) => [
                (() => {
                    if (item.value === "cursor")
                        return cursor(item, state)
                    else return letter(item, id, state)
                })()
            ])
        ])
    ])
}
