import { includes } from 'lodash';

const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'FORM'];
const interactiveRoles = ['button', 'link'];

export function isInteractive(element:HTMLElement):boolean {
    return includes(interactiveTags, element.tagName) ||
        includes(interactiveRoles, element.getAttribute('role') ?? '') ||
        element.onclick !== null ||
        element.hasAttribute('tabindex');
}
