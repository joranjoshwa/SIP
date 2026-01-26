type Release = () => void;

class Semaphore {
    private available: number;
    private queue: Array<(release: Release) => void> = [];

    constructor(max: number) {
        this.available = max;
    }

    setMax(max: number) {
        this.available = max;
        this.drain();
    }

    acquire(): Promise<Release> {
        return new Promise((resolve) => {
            const grant = () => {
                this.available -= 1;
                resolve(() => this.release());
            };

            if (this.available > 0) grant();
            else this.queue.push(() => grant());
        });
    }

    private release() {
        this.available += 1;
        this.drain();
    }

    private drain() {
        while (this.available > 0 && this.queue.length > 0) {
            const next = this.queue.shift();
            if (next) next(() => this.release());
        }
    }
}


export const imageLoadLimiter = new Semaphore(6);
