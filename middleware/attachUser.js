import * as usersRepository from '../repositories/usersRepository.js';
import { toUserDto } from '../dtos/userDto.js';

export const attachUser = async (req, res, next) => {
  try {
    const userId = req.session?.userId;
    const account = userId ? await usersRepository.findById(userId) : null;
    if (account) {
      req.user = { id: account._id.toString(), email: account.email, role: account.role };
      res.locals.currentUser = toUserDto(account);
    }
    next();
  } catch (err) {
    next(err);
  }
};
