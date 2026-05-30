type AccuseStatus = 'pending' | 'handled'
type AccuseAction = 'hint' | 'ignore' | 'delete' | 'deleteAll' | 'lock' | 'ban'

interface AccuseReason {
    id: number,
    content: string,
    created_at: string,
    reporter_recent_count: number,
}

interface AccuseItemData {
    id: number,
    thread_id: number,
    post_id: number,
    floor: number,
    thread_title: string,
    status: AccuseStatus,
    created_at: string,
    reasons: AccuseReason[],
    target_recent_count: number,
    handled_by?: string,
    handled_at?: string,
    handle_action?: AccuseAction,
    handle_note?: string,
    handle_reduce_olo: boolean,
    uncertain: boolean,
}

interface AccuseCreateParams {
    thread_id: number,
    post_id: number,
    floor: number,
    reason: string,
}

const accuseMockData: AccuseItemData[] = [
    {
        id: 104,
        thread_id: 181261,
        post_id: 952741,
        floor: 233,
        thread_title: '祝福池活动集中帖',
        status: 'pending',
        created_at: '2026-05-29 14:26:18',
        target_recent_count: 3,
        uncertain: true,
        handle_reduce_olo: false,
        reasons: [
            {
                id: 1,
                content: '连续刷屏影响阅读，希望管理员确认一下。',
                created_at: '2026-05-29 14:26:18',
                reporter_recent_count: 2,
            },
            {
                id: 2,
                content: '同一内容重复出现，疑似刷屏。',
                created_at: '2026-05-29 14:38:45',
                reporter_recent_count: 1,
            },
        ],
    },
    {
        id: 103,
        thread_id: 181020,
        post_id: 951880,
        floor: 18,
        thread_title: '日常闲聊锅',
        status: 'pending',
        created_at: '2026-05-29 12:04:51',
        target_recent_count: 1,
        uncertain: false,
        handle_reduce_olo: false,
        reasons: [
            {
                id: 3,
                content: '内容包含明显攻击性表述。',
                created_at: '2026-05-29 12:04:51',
                reporter_recent_count: 4,
            },
        ],
    },
    {
        id: 102,
        thread_id: 180922,
        post_id: 950112,
        floor: 401,
        thread_title: '反馈与建议收集',
        status: 'handled',
        created_at: '2026-05-28 22:17:09',
        target_recent_count: 2,
        handled_by: '蒜苗',
        handled_at: '2026-05-29 09:18:30',
        handle_action: 'ignore',
        handle_note: '内容争议不明显，先忽略。',
        handle_reduce_olo: false,
        uncertain: false,
        reasons: [
            {
                id: 4,
                content: '感觉这个回复偏离主题。',
                created_at: '2026-05-28 22:17:09',
                reporter_recent_count: 1,
            },
        ],
    },
]

function getAccuseDemoList() {
    return accuseMockData.map(item => ({
        ...item,
        reasons: item.reasons.map(reason => ({ ...reason })),
    }))
}

export {
    accuseMockData,
    getAccuseDemoList,
    type AccuseAction,
    type AccuseCreateParams,
    type AccuseItemData,
    type AccuseReason,
    type AccuseStatus,
}
