export const PROXY_BASE_URL = '/api/proxy'
export const API_PREFIX = "/api/v1"

export const API_ROUTES = {
  // Health
  health: {
    status: `${API_PREFIX}/health`,
    supabase: `${API_PREFIX}/health/supabase`,
  },

  // Auth
  auth: {
    login: `${API_PREFIX}/auth/login`,
  },

  // Users
  users: {
    me: `${API_PREFIX}/users/me`,
    update: `${API_PREFIX}/users/me`,
    searchPeople: `${API_PREFIX}/users/search/people`,
    suggested: `${API_PREFIX}/users/suggested`,
    follow: (id: string) => `${API_PREFIX}/users/${id}/follow`,
    unfollow: (id: string) => `${API_PREFIX}/users/${id}/follow`,
    profile: (id: string) => `${API_PREFIX}/users/${id}`,
    profilePosts: (id: string) => `${API_PREFIX}/users/${id}/posts`,
    profileJobs: (id: string) => `${API_PREFIX}/users/${id}/jobs`,
  },

  // Trust & Tier
  trust: {
    score: `${API_PREFIX}/trust/score`,
  },
  tier: {
    me: `${API_PREFIX}/tier/me`,
  },

  // Notifications
  notifications: {
    list: `${API_PREFIX}/notifications`,
    markAsRead: (id: string) => `${API_PREFIX}/notifications/${id}/read`,
  },

  // Zero Knowledge
  zk: {
    generate: `${API_PREFIX}/zk/generate`,
    verify: `${API_PREFIX}/zk/verify`,
  },

  // Social
  social: {
    feed: `${API_PREFIX}/social/posts`,
    createPost: `${API_PREFIX}/social/posts`,
    postDetail: (id: string) => `${API_PREFIX}/social/posts/${id}`,
    reactPost: (id: string) => `${API_PREFIX}/social/posts/${id}/react`,
    boostPost: (id: string) => `${API_PREFIX}/social/posts/${id}/boost`,
  },

  // Jobs
  jobs: {
    myJobs: `${API_PREFIX}/jobs/me`,
    myApplications: `${API_PREFIX}/jobs/applications/me`,
    applicants: (id: string) => `${API_PREFIX}/jobs/${id}/applicants`,
    search: `${API_PREFIX}/jobs/search`,
    hot: `${API_PREFIX}/jobs/hot`,
    create: `${API_PREFIX}/jobs/create`,
    apply: (id: string) => `${API_PREFIX}/jobs/${id}/apply`,
    submitWork: (id: string) => `${API_PREFIX}/jobs/application/${id}/submit`,
    confirmWork: (id: string) => `${API_PREFIX}/jobs/application/${id}/confirm`,
  },

  // Chat
  chat: {
    conversations: `${API_PREFIX}/chat/conversations`,
    conversationMessages: (conversationId: string) =>
      `${API_PREFIX}/chat/conversations/${conversationId}/messages`,
    sendMessage: `${API_PREFIX}/chat/messages`,
  },

  // Wallet Reputation
  walletReputation: {
    analyze: `${API_PREFIX}/wallet-reputation/analyze`,
    latest: (address: string) => `${API_PREFIX}/wallet-reputation/${address}`,
  },
} as const

export type ApiRoutes = typeof API_ROUTES
