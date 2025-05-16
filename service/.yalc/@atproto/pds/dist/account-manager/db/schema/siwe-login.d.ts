import { Selectable } from 'kysely';
export interface SIWELogin {
    did: string;
    createdAt: string;
    siweMessage: string;
}
export type SiweEntry = Selectable<SIWELogin>;
export declare const tableName = "siwe_login";
export type PartialDB = {
    [tableName]: SIWELogin;
};
//# sourceMappingURL=siwe-login.d.ts.map