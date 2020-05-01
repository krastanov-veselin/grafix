declare type MouseEventFunc = (ev?: MouseEvent) => void
// declare type List = [new () => Grafix, Mix, ...any[]] | [Mix, (...p) => TagChild[]]
declare type TagChild = Tag | [Mix, (...p) => TagChild[]] | (() => any) | TagChild[]
declare type Binding = [Unit<any>, string]
declare type Bindings = Binding[]
declare type TagValue = string | (() => string)
declare type TagObjBind = {
    objBinds: ObjBinds,
    func: () => any,
    id: string
}
/**
 * @description
 *  objID->prop->bindType->{
 *      objBinds: ObjBinds,
 *      func: () => any,
 *      id: string
 *  }
 */
declare type Binds = Mix<Mix<Mix<TagObjBind>>>
/**
 * @description prop->bindFuncs
 */
declare type ObjBinds = Mix<Mix<VoidFunction>>
declare type Attributes = {
    src: string,
    href: string,
    type: string,
    rel: string,
    media: string,
    value: string,
    placeholder: string,
    disabled: boolean,
    width: string,
    height: string,
    class: string,
    style: string,
    id: string
}
declare type NodeProps = Partial<TagProps> | TagChild[]
declare type NodeTags = TagChild[]