<p align="center" style="font-size: 50px !important;"><span style="color: #39f !important;">Tag</span>.<span style="color: #5d3 !important;">JS</span></p>

[![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/react)

Tag.JS is a library for building stateful user interfaces and managing front-end data

```js
npm install tagjs
```

* **Alive:** Everything you write looks & feels alive. When you change anything in your data, regardless where the data is the UI automatically adapts.
* **Composition / Reusability** Every single element is a function that receives props and returns a tag which makes elements composable and reusable.
* **Zero Effort Databinding** While developing your tags as if you would do in normal HTML file you would probably want to add something like style="width: " + size.x + "px", well, just write it and it will automatically do all the binding for you, so no more databinding architectural effort!
* **Blending** Create immersive blending functions that wrap tags and blend them with behavior and style.
* **Efficiency** Without any expensive virtual doms or intense diffing for simple operations, Tag.JS simply does the subscribe->update pattern using the JavaScript Proxy API.
* **Simplicity** Just write a tag, router, loop, text, styles, classes, attributes and that's it! Just like you would do in HTML.

## Installation

1. npm install tagjs
2. enjoy

# Kay kay, let's go for the examples
#### (Enough copying React's Readme.md headlines)
##### Psst Tag.JS is inspired by React <3

## Examples

# The Hello World! Example

```jsx
// Data
const data = o({
    title: "Hello World"
})

// UI
const app = () => div({
    text: () => data.title
})

// Behavior
setTimeout(() => {
    data.title = "Hello World Modified!"
}, 2000)

mountTag(".app", app)
```

This example will display ```Hello World``` <br /> and after 2 seconds it will change into ```Hello World Modified!``` <br />
```html
<div>Hello World</div>
```
2 seconds later, changed the div's innerText
```html
<div>Hello World Modified!</div>
```

# The Router Example

```jsx
const data = o({
    location: "home"
})

const app = () => div([
    div({ text: "Home", onClick: () => data.location = "home" }),
    div({ text: "Settings", onClick: () => data.location = "settings" }),
    div({ text: "Gallery", onClick: () => data.location = "gallery" }),
    // This is a router!
    // Just a function
    () => {
        if (data.location === "home")
            return div({text: "This is Home"})
        if (data.location === "settings")
            return div({text: "This is Settings"})
        if (data.location === "gallery")
            return div({text: "This is Gallery"})
    }
])

mountTag(".app", app)
```

This example will build ```<div>This is Home</div>``` <br />
And when we click for example on Settings, the current router mounted tag will be properly unmounted (even waiting for the animations to end using the onUnmountAsync event). <br />
After that will mount the appropriate routed tag.

Actual DOM output
```html
<div>Home</div>
<div>Settings</div>
<div>Gallery</div>
<div>This is Home</div>
```
After clicking on "Settings"
```html
<div>Home</div>
<div>Settings</div>
<div>Gallery</div>
<div>This is Settings</div>
```

# The Simple Loop Example

```jsx
const arr = [15, 25, 35]

const app = () => div([
    // Looping 25 times printing out 25 divs with their number inside
    ...loop(25, (i) => [
        div({text: i})
    ]),
    // Will output 3 divs each with it's corresponding array item and index
    ...loop(arr, (item, i) => [
        div({text: i + ": " + item})
    ])
])

mountTag(".app", app)
```

# The Stateful Loop Example

```jsx
const m = mix([
    o({ title: "Item 1" }),
    o({ title: "Item 2" }),
    o({ title: "Item 3" })
])

const app = () => div([
    ...loop(m, (item, id) => [
        div([
            div({
                onClick: () => m.delete(id),
                onRightClick: () => m.add(o({
                    title: "Item " + Unit.random(1, 99999)
                })),
                text: () => id + ": " + item.title
            }),
            input({
                value: () => item.title,
                onUpdate: v => item.title = v
            })
        ])
    ])
])

mountTag(".app", app)
```

This example will display 3 divs with their content
1. When you click on a div it will get deleted along with the dataset item
2. When you rightclick on a div it will add a new random item to the dataset
3. When you change the input's value it everything will get statefully updated!

# The Stateful Attributes Example

```jsx
const settings = o({
    title: "World!",
    hasColor: false,
    color: "#39f",
    hasAttr: false,
    attrVal: "World",
    padding: 20
})

const app = () => div([
    div({
        text: () => "Hello " + settings.title,
        style: () => `
            background-color: ${ settings.color };
            padding: ${ settings.padding }px
        `,
        classes: () => `
            SomeClass ${ settings.hasColor ? "colored" : "" }
        `,
        attributes: () => ({
            customAttr: settings.hasAttr ? (
                "Hello " + settings.attrVal
            ) : (
                null
            )
        })
    })
])

mountTag(".app", app)
```

All attributes will automatically update when ever some of the binded properties change.
For example when settings.color changes the background-color will be repainted.
Or when the settings.hasColor is changed then the colored style will be either added or removed.

# The Modular Example

```jsx
const settings = o({
    location: ""
})

const app = () => div([
    element1({}),
    ...element2([
        div({text: "Some external mounting"})
    ]),
    myRouter({})
])

const element1 = (props) => div([
    div(props),
    form([
        input(),
        input()
    ])
])

const element2 = (tags) => [
    div(),
    div([
        ...tags
    ]),
    div(),
]

const myRouter = (optionalProps) => () => {
    if (settings.location === "home")
        return element1({})
    if (settings.location === "settings")
        return div({text: "This is settings"})
}

mountTag(".app", app)
```

# The Nested Router Example

```jsx
const settings = o({
    location: "",
    innerLocation: "",
    innerLocation2: ""
})

const app = () => div([
    div(),
    () => {
        if (settings.location === "home")
            return div({text: "This is Home"})
        if (settings.location === "settings")
            return div({text: "This is Settings"})
        if (settings.location === "nested")
            return () => {
                if (settings.innerLocation === "nested1")
                    return div({text: "Inner1 Route Tag 1"})
                if (settings.innerLocation === "nested2")
                    return div({text: "Inner1 Route Tag 2"})
                if (settings.innerLocation === "nested3")
                    return () => {
                        if (settings.innerLocation2 === "nested1")
                            return div({text: "Inner2 Route Tag 1"})
                        if (settings.innerLocation2 === "nested2")
                            return div({text: "Inner2 Route Tag 2"})
                    }
            }
    },
    div()
])

mountTag(".app", app)
```

# The Create Your Own Tag Example

```jsx
const settings = o({
    location: "",
    innerLocation: "",
    innerLocation2: ""
})

const myTag = (props, tags) => htmlNode("mycustomtag", props, tags)

const myStyledTag = (props, tags) => {
    [props, tags] = arrange(props, tags)
    setDefaultStyle(props, `
        padding: 10px;
        background-color: #39f;
        display: block;
    `)
    return htmlNode("mystyledtag", props, tags)
}

const app = () => div([
    myTag({text: "Hello World"}, [
        div(),
        myStyledTag({
            style: "width: 100px;"
        }, [
            div(),
            myTag(),
            myStyledTag([
                div()
            ])
        ]),
        div()
    ])
])

mountTag(".app", app)
```

# The Create Your Own Blend Example

```jsx
// Style & Behavior Blend
const myMoveBlend = (props, tags) => {
    const start = {
        x: 0,
        y: 0
    }
    const onDown = (ev) => {
        if (props.onDown) props.onDown(ev)
        start.x = ev.pageX - props.pos.x
        start.y = ev.pageY - props.pos.y
        window.onmousemove = onMove
        window.onmouseup = onUp
    }
    const onMove = (ev) => {
        props.pos.x = ev.pageX - start.x
        props.pos.y = ev.pageY - start.y
        if (props.onMove) props.onMove(ev)
    }
    const onUp = (ev) => {
        window.onmousemove = null
        window.onmouseup = null
        if (props.onUp) props.onUp(ev)
    }
    const tag = tags({
        style: () => `
            transform: translate3d(
                ${props.pos.x}px,
                ${props.pos.y}px,
                0
            );
        `
    })[0]
    tag.addEvent("mousedown", onDown)
    return tag
}

const pos = o({
    x: 0,
    y: 0
})

const app = () => div([
    myMoveBlend({pos}, ({style}) => [
        div({text: "Move Me", style})
    ])
])

mountTag(".app", app)
```

# The Composition Blending Example

```jsx
const pos = o({
    x: 0,
    y: 0
})
const size = o({
    x: 100,
    y: 100
})

const app = () => {
    let moveHandle = null
    return div([
        move({pos, target: () => moveHandle}, ({transform}) => [
            resize({pos, size}, ({width, height, resizers}) => [
                div({
                    style: () => `
                        position: relative;
                        ${ transform() }
                        ${ width() }
                        ${ height() }
                    `
                }, [
                    div({
                        onInit: t => moveHandle = t,
                        text: "Move Handle",
                        style: "padding: 10px"
                    }),
                    div(),
                    ...resizers()
                ])
            ])
        ]),
        div([
            // sort blend is blending styles from move, drag and drop blends
            // the same way move and resize are blended above
            // Therefore blending can be continuous / compositioned
            sort(({style}) => [
                div({text: "Item 1", style}),
            ]),
            sort(({style}) => [
                div({text: "Item 2", style}),
            ]),
            sort(({style}) => [
                div({text: "Item 3", style}),
            ]),
        ])
    ])
}

mountTag(".app", app)
```

Blends are invisible, they are just functionality wrappers that provide style and behavior to children tags. The blending effect can be set by choice on any children tag, allowing what we call blending art.

The actual DOM with all blends active

```html
<div>
    <div style="position: relative; transform: translate3d(0px, 0px, 0px); width: 100px; height: 100px;">
        <div style="padding: 10px;">Move Handle</div>
        <div></div>
        <div class="ResizerTop Resizer"></div>
        <div class="ResizerBottom Resizer"></div>
        <div class="ResizerLeft Resizer"></div>
        <div class="ResizerRight Resizer"></div>
    </div>
    <div>
        <div style="transform: translate3d(0px, 0px, 0px);">Item 1</div>
        <div style="transform: translate3d(0px, 0px, 0px);">Item 2</div>
        <div style="transform: translate3d(0px, 0px, 0px);">Item 3</div>
    </div>
</div>
```

# The Events Example

### In simple list form

```jsx
const list = mix()

const app = () => {
    const state = o({
        name: ""
    })
    return div([
        div([
            ...loop(list, (item, id) => [
                itemElement(item, id)
            ])
        ]),
        form({
            onSubmit: () => {
                list.add(o({
                    title: state.name,
                    renaming: false
                }))
                state.name = ""
            }
        }, [
            input({
                value: () => state.name,
                onUpdate: v => state.name = v
            })
        ])
    ])
}

const itemElement = (item, id) => {
    let sortHandle
    return sort({mix: list, target: () => sortHandle}, ({style}) => [
        div({style}, [
            div({text: () => item.title}),
            div({
                text: "Sort Handle",
                onInit: t => sortHandle = t
            }),
            div({
                text: "remove",
                onClick: () => list.delete(id)
            }),
            div({
                text: "rename",
                onClick: () => item.renaming = !item.renaming
            }),
            () => {
                if (item.renaming)
                    return input({
                        value: () => item.title,
                        onUpdate: v => item.title = v
                    })
            }
        ])
    ])
}

mountTag(".app", app)
```


