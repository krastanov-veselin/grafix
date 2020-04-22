<p align="center">
  <img src="https://github.com/krastanov-veselin/grafix/blob/master/grafix.png?raw=true">
</p>

[![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/react)

### Grafix is a library that allows you to do rapid UI Logic & Layout with automatic databinding

```js
npm install grafix
```

* **Alive (Proxies <3):** Everything you write looks & feels alive. When you change anything in your data, regardless where the data is the UI automatically adapts.
* **TypeScript Ready:** Without any initial boilerplate it just works out of the box. The entire project is built in TypeScript as one module and exported in both .js and d.ts files, which excludes the need to install additionally @type/grafix. However if you want to use AMD modular architecture you need to install @types/grafix from DefinitelyTyped or simply make an empty folder ./node_modules/@types/grafix
* **JavaScript JSDocked:** Even tho we love TypeScript, there are many of us who would prefer the oldschool JS, so we took our time to JSDoc the project almost to the look & feel of TypeScript's level of intellisense control.
* **Composition / Reusability** Every single element is a function that receives props and returns a tag which makes elements composable and reusable.
* **Zero Effort Databinding** While developing your tags as if you would do in normal HTML file you would probably want to add something like style="width: " + size.x + "px", well, just write it and it will automatically do all the binding for you, so no more databinding architectural effort!
* **Blending** Create immersive blending functions that wrap tags and blend them with behavior and style.
* **Efficiency** Without any expensive virtual doms or intense diffing for simple operations, Grafix simply does the subscribe->update pattern using the JavaScript Proxy API.
* **Simplicity** Just write a tag, router, loop, text, styles, classes, attributes and that's it! Just like you would do in HTML.
* **Performance Disclaimer** Even tho proxies aren't as fast as the actual object they are incredibly fast! Yeah, since all reads and writes are going through a getter and setter plus databinding it is expected to be somewhat more expensive. Is it worth it? Here are our performance.now() speedtests: [100k boolean writes NonProxy=2.820000001520384 Proxy=6.560000001627486] [100k boolean reads NonProxy=1.2399999977787957 Proxy=5.03000000026077]

## Installation

> Modular
1. npm install grafix
2. enjoy

> Vanilla

1. get grafix.js from ./vanilla folder
2. enjoy #vanillaJS

> Modular [Parcel + TypeScript + Grafix]

1. npm install typescript -g
    > tsconfig.json
    ```json
    {
        "compilerOptions": {
            "target": "es5",
            "module": "commonjs",
            "lib": ["es2017", "es7", "es6", "dom"],
            "declaration": true,
            "outDir": "dist",
            "esModuleInterop": true,
            "moduleResolution": "node",
        },
        "exclude": [
            "node_modules",
            "dist"
        ]
    }
    ```
2. npm install parcel -g
    > index.html
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Grafix Test</title>
    </head>
    <body>
        <div class="gfx"></div>
        <script src="src/app.ts"></script>
    </body>
    </html>
    ```
3. npm install grafix
    > ./src/app.ts or ./src/app.js
    ```js
    import { div, mountTag } from 'grafix'
    
    const app = () => div({ text: "Hello World" })
    
    mountTag(".gfx", app)
    ```
4. Setup Build & Start scripts
    > package.json
    ```json
    {
        "name": "my-new-grafix-app",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "build": "tsc ./src/app.ts",
            "start": "parcel ./index.html"
        },
        "author": "",
        "license": "ISC",
        "dependencies": {
            "@types/node": "^13.13.1",
            "grafix": "^1.0.1"
        },
        "devDependencies": {
            "typescript": "^3.8.3"
        }
    }

    ```

# The universe of our philosophy
## We believe that the UI development is a 9 component world
> node
```js
div()
```

> style
```js
div({
    style: () => ``
})
```

> classes
```js
div({
    classes: () => ``
})
```

> text
```js
div({
    text: () => ``
})
```

> router
```js
() => {
    if (a) return div({ text: "A" })
    if (b) return div({ text: "B" })
}
```

> loop
```js
div([
    ...loop(items, (item, id), [
        div({ text: id })
    ])
])
```

> element
```js
const element = (props) => {
    const state = o({
        data: "Hello World",
    })
    return div({ text: () => state.data + props.prop })
}
```

> blend
```js
div([
    behavior({}, ({ style }) => [
        div({ style, text: "Blended Div" })
    ])
])
```

> data
```js
const data = o({
    prop: "Hello World"
})
```

# Kay kay, let's go for the examples

## The Hello World! Example

Make sure you have an element like the div below somewhere in your index.html<br />
The classname doesn't really matter as long as you can query select it
<br />
```html
<div class="gfx"></div>
```

```jsx
import { div, mountTag, o } from 'grafix'

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

