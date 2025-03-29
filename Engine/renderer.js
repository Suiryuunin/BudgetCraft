import { vec2 } from "../Utils/vec";

export class Renderer
{
    "use strict";

    constructor(canvas)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.color = "black";
        this.font = "VCR_OSD";
    }

    toCanvasCoords(pageX, pageY)
    {
        const _rect = this.canvas.getBoundingClientRect();
        const scale = {x: this.canvas.width/this.ctx.canvas.width, y: this.canvas.height/this.ctx.canvas.height};
        
        let x = (pageX-_rect.left) / scale.x;
        let y = (pageY-_rect.top) / scale.y;

        return new vec2(x, y);
    }



    fillBackground(color = this.color, alpha = 1)
    {
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.globalAlpha = 1;
    }

    drawLine(start, end, color = "hotpink", alpha = 1, thickness = 4, lw = 1, vw = 0)
    {
        // Start a new Path
        this.ctx.globalAlpha = alpha;
        this.ctx.setLineDash([lw, vw]);
        this.ctx.lineWidth = thickness
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        
        // Draw the Path
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }

    measureWordWidth(word, size = 16)
    {
        this.ctx.font = `${size}px ${this.font}`;
        return this.ctx.measureText(word)["width"];
    }

    write(word, color = this.color, pos, size = 16, o = new vec2(0,0), border = false, alpha = 1, linesMargin = 64)
    {
        this.ctx.globalAlpha = alpha;
        this.ctx.lineWidth = 1;

        this.ctx.font = `${size}px ${this.font}`;
        let w = 0;
        let widths = [];
        for (let i = 0; i < word.length; i++)
        {
            w = Math.max(w, widths[i] = this.ctx.measureText(word[i])["width"]);
        }
        
        this.ctx.fillStyle = color;

        for (let i = 0; i < word.length; i++)
            this.ctx.fillText(word[i], pos.x + widths[i] * o.x, i*linesMargin + pos.y - size*o.y/1.5, w);

        if (border)
        {
            this.ctx.strokeStyle = color;
            this.ctx.beginPath();
            this.ctx.rect(pos.x + w * o.x, pos.y + o.y, w + 8, size * word.length);
            this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1;
    }


      //////////
     // RECT //
    //////////

    fillRect(s_T, color = this.color, l = 0, alpha = 1)
    {
        if (alpha == 0) return;

        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = color;
        
        // s_T for Standard Transform
        this.ctx.fillRect(s_T.x, s_T.y, s_T.w, s_T.h);
        
        this.ctx.globalAlpha = 1;
    }
    strokeRect(pos, w,h, color = this.color, l = 0, inside = true, thickness = 1, alpha = 1)
    {
        if (alpha == 0) return;

        this.ctx.globalAlpha = alpha;

        this.ctx.lineWidth = thickness;
        this.ctx.strokeStyle = color;

        this.ctx.beginPath();
        this.ctx.rect(pos.x +(inside?thickness:0), pos.y +(inside?thickness:0),
                    w -(inside?thickness*2:0), h -(inside?thickness*2:0));

        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
    }


      ////////////
     // CIRCLE //
    ////////////

    // s_P: Standard Position
    fillCircle(s_P, r, color = this.color, l = 0, alpha = 1)
    {
        if (alpha == 0) return;

        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = color;

        this.ctx.beginPath();
        this.ctx.arc(s_P.x, s_P.y, r, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.globalAlpha = 1;
    }
    strokeCircle(s_P, r, color = this.color, l = 0, inside = true, thickness = 1, alpha = 1)
    {
        if (alpha == 0) return;

        this.ctx.globalAlpha = alpha;

        this.ctx.lineWidth = thickness;
        this.ctx.strokeStyle = color;

        this.ctx.beginPath();
        this.ctx.arc(s_P.x, s_P.y, r - (inside?thickness:0), 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
    }
}