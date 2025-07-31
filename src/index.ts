import AppleWeight from "./components/AppleWeight";
import { Scallion, elements } from "./scallion";
const { div, br } = elements;
const { bottom } = AppleWeight.slots;
const app = new Scallion(
    AppleWeight()(
        bottom(
            div()(
                "测试"
            )
        )
    )
);
app.mount("body");
