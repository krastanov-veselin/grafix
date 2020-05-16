'use strict'

declare type AssocNode<T, I> = {
    data: T;
    id: I;
    prev: AssocNode<T, I> | null;
    next: AssocNode<T, I> | null;
}
declare type MixEvent<T, I> = (item?: T, id?: I) => void
declare type MixSortEvent<T, I> = (item1?: T, item2?: T, id1?: I, id2?: I) => void
declare type MixSubscriberSet<T, I> = {
    add: Mix<MixEvent<T, I>>,
    sort: Mix<MixSortEvent<T, I>>,
    remove: Mix<MixEvent<T, I>>
}

class AssocList<I, T> {
    protected ids: Map<I, () => AssocNode<T, I>> = new Map()
    public firstNode: AssocNode<T, I> | null = null
    public lastNode: AssocNode<T, I> | null = null
    public size: number = 0
    protected uniqueMix: boolean = false
    private focusNode: AssocNode<T, I> | null = null
    protected binds: MixSubscriberSet<T, I> = null
    
    public constructor(items?: [I, T][] | T[], uniqueMix: boolean = false, subscribable: boolean = true) {
        this.uniqueMix = uniqueMix
        if (subscribable)
            this.binds = {
                add: new Mix<MixEvent<T, I>>(undefined, undefined, false),
                sort: new Mix<MixSortEvent<T, I>>(undefined, undefined, false),
                remove: new Mix<MixEvent<T, I>>(undefined, undefined, false)
            }
        if (items) for (let i = 0; i < items.length; i++)
            if (items[i] instanceof Array)
                this.set(items[i][0], items[i][1]);
            else
                this.add(items[i] as T);
    }
    
    public onAdd(event: MixEvent<T, I>, id: string = null): string {
        if (!id) id = Unit.uniqueID()
        if (this.binds.add.has(id)) return
        this.binds.add.set(id, event)
        return id
    }
    
    public onSort(event: MixSortEvent<T, I>, id: string = null): string {
        if (!id) id = Unit.uniqueID()
        if (this.binds.sort.has(id)) return
        this.binds.sort.set(id, event)
        return id
    }
    
    public onRemove(event: MixEvent<T, I>, id: string = null): string {
        if (!id) id = Unit.uniqueID()
        if (this.binds.remove.has(id)) return
        this.binds.remove.set(id, event)
        return id
    }
    
    public removeOnAdd(id: string): void {
        if (!this.binds.add.has(id)) return
        this.binds.add.delete(id)
    }
    
    public removeOnSort(id: string): void {
        if (!this.binds.sort.has(id)) return
        this.binds.sort.delete(id)
    }
    
    public removeOnRemove(id: string): void {
        if (!this.binds.remove.has(id)) return
        this.binds.remove.delete(id)
    }
    
    public export(): [I, T][] {
        const arr: [I, T][] = []
        this.foreach((item, id) =>
            arr.push([id, item]))
        return arr
    }
    
    public get first(): AssocNode<T, I> | null {
        return this.firstNode
    }
    
    public get last(): AssocNode<T, I> | null {
        return this.lastNode
    }
    
    public get preEnd(): T {
        return this.lastNode.prev.data
    }
    
    public firstID(): I {
        return this.first.id
    }
    
    public get firstItem(): T {
        return this.first.data
    }
    
    public lastID(): I {
        return this.last.id
    }
    
    public get lastItem(): T {
        return this.last.data
    }
    
    public start(): T {
        return this.firstItem
    }
    
    public end(): T {
        return this.lastItem
    }
    
    public get next() {
        if (this.focusNode)
            if (this.focusNode.next)
                this.focusNode = this.focusNode.next
        return this
    }
    
    public get prev() {
        if (this.focusNode)
            if (this.focusNode.prev)
                this.focusNode = this.focusNode.prev
        return this
    }
    
    public focus(id: I): AssocList<I, T> {
        if (this.has(id))
            this.focusNode = this.getNode(id)
        return this
    }
    
    public getID(): I {
        if (this.focusNode)
            return this.focusNode.id
        return null
    }
    
    public add(item: T, beforeID?: I): string {
        if (
            this instanceof Mix &&
            typeof item === "string" &&
            this.uniqueMix
        ) {
            this.set(item as any, item, beforeID)
            return item
        }
        const id = Unit.uniqueID()
        this.set(id as any, item, beforeID)
        return id
    }
    
    public pre(item: T): AssocList<I, T> {
        const id = this.add(item)
        if (this.size !== 1)
            this.sort(
                (id as any) as I,
                (this.firstID() as any) as I)
        return this
    }
    
    public preAssoc(id: I, item: T): AssocList<I, T> {
        this.set(id, item)
        if (this.size !== 1)
            this.sort(
                id,
                (this.firstID() as any) as I)
        return this
    }
    
    public push(item: T): AssocList<I, T> {
        this.add(item)
        return this
    }
    
