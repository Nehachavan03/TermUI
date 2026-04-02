// ─────────────────────────────────────────────────────
// @termuijs/store — Zustand-like State Management
//
// Minimal, powerful state management for terminal apps.
// Create stores with actions, use them in components
// with selector-based subscriptions.
//
// Usage:
//   const useCounter = createStore((set) => ({
//       count: 0,
//       increment: () => set(s => ({ count: s.count + 1 })),
//       reset: () => set({ count: 0 }),
//   }));
//
//   function Counter() {
//       const count = useCounter(s => s.count);
//       const increment = useCounter(s => s.increment);
//       useInput((key) => { if (key === '+') increment(); });
//       return <Text>Count: {count}</Text>;
//   }
// ─────────────────────────────────────────────────────

import { useState, useEffect, useRef } from '@termuijs/jsx';

// ── Types ──

export type SetState<T> = (
    partial: Partial<T> | ((state: T) => Partial<T>),
) => void;

export type GetState<T> = () => T;

export type StateCreator<T> = (
    set: SetState<T>,
    get: GetState<T>,
) => T;

export type Selector<T, U> = (state: T) => U;

export type Listener<T> = (state: T, prevState: T) => void;

export interface Store<T> {
    /** Get the current state */
    getState(): T;
    /** Set partial state (like React's setState) */
    setState: SetState<T>;
    /** Subscribe to state changes */
    subscribe(listener: Listener<T>): () => void;
    /** Destroy the store and remove all listeners */
    destroy(): void;
}

// ── Store Implementation ──

/**
 * Create a new store. Returns a hook function that can be
 * called inside components with an optional selector.
 *
 * ```tsx
 * const useAppStore = createStore((set, get) => ({
 *     count: 0,
 *     todos: [] as string[],
 *     increment: () => set(s => ({ count: s.count + 1 })),
 *     addTodo: (text: string) => set(s => ({
 *         todos: [...s.todos, text]
 *     })),
 *     get totalItems() { return get().todos.length; },
 * }));
 *
 * // In a component:
 * function Counter() {
 *     const count = useAppStore(s => s.count);
 *     return <Text>Count: {count}</Text>;
 * }
 * ```
 */
export function createStore<T extends object>(
    creator: StateCreator<T>,
): UseStore<T> {
    const listeners = new Set<Listener<T>>();

    let state: T;

    const setState: SetState<T> = (partial) => {
        const prevState = state;
        const nextPartial = typeof partial === 'function'
            ? (partial as (state: T) => Partial<T>)(state)
            : partial;
        const nextState = { ...state, ...nextPartial };

        // Only notify if something actually changed
        if (!Object.is(state, nextState)) {
            state = nextState;
            for (const listener of listeners) {
                listener(state, prevState);
            }
        }
    };

    const getState: GetState<T> = () => state;

    const subscribe = (listener: Listener<T>): (() => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    const destroy = (): void => {
        listeners.clear();
    };

    // Initialize state
    state = creator(setState, getState);

    const store: Store<T> = { getState, setState, subscribe, destroy };

    // Create the hook function
    function useStore(): T;
    function useStore<U>(selector: Selector<T, U>): U;
    function useStore<U>(selector?: Selector<T, U>): T | U {
        const select = selector ?? ((s: T) => s as unknown as U);

        // Use useState to trigger re-renders
        const [selectedState, setSelectedState] = useState(() => select(store.getState()));
        const selectorRef = useRef(select);
        selectorRef.current = select;

        useEffect(() => {
            const unsubscribe = store.subscribe((newState) => {
                const newSelected = selectorRef.current(newState);
                setSelectedState(newSelected);
            });
            return unsubscribe;
        }, []);

        return selectedState;
    }

    // Attach store methods to the hook for direct access
    (useStore as any).getState = getState;
    (useStore as any).setState = setState;
    (useStore as any).subscribe = subscribe;
    (useStore as any).destroy = destroy;

    return useStore as UseStore<T>;
}

// ── Hook Type ──

export interface UseStore<T> {
    (): T;
    <U>(selector: Selector<T, U>): U;
    getState: GetState<T>;
    setState: SetState<T>;
    subscribe(listener: Listener<T>): () => void;
    destroy(): void;
}
