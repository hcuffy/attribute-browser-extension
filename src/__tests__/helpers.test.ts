import { isInteractive } from '../helpers';

describe('Element Interaction', () => {
    describe('Interactive Tags', () => {
        it('should return true for Button elements', () => {
            const button = document.createElement('button');

            expect(isInteractive(button)).toBe(true);
        });

        it('should return true for A (anchor) elements', () => {
            const anchor = document.createElement('a');

            expect(isInteractive(anchor)).toBe(true);
        });

        it('should return true for Input elements', () => {
            const input = document.createElement('input');

            expect(isInteractive(input)).toBe(true);
        });

        it('should return true for Select elements', () => {
            const select = document.createElement('select');

            expect(isInteractive(select)).toBe(true);
        });

        it('should return true for Textarea elements', () => {
            const textarea = document.createElement('textarea');

            expect(isInteractive(textarea)).toBe(true);
        });

        it('should return true for Form elements', () => {
            const form = document.createElement('form');

            expect(isInteractive(form)).toBe(true);
        });
    });

    describe('Interactive Roles', () => {
        it('should return true for elements with role="button"', () => {
            const div = document.createElement('div');

            div.setAttribute('role', 'button');
            expect(isInteractive(div)).toBe(true);
        });

        it('should return true for elements with role="link"', () => {
            const span = document.createElement('span');

            span.setAttribute('role', 'link');
            expect(isInteractive(span)).toBe(true);
        });
    });

    describe('Tabindex Attribute', () => {
        it('should return true for elements with tabindex="0"', () => {
            const div = document.createElement('div');

            div.setAttribute('tabindex', '0');
            expect(isInteractive(div)).toBe(true);
        });

        it('should return true for elements with tabindex="-1"', () => {
            const div = document.createElement('div');

            div.setAttribute('tabindex', '-1');
            expect(isInteractive(div)).toBe(true);
        });
    });

    describe('Onclick Handler', () => {
        it('should return true for elements with onclick handler', () => {
            const div = document.createElement('div');

            div.onclick = () => {};
            expect(isInteractive(div)).toBe(true);
        });
    });

    describe('Non-interactive Elements', () => {
        it('should return false for plain Div elements', () => {
            const div = document.createElement('div');

            expect(isInteractive(div)).toBe(false);
        });

        it('should return false for plain Span elements', () => {
            const span = document.createElement('span');

            expect(isInteractive(span)).toBe(false);
        });

        it('should return false for P elements', () => {
            const p = document.createElement('p');

            expect(isInteractive(p)).toBe(false);
        });

        it('should return false for elements with non-interactive roles', () => {
            const div = document.createElement('div');

            div.setAttribute('role', 'presentation');
            expect(isInteractive(div)).toBe(false);
        });
    });
});
