// ─────────────────────────────────────────────────────
// Tests — Hooks (useAsync, useContext integration)
// ─────────────────────────────────────────────────────

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    createFiber, setCurrentFiber, clearCurrentFiber,
    useState, useEffect, useRef, useCallback,
    useAsync, setRequestRender, runEffects,
    type Fiber, type AsyncState,
} from './hooks.js';

describe('useAsync', () => {
    let fiber: Fiber;

    beforeEach(() => {
        fiber = createFiber();
        // Mock the render function
        setRequestRender(() => { });
    });

    afterEach(() => {
        clearCurrentFiber();
    });

    it('starts in loading state', () => {
        setCurrentFiber(fiber);
        const asyncFn = vi.fn(() => new Promise<string>(() => { })); // never resolves
        const state = useAsync(asyncFn, []);
        clearCurrentFiber();

        expect(state.loading).toBe(true);
        expect(state.data).toBeNull();
        expect(state.error).toBeNull();
        expect(typeof state.refetch).toBe('function');
    });

    it('calls the async function after effects run', () => {
        setCurrentFiber(fiber);
        const asyncFn = vi.fn(() => Promise.resolve('data'));
        useAsync(asyncFn, []);
        // useAsync uses useEffect internally — effects run after render
        runEffects(fiber);
        clearCurrentFiber();

        expect(asyncFn).toHaveBeenCalledOnce();
    });

    it('provides a refetch function', () => {
        setCurrentFiber(fiber);
        const asyncFn = vi.fn(() => Promise.resolve('data'));
        const state = useAsync(asyncFn, []);
        clearCurrentFiber();

        expect(typeof state.refetch).toBe('function');
    });

    it('Fiber contextValues is initialized as empty Map', () => {
        expect(fiber.contextValues).toBeInstanceOf(Map);
        expect(fiber.contextValues.size).toBe(0);
    });

    it('Fiber parent is undefined by default', () => {
        expect(fiber.parent).toBeUndefined();
    });

    it('createFiber accepts parent parameter', () => {
        const parent = createFiber();
        const child = createFiber(parent);
        expect(child.parent).toBe(parent);
    });
});