mountTag(".gfx", app)
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
import { o, mountTag, div } from 'grafix'

const data = o({
    location: "home"
})

const app = () => div([
    div({
        text: "Home",
        onClick: () => data.location = "home"
    }),
    div({
        text: "Settings",
        onClick: () => data.location = "settings"
    }),
    div({
        text: "Gallery",
        onClick: () => data.location = "gallery"
    }),
    // This function here is the router
    () => {
        // These conditions are the routes
        // When ever data changes, it reroutes
        // It's practically magic
        if (data.location === "home")
            return div({text: "This is Home"})
        if (data.location === "settings")
            return div({text: "This is Settings"})
        if (data.location === "gallery")
            return div({text: "This is Gallery"})
    }
])

mountTag(".gfx", app)
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
import { mountTag, div, loop } from 'grafix'

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

mountTag(".gfx", app)
```

# The Stateful Loop Example

```jsx
import {
    mountTag, div, loop,
    mix, o, input
} from 'grafix'

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

mountTag(".gfx", app)
```

This example will display 3 divs with their content
1. When you click on a div it will get deleted along with the dataset item
2. When you rightclick on a div it will add a new random item to the dataset
3. When you change the input's value it everything will get statefully updated!

# The Stateful Attributes Example

```jsx
import { mountTag, div, o, grafix } from 'grafix'

const settings = o({
    title: "World!",
    hasColor: false,
    color: "#999",
    hasAttr: false,
    attrVal: "World",
    padding: 20,
    transition: 1,
    textColor: "#333",
    fontFamily: "",
    blink: false,
    preBlink: false
})

const app = () => div([
    div({
        text: () => "Hello " + settings.title,
        style: () => `
            background-color: ${
                settings.hasColor ?
                    settings.color :
                    "#555"
            };
            padding: ${ settings.padding }px;
            transition: all ${ settings.transition }s;
            border-radius: 20px;
            color: ${ settings.textColor };
            font-family: ${ settings.fontFamily };
            transform: ${
                settings.preBlink ? 
                    "scale(1.005)" :
                settings.blink ?
                    "scale(0.99)" :
                    "scale(1)"
            };
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

setTimeout(() => settings.hasColor = true, 1000)
setTimeout(() => settings.color = "#39f", 2000)
setTimeout(() => {
    settings.padding = 80
    settings.transition = 3
}, 3000)
setTimeout(() => {
    settings.title = ""
    const text = ", we all love to do <grafix>!"
    let time = 0
    let passed = 0
    for (let i = 0; i < text.length; i++)
        setTimeout(() => {
            settings.title += text[i]
            passed++
            if (passed === text.length) {
                settings.transition = 0
                setTimeout(() => {
                settings.fontFamily = "verdana"
                setTimeout(() =>
                settings.textColor = "#fff", 1000)
                settings.transition = 1
                setInterval(() => {
                settings.transition = 0.3
                settings.preBlink = true
                setTimeout(() => {
                settings.transition = 0.5
                settings.preBlink = false
                settings.blink = true
                setTimeout(() => {
                settings.transition = 2
                settings.blink = false
                }, 500)
                }, 300)
                }, 3000)
                }, 300)
            }
        }, time += grafix.random(50, 300))
}, 3000)

mountTag(".gfx", app)
```

All attributes will automatically update when ever some of the binded properties change.
For example when settings.color changes the background-color will be repainted.
Or when the settings.hasColor is changed then the colored style will be either added or removed.

# The Modular Example

```jsx
import { o, div, form, input, mountTag } from 'grafix'

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

mountTag(".gfx", app)
```

# The Nested Router Example

```jsx
import { o, div, mountTag } from 'grafix'

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

settings.location = "home"

setTimeout(() => settings.location = "settings", 1000)
setTimeout(() => {
    settings.innerLocation = "nested1"
    settings.location = "nested"
}, 2000)
setTimeout(() => settings.innerLocation = "nested2", 3000)
setTimeout(() => {
    settings.innerLocation2 = "nested1"
    settings.innerLocation = "nested3"
}, 4000)
setTimeout(() => settings.innerLocation2 = "nested2", 5000)

mountTag(".gfx", app)
```

# The Create Your Own Tag Example

```jsx
import {
    div, mountTag, node,
    arrange, setDefaultStyle
} from 'grafix'

const myTag = (props?: NodeProps, tags?: NodeTags) =>
    node("mycustomtag", props, tags)

const myStyledTag = (props?: NodeProps, tags?: NodeTags) => {
    [props, tags] = arrange(props, tags)
    setDefaultStyle(props, `
        padding: 10px;
        background-color: #39f;
        display: block;
    `)
    return node("mystyledtag", props, tags)
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

mountTag(".gfx", app)
```

# The Create Your Own Blend Example

```jsx
import {
    div, mountTag,
    forward, filter, o 
} from 'grafix'

interface BlendFeed {
    target: () => Tag,
    data: {
        pos: Pos
    }
}

interface BlendProps {
    reducedA: () => string
    reducedB: () => string
    reducedC: () => string
    reducedD: () => string
    combinedA: () => string
    combinedB: () => string
    style: () => string
}

const blend = (
    feed: Partial<BlendFeed>,
    tags: (p: BlendProps
) => NodeTags) => {
    const props: BlendProps = {
        reducedA: () => `${ feed.data.pos.x }px`,
        reducedB: () => `${ feed.data.pos.y }px`,
        reducedC: () => `5px`,
        reducedD: () => `10px`,
        combinedA: () => `
            width: ${ props.reducedA() };
            height: ${ props.reducedB() };
        `,
        combinedB: () => `
            padding: ${ props.reducedC() };
            margin: ${ props.reducedD() };
        `,
        style: () => `
            ${ props.combinedA() }
            ${ props.combinedB() }
        `,
        
    }
    
    const tag = forward(tags(props))
    const target = filter(feed, tag)
    
    // Do blending logic to target
    target.addEvent("click", () => {
        feed.data.pos.x++
        feed.data.pos.y++
    })
    
    return tag
}

const app = () => {
    const data = o({
        pos: o({
            x: 0,
            y: 0
        })
    })
    let targetTag: Tag
    
    return div([
        blend({data, target: () => targetTag}, ({ style }) => [
            div({
                onCreate: tag => targetTag = tag,
                text: "Blended Tag",
                style: () => `
                    background-color: #39f;
                    user-select: none;
                    ${ style() }
                `
            })
        ])
    ])
}

mountTag(".gfx", app)
```

# The Composition Blending Example

```jsx
import {
    div, mountTag, o,
    move, resize, sort
} from 'grafix'

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
        move({data: pos, target: () => moveHandle}, ({transform}) => [
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
            sort({}, ({style}) => [
                div({text: "Item 1", style}),
            ]),
            sort({}, ({style}) => [
                div({text: "Item 2", style}),
            ]),
            sort({}, ({style}) => [
                div({text: "Item 3", style}),
            ]),
        ])
    ])
}

mountTag(".gfx", app)
```

Blends are invisible, they are just functionality wrappers that provide style and behavior to children tags. The blending effect can be set by choice on any children tag, allowing what we call blending art.

# The Events Example

### In simple list form

```jsx
import {
    div, mountTag,
    o, mix, sort, loop,
    form, input
} from 'grafix'

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
    return sort({data: list, target: () => sortHandle}, ({style}) => [
        div({style}, [
            div({text: () => item.title}),
            div({
                text: "Sort Handle",
                onCreate: t => sortHandle = t
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

mountTag(".gfx", app)
```

# The Multiple Grafix Instances Example

> index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grafix Test</title>
</head>
<body>
    <div class="gfx1"></div>
    <div class="gfx2"></div>
    <script src="src/app.ts"></script>
</body>
</html>
```

> src/app.ts
```js
import { div, mountTag, o } from 'grafix'

const data = o({
    title1: "Instance 1",
    title2: "Instance 2"
})

const app1 = () => div({
    text: () => data.title1
})
const app2 = () => div({
    text: () => data.title2
})

setTimeout(() => data.title1 = "Instance 1 Modified!", 2000)
setTimeout(() => data.title2 = "Instance 2 Modified!", 3000)

mountTag(".gfx1", app1)
mountTag(".gfx2", app2)
```
