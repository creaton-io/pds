import { OAuthProvider, OAuthProviderOptions } from '@atproto/oauth-provider';
import { AccountManager } from '../account-manager/index';
export type AuthProviderOptions = {
    accountManager: AccountManager;
} & Pick<OAuthProviderOptions, 'issuer' | 'redis' | 'keyset' | 'dpopSecret' | 'customization' | 'trustProxy'> & Required<Pick<OAuthProviderOptions, 'safeFetch'>>;
export declare class PdsOAuthProvider extends OAuthProvider {
    constructor({ accountManager, keyset, redis, dpopSecret, issuer, customization, safeFetch, trustProxy, }: AuthProviderOptions);
    createRouter(): import("@atproto/oauth-provider").Handler<void, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>>;
}
//# sourceMappingURL=provider.d.ts.map