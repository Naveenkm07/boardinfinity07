import { JwtPayload } from './index';

/**
 * Augment Express Request to include the `user` property
 * set by the auth middleware after JWT verification.
 */
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
