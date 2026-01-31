import { forEach, map, join, get } from 'lodash';
import { isInteractive } from './helpers.ts';

const originalStyles = new WeakMap<Element, string>();
let highlightedElements:Element[] = [];
export const HIGHLIGHT_STYLES = {
    with   : '2px solid limegreen',
    missing: '3px solid rgba(255, 0, 0, 0.3)'
};

export function clearHighlights():void {
    forEach(highlightedElements, function(element) {
        if (element instanceof HTMLElement) {

            element.style.outline = originalStyles.get(element) ?? '';
        }
    });

    highlightedElements = [];
}

export function scanElements(attribute:string, mode:'with' | 'missing'):number {

    clearHighlights();
    let selector:string;

    if (mode === 'with') {
        selector = `[${attribute}]`;
    } else {
        const excludedTags = [
            'script',
            'style',
            'meta',
            'link',
            'title',
            'head',
            'html',
            'noscript',
            'template'
        ];
        const excludeSelector = join(map(excludedTags, function(tag) { return `:not(${tag})`; }), '');

        selector = `*${excludeSelector}:not([${attribute}])`;
    }

    let elements:NodeListOf<Element>;

    try {
        elements = document.querySelectorAll(selector);
    } catch (error) {
        console.error('[Attribute Scanner] Invalid selector:', selector, error);
        return -1;
    }

    const highlightStyle = get(HIGHLIGHT_STYLES, mode);

    forEach(elements, function(element) {
        if (element instanceof HTMLElement) {

            if (mode === 'missing') {

                const style = window.getComputedStyle(element);
                const isDisplayNone = style.display === 'none';
                const visibilityIsHidden = style.visibility === 'hidden';
                const hasNoOffsetWidth = element.offsetWidth === 0 || element.offsetHeight === 0;
                const hasNoOffsetHeight = element.offsetWidth === 0 || element.offsetHeight === 0;

                if (isDisplayNone || visibilityIsHidden || hasNoOffsetWidth || hasNoOffsetHeight) {
                    return;
                }

                if (!isInteractive(element)) {
                    return;
                }
            }

            const currentOutline = element.style.outline;
            if (!originalStyles.has(element)) {
                originalStyles.set(element, currentOutline);
            }

            element.style.outline = highlightStyle;

            highlightedElements.push(element);
        }
    });

    console.log(
        `[Attribute Scanner] Found ${highlightedElements.length} elements ${mode === 'with' ? 'with' : 'without'} [${attribute}]`
    );

    return highlightedElements.length;
}

/**
 * Message listener for communication with the popup
 *
 * chrome.runtime.onMessage is the receiving end of the message passing system.
 * The popup sends messages via chrome.tabs.sendMessage, which are received here.
 *
 * Message format:
 * - action: 'scan' | 'clear' - The action to perform
 * - attribute: string - The attribute name (for 'scan' action)
 * - mode: 'with' | 'missing' - The scan mode (for 'scan' action)
 */
chrome.runtime.onMessage.addListener(
    function(
        message:{ action:string; attribute?:string; mode?:'with' | 'missing' },
        _sender,
        sendResponse:(response:{ success:boolean; count?:number; error?:string })=>void
    ) {
        console.log('[Attribute Scanner] Received message:', message);

        if (message.action === 'scan') {

            if (!message.attribute || !message.mode) {
                sendResponse({
                    success: false,
                    error  : 'Missing attribute or mode parameter'
                });
                return true;
            }

            const count = scanElements(message.attribute, message.mode);

            if (count === -1) {
                sendResponse({
                    success: false,
                    error  : 'Invalid attribute name'
                });
            } else {
                sendResponse({
                    success: true,
                    count
                });
            }
        } else if (message.action === 'clear') {
            clearHighlights();
            sendResponse({ success: true, count: 0 });
        } else {
            sendResponse({
                success: false,
                error  : `Unknown action: ${message.action}`
            });
        }

        return true;
    });

console.log('[Attribute Scanner] Content script loaded');
