"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountManager = exports.formatAccountStatus = exports.AccountStatus = void 0;
const common_1 = require("@atproto/common");
const xrpc_server_1 = require("@atproto/xrpc-server");
const auth_verifier_1 = require("../auth-verifier");
const db_1 = require("../db");
const db_2 = require("./db");
const account = __importStar(require("./helpers/account"));
const account_1 = require("./helpers/account");
const auth = __importStar(require("./helpers/auth"));
const authRequest = __importStar(require("./helpers/authorization-request"));
const device = __importStar(require("./helpers/device"));
const deviceAccount = __importStar(require("./helpers/device-account"));
const emailToken = __importStar(require("./helpers/email-token"));
const invite = __importStar(require("./helpers/invite"));
const password = __importStar(require("./helpers/password"));
const repo = __importStar(require("./helpers/repo"));
const scrypt = __importStar(require("./helpers/scrypt"));
const token = __importStar(require("./helpers/token"));
const usedRefreshToken = __importStar(require("./helpers/used-refresh-token"));
var account_2 = require("./helpers/account");
Object.defineProperty(exports, "AccountStatus", { enumerable: true, get: function () { return account_2.AccountStatus; } });
Object.defineProperty(exports, "formatAccountStatus", { enumerable: true, get: function () { return account_2.formatAccountStatus; } });
class AccountManager {
    constructor(actorStore, imageUrlBuilder, backgroundQueue, dbLocation, jwtKey, serviceDid, disableWalAutoCheckpoint = false) {
        Object.defineProperty(this, "actorStore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: actorStore
        });
        Object.defineProperty(this, "imageUrlBuilder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: imageUrlBuilder
        });
        Object.defineProperty(this, "backgroundQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: backgroundQueue
        });
        Object.defineProperty(this, "jwtKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: jwtKey
        });
        Object.defineProperty(this, "serviceDid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: serviceDid
        });
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.db = (0, db_2.getDb)(dbLocation, disableWalAutoCheckpoint);
    }
    async migrateOrThrow() {
        await this.db.ensureWal();
        await (0, db_2.getMigrator)(this.db).migrateToLatestOrThrow();
    }
    close() {
        this.db.close();
    }
    // Account
    // ----------
    async getAccount(handleOrDid, flags) {
        return account.getAccount(this.db, handleOrDid, flags);
    }
    async getAccounts(dids, flags) {
        return account.getAccounts(this.db, dids, flags);
    }
    async getAccountByEmail(email, flags) {
        return account.getAccountByEmail(this.db, email, flags);
    }
    async isAccountActivated(did) {
        const account = await this.getAccount(did, { includeDeactivated: true });
        if (!account)
            return false;
        return !account.deactivatedAt;
    }
    async getDidForActor(handleOrDid, flags) {
        const got = await this.getAccount(handleOrDid, flags);
        return got?.did ?? null;
    }
    async getAccountStatus(handleOrDid) {
        const got = await this.getAccount(handleOrDid, {
            includeDeactivated: true,
            includeTakenDown: true,
        });
        const res = account.formatAccountStatus(got);
        return res.active ? account_1.AccountStatus.Active : res.status;
    }
    async createAccount(opts) {
        const { did, handle, email, password, repoCid, repoRev, inviteCode, deactivated, } = opts;
        const passwordScrypt = password
            ? await scrypt.genSaltAndHash(password)
            : undefined;
        const { accessJwt, refreshJwt } = await auth.createTokens({
            did,
            jwtKey: this.jwtKey,
            serviceDid: this.serviceDid,
            scope: auth_verifier_1.AuthScope.Access,
        });
        const refreshPayload = auth.decodeRefreshToken(refreshJwt);
        const now = new Date().toISOString();
        await this.db.transaction(async (dbTxn) => {
            if (inviteCode) {
                await invite.ensureInviteIsAvailable(dbTxn, inviteCode);
            }
            await Promise.all([
                account.registerActor(dbTxn, { did, handle, deactivated }),
                email && passwordScrypt
                    ? account.registerAccount(dbTxn, { did, email, passwordScrypt })
                    : Promise.resolve(),
                invite.recordInviteUse(dbTxn, {
                    did,
                    inviteCode,
                    now,
                }),
                auth.storeRefreshToken(dbTxn, refreshPayload, null),
                repo.updateRoot(dbTxn, did, repoCid, repoRev),
            ]);
        });
        return { accessJwt, refreshJwt };
    }
    // @NOTE should always be paired with a sequenceHandle().
    // the token output from this method should be passed to sequenceHandle().
    async updateHandle(did, handle) {
        return account.updateHandle(this.db, did, handle);
    }
    async deleteAccount(did) {
        return account.deleteAccount(this.db, did);
    }
    async takedownAccount(did, takedown) {
        await this.db.transaction(async (dbTxn) => Promise.all([
            account.updateAccountTakedownStatus(dbTxn, did, takedown),
            auth.revokeRefreshTokensByDid(dbTxn, did),
            token.removeByDidQB(dbTxn, did).execute(),
        ]));
    }
    async getAccountAdminStatus(did) {
        return account.getAccountAdminStatus(this.db, did);
    }
    async updateRepoRoot(did, cid, rev) {
        return repo.updateRoot(this.db, did, cid, rev);
    }
    async deactivateAccount(did, deleteAfter) {
        return account.deactivateAccount(this.db, did, deleteAfter);
    }
    async activateAccount(did) {
        return account.activateAccount(this.db, did);
    }
    // Auth
    // ----------
    async createSession(did, appPassword, isSoftDeleted = false) {
        const { accessJwt, refreshJwt } = await auth.createTokens({
            did,
            jwtKey: this.jwtKey,
            serviceDid: this.serviceDid,
            scope: auth.formatScope(appPassword, isSoftDeleted),
        });
        // For soft deleted accounts don't store refresh token so that it can't be rotated.
        if (!isSoftDeleted) {
            const refreshPayload = auth.decodeRefreshToken(refreshJwt);
            await auth.storeRefreshToken(this.db, refreshPayload, appPassword);
        }
        return { accessJwt, refreshJwt };
    }
    async rotateRefreshToken(id) {
        const token = await auth.getRefreshToken(this.db, id);
        if (!token)
            return null;
        const now = new Date();
        // take the chance to tidy all of a user's expired tokens
        // does not need to be transactional since this is just best-effort
        await auth.deleteExpiredRefreshTokens(this.db, token.did, now.toISOString());
        // Shorten the refresh token lifespan down from its
        // original expiration time to its revocation grace period.
        const prevExpiresAt = new Date(token.expiresAt);
        const REFRESH_GRACE_MS = 2 * common_1.HOUR;
        const graceExpiresAt = new Date(now.getTime() + REFRESH_GRACE_MS);
        const expiresAt = graceExpiresAt < prevExpiresAt ? graceExpiresAt : prevExpiresAt;
        if (expiresAt <= now) {
            return null;
        }
        // Determine the next refresh token id: upon refresh token
        // reuse you always receive a refresh token with the same id.
        const nextId = token.nextId ?? auth.getRefreshTokenId();
        const { accessJwt, refreshJwt } = await auth.createTokens({
            did: token.did,
            jwtKey: this.jwtKey,
            serviceDid: this.serviceDid,
            scope: auth.formatScope(token.appPassword),
            jti: nextId,
        });
        const refreshPayload = auth.decodeRefreshToken(refreshJwt);
        try {
            await this.db.transaction((dbTxn) => Promise.all([
                auth.addRefreshGracePeriod(dbTxn, {
                    id,
                    expiresAt: expiresAt.toISOString(),
                    nextId,
                }),
                auth.storeRefreshToken(dbTxn, refreshPayload, token.appPassword),
            ]));
        }
        catch (err) {
            if (err instanceof auth.ConcurrentRefreshError) {
                return this.rotateRefreshToken(id);
            }
            throw err;
        }
        return { accessJwt, refreshJwt };
    }
    async revokeRefreshToken(id) {
        return auth.revokeRefreshToken(this.db, id);
    }
    // Login
    // ----------
    async login({ identifier, password, }) {
        const start = Date.now();
        try {
            const identifierNormalized = identifier.toLowerCase();
            const user = identifierNormalized.includes('@')
                ? await this.getAccountByEmail(identifierNormalized, {
                    includeDeactivated: true,
                    includeTakenDown: true,
                })
                : await this.getAccount(identifierNormalized, {
                    includeDeactivated: true,
                    includeTakenDown: true,
                });
            if (!user) {
                throw new xrpc_server_1.AuthRequiredError('Invalid identifier or password');
            }
            const isSoftDeleted = (0, db_1.softDeleted)(user);
            let appPassword = null;
            const validAccountPass = await this.verifyAccountPassword(user.did, password);
            if (!validAccountPass) {
                // takendown/suspended accounts cannot login with app password
                if (isSoftDeleted) {
                    throw new xrpc_server_1.AuthRequiredError('Invalid identifier or password');
                }
                appPassword = await this.verifyAppPassword(user.did, password);
                if (appPassword === null) {
                    throw new xrpc_server_1.AuthRequiredError('Invalid identifier or password');
                }
            }
            return { user, appPassword, isSoftDeleted };
        }
        finally {
            // Mitigate timing attacks
            await (0, common_1.wait)(350 - (Date.now() - start));
        }
    }
    // Passwords
    // ----------
    async createAppPassword(did, name, privileged) {
        return password.createAppPassword(this.db, did, name, privileged);
    }
    async listAppPasswords(did) {
        return password.listAppPasswords(this.db, did);
    }
    async verifyAccountPassword(did, passwordStr) {
        return password.verifyAccountPassword(this.db, did, passwordStr);
    }
    async verifyAppPassword(did, passwordStr) {
        return password.verifyAppPassword(this.db, did, passwordStr);
    }
    async revokeAppPassword(did, name) {
        await this.db.transaction(async (dbTxn) => Promise.all([
            password.deleteAppPassword(dbTxn, did, name),
            auth.revokeAppPasswordRefreshToken(dbTxn, did, name),
        ]));
    }
    // Invites
    // ----------
    async ensureInviteIsAvailable(code) {
        return invite.ensureInviteIsAvailable(this.db, code);
    }
    async createInviteCodes(toCreate, useCount) {
        return invite.createInviteCodes(this.db, toCreate, useCount);
    }
    async createAccountInviteCodes(forAccount, codes, expectedTotal, disabled) {
        return invite.createAccountInviteCodes(this.db, forAccount, codes, expectedTotal, disabled);
    }
    async getAccountInvitesCodes(did) {
        const inviteCodes = await invite.getAccountsInviteCodes(this.db, [did]);
        return inviteCodes.get(did) ?? [];
    }
    async getAccountsInvitesCodes(dids) {
        return invite.getAccountsInviteCodes(this.db, dids);
    }
    async getInvitedByForAccounts(dids) {
        return invite.getInvitedByForAccounts(this.db, dids);
    }
    async getInviteCodesUses(codes) {
        return invite.getInviteCodesUses(this.db, codes);
    }
    async setAccountInvitesDisabled(did, disabled) {
        return invite.setAccountInvitesDisabled(this.db, did, disabled);
    }
    async disableInviteCodes(opts) {
        return invite.disableInviteCodes(this.db, opts);
    }
    // Email Tokens
    // ----------
    async createEmailToken(did, purpose) {
        return emailToken.createEmailToken(this.db, did, purpose);
    }
    async assertValidEmailToken(did, purpose, token) {
        return emailToken.assertValidToken(this.db, did, purpose, token);
    }
    async assertValidEmailTokenAndCleanup(did, purpose, token) {
        await emailToken.assertValidToken(this.db, did, purpose, token);
        await emailToken.deleteEmailToken(this.db, did, purpose);
    }
    async confirmEmail(opts) {
        const { did, token } = opts;
        await emailToken.assertValidToken(this.db, did, 'confirm_email', token);
        const now = new Date().toISOString();
        await this.db.transaction((dbTxn) => Promise.all([
            emailToken.deleteEmailToken(dbTxn, did, 'confirm_email'),
            account.setEmailConfirmedAt(dbTxn, did, now),
        ]));
    }
    async updateEmail(opts) {
        const { did, email } = opts;
        await this.db.transaction((dbTxn) => Promise.all([
            account.updateEmail(dbTxn, did, email),
            emailToken.deleteAllEmailTokens(dbTxn, did),
        ]));
    }
    async resetPassword(opts) {
        const did = await emailToken.assertValidTokenAndFindDid(this.db, 'reset_password', opts.token);
        await this.updateAccountPassword({ did, password: opts.password });
    }
    async updateAccountPassword(opts) {
        const { did } = opts;
        const passwordScrypt = await scrypt.genSaltAndHash(opts.password);
        await this.db.transaction(async (dbTxn) => Promise.all([
            password.updateUserPassword(dbTxn, { did, passwordScrypt }),
            emailToken.deleteEmailToken(dbTxn, did, 'reset_password'),
            auth.revokeRefreshTokensByDid(dbTxn, did),
        ]));
    }
    // AccountStore
    async buildAccount(row) {
        const account = deviceAccount.toAccount(row, this.serviceDid);
        if (!account.name || !account.picture) {
            const did = account.sub;
            const profile = await this.actorStore.read(did, async (store) => {
                return store.record.getProfileRecord();
            });
            if (profile) {
                const { avatar, displayName } = profile;
                account.name || (account.name = displayName);
                account.picture || (account.picture = avatar
                    ? this.imageUrlBuilder.build('avatar', did, avatar.ref.toString())
                    : undefined);
            }
        }
        return account;
    }
    async authenticateAccount({ username: identifier, password, remember = false }, deviceId) {
        try {
            const { user, appPassword } = await this.login({ identifier, password });
            if (appPassword) {
                throw new xrpc_server_1.AuthRequiredError('App passwords are not allowed');
            }
            await this.db.executeWithRetry(deviceAccount.createOrUpdateQB(this.db, deviceId, user.did, remember));
            return await this.getDeviceAccount(deviceId, user.did);
        }
        catch (err) {
            if (err instanceof xrpc_server_1.AuthRequiredError)
                return null;
            throw err;
        }
    }
    async addAuthorizedClient(deviceId, sub, clientId) {
        await this.db.transaction(async (dbTxn) => {
            const row = await deviceAccount
                .readQB(dbTxn, deviceId, sub)
                .executeTakeFirstOrThrow();
            const { authorizedClients } = deviceAccount.toDeviceAccountInfo(row);
            if (!authorizedClients.includes(clientId)) {
                await deviceAccount
                    .updateQB(dbTxn, deviceId, sub, {
                    authorizedClients: [...authorizedClients, clientId],
                })
                    .execute();
            }
        });
    }
    async getDeviceAccount(deviceId, sub) {
        const row = await deviceAccount
            .getAccountInfoQB(this.db, deviceId, sub)
            .executeTakeFirst();
        if (!row)
            return null;
        return {
            account: await this.buildAccount(row),
            info: deviceAccount.toDeviceAccountInfo(row),
        };
    }
    async listDeviceAccounts(deviceId) {
        const rows = await deviceAccount
            .listRememberedQB(this.db, deviceId)
            .execute();
        return Promise.all(rows.map(async (row) => ({
            account: await this.buildAccount(row),
            info: deviceAccount.toDeviceAccountInfo(row),
        })));
    }
    async removeDeviceAccount(deviceId, sub) {
        await this.db.executeWithRetry(deviceAccount.removeQB(this.db, deviceId, sub));
    }
    // RequestStore
    async createRequest(id, data) {
        await this.db.executeWithRetry(authRequest.createQB(this.db, id, data));
    }
    async readRequest(id) {
        try {
            const row = await authRequest.readQB(this.db, id).executeTakeFirst();
            if (!row)
                return null;
            return authRequest.rowToRequestData(row);
        }
        finally {
            // Take the opportunity to clean up expired requests. Do this after we got
            // the current (potentially expired) request data to allow the provider to
            // handle expired requests.
            this.backgroundQueue.add(async () => {
                await this.db.executeWithRetry(authRequest.removeOldExpiredQB(this.db));
            });
        }
    }
    async updateRequest(id, data) {
        await this.db.executeWithRetry(authRequest.updateQB(this.db, id, data));
    }
    async deleteRequest(id) {
        await this.db.executeWithRetry(authRequest.removeByIdQB(this.db, id));
    }
    async findRequestByCode(code) {
        const row = await authRequest.findByCodeQB(this.db, code).executeTakeFirst();
        return row ? authRequest.rowToFoundRequestResult(row) : null;
    }
    // DeviceStore
    async createDevice(deviceId, data) {
        await this.db.executeWithRetry(device.createQB(this.db, deviceId, data));
    }
    async readDevice(deviceId) {
        const row = await device.readQB(this.db, deviceId).executeTakeFirst();
        return row ? device.rowToDeviceData(row) : null;
    }
    async updateDevice(deviceId, data) {
        await this.db.executeWithRetry(device.updateQB(this.db, deviceId, data));
    }
    async deleteDevice(deviceId) {
        // Will cascade to device_account (device_account_device_id_fk)
        await this.db.executeWithRetry(device.removeQB(this.db, deviceId));
    }
    // TokenStore
    async createToken(id, data, refreshToken) {
        await this.db.transaction(async (dbTxn) => {
            if (refreshToken) {
                const { count } = await usedRefreshToken
                    .countQB(dbTxn, refreshToken)
                    .executeTakeFirstOrThrow();
                if (count > 0) {
                    throw new Error('Refresh token already in use');
                }
            }
            return token.createQB(dbTxn, id, data, refreshToken).execute();
        });
    }
    async readToken(tokenId) {
        const row = await token.findByQB(this.db, { tokenId }).executeTakeFirst();
        return row ? token.toTokenInfo(row, this.serviceDid) : null;
    }
    async deleteToken(tokenId) {
        // Will cascade to used_refresh_token (used_refresh_token_fk)
        await this.db.executeWithRetry(token.removeQB(this.db, tokenId));
    }
    async rotateToken(tokenId, newTokenId, newRefreshToken, newData) {
        const err = await this.db.transaction(async (dbTxn) => {
            const { id, currentRefreshToken } = await token
                .forRotateQB(dbTxn, tokenId)
                .executeTakeFirstOrThrow();
            if (currentRefreshToken) {
                await usedRefreshToken
                    .insertQB(dbTxn, id, currentRefreshToken)
                    .execute();
            }
            const { count } = await usedRefreshToken
                .countQB(dbTxn, newRefreshToken)
                .executeTakeFirstOrThrow();
            if (count > 0) {
                // Do NOT throw (we don't want the transaction to be rolled back)
                return new Error('New refresh token already in use');
            }
            await token
                .rotateQB(dbTxn, id, newTokenId, newRefreshToken, newData)
                .execute();
        });
        if (err)
            throw err;
    }
    async findTokenByRefreshToken(refreshToken) {
        const used = await usedRefreshToken
            .findByTokenQB(this.db, refreshToken)
            .executeTakeFirst();
        const search = used
            ? { id: used.tokenId }
            : { currentRefreshToken: refreshToken };
        const row = await token.findByQB(this.db, search).executeTakeFirst();
        return row ? token.toTokenInfo(row, this.serviceDid) : null;
    }
    async findTokenByCode(code) {
        const row = await token.findByQB(this.db, { code }).executeTakeFirst();
        return row ? token.toTokenInfo(row, this.serviceDid) : null;
    }
}
exports.AccountManager = AccountManager;
//# sourceMappingURL=index.js.map