"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(server, ctx) {
    server.com.atproto.server.createSIWERegistration({
        auth: ctx.authVerifier.userServiceAuthOptional,
        handler: async ({ input }) => {
            const siwe = await ctx.accountManager.siweRegistration(input.body.ethAddress);
            return {
                encoding: 'application/json',
                body: { siweMessage: siwe },
            };
        },
    });
}
//# sourceMappingURL=createSIWERegistration.js.map