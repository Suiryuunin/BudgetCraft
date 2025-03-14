// Lightweight vector2
export default class vec2
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
    dot(v)
    {
        return this.x * v.x + this.y * v.y;
    }
}