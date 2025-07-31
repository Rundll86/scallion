import { component, elements } from "../scallion";
import NumberInput from "./NumberInput";
const { div, span, button, input, br } = elements;
const { $click } = button.attributes;
const { type, $input } = input.attributes;
export default component({
    name: "AppleWeight",
    slots: {
        bottom: {
            nullable: true
        }
    },
    template(_attributes, { bottom }) {
        let volume = 1;
        let density = 1;
        return div()(
            span()("苹果重量计算器"),
            br()(),
            span()("苹果体积："),
            NumberInput($input((_event, target) => volume = Number(target.value)))(),
            span()("cm³"),
            br()(),
            span()("苹果密度："),
            input(type("number"), $input((_event, target) => density = Number(target.value)))(),
            span()("g/cm³"),
            br()(),
            button($click(() => alert(`苹果重量为：${volume * density}`)))("计算"),
            bottom()
        );
    },
});