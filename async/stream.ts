﻿import references = require('references');
import oldBuilder = require('../src/asyncBuilder');
import stream = require('stream');
import transfer = require('../src/transfer');
export = builder;


var builder = oldBuilder.mod<AsyncAwait.Async.StreamBuilder>({
    methods: () => ({
        invoke: (co) => co.stream = new Stream(() => transfer(co)),
        return: (co, result) => co.stream.push(null),
        throw: (co, error) => co.stream.emit('error', error),
        yield: (co, value) => { co.stream.push(value); transfer(); },
        finally: (co) => { co.stream = null; }
    })
});


class Stream extends stream.Readable {
    constructor(private readImpl: () => void) {
        super({objectMode: true});
    }

    _read() {
        this.readImpl();
    }
}
