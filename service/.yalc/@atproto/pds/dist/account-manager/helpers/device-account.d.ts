import { Selectable } from 'kysely';
import { Account, DeviceAccountInfo, DeviceId, OAuthClientId } from '@atproto/oauth-provider';
import { AccountDb } from '../db';
import { DeviceAccount } from '../db/schema/device-account';
import { ActorAccount } from './account';
export type SelectableDeviceAccount = Pick<Selectable<DeviceAccount>, 'authenticatedAt' | 'authorizedClients' | 'remember'>;
export type InsertableField = {
    authenticatedAt: Date;
    authorizedClients: OAuthClientId[];
    remember: boolean;
};
export declare function toDeviceAccountInfo(row: SelectableDeviceAccount): DeviceAccountInfo;
export declare function toAccount(row: Selectable<ActorAccount>, audience: string): Account;
export declare const readQB: (db: AccountDb, deviceId: DeviceId, did: string) => import("kysely/dist/cjs/parser/select-parser").QueryBuilderWithSelection<import("kysely/dist/cjs/parser/table-parser").From<import("../db").DatabaseSchema, import("kysely").TableExpression<import("../db").DatabaseSchema, "account" | "token" | "actor" | "app_password" | "refresh_token" | "repo_root" | "email_token" | "siwe_login" | "siwe_registration" | "authorization_request" | "device" | "used_refresh_token" | "account_device" | "authorized_client" | keyof import("../db/schema/invite-code").PartialDB>>, any, {}, import("kysely").SelectExpression<import("kysely/dist/cjs/parser/table-parser").From<import("../db").DatabaseSchema, import("kysely").TableExpression<import("../db").DatabaseSchema, "account" | "token" | "actor" | "app_password" | "refresh_token" | "repo_root" | "email_token" | "siwe_login" | "siwe_registration" | "authorization_request" | "device" | "used_refresh_token" | "account_device" | "authorized_client" | keyof import("../db/schema/invite-code").PartialDB>>, any>>;
export declare const updateQB: (db: AccountDb, deviceId: DeviceId, did: string, entry: {
    authenticatedAt?: Date;
    authorizedClients?: OAuthClientId[];
    remember?: boolean;
}) => import("kysely").UpdateQueryBuilder<import("kysely/dist/cjs/parser/table-parser").From<import("../db").DatabaseSchema, import("kysely/dist/cjs/parser/table-parser").TableReference<import("../db").DatabaseSchema>>, any, any, import("kysely").UpdateResult>;
export declare const createOrUpdateQB: (db: AccountDb, deviceId: DeviceId, did: string, remember: boolean) => import("kysely").InsertQueryBuilder<import("../db").DatabaseSchema, "token" | "account" | "actor" | "app_password" | "invite_code" | "invite_code_use" | "refresh_token" | "repo_root" | "email_token" | "siwe_login" | "siwe_registration" | "authorization_request" | "device" | "used_refresh_token" | "account_device" | "authorized_client", import("kysely").Selection<import("../db").DatabaseSchema, "token" | "account" | "actor" | "app_password" | "invite_code" | "invite_code_use" | "refresh_token" | "repo_root" | "email_token" | "siwe_login" | "siwe_registration" | "authorization_request" | "device" | "used_refresh_token" | "account_device" | "authorized_client", import("kysely").SelectExpression<import("../db").DatabaseSchema, "token" | "account" | "actor" | "app_password" | "invite_code" | "invite_code_use" | "refresh_token" | "repo_root" | "email_token" | "siwe_login" | "siwe_registration" | "authorization_request" | "device" | "used_refresh_token" | "account_device" | "authorized_client">>>;
export declare const getAccountInfoQB: (db: AccountDb, deviceId: DeviceId, did: string) => any;
export declare const listRememberedQB: (db: AccountDb, deviceId: DeviceId) => any;
export declare const removeQB: (db: AccountDb, deviceId: DeviceId, did: string) => import("kysely").DeleteQueryBuilder<import("kysely/dist/cjs/parser/table-parser").From<import("../db").DatabaseSchema, import("kysely/dist/cjs/parser/table-parser").TableReference<import("../db").DatabaseSchema>>, any, import("kysely").DeleteResult>;
//# sourceMappingURL=device-account.d.ts.map