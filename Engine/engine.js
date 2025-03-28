export default class Engine
{
    constructor (fps, update, render)
    {
        this.running = false;
        
        this.time = 0;
        this.timeStamp = 0;
        this.delta = 0;
        this.update = update;
        this.render = render;
        this.fps = fps;
        this.invFps = 1/fps;

        this.p = document.getElementById("Fps");

        this.run = (time) =>
        {
            this.time = time;
            this.delta = this.time - this.timeStamp;

            if (this.delta >= 1000 / (this.fps + 4))
            {
                this.update (
                    // Prevent ridiculous delta time after leaving the app
                    (this.delta > 2000/this.fps) ? this.invFps : this.delta*0.001
                );
                this.render();

                this.p.innerHTML = `Fps: ${(1000/this.delta).toFixed(2)}`;

                this.timeStamp = time;
            }

            this.animationRequest = window.requestAnimationFrame(this.run);
        }
    }

    start()
    {
        this.running = true;
        this.animationRequest = window.requestAnimationFrame(this.run);
    }

    stop()
    {
        this.running = false;
        window.cancelAnimationFrame(this.animationRequest);
    }
}