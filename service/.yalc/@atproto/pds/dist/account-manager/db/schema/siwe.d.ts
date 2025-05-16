import { Selectable } from 'kysely';
export interface SIWE {
    did: string;
    createdAt: string;
    siweMessage: string;
}
export type SiweEntry = Selectable<SIWE>;
export declare const tableName = "siwe";
export type PartialDB = {
    [tableName]: SIWE;
};
//# sourceMappingURL=siwe.d.ts.map