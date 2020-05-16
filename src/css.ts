const css = () => {
    visuals.grafix = () => `
::-webkit-scrollbar {
    width: 10px !important;
    height: 10px !important;
}

::-webkit-scrollbar-corner {
    background-color: transparent;
}

.InvisibleScroll::-webkit-scrollbar {
    width: 0px !important;
}

html, body, .gfx, .gfx > div {
    height: 100%;
}

body {
    margin: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    overflow: hidden;
}

.FloatLeft {
    float: left;
}

.FloatRight {
    float: right;
}

.FloatFix::before, .FloatFix::after {
    display: block;
    content: "";
    float: none;
    clear: both;
}

.ColLeft {
    width: 300px;
    float: left;
    height: 100%;
}

.ColRight {
    width: calc(100% - 300px);
    height: 100%;
    float: left;
}

.Input {
    border-radius: 0px;
    border: 0;
    line-height: 20px;
    box-sizing: border-box;
    padding: 0;
    height: 20px;
    outline: 0;
    font-family: code;
    display: block;
    width: 100%;
    font-size: 20px;
    /* border-left: 3px solid #39f; */
}

.TinyInput {
    width: calc(100% - 75px);
    height: 20px;
    margin-left: 10px;
    margin-right: 7px;
}

.Button {
    position: relative;
    user-select: none;
    box-sizing: border-box;
    text-align: center;
}

div {
    user-select: none;
}

.HalfButton {
    position: relative;
    width: 50%;
    box-sizing: border-box;
    text-align: center;
}

.Background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.Abs {
    position: absolute;
}

.Rel {
    position: relative;
}

.Full {
    width: 100%;
    height: 100%;
}

.Grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10px, 1fr));
}

.TabView {
    height: calc(100% - 40px);
    perspective: 700px;
}

.TabViewElement {
    transition: transform 0.5s, opacity 0.5s;
    transform: translate3d(0, 0, -50px);
    opacity: 0;
}

.TabViewElement.active {
    transform: translate3d(0, 0, 0);
    opacity: 1;
}

.Tabs, .TabView > div {
    width: 100%;
    height: 100%;
}

.HalfWidth {
    width: 50%;
}

.BorderBox {
    box-sizing: border-box;
}

.EditorInputValue {
    height: 100%;
    perspective: 700px;
}

.EditorInputCursor {
    opacity: 0;
    width: 0;
    height: 100%;
    position: relative;
    z-index: 2;
    transition: opacity 0.3s;
    pointer-events: none;
}

.EditorInputCursor.active {
    opacity: 1;
}

.EditorInputCursor > div {
    width: 2px;
    height: 100%;
    background-color: #39f;
}

.EditorInputLetter {
    width: 12px;
    height: 100%;
}

.EditorInputLetter.animation {
    transition: transform 0.3s, opacity 0.3s, width 0.3s, color 0.3s, font-weight 0.3s, font-style 0.3s;
    transform: translate3d(-3px, 0, 0);
    opacity: 0;
    width: 0;
}

.EditorInputLetter.animation.active {
    transform: translate3d(0, 0, 0);
    opacity: 1;
    width: 12px;
}

.EditorInputLetter.bold {
    font-weight: 700;
}

.EditorInputLetter.italic {
    font-style: italic;
}

.EditorInputLetter.tab {
    width: calc(48px)
}

.EditorInputLetter.selected {
    background-color: #39f5
}

.EditorInput {
    width: 100% !important;
    overflow: hidden;
}

.InputPlaceholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.5s, transform 0.5s;
    opacity: 0;
    pointer-events: none;
    transform: translate3d(-10px, 0, 0)
}

.InputPlaceholder.active {
    opacity: 1;
    transform: translate3d(0, 0, 0)
}
`
    if (document.head.children.length > 1)
        document.head.insertBefore(
            visuals.grafix,
            document.head.children[0]
        )
}
