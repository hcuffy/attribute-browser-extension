import { scanElements, clearHighlights, HIGHLIGHT_STYLES } from '../content';

describe('Contents Element Scan', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        clearHighlights();
    });

    describe('Scanning For Elements With data-cy Attribute', () => {
        it('should find elements with data-cy attribute', () => {
            document.body.innerHTML = `
                <button data-cy="submit-btn">Submit</button>
                <input data-cy="email-input" type="email" />
                <div>No attribute</div>
            `;

            const count = scanElements('data-cy', 'with');

            expect(count).toBe(2);
        });

        it('should highlight elements with limegreen outline', () => {
            document.body.innerHTML = `
                <button data-cy="test-btn">Test</button>
            `;

            scanElements('data-cy', 'with');

            const button = document.querySelector('[data-cy="test-btn"]') as HTMLElement;

            expect(button.style.outline).toBe(HIGHLIGHT_STYLES.with);
        });

        it('should return 0 when no elements have the attribute', () => {
            document.body.innerHTML = `
                <button>No attribute</button>
                <div>Plain div</div>
            `;

            const count = scanElements('data-cy', 'with');

            expect(count).toBe(0);
        });

        it('should find elements with data-testid attribute', () => {
            document.body.innerHTML = `
                <button data-testid="btn-1">Button 1</button>
                <button data-testid="btn-2">Button 2</button>
                <button data-cy="btn-3">Button 3</button>
            `;

            const count = scanElements('data-testid', 'with');

            expect(count).toBe(2);
        });

        it('should find nested elements with attribute', () => {
            document.body.innerHTML = `
                <div data-cy="container">
                    <span data-cy="nested-span">Nested</span>
                    <button data-cy="nested-btn">Click</button>
                </div>
            `;

            const count = scanElements('data-cy', 'with');

            expect(count).toBe(3);
        });

        it('should find elements with empty attribute value', () => {
            document.body.innerHTML = `
                <button data-cy="">Empty value</button>
                <button data-cy="filled">With value</button>
            `;

            const count = scanElements('data-cy', 'with');

            expect(count).toBe(2);
        });
    });

    describe('Scanning For Elements Missing data-cy Attribute', () => {
        it('should find interactive elements missing data-cy', () => {
            document.body.innerHTML = `
                <button>Missing attribute</button>
                <button data-cy="has-attr">Has attribute</button>
            `;

            const buttons = document.querySelectorAll('button');

            buttons.forEach(btn => {
                Object.defineProperty(btn, 'offsetWidth', { value: 100, configurable: true });
                Object.defineProperty(btn, 'offsetHeight', { value: 30, configurable: true });
            });

            const count = scanElements('data-cy', 'missing');

            expect(count).toBe(1);
        });

        it('should highlight missing elements with red outline', () => {
            document.body.innerHTML = `
                <button>Missing</button>
            `;

            const button = document.querySelector('button') as HTMLElement;

            Object.defineProperty(button, 'offsetWidth', { value: 100, configurable: true });
            Object.defineProperty(button, 'offsetHeight', { value: 30, configurable: true });

            scanElements('data-cy', 'missing');

            expect(button.style.outline).toBe(HIGHLIGHT_STYLES.missing);
        });

        it('should only highlight interactive elements when scanning missing', () => {
            document.body.innerHTML = `
                <div>Non-interactive div</div>
                <p>Non-interactive paragraph</p>
                <button>Interactive button</button>
                <a href="#">Interactive link</a>
                <input type="text" placeholder="Interactive input" />
            `;

            document.querySelectorAll('*').forEach(element => {
                Object.defineProperty(element, 'offsetWidth', { value: 100, configurable: true });
                Object.defineProperty(element, 'offsetHeight', { value: 30, configurable: true });
            });

            const count = scanElements('data-cy', 'missing');

            expect(count).toBe(3);
        });

        it('should not highlight hidden elements', () => {
            document.body.innerHTML = `
                <button style="display: none;">Hidden button</button>
                <button>Visible button</button>
            `;

            const visibleButton = document.querySelectorAll('button')[1] as HTMLElement;

            Object.defineProperty(visibleButton, 'offsetWidth', { value: 100, configurable: true });
            Object.defineProperty(visibleButton, 'offsetHeight', { value: 30, configurable: true });

            const count = scanElements('data-cy', 'missing');

            expect(count).toBe(1);
        });

        it('should not highlight elements with zero dimensions', () => {
            document.body.innerHTML = `
                <button>Zero width button</button>
                <button>Normal button</button>
            `;

            const buttons = document.querySelectorAll('button');

            Object.defineProperty(buttons[0], 'offsetWidth', { value: 0, configurable: true });
            Object.defineProperty(buttons[0], 'offsetHeight', { value: 30, configurable: true });
            Object.defineProperty(buttons[1], 'offsetWidth', { value: 100, configurable: true });
            Object.defineProperty(buttons[1], 'offsetHeight', { value: 30, configurable: true });

            const count = scanElements('data-cy', 'missing');

            expect(count).toBe(1);
        });

        it('should find elements with role="button" missing attribute', () => {
            document.body.innerHTML = `
                <div role="button">Custom button</div>
                <div role="button" data-cy="has-attr">Has attribute</div>
            `;

            document.querySelectorAll('[role="button"]').forEach(element => {
                Object.defineProperty(element, 'offsetWidth', { value: 100, configurable: true });
                Object.defineProperty(element, 'offsetHeight', { value: 30, configurable: true });
            });

            const count = scanElements('data-cy', 'missing');

            expect(count).toBe(1);
        });

        it('should find elements with tabindex missing attribute', () => {
            document.body.innerHTML = `
                <div tabindex="0">Focusable div</div>
                <div tabindex="0" data-cy="has-attr">Has attribute</div>
            `;

            document.querySelectorAll('[tabindex]').forEach(element => {
                Object.defineProperty(element, 'offsetWidth', { value: 100, configurable: true });
                Object.defineProperty(element, 'offsetHeight', { value: 30, configurable: true });
            });

            const count = scanElements('data-cy', 'missing');

            expect(count).toBe(1);
        });
    });

    describe('Clear Highlighted Elements', () => {
        it('should remove highlights from all elements', () => {
            document.body.innerHTML = `
                <button data-cy="btn-1">Button 1</button>
                <button data-cy="btn-2">Button 2</button>
            `;

            scanElements('data-cy', 'with');
            clearHighlights();

            const buttons = document.querySelectorAll('button');

            buttons.forEach(btn => {
                expect((btn as HTMLElement).style.outline).toBe('');
            });
        });

        it('should restore original outline styles', () => {
            document.body.innerHTML = `
                <button data-cy="btn" style="outline: 1px dashed blue;">Button</button>
            `;

            scanElements('data-cy', 'with');

            const button = document.querySelector('button') as HTMLElement;

            expect(button.style.outline).toBe(HIGHLIGHT_STYLES.with);

            clearHighlights();

            expect(button.style.outline).toBe('1px dashed blue');
        });

        it('should reset highlighted count after clear', () => {
            document.body.innerHTML = `
                <button data-cy="btn">Button</button>
            `;

            scanElements('data-cy', 'with');
            clearHighlights();

            const count = scanElements('data-cy', 'with');

            expect(count).toBe(1);
        });
    });

    describe('Edge Cases', () => {
        it('should return -1 for invalid attribute selector', () => {
            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const count = scanElements('[invalid', 'with');

            expect(count).toBe(-1);
            expect(errorSpy).toHaveBeenCalled();

            errorSpy.mockRestore();
        });

        it('should handle custom attribute names', () => {
            document.body.innerHTML = `
                <button data-qa="test">QA attribute</button>
                <button data-test-id="test">Test ID attribute</button>
            `;

            expect(scanElements('data-qa', 'with')).toBe(1);
            expect(scanElements('data-test-id', 'with')).toBe(1);
        });

        it('should exclude script and style tags in missing mode', () => {
            document.body.innerHTML = `
                <script>console.log('test');</script>
                <style>.test { color: red; }</style>
                <button>Real button</button>
            `;

            const button = document.querySelector('button') as HTMLElement;

            Object.defineProperty(button, 'offsetWidth', { value: 100, configurable: true });
            Object.defineProperty(button, 'offsetHeight', { value: 30, configurable: true });

            const count = scanElements('data-cy', 'missing');

            expect(count).toBe(1);
        });

        it('should handle form elements', () => {
            document.body.innerHTML = `
                <form data-cy="login-form">
                    <input data-cy="username" type="text" />
                    <select data-cy="country">
                        <option>USA</option>
                    </select>
                    <textarea data-cy="bio"></textarea>
                </form>
            `;

            const count = scanElements('data-cy', 'with');

            expect(count).toBe(4);
        });

        it('should clear previous highlights before new scan', () => {
            document.body.innerHTML = `
                <button data-cy="btn">Button</button>
                <input data-testid="input" type="text" />
            `;

            scanElements('data-cy', 'with');
            const button = document.querySelector('button') as HTMLElement;

            expect(button.style.outline).toBe(HIGHLIGHT_STYLES.with);
            scanElements('data-testid', 'with');
            expect(button.style.outline).toBe('');

            const input = document.querySelector('input') as HTMLElement;

            expect(input.style.outline).toBe(HIGHLIGHT_STYLES.with);
        });
    });
});
