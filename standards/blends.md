> Provision Standard
* Single Style
* Combined Reduction
* Separated Reduction

> Feeding Standard
* Databinding
* Targets

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