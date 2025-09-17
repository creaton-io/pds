"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siweRegistration = exports.siweLogin = exports.verifySIWERegistration = exports.verifySIWELogin = exports.publicClient = void 0;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const siwe_1 = require("viem/siwe");
const xrpc_server_1 = require("@atproto/xrpc-server");
exports.publicClient = (0, viem_1.createPublicClient)({
    chain: chains_1.base,
    transport: (0, viem_1.http)(),
});
//const signature = await walletClient.signMessage({ account, message })
const verifySIWELogin = async (db, did, siweSignature) => {
    const foundUser = await db.db
        .selectFrom('account')
        .selectAll()
        .where('did', '=', did)
        .executeTakeFirst();
    if (foundUser) {
        const address = foundUser.ethAddress;
        //TODO get DID from ethAddress + handle (as an ethAddress could have multiple handles)
        //I guess the DID could be gotten from the handle alone
        const found = await db.db
            .selectFrom('siwe_login')
            .selectAll()
            .where('did', '=', did)
            .executeTakeFirst();
        if (found) {
            const { siweMessage } = found;
            const verified = await exports.publicClient.verifySiweMessage({
                address: address,
                message: siweMessage,
                signature: siweSignature,
            });
            if (verified) {
                // Delete the SIWE message
                await db.db.deleteFrom('siwe_login').where('did', '=', did).execute();
                return true;
            }
        }
    }
    return false;
};
exports.verifySIWELogin = verifySIWELogin;
const verifySIWERegistration = async (db, ethAddress, siweSignature) => {
    const found = await db.db
        .selectFrom('siwe_registration')
        .selectAll()
        .where('ethAddress', '=', ethAddress)
        .executeTakeFirst();
    if (found) {
        const { siweMessage } = found;
        const verified = await exports.publicClient.verifySiweMessage({
            address: ethAddress,
            message: siweMessage,
            signature: siweSignature,
        });
        if (verified) {
            // Delete the SIWE message
            await db.db
                .deleteFrom('siwe_registration')
                .where('ethAddress', '=', ethAddress)
                .execute();
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
exports.verifySIWERegistration = verifySIWERegistration;
const siweLogin = async (db, did) => {
    const nonce = (0, siwe_1.generateSiweNonce)();
    const createdAt = new Date().toISOString();
    let siweMessage = '';
    const found = await db.db
        .selectFrom('account')
        .selectAll()
        .where('did', '=', did)
        .executeTakeFirst();
    if (found) {
        const address = found?.ethAddress;
        siweMessage = (0, siwe_1.createSiweMessage)({
            address: address, // get address based on did
            chainId: 8453,
            domain: 'creaton.social', // TODO: get domain from env
            nonce: nonce,
            uri: 'https://creaton.social',
            version: '1',
            statement: 'Log in to Creaton Account',
        });
        // Check if an entry already exists for this DID
        const existing = await db.db
            .selectFrom('siwe_login')
            .where('did', '=', did)
            .selectAll()
            .executeTakeFirst();
        if (existing) {
            // Update the existing entry
            await db.db
                .updateTable('siwe_login')
                .set({ siweMessage, createdAt })
                .where('did', '=', did)
                .execute();
        }
        else {
            // Insert a new entry
            await db.db
                .insertInto('siwe_login')
                .values({ did, createdAt, siweMessage })
                .execute();
        }
    }
    else {
        throw new xrpc_server_1.InvalidRequestError('could not find account');
    }
    return siweMessage;
};
exports.siweLogin = siweLogin;
const siweRegistration = async (db, ethAddress) => {
    const nonce = (0, siwe_1.generateSiweNonce)();
    const createdAt = new Date().toISOString();
    const siweMessage = (0, siwe_1.createSiweMessage)({
        address: ethAddress,
        chainId: 8453,
        domain: 'creaton.social', // TODO: get domain from env
        nonce: nonce,
        uri: 'https://creaton.social',
        version: '1',
        statement: 'Register Creaton Account',
    });
    // Check if an entry already exists for this ethAddress
    const existing = await db.db
        .selectFrom('siwe_registration')
        .where('ethAddress', '=', ethAddress)
        .selectAll()
        .executeTakeFirst();
    if (existing) {
        // Update the existing entry
        await db.db
            .updateTable('siwe_registration')
            .set({ siweMessage, createdAt })
            .where('ethAddress', '=', ethAddress)
            .execute();
    }
    else {
        // Insert a new entry
        await db.db
            .insertInto('siwe_registration')
            .values({ ethAddress, createdAt, siweMessage })
            .execute();
    }
    return siweMessage;
};
exports.siweRegistration = siweRegistration;
// export const verifySIWE = async (db: AccountDb, nonce: string, did: string): Promise<boolean> => {
//   const result = await db.db
//     .updateTable('siwe_nonce')
//     .set({ used: true })
//     .where('nonce', '=', nonce)
//     .where('did', '=', did)
//     .where('used', '=', false)
//     .executeTakeFirst()
//   return result.numUpdatedRows === 1n
// }
// export const cleanupSIWEs = async (db: AccountDb): Promise<void> => {
//   const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
//   await db.db
//     .deleteFrom('siwe_nonce')
//     .where('createdAt', '<', oneHourAgo)
//     .execute()
// }
// export const getSIWEForUser = async (db: AccountDb, identifier: string): Promise<string> => {
//   const user = await db.db
//     .selectFrom('account')
//     .where('did', '=', identifier)
//     .orWhere('email', '=', identifier.toLowerCase())
//     .selectAll()
//     .executeTakeFirst()
//   if (!user) {
//     throw new InvalidRequestError('User not found')
//   }
//return createSIWE(db, user.did)
//}
//# sourceMappingURL=siwe.js.map