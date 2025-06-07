/**
 * GENERATED CODE - DO NOT MODIFY
 */
import express from 'express';
import { type ValidationResult } from '@atproto/lexicon';
import { type $Typed } from '../../../../util';
import { HandlerAuth, HandlerPipeThrough } from '@atproto/xrpc-server';
import type * as AppBskyFeedDefs from '../feed/defs.js';
export interface QueryParams {
    /** Reference (AT-URI) to post record. This is the anchor post, and the thread will be built around it. It can be any post in the tree, not necessarily a root post. */
    anchor: string;
    /** Whether to include parents above the anchor. */
    above: boolean;
    /** How many levels of replies to include below the anchor. */
    below: number;
    /** Maximum of replies to include at each level of the thread, except for the direct replies to the anchor, which are (NOTE: currently, during unspecced phase) all returned (NOTE: later they might be paginated). */
    branchingFactor: number;
    /** Whether to prioritize posts from followed users. It only has effect when the user is authenticated. */
    prioritizeFollowedUsers: boolean;
    /** Sorting for the thread replies. */
    sort: 'newest' | 'oldest' | 'top' | (string & {});
}
export type InputSchema = undefined;
export interface OutputSchema {
    /** A flat list of thread items. The depth of each item is indicated by the depth property inside the item. */
    thread: ThreadItem[];
    threadgate?: AppBskyFeedDefs.ThreadgateView;
    /** Whether this thread has hidden replies. If true, a call can be made to the `getPostThreadHiddenV2` endpoint to retrieve them. */
    hasHiddenReplies: boolean;
}
export type HandlerInput = undefined;
export interface HandlerSuccess {
    encoding: 'application/json';
    body: OutputSchema;
    headers?: {
        [key: string]: string;
    };
}
export interface HandlerError {
    status: number;
    message?: string;
}
export type HandlerOutput = HandlerError | HandlerSuccess | HandlerPipeThrough;
export type HandlerReqCtx<HA extends HandlerAuth = never> = {
    auth: HA;
    params: QueryParams;
    input: HandlerInput;
    req: express.Request;
    res: express.Response;
    resetRouteRateLimits: () => Promise<void>;
};
export type Handler<HA extends HandlerAuth = never> = (ctx: HandlerReqCtx<HA>) => Promise<HandlerOutput> | HandlerOutput;
export interface ThreadItem {
    $type?: 'app.bsky.unspecced.getPostThreadV2#threadItem';
    uri: string;
    /** The nesting level of this item in the thread. Depth 0 means the anchor item. Items above have negative depths, items below have positive depths. */
    depth: number;
    value: $Typed<ThreadItemPost> | $Typed<ThreadItemNoUnauthenticated> | $Typed<ThreadItemNotFound> | $Typed<ThreadItemBlocked> | {
        $type: string;
    };
}
export declare function isThreadItem<V>(v: V): v is import("../../../../util").$TypedObject<V, "app.bsky.unspecced.getPostThreadV2", "threadItem">;
export declare function validateThreadItem<V>(v: V): ValidationResult<ThreadItem & V>;
export interface ThreadItemPost {
    $type?: 'app.bsky.unspecced.getPostThreadV2#threadItemPost';
    post: AppBskyFeedDefs.PostView;
    /** This post has more parents that were not present in the response. This is just a boolean, without the number of parents. */
    moreParents: boolean;
    /** This post has more replies that were not present in the response. This is a numeric value, which is best-effort and might not be accurate. */
    moreReplies: number;
    /** This post is part of a contiguous thread by the OP from the thread root. Many different OP threads can happen in the same thread. */
    opThread: boolean;
}
export declare function isThreadItemPost<V>(v: V): v is import("../../../../util").$TypedObject<V, "app.bsky.unspecced.getPostThreadV2", "threadItemPost">;
export declare function validateThreadItemPost<V>(v: V): ValidationResult<ThreadItemPost & V>;
export interface ThreadItemNoUnauthenticated {
    $type?: 'app.bsky.unspecced.getPostThreadV2#threadItemNoUnauthenticated';
}
export declare function isThreadItemNoUnauthenticated<V>(v: V): v is import("../../../../util").$TypedObject<V, "app.bsky.unspecced.getPostThreadV2", "threadItemNoUnauthenticated">;
export declare function validateThreadItemNoUnauthenticated<V>(v: V): ValidationResult<ThreadItemNoUnauthenticated & V>;
export interface ThreadItemNotFound {
    $type?: 'app.bsky.unspecced.getPostThreadV2#threadItemNotFound';
}
export declare function isThreadItemNotFound<V>(v: V): v is import("../../../../util").$TypedObject<V, "app.bsky.unspecced.getPostThreadV2", "threadItemNotFound">;
export declare function validateThreadItemNotFound<V>(v: V): ValidationResult<ThreadItemNotFound & V>;
export interface ThreadItemBlocked {
    $type?: 'app.bsky.unspecced.getPostThreadV2#threadItemBlocked';
    author: AppBskyFeedDefs.BlockedAuthor;
}
export declare function isThreadItemBlocked<V>(v: V): v is import("../../../../util").$TypedObject<V, "app.bsky.unspecced.getPostThreadV2", "threadItemBlocked">;
export declare function validateThreadItemBlocked<V>(v: V): ValidationResult<ThreadItemBlocked & V>;
//# sourceMappingURL=getPostThreadV2.d.ts.map