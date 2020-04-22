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
        <title>Tag.JS Test</title>
    </head>
    <body>
        <div class="app"></div>
        <script src="src/app.ts"></script>
    </body>
    </html>
    ```
3. npm install grafix
    > ./src/app.ts or ./src/app.js
    ```js
    import { div, mountTag } from 'grafix'

    const app = () => div({ text: "Hello World" })

    mountTag(".app", app)
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

# Kay kay, let's go for the examples

## The Hello World! Example

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
import {
    div, mountTag,
    forward, filter, o 
} from 'grafix'

const blend = (feed, tags) => {
    const props = {
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


