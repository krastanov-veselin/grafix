enum bindType {
    text = "text",
    styles = "styles",
    classes = "classes",
    router = "router",
    attributes = "attributes",
    css = "css"
}
let bindListen: boolean = false
let currentTag: Tag = null
let currentBindType: bindType = bindType.text
let currentBindFunc: () => any = null
let bindingChanged: boolean = false

const enableBinding = (type: bindType, data: any, func: () => any): void => {
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

const bind = (type: bindType, data: any, apply: Function): void => {
    enableBinding(type, data, () => bind(type, data, apply))
    apply()
    if (bindListen) disableBinding()
}

const cleanSubscriptions = (data: any): void => {
    data.binds.foreach(obj =>
    obj.foreach((prop, propName) =>
    prop.foreach(binding =>
        binding.objBinds.get(propName).delete(binding.id)
    )))
}
