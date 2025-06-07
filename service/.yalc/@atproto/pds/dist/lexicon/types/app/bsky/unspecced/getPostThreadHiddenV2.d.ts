/**
 * GENERATED CODE - DO NOT MODIFY
 */
import express from 'express';
import { type ValidationResult } from '@atproto/lexicon';
import { type $Typed } from '../../../../util';
import { HandlerAuth, HandlerPipeThrough } from '@atproto/xrpc-server';
import type * as AppBskyFeedDefs from '../feed/defs.js';
export interface QueryParams {
    /** Reference (AT-URI) to post record. This is the anchor post. */
    anchor: string;
}
export type InputSchema = undefined;
export interface OutputSchema {
    /** A flat list of thread hidden items. The depth of each item is indicated by the depth property inside the item. */
    thread: ThreadHiddenItem[];
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
export interface ThreadHiddenItem {
    $type?: 'app.bsky.unspecced.getPostThreadHiddenV2#threadHiddenItem';
    uri: string;
    /** The nesting level of this item in the thread. Depth 0 means the anchor item. Items above have negative depths, items below have positive depths. */
    depth: number;
    value: $Typed<ThreadHiddenItemPost> | {
        $type: string;
    };
}
export declare function isThreadHiddenItem<V>(v: V): v is import("../../../../util").$TypedObject<V, "app.bsky.unspecced.getPostThreadHiddenV2", "threadHiddenItem">;
export declare function validateThreadHiddenItem<V>(v: V): ValidationResult<ThreadHiddenItem & V>;
export interface ThreadHiddenItemPost {
    $type?: 'app.bsky.unspecced.getPostThreadHiddenV2#threadHiddenItemPost';
    post: AppBskyFeedDefs.PostView;
    /** The threadgate created by the author indicates this post as a reply to be hidden for everyone consuming the thread. */
    hiddenByThreadgate: boolean;
    /** This is by an account muted by the viewer requesting it. */
    mutedByViewer: boolean;
}
export declare function isThreadHiddenItemPost<V>(v: V): v is import("../../../../util").$TypedObject<V, "app.bsky.unspecced.getPostThreadHiddenV2", "threadHiddenItemPost">;
export declare function validateThreadHiddenItemPost<V>(v: V): ValidationResult<ThreadHiddenItemPost & V>;
//# sourceMappingURL=getPostThreadHiddenV2.d.ts.map