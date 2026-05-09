// ─────────────────────────────────────────────────────
// @termuijs/store — Public API
// ─────────────────────────────────────────────────────

export { createStore, batch } from './store.js';
export type {
    Store,
    UseStore,
    SetState,
    GetState,
    StateCreator,
    Selector,
    Listener,
} from './store.js';
