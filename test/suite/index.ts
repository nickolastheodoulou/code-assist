import * as path from 'path';
import Mocha from 'mocha';
import { promisify } from 'util';

const globPromise = promisify(require('glob'));

export async function run(): Promise<void> {
    const mocha = new Mocha({
        ui: 'tdd',
        color: true
    });

    const testsRoot = path.resolve(__dirname, '.');

    try {
        const files = await globPromise('**/*.test.js', { cwd: testsRoot });

        files.forEach((file: string) => {
            mocha.addFile(path.resolve(testsRoot, file));
        });

        const failures: number = await new Promise((resolve, reject) => {
            mocha.run((failures) => {
                if (failures > 0) {
                    reject(new Error(`${failures} tests failed.`));
                } else {
                    resolve(failures);
                }
            });
        });

        if (failures > 0) {
            throw new Error(`${failures} tests failed.`);
        }
    } catch (err) {
        console.error('Error running tests:', err);
        throw err;
    }
}