    public set(id: I, item: T, beforeID?: I): void {
        let next: AssocNode<T, I> = null
        if (this.has(id)) {
            next = this.getNode(id).next
            this.delete(id)
        }
        const node: AssocNode<T, I> = {
            data: item,
            id,
            prev: this.lastNode,
            next: null
        }
        if (this.lastNode !== null) this.lastNode.next = node
        if (this.firstNode === null) this.firstNode = node
        this.lastNode = node
        this.ids.set(id, () => node)
        this.size++
        if (beforeID) this.sort(id, beforeID, true)
        if (this.binds)
        if (this.binds.add.size)
            this.binds.add.foreach(subscriber =>
                subscriber(item, id))
        if (next) this.sort(id, next.id)
    }
    
    public shift(): T {
        if (!this.size) return null
        const item: T = this.get(this.firstNode.id)
        this.delete(this.firstNode.id)
        return item
    }
    
    public pop(): T {
        if (!this.size) return null
        const item: T = this.get(this.lastNode.id)
        this.delete(this.lastNode.id)
        return item
    }
    
    public index(n: number): T {
        let i = 0
        let result:T = null
        this.foreach(item => {
            if (i === n) {
                result = item
                return false
            }
            i++
        })
        return result
    }
    
    public iteratedSort(callback: (a: T, b: T) => number): void {}
    
    public sort(beforeID: I, afterID: I, silent: boolean = false): void {
        if (beforeID === afterID) return
        if (this.ids.has(beforeID) === false) return
        const before = this.getNode(beforeID)
        if (before.prev && before.next) {
            before.next.prev = before.prev
            before.prev.next = before.next
        } else if (before.prev) {
            before.prev.next = null
            this.lastNode = before.prev
        } else if (before.next) {
            before.next.prev = null
            this.firstNode = before.next
        }
        if (afterID === null) {
            this.lastNode.next = before
            before.prev = this.lastNode
            before.next = null
            this.lastNode = before
            if (!silent)
            if (this.binds)
            if (this.binds.sort.size)
                this.binds.sort.foreach(subscriber =>
                    subscriber(this.get(beforeID), null, beforeID, null))
            return
        }
        const after = this.getNode(afterID)
        if (this.ids.has(afterID) === false) return
        if (after.prev) {
            after.prev.next = before
            before.prev = after.prev
        } else {
            before.prev = null;
            this.firstNode = before
        }
        before.next = after
        after.prev = before
        if (after.id === this.first.id) {
            before.prev = null
            this.firstNode = before
        }
        if (!silent)
        if (this.binds)
        if (this.binds.sort.size)
            this.binds.sort.foreach(subscriber =>
                subscriber(this.get(beforeID), this.get(afterID), beforeID, afterID))
    }
    
    public has(id: I): boolean {
        return this.ids.has(id)
    }
    
    public get(id?: I): T {
        if (!id) if (this.focusNode)
            return this.focusNode.data
        if (this.has(id) === false)
            return null
        return this.ids.get(id)().data
    }
    
    public getNode(id: I): AssocNode<T, I> {
        return this.ids.get(id)()
    }
    
    public clean(): void {
        this.foreach((item, id) =>
            this.binds.remove.foreach(event => event(item, id)))
        this.ids = new Map<I, () => AssocNode<T, I>>()
        this.firstNode = null
        this.lastNode = null
        this.size = 0
    }
    
    public delete(id: I): void {
        if (this.has(id) === false) return
        let firstLastDelete = false
        if (this.firstNode.id === id) {
            if (this.firstNode.next === null)
                this.firstNode = null
            else if (this.firstNode.next.id === id) {
                this.firstNode = null
                this.lastNode = null
            } else {
                this.firstNode.next.prev = null
                this.firstNode = this.firstNode.next
            }
            firstLastDelete = true
        }
        if (this.lastNode.id === id) {
            if (this.lastNode.prev === null)
                this.lastNode = null
            else if (this.lastNode.prev.id === id) {
                this.firstNode = null
                this.lastNode = null
            } else {
                this.lastNode.prev.next = null
                this.lastNode = this.lastNode.prev
            }
            firstLastDelete = true
        }
        if (firstLastDelete === false) {
            const node = this.ids.get(id)()
            if (node.prev !== null && node.next !== null) {
                node.prev.next = node.next
                node.next.prev = node.prev
            }
        }
        const item = this.get(id)
        this.ids.delete(id)
        this.size--
        if (this.binds)
        if (this.binds.remove.size)
            this.binds.remove.foreach(subscriber =>
                subscriber(item, id))
    }
    
    public aforeach(
        callback: (next: VoidFunction, item: T, id?: I) => boolean | unknown,
        onEnd?: VoidFunction
    ): void {
        if (!this.size) return onEnd()
        this.doNextAsync(null, callback, onEnd)
    }
    
    public aforeachBackward(
        callback: (next: VoidFunction, item: T, id?: I) => boolean | unknown,
        onEnd?: VoidFunction
    ): void {
        if (!this.size) return onEnd()
        this.doPrevAsync(null, callback, onEnd)
    }
    
