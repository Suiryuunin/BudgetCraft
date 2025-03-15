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

        this.run = (time) =>
        {
            this.time = time;
            this.delta = (this.time - this.timeStamp)/1;

            if (this.delta >= 1000 / (this.fps + 4))
            {
                this.update (
                    // Prevent ridiculous delta time after leaving the app
                    (this.delta > 2000/this.fps) ?
                        1/this.fps : this.delta/1000
                );
                this.render();

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