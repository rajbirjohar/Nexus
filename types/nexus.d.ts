export interface Organization {
  creatorId?: string
  creatorFirstName?: string
  creatorLastName?: string
  email?: string
  _name?: string
  _tagline?: string
  _details?: string
  _image?: string
  _site?: string
  _instagram?: string
  _facebook?: string
  _twitter?: string
  _slack?: string
  _discord?: string
}

export interface Event {}

export interface Relation {
  orgId: string
  org: string
  _email: string
  role: string
}
