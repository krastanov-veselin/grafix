const state = o({
    title: "hello world"
})

const app = () => div({
    text: () => state.title
})

mountTag(".gfx", app)
