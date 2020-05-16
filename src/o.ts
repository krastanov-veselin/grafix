/** 
 * @function
 * @template A
 * @returns {A}
 * */
const o = <C = any>(/** @type {(new() => A)|A} */ref: (new () => C) | C, /** @type {A} */d?: Partial<C>, refreshable: boolean = false): C => {
    const id = Unit.uniqueID()
    let object: any = ref instanceof Function ?
        new (ref as any as new () => C)() : ref
    if (d) for (const key in d)
        if (typeof object[key as string] !== "undefined")
            object[key as string] = d[key]
    const binds: ObjBinds = new Mix()
    const reg = (prop: string) => {
        if (currentTag.binds.has(id))
        if (currentTag.binds.get(id).has(prop))
        if (currentTag.binds.get(id).get(prop).has(currentBindType))
            return
        if (!currentTag.binds.has(id))
            currentTag.binds.set(id, new Mix())
        if (!currentTag.binds.get(id).has(prop))
            currentTag.binds.get(id).set(prop, new Mix())
        const bindID = Unit.uniqueID()
        currentTag.binds.get(id).get(prop).set(currentBindType, {
            objBinds: binds,
            func: currentBindFunc,
            id: bindID
        })
        if (!binds.has(prop)) binds.set(prop, new Mix())
        binds.get(prop).set(bindID, currentBindFunc)
        bindingChanged = true
    }
    const p = new Proxy(object, {
        get: (obj, prop: string) => {
            if (bindListen) reg(prop)
            return obj[prop]
        },
        set: (obj, prop, val) => {
            if (obj[prop] === val && refreshable === false) return true
            obj[prop] = val
            if (binds.has(prop as string))
                binds.get(prop as string).foreach(u => u(), true)
            return true
        }
    })
    object = null
    return p
}
