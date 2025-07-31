import * as vue from "@vue/runtime-dom";
import { isSlotDefine, SlotDefine } from "./component";
export interface KeyPair<K, V> {
    key: K;
    value: V;
}
export type AttributesOf<Tag extends keyof HTMLElementTagNameMap> = Tag extends keyof vue.IntrinsicElementAttributes ? vue.IntrinsicElementAttributes[Tag] : vue.HTMLAttributes;
export interface AttributeDescriptor<Tag extends keyof HTMLElementTagNameMap, Key extends keyof AttributesOf<Tag>> {
    (value: AttributesOf<Tag>[Key]): KeyPair<Key, AttributesOf<Tag>[Key]>;
}
export type AttributeMap<Tag extends keyof HTMLElementTagNameMap> = {
    [K in keyof AttributesOf<Tag> as K extends `on${string}` ? never : K]-?: AttributeDescriptor<Tag, K>;
} & {
    [E in keyof HTMLElementEventMap as `$${E}`]: (
        handler: (
            event: HTMLElementEventMap[E],
            target: HTMLElementTagNameMap[Tag]
        ) => void
    ) => KeyPair<`on${Capitalize<E>}`, (event: HTMLElementEventMap[E]) => void>;
};
export interface RealNodeBuilder<Tag extends keyof HTMLElementTagNameMap> {
    (...props: KeyPair<keyof AttributesOf<Tag>, AttributesOf<Tag>[keyof AttributesOf<Tag>]>[]): RealNodeContext<Tag>;
    attributes: AttributeMap<Tag>;
}
export interface RealNodeContext<Tag extends keyof HTMLElementTagNameMap> {
    element: HTMLElementTagNameMap[Tag];
    (...children: ViewNode[]): HTMLElementTagNameMap[Tag];
}
export type ViewNode = HTMLElement | RealNodeContext<any> | string | number | null | undefined | SlotDefine;
export function context<Tag extends keyof HTMLElementTagNameMap>(tag: Tag): RealNodeContext<Tag> {
    const element = document.createElement(tag);
    return Object.assign((...children: ViewNode[]) => {
        children.forEach(child => {
            const node = toNode(child);
            if (!node) return;
            element.appendChild(node);
        });
        return element;
    }, { element });
}
export function toNode(view: ViewNode): Node | null {
    if (!view) return null;
    if (typeof view === "string" || typeof view === "number") {
        return document.createTextNode(String(view));
    } else if (view instanceof HTMLElement) {
        return view;
    } else if (isSlotDefine(view)) {
        return toNode(view.view());
    } else {
        return view.element;
    }
}
export function attach<T extends HTMLElement, E extends keyof HTMLElementEventMap>(element: T, event: E, handler: (event: HTMLElementEventMap[E], target: T) => void) {
    element.addEventListener(event, (event) => handler(event, element));
}