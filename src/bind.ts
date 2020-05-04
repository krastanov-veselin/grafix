class BindData {
    public bindsCache: any = {}
    public binds: Binds = mix()
}
enum bindType {
    text = "text",
    styles = "styles",
    classes = "classes",
    router = "router",
    attributes = "attributes",
    css = "css"
}
let bindListen: boolean = false
let currentTag: BindData = null
let currentBindType: string = bindType.text
let currentBindFunc: () => any = null
let bindingChanged: boolean = false

const enableBinding = (type: string, data: BindData, func: () => any): void => {
    bindingChanged = false
    currentBindType = type
    currentBindFunc = func
    currentTag = data
    bindListen = true
}

const disableBinding = (): void => {
    bindingChanged = false
    bindListen = false
    currentBindType = null
    currentBindFunc = null
    currentTag = null
}

const bind = (type: string, data: BindData, apply: Function): void => {
    enableBinding(type, data, () => bind(type, data, apply))
    apply()
    if (bindListen) disableBinding()
}

const cleanSubscriptions = (data: BindData): void => {
    data.binds.foreach(obj =>
    obj.foreach((prop, propName) =>
    prop.foreach(binding =>
        binding.objBinds.get(propName).delete(binding.id)
    )))
}
