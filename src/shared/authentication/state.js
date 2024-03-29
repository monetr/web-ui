import { Record } from "immutable";
import User from "data/User";

export default class AuthenticationState extends Record({
  isAuthenticated: false,
  isActive: false,
  token: null,
  user: new User(),
}) {

}
