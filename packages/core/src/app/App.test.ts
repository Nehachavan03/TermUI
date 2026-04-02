// ─────────────────────────────────────────────────────
// @termuijs/core — Tests for App lifecycle
// ─────────────────────────────────────────────────────

import { describe, it, expect, vi } from 'vitest';
import { App, type AppOptions, type RootWidget } from './App.js';
import type { Screen } from '../terminal/Screen.js';
import type { LayoutNode } from '../layout/LayoutEngine.js';

/**
 * Minimal mock root widget for testing App lifecycle
 * without needing actual widgets or terminal interaction.
 */
function createMockRootWidget(): RootWidget {
    return {
        id: 'root',
        getLayoutNode(): LayoutNode {
            return {
                id: 'root',
                style: {},
                children: [],
                computed: { x: 0, y: 0, width: 80, height: 24 },
            };
        },
        syncLayout() { },
        render(_screen: Screen) { },
        mount() { },
        unmount() { },
    };
}

describe('App', () => {
    describe('exit()', () => {
        it('does NOT call process.exit when called before mount()', () => {
            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
            const root = createMockRootWidget();
            const app = new App(root, { forceFallback: true });

            // exit() before mount — should NOT crash
            app.exit(0);

            expect(exitSpy).not.toHaveBeenCalled();
            exitSpy.mockRestore();
        });

        it('exit() called twice does not throw (idempotent)', () => {
            const root = createMockRootWidget();
            const app = new App(root, { forceFallback: true });

            expect(() => {
                app.exit(0);
                app.exit(0);
            }).not.toThrow();
        });
    });

    describe('constructor', () => {
        it('does NOT register an uncaughtException handler', () => {
            const listenerCount = process.listenerCount('uncaughtException');
            const root = createMockRootWidget();
            const _app = new App(root, { forceFallback: true });

            // The Terminal constructor registers handlers but NOT uncaughtException
            const newCount = process.listenerCount('uncaughtException');
            expect(newCount).toBe(listenerCount);

            // Clean up — restore removes our handlers
            _app.exit(0);
        });

        it('registers and cleans up SIGINT/SIGTERM handlers on restore', () => {
            const sigintBefore = process.listenerCount('SIGINT');
            const sigtermBefore = process.listenerCount('SIGTERM');

            const root = createMockRootWidget();
            const app = new App(root, { forceFallback: true });

            // Handlers should be registered by Terminal constructor
            expect(process.listenerCount('SIGINT')).toBeGreaterThan(sigintBefore);
            expect(process.listenerCount('SIGTERM')).toBeGreaterThan(sigtermBefore);

            // Explicitly restore to remove handlers
            app.terminal.restore();
            expect(process.listenerCount('SIGINT')).toBe(sigintBefore);
            expect(process.listenerCount('SIGTERM')).toBe(sigtermBefore);
        });
    });
});
