"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var elasticsearch_1 = require("@elastic/elasticsearch");
var client = new elasticsearch_1.Client({
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',
        password: 'EZ87cZyY'
    }
});
exports.default = client;
