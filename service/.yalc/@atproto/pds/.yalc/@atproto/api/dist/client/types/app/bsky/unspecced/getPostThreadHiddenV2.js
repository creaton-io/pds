"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKnownErr = toKnownErr;
exports.isThreadHiddenItem = isThreadHiddenItem;
exports.validateThreadHiddenItem = validateThreadHiddenItem;
exports.isThreadHiddenItemPost = isThreadHiddenItemPost;
exports.validateThreadHiddenItemPost = validateThreadHiddenItemPost;
const lexicons_1 = require("../../../../lexicons");
const util_1 = require("../../../../util");
const is$typed = util_1.is$typed, validate = lexicons_1.validate;
const id = 'app.bsky.unspecced.getPostThreadHiddenV2';
function toKnownErr(e) {
    return e;
}
const hashThreadHiddenItem = 'threadHiddenItem';
function isThreadHiddenItem(v) {
    return is$typed(v, id, hashThreadHiddenItem);
}
function validateThreadHiddenItem(v) {
    return validate(v, id, hashThreadHiddenItem);
}
const hashThreadHiddenItemPost = 'threadHiddenItemPost';
function isThreadHiddenItemPost(v) {
    return is$typed(v, id, hashThreadHiddenItemPost);
}
function validateThreadHiddenItemPost(v) {
    return validate(v, id, hashThreadHiddenItemPost);
}
//# sourceMappingURL=getPostThreadHiddenV2.js.map