

interface medalsData {
    [key: number]: {
        name: string,
        describe: string,
        threshold: number | null,
        img: string,
    };
}

//成就数据
export const medalsNormal: medalsData = {
    //拥有的olo数量
    1: {
        'name': '好的开始是成功的一半',
        'describe': '拥有10w个olo',
        'threshold': 100000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac56d523730.png',
    },
    2: {
        'name': '千仓万箱',
        'describe': '拥有50w个olo',
        'threshold': 500000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac56d51f77b.png',
    },
    3: {
        'name': '财富自由',
        'describe': '拥有100w个olo',
        'threshold': 1000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac56d525d98.png',
    },
    4: {
        'name': '锅中首富',
        'describe': '拥有500w个olo',
        'threshold': 5000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac56d536c09.png',
    },

    //获得全部大乱斗成就
    10: {
        'name': '你的赌技从914到419，无人不知无人不晓',
        'describe': '获得全部大乱斗成就',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67adf165b1c74.png',
    },

    //通过大乱斗获得的olo数量
    11: {
        'name': '一鸣惊人',
        'describe': '通过大乱斗获得5w个olo',
        'threshold': 50000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac579910aa7.png',
    },
    12: {
        'name': '常胜将军',
        'describe': '通过大乱斗获得10w个olo',
        'threshold': 100000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac579911fea.png',
    },
    13: {
        'name': '赌仙在世',
        'describe': '通过大乱斗获得50w个olo',
        'threshold': 500000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5799131be.png',
    },
    14: {
        'name': '今夜做梦也会笑',
        'describe': '通过大乱斗获得100w个olo',
        'threshold': 1000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac57994db3b.png',
    },
    15: {
        'name': '赌场收割者',
        'describe': '通过大乱斗获得1000w个olo',
        'threshold': 10000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5799460b4.png',
    },
    16: {
        'name': '没能让大人玩得尽兴真是抱歉',
        'describe': '通过大乱斗获得1亿个olo（哇）',
        'threshold': 100000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67adf207457de.png',
    },

    //通过大乱斗失去的olo数量
    21: {
        'name': '出师不利',
        'describe': '由于大乱斗失去5w个olo',
        'threshold': 50000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5807e03e7.png',
    },
    22: {
        'name': '一败涂地',
        'describe': '由于大乱斗失去10w个olo',
        'threshold': 100000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5807df0a7.png',
    },
    23: {
        'name': '家徒四壁',
        'describe': '由于大乱斗失去50w个olo',
        'threshold': 500000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5807e022b.png',
    },
    24: {
        'name': '倾家荡产',
        'describe': '由于大乱斗失去100w个olo',
        'threshold': 1000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5807e556c.png',
    },
    25: {
        'name': '空中飞人',
        'describe': '由于大乱斗失去1000w个olo',
        'threshold': 10000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5807e89f4.png',
    },
    26: {
        'name': '进数码缅北，割赛博腰子',
        'describe': '由于大乱斗失去1亿个olo（嗷..）',
        'threshold': 100000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67adf2074feb7.png',
    },

    //通过红包获得的olo数量 
    31: {
        'name': '天降横财',
        'describe': '通过红包获得5w个olo',
        'threshold': 50000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac58734520b.png',
    },
    32: {
        'name': '时来运转',
        'describe': '通过红包获得10w个olo',
        'threshold': 100000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac58735a3df.png',
    },
    33: {
        'name': '鸿运当头',
        'describe': '通过红包获得50w个olo',
        'threshold': 500000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac587353008.png',
    },
    34: {
        'name': '天选之子',
        'describe': '通过红包获得100w个olo',
        'threshold': 1000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac587355efa.png',
    },
    35: {
        'name': '金玉满堂',
        'describe': '通过红包获得500w个olo',
        'threshold': 5000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac58735bbae.png',
    },

    //通过红包失去的olo数量
    41: {
        'name': '元元之民',
        'describe': '派发红包合计5w个olo',
        'threshold': 50000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac58f4ce626.png',
    },
    42: {
        'name': '乐善好施',
        'describe': '派发红包合计10w个olo',
        'threshold': 100000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac58f4b4bf2.png',
    },
    43: {
        'name': '行善积德',
        'describe': '派发红包合计50w个olo',
        'threshold': 500000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac58f4cecc4.png',
    },
    44: {
        'name': '有钱就是任性',
        'describe': '派发红包合计100w个olo',
        'threshold': 1000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac58f4cf827.png',
    },
    45: {
        'name': '普度众生',
        'describe': '派发红包合计500w个olo',
        'threshold': 5000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac58f4cfa4f.png',
    },

    //发起大乱斗没人接的次数 
    51: {
        'name': '无人在意',
        'describe': '发起大乱斗没人接',
        'threshold': 1,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac59564c9a6.png',
    },


    //删楼次数
    61: {
        'name': '手滑了一下',
        'describe': '删了一个楼',
        'threshold': 1,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac59965e0e3.png',
    },


    //回帖数量
    81: {
        'name': '轻轻松松',
        'describe': '发表了1000个回帖',
        'threshold': 1000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac59e1364f7.png',
    },
    82: {
        'name': '小菜一碟',
        'describe': '发表了5000个回帖',
        'threshold': 5000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac59d68d455.png',
    },
    83: {
        'name': '火锅劳模',
        'describe': '发表了1w个回帖',
        'threshold': 10000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac59d6bf0c6.png',
    },
    84: {
        'name': '决战紫禁之巅',
        'describe': '发表了5w个回帖',
        'threshold': 50000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac59d6c9d80.png',
    },
    85: {
        'name': '火锅有你了不起',
        'describe': '发表了10w个回帖',
        'threshold': 100000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac59d6cc83e.png',
    },

    //大乱斗平局次数
    111: {
        'name': '双赢才是最好的',
        'describe': '大乱斗平局',
        'threshold': 1,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5a1e8fe3c.png',
    },

    //饼干等级
    141: {
        'name': '我要变强',
        'describe': '饼干升到5级',
        'threshold': 5,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5a41c3dc8.png',
    },
    142: {
        'name': '潮到出水',
        'describe': '饼干升到10级',
        'threshold': 10,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5a41c6546.png',
    },
    143: {
        'name': '表情包大户',
        'describe': '饼干升到20级',
        'threshold': 20,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5a41cdaf7.png',
    },
    144: {
        'name': '神仙饼干',
        'describe': '饼干升到40级',
        'threshold': 40,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5a41c2650.png',
    },

    //通过打赏获得的olo数量
    161: {
        'name': '得来全不费功夫',
        'describe': '通过打赏获得10w个olo',
        'threshold': 100000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5a79a0c02.png',
    },
    162: {
        'name': '得道多助',
        'describe': '通过打赏获得50w个olo',
        'threshold': 500000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5a79525fd.png',
    },
    163: {
        'name': '全凭本事',
        'describe': '通过打赏获得100w个olo',
        'threshold': 1000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5a79a227a.png',
    },
    164: {
        'name': '嘀——全款已到账',
        'describe': '通过打赏获得200w个olo',
        'threshold': 2000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5a79a576a.png',
    },

    //通过打赏失去的olo数量
    171: {
        'name': '种瓜得瓜',
        'describe': '打赏出去10w个olo',
        'threshold': 100000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5ac11b503.png',
    },
    172: {
        'name': '手有余香',
        'describe': '打赏出去50w个olo',
        'threshold': 500000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5ac16bd3c.png',
    },
    173: {
        'name': '春蚕蜡炬',
        'describe': '打赏出去100w个olo',
        'threshold': 1000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5ac16dfd6.png',
    },
    174: {
        'name': '羽化飞升',
        'describe': '打赏出去200w个olo',
        'threshold': 2000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5ac16d324.png',
    },

    //连续赢得大乱斗
    221: {
        'name': '喜鹊落枝头',
        'describe': '连续赢得3次大乱斗',
        'threshold': 3,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5b384cc45.png',
    },
    222: {
        'name': '春风得意马蹄疾',
        'describe': '连续赢得5次大乱斗',
        'threshold': 5,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5b37ef849.png',
    },
    223: {
        'name': '福无双至今日至',
        'describe': '连续赢得8次大乱斗',
        'threshold': 8,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5b3847665.png',
    },
    224: {
        'name': '紫气东来保你发财',
        'describe': '连续赢得10次大乱斗',
        'threshold': 10,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5b384ce4b.png',
    },

    //连续输掉大乱斗
    231: {
        'name': '脚踩瓜皮',
        'describe': '连续输掉3次大乱斗',
        'threshold': 3,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5b76d3d36.png',
    },
    232: {
        'name': '凉水塞牙',
        'describe': '连续输掉5次大乱斗',
        'threshold': 5,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5b76d49bf.png',
    },
    233: {
        'name': '点背不能怨社会',
        'describe': '连续输掉8次大乱斗',
        'threshold': 8,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5b76d35e7.png',
    },
    234: {
        'name': '人生不如意十有八九',
        'describe': '连续输掉10次大乱斗',
        'threshold': 10,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5b76d9b56.png',
    },

    //粮仓存粮成就
    241: {
        'name': '日进斗金',
        'describe': '粮仓存粮5w',
        'threshold': 50000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5bb67277c.png',
    },
    242: {
        'name': '堆金积玉',
        'describe': '粮仓存粮10w',
        'threshold': 100000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5bb6950c6.png',
    },
    243: {
        'name': '富甲一方',
        'describe': '粮仓存粮30w',
        'threshold': 300000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5bb6aa9b4.png',
    },
    244: {
        'name': '腰缠万贯',
        'describe': '粮仓存粮50w',
        'threshold': 500000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5bb6ac0f3.png',
    },
    245: {
        'name': '富有四海',
        'describe': '粮仓存粮100w',
        'threshold': 1000000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5bb6b345a.png',
    },
    //发大喇叭成就
    271: {
        'name': '锣鼓喧天',
        'describe': '发布1个大喇叭',
        'threshold': 1,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5c5a39eba.png',
    },
    272: {
        'name': '鞭炮齐鸣',
        'describe': '发布10个大喇叭',
        'threshold': 10,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5c5aa1b40.png',
    },
    273: {
        'name': '红旗招展',
        'describe': '发布50个大喇叭',
        'threshold': 50,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5c5a48a44.png',
    },
    274: {
        'name': '人山人海',
        'describe': '发布100个大喇叭',
        'threshold': 100,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5c5a97ca9.png',
    },
}

//隐藏成就数据
export const medalsHidden: medalsData = {
    //发起大乱斗没人接的次数 
    52: {
        'name': '透明人',
        'describe': '发起大乱斗100次没人接',
        'threshold': 100,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5c912c4fc.png',
    },

    //删楼次数
    62: {
        'name': '你是五嬷吗',
        'describe': '进行了100次删楼',
        'threshold': 100,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5cabe47fb.png',
    },

    //使olo数量达到0
    71: {
        'name': '归零！',
        'describe': 'olo归零',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5cd7564a7.png',
    },

    //抢到某楼的10000层
    91: {
        'name': '万中有一',
        'describe': '抢到第10000楼',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5cf92298c.png',
    },

    //大乱斗掷出101点
    101: {
        'name': '元元的爱',
        'describe': '大乱斗掷出101点',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5d207d9cb.png',
    },


    //大乱斗平局次数
    112: {
        'name': '火锅之神也被你薅秃了',
        'describe': '大乱斗平局100次',
        'threshold': 100,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5d40ebea9.png',
    },

    //红包抢到0个olo
    121: {
        'name': '小火锅的负责人是个骗子',
        'describe': '红包抢到0个olo',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5d5661e30.png',
    },


    //申请一个定制饼干
    131: {
        'name': '个人财产+1',
        'describe': '申请1个定制饼干',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5d6a3b080.png',
    },

    //小火锅周年徽章
    151: {
        'name': '小火锅二周年',
        'describe': '我们要一直在一起 — 至少十年吧！',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5e518512e.png',
    },

    //23年国庆
    152: {
        'name': '国庆节快乐',
        'describe': '伟大的祖国节日快乐',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5da089b51.png',
    },
    //24年春节
    153: {
        'name': '龙年快乐',
        'describe': '2024年小火锅龙年祝福',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5dafba36d.png',
    },
    //24年3周年
    154: {
        'name': '小火锅三周年快乐~！',
        'describe': '3.0也同时上线喔',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5e623e456.png',
    },
    //24年3.0纪念
    155: {
        'name': '小火锅3.0',
        'describe': '诶？我来测试咒岛3.0？真的假的？！',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5eb407ea4.png',
    },
    //25年春节
    156: {
        'name': '蛇年快乐',
        'describe': '2025年小火锅蛇年祝福',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67adf2702ea00.png',
    },
    //25年4周年
    157: {
        'name': '小火锅四周年！',
        'describe': '要和我们玩一辈子nmq吗？',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/04/680e1e444e060.png',
    },
    //画师荣誉徽章
    181: {
        'name': '皇家御用画宗',
        'describe': '大触快教教我画画',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5ecfaa6b8.png',
    },


    //管理员荣誉徽章
    182: {
        'name': '小火锅守护者',
        'describe': '我来组成小火锅锅底！',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5ecf9f4b5.png',
    },

    //小火锅终末旅行
    183: {
        'name': '小火锅终末旅行',
        'describe': '既有开始，必有终结',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5ee87bc2d.png',
    },

    //表情包萌
    201: {
        'name': 'ac娘',
        'describe': '\\\\ ac娘，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1e7d5d2.png',
    },
    202: {
        'name': '鹦鹉鸡',
        'describe': '\\\\ 鹦鹉鸡，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1eeabbc.png',
    },
    203: {
        'name': '咪子鱼',
        'describe': '\\\\ 咪子鱼，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1eec3a5.png',
    },
    204: {
        'name': '小黑猫',
        'describe': '\\\\ 小黑猫，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1f47f9f.png',
    },
    205: {
        'name': '麻将脸',
        'describe': '\\\\ 麻将脸，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1f47a4d.png',
    },
    206: {
        'name': '小恐龙',
        'describe': '\\\\ 小恐龙，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1edf0b5.png',
    },
    207: {
        'name': 'TD猫',
        'describe': '\\\\ TD猫，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1edf3f7.png',
    },
    208: {
        'name': '小豆泥',
        'describe': '\\\\ 小豆泥，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1ee7b93.png',
    },
    209: {
        'name': '小企鹅',
        'describe': '\\\\ 小企鹅，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1ee73d1.png',
    },
    210: {
        'name': '小黄脸',
        'describe': '\\\\ 小黄脸，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1f43b86.png',
    },
    211: {
        'name': 'FUFU',
        'describe': '\\\\ FUFU，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1edc377.png',
    },
    212: {
        'name': '小火锅第一届表情包萌',
        'describe': '全军出击！',
        'threshold': 100, //这里指100票，10000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1f458fb.png',
    },
    213: {
        'name': '燃起来了！',
        'describe': '擦出爱的火花',
        'threshold': 1000, //这里指1000票，100000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1f4c6d7.png',
    },
    214: {
        'name': '为冠军的小豆泥献上喝彩',
        'describe': '尊贵的小豆泥陛下火遍全球天下第一帝锅',
        'threshold': 0, //本命是小豆泥的全部饼干
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5f1ee73f1.png',
    },
    215: {
        'name': '当你凝视深渊时',
        'describe': '深渊喵了一声',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5fcde4533.png',
    },
    216: {
        'name': '药水哥',
        'describe': '\\\\ 药水哥，出道！//',
        'threshold': 500, //这里指500票，10000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5fcde50c6.png',
    },
    280: {
        'name': '吉伊卡哇',
        'describe': '\\\\ 吉伊卡哇，出道！//',
        'threshold': 500, //这里指500票，10000个olo
        'img': 'https://wmimg.com/i/1547/2025/06/68482bec31bc2.png',
    },
    217: {
        'name': '小火锅第二届表情包萌',
        'describe': '再来一次',
        'threshold': 100, //这里指100票，10000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5fcde38bc.png',
    },
    218: {
        'name': '勇夺第一！',
        'describe': '至少不要被淘汰',
        'threshold': 1000, //这里指1000票，100000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5fcde242e.png',
    },
    219: {
        'name': '遗憾离场',
        'describe': '希望还能回来',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac5fcde1447.png',
    },
    281: {
        'name': '小火锅第三届表情包萌',
        'describe': '第三次也该老练起来了吧',
        'threshold': 100, //这里指100票，10000个olo
        'img': 'https://wmimg.com/i/1547/2025/06/6846d2b7dad3c.png',
    },
    282: {
        'name': '雄心壮志get',
        'describe': '在可能获胜的道路上一路狂奔',
        'threshold': 1000, //这里指1000票，100000个olo
        'img': 'https://wmimg.com/i/1547/2025/06/6846d2b7c9d00.png',
    },
    283: {
        'name': '并非离开',
        'describe': '我们WB再见',
        'threshold': 0,
        'img': 'https://wmimg.com/i/1547/2025/06/685823283f71c.png',
    },
    284: {
        'name': '世界第一的公主殿下',
        'describe': '那我的一切，就都有了意义',
        'threshold': 0, 
        'img': 'https://wmimg.com/i/1547/2025/06/685807cd2008d.png',
    },


    //银行提前支取累计 
    251: {
        'name': '今朝有米今朝吃',
        'describe': '明日无米啃枯枝（提前开仓累计30w）',
        'threshold': 300000,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac602c39365.png',
    },

    261: {
        'name': '小火锅第一届出道萌',
        'describe': '出道萌投票100票',
        'threshold': 100, //这里指100票，10000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac6078074a3.png',
    },
    262: {
        'name': '成为大家的爱豆',
        'describe': '出道萌投票1000票',
        'threshold': 1000, //这里指1000票，100000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac6077f2162.png',
    },
    263: {
        'name': '药药切克闹',
        'describe': '民推之光药水哥',
        'threshold': null,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac6078084ac.png',
    },
    264: {
        'name': '小火锅第二届出道萌',
        'describe': '出道萌投票100票',
        'threshold': 100, //这里指100票，10000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac60deb67be.png',
    },
    265: {
        'name': '我会回来的！',
        'describe': '出道萌投票1000票',
        'threshold': 1000, //这里指1000票，100000个olo
        'img': 'https://wmimg.com/i/1547/2025/02/67ac60deab3b5.png',
    },
    266: {
        'name': '他如闪电般归来',
        'describe': '药水哥回到他忠诚的小火锅',
        'threshold': null,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac60deca4e7.png',
    },


    270: {
        'name': '吼那么大声干嘛啦',
        'describe': '撤回一个大喇叭',
        'threshold': null,
        'img': 'https://wmimg.com/i/1547/2025/02/67ac61081b481.png',
    },

}