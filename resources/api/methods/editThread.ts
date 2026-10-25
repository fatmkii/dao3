import { commonAlova } from '@/api/index'
import type { threadData } from '@/api/methods/threads'
import type { forumData } from '@/api/methods/forums'

export interface FirstPostContext {
    thread_data: threadData
    forum_data: forumData
    first_post: {
        nickname: string
        content?: string
        random_head: number | null
        created_by_admin: number
        is_deleted: number
        created_binggan_hash: string | null
    }
    watermark_string: string
}

export interface FirstPostRevision {
    version: number
    content: string
    version_at: string
    is_current: boolean
}

export interface FirstPostHistory extends FirstPostContext {
    versions: FirstPostRevision[]
    pagination: { currentPage: number; lastPage: number; total: number }
}

export interface EditFirstPostPayload {
    content: string
    request_id: string
}

export const editThreadGetter = (threadId: number) => commonAlova.Get<FirstPostContext>(
    `/api/threads/${threadId}/first-post/edit`, { localCache: null },
)

export const editThreadPutter = (threadId: number, payload: EditFirstPostPayload) => commonAlova.Put<{
    thread_id: number; version: number
}>(`/api/threads/${threadId}/first-post`, payload, { localCache: null })

export const editThreadHistoryGetter = (threadId: number, page: number) => commonAlova.Get<FirstPostHistory>(
    `/api/threads/${threadId}/first-post/history`, { params: { page }, localCache: null },
)
