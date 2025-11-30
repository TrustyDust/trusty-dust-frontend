/**
 * Shared API request/response contracts mirrored from trusty-dust-be-2.
 * All date fields are ISO 8601 strings in transport.
 */

import { Address } from "viem"

// =====================================================
// Enums
// =====================================================

export type ReactionType = "LIKE" | "COMMENT" | "REPOST"
export type JobStatus = "OPEN" | "COMPLETED"
export type ApplicationStatus = "APPLIED" | "SUBMITTED" | "CONFIRMED"

// =====================================================
// Auth
// =====================================================

export interface LoginRequest {
  walletAddress: Address
  signature: string
  message: string
}

export interface UserProfile {
  id: string
  walletAddress: string
  username?: string | null
  avatar?: string | null
  jobTitle?: string | null
  jobType?: string | null
  tier: string
  trustScore: number
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  jwt: string
  data: UserProfile
}

// =====================================================
// Health
// =====================================================

export interface HealthStatusResponse {
  status: string
  timestamp: string
}

export interface SupabaseHealthResponse {
  ok: boolean
  table?: string
  latencyMs?: number
  error?: string
}

// =====================================================
// Users
// =====================================================

export interface UpdateUserRequest {
  username?: string
  avatar?: string
  jobTitle?: string
  jobType?: string
}

export interface SearchPeopleQuery {
  keyword?: string
  jobTitle?: string
  jobType?: string
  cursor?: string
  limit?: number
}

export interface UserSearchItem {
  id: string
  username?: string | null
  avatar?: string | null
  tier: string
  jobTitle?: string | null
  jobType?: string | null
  trustScore: number
  isFollowing: boolean
}

export interface UserSearchResponse {
  data: UserSearchItem[]
  nextCursor?: string | null
}

export interface UserSuggestion {
  id: string
  username?: string | null
  avatar?: string | null
  jobTitle?: string | null
  jobType?: string | null
  tier: string
  trustScore: number
}

export interface SuccessResponse {
  success: boolean
}

export interface UserPublicProfileStats {
  followers: number
  following: number
  posts: number
  jobs: number
}

export interface UserPublicProfile extends UserProfile {
  stats: UserPublicProfileStats
  isMe: boolean
  isFollowing: boolean
}

export interface ProfileFeedQuery {
  cursor?: string
  limit?: number
}

export interface UserProfilePostMedia {
  id: string
  postId: string
  url: string
}

export interface ReactionCounts {
  like: number
  comment: number
  repost: number
}

export interface UserProfilePost {
  id: string
  text: string
  ipfsCid?: string | null
  createdAt: string
  media: UserProfilePostMedia[]
  reactionCounts: ReactionCounts
  viewerReaction: ReactionType | null
}

export interface PaginatedResponse<T> {
  data: T[]
  nextCursor?: string | null
}

export interface UserProfileJob {
  id: string
  title: string
  companyName?: string | null
  companyLogo?: string | null
  location?: string | null
  jobType?: string | null
  reward: number
  minTrustScore: number
  status: JobStatus
  createdAt: string
  applications: number
  isOwner: boolean
}

// =====================================================
// Social
// =====================================================

export interface ListPostsQuery {
  cursor?: string
  limit?: number
  commentPreviewLimit?: number
}

export interface CreatePostRequest {
  text: string
  ipfsCid?: string
  mediaUrls?: string[]
}

export interface SocialMedia {
  id: string
  postId: string
  url: string
}

export interface SocialAuthorPreview {
  id: string
  username?: string | null
  avatar?: string | null
  tier: string
  jobTitle?: string | null
  isFollowedByViewer: boolean
}

export interface CommentPreviewAuthor {
  id: string
  username?: string | null
  avatar?: string | null
  tier: string
}

export interface CommentPreview {
  id: string
  text?: string | null
  createdAt: string
  author: CommentPreviewAuthor
}

export interface FeedPost {
  id: string
  text: string
  ipfsCid?: string | null
  createdAt: string
  media: SocialMedia[]
  author: SocialAuthorPreview
  reactionCounts: ReactionCounts
  viewerReaction: ReactionType | null
  commentPreview: CommentPreview[]
}

export interface SocialFeedResponse {
  data: FeedPost[]
  nextCursor?: string | null
}

export interface PostWithMedia {
  id: string
  authorId: string
  text: string
  ipfsCid?: string | null
  createdAt: string
  updatedAt: string
  media: SocialMedia[]
}

export interface PostDetailAuthor extends Omit<SocialAuthorPreview, "isFollowedByViewer"> {
  isFollowedByViewer: boolean
}

export interface PostComment {
  id: string
  text?: string | null
  createdAt: string
  author: CommentPreviewAuthor
}

export interface PostDetailResponse {
  id: string
  text: string
  ipfsCid?: string | null
  createdAt: string
  media: SocialMedia[]
  author: PostDetailAuthor
  reactionCounts: ReactionCounts
  viewerReaction: ReactionType | null
  comments: PostComment[]
}

export interface PostDetailQuery {
  commentsLimit?: number
}

export interface ReactPostBody {
  type: ReactionType
  commentText?: string
}

export interface PostReactionResponse {
  id: string
  postId: string
  userId: string
  type: ReactionType
  commentText?: string | null
  createdAt: string
}

export interface BoostPostBody {
  amount: number
  note?: string
}

export interface PostBoostResponse {
  id: string
  sequence: number
  postId: string
  userId: string
  dustSpent: number
  note?: string | null
  createdAt: string
}

// =====================================================
// Notifications
// =====================================================

export interface NotificationItem {
  id: string
  userId: string
  message: string
  isRead: boolean
  readAt?: string | null
  createdAt: string
}

// =====================================================
// Jobs
// =====================================================

export interface CreateJobRequest {
  title: string
  description: string
  companyName: string
  companyLogo?: string
  location: string
  jobType: string
  requirements?: string[]
  salaryMin?: number
  salaryMax?: number
  closeAt?: string
  minTrustScore: number
  reward: number
  zkProofId?: string
}

export interface Job {
  id: string
  chainRef: number
  creatorId: string
  title: string
  description: string
  companyName: string
  companyLogo?: string | null
  location: string
  jobType: string
  requirements: string[]
  salaryMin?: number | null
  salaryMax?: number | null
  closeAt?: string | null
  minTrustScore: number
  reward: number
  status: JobStatus
  createdAt: string
  updatedAt: string
}

export interface JobEscrow {
  id: string
  jobId: string
  amount: number
  lockTxHash: string
  releaseTxHash?: string | null
  refundTxHash?: string | null
  createdAt: string
}

export interface JobApplication {
  id: string
  jobId: string
  workerId: string
  status: ApplicationStatus
  cvUrl?: string | null
  portfolioLinks: string[]
  extraMetadata?: Record<string, unknown> | null
  workSubmissionText?: string | null
  confirmationTxHash?: string | null
  createdAt: string
  updatedAt: string
}

export interface JobApplicationWithJob extends JobApplication {
  job: {
    id: string
    title: string
    companyName: string
    jobType: string
    reward: number
    status: JobStatus
  }
}

export interface JobApplicationWithWorker extends JobApplication {
  worker: {
    id: string
    username?: string | null
    walletAddress: string
    tier: string
  }
}

export interface JobWithMeta extends Job {
  applications: Array<{
    id: string
    status: ApplicationStatus
    workerId: string
  }>
  escrow?: JobEscrow | null
}

export interface JobCreatorPreview {
  id: string
  username?: string | null
  avatar?: string | null
}

export interface JobSearchItem extends Job {
  creator: JobCreatorPreview
  applications: number
}

export interface JobSearchResponse {
  data: JobSearchItem[]
  nextCursor?: string | null
}

export interface ApplyJobBody {
  zkProofId?: string
  cvUrl?: string
  portfolioLinks?: string[]
  extraMetadata?: Record<string, unknown>
}

export interface SubmitWorkBody {
  workSubmissionText: string
}

export interface ConfirmWorkBody {
  txHash?: string
  rating?: number
}

export interface MyApplicationsQuery {
  limit?: number
}

export interface SearchJobsQuery {
  keyword?: string
  jobType?: string
  jobTitle?: string
  cursor?: string
  limit?: number
}

// =====================================================
// Chat
// =====================================================

export interface ConversationParticipant {
  id: string
  userId: string
  username?: string | null
  avatar?: string | null
  joinedAt: string
}

export interface ConversationLastMessage {
  id: string
  text: string
  senderId: string
  createdAt: string
}

export interface Conversation {
  id: string
  title?: string | null
  createdAt: string
  updatedAt: string
  participants: ConversationParticipant[]
  lastMessage?: ConversationLastMessage | null
}

export interface CreateConversationRequest {
  title?: string
  participantIds: string[]
}

export interface CreateConversationResponse extends Conversation {
  ownerId: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  metadata?: Record<string, unknown> | null
  createdAt: string
}

export interface SendMessageRequest {
  conversationId: string
  content: string
  attachments?: string[]
  metadata?: Record<string, unknown>
}

// =====================================================
// Notifications
// =====================================================

export type NotificationListResponse = NotificationItem[]

// =====================================================
// Trust & Tier
// =====================================================

export interface TrustScoreResponse {
  trustScore: number
}

export interface TierHistoryEntry {
  id: string
  userId: string
  tier: string
  score: number
  createdAt: string
}

export interface TierResponse {
  tier: string
  history: TierHistoryEntry[]
}

// =====================================================
// Wallet Reputation
// =====================================================

export interface AnalyzeWalletRequest {
  address: string
  chainId: number
  userId?: string
}

export interface WalletScoreBreakdown {
  txnScore: number
  tokenScore: number
  nftScore: number
  defiScore: number
  contractScore: number
}

export interface WalletReputationResponse {
  address: string
  chainId: number
  score: number
  tier: string
  riskScore: number
  breakdown: WalletScoreBreakdown
  zkProofId: string | null
  reasoning?: string
}

// =====================================================
// Zero-Knowledge
// =====================================================

export interface GenerateProofRequest {
  score: number
  minScore: number
  userId?: string
}

export interface ZkProofResponse {
  proof: string
  publicInputs: string[]
  proofId: string
}

export interface VerifyProofRequest {
  proof: string
  publicInputs: string[]
}

export interface VerifyProofResponse {
  valid: boolean
}


