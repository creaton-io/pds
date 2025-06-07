/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap } from '@atproto/xrpc';
import { type ValidationResult } from '@atproto/lexicon';
import { type $Typed } from '../../../../util';
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
export interface CallOptions {
    signal?: AbortSignal;
    headers?: HeadersMap;
}
export interface Response {
    success: boolean;
    headers: HeadersMap;
    data: OutputSchema;
}
export declare function toKnownErr(e: any): any;
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