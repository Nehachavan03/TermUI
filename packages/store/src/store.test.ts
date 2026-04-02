import { describe, it, expect, vi } from 'vitest'
import { createStore } from './store.js'

describe('createStore', () => {
    it('initializes state from creator function', () => {
        const useStore = createStore((set) => ({ count: 0, label: 'test' }))
        expect(useStore.getState().count).toBe(0)
        expect(useStore.getState().label).toBe('test')
    })

    it('setState merges a partial object', () => {
        const useStore = createStore((set) => ({
            a: 1,
            b: 2,
        }))
        useStore.setState({ a: 10 })
        expect(useStore.getState().a).toBe(10)
        expect(useStore.getState().b).toBe(2)
    })

    it('setState accepts a function updater', () => {
        const useStore = createStore((set) => ({
            count: 5,
            inc: () => set((s) => ({ count: s.count + 1 })),
        }))
        useStore.getState().inc()
        expect(useStore.getState().count).toBe(6)
    })

    it('setState with function updater chains correctly', () => {
        const useStore = createStore((set) => ({
            count: 0,
            inc: () => set((s) => ({ count: s.count + 1 })),
        }))
        useStore.getState().inc()
        useStore.getState().inc()
        useStore.getState().inc()
        expect(useStore.getState().count).toBe(3)
    })

    it('subscribe fires listener with new and previous state', () => {
        const useStore = createStore((set) => ({
            count: 0,
            inc: () => set((s) => ({ count: s.count + 1 })),
        }))
        const spy = vi.fn()
        useStore.subscribe(spy)
        useStore.getState().inc()
        expect(spy).toHaveBeenCalledOnce()
        expect(spy.mock.calls[0][0].count).toBe(1)  // new state
        expect(spy.mock.calls[0][1].count).toBe(0)  // prev state
    })

    it('subscribe returns an unsubscribe function', () => {
        const useStore = createStore((set) => ({
            count: 0,
            inc: () => set((s) => ({ count: s.count + 1 })),
        }))
        const spy = vi.fn()
        const unsub = useStore.subscribe(spy)
        unsub()
        useStore.getState().inc()
        expect(spy).not.toHaveBeenCalled()
    })

    it('multiple subscribers all get notified', () => {
        const useStore = createStore((set) => ({
            x: 0,
        }))
        const spy1 = vi.fn()
        const spy2 = vi.fn()
        useStore.subscribe(spy1)
        useStore.subscribe(spy2)
        useStore.setState({ x: 99 })
        expect(spy1).toHaveBeenCalledOnce()
        expect(spy2).toHaveBeenCalledOnce()
    })

    it('destroy removes all listeners', () => {
        const useStore = createStore((set) => ({
            count: 0,
            inc: () => set((s) => ({ count: s.count + 1 })),
        }))
        const spy1 = vi.fn()
        const spy2 = vi.fn()
        useStore.subscribe(spy1)
        useStore.subscribe(spy2)
        useStore.destroy()
        useStore.getState().inc()
        expect(spy1).not.toHaveBeenCalled()
        expect(spy2).not.toHaveBeenCalled()
    })

    it('get() inside creator reads current state', () => {
        const useStore = createStore((set, get) => ({
            count: 0,
            double: () => get().count * 2,
            inc: () => set({ count: get().count + 1 }),
        }))
        useStore.getState().inc()
        expect(useStore.getState().count).toBe(1)
        expect(useStore.getState().double()).toBe(2)
    })

    it('getState always returns the latest snapshot', () => {
        const useStore = createStore((set) => ({
            value: 'initial',
        }))
        expect(useStore.getState().value).toBe('initial')
        useStore.setState({ value: 'updated' })
        expect(useStore.getState().value).toBe('updated')
    })

    it('actions can be async', async () => {
        const useStore = createStore((set) => ({
            data: null as string | null,
            loading: false,
            fetch: async () => {
                set({ loading: true })
                const result = await Promise.resolve('fetched data')
                set({ data: result, loading: false })
            },
        }))
        await useStore.getState().fetch()
        expect(useStore.getState().data).toBe('fetched data')
        expect(useStore.getState().loading).toBe(false)
    })
})
