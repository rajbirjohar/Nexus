declare interface Review {
  authorId?: string
  author?: string
  reviewId?: string
  review: string
  professor: string
  course?: string
  courseId?: string
  taken: string
  difficulty: number
  anonymous: boolean
  timestamp?: Date
}

declare interface Opportunity {
  opId?: string
  authorId?: string
  author?: string
  email?: string
  name?: string
  details?: string
  endDate?: Date | string
  tags?: Array
}

declare interface Organization {
  orgId?: string
  creatorId?: string
  creatorFirstName?: string
  creatorLastName?: string
  email?: string
  name?: string
  tagline?: string
  details?: string
  image?: string
  imagePublicId?: string
  site?: string
  instagram?: string
  facebook?: string
  twitter?: string
  slack?: string
  discord?: string
}

declare interface OrgEvent {
  eventId?: string | string[]
  orgId?: string
  org?: string
  name?: string
  details?: string
  startDate?: Date | string
  endDate?: Date | string
  tags?: Array
  image?: string
  imagePublicId?: string
  commentlock?: boolean
  createdAt?: Date
}

declare interface EventComment {
  commentId?: string
  eventId: string
  authorId: string
  orgId?: string
  author?: string
  email?: string
  createdAt?: string
  comment?: string
}

declare interface Relation {
  relationId?: string
  userId?: string
  orgId?: string
  org?: string
  firstname?: string
  lastname?: string
  email?: string
  role?: string
}

declare interface Course {
  courseId: string
  course: string
}
