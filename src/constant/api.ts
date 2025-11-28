export const PROXY_BASE_URL = '/api/proxy'
export const API_PREFIX = "/api/v1"

export const API_ROUTES = {
  // Health
  health: {
    status: `${PROXY_BASE_URL}/health`,
    supabase: `${PROXY_BASE_URL}/health/supabase`,
  },

  // Auth
  auth: {
    login: `${PROXY_BASE_URL}/auth/login`,
  },

  // Users
  users: {
    me: `${PROXY_BASE_URL}/users/me`,
    update: `${PROXY_BASE_URL}/users/me`,
    searchPeople: `${PROXY_BASE_URL}/users/search/people`,
    suggested: `${PROXY_BASE_URL}/users/suggested`,
    follow: (id: string) => `${PROXY_BASE_URL}/users/${id}/follow`,
    unfollow: (id: string) => `${PROXY_BASE_URL}/users/${id}/follow`,
    profile: (id: string) => `${PROXY_BASE_URL}/users/${id}`,
    profilePosts: (id: string) => `${PROXY_BASE_URL}/users/${id}/posts`,
    profileJobs: (id: string) => `${PROXY_BASE_URL}/users/${id}/jobs`,
  },

  // Trust & Tier
  trust: {
    score: `${PROXY_BASE_URL}/trust/score`,
  },
  tier: {
    me: `${PROXY_BASE_URL}/tier/me`,
  },

  // Notifications
  notifications: {
    list: `${PROXY_BASE_URL}/notifications`,
    markAsRead: (id: string) => `${PROXY_BASE_URL}/notifications/${id}/read`,
  },

  // Zero Knowledge
  zk: {
    generate: `${PROXY_BASE_URL}/zk/generate`,
    verify: `${PROXY_BASE_URL}/zk/verify`,
  },

  // Social
  social: {
    feed: `${PROXY_BASE_URL}/social/posts`,
    createPost: `${PROXY_BASE_URL}/social/posts`,
    postDetail: (id: string) => `${PROXY_BASE_URL}/social/posts/${id}`,
    reactPost: (id: string) => `${PROXY_BASE_URL}/social/posts/${id}/react`,
    boostPost: (id: string) => `${PROXY_BASE_URL}/social/posts/${id}/boost`,
  },

  // Jobs
  jobs: {
    myJobs: `${PROXY_BASE_URL}/jobs/me`,
    myApplications: `${PROXY_BASE_URL}/jobs/applications/me`,
    applicants: (id: string) => `${PROXY_BASE_URL}/jobs/${id}/applicants`,
    search: `${PROXY_BASE_URL}/jobs/search`,
    hot: `${PROXY_BASE_URL}/jobs/hot`,
    create: `${PROXY_BASE_URL}/jobs/create`,
    apply: (id: string) => `${PROXY_BASE_URL}/jobs/${id}/apply`,
    submitWork: (id: string) => `${PROXY_BASE_URL}/jobs/application/${id}/submit`,
    confirmWork: (id: string) => `${PROXY_BASE_URL}/jobs/application/${id}/confirm`,
  },

  // Chat
  chat: {
    conversations: `${PROXY_BASE_URL}/chat/conversations`,
    conversationMessages: (conversationId: string) =>
      `${PROXY_BASE_URL}/chat/conversations/${conversationId}/messages`,
    sendMessage: `${PROXY_BASE_URL}/chat/messages`,
  },

  // Wallet Reputation
  walletReputation: {
    analyze: `${PROXY_BASE_URL}/wallet-reputation/analyze`,
    latest: (address: string) => `${PROXY_BASE_URL}/wallet-reputation/${address}`,
  },
} as const

export type ApiRoutes = typeof API_ROUTES
