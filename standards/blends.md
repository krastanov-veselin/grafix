> Provision Standard
* Single Style
* Combined Reduction
* Separated Reduction
* Optional Data

> Feeding Standard
* Databinding
* Targets
* Optional Data

> Example Definition
```js
const blend = (feed, tags) => {
    const props = {
        reducedA: () => `0px`,
        reducedB: () => `0px`,
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
    const target = target(feed, tag)
    
    // Do blending logic to target
    
    return tag
}
```

> Example Usage
```js
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

> TypeScript Usage Example
```js
import {
    div, mountTag, o,
    forward, filter 
} from 'grafix'

declare type MoveFeed = {
    data: Pos,
    target?: () => Tag,
    onDown?: (ev?: MouseEvent) => void,
    onMove?: (ev?: MouseEvent) => void,
    onUp?: (ev?: MouseEvent) => void
}
declare type MoveProps = {
    style: () => string,
    translate: () => string,
    transform: () => any
}
const move = (feed: MoveFeed, tags?: ((p: MoveProps) => Tag[])) => {
    const props: MoveProps = {
        translate: () => `
            translate3d(${ feed.data.x }px, ${ feed.data.y }px, 0)
        `,
        transform: () => `
            transform: ${ props.translate() };
        `,
        style: () => props.transform()
    }
    const tag = forward(tags(props))
    const target = filter(feed, tag)
    
    // Blend Logic
    const start = { x: 0, y: 0 }
    const onDown = (ev: MouseEvent) => {
        if (feed.onDown)
            feed.onDown(ev)
        start.x = ev.pageX - feed.data.x
        start.y = ev.pageY - feed.data.y
        window.onmousemove = onMove
        window.onmouseup = onUp
    }
    const onMove = (ev: MouseEvent) => {
        feed.data.x = ev.pageX - start.x
        feed.data.y = ev.pageY - start.y
        if (feed.onMove) feed.onMove(ev)
    }
    const onUp = (ev: MouseEvent) => {
        window.onmousemove = null
        window.onmouseup = null
        if (feed.onUp) feed.onUp(ev)
    }
    // ~Blend Logic
    
    target.addEvent("mousedown", onDown)
    
    return tag
}

const app = () => {
    const pos = o({
        x: 0,
        y: 0
    })
    let targetTag: Tag
    
    return div([
        move({data: pos, target: () => targetTag}, ({ style }) => [
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