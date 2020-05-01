declare type ListData = {
    ref: ((...p) => TagChild[]), mix: Mix
}

const tagList = (props: ListData) => {
    const tag = comment()
    const onAddID = Unit.uniqueID()
    const onSortID = Unit.uniqueID()
    const onRemoveID = Unit.uniqueID()
    
    const add = (data: any, id: string) => {
        const element: Tag = (props.ref as any)(data, id)[0]
        element.props.name = id
        element.id = id
        tag.mount(element)
        tag.tags.set(id, element)
    }
    
    const getNode = (id: string): HTMLElement =>
        tag.tags.get(id).node
    
    const isUnderSameParent = (id: string): boolean => {
        const node = getNode(id)
        let same = true
        tag.tags.foreach((tag: Tag, tagID: string) => {
            if (tagID === id) return
            if (tag.node.parentNode !== node.parentNode) {
                same = false
                return false
            }
        })
        return same
    }
    
    const sort = (id1: string, id2: string) => {
        if (!id2) {
            if (fx.placeholder)
                if (!isUnderSameParent(id1))
                    return fx.placeholder.parentNode.appendChild(fx.placeholder)
            return getNode(id1).parentNode.appendChild(
                getNode(id1))
        }
        else {
            if (fx.placeholder)
                if (
                    fx.placeholder.parentNode === getNode(id1).parentNode ||
                    fx.placeholder.parentNode === getNode(id2).parentNode
                )
                    if (fx.placeholder.parentNode === getNode(id1).parentNode) {
                        const node = getNode(id1)
                        if (node.nextSibling)
                            return fx.placeholder.parentNode.insertBefore(fx.placeholder, node.nextSibling)
                        else return fx.placeholder.parentNode.appendChild(fx.placeholder)
                    }
                    else if (fx.placeholder.parentNode === getNode(id2).parentNode)
                        return getNode(id2).parentNode.insertBefore(
                            fx.placeholder, getNode(id2))
            getNode(id1).parentNode.insertBefore(
                getNode(id1),
                getNode(id2)
            )
        }
    }
    
    const remove = (id: string) => tag.tags.get(id).unmount(undefined, true)
    
    tag.onInit = () => {
        props.mix.onAdd((item, id) =>
            add(item, id), onAddID)
        props.mix.onSort((item1, item2, id1, id2) =>
            sort(id1, id2), onSortID)
        props.mix.onRemove((item, id) =>
            remove(id), onRemoveID)
    }
    
    tag.onMount = () => props.mix.foreach((data, id) => add(data, id))
    
    tag.onUnmount = () => {
        props.mix.removeOnAdd(onAddID)
        props.mix.removeOnSort(onSortID)
        props.mix.removeOnRemove(onRemoveID)
    }
    
    return tag
}
