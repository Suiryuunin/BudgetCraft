import { vec2 } from "../Utils/vec";
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
        this.bar.src = "../Assets/Textures/Inventory/hotbar.png";
        this.slot = new Image(32, 32);
        this.slot.src = "../Assets/Textures/Inventory/slot.png";

        this.index = 0;

        this.Resize();
        window.addEventListener("resize", () => this.Resize());
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

    Check()
    {
        return (this.items[this.index] != EItem.Null);
    }

    Add(_item)
    {
        for (let i = 0; i < this.items.length; i++)
        {
            if (this.items[i].Name == _item.Name)
            {
                this.items[i].Count++;
                return;
            }
        }
        for (let i = 0; i < this.items.length; i++)
        {
            if (this.items[i] == EItem.Null)
            {
                this.items[i] = _item;
                this.items[i].Count = 1;
                return;
            }
        }
    }
    Remove(_item)
    {
        this.items[this.index].Count--;
        if (this.items[this.index].Count <= 0) this.items[this.index] = EItem.Null;
    }

    Resize()
    {
        this.w = window.innerWidth*0.5;
        this.h = this.w*0.1111;
    }

    Render(ctx, rr)
    {
        for (let i = 0; i < this.items.length; i++)
        {
            if (this.items[i] != EItem.Null)
            {
                ctx.drawImage(this.items[i].Img, window.innerWidth*0.5-this.w*0.5+this.h*i,window.innerHeight-this.h,this.h,this.h);
            }
        }
        ctx.drawImage(this.bar, window.innerWidth*0.5-this.w*0.5,window.innerHeight-this.h,this.w,this.h);
        for (let i = 0; i < this.items.length; i++)
        {
            if (this.items[i] != EItem.Null)
            {
                rr.write([this.items[i].Count], "black", new vec2(window.innerWidth*0.5-this.w*0.5+this.h*(i+0.92),window.innerHeight-this.h*0.08), this.h * 0.4, new vec2(-1,0));
                rr.write([this.items[i].Count], "white", new vec2(window.innerWidth*0.5-this.w*0.5+this.h*(i+0.9),window.innerHeight-this.h*0.1), this.h * 0.4, new vec2(-1,0));
            }
        }
        ctx.drawImage(this.slot, window.innerWidth*0.5-this.w*0.5+this.h*this.index,window.innerHeight-this.h,this.h,this.h);
    }
}