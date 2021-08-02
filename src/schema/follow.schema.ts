import { object, string } from "yup";

export const followUserSchema = object({
  body: object({
    following: string().required(
      "Id of the person you want tto follow is required"
    ),
    followers: string(),
  }),
});
