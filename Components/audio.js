
function Play(i, volume = 0.5)
{
    const audio = new Audio(i);
    audio.volume = volume;

    audio.currentTime=0;
    audio.play();
}


const music = new Audio("Assets/SFX/Waves.mp3");

music.addEventListener("ended", ()=>{
    music.currentTime = 0;
    music.play();
});
window.addEventListener("click", ()=>music.play());