import { EItem } from "./items";

export class Inventory
{
    constructor()
    {
    }
}

export class Hotbar
{
    constructor()
    {
        this.items = [];

        for (let i = 0; i < 9; i++)
        {
            this.items.push(EItem.Null);
        }

        this.w;
        this.h;
        this.bar = new Image(288, 32);
        this.bar.src = "./Assets/Textures/Inventory/hotbar.png";
        this.slot = new Image(32, 32);
        this.slot.src = "./Assets/Textures/Inventory/slot.png";

        this.index = 0;

        this.Resize(window.innerWidth);
        window.addEventListener("resize", this.Resize);
        window.addEventListener("wheel", (e) =>
        {
            switch (e.deltaY)
            {
            case -100: this.index = (this.index+1)%this.items.length; break;
            case  100: this.index = (this.index-1 < 0 ? 8 : this.index-1); break;
            }
        });

        window.addEventListener("keydown", (e) =>
        {
            const lastChar = e.code.at(e.code.length-1);
            if (lastChar*0 == 0 && lastChar > 0)
                this.index = lastChar-1;
        })
    }

    Resize(w)
    {
        this.w = w*0.5;
        this.h = this.w*0.1111;
    }

    Render(ctx)
    {
        ctx.drawImage(this.bar, window.innerWidth*0.5-this.w*0.5,window.innerHeight-this.h,this.w,this.h);
        ctx.drawImage(this.slot, window.innerWidth*0.5-this.w*0.5+this.h*this.index,window.innerHeight-this.h,this.h,this.h);
    }
}