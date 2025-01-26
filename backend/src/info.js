"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connection_1 = require("./connection");
connection_1.default.cluster.health({})
    .then(function (resp) {
    // handle response
    console.log(resp);
})
    .catch(function (err) {
    // handle error
    console.error(err);
});
