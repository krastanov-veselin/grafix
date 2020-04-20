class Unit<T = any> {
    public static timeouts = new Map<string, NodeJS.Timeout>()
    public static intervals = new Map<string, NodeJS.Timeout>()
    
    public static percentage(obtained: number, total: number): number {
        return obtained * 100 / total
    }
    
    public static setTimeout(func: VoidFunction, delay: number, name: string = "") {
        if (name.length === 0)
            name = "timeout_" + performance.now() + "_" + Unit.random(1, 99999)
        if (Unit.timeouts.has(name)) Unit.clearTimeout(name)
        const id = setTimeout(func, delay)
        Unit.timeouts.set(name, id)
        return id
    }
    
    public static clearTimeout(name: string = "") {
        if (!Unit.timeouts.has(name)) return
        clearTimeout(Unit.timeouts.get(name))
        Unit.timeouts.delete(name)
    }
    
    public static setInterval(func: VoidFunction, delay: number, name: string = "") {
        if (name.length === 0)
            name = "interval_" + performance.now() + "_" + Unit.random(1, 99999);
        if (Unit.intervals.has(name))
            Unit.clearInterval(name)
        const id = setInterval(func, delay)
        Unit.intervals.set(name, id)
        return id
    }
    
    public static clearInterval(name = "") {
        if (this.intervals.has(name) === false)
            return
        clearInterval(this.intervals.get(name))
        this.intervals.delete(name)
    }
    
    public static uniqueNumber(): number {
        return parseInt(Date.now() + "" + this.random(1, 99999) + "" + this.random(1, 99999))
    }
    
    public static random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    
    public static uniqueID(): string {
        return Date.now() + "" + Unit.random(1, 99999) + "" + Unit.random(1, 99999)
    }
}
