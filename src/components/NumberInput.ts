import { component, elements } from "../scallion";
const { input } = elements;
const { type } = input.attributes;
export default component({
    template() {
        return input(type("number"))();
    }
});