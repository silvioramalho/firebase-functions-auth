import { Request, Response } from "express";
import { Roles } from './types';

export function hasRole(roles: Roles) {
    return (req: Request, res: Response, next: Function) => {
        const { role, email } = res.locals

        if (email === 'seuemail@seuemail.com')
            return next();

        if (!role)
            return res.status(403).send();

        if (roles.includes(role)) {
            return next();
        } else {
            return res.status(403).send();
        }
    }
}

export function isAuthorized(opts: { hasRole: Roles, allowSameUser?: boolean }) {
    return (req: Request, res: Response, next: Function) => {
        const { role, email, uid } = res.locals
        const { id } = req.params

        if (email === 'seuemail@seuemail.com')
            return next();

        if (opts.allowSameUser && id && uid === id)
            return next();

        if (!role)
            return res.status(403).send();

        if (opts.hasRole.includes(role))
            return next();

        return res.status(403).send();
    }
}
