import { EItem } from "./items";

export class Inventory
{
    constructor()
    {
        this.hotbar = [];
        this.inv = [];

        for (let i = 0; i < 9; i++)
        {
            this.hotbar.push(EItem.Null);
            this.inv.push([]);
            for (let j = 0; j < 3; j++)
                this.inv[i].push(EItem.Null);
        }
    }
}