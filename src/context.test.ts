import { createContext } from "./context.ts";
import { assertEquals } from "@std/assert";
Deno.test("context", () => {
    const ctx = createContext()
    const [getInt, setInt] = ctx.createWithSetter(() => 0)
    const [getIntB] = ctx.createWithSetter(() => getInt() + 30)
    const [getDate] = ctx.createWithSetter(() => new Date())
    const name = ctx.create(() => "John")
    const hello = ctx.create(() => "Hello " + name())
    ctx.run(() => {
        assertEquals(getInt(), 0)
        assertEquals(getIntB(), 30)
        setInt(1)
        assertEquals(getInt(), 1)
        assertEquals(getIntB(), 30)
        assertEquals(getDate().toISOString(), getDate().toISOString())
        assertEquals(hello(), "Hello John")
    })
    ctx.run(() => {
        assertEquals(getInt(), 0)
    })
})