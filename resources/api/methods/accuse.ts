import { commonAlova } from '@/api/index'

type AccuseStatus = 'pending' | 'handled'
type AccuseAction = 'hint' | 'ignore' | 'delete' | 'deleteAll' | 'lock' | 'ban'
type AccuseTargetType = 'post' | 'loudspeaker'

interface AccuseReason {
    id: number,
    content: string,
    created_at: string,
    reporter_recent_count: number | null,
}

interface AccuseItemData {
    id: number,
    target_type: AccuseTargetType,
    thread_id: number,
    post_id: number | null,
    loudspeaker_id: number | null,
    forum_id: number,
    floor: number,
    thread_title: string,
    loudspeaker_content: string | null,
    loudspeaker_color: string | null,
    status: AccuseStatus,
    created_at: string,
    reasons: AccuseReason[],
    target_recent_count: number | null,
    target_deleted_post_penalty_count: number | null,
    handled_by?: string | null,
    handled_at?: string | null,
    handle_action?: AccuseAction | null,
    handle_note?: string | null,
    handle_reduce_olo: boolean,
    uncertain: boolean,
    can_manage?: boolean,
}

interface PostAccuseCreateParams {
    target_type?: 'post',
    thread_id: number,
    post_id: number,
    floor: number,
    reason: string,
}

interface LoudspeakerAccuseCreateParams {
    target_type: 'loudspeaker',
    loudspeaker_id: number,
    loudspeaker_content?: string,
    loudspeaker_color?: string | null,
    reason: string,
}

type AccuseCreateParams = PostAccuseCreateParams | LoudspeakerAccuseCreateParams

interface AccuseListParams {
    page: number,
    pending_only?: boolean,
    my_pending_only?: boolean,
}

interface AccuseListData {
    data: AccuseItemData[],
    last_page: number,
    pending_count: number,
    my_pending_count: number,
}

interface AccuseHandleParams {
    action: Exclude<AccuseAction, 'hint'>,
    reason?: string,
    reduce_olo?: boolean,
}

interface AccuseHintData {
    locked_count: string,
    user_status: string,
}

const accuseListGetter = (params: AccuseListParams) => commonAlova.Get<AccuseListData>(
    'api/accuses',
    {
        name: 'accuseListGetter',
        params: {
            page: params.page,
            pending_only: params.pending_only ? 1 : 0,
            my_pending_only: params.my_pending_only ? 1 : 0,
        },
        localCache: null,
        hitSource: [],
    },
)

const accuseCreatePoster = (params: AccuseCreateParams) => {
    const methodInstance = commonAlova.Post<AccuseItemData>(
        'api/accuses',
        params,
        {
            name: 'accuseCreatePoster',
            params: {},
            localCache: null,
            hitSource: [],
        },
    )
    methodInstance.meta = {
        shouldRemind: true,
    }
    return methodInstance
}

const accuseHintPoster = (id: number) => commonAlova.Post<AccuseHintData>(
    `api/accuses/${id}/hint`,
    {},
    {
        name: 'accuseHintPoster',
        params: {},
        localCache: null,
        hitSource: [],
    },
)

const accuseHandlePoster = (id: number, params: AccuseHandleParams) => {
    const methodInstance = commonAlova.Post<AccuseItemData>(
        `api/accuses/${id}/handle`,
        params,
        {
            name: 'accuseHandlePoster',
            params: {},
            localCache: null,
            hitSource: [],
        },
    )
    methodInstance.meta = {
        shouldRemind: true,
    }
    return methodInstance
}

const accuseUncertainPutter = (id: number, uncertain: boolean) => {
    const methodInstance = commonAlova.Put<AccuseItemData>(
        `api/accuses/${id}/uncertain`,
        { uncertain },
        {
            name: 'accuseUncertainPutter',
            params: {},
            localCache: null,
            hitSource: [],
        },
    )
    methodInstance.meta = {
        shouldRemind: false,
    }
    return methodInstance
}

export {
    accuseCreatePoster,
    accuseHandlePoster,
    accuseHintPoster,
    accuseListGetter,
    accuseUncertainPutter,
    type AccuseAction,
    type AccuseCreateParams,
    type AccuseHandleParams,
    type AccuseHintData,
    type AccuseItemData,
    type AccuseListData,
    type AccuseReason,
    type AccuseStatus,
    type AccuseTargetType,
}
