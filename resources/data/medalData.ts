

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
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ada94cd95.png',
    },
    2: {
        'name': '千仓万箱',
        'describe': '拥有50w个olo',
        'threshold': 500000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adad60630.png',
    },
    3: {
        'name': '财富自由',
        'describe': '拥有100w个olo',
        'threshold': 1000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adb17c34a.png',
    },
    4: {
        'name': '锅中首富',
        'describe': '拥有500w个olo',
        'threshold': 5000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adb592fc6.png',
    },

    //通过大乱斗获得的olo数量
    11: {
        'name': '一鸣惊人',
        'describe': '通过大乱斗获得5w个olo',
        'threshold': 50000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adb9b0c3d.png',
    },
    12: {
        'name': '常胜将军',
        'describe': '通过大乱斗获得10w个olo',
        'threshold': 100000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adbdc1a06.png',
    },
    13: {
        'name': '赌仙在世',
        'describe': '通过大乱斗获得50w个olo',
        'threshold': 500000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adc1e04dc.png',
    },
    14: {
        'name': '今夜做梦也会笑',
        'describe': '通过大乱斗获得100w个olo',
        'threshold': 1000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adc607cec.png',
    },
    15: {
        'name': '赌场收割者',
        'describe': '通过大乱斗获得1000w个olo',
        'threshold': 10000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adca296cc.png',
    },

    //通过大乱斗失去的olo数量
    21: {
        'name': '出师不利',
        'describe': '由于大乱斗失去5w个olo',
        'threshold': 50000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adce3ea77.png',
    },
    22: {
        'name': '一败涂地',
        'describe': '由于大乱斗失去10w个olo',
        'threshold': 100000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644add25f2a7.png',
    },
    23: {
        'name': '家徒四壁',
        'describe': '由于大乱斗失去50w个olo',
        'threshold': 500000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644add678a1a.png',
    },
    24: {
        'name': '倾家荡产',
        'describe': '由于大乱斗失去100w个olo',
        'threshold': 1000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644addaa6317.png',
    },
    25: {
        'name': '空中飞人',
        'describe': '由于大乱斗失去1000w个olo',
        'threshold': 10000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644addec9400.png',
    },

    //通过红包获得的olo数量 
    31: {
        'name': '天降横财',
        'describe': '通过红包获得5w个olo',
        'threshold': 50000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ade2e69e8.png',
    },
    32: {
        'name': '时来运转',
        'describe': '通过红包获得10w个olo',
        'threshold': 100000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ade70bf9f.png',
    },
    33: {
        'name': '鸿运当头',
        'describe': '通过红包获得50w个olo',
        'threshold': 500000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adeb2c375.png',
    },
    34: {
        'name': '天选之子',
        'describe': '通过红包获得100w个olo',
        'threshold': 1000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adef49b6d.png',
    },
    35: {
        'name': '金玉满堂',
        'describe': '通过红包获得500w个olo',
        'threshold': 5000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adf364751.png',
    },

    //通过红包失去的olo数量
    41: {
        'name': '元元之民',
        'describe': '派发红包合计5w个olo',
        'threshold': 50000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adf77dc8a.png',
    },
    42: {
        'name': '乐善好施',
        'describe': '派发红包合计10w个olo',
        'threshold': 100000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adfb9dd8b.png',
    },
    43: {
        'name': '行善积德',
        'describe': '派发红包合计50w个olo',
        'threshold': 500000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644adffc8d16.png',
    },
    44: {
        'name': '有钱就是任性',
        'describe': '派发红包合计100w个olo',
        'threshold': 1000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae03eabae.png',
    },
    45: {
        'name': '普度众生',
        'describe': '派发红包合计500w个olo',
        'threshold': 5000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae080bd00.png',
    },

    //发起大乱斗没人接的次数 
    51: {
        'name': '无人在意',
        'describe': '发起大乱斗没人接',
        'threshold': 1,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae0c320a1.png',
    },


    //删楼次数
    61: {
        'name': '手滑了一下',
        'describe': '删了一个楼',
        'threshold': 1,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae1045148.png',
    },


    //回帖数量
    81: {
        'name': '轻轻松松',
        'describe': '发表了1000个回帖',
        'threshold': 1000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae145fce7.png',
    },
    82: {
        'name': '小菜一碟',
        'describe': '发表了5000个回帖',
        'threshold': 5000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae1870687.png',
    },
    83: {
        'name': '火锅劳模',
        'describe': '发表了1w个回帖',
        'threshold': 10000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae1c91e65.png',
    },
    84: {
        'name': '决战紫禁之巅',
        'describe': '发表了5w个回帖',
        'threshold': 50000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae20a7c8d.png',
    },
    85: {
        'name': '火锅有你了不起',
        'describe': '发表了10w个回帖',
        'threshold': 100000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae24c583b.png',
    },

    //大乱斗平局次数
    111: {
        'name': '双赢才是最好的',
        'describe': '大乱斗平局',
        'threshold': 1,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae28dbbe4.png',
    },

    //饼干等级
    141: {
        'name': '我要变强',
        'describe': '饼干升到5级',
        'threshold': 5,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae2d090a3.png',
    },
    142: {
        'name': '潮到出水',
        'describe': '饼干升到10级',
        'threshold': 10,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae31251b3.png',
    },
    143: {
        'name': '表情包大户',
        'describe': '饼干升到20级',
        'threshold': 20,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae35426dc.png',
    },
    144: {
        'name': '神仙饼干',
        'describe': '饼干升到40级',
        'threshold': 40,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae3955116.png',
    },

    //通过打赏获得的olo数量
    161: {
        'name': '得来全不费功夫',
        'describe': '通过打赏获得10w个olo',
        'threshold': 100000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae3d76a4c.png',
    },
    162: {
        'name': '得道多助',
        'describe': '通过打赏获得50w个olo',
        'threshold': 500000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae41966a1.png',
    },
    163: {
        'name': '全凭本事',
        'describe': '通过打赏获得100w个olo',
        'threshold': 1000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae45b3bf4.png',
    },
    164: {
        'name': '嘀——全款已到账',
        'describe': '通过打赏获得200w个olo',
        'threshold': 2000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae49d8568.png',
    },

    //通过打赏失去的olo数量
    171: {
        'name': '种瓜得瓜',
        'describe': '打赏出去10w个olo',
        'threshold': 100000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae4df3cfd.png',
    },
    172: {
        'name': '手有余香',
        'describe': '打赏出去50w个olo',
        'threshold': 500000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae52200bd.png',
    },
    173: {
        'name': '春蚕蜡炬',
        'describe': '打赏出去100w个olo',
        'threshold': 1000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae5640cef.png',
    },
    174: {
        'name': '羽化飞升',
        'describe': '打赏出去200w个olo',
        'threshold': 2000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae5a6833d.png',
    },

    //连续赢得大乱斗
    221: {
        'name': '喜鹊落枝头',
        'describe': '连续赢得3次大乱斗',
        'threshold': 3,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae5e8c198.png',
    },
    222: {
        'name': '春风得意马蹄疾',
        'describe': '连续赢得5次大乱斗',
        'threshold': 5,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae62a46e7.png',
    },
    223: {
        'name': '福无双至今日至',
        'describe': '连续赢得8次大乱斗',
        'threshold': 8,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae66c1639.png',
    },
    224: {
        'name': '紫气东来保你发财',
        'describe': '连续赢得10次大乱斗',
        'threshold': 10,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae6ae48f7.png',
    },

    //连续输掉大乱斗
    231: {
        'name': '脚踩瓜皮',
        'describe': '连续输掉3次大乱斗',
        'threshold': 3,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae6f162f4.png',
    },
    232: {
        'name': '凉水塞牙',
        'describe': '连续输掉5次大乱斗',
        'threshold': 5,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae732a108.png',
    },
    233: {
        'name': '点背不能怨社会',
        'describe': '连续输掉8次大乱斗',
        'threshold': 8,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae774c3f2.png',
    },
    234: {
        'name': '人生不如意十有八九',
        'describe': '连续输掉10次大乱斗',
        'threshold': 10,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae7b6bf39.png',
    },

    //粮仓存粮成就
    241: {
        'name': '日进斗金',
        'describe': '粮仓存粮5w',
        'threshold': 50000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae7f8c476.png',
    },
    242: {
        'name': '堆金积玉',
        'describe': '粮仓存粮10w',
        'threshold': 100000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae83a73e7.png',
    },
    243: {
        'name': '富甲一方',
        'describe': '粮仓存粮30w',
        'threshold': 300000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae87c9ff8.png',
    },
    244: {
        'name': '腰缠万贯',
        'describe': '粮仓存粮50w',
        'threshold': 500000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae8be6576.png',
    },
    245: {
        'name': '富有四海',
        'describe': '粮仓存粮100w',
        'threshold': 1000000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae901dd0c.png',
    },
    //发大喇叭成就
    271: {
        'name': '锣鼓喧天',
        'describe': '发布1个大喇叭',
        'threshold': 1,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae9439ca1.png',
    },
    272: {
        'name': '鞭炮齐鸣',
        'describe': '发布10个大喇叭',
        'threshold': 10,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae98571dd.png',
    },
    273: {
        'name': '红旗招展',
        'describe': '发布50个大喇叭',
        'threshold': 50,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644ae9c771ad.png',
    },
    274: {
        'name': '人山人海',
        'describe': '发布100个大喇叭',
        'threshold': 100,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aea09e90f.png',
    },
}

//隐藏成就数据
export const medalsHidden: medalsData = {
    //发起大乱斗没人接的次数 
    52: {
        'name': '透明人',
        'describe': '发起大乱斗100次没人接',
        'threshold': 100,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aea4c7392.png',
    },

    //删楼次数
    62: {
        'name': '你是五嬷吗',
        'describe': '进行了100次删楼',
        'threshold': 100,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aea8e8ab1.png',
    },

    //使olo数量达到0
    71: {
        'name': '归零！',
        'describe': 'olo归零',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aead0ef0a.png',
    },

    //抢到某楼的10000层
    91: {
        'name': '万中有一',
        'describe': '抢到第10000楼',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aeb12d74a.png',
    },

    //大乱斗掷出101点
    101: {
        'name': '元元的爱',
        'describe': '大乱斗掷出101点',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aeb54f88c.png',
    },


    //大乱斗平局次数
    112: {
        'name': '火锅之神也被你薅秃了',
        'describe': '大乱斗平局100次',
        'threshold': 100,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aeb973cee.png',
    },

    //红包抢到0个olo
    121: {
        'name': '小火锅的负责人是个骗子',
        'describe': '红包抢到0个olo',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aebd9611c.png',
    },


    //申请一个定制饼干
    131: {
        'name': '个人财产+1',
        'describe': '申请1个定制饼干',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aec1b674a.png',
    },

    //小火锅周年徽章
    151: {
        'name': '小火锅二周年',
        'describe': '我们要一直在一起 — 至少十年吧！',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aec5e555c.png',
    },

    //23年国庆
    152: {
        'name': '国庆节快乐',
        'describe': '伟大的祖国节日快乐',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aeca09230.png',
    },
    //24年春节
    153: {
        'name': '龙年快乐',
        'describe': '2024年小火锅龙年祝福',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aece30c60.png',
    },
    //24年3周年
    154: {
        'name': '小火锅三周年快乐~！',
        'describe': '3.0也同时上线喔',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aed2679fa.png',
    },
    //24年3.0纪念
    155: {
        'name': '小火锅3.0',
        'describe': '诶？我来测试咒岛3.0？真的假的？！',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aed695242.png',
    },

    //画师荣誉徽章
    181: {
        'name': '皇家御用画宗',
        'describe': '大触快教教我画画',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aedac0d5f.png',
    },


    //管理员荣誉徽章
    182: {
        'name': '小火锅守护者',
        'describe': '我来组成小火锅锅底！',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aedee642d.png',
    },

    //小火锅终末旅行
    183: {
        'name': '小火锅终末旅行',
        'describe': '既有开始，必有终结',
        'threshold': 0,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aee30dca6.png',
    },

    //表情包萌
    201: {
        'name': 'ac娘',
        'describe': '\\\\ ac娘，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aee73b2ac.png',
    },
    202: {
        'name': '鹦鹉鸡',
        'describe': '\\\\ 鹦鹉鸡，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aeeb550ad.png',
    },
    203: {
        'name': '咪子鱼',
        'describe': '\\\\ 咪子鱼，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aeef7a533.png',
    },
    204: {
        'name': '小黑猫',
        'describe': '\\\\ 小黑猫，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aef39c969.png',
    },
    205: {
        'name': '麻将脸',
        'describe': '\\\\ 麻将脸，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aef7bebd3.png',
    },
    206: {
        'name': '小恐龙',
        'describe': '\\\\ 小恐龙，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644aefbe26c6.png',
    },
    207: {
        'name': 'TD猫',
        'describe': '\\\\ TD猫，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af000782f.png',
    },
    208: {
        'name': '小豆泥',
        'describe': '\\\\ 小豆泥，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af04365c5.png',
    },
    209: {
        'name': '小企鹅',
        'describe': '\\\\ 小企鹅，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af0851a31.png',
    },
    210: {
        'name': '小黄脸',
        'describe': '\\\\ 小黄脸，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af0c77015.png',
    },
    211: {
        'name': 'FUFU',
        'describe': '\\\\ FUFU，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af10b3984.png',
    },
    212: {
        'name': '小火锅第一届表情包萌',
        'describe': '全军出击！',
        'threshold': 100, //这里指100票，10000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af14d9ea5.png',
    },
    213: {
        'name': '燃起来了！',
        'describe': '擦出爱的火花',
        'threshold': 1000, //这里指1000票，100000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af191204b.png',
    },
    214: {
        'name': '为冠军的小豆泥献上喝彩',
        'describe': '尊贵的小豆泥陛下火遍全球天下第一帝锅',
        'threshold': 0, //本命是小豆泥的全部饼干
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af1d34f03.png',
    },
    215: {
        'name': '第二届冠军徽章（预留）',
        'describe': '',
        'threshold': 0,
        'img': '',
    },
    216: {
        'name': '药水哥',
        'describe': '\\\\ 药水哥，出道！//',
        'threshold': 500, //这里指500票，10000个olo
        'img': 'https://www.freeimg.cn/i/2024/06/14/666c4200e2f04.png',
    },
    217: {
        'name': '第二届隐藏1（预留）',
        'describe': '',
        'threshold': 100, //这里指100票，10000个olo
        'img': '',
    },
    218: {
        'name': '第二届隐藏2（预留）',
        'describe': '',
        'threshold': 1000, //这里指1000票，10000个olo
        'img': '',
    },
    219: {
        'name': '第二届被淘汰1（预留）',
        'describe': '',
        'threshold': 0,
        'img': '',
    },
    220: {
        'name': '第二届被淘汰2（预留）',
        'describe': '',
        'threshold': 0,
        'img': '',
    },

    //银行提前支取累计
    251: {
        'name': '今朝有米今朝吃',
        'describe': '明日无米啃枯枝（提前开仓累计30w）',
        'threshold': 300000,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af215e26d.png',
    },

    261: {
        'name': '小火锅第一届出道萌',
        'describe': '出道萌投票100票',
        'threshold': 100, //这里指100票，10000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af257ee46.png',
    },
    262: {
        'name': '成为大家的爱豆',
        'describe': '出道萌投票1000票',
        'threshold': 1000, //这里指1000票，100000个olo
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af29a5f84.png',
    },
    263: {
        'name': '药药切克闹',
        'describe': '民推之光药水哥',
        'threshold': null,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af2dce45d.png',
    },

    270: {
        'name': '吼那么大声干嘛啦',
        'describe': '撤回一个大喇叭',
        'threshold': null,
        'img': 'https://www.freeimg.cn/i/2024/05/15/6644af31f3d2a.png',
    },

}