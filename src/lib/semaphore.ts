// src/lib/semaphore.ts
export type Release = () => void;

export class Semaphore {
    private max: number;
    private inUse = 0;
    private queue: Array<(release: Release) => void> = [];

    constructor(max: number) {
        this.max = Math.max(1, max);
    }

    setMax(max: number) {
        this.max = Math.max(1, max);
        this.drain();
    }

    acquire(): Promise<Release> {
        return new Promise((resolve) => {
            const grant = () => {
                this.inUse += 1;
                let released = false;

                const release: Release = () => {
                    if (released) return;
                    released = true;
                    this.inUse -= 1;
                    this.drain();
                };

                resolve(release);
            };

            if (this.inUse < this.max) grant();
            else this.queue.push(() => grant());
        });
    }

    private drain() {
        while (this.inUse < this.max && this.queue.length > 0) {
            const next = this.queue.shift();
            if (next) next(() => { });
        }
    }
}
