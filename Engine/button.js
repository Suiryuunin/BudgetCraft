import { rr } from "../threeInit";
import { vec2 } from "../Utils/vec";

class R_Transform2D
{
    constructor(position, dimensions)
    {
        // position
        this.pos = position;
        // dimensions
        this.dim = dimensions;
    }

    top()
    {
        return this.pos.y;
    }
    left()
    {
        return this.pos.x;
    }
    bottom()
    {
        return (this.pos.y+this.dim.y);
    }
    right()
    {
        return (this.pos.x+this.dim.x);
    }
}

function pointCollideRect(point, R_Trans2D)
{
    return (point.x <= R_Trans2D.right() && point.x >= R_Trans2D.left() && point.y <= R_Trans2D.bottom() && point.y >= R_Trans2D.top());
}

export class Button
{
    constructor(action = () =>{console.log("FOOL! This button doesn't do jack shit!!")}, word = [""], pos, w,h, size = 16, cr = "white")
    {
        this.visible = true;

        this.word = word;
        this.pos = pos;
        this.w = w;
        this.h = h;

        this.t = new R_Transform2D(new vec2(Math.floor(pos.x*window.innerWidth), Math.floor(pos.y*window.innerHeight)), new vec2(Math.floor(w*this.h*window.innerHeight), Math.floor(h*window.innerHeight)));
        this.cr = cr;
        this.offset = new vec2(-0.5,-0.5);
        this.size = this.h*window.innerHeight*0.5;

        this.action = action;

        this.event = (e) =>
        {
            const coords = rr.toCanvasCoords(e.pageX, e.pageY);

            const tt = new R_Transform2D(this.t.pos.sub(this.t.dim.mult(0.5)), this.t.dim);
            if (pointCollideRect(coords, tt))
            {
                this.action(this);
            }
        };

        window.addEventListener("resize", () => this.resize());
    }

    resize()
    {
        this.t.pos.x = Math.floor(this.pos.x*window.innerWidth);
        this.t.pos.y = Math.floor(this.pos.y*window.innerHeight);
        this.t.dim.y = Math.floor(this.h*window.innerHeight);
        this.t.dim.x = Math.floor(this.w*this.h*window.innerHeight);
        this.size = this.h*window.innerHeight*0.5;
    }

    activate()
    {
        window.addEventListener("mousedown", this.event);
    }

    deactivate()
    {
        window.removeEventListener("mousedown", this.event);
    }

    render(rr)
    {
        rr.write(this.word, this.cw, this.t.pos, this.size, this.offset);
        // const tt = new R_Transform2D(this.t.pos.sub(this.t.dim.mult(0.5)), this.t.dim);
        // rr.strokeRect(new vec2(tt.left(), tt.top()), this.t.dim.x, this.t.dim.y, this.cr, 0, true, 1);
    }
}