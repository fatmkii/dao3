

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
        'img': 'https://ll4484.bvimg.com/21501/375ab2ed5cb4f270.png',
    },
    2: {
        'name': '千仓万箱',
        'describe': '拥有50w个olo',
        'threshold': 500000,
        'img': 'https://ll4484.bvimg.com/21501/3b0f00901650e2d3.png',
    },
    3: {
        'name': '财富自由',
        'describe': '拥有100w个olo',
        'threshold': 1000000,
        'img': 'https://ll4484.bvimg.com/21501/84bb8e3e7a23d961.png',
    },
    4: {
        'name': '锅中首富',
        'describe': '拥有500w个olo',
        'threshold': 5000000,
        'img': 'https://ll4484.bvimg.com/21501/b956a208b91668de.png',
    },

    //通过大乱斗获得的olo数量
    11: {
        'name': '一鸣惊人',
        'describe': '通过大乱斗获得5w个olo',
        'threshold': 50000,
        'img': 'https://ll4484.bvimg.com/21501/705cf2e9657bf6eb.png',
    },
    12: {
        'name': '常胜将军',
        'describe': '通过大乱斗获得10w个olo',
        'threshold': 100000,
        'img': 'https://ll4484.bvimg.com/21501/70b64dfe538c99be.png',
    },
    13: {
        'name': '赌仙在世',
        'describe': '通过大乱斗获得50w个olo',
        'threshold': 500000,
        'img': 'https://ll4484.bvimg.com/21501/3223a53ff54427ce.png',
    },
    14: {
        'name': '今夜做梦也会笑',
        'describe': '通过大乱斗获得100w个olo',
        'threshold': 1000000,
        'img': 'https://ll4484.bvimg.com/21501/a267ec58f522ffa4.png',
    },
    15: {
        'name': '赌场收割者',
        'describe': '通过大乱斗获得1000w个olo',
        'threshold': 10000000,
        'img': 'https://ll4484.bvimg.com/21501/c2369d193018e2fa.png',
    },

    //通过大乱斗失去的olo数量
    21: {
        'name': '出师不利',
        'describe': '由于大乱斗失去5w个olo',
        'threshold': 50000,
        'img': 'https://ll4484.bvimg.com/21501/88038aa134b857c0.png',
    },
    22: {
        'name': '一败涂地',
        'describe': '由于大乱斗失去10w个olo',
        'threshold': 100000,
        'img': 'https://ll4484.bvimg.com/21501/ea652c1ac709f5dc.png',
    },
    23: {
        'name': '家徒四壁',
        'describe': '由于大乱斗失去50w个olo',
        'threshold': 500000,
        'img': 'https://ll4484.bvimg.com/21501/adebdd29d6b470f8.png',
    },
    24: {
        'name': '倾家荡产',
        'describe': '由于大乱斗失去100w个olo',
        'threshold': 1000000,
        'img': 'https://ll4484.bvimg.com/21501/ebe85fb551a3b54b.png',
    },
    25: {
        'name': '空中飞人',
        'describe': '由于大乱斗失去1000w个olo',
        'threshold': 10000000,
        'img': 'https://ll4484.bvimg.com/21501/6398df1a7d438def.png',
    },

    //通过红包获得的olo数量 
    31: {
        'name': '天降横财',
        'describe': '通过红包获得5w个olo',
        'threshold': 50000,
        'img': 'https://ll4484.bvimg.com/21501/84f4d51a61cd895b.png',
    },
    32: {
        'name': '时来运转',
        'describe': '通过红包获得10w个olo',
        'threshold': 100000,
        'img': 'https://ll4484.bvimg.com/21501/d704b066bcc891c0.png',
    },
    33: {
        'name': '鸿运当头',
        'describe': '通过红包获得50w个olo',
        'threshold': 500000,
        'img': 'https://ll4484.bvimg.com/21501/61d18a6ef787e44d.png',
    },
    34: {
        'name': '天选之子',
        'describe': '通过红包获得100w个olo',
        'threshold': 1000000,
        'img': 'https://ll4484.bvimg.com/21501/f8c6e0d75605020e.png',
    },
    35: {
        'name': '金玉满堂',
        'describe': '通过红包获得500w个olo',
        'threshold': 5000000,
        'img': 'https://ll4484.bvimg.com/21501/ecabdf6edae8a51f.png',
    },

    //通过红包失去的olo数量
    41: {
        'name': '元元之民',
        'describe': '派发红包合计5w个olo',
        'threshold': 50000,
        'img': 'https://ll4484.bvimg.com/21501/09dbeaa195fd3f2e.png',
    },
    42: {
        'name': '乐善好施',
        'describe': '派发红包合计10w个olo',
        'threshold': 100000,
        'img': 'https://ll4484.bvimg.com/21501/f251a828ff8a0039.png',
    },
    43: {
        'name': '行善积德',
        'describe': '派发红包合计50w个olo',
        'threshold': 500000,
        'img': 'https://ll4484.bvimg.com/21501/a6bb9b6effae4742.png',
    },
    44: {
        'name': '有钱就是任性',
        'describe': '派发红包合计100w个olo',
        'threshold': 1000000,
        'img': 'https://ll4484.bvimg.com/21501/6e7337a16755edd9.png',
    },
    45: {
        'name': '普度众生',
        'describe': '派发红包合计500w个olo',
        'threshold': 5000000,
        'img': 'https://ll4484.bvimg.com/21501/5888776d418b3fc0.png',
    },

    //发起大乱斗没人接的次数 
    51: {
        'name': '无人在意',
        'describe': '发起大乱斗没人接',
        'threshold': 1,
        'img': 'https://ll4484.bvimg.com/21501/c0d9581932a5229c.png',
    },


    //删楼次数
    61: {
        'name': '手滑了一下',
        'describe': '删了一个楼',
        'threshold': 1,
        'img': 'https://ll4484.bvimg.com/21501/958f135fcc89d259.png',
    },


    //回帖数量
    81: {
        'name': '轻轻松松',
        'describe': '发表了1000个回帖',
        'threshold': 1000,
        'img': 'https://ll4484.bvimg.com/21501/a8a155f469514f9d.png',
    },
    82: {
        'name': '小菜一碟',
        'describe': '发表了5000个回帖',
        'threshold': 5000,
        'img': 'https://ll4484.bvimg.com/21501/1a061cc01cb8df3e.png',
    },
    83: {
        'name': '火锅劳模',
        'describe': '发表了1w个回帖',
        'threshold': 10000,
        'img': 'https://ll4484.bvimg.com/21501/a6c71f86c8b6d950.png',
    },
    84: {
        'name': '决战紫禁之巅',
        'describe': '发表了5w个回帖',
        'threshold': 50000,
        'img': 'https://ll4484.bvimg.com/21501/6c27f20829a6a54e.png',
    },
    85: {
        'name': '火锅有你了不起',
        'describe': '发表了10w个回帖',
        'threshold': 100000,
        'img': 'https://ll4484.bvimg.com/21501/c934f7ae33e499e1.png',
    },

    //大乱斗平局次数
    111: {
        'name': '双赢才是最好的',
        'describe': '大乱斗平局',
        'threshold': 1,
        'img': 'https://ll4484.bvimg.com/21501/6c068e9fdc4eba5e.png',
    },

    //饼干等级
    141: {
        'name': '我要变强',
        'describe': '饼干升到5级',
        'threshold': 5,
        'img': 'https://ll4484.bvimg.com/21501/202be0d0f7582f01.png',
    },
    142: {
        'name': '潮到出水',
        'describe': '饼干升到10级',
        'threshold': 10,
        'img': 'https://ll4484.bvimg.com/21501/ac8d5eaeed887042.png',
    },
    143: {
        'name': '表情包大户',
        'describe': '饼干升到20级',
        'threshold': 20,
        'img': 'https://ll4484.bvimg.com/21501/8a89113c9d7c2e18.png',
    },
    144: {
        'name': '神仙饼干',
        'describe': '饼干升到40级',
        'threshold': 40,
        'img': 'https://ll4484.bvimg.com/21501/45ab9e9e5f91faca.png',
    },

    //通过打赏获得的olo数量
    161: {
        'name': '得来全不费功夫',
        'describe': '通过打赏获得10w个olo',
        'threshold': 100000,
        'img': 'https://ll4484.bvimg.com/21501/1c9c834f7e7faed7.png',
    },
    162: {
        'name': '得道多助',
        'describe': '通过打赏获得50w个olo',
        'threshold': 500000,
        'img': 'https://ll4484.bvimg.com/21501/cbfb811b56abdbfc.png',
    },
    163: {
        'name': '全凭本事',
        'describe': '通过打赏获得100w个olo',
        'threshold': 1000000,
        'img': 'https://ll4484.bvimg.com/21501/08c938045362eeb4.png',
    },
    164: {
        'name': '嘀——全款已到账',
        'describe': '通过打赏获得200w个olo',
        'threshold': 2000000,
        'img': 'https://ll4484.bvimg.com/21501/df7378fb10f091df.png',
    },

    //通过打赏失去的olo数量
    171: {
        'name': '种瓜得瓜',
        'describe': '打赏出去10w个olo',
        'threshold': 100000,
        'img': 'https://ll4484.bvimg.com/21501/3f72b95dbfa0ab47.png',
    },
    172: {
        'name': '手有余香',
        'describe': '打赏出去50w个olo',
        'threshold': 500000,
        'img': 'https://ll4484.bvimg.com/21501/4987d2435831f69e.png',
    },
    173: {
        'name': '春蚕蜡炬',
        'describe': '打赏出去100w个olo',
        'threshold': 1000000,
        'img': 'https://ll4484.bvimg.com/21501/ba1e8f4a483375f6.png',
    },
    174: {
        'name': '羽化飞升',
        'describe': '打赏出去200w个olo',
        'threshold': 2000000,
        'img': 'https://ll4484.bvimg.com/21501/68869a72740db0a7.png',
    },

    //连续赢得大乱斗
    221: {
        'name': '喜鹊落枝头',
        'describe': '连续赢得3次大乱斗',
        'threshold': 3,
        'img': 'https://ll4484.bvimg.com/21501/1f6a10dcc90a143a.png',
    },
    222: {
        'name': '春风得意马蹄疾',
        'describe': '连续赢得5次大乱斗',
        'threshold': 5,
        'img': 'https://ll4484.bvimg.com/21501/411d03f5b9cc4848.png',
    },
    223: {
        'name': '福无双至今日至',
        'describe': '连续赢得8次大乱斗',
        'threshold': 8,
        'img': 'https://ll4484.bvimg.com/21501/abb0cc49188fbcac.png',
    },
    224: {
        'name': '紫气东来保你发财',
        'describe': '连续赢得10次大乱斗',
        'threshold': 10,
        'img': 'https://ll4484.bvimg.com/21501/5a06207d2febecbb.png',
    },

    //连续输掉大乱斗
    231: {
        'name': '脚踩瓜皮',
        'describe': '连续输掉3次大乱斗',
        'threshold': 3,
        'img': 'https://ll4484.bvimg.com/21501/71272c7043ebd5b3.png',
    },
    232: {
        'name': '凉水塞牙',
        'describe': '连续输掉5次大乱斗',
        'threshold': 5,
        'img': 'https://ll4484.bvimg.com/21501/f4524544c123e5c2.png',
    },
    233: {
        'name': '点背不能怨社会',
        'describe': '连续输掉8次大乱斗',
        'threshold': 8,
        'img': 'https://ll4484.bvimg.com/21501/e211e9f09ec5110b.png',
    },
    234: {
        'name': '人生不如意十有八九',
        'describe': '连续输掉10次大乱斗',
        'threshold': 10,
        'img': 'https://ll4484.bvimg.com/21501/d4bc1004891bcb05.png',
    },

    //粮仓存粮成就
    241: {
        'name': '日进斗金',
        'describe': '粮仓存粮5w',
        'threshold': 50000,
        'img': 'https://ll4484.bvimg.com/21501/a888805775018acf.png',
    },
    242: {
        'name': '堆金积玉',
        'describe': '粮仓存粮10w',
        'threshold': 100000,
        'img': 'https://ll4484.bvimg.com/21501/ffbe0e90a7d07c6e.png',
    },
    243: {
        'name': '富甲一方',
        'describe': '粮仓存粮30w',
        'threshold': 300000,
        'img': 'https://ll4484.bvimg.com/21501/7bd42cda05bde0f7.png',
    },
    244: {
        'name': '腰缠万贯',
        'describe': '粮仓存粮50w',
        'threshold': 500000,
        'img': 'https://ll4484.bvimg.com/21501/8a1122a79bb30c93.png',
    },
    245: {
        'name': '富有四海',
        'describe': '粮仓存粮100w',
        'threshold': 1000000,
        'img': 'https://ll4484.bvimg.com/21501/291440ca42ea6c7f.png',
    },
    //发大喇叭成就
    271: {
        'name': '锣鼓喧天',
        'describe': '发布1个大喇叭',
        'threshold': 1,
        'img': 'https://ll4484.bvimg.com/21501/e73d4fc66ccc3d2a.png',
    },
    272: {
        'name': '鞭炮齐鸣',
        'describe': '发布10个大喇叭',
        'threshold': 10,
        'img': 'https://ll4484.bvimg.com/21501/e84408bfbe1074e7.png',
    },
    273: {
        'name': '红旗招展',
        'describe': '发布50个大喇叭',
        'threshold': 50,
        'img': 'https://ll4484.bvimg.com/21501/574224143f1996fb.png',
    },
    274: {
        'name': '人山人海',
        'describe': '发布100个大喇叭',
        'threshold': 100,
        'img': 'https://ll4484.bvimg.com/21501/d444762d5804dcb6.png',
    },
}

//隐藏成就数据
export const medalsHidden: medalsData = {
    //发起大乱斗没人接的次数 
    52: {
        'name': '透明人',
        'describe': '发起大乱斗100次没人接',
        'threshold': 100,
        'img': 'https://ll4484.bvimg.com/21501/0ef683a643112912.png',
    },

    //删楼次数
    62: {
        'name': '你是五嬷吗',
        'describe': '进行了100次删楼',
        'threshold': 100,
        'img': 'https://ll4484.bvimg.com/21501/7b7fe8abfacebdb6.png',
    },

    //使olo数量达到0
    71: {
        'name': '归零！',
        'describe': 'olo归零',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/4beb1314eabc90b7.png',
    },

    //抢到某楼的10000层
    91: {
        'name': '万中有一',
        'describe': '抢到第10000楼',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/491d9a587a869ff3.png',
    },

    //大乱斗掷出101点
    101: {
        'name': '元元的爱',
        'describe': '大乱斗掷出101点',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/ecd752e772088e90.png',
    },


    //大乱斗平局次数
    112: {
        'name': '火锅之神也被你薅秃了',
        'describe': '大乱斗平局100次',
        'threshold': 100,
        'img': 'https://ll4484.bvimg.com/21501/cbefc5c42f03c5aa.png',
    },

    //红包抢到0个olo
    121: {
        'name': '小火锅的负责人是个骗子',
        'describe': '红包抢到0个olo',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/4d4a7070baf1dc2c.png',
    },


    //申请一个定制饼干
    131: {
        'name': '个人财产+1',
        'describe': '申请1个定制饼干',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/05bd642f080af452.png',
    },

    //小火锅周年徽章
    151: {
        'name': '小火锅二周年',
        'describe': '我们要一直在一起 — 至少十年吧！',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/a587cbee37c720c4.png',
    },

    //23年国庆
    152: {
        'name': '国庆节快乐',
        'describe': '伟大的祖国节日快乐',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/87ff48253c971c14.png',
    },
    //24年春节
    153: {
        'name': '龙年快乐',
        'describe': '2024年小火锅龙年祝福',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/6126f591197b14fc.png',
    },
    //24年3周年
    154: {
        'name': '小火锅三周年快乐~！',
        'describe': '3.0也同时上线喔',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/b08141fb4d5daa6e.png',
    },
    //24年3.0纪念
    155: {
        'name': '小火锅3.0',
        'describe': '诶？我来测试咒岛3.0？真的假的？！',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/929f251b010486b0.png',
    },
    
    //画师荣誉徽章
    181: {
        'name': '皇家御用画宗',
        'describe': '大触快教教我画画',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/44e37a110cf56cc1.png',
    },


    //管理员荣誉徽章
    182: {
        'name': '小火锅守护者',
        'describe': '我来组成小火锅锅底！',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/f332ae15bee8da0e.png',
    },

    //小火锅终末旅行
    183: {
        'name': '小火锅终末旅行',
        'describe': '既有开始，必有终结',
        'threshold': 0,
        'img': 'https://ll4484.bvimg.com/21501/72ba15246f410175.png',
    },

    //表情包萌
    201: {
        'name': 'ac娘',
        'describe': '\\\\ ac娘，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://ll4484.bvimg.com/21501/51987958973582bd.png',
    },
    202: {
        'name': '鹦鹉鸡',
        'describe': '\\\\ 鹦鹉鸡，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://ll4484.bvimg.com/21501/1f0aad269a130090.png',
    },
    203: {
        'name': '咪子鱼',
        'describe': '\\\\ 咪子鱼，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://ll4484.bvimg.com/21501/ea12294bf6a058dc.png',
    },
    204: {
        'name': '小黑猫',
        'describe': '\\\\ 小黑猫，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://ll4484.bvimg.com/21501/6100f1fdf762d593.png',
    },
    205: {
        'name': '麻将脸',
        'describe': '\\\\ 麻将脸，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://ll4484.bvimg.com/21501/9e11c77cd9f72258.png',
    },
    206: {
        'name': '小恐龙',
        'describe': '\\\\ 小恐龙，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://ll4484.bvimg.com/21501/ca31e1ddd934a0bd.png',
    },
    207: {
        'name': 'TD猫',
        'describe': '\\\\ TD猫，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://ll4484.bvimg.com/21501/67c4009db05e3004.png',
    },
    208: {
        'name': '小豆泥',
        'describe': '\\\\ 小豆泥，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://ll4484.bvimg.com/21501/5d2b16a1735b04b3.png',
    },
    209: {
        'name': '小企鹅',
        'describe': '\\\\ 小企鹅，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://ll4484.bvimg.com/21501/62a714428c2a5730.png',
    },
    210: {
        'name': '小黄脸',
        'describe': '\\\\ 小黄脸，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://ll4484.bvimg.com/21501/b46413dadf7795a1.png',
    },
    211: {
        'name': 'FUFU',
        'describe': '\\\\ FUFU，出道！//',
        'threshold': 500, //这里指500票，50000个olo
        'img': 'https://ll4484.bvimg.com/21501/2ac7d7693e95d779.png',
    },
    212: {
        'name': '小火锅第一届表情包萌',
        'describe': '全军出击！',
        'threshold': 100, //这里指100票，10000个olo
        'img': 'https://ll4484.bvimg.com/21501/248ceb037a8afdd7.png',
    },
    213: {
        'name': '燃起来了！',
        'describe': '擦出爱的火花',
        'threshold': 1000, //这里指1000票，100000个olo
        'img': 'https://ll4484.bvimg.com/21501/b3bab29c7ac2d4b8.png',
    },
    214: {
        'name': '为冠军的小豆泥献上喝彩',
        'describe': '尊贵的小豆泥陛下火遍全球天下第一帝锅',
        'threshold': 0, //本命是小豆泥的全部饼干
        'img': 'https://ll4484.bvimg.com/21501/3e713357146f714e.png',
    },

    //银行提前支取累计
    251: {
        'name': '今朝有米今朝吃',
        'describe': '明日无米啃枯枝（提前开仓累计30w）',
        'threshold': 300000,
        'img': 'https://ll4484.bvimg.com/21501/ef265b195f6e46d2.png',
    },

    261: {
        'name': '小火锅第一届出道萌',
        'describe': '出道萌投票100票',
        'threshold': 100, //这里指100票，10000个olo
        'img': 'https://ll4484.bvimg.com/21501/7678c19451233589.png',
    },
    262: {
        'name': '成为大家的爱豆',
        'describe': '出道萌投票1000票',
        'threshold': 1000, //这里指1000票，100000个olo
        'img': 'https://ll4484.bvimg.com/21501/a6c2452bb00c3328.png',
    },
    263: {
        'name': '药药切克闹',
        'describe': '民推之光药水哥',
        'threshold': null,
        'img': 'https://ll4484.bvimg.com/21501/f65f77d44b43c785.png',
    },

    270: {
        'name': '吼那么大声干嘛啦',
        'describe': '撤回一个大喇叭',
        'threshold': null,
        'img': 'https://ll4484.bvimg.com/21501/8c79edeefd07bea7.png',
    },

}