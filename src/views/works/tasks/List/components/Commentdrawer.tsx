/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import {
    TbX,
    TbSend,
    TbMessageCircle,
    TbCornerDownRight,
    TbChevronDown,
    TbChevronUp,
    TbLoader2,
} from 'react-icons/tb'
import { getComments, addComment } from '@/services/CommentService'
import { Comment, CommentDrawerProps } from '@/@types/comment'

const getAvatarColor = (i: string) =>
    i === 'ME' ? 'bg-indigo-500' : 'bg-slate-500'

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr),
        today = new Date(),
        yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })

const Avatar = ({ initials }: { initials: string }) => (
    <div
        className={`w-8 h-8 rounded-full flex items-center
     justify-center text-white text-xs font-bold flex-shrink-0 ${getAvatarColor(initials)}`}
    >
        {initials}
    </div>
)

const CommentDrawer: React.FC<CommentDrawerProps> = ({
    isOpen,
    onClose,
    document,
}) => {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyText, setReplyText] = useState('')
    const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
        new Set(),
    )
    const [isLoading, setIsLoading] = useState(false)
    const newCommentRef = useRef<HTMLTextAreaElement>(null)

    const fetchComments = async () => {
        if (!document) return
        setIsLoading(true)
        try {
            const res: any = await getComments(document.id)
            const data = Array.isArray(res) ? res : res.data

            const formatted = data.map((c: any) => ({
                id: String(c.id),
                author: c.user?.name || 'User',
                avatar: (c.user?.name || 'U').slice(0, 2).toUpperCase(),
                text: c.text,
                timestamp: formatTime(c.created_at),
                dateLabel: formatDateLabel(c.created_at),
                replies: (c.replies || []).map((r: any) => ({
                    id: String(r.id),
                    author: r.user?.name || 'User',
                    avatar: (r.user?.name || 'U').slice(0, 2).toUpperCase(),
                    text: r.text,
                    timestamp: formatTime(r.created_at),
                })),
            }))
            setComments(formatted)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAction = async (text: string, parentId?: string) => {
        if (!text.trim() || !document) return
        await addComment({
            document_id: document.id,
            text,
            parent_id: parentId,
        })

        if (parentId) {
            setReplyText('')
            setReplyingTo(null)
            setExpandedReplies((prev) => new Set(prev).add(parentId))
        } else {
            setNewComment('')
        }
        fetchComments()
    }

    useEffect(() => {
        if (isOpen && document) {
            fetchComments()
            setReplyingTo(null)
            setNewComment('')
            setReplyText('')
        }
    }, [isOpen, document])

    useEffect(() => {
        if (isOpen) setTimeout(() => newCommentRef.current?.focus(), 300)
    }, [isOpen])

    const toggleReplies = (id: string) => {
        const next = new Set(expandedReplies)
        next.has(id) ? next.delete(id) : next.add(id)
        setExpandedReplies(next)
    }

    const onEnter = (e: React.KeyboardEvent, fn: () => void) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            fn()
        }
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div
                className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex-1 min-w-0">
                        {document && (
                            <>
                                <h2 className="text-sm font-bold text-gray-800 truncate leading-tight">
                                    {document.name}
                                </h2>
                                {document.number && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {document.number}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                    <Button
                        variant="plain"
                        size="sm"
                        icon={<TbX />}
                        className="ml-3 flex-shrink-0"
                        onClick={onClose}
                    />
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <TbLoader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                            <p className="text-sm">Fetching comments...</p>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                            <TbMessageCircle className="w-10 h-10 mb-2 opacity-30" />
                            <p className="text-sm">No comments yet</p>
                            <p className="text-xs mt-1">
                                Be the first to comment
                            </p>
                        </div>
                    ) : (
                        comments.map((comment, index) => {
                            const showDate =
                                index === 0 ||
                                comment.dateLabel !==
                                    comments[index - 1]?.dateLabel
                            const isExpanded = expandedReplies.has(comment.id)
                            const isReplying = replyingTo === comment.id

                            return (
                                <React.Fragment key={comment.id}>
                                    {showDate && (
                                        <div className="flex justify-center">
                                            <div className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                                                {comment.dateLabel}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <Avatar initials={comment.avatar} />
                                        <div className="flex-1 min-w-0">
                                            <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-semibold text-gray-800">
                                                        {comment.author}
                                                    </span>
                                                    <span className="text-xs text-gray-400 ml-2">
                                                        {comment.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    {comment.text}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 mt-1.5 px-1">
                                                <Button
                                                    variant="plain"
                                                    size="xs"
                                                    icon={
                                                        <TbCornerDownRight className="w-3 h-3" />
                                                    }
                                                    className="text-gray-400 hover:text-blue-600"
                                                    onClick={() => {
                                                        setReplyingTo(
                                                            isReplying
                                                                ? null
                                                                : comment.id,
                                                        )
                                                        setReplyText('')
                                                    }}
                                                >
                                                    Reply
                                                </Button>

                                                {comment.replies.length > 0 && (
                                                    <Button
                                                        variant="plain"
                                                        size="xs"
                                                        icon={
                                                            isExpanded ? (
                                                                <TbChevronUp className="w-3 h-3" />
                                                            ) : (
                                                                <TbChevronDown className="w-3 h-3" />
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-blue-600"
                                                        onClick={() =>
                                                            toggleReplies(
                                                                comment.id,
                                                            )
                                                        }
                                                    >
                                                        {comment.replies.length}{' '}
                                                        {comment.replies
                                                            .length === 1
                                                            ? 'reply'
                                                            : 'replies'}
                                                    </Button>
                                                )}
                                            </div>

                                            {isExpanded &&
                                                comment.replies.map((reply) => (
                                                    <div
                                                        key={reply.id}
                                                        className="flex gap-2 mt-3 ml-2 border-l-2 border-gray-100 pl-3"
                                                    >
                                                        <Avatar
                                                            initials={
                                                                reply.avatar
                                                            }
                                                        />
                                                        <div className="flex-1 bg-blue-50 rounded-2xl rounded-tl-sm px-3 py-2.5">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-xs font-semibold text-gray-800">
                                                                    {
                                                                        reply.author
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-gray-400 ml-2">
                                                                    {
                                                                        reply.timestamp
                                                                    }
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                                {reply.text}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}

                                            {isReplying && (
                                                <div className="mt-3 ml-2 border-blue-200 pl-3">
                                                    <div className="flex gap-2 items-end">
                                                        <Avatar initials="ME" />
                                                        <div className="flex-1 bg-white border border-blue-200 rounded-2xl rounded-bl-sm overflow-hidden focus-within:ring-1 focus-within:ring-blue-200 transition-all">
                                                            <textarea
                                                                autoFocus
                                                                rows={1}
                                                                value={
                                                                    replyText
                                                                }
                                                                placeholder="Write a reply..."
                                                                className="w-full px-3 pt-2.5 pb-1 text-sm text-gray-700 resize-none outline-none bg-transparent"
                                                                onChange={(e) =>
                                                                    setReplyText(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                onKeyDown={(
                                                                    e,
                                                                ) =>
                                                                    onEnter(
                                                                        e,
                                                                        () =>
                                                                            handleAction(
                                                                                replyText,
                                                                                comment.id,
                                                                            ),
                                                                    )
                                                                }
                                                            />
                                                            <div className="flex justify-end px-2 pb-2">
                                                                <Button
                                                                    variant="solid"
                                                                    size="xs"
                                                                    icon={
                                                                        <TbSend />
                                                                    }
                                                                    disabled={
                                                                        !replyText.trim()
                                                                    }
                                                                    onClick={() =>
                                                                        handleAction(
                                                                            replyText,
                                                                            comment.id,
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })
                    )}
                </div>

                <div className="border-t border-gray-100 px-5 py-4 bg-white">
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-sm overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 focus-within:bg-white transition-all">
                            <textarea
                                ref={newCommentRef}
                                rows={2}
                                value={newComment}
                                placeholder="Add a comment... "
                                className="w-full px-4 pt-3 pb-1 text-sm text-gray-700 resize-none outline-none bg-transparent"
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) =>
                                    onEnter(e, () => handleAction(newComment))
                                }
                            />
                            <div className="flex items-center justify-end px-3 pb-2.5">
                                <Button
                                    variant="solid"
                                    size="sm"
                                    icon={<TbSend />}
                                    disabled={!newComment.trim()}
                                    onClick={() => handleAction(newComment)}
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CommentDrawer
