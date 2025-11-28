export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  dashboard: "/",
  jobs: "/jobs",
  jobsAdd: "/jobs/add",
  verify: "/verify",
  chat: "/chat",
  profile: "/profile",
  profileEdit: "/profile/edit",
  post: "/post",
  postAdd: "/post/add",
} as const

export type RouteKey = keyof typeof ROUTES
