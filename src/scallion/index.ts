import { AttributeDict, AttributeVaildator, Component, ComponentConfig, isSlotDefine, SlotDefine, SlotDict, SlotValidator } from "./component";
import { attach, context, KeyPair, RealNodeBuilder, ViewNode } from "./context";
import { buildFailed, mountFailed } from "./errors";
export const elements = new Proxy({}, {
    get<Tag extends keyof HTMLElementTagNameMap>(_: any, p: Tag) {
        return Object.assign((...attributes: KeyPair<string & keyof HTMLElementTagNameMap[Tag], any>[]) => {
            const element = context(p);
            attributes.forEach(({ key, value }) => {
                if (key === "style") {
                    Object.assign(element.element.style, value);
                } else if (key.startsWith("$")) {
                    attach(element.element, key.slice(1), value);
                } else {
                    element.element.setAttribute(String(key), value);
                }
            });
            return element;
        }, {
            attributes: new Proxy({}, {
                get(_, p: string) {
                    return (value: any) => ({
                        key: p,
                        value,
                    });
                }
            })
        });
    }
}) as { [Tag in keyof HTMLElementTagNameMap]: RealNodeBuilder<Tag> };
export function component<N extends string, S extends Record<string, SlotValidator>, A extends Record<string, AttributeVaildator>>(config: ComponentConfig<N, S, A>) {
    return Object.assign((...attributes: KeyPair<string, any>[]) => {
        if (config.attributes) {
            for (const key in config.attributes) {
                const attribute = config.attributes[key];
                if (attribute.nullable) {
                    if (attributes.find(({ key: k }) => k === key) === undefined) {
                        throw buildFailed(config.name ?? "an unnamed component", `attribute ${key} is required.`);
                    }
                }
            }
        }
        return (...children: ViewNode[]) => {
            const slotDict = {} as SlotDict<S>;
            if (config.slots) {
                Object.keys(config.slots).forEach(key => {
                    if (!config.slots) return;
                    const slotDefine = children.find(child => isSlotDefine(child) && child.slot === key) as SlotDefine | undefined;
                    if (slotDefine) {
                        Object.assign(slotDict, { [key]: () => slotDefine.view() });
                    } else {
                        if (config.slots[key].nullable) {
                            Object.assign(slotDict, { [key]: () => null });
                        } else {
                            throw buildFailed(config.name ?? "an unnamed component", `slot ${key} is required.`);
                        }
                    }
                });
            }
            const result = config.template(attributes.reduce((acc, cur) => ({
                ...acc,
                [cur.key]: config.attributes?.[cur.key].cast?.(cur.value ?? config.attributes?.[cur.key].fill)
            }), {} as AttributeDict<A>), slotDict);
            attributes.forEach(attribute => {
                if (attribute.key.startsWith("$")) {
                    attach(result, attribute.key.slice(1), attribute.value);
                }
            });
            return result;
        };
    }, {
        attributes: new Proxy({}, {
            get(_, p: string) {
                return (value: any) => ({
                    key: p,
                    value,
                });
            }
        }),
        slots: new Proxy({}, {
            get(_, p: string) {
                return (view: any) => ({
                    slot: p,
                    view: () => view,
                });
            }
        })
    }) as Component<A, S>;
}
export class Scallion<C extends HTMLElement> {
    constructor(public root: C) { }
    mount(selector: string) {
        const element = document.querySelector(selector);
        if (!element) throw mountFailed("Scallion", `mount target ${selector} not found.`);
        element.innerHTML = "";
        element.appendChild(this.root);
    }
}