// Lightweight vector2
export class vec2
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }

    mag()
    {
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }

    add(v)
    {
        return new vec2(this.x+v.x, this.y+v.y);
    }
    sub(v)
    {
        return new vec2(this.x-v.x, this.y-v.y);
    }
    dot(v)
    {
        return this.x * v.x + this.y * v.y;
    }
    mult(s)
    {
        return new vec2(this.x*s, this.y*s);
    }
    div(s)
    {
        return new vec2(this.x/s, this.y/s);
    }

    floor()
    {
        return new vec2(Math.floor(this.x), Math.floor(this.y));
    }
}

export class vec3
{
    constructor(x,y,z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v)
    {
        return new vec3(this.x+v.x, this.y+v.y, this.z+v.z);
    }
    sub(v)
    {
        return new vec3(this.x-v.x, this.y-v.y, this.z-v.z);
    }

    mult(s)
    {
        return new vec3(this.x*s, this.y*s, this.z*s);
    }

    dot(v)
    {
        return this.x*v.x + this.y*v.y + this.z*v.z;
    }

    array()
    {
        return [this.x, this.y, this.z];
    }
}