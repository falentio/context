import { AsyncLocalStorage } from "node:async_hooks";

export function createContext() {
    const als = new AsyncLocalStorage<Map<symbol, unknown>>();

    function createWithSetter<T>(initializer: () => T): [() => T, (v: T) => void] {
        const key = Symbol();
        function get() {
            const store = als.getStore();
            if (!store) throw new Error("No context found");
            const value = store.get(key) as T;
            if (!value) {
                const v = initializer();
                store.set(key, v);
                return v;
            }
            return value;
        }

        function set<T>(v: T) {
            const store = als.getStore();
            if (!store) throw new Error("No context found");
            store.set(key, v);
        }

        return [get, set];
    }

    function create<T>(initializer: () => T) {
        const [get] = createWithSetter(initializer);
        return get
    }

    function run(fn: () => void) {
        return als.run(new Map(), fn);
    }

    return { create, run, createWithSetter };
}