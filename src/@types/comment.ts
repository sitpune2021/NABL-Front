export interface Reply {
    id: string
    author: string
    avatar: string
    text: string
    timestamp: string
}

export interface Comment {
    id: string
    author: string
    avatar: string
    text: string
    timestamp: string
    dateLabel?: string
    rawDate?: string
    replies: Reply[]
}
export interface Document {
    id: string | number
    name: string
    number?: string
}

export interface CommentDrawerProps {
    isOpen: boolean
    onClose: () => void
    document: Document | null
}
