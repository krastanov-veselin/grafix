class Size {
    x = 0
    y = 0
}
declare type ResizeData = {
    size?: Size,
    pos?: Pos
}
declare type ResizeProps = {
    width: () => string,
    height: () => string,
    translate: () => string,
    style: () => string,
    resizers: () => Tag[]
}
const resize = (props: ResizeData, tags?: (p?: ResizeProps) => Tag[]) => {
    const start = {
        x: 0,
        y: 0,
        posX: 0,
        posY: 0
    }
    const pos = {
        top: o(Pos),
        bottom: o(Pos),
        left: o(Pos),
        right: o(Pos),
    }
    return tags({
        width: () => "width: " + props.size.x + "px;",
        height: () => "height: " + props.size.y + "px;",
        translate: () => "translate3d(" + props.pos.x + "px, " + props.pos.y + "px, 0)",
        style: () => `
            width: ${props.size.x}px;
            height: ${props.size.y}px;
            transform: translate3d(${props.pos.x}px, ${props.pos.y}px, 0);
        `,
        resizers: () => [
            move({pos: pos.top, onDown: () => {
                pos.top.y = 0
                start.x = props.size.x
                start.y = props.size.y
                if (props.pos) {
                    start.posX = props.pos.x
                    start.posY = props.pos.y
                }
            }, onMove: () => {
                props.size.y = start.y - pos.top.y
                if (props.pos)
                    props.pos.y = start.posY + pos.top.y
            }}, () => [
                div({classes: "ResizerTop Resizer"})
            ]),
            move({pos: pos.bottom, onDown: () => {
                pos.bottom.y = 0
                start.x = props.size.x
                start.y = props.size.y
                if (props.pos) {
                    start.posX = props.pos.x
                    start.posY = props.pos.y
                }
            }, onMove: () => {
                props.size.y = start.y + pos.bottom.y
            }}, () => [
                div({classes: "ResizerBottom Resizer"})
            ]),
            move({pos: pos.left, onDown: () => {
                pos.left.x = 0
                start.x = props.size.x
                start.y = props.size.y
                if (props.pos) {
                    start.posX = props.pos.x
                    start.posY = props.pos.y
                }
            }, onMove: () => {
                props.size.x = start.x - pos.left.x
                if (props.pos)
                    props.pos.x = start.posX + pos.left.x
            }}, () => [
                div({classes: "ResizerLeft Resizer"})
            ]),
            move({pos: pos.right, onDown: () => {
                pos.right.x = 0
                start.x = props.size.x
                start.y = props.size.y
                if (props.pos) {
                    start.posX = props.pos.x
                    start.posY = props.pos.y
                }
            }, onMove: () => {
                props.size.x = start.x + pos.right.x
            }}, () => [
                div({classes: "ResizerRight Resizer"})
            ])
        ]
    })[0]
}
