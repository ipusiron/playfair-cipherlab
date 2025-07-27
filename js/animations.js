class AnimationManager {
    constructor() {
        this.animationDuration = 500;
    }

    setDuration(duration) {
        this.animationDuration = duration;
    }

    async fadeIn(element, duration = this.animationDuration) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.classList.remove('hidden');
        
        await this.nextFrame();
        element.style.opacity = '1';
        
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    async fadeOut(element, duration = this.animationDuration) {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';
        
        return new Promise(resolve => {
            setTimeout(() => {
                element.classList.add('hidden');
                element.style.opacity = '1';
                resolve();
            }, duration);
        });
    }

    async highlight(element, className, duration = this.animationDuration) {
        element.classList.add(className);
        
        return new Promise(resolve => {
            setTimeout(() => {
                element.classList.remove(className);
                resolve();
            }, duration);
        });
    }

    nextFrame() {
        return new Promise(resolve => {
            requestAnimationFrame(resolve);
        });
    }
}

const animationManager = new AnimationManager();