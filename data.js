/* ==========================================================================
   AURUM 鎏金 · 独立设计奢品 —— 商品数据
   ========================================================================== */

window.STORE = {
    brand: "AURUM",
    brandCn: "鎏金",
    categories: [
        { id: "all", name: "全部" },
        { id: "watch", name: "腕表" },
        { id: "jewelry", name: "珠宝" },
        { id: "fragrance", name: "香氛" },
        { id: "leather", name: "皮具" },
        { id: "living", name: "生活" },
        { id: "audio", name: "聆听" }
    ],
    shipping: {
        standard: { id: "standard", name: "标准快递", price: 0, desc: "3–5 个工作日送达" },
        express: { id: "express", name: "顺丰特快", price: 25, desc: "1–2 个工作日送达" },
        same: { id: "same", name: "同城闪送", price: 39, desc: "当日 4 小时内送达" }
    },
    products: [
        {
            id: "p01", name: "曜金 Chronograph 计时腕表", en: "Chronograph 41mm",
            cat: "watch", glyph: "watch", price: 12800, orig: 15800, rating: 4.8, reviews: 128,
            stock: 12, badge: "hot",
            desc: "以 41mm 精钢表壳搭配烟熏金砂表盘，三眼计时与蓝宝石镜面，记录每一次值得铭刻的瞬间。",
            specs: [["表壳", "316L 精钢 / 41mm"], ["机芯", "自动机械 · 计时"], ["防水", "50 米"], ["表带", "意大利小牛皮"]]
        },
        {
            id: "p02", name: "晨曦 自动机械腕表", en: "Aurora Automatic 38mm",
            cat: "watch", glyph: "watch", price: 8600, orig: 0, rating: 4.9, reviews: 96,
            stock: 18, badge: "",
            desc: "38mm 圆润轮廓，温润拉丝表圈与象牙白珐琅盘，是日常与正式场合皆宜的克制之选。",
            specs: [["表壳", "316L 精钢 / 38mm"], ["机芯", "自动机械 · 40h 动储"], ["防水", "30 米"], ["表带", "米兰尼斯钢带"]]
        },
        {
            id: "p03", name: "星轨 情侣对表套组", en: "Orbit Pair Set",
            cat: "watch", glyph: "watch", price: 15600, orig: 18800, rating: 4.7, reviews: 64,
            stock: 8, badge: "new",
            desc: "两枚相映成趣的腕表，表背刻有星轨纹样，作为承诺的见证，亦可自成一体。",
            specs: [["表壳", "精钢 / 男 40mm · 女 32mm"], ["机芯", "石英 + 机械"], ["防水", "50 米"], ["附赠", "星轨礼盒"]]
        },
        {
            id: "p04", name: "月相 钻石耳环", en: "Lunar Diamond Earrings",
            cat: "jewelry", glyph: "diamond", price: 9900, orig: 0, rating: 4.9, reviews: 210,
            stock: 15, badge: "",
            desc: "新月造型镶嵌培育钻石，随光线流转微光，轻盈贴合耳畔，是低调却无法忽视的存在。",
            specs: [["材质", "18K 金 · 培育钻石"], ["钻石", "共 0.6ct"], ["工艺", "手工镶嵌"], ["包装", "丝绒首饰盒"]]
        },
        {
            id: "p05", name: "银河 星钻项链", en: "Galaxy Star Necklace",
            cat: "jewelry", glyph: "necklace", price: 6800, orig: 7800, rating: 5.0, reviews: 158,
            stock: 20, badge: "hot",
            desc: "一条细链，坠以星芒切割主石，随锁骨起伏闪烁，为极简造型注入恰到好处的华彩。",
            specs: [["材质", "18K 镀金 · 锆石"], ["链长", "45cm 可调"], ["主石", "星芒切割 8mm"], ["重量", "约 3.2g"]]
        },
        {
            id: "p06", name: "流光 925 银素圈戒指", en: "Flow Silver Ring",
            cat: "jewelry", glyph: "ring", price: 2300, orig: 0, rating: 4.6, reviews: 87,
            stock: 32, badge: "",
            desc: "一枚素圈，以拉丝与镜面两种工艺拼接，简洁中暗藏细节，适合叠戴亦适合独戴。",
            specs: [["材质", "925 银 · 镀铑"], ["宽度", "4mm"], ["尺码", "12–20 号"], ["包装", "绒布袋"]]
        },
        {
            id: "p07", name: "暗夜 乌木沉香香水 50ml", en: "Nocturne Oud EDP",
            cat: "fragrance", glyph: "perfume", price: 1280, orig: 1580, rating: 4.8, reviews: 320,
            stock: 40, badge: "hot",
            desc: "前调是微苦的佛手柑，中调沉入乌木与玫瑰，尾调以琥珀与麝香收束——一段适合夜晚的叙事。",
            specs: [["香调", "木质东方调"], ["容量", "50ml"], ["留香", "约 8 小时"], ["产地", "法国"]]
        },
        {
            id: "p08", name: "鎏金 琥珀乌木淡香精", en: "Amber Oud Extraits",
            cat: "fragrance", glyph: "perfume", price: 1580, orig: 0, rating: 4.7, reviews: 142,
            stock: 26, badge: "",
            desc: "浓郁琥珀包裹乌木，温暖而深邃，恰到好处的厚度让香气在冬日里格外熨帖。",
            specs: [["香调", "琥珀木质调"], ["容量", "50ml"], ["留香", "约 10 小时"], ["浓度", "香精 EDP"]]
        },
        {
            id: "p09", name: "雪松 极简办公包", en: "Cedar Minimal Tote",
            cat: "leather", glyph: "bag", price: 4200, orig: 4800, rating: 4.9, reviews: 76,
            stock: 10, badge: "",
            desc: "头层牛皮与极简线条，刚好装下 14 寸笔记本与一日所需，挺括却不失柔软。",
            specs: [["材质", "头层牛皮"], ["尺寸", "34×28×12cm"], ["容量", "14 寸笔记本"], ["五金", "做旧黄铜"]]
        },
        {
            id: "p10", name: "墨金 手工缝制钱包", en: "Ink Gold Wallet",
            cat: "leather", glyph: "wallet", price: 1980, orig: 0, rating: 4.8, reviews: 98,
            stock: 24, badge: "",
            desc: "植鞣革经手工缝制，内衬暗纹压印，使用越久，皮面越显独一无二的光泽。",
            specs: [["材质", "植鞣头层牛皮"], ["结构", "8 卡位 + 2 钞位"], ["工艺", "手工马鞍缝"], ["尺寸", "11×9cm"]]
        },
        {
            id: "p11", name: "暖屿 黄铜台灯", en: "Warm Isle Brass Lamp",
            cat: "living", glyph: "lamp", price: 3600, orig: 0, rating: 4.7, reviews: 54,
            stock: 9, badge: "new",
            desc: "黄铜灯身会随岁月氧化出温润包浆，暖光穿过磨砂灯罩，为夜晚留一方安静。",
            specs: [["材质", "黄铜 + 磨砂玻璃"], ["光源", "暖白 2700K"], ["尺寸", "高 42cm"], ["电源", "插电 · 触控"]]
        },
        {
            id: "p12", name: "极简 香薰蜡烛礼盒", en: "Minimal Candle Set",
            cat: "living", glyph: "candle", price: 880, orig: 0, rating: 4.9, reviews: 233,
            stock: 50, badge: "hot",
            desc: "三支组合装：雪松、白茶、无花果，天然大豆蜡与棉芯，燃烧干净而绵长。",
            specs: [["成分", "天然大豆蜡"], ["容量", "180g × 3"], ["燃烧", "约 40 小时/支"], ["包装", "礼盒装"]]
        },
        {
            id: "p13", name: "声临 无线降噪耳机", en: "Echo ANC Headphones",
            cat: "audio", glyph: "headphone", price: 2880, orig: 3280, rating: 4.8, reviews: 187,
            stock: 30, badge: "new",
            desc: "自适应主动降噪与 40 小时续航，金属与素皮拼接的头梁，让声音与克制一同抵达。",
            specs: [["降噪", "自适应 ANC"], ["续航", "40 小时"], ["连接", "蓝牙 5.3"], ["重量", "268g"]]
        },
        {
            id: "p14", name: "韵律 便携蓝牙音箱", en: "Rhythm Portable Speaker",
            cat: "audio", glyph: "speaker", price: 1680, orig: 0, rating: 4.6, reviews: 112,
            stock: 22, badge: "",
            desc: "掌心大小的金属箱体，360° 环绕声场，IPX7 防水，把恰到好处的声音带到任何地方。",
            specs: [["声场", "360° 环绕"], ["防水", "IPX7"], ["续航", "18 小时"], ["尺寸", "Ø 9cm"]]
        }
    ]
};
