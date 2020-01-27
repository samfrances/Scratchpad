class Mutex {

    constructor() {
        this.current = Promise.resolve();
    }

    async aquire() {
        let release;

        const next = new Promise(resolve => {
            release = () => resolve();
        });

        const previousHolder = this.current;
        this.current = next;

        await previousHolder;

        return release;
    }

}

const sleep = secs => new Promise(res => setTimeout(res, secs));

async function runner(lock, name, sleep_secs) {

    console.log(`${name} will request the lock`);

    const release = await lock.aquire();

    console.log(`${name} has aquired the lock`);

    await sleep(sleep_secs);

    release();

    console.log(`${name} has released the lock`);

}

function test() {

    const lock = new Mutex();

    runner(lock, "A", 5000);

    runner(lock, "B", 3000);

    runner(lock, "C", 3000);
}


