"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKnownErr = toKnownErr;
exports.isThreadItem = isThreadItem;
exports.validateThreadItem = validateThreadItem;
exports.isThreadItemPost = isThreadItemPost;
exports.validateThreadItemPost = validateThreadItemPost;
exports.isThreadItemNoUnauthenticated = isThreadItemNoUnauthenticated;
exports.validateThreadItemNoUnauthenticated = validateThreadItemNoUnauthenticated;
exports.isThreadItemNotFound = isThreadItemNotFound;
exports.validateThreadItemNotFound = validateThreadItemNotFound;
exports.isThreadItemBlocked = isThreadItemBlocked;
exports.validateThreadItemBlocked = validateThreadItemBlocked;
const lexicons_1 = require("../../../../lexicons");
const util_1 = require("../../../../util");
const is$typed = util_1.is$typed, validate = lexicons_1.validate;
const id = 'app.bsky.unspecced.getPostThreadV2';
function toKnownErr(e) {
    return e;
}
const hashThreadItem = 'threadItem';
function isThreadItem(v) {
    return is$typed(v, id, hashThreadItem);
}
function validateThreadItem(v) {
    return validate(v, id, hashThreadItem);
}
const hashThreadItemPost = 'threadItemPost';
function isThreadItemPost(v) {
    return is$typed(v, id, hashThreadItemPost);
}
function validateThreadItemPost(v) {
    return validate(v, id, hashThreadItemPost);
}
const hashThreadItemNoUnauthenticated = 'threadItemNoUnauthenticated';
function isThreadItemNoUnauthenticated(v) {
    return is$typed(v, id, hashThreadItemNoUnauthenticated);
}
function validateThreadItemNoUnauthenticated(v) {
    return validate(v, id, hashThreadItemNoUnauthenticated);
}
const hashThreadItemNotFound = 'threadItemNotFound';
function isThreadItemNotFound(v) {
    return is$typed(v, id, hashThreadItemNotFound);
}
function validateThreadItemNotFound(v) {
    return validate(v, id, hashThreadItemNotFound);
}
const hashThreadItemBlocked = 'threadItemBlocked';
function isThreadItemBlocked(v) {
    return is$typed(v, id, hashThreadItemBlocked);
}
function validateThreadItemBlocked(v) {
    return validate(v, id, hashThreadItemBlocked);
}
//# sourceMappingURL=getPostThreadV2.js.map