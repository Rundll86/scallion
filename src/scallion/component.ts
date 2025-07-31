import { KeyPair, ViewNode } from "./context";
import { NonEmptyUnion } from "./utils";
export interface AttributeVaildator<Input = string, Output = any, Nullable extends boolean = boolean, Default extends Output = any> {
    fill?: Default;
    nullable?: Nullable;
    cast?(value: Input): Output;
}
export interface SlotValidator<Nullable extends boolean = boolean> {
    nullable?: Nullable;
}
export type SlotDict<Slots extends Record<string, SlotValidator>> = Record<keyof Slots, () => ViewNode>;
export type AttributeDict<Attributes extends Record<string, AttributeVaildator>> = {
    [K in keyof Attributes]:
    Attributes[K]["nullable"] extends false
    ? ReturnType<NonEmptyUnion<Attributes[K]["cast"]>>
    : Attributes[K]["fill"] | ReturnType<NonEmptyUnion<Attributes[K]["cast"]>> | undefined;
};
export interface ComponentConfig<Name extends string, Slots extends Record<string, SlotValidator>, Attributes extends Record<string, AttributeVaildator>> {
    name?: Name;
    slots?: Slots;
    attributes?: Attributes;
    template: (attributes: AttributeDict<Attributes>, slots: SlotDict<Slots>) => HTMLElement;
}
export interface Component<Attributes extends Record<string, AttributeVaildator>, Slots extends Record<string, SlotValidator>> {
    (...attributes: KeyPair<string, any>[]): (...children: ViewNode[]) => HTMLElement;
    attributes: {
        [K in keyof Attributes]: (value: AttributeDict<Attributes>[K]) => KeyPair<K, AttributeDict<Attributes>[K]>;
    };
    slots: {
        [K in keyof Slots]: (value: ViewNode) => SlotDefine<K & string>;
    };
}
export interface SlotDefine<Name extends string = string> {
    slot: Name;
    view: () => ViewNode;
}
export function isSlotDefine(obj: any): obj is SlotDefine {
    return Object.keys(obj).includes("slot");
}