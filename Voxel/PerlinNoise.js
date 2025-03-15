// import { MATH } from "../Utils/customMath.js";
import { vec2 } from "../Utils/vec.js";

export default class PerlinNoise
{
    constructor()
    {
		this.amplitudeVariationPerOctave = 0.5;
		this.frequencyVariationPerOctave = 2;


        this.Permutation = [];

        for (let i = 0; i < 256; i++)
        {
            this.Permutation.push(i);
        }

        // Shuffle
        for (let i = 0; i < 256; i++)
        {
            const index = Math.round(Math.random() * i);
            const temp = this.Permutation[i];
        
            this.Permutation[i] = this.Permutation[index];
            this.Permutation[index] = temp;
        }
        
        for (let i = 0; i < 256; i++)
        {
            this.Permutation[256 + i] = this.Permutation[i];
        }
    }

    GetConstantVector(v)
	{
		// v is the value from the permutation table
		const h = v & 3;
		if (h == 0)
			return new vec2(1.0, 1.0);
		else if (h == 1)
			return new vec2(-1.0, 1.0);
		else if (h == 2)
			return new vec2(-1.0, -1.0);
		else
			return new vec2(1.0, -1.0);
	};

	Fade(t)
	{
		return ((6 * t - 15) * t + 10) * t*t*t;
	};

	Lerp(t, a, b)
	{
		return a + t * (b - a);
	};

	StandardPerlin2D(x = 0, y = 0)
	{
		const X = Math.floor(x) & 255;
		const Y = Math.floor(y) & 255;

		const xf = x - Math.floor(x);
		const yf = y - Math.floor(y);

		const topRight = new vec2(xf - 1, yf - 1);
		const topLeft = new vec2(xf, yf - 1);
		const bottomRight = new vec2(xf - 1, yf);
		const bottomLeft = new vec2(xf, yf);

		// Select a value from the permutation array for each of the 4 corners
		const valueTopRight = this.Permutation[this.Permutation[X + 1] + Y + 1];
		const valueTopLeft = this.Permutation[this.Permutation[X] + Y + 1];
		const valueBottomRight = this.Permutation[this.Permutation[X + 1] + Y];
		const valueBottomLeft = this.Permutation[this.Permutation[X] + Y];

		const u = this.Fade(xf);
		const v = this.Fade(yf);

		return this.Lerp(u,
			this.Lerp(v, bottomLeft.dot(this.GetConstantVector(valueBottomLeft)), topLeft.dot(this.GetConstantVector(valueTopLeft))),
			this.Lerp(v, bottomRight.dot(this.GetConstantVector(valueBottomRight)), topRight.dot(this.GetConstantVector(valueTopRight)))
		);
	};

    

	FractalBrownianMotion2D(x, y, numOctaves = 1)
	{
		let result = 0.0;
		let amplitude = 1.0;
		let frequency = 1;
		let maxRes = amplitude;

		for (let octave = 0; octave < numOctaves; octave++) {
			const n = amplitude * this.StandardPerlin2D(x * frequency, y * frequency);
			result += n;

			amplitude *= this.amplitudeVariationPerOctave;
			maxRes += amplitude;
			frequency *= this.frequencyVariationPerOctave;
		}

		return result/maxRes;
	}
}

const noise = new PerlinNoise();

export function StandardPerlin2D(x, y) {return noise.StandardPerlin2D(x, y);};
export function FractalBrownianMotion2D(x, y, numOctaves = 1) {return noise.FractalBrownianMotion2D(x, y, numOctaves);};