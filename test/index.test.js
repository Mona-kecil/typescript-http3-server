import greet from '../index.js';
import assert from 'assert';

describe('greet user', () => {
    it("Should equal 'Hello, MonaKecil!", () => {
        assert.equal(greet('MonaKecil'), 'Hello, MonaKecil!')
    })
})
