class NMath {
    constructor()
    {
        this.seed = 0;
    }

    srand(seed)
    {
        this.seed = seed;
    }

    rand()
    {
        this.seed = (214013*this.seed+2531011);
        return (this.seed>>16)&0x7FFF;
    }
}

export const MATH = new NMath();

export function Clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}