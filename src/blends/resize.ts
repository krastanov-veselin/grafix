declare type ResizeFeed = {
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

const resize = (feed: ResizeFeed, tags: (p?: ResizeProps) => Tag[]) => {
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
    const resizerStyle = `
        position: absolute;
        background-color: pink;
    `
    return forward(tags({
        width: () => "width: " + feed.size.x + "px;",
        height: () => "height: " + feed.size.y + "px;",
        translate: () => "translate3d(" + feed.pos.x + "px, " + feed.pos.y + "px, 0)",
        style: () => `
            width: ${feed.size.x}px;
            height: ${feed.size.y}px;
            transform: translate3d(${feed.pos.x}px, ${feed.pos.y}px, 0);
        `,
        resizers: () => [
            move({data: pos.top, onDown: () => {
                pos.top.y = 0
                start.x = feed.size.x
                start.y = feed.size.y
                if (feed.pos) {
                    start.posX = feed.pos.x
                    start.posY = feed.pos.y
                }
            }, onMove: () => {
                feed.size.y = start.y - pos.top.y
                if (feed.pos)
                    feed.pos.y = start.posY + pos.top.y
            }}, () => [
                div({
                    classes: "ResizerTop Resizer",
                    style: `
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 10px;
                        cursor: move;
                        ${resizerStyle}
                    `
                })
            ]),
            move({data: pos.bottom, onDown: () => {
                pos.bottom.y = 0
                start.x = feed.size.x
                start.y = feed.size.y
                if (feed.pos) {
                    start.posX = feed.pos.x
                    start.posY = feed.pos.y
                }
            }, onMove: () => {
                feed.size.y = start.y + pos.bottom.y
            }}, () => [
                div({
                    classes: "ResizerBottom Resizer",
                    style: `
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 10px;
                        cursor: move;
                        ${resizerStyle}
                    `
                })
            ]),
            move({data: pos.left, onDown: () => {
                pos.left.x = 0
                start.x = feed.size.x
                start.y = feed.size.y
                if (feed.pos) {
                    start.posX = feed.pos.x
                    start.posY = feed.pos.y
                }
            }, onMove: () => {
                feed.size.x = start.x - pos.left.x
                if (feed.pos)
                    feed.pos.x = start.posX + pos.left.x
            }}, () => [
                div({
                    classes: "ResizerLeft Resizer",
                    style: `
                        top: 0;
                        left: 0;
                        width: 10px;
                        height: 100%;
                        cursor: move;
                        ${resizerStyle}
                    `
                })
            ]),
            move({data: pos.right, onDown: () => {
                pos.right.x = 0
                start.x = feed.size.x
                start.y = feed.size.y
                if (feed.pos) {
                    start.posX = feed.pos.x
                    start.posY = feed.pos.y
                }
            }, onMove: () => {
                feed.size.x = start.x + pos.right.x
            }}, () => [
                div({
                    classes: "ResizerRight Resizer",
                    style: `
                        top: 0;
                        right: 0;
                        width: 10px;
                        height: 100%;
                        cursor: move;
                        ${resizerStyle}
                    `
                })
            ])
        ]
    }))
}
