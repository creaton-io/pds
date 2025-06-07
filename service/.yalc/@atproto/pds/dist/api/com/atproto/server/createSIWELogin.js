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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const ident = __importStar(require("@atproto/syntax"));
const xrpc_server_1 = require("@atproto/xrpc-server");
function default_1(server, ctx) {
    server.com.atproto.server.createSIWELogin({
        handler: async ({ input }) => {
            let handle;
            try {
                handle = ident.normalizeAndEnsureValidHandle(input.body.identifier);
            }
            catch (err) {
                if (err instanceof ident.InvalidHandleError) {
                    throw new xrpc_server_1.InvalidRequestError(err.message, 'InvalidHandle');
                }
                else {
                    throw err;
                }
            }
            let did;
            const user = await ctx.accountManager.getAccount(handle);
            if (user) {
                did = user.did;
            }
            else {
                const supportedHandle = ctx.cfg.identity.serviceHandleDomains.some((host) => {
                    console.log('HOST:', host);
                    return handle.endsWith(host) || handle === host.slice(1);
                });
                console.log('SUPPORTED HANDLE:', supportedHandle);
                // this should be in our DB & we couldn't find it, so fail
                if (supportedHandle) {
                    throw new xrpc_server_1.InvalidRequestError('Unable to resolve handle');
                }
            }
            if (!did) {
                did = await ctx.idResolver.handle.resolve(handle);
            }
            if (!did) {
                throw new xrpc_server_1.InvalidRequestError('Unable to resolve handle');
            }
            console.log('DID:', did);
            if (did) {
                const siwe = await ctx.accountManager.siweLogin(did);
                return {
                    encoding: 'application/json',
                    body: { siweMessage: siwe },
                };
            }
            else
                throw new xrpc_server_1.InvalidRequestError('Unable to resolve handle');
        },
    });
}
//# sourceMappingURL=createSIWELogin.js.map