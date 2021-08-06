import { object, string } from "yup";

/**
 * @name followUserSchema
 * @description
 * Schema for the followUser API
 * @type {Object}
 * @property {string} following - The user id of the user to follow
 * @property {string} followers - The user id of the user to follow
 */
export const followUserSchema = object({
  body: object({
    following: string().required(
      "Id of the person you want tto follow is required"
    ),
    followers: string(),
  }),
});
