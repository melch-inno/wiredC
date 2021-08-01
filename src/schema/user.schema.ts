import { object, string, ref } from "yup";

export const createUserSchema = object({
  body: object({
    name: string().required("Name is required"),
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "Passwords must match"
    ),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
    dob: string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format")
      .required("Date of Birth is required"),
    address: object({
      street: string().required("Street is required"),
      city: string().required("City is required"),
      state: string(),
      zip: string()
    })
  }),
});

export const updateUserSchema = object({
  body: object({
    name: string(),
    password: string()
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "Passwords must match"
    ),
    dob: string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"),
    address: object({
      street: string(),
      city: string(),
      state: string(),
      zip: string()
    })
  }),
});

export const createUserSessionSchema = object({
  body: object({
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),

    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});