    public foreach(
        callback: (item: T, id?: I) => boolean | unknown,
        reversed: boolean = false
    ): void {
        let next: AssocNode<T, I> | null = null
        while (true) {
            if (reversed === false)
                next = this.doNext(next, callback)
            else
                next = this.doPrev(next, callback)
            if (next === null)
                break
        }
    }
    
    public forEach(callback: (item: T, id?: I) => boolean | unknown): void {
        this.foreach(callback)
    }
    
    protected doNext(node: AssocNode<T, I> | null, callback: (item: T, id?: I) => boolean | unknown): AssocNode<T, I> | null {
        if (node === null)
            node = this.firstNode
        if (node === null)
            return null
        const result: unknown | boolean = callback(node.data, node.id)
        if (typeof result === "boolean")
            if (result === false)
                return null
        return node.next
    }
    
    protected doPrev(node: AssocNode<T, I> | null, callback: (item: T, id?: I) => boolean | unknown): AssocNode<T, I> | null {
        if (node === null)
            node = this.lastNode
        if (node === null)
            return null
        const result: unknown | boolean = callback(node.data, node.id);
        if (typeof result === "boolean")
            if (result === false)
                return null
        return node.prev
    }
    
    protected doNextAsync(
        node: AssocNode<T, I> | null,
        callback: (next: VoidFunction, item: T, id?: I) => boolean | unknown,
        onEnd?: VoidFunction
    ): void {
        if (node === null) node = this.firstNode
        if (node === null) return
        callback(() => {
            if (node.next)
                this.doNextAsync(node.next, callback, onEnd)
            else if (onEnd) onEnd()
        }, node.data, node.id)
    }
    
    protected doPrevAsync(
        node: AssocNode<T, I> | null,
        callback: (prev: VoidFunction, item: T, id?: I) => boolean | unknown,
        onEnd?: VoidFunction
    ): void {
        if (node === null) node = this.lastNode
        if (node === null) return
        callback(() => {
            if (node.prev)
                this.doPrevAsync(node.prev, callback, onEnd)
            else if (onEnd) onEnd()
        }, node.data, node.id)
    }
    
    public sum<N = any>(func: (item: T) => Mix<N>): Mix<N> {
        const sum: Mix<N> = new Mix()
        this.foreach(item => {
            const items: Mix<N> = func(item)
            items.foreach(subItem => sum.add(subItem))
        })
        return sum
    }
    
    public mix<N = any>(func: (item: T) => N): Mix<N> {
        const sum: Mix<N> = new Mix()
        this.foreach(item => {
            sum.add(func(item))
        })
        return sum
    }
    
    public copy(innerCopy: boolean = false): Arr<I, T> {
        const copy = new Arr<I, T>()
        this.foreach((item, id) => {
            if (innerCopy)
                if (item instanceof Arr)
                    copy.set(id, (item as any).copy(true))
                else
                    copy.set(id, (item as any).copy())
            else copy.set(id, item)
        })
        return copy
    }
    
    public get array(): T[] {
        const arr = []
        this.foreach(item => 
            arr.push(item)
        );
        return arr
    }
    
    public get map(): Map<I, T> {
        const map = new Map<I, T>()
        this.foreach((item, id) => 
            map.set(id, item)
        );
        return map
    }
    
    // Solid debug purposes
    public get obj(): any {
        const obj: any = {};
        
        this.foreach((item, id) => {
            obj[id] = item;
        });
        
        return obj;
    }
    
    public getMore(...ids: I[]): Arr<I, T> {
        const result: Arr<I, T> = new Arr()
        for (let i = 0; i < ids.length; i++) {
            if (this.has(ids[i]) === false)
                continue
            result.set(ids[i], this.get(ids[i]))
        }
        return result
    }
    
    public readId(id: number): I {
        return [...this.ids.keys()][0]
    }
    
    public readIds(): Array<I> {
        return Array.from(this.ids.keys())
    }
    
    public monitor(): T[] {
        const exp = this.array
        const arr: T[] = []
        for (let i = 0; i < exp.length; i++)
            if (exp[i] instanceof AssocList)
                arr[i] = (exp[i] as any).monitor()
            else arr[i] = exp[i]
        return arr
    }
    
    public monitorObj(): T[] {
        const obj = this.obj
        for (const key in obj)
            if (obj[key] instanceof AssocList)
                obj[key] = (obj[key] as any).monitorObj()
        return obj
    }
    
    public monitorAssoc(): [I, T][] {
        const arr: [I, T][] = []
        this.foreach((item, id) => arr.push([id, item]))
        for (let i = 0; i < arr.length; i++)
            if (arr[i][1] instanceof AssocList)
                arr[i][1] = (arr[i][1] as any).monitorAssoc()
        return arr
    }
}

class Arr<I = any, T = any> extends AssocList<I, T> {}
class Mix<T = any> extends Arr<string, T> {}
class UniqueMix<T = any> extends Mix<T> {
    public constructor(items?: T[] | [string, T][]) {
        super(items, true)
    }
}
