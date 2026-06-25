import type { RootWidget } from '@termuijs/core'
import {
    // display
    Badge,
    BigText,
    Text,
    LogView,
    JSONView,
    DiffView,
    StreamingText,
    ChatMessage,
    ChatThread,
    ToolCall,
    ToolApproval,
    FPSCounter,
    PerformanceOverlay,
    ThinkingBlock,
    DirectoryTree,
    UnorderedList,
    OrderedList,
    NotificationBadge,
    ShortcutBar,
    Tree,
    Markdown,
    Code,
    QRCode,
    QRCodePattern,
    // feedback
    Alert,
    Banner,
    Spinner,
    LoadingDots,
    ProgressBar,
    ProgressCircle,
    MultiProgress,
    TaskList,
    StatusMessage,
    EmptyState,
    // data
    StatusIndicator,
    Gauge,
    Sparkline,
    BarChart,
    LineChart,
    KeyValue,
    Table,
    // input
    TextInput,
    List,
    CommandPalette,
    Button,
    Checkbox,
    Slider,
    // layout
    Card,
    Stack,
} from '@termuijs/widgets'

const demos: Record<string, () => RootWidget> = {
    // ── Display ───────────────────────────────────────

    'badge': () => new Badge('v0.1.7', {}, { variant: 'success' }),

    'big-text': () => new BigText('TERMUI', {}, { color: { type: 'named', name: 'cyan' } }),

    'text': () => new Text('The quick brown fox jumps over the lazy dog. TermUI renders text with word-wrap, alignment, and smooth scrolling.', {}, { wrap: true }),

    'log-view': () => {
        const w = new LogView({}, { autoScroll: true })
        w.setLines([
            '[12:00:01] INFO  Server started on port 3000',
            '[12:00:02] INFO  Connected to database',
            '[12:00:04] WARN  Memory usage above 80%',
            '[12:00:05] ERROR Failed to reach upstream API',
            '[12:00:06] DEBUG Retrying in 5 seconds…',
            '[12:00:11] INFO  Retry successful',
            '[12:00:15] INFO  Request GET /api/users 200 42ms',
        ])
        return w
    },

    'json-view': () => new JSONView({
        data: {
            name: 'Claude',
            version: 3,
            capabilities: ['text', 'code', 'vision'],
            config: { temperature: 0.7, maxTokens: 4096, stream: true },
        },
    }),

    'diff-view': () => new DiffView({
        lines: [
            { type: 'context', content: 'function greet(name: string) {', lineNo: 1 },
            { type: 'remove',  content: '  return "Hello, " + name;',     lineNo: 2 },
            { type: 'add',     content: '  return `Hello, ${name}!`;',    lineNo: 2 },
            { type: 'context', content: '}',                               lineNo: 3 },
            { type: 'context', content: '',                                lineNo: 4 },
            { type: 'remove',  content: 'const msg = greet("World");',    lineNo: 5 },
            { type: 'add',     content: 'const msg = greet("TermUI");',   lineNo: 5 },
        ],
        showLineNumbers: true,
    }),

    'streaming-text': () => new StreamingText({
        text: 'TermUI streams AI responses token by token with a blinking cursor, giving your CLI apps the feel of a real-time chat interface.',
        speed: 0,
    }),

    'chat-message': () => new ChatMessage({
        role: 'assistant',
        content: 'I can help you build beautiful terminal UIs with TermUI. What would you like to create?',
        timestamp: new Date('2026-06-25T12:00:00'),
    }),

    'chat-thread': () => new ChatThread({}, [
        { role: 'user',      content: 'What is TermUI?' },
        { role: 'assistant', content: 'TermUI is a framework for building rich terminal UIs in TypeScript.' },
        { role: 'user',      content: 'Does it support widgets?' },
        { role: 'assistant', content: 'Yes — over 60 widgets including charts, inputs, and AI-native components.' },
    ]),

    'tool-call': () => new ToolCall({
        name: 'read_file',
        args: { path: '/src/index.ts', encoding: 'utf-8' },
        status: 'done',
        result: '// TermUI entry point',
        collapsed: false,
    }),

    'tool-approval': () => new ToolApproval({
        name: 'exec',
        args: { command: 'rm -rf ./dist', cwd: '/project' },
        status: 'pending',
        collapsed: false,
    }),

    'f-p-s-counter': () => {
        const w = new FPSCounter({}, { showAverage: true, showMinMax: true })
        w.updateFPS(58)
        w.updateFPS(60)
        w.updateFPS(59)
        w.updateFPS(61)
        return w
    },

    'performance-overlay': () => {
        const w = new PerformanceOverlay()
        w.updateStats({ cellsChanged: 142, bytesWritten: 1024, durationMs: 2.4 })
        return w
    },

    'thinking-block': () => {
        const w = new ThinkingBlock({
            thinking: 'Let me reason through this step by step. First I need to consider the time complexity of the algorithm, then the space usage…',
        })
        return w
    },

    'directory-tree': () => new DirectoryTree({
        tree: [
            { name: 'packages', type: 'dir', children: [
                { name: 'core',    type: 'dir', children: [
                    { name: 'src',       type: 'dir', children: [] },
                    { name: 'package.json', type: 'file' },
                ]},
                { name: 'widgets', type: 'dir', children: [
                    { name: 'src',       type: 'dir', children: [] },
                    { name: 'package.json', type: 'file' },
                ]},
            ]},
            { name: 'website',   type: 'dir', children: [] },
            { name: 'README.md', type: 'file' },
        ],
    }),

    'unordered-list': () => new UnorderedList([
        { text: 'Install dependencies' },
        { text: 'Configure widgets', children: [
            { text: 'Set up theme' },
            { text: 'Configure layout' },
        ]},
        { text: 'Run the app' },
        { text: 'Deploy to production' },
    ]),

    'ordered-list': () => new OrderedList([
        { text: 'Clone the repository' },
        { text: 'Install packages', children: [
            { text: 'npm install' },
            { text: 'npm run build' },
        ]},
        { text: 'Start development server' },
        { text: 'Open localhost:3000' },
    ]),

    'notification-badge': () => new NotificationBadge(
        { count: 7, position: 'top-right' },
    ),

    'shortcut-bar': () => new ShortcutBar([
        { key: 'F1',   label: 'Help' },
        { key: 'F3',   label: 'Search' },
        { key: 'F5',   label: 'Refresh' },
        { key: 'F10',  label: 'Menu' },
        { key: 'q',    label: 'Quit' },
    ]),

    'tree': () => new Tree({
        nodes: [
            { label: 'Documents', children: [
                { label: 'Resume.pdf' },
                { label: 'Projects', children: [
                    { label: 'termui.md' },
                    { label: 'roadmap.md' },
                ]},
            ], expanded: true },
            { label: 'Downloads', children: [
                { label: 'archive.zip' },
            ]},
        ],
    }),

    'markdown': () => new Markdown({ content: `# TermUI

**Build** terminal UIs with _ease_.

- 60+ widgets
- TypeScript native
- \`xterm.js\` renderer

> Ship fast. Look good.
` }),

    'code': () => new Code(
        `function fibonacci(n: number): number {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}`,
        {},
        { language: 'typescript', showLineNumbers: true },
    ),

    'q-r-code': () => new QRCode('https://termuijs.dev', {}),

    'q-r-code-pattern': () => new QRCodePattern(
        'https://termuijs.dev',
        {},
        { showText: true },
    ),

    // ── Feedback ──────────────────────────────────────

    'alert': () => new Alert({ variant: 'info', message: 'Component loaded successfully' }),

    'banner': () => new Banner({}, {
        variant: 'warning',
        title: 'Deprecation Notice',
        body: 'This API will be removed in v2.0. Please migrate to the new widget API.',
    }),

    'spinner': () => new Spinner({}, { label: 'Loading components…' }),

    'loading-dots': () => new LoadingDots({}, { label: 'Connecting to server', maxDots: 3 }),

    'progress-bar': () => new ProgressBar({}, { value: 0.68, showLabel: true, labelFormat: 'percent' }),

    'progress-circle': () => new ProgressCircle({}, { value: 72, label: '72%' }),

    'multi-progress': () => new MultiProgress({
        items: [
            { label: 'CPU',    value: 0.74, color: { type: 'named', name: 'red' } },
            { label: 'Memory', value: 0.51, color: { type: 'named', name: 'yellow' } },
            { label: 'Disk',   value: 0.28, color: { type: 'named', name: 'green' } },
            { label: 'Network',value: 0.09, color: { type: 'named', name: 'cyan' } },
        ],
        labelWidth: 9,
        showValues: true,
    }),

    'task-list': () => new TaskList(
        {},
        {
            pendingText:  '○ waiting',
            runningText:  '● running',
            doneText:     '✓ done',
            errorText:    '✗ failed',
        },
        [
            { id: 1, label: 'Install deps',   status: 'done' },
            { id: 2, label: 'Type check',     status: 'done' },
            { id: 3, label: 'Run tests',      status: 'running' },
            { id: 4, label: 'Build bundle',   status: 'pending' },
            { id: 5, label: 'Deploy to CDN',  status: 'pending' },
        ],
    ),

    'status-message': () => new StatusMessage(
        'All systems operational',
        {},
        { variant: 'success' },
    ),

    'empty-state': () => new EmptyState(
        'No results found',
        {},
        {
            description: 'Try adjusting your search or filters',
            hint: 'Press / to search',
        },
    ),

    // ── Data ─────────────────────────────────────────

    'status-indicator': () => new StatusIndicator('API Server', true),

    'gauge': () => {
        const w = new Gauge('CPU', {}, { showLabel: true })
        w.setValue(0.65)
        return w
    },

    'sparkline': () => {
        const w = new Sparkline('Latency', {}, { showRange: true })
        w.setData([12, 18, 14, 22, 19, 30, 25, 16, 12, 20, 28, 15, 10, 14, 18])
        return w
    },

    'bar-chart': () => new BarChart([
        { bars: [{ value: 42, label: 'Mon' }] },
        { bars: [{ value: 58, label: 'Tue' }] },
        { bars: [{ value: 35, label: 'Wed' }] },
        { bars: [{ value: 71, label: 'Thu' }] },
        { bars: [{ value: 63, label: 'Fri' }] },
    ], {}, { direction: 'vertical' }),

    'line-chart': () => {
        const w = new LineChart(
            [10, 25, 18, 42, 35, 58, 47, 63, 55, 72, 68, 80],
            {},
            { showYAxis: false, color: { type: 'named', name: 'cyan' } },
        )
        return w
    },

    'key-value': () => new KeyValue([
        { key: 'Version',    value: '0.1.7' },
        { key: 'Runtime',    value: 'Node 22' },
        { key: 'Renderer',   value: 'xterm.js' },
        { key: 'Widgets',    value: 60 },
        { key: 'License',    value: 'MIT' },
    ]),

    'table': () => new Table(
        [
            { header: 'Package',  key: 'pkg',     width: 14 },
            { header: 'Version',  key: 'version', width: 10 },
            { header: 'Size',     key: 'size',    width: 8 },
            { header: 'License',  key: 'license', width: 8 },
        ],
        [
            { pkg: '@termuijs/core',    version: '0.1.7', size: '42 kB', license: 'MIT' },
            { pkg: '@termuijs/widgets', version: '0.1.7', size: '98 kB', license: 'MIT' },
            { pkg: '@termuijs/motion',  version: '0.1.7', size: '12 kB', license: 'MIT' },
            { pkg: '@termuijs/ui',      version: '0.1.7', size: '55 kB', license: 'MIT' },
        ],
        {},
        { showHeader: true, stripe: true },
    ),

    // ── Input ─────────────────────────────────────────

    'text-input': () => new TextInput({}, { placeholder: 'Type something…' }),

    'list': () => new List([
        { label: 'New file',       value: 'new-file' },
        { label: 'Open folder',    value: 'open-folder' },
        { label: 'Recent files',   value: 'recent' },
        { label: 'Settings',       value: 'settings' },
        { label: 'Quit',           value: 'quit' },
    ]),

    'command-palette': () => new CommandPalette({
        commands: [
            { id: 'open',  label: 'Open File',       description: 'Ctrl+O', action: () => {} },
            { id: 'save',  label: 'Save',             description: 'Ctrl+S', action: () => {} },
            { id: 'find',  label: 'Find in Files',    description: 'Ctrl+F', action: () => {} },
            { id: 'term',  label: 'New Terminal',     description: 'Ctrl+`', action: () => {} },
            { id: 'debug', label: 'Start Debugging',  description: 'F5',     action: () => {} },
            { id: 'quit',  label: 'Quit',             description: 'Ctrl+Q', action: () => {} },
        ],
        placeholder: 'Search commands…',
        maxVisible: 6,
    }),

    'button': () => new Button('Deploy to Production', {}, { variant: 'primary' }),

    'checkbox': () => new Checkbox(
        'Enable dark mode',
        {},
        { checked: true },
    ),

    'slider': () => new Slider('Volume', {}, { min: 0, max: 100, step: 5, showValue: true }),

    // ── Layout ───────────────────────────────────────

    'card': () => {
        const c = new Card({}, { title: 'System Status', borderColor: { type: 'named', name: 'cyan' } })
        c.addChild(new StatusMessage('All services running', {}, { variant: 'success' }))
        return c
    },

    'stack': () => {
        const base = new Text('Base layer', { fg: { type: 'named', name: 'brightBlack' } })
        const top  = new Text('Top layer (overlaid)', { fg: { type: 'named', name: 'white' } })
        return new Stack([base, top])
    },
}

export default demos
