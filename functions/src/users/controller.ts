import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { handleError } from '../errors/handle-errors';
// import * as nodemailer from 'nodemailer';

export async function register(req: Request, res: Response) {
  try {
    const { displayName, password, email, re_password } = req.body;

    if (!displayName || !password || !email || !re_password) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    if (password !== re_password) {
      return res.status(400).send({ message: 'Passwords not match.' });
    }

    const { uid } = await admin.auth().createUser({
      displayName,
      password,
      email,
    });
    await admin.auth().setCustomUserClaims(uid, { role: 'user' });
    const accessToken = await admin.auth().createCustomToken(uid);

    await admin.firestore().collection('users').add({
      email: email,
      uid: uid,
      username: displayName,
      role: 'user',
    });

    return res.status(201).send({ uid, accessToken });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { displayName, password, email, role } = req.body;

    if (!displayName || !password || !email || !role) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    const { uid } = await admin.auth().createUser({
      displayName,
      password,
      email,
    });
    await admin.auth().setCustomUserClaims(uid, { role });

    return res.status(201).send({ uid });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function all(req: Request, res: Response) {
  try {
    const listUsers = await admin.auth().listUsers();
    const users = listUsers.users.map((user) => {
      const customClaims = (user.customClaims || { role: '' }) as {
        role?: string;
      };
      const role = customClaims.role ? customClaims.role : '';
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role,
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime,
      };
    });

    return res.status(200).send({ users });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function get(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await admin.auth().getUser(id);
    return res.status(200).send({ user });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function patch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { displayName, password, email, role } = req.body;

    if (!id || !displayName || !password || !email || !role) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    const user = await admin
      .auth()
      .updateUser(id, { displayName, password, email });
    await admin.auth().setCustomUserClaims(id, { role });
    return res.status(204).send({ user });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await admin.auth().deleteUser(id);
    return res.status(204).send({});
  } catch (err) {
    return handleError(res, err);
  }
}
