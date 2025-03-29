import { Button } from "./Engine/button";
import { vec2 } from "./Utils/vec";

export let menuActive = true;
export const Menu = [
    new Button(()=> {menuActive = false;}, ["Play"], new vec2(0.5,0.45), 2, 0.1, 16, "black"),
    new Button(()=> {
        Menu[0].word = ["Info"]; Menu[0].pos.y = 0.2; Menu[0].resize(); Menu[0].action = ()=>{};
        Menu[2] = new Button(() => {
            Menu[0].word = ["Play"]; Menu[0].action = ()=> {menuActive = false;}; Menu[0].pos.y = 0.45; Menu[0].resize();Menu[1].pos.y = 0.55; Menu[1].resize(); Menu[1].word = ["Info"]; //Menu[2] = undefined;
        }, ["<-"], new vec2(0.2, 0.8), 1, 0.1)
        Menu[1].pos.y = 0.3; Menu[1].resize();Menu[1].word = ["WASD to move","Space to jump","Shift to run", "LMB to break", "RMB to place", "Scroll or Num to select in the hotbar","", "This is an improvement","over Minecraft Classic", "This is an infinite world", "This has better graphics", "The controls are less janky"]
    }, ["Info"], new vec2(0.5,0.55), 2, 0.1, 16, "black")
];
for (const item of Menu) item.activate();

window.addEventListener("keydown", (e) => {
    if (e.code == "Escape")
    {
        menuActive = true;
    }
})