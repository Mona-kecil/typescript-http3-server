import greet from '../index.js';
import assert from 'assert';

describe('greet user', () => {
    it("Should equal 'Hello, MonaKecil!", () => {
        assert.strictEqual(greet('MonaKecil'), 'Hello, MonaKecil!')
    })
})
