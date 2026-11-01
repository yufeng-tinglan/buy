/* ==========================================================================
   AURUM 鎏金 · 电商独立站 · 应用逻辑
   浏览 → 选购 → 登录 → 下单 → 支付 → 物流（本地模拟）
   ========================================================================== */
(function () {
    'use strict';

    const STORE = window.STORE;
    const $ = id => document.getElementById(id);
    const $$ = sel => Array.prototype.slice.call(document.querySelectorAll(sel));

    /* ---------------------------------------------------------------- 图标 */
    const ICONS = {
        cartSm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
        close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
        box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></svg>',
        spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9"/></svg>',
        pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        boxCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><polyline points="8 12 11 15 16 10"/></svg>'
    };

    /* ---------------------------------------------------------------- 商品图形 */
    const GLYPHS = {
        watch: '<rect x="26" y="6" width="12" height="10" rx="2.5"/><rect x="26" y="48" width="12" height="10" rx="2.5"/><circle cx="32" cy="32" r="15"/><path d="M32 32V23"/><path d="M32 32l6 4"/><circle cx="32" cy="32" r="1.6" fill="#b8860b" stroke="none"/>',
        diamond: '<path d="M18 26 32 13 46 26 32 53Z"/><path d="M18 26h28"/><path d="M26 26 32 13 38 26"/><path d="M26 26 32 53 38 26"/>',
        necklace: '<path d="M16 11c0 18 7 27 16 27s16-9 16-27"/><path d="M32 38 38 44 32 52 26 44Z"/><path d="M26 44h12"/>',
        ring: '<circle cx="32" cy="40" r="12"/><path d="M27 28 32 21 37 28 32 35Z"/>',
        perfume: '<rect x="23" y="26" width="18" height="26" rx="3.5"/><rect x="28" y="16" width="8" height="8" rx="1.6"/><path d="M30 16v-4h4v4"/><path d="M32 38v6"/>',
        bag: '<rect x="17" y="26" width="30" height="24" rx="3.5"/><path d="M23 26v-5a9 9 0 0 1 18 0v5"/><path d="M17 34h30"/>',
        wallet: '<rect x="15" y="22" width="34" height="22" rx="3.5"/><path d="M15 29h34"/><circle cx="41" cy="37" r="2"/>',
        lamp: '<path d="M24 14h16l5 13H19Z"/><path d="M32 27v22"/><path d="M22 52h20"/><path d="M29 14v-3h6v3"/>',
        candle: '<rect x="23" y="26" width="18" height="24" rx="2.5"/><path d="M32 26v-6"/><path d="M32 12c2.6 3.5 2.6 5.6 0 8-2.6-2.4-2.6-4.5 0-8Z"/>',
        headphone: '<path d="M15 34v-2a17 17 0 0 1 34 0v2"/><rect x="11" y="33" width="9" height="15" rx="4.5"/><rect x="44" y="33" width="9" height="15" rx="4.5"/>',
        speaker: '<rect x="21" y="12" width="22" height="40" rx="7"/><circle cx="32" cy="29" r="6"/><circle cx="32" cy="29" r="1.6" fill="#b8860b" stroke="none"/><circle cx="32" cy="42" r="2.6"/>'
    };

    const STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.1 8.6 22 9.3 16.8 14 18.2 21 12 17.3 5.8 21 7.2 14 2 9.3 8.9 8.6"/></svg>';

    const TRACK_STEPS = ['已下单', '已付款', '已发货', '运输中', '派送中', '已签收'];

    const DIAL_CODES = [
        { code: '+86', name: '中国大陆' },
        { code: '+852', name: '中国香港' },
        { code: '+853', name: '中国澳门' },
        { code: '+886', name: '中国台湾' },
        { code: '+1', name: '美国 / 加拿大' },
        { code: '+44', name: '英国' },
        { code: '+49', name: '德国' },
        { code: '+33', name: '法国' },
        { code: '+39', name: '意大利' },
        { code: '+81', name: '日本' },
        { code: '+82', name: '韩国' },
        { code: '+65', name: '新加坡' },
        { code: '+60', name: '马来西亚' },
        { code: '+61', name: '澳大利亚' },
        { code: '+91', name: '印度' },
        { code: '+7', name: '俄罗斯' }
    ];

    function dialOptions() {
        return DIAL_CODES.map(function (d) {
            return '<option value="' + d.code + '">' + d.code + ' ' + d.name + '</option>';
        }).join('');
    }

    function phoneValid(phone, dial) {
        if (dial === '+86') return /^1\d{10}$/.test(phone);
        return /^\d{6,15}$/.test(phone);
    }

    /* ---------------------------------------------------------------- 状态 */
    const state = {
        cart: [],
        user: null,
        orders: [],
        category: 'all',
        sort: 'featured',
        query: ''
    };
    let co = null;            // 结算流程状态
    let currentProduct = null;
    let pmQty = 1;

    /* ---------------------------------------------------------------- 工具 */
    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    function fmt(n) { return Number(n).toLocaleString('zh-CN'); }
    function productById(id) { return STORE.products.find(p => p.id === id) || null; }
    function catName(id) {
        const c = STORE.categories.find(c => c.id === id);
        return c ? c.name : id;
    }
    function glyphSvg(key) {
        return '<svg viewBox="0 0 64 64" fill="none" stroke="#b8860b" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' + (GLYPHS[key] || '') + '</svg>';
    }
    function starsHtml(rating) {
        let s = '<span class="stars">';
        for (let i = 1; i <= 5; i++) s += '<span class="' + (i <= Math.round(rating) ? 'star-on' : 'star-off') + '">' + STAR + '</span>';
        return s + '</span>';
    }
    function nowStr() {
        const d = new Date();
        const p = n => String(n).padStart(2, '0');
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    }

    /* ---------------------------------------------------------------- 持久化 */
    function load() {
        try {
            const c = JSON.parse(localStorage.getItem('aurum_cart') || '[]');
            if (Array.isArray(c)) state.cart = c.filter(x => x && productById(x.id));
        } catch (e) {}
        try { state.user = JSON.parse(localStorage.getItem('aurum_user') || 'null'); } catch (e) {}
        try {
            const o = JSON.parse(localStorage.getItem('aurum_orders') || '[]');
            if (Array.isArray(o)) state.orders = o;
        } catch (e) {}
    }
    function saveCart() { try { localStorage.setItem('aurum_cart', JSON.stringify(state.cart)); } catch (e) {} }
    function saveUser() { try { localStorage.setItem('aurum_user', JSON.stringify(state.user)); } catch (e) {} }
    function saveOrders() { try { localStorage.setItem('aurum_orders', JSON.stringify(state.orders)); } catch (e) {} }

    /* ---------------------------------------------------------------- Toast */
    let toastTimer;
    function toast(msg) {
        const t = $('toast');
        if (!t) return;
        clearTimeout(toastTimer);
        t.innerHTML = ICONS.check + '<span>' + escapeHtml(msg) + '</span>';
        t.classList.add('show');
        toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
    }

    /* ---------------------------------------------------------------- 遮罩开关 */
    function openMask(mask) { if (mask) mask.classList.add('visible'); }
    function closeMask(mask) { if (mask) mask.classList.remove('visible'); }

    /* ================================================================
       渲染：Hero 主推
       ================================================================ */
    function renderFeatured() {
        const p = STORE.products[0];
        const card = $('featuredCard');
        if (card) card.innerHTML = glyphSvg(p.glyph);
        const fp = $('featuredPrice');
        if (fp) fp.textContent = '¥ ' + fmt(p.price);
    }

    /* ================================================================
       渲染：分类 + 商品
       ================================================================ */
    function renderCategories() {
        const host = $('categoryChips');
        if (!host) return;
        host.innerHTML = STORE.categories.map(c =>
            '<button class="chip-btn' + (state.category === c.id ? ' active' : '') + '" data-cat="' + c.id + '" role="tab">' + escapeHtml(c.name) + '</button>'
        ).join('');
    }

    function productCardHtml(p) {
        const badge = p.badge
            ? '<span class="product-badge ' + (p.badge === 'hot' ? 'hot' : '') + '">' + (p.badge === 'hot' ? '热卖' : '新品') + '</span>'
            : '';
        return '<article class="product-card reveal" data-id="' + p.id + '">' +
            '<div class="product-visual">' + badge + glyphSvg(p.glyph) + '</div>' +
            '<div class="product-body">' +
                '<div class="product-cat">' + escapeHtml(catName(p.cat)) + '</div>' +
                '<h3 class="product-name">' + escapeHtml(p.name) + '</h3>' +
                '<div class="product-rating">' + starsHtml(p.rating) + '<span>' + p.rating.toFixed(1) + ' · ' + p.reviews + ' 条评价</span></div>' +
                '<div class="product-price-row">' +
                    '<span class="product-price">' + fmt(p.price) + '</span>' +
                    (p.orig ? '<span class="product-orig">¥' + fmt(p.orig) + '</span>' : '') +
                '</div>' +
                '<button class="product-add" data-add="' + p.id + '">' + ICONS.cartSm + '<span>加入购物车</span></button>' +
            '</div>' +
        '</article>';
    }

    function currentList() {
        let list = STORE.products.filter(p => state.category === 'all' || p.cat === state.category);
        if (state.query) {
            const q = state.query.toLowerCase();
            list = list.filter(p => (p.name + ' ' + p.en + ' ' + p.desc + ' ' + catName(p.cat)).toLowerCase().indexOf(q) > -1);
        }
        if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
        else if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
        else if (state.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
        return list;
    }

    function renderProducts() {
        const host = $('productGrid');
        if (!host) return;
        const list = currentList();
        host.innerHTML = list.map(productCardHtml).join('');
        const empty = $('emptyState');
        if (empty) empty.hidden = list.length !== 0;
        observeReveals(host);
    }

    /* ================================================================
       渲染：购物车徽标 / 用户
       ================================================================ */
    function cartCount() { return state.cart.reduce((s, x) => s + x.qty, 0); }

    function renderCartBadge() {
        const badge = $('cartCount');
        if (!badge) return;
        const n = cartCount();
        badge.textContent = n;
        badge.classList.toggle('show', n > 0);
    }

    function renderPlusEntry() {
        const btn = $('plusEntry');
        if (!btn) return;
        const isMember = !!(state.user && state.user.role === 'member');
        btn.innerHTML = isMember
            ? '<span class="hp-full">PLUS+ 会员</span><span class="hp-short">PLUS+</span>'
            : '<span class="hp-full">成为 PLUS+ 会员</span><span class="hp-short">PLUS+</span>';
        btn.classList.toggle('is-member', isMember);
    }

    function renderUser() {
        const host = $('userArea');
        if (!host) return;
        if (state.user) {
            const isMember = state.user.role === 'member';
            host.innerHTML =
                '<button class="user-btn" id="userMenuBtn" aria-label="账户">' +
                    '<span class="avatar" id="userAvatar">' + escapeHtml(state.user.name.slice(0, 1).toUpperCase()) + '</span>' +
                    '<span class="user-name" id="userName">' + escapeHtml(state.user.name) + '</span>' +
                    (isMember ? '<span class="role-tag">会员</span>' : '') +
                '</button>';
        } else {
            host.innerHTML =
                '<button class="entry-link" data-entry="normal"><span class="el-main">普通用户</span><span class="el-sub">注册 / 登录</span></button>' +
                '<button class="entry-link" data-entry="member"><span class="el-main">会员登录</span></button>';
        }
        renderPlusEntry();
    }

    /* ================================================================
       渲染：购物车抽屉
       ================================================================ */
    function renderCartDrawer() {
        const body = $('cartBody');
        const foot = $('cartFoot');
        const titleCount = $('cartTitleCount');
        if (!body || !foot) return;

        const items = state.cart.map(ci => ({ id: ci.id, qty: ci.qty, p: productById(ci.id) })).filter(x => x.p);
        if (titleCount) titleCount.textContent = items.reduce((s, x) => s + x.qty, 0) + ' 件';

        if (!items.length) {
            body.innerHTML = '<div class="cart-empty">' + ICONS.cartSm + '<div>购物车还是空的</div><div style="font-size:0.82rem;margin-top:0.3rem;color:var(--tx-4)">去挑选一件心动之物吧</div></div>';
            foot.innerHTML = '';
            return;
        }

        body.innerHTML = items.map(x =>
            '<div class="cart-item">' +
                '<div class="cart-thumb">' + glyphSvg(x.p.glyph) + '</div>' +
                '<div class="cart-info">' +
                    '<div class="ci-name">' + escapeHtml(x.p.name) + '</div>' +
                    '<div class="ci-price">¥' + fmt(x.p.price) + '</div>' +
                    '<div class="cart-line">' +
                        '<div class="qty">' +
                            '<button data-q="-1" data-id="' + x.id + '" aria-label="减少">−</button>' +
                            '<span>' + x.qty + '</span>' +
                            '<button data-q="1" data-id="' + x.id + '" aria-label="增加">+</button>' +
                        '</div>' +
                        '<button class="cart-remove" data-remove="' + x.id + '">移除</button>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).join('');

        const subtotal = items.reduce((s, x) => s + x.p.price * x.qty, 0);
        foot.innerHTML =
            '<div class="cart-summary">' +
                '<div class="cart-row"><span>商品小计</span><span>¥' + fmt(subtotal) + '</span></div>' +
                '<div class="cart-row"><span>运费</span><span>满 ¥599 免运费</span></div>' +
                '<div class="cart-row total"><span>合计</span><b>¥' + fmt(subtotal) + '</b></div>' +
            '</div>' +
            '<button class="btn btn-primary btn-block" id="goCheckout">' + ICONS.box + ' 去结算</button>';
        const go = $('goCheckout');
        if (go) go.addEventListener('click', requestCheckout);
    }

    /* ================================================================
       购物车操作
       ================================================================ */
    function addToCart(id, qty) {
        const p = productById(id);
        if (!p) return;
        const line = state.cart.find(x => x.id === id);
        if (line) line.qty = Math.min(p.stock, line.qty + (qty || 1));
        else state.cart.push({ id: id, qty: Math.min(p.stock, qty || 1) });
        saveCart();
        renderCartBadge();
        renderCartDrawer();
        bounceBadge();
    }
    function setQty(id, qty) {
        const p = productById(id);
        const line = state.cart.find(x => x.id === id);
        if (!line) return;
        line.qty = Math.max(1, Math.min(p ? p.stock : 99, qty));
        saveCart();
        renderCartBadge();
        renderCartDrawer();
    }
    function removeFromCart(id) {
        state.cart = state.cart.filter(x => x.id !== id);
        saveCart();
        renderCartBadge();
        renderCartDrawer();
        toast('已从购物车移除');
    }
    function cartSubtotal() {
        return state.cart.reduce((s, x) => {
            const p = productById(x.id);
            return s + (p ? p.price * x.qty : 0);
        }, 0);
    }
    function bounceBadge() {
        const b = $('cartCount');
        if (!b) return;
        b.classList.remove('pop');
        void b.offsetWidth;
        b.classList.add('pop');
    }

    /* ================================================================
       商品详情弹窗
       ================================================================ */
    function openProduct(id) {
        const p = productById(id);
        if (!p) return;
        currentProduct = p;
        pmQty = 1;
        renderProductModal();
        openMask($('productMask'));
    }
    function closeProduct() { closeMask($('productMask')); }

    function renderProductModal() {
        const p = currentProduct;
        const m = $('productModal');
        if (!p || !m) return;
        const badge = p.badge
            ? '<span class="product-badge ' + (p.badge === 'hot' ? 'hot' : '') + '">' + (p.badge === 'hot' ? '热卖' : '新品') + '</span>'
            : '';
        m.innerHTML =
            '<button class="modal-close" data-act="close">' + ICONS.close + '</button>' +
            '<div class="pm-grid">' +
                '<div class="pm-visual">' + badge + glyphSvg(p.glyph) + '</div>' +
                '<div class="pm-info">' +
                    '<div class="pm-cat">' + escapeHtml(catName(p.cat)) + '</div>' +
                    '<h2 class="pm-name">' + escapeHtml(p.name) + '</h2>' +
                    '<div class="pm-rating">' + starsHtml(p.rating) + '<span>' + p.rating.toFixed(1) + ' · ' + p.reviews + ' 条评价</span></div>' +
                    '<div class="pm-price-row"><span class="pm-price">' + fmt(p.price) + '</span>' + (p.orig ? '<span class="pm-orig">¥' + fmt(p.orig) + '</span>' : '') + '</div>' +
                    '<p class="pm-desc">' + escapeHtml(p.desc) + '</p>' +
                    '<div class="pm-specs">' + p.specs.map(s => '<div class="pm-spec"><span class="k">' + escapeHtml(s[0]) + '</span><span class="v">' + escapeHtml(s[1]) + '</span></div>').join('') + '</div>' +
                    '<div class="pm-buy">' +
                        '<div class="pm-stock">库存 <b>' + p.stock + '</b> 件</div>' +
                        '<div class="pm-qty-row">' +
                            '<label>数量</label>' +
                            '<div class="qty"><button data-q="-1" data-id="' + p.id + '">−</button><span id="pmQtyVal">' + pmQty + '</span><button data-q="1" data-id="' + p.id + '">+</button></div>' +
                        '</div>' +
                        '<div class="pm-buttons">' +
                            '<button class="btn" data-act="add">' + ICONS.cartSm + ' 加入购物车</button>' +
                            '<button class="btn btn-primary" data-act="buy">立即购买</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    /* ================================================================
       登录 / 注册
       ================================================================ */
    let authMode = 'login';
    let authRole = 'normal';
    let authMsg = '';
    let smsCode = '';
    let smsPhone = '';
    let smsCountdown = 0;
    let smsTimer = null;
    let captchaCode = '';

    function applyAuthState() {
        const authView = $('authView');
        const shopView = $('shopView');
        const loggedIn = !!state.user;
        if (authView) authView.hidden = loggedIn;
        if (shopView) shopView.hidden = !loggedIn;
        if (loggedIn) {
            renderUser();
            renderOrders();
            renderCartBadge();
            window.scrollTo(0, 0);
        } else {
            authMode = 'login';
            authRole = 'normal';
            authMsg = '';
            renderUser();
            renderOrders();
            renderAuthForm();
        }
    }

    function authRefreshSvg() {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>';
    }

    function renderAuthForm() {
        const host = $('authCard');
        if (!host) return;
        if (!host.querySelector('.role-switch')) {
            host.innerHTML =
                '<div class="role-switch">' +
                    '<button class="role-opt" data-role="normal">普通用户</button>' +
                    '<button class="role-opt" data-role="member">会员用户</button>' +
                '</div>' +
                '<div class="auth-body" id="authBody"></div>';
        }
        const isMember = authRole === 'member';
        Array.prototype.forEach.call(host.querySelectorAll('.role-opt'), function (btn) {
            btn.classList.toggle('active', btn.dataset.role === authRole);
        });

        const phoneField =
            '<div class="field"><label>手机号</label>' +
                '<div class="phone-row">' +
                    '<div class="dial-wrap"><select id="authDial" aria-label="国家/地区区号">' + dialOptions() + '</select></div>' +
                    '<input id="authPhone" placeholder="11 位手机号" autocomplete="tel" inputmode="numeric" maxlength="15">' +
                '</div>' +
            '</div>';
        const smsField =
            '<div class="field"><label>手机验证码</label>' +
                '<div class="field-inline">' +
                    '<input id="authSms" placeholder="6 位短信验证码" maxlength="6" inputmode="numeric" autocomplete="one-time-code">' +
                    '<button class="code-btn" id="sendSmsBtn" type="button">获取验证码</button>' +
                '</div>' +
                '<div class="code-hint" id="smsHint"></div>' +
            '</div>';

        let body;
        if (isMember) {
            body = '<h2 class="auth-title">会员专属登录</h2>' +
                '<p class="auth-sub">' + escapeHtml(authMsg || '出示您的会员身份，继续 AURUM 的私享服务') + '</p>' +
                '<div class="field"><label>会员编号 / 手机号</label><input id="authName" placeholder="例如 AURUM-VIP" autocomplete="username"></div>' +
                '<div class="field"><label>密码</label><input id="authPass" type="password" placeholder="请输入会员密码" autocomplete="current-password"></div>' +
                '<button class="btn btn-primary btn-block" id="authSubmit">进入会员中心</button>' +
                '<p class="auth-note">会员账号由 AURUM 邀请开通；演示环境可填写任意非空信息。</p>';
        } else if (authMode === 'sms') {
            body = '<h2 class="auth-title">短信验证码登录</h2>' +
                '<p class="auth-sub">' + escapeHtml(authMsg || '无需密码，使用手机验证码快速登录') + '</p>' +
                phoneField + smsField +
                '<button class="btn btn-primary btn-block" id="authSubmit">登录</button>' +
                '<div class="auth-links">' +
                    '<button class="auth-link" data-mode="login">使用密码登录</button>' +
                    '<span class="auth-links-sep">·</span>' +
                    '<button class="auth-link" data-mode="reset">忘记密码</button>' +
                '</div>' +
                '<p class="auth-note">演示环境：验证码显示在输入框下方。</p>';
        } else if (authMode === 'reset') {
            body = '<h2 class="auth-title">找回密码</h2>' +
                '<p class="auth-sub">' + escapeHtml(authMsg || '验证手机号后即可重置密码') + '</p>' +
                phoneField + smsField +
                '<div class="field"><label>新密码</label><input id="authPass" type="password" placeholder="8–16 位英文、数字或符号" maxlength="16" autocomplete="new-password"></div>' +
                '<div class="field"><label>再次确认密码</label><input id="authPass2" type="password" placeholder="请再次输入密码" maxlength="16" autocomplete="new-password"></div>' +
                '<button class="btn btn-primary btn-block" id="authSubmit">重置密码</button>' +
                '<div class="auth-links"><button class="auth-link" data-mode="login">返回登录</button></div>' +
                '<p class="auth-note">演示环境：验证码显示在输入框下方。</p>';
        } else if (authMode === 'register') {
            body = '<h2 class="auth-title">开启 AURUM 之旅</h2>' +
                '<p class="auth-sub">' + escapeHtml(authMsg || '注册后即可开启选购与订单服务') + '</p>' +
                '<div class="auth-tabs">' +
                    '<button class="auth-tab" data-mode="login">登录</button>' +
                    '<button class="auth-tab active" data-mode="register">注册</button>' +
                '</div>' +
                '<div class="field"><label>昵称</label><input id="authName" placeholder="英文字母或下划线，如 aurum_user" autocomplete="nickname" title="仅限英文字母与下划线"></div>' +
                phoneField + smsField +
                '<div class="field"><label>图片验证码</label>' +
                    '<div class="field-inline">' +
                        '<canvas class="captcha-canvas" id="captchaCanvas" width="120" height="42"></canvas>' +
                        '<input id="authCaptcha" placeholder="输入图中字符" maxlength="4" autocomplete="off">' +
                        '<button class="captcha-refresh" id="captchaRefresh" type="button" title="换一张" aria-label="换一张">' + authRefreshSvg() + '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="field"><label>密码</label><input id="authPass" type="password" placeholder="8–16 位英文、数字或符号" maxlength="16" autocomplete="new-password"></div>' +
                '<div class="field"><label>再次确认密码</label><input id="authPass2" type="password" placeholder="请再次输入密码" maxlength="16" autocomplete="new-password"></div>' +
                '<button class="btn btn-primary btn-block" id="authSubmit">创建账户</button>' +
                '<p class="auth-note">演示环境：短信验证码显示在输入框下方，图片验证码可点击右侧刷新。</p>';
        } else {
            body = '<h2 class="auth-title">欢迎回来</h2>' +
                '<p class="auth-sub">' + escapeHtml(authMsg || '登录后即可浏览与选购臻品') + '</p>' +
                '<div class="auth-tabs">' +
                    '<button class="auth-tab active" data-mode="login">登录</button>' +
                    '<button class="auth-tab" data-mode="register">注册</button>' +
                '</div>' +
                '<div class="field"><label>昵称 / 手机号</label><input id="authName" autocomplete="username"></div>' +
                '<div class="field"><label>密码</label><input id="authPass" type="password" autocomplete="current-password"></div>' +
                '<div class="auth-forgot"><button class="auth-link" data-mode="reset">忘记密码</button></div>' +
                '<button class="btn btn-primary btn-block" id="authSubmit">登录</button>' +
                '<div class="auth-links"><button class="auth-link" data-mode="sms">手机号验证码登录</button></div>' +
                '<p class="auth-note">本站为演示环境，<b>任意非空信息</b>即可登录；数据仅保存在你的浏览器本地。</p>';
        }

        const bodyHost = $('authBody');
        bodyHost.innerHTML = body;
        bodyHost.classList.remove('animate');
        void bodyHost.offsetWidth;
        bodyHost.classList.add('animate');

        if (isMember) return;
        if (authMode === 'register') drawCaptcha();
        if (authMode === 'register' || authMode === 'sms' || authMode === 'reset') {
            updateSmsBtn();
            const hint = $('smsHint');
            if (hint && smsCode) hint.textContent = '演示验证码：' + smsCode;
        }
    }

    function doAuth() {
        const nameEl = $('authName');
        const passEl = $('authPass');
        const name = nameEl ? nameEl.value.trim() : '';
        const pass = passEl ? passEl.value.trim() : '';

        if (authRole === 'member') {
            if (!name) { toast('请输入会员编号或手机号'); return; }
            if (pass.length < 4) { toast('密码至少 4 位'); return; }
            state.user = { name: name, phone: '', role: 'member', since: nowStr() };
            saveUser();
            toast('会员登录成功，' + name);
            applyAuthState();
            return;
        }

        if (authMode === 'sms') {
            const dialEl = $('authDial');
            const dial = dialEl ? dialEl.value : '+86';
            const phEl = $('authPhone');
            const phone = phEl ? phEl.value.trim() : '';
            if (!phoneValid(phone, dial)) { toast(dial === '+86' ? '请输入有效的 11 位手机号' : '请输入有效的手机号'); return; }
            const smsEl = $('authSms');
            const sms = smsEl ? smsEl.value.trim() : '';
            if (!sms) { toast('请填写手机验证码'); return; }
            if (!smsCode || smsPhone !== (dial + phone)) { toast('请先获取手机验证码'); return; }
            if (sms !== smsCode) { toast('手机验证码不正确'); return; }
            state.user = { name: phone, phone: phone, dial: dial, role: 'normal', since: nowStr() };
            saveUser();
            toast('登录成功，' + phone);
            applyAuthState();
            return;
        }

        if (authMode === 'reset') {
            const dialEl = $('authDial');
            const dial = dialEl ? dialEl.value : '+86';
            const phEl = $('authPhone');
            const phone = phEl ? phEl.value.trim() : '';
            if (!phoneValid(phone, dial)) { toast(dial === '+86' ? '请输入有效的 11 位手机号' : '请输入有效的手机号'); return; }
            const smsEl = $('authSms');
            const sms = smsEl ? smsEl.value.trim() : '';
            if (!sms) { toast('请填写手机验证码'); return; }
            if (!smsCode || smsPhone !== (dial + phone)) { toast('请先获取手机验证码'); return; }
            if (sms !== smsCode) { toast('手机验证码不正确'); return; }
            const passEl = $('authPass');
            const pass = passEl ? passEl.value.trim() : '';
            const pass2El = $('authPass2');
            const pass2 = pass2El ? pass2El.value.trim() : '';
            if (!/^[\x21-\x7E]{8,16}$/.test(pass)) { toast('密码需为 8–16 位英文、数字或符号'); return; }
            if (pass2 !== pass) { toast('两次输入的密码不一致'); return; }
            toast('密码已重置，请使用新密码登录');
            authMode = 'login';
            authMsg = '';
            renderAuthForm();
            return;
        }

        let phone = '';
        let dial = '+86';
        if (authMode === 'register') {
            const dialEl = $('authDial');
            dial = dialEl ? dialEl.value : '+86';
            const phEl = $('authPhone');
            phone = phEl ? phEl.value.trim() : '';
            if (!phoneValid(phone, dial)) { toast(dial === '+86' ? '请输入有效的 11 位手机号' : '请输入有效的手机号'); return; }
            const smsEl = $('authSms');
            const sms = smsEl ? smsEl.value.trim() : '';
            if (!sms) { toast('请填写手机验证码'); return; }
            if (!smsCode || smsPhone !== (dial + phone)) { toast('请先获取手机验证码'); return; }
            if (sms !== smsCode) { toast('手机验证码不正确'); return; }
            const capEl = $('authCaptcha');
            const cap = capEl ? capEl.value.trim() : '';
            if (!cap) { toast('请输入图片验证码'); return; }
            if (cap.toUpperCase() !== captchaCode) { toast('图片验证码不正确，请重试'); drawCaptcha(); return; }
        }
        if (!name) { toast('请填写昵称'); return; }
        if (authMode === 'register' && !/^[A-Za-z_]+$/.test(name)) { toast('昵称只能使用英文字母和下划线'); return; }
        if (authMode === 'register') {
            const pass2El = $('authPass2');
            const pass2 = pass2El ? pass2El.value.trim() : '';
            if (!/^[\x21-\x7E]{8,16}$/.test(pass)) { toast('密码需为 8–16 位英文、数字或符号'); return; }
            if (pass2 !== pass) { toast('两次输入的密码不一致'); return; }
        } else if (!pass) {
            toast('请输入密码');
            return;
        }
        state.user = { name: name, phone: phone, dial: dial, role: 'normal', since: nowStr() };
        saveUser();
        toast((authMode === 'register' ? '注册成功，' : '欢迎回来，') + name);
        applyAuthState();
    }

    /* 图片验证码：canvas 生成扭曲字符 */
    function drawCaptcha() {
        const canvas = $('captchaCanvas');
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
        captchaCode = code;
        if (!canvas) return;
        let ctx = null;
        try { ctx = canvas.getContext('2d'); } catch (e) { ctx = null; }
        if (!ctx) return;
        const w = 120, h = 42;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#f2ead9';
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = 'rgba(154,123,63,' + (0.15 + Math.random() * 0.35).toFixed(2) + ')';
            ctx.beginPath();
            ctx.moveTo(Math.random() * w, Math.random() * h);
            ctx.lineTo(Math.random() * w, Math.random() * h);
            ctx.stroke();
        }
        for (let i = 0; i < 28; i++) {
            ctx.fillStyle = 'rgba(28,26,23,' + (0.08 + Math.random() * 0.25).toFixed(2) + ')';
            ctx.beginPath();
            ctx.arc(Math.random() * w, Math.random() * h, 0.6 + Math.random(), 0, Math.PI * 2);
            ctx.fill();
        }
        const colors = ['#7a5c22', '#3b372f', '#9a7b3f', '#1c1a17'];
        for (let i = 0; i < code.length; i++) {
            ctx.save();
            const fs = 20 + Math.random() * 6;
            ctx.font = '700 ' + fs + 'px "JetBrains Mono", monospace';
            ctx.fillStyle = colors[i % colors.length];
            const x = 16 + i * 25 + (Math.random() - 0.5) * 4;
            const y = 29 + (Math.random() - 0.5) * 6;
            ctx.translate(x, y);
            ctx.rotate((Math.random() - 0.5) * 0.3);
            ctx.fillText(code[i], 0, 0);
            ctx.restore();
        }
    }

    /* 手机短信验证码（演示环境：生成并以提示显示） */
    function sendSmsCode() {
        const dialEl = $('authDial');
        const dial = dialEl ? dialEl.value : '+86';
        const phoneEl = $('authPhone');
        const phone = phoneEl ? phoneEl.value.trim() : '';
        if (!phoneValid(phone, dial)) { toast(dial === '+86' ? '请先输入有效的 11 位手机号' : '请先输入有效的手机号'); return; }
        if (smsCountdown > 0) return;
        smsPhone = dial + phone;
        smsCode = String(Math.floor(100000 + Math.random() * 900000));
        smsCountdown = 60;
        const hint = $('smsHint');
        if (hint) hint.textContent = '演示验证码：' + smsCode;
        updateSmsBtn();
        toast('验证码已发送（演示：' + smsCode + '）');
        if (smsTimer) clearInterval(smsTimer);
        smsTimer = setInterval(function () {
            smsCountdown -= 1;
            if (smsCountdown <= 0) {
                smsCountdown = 0;
                if (smsTimer) { clearInterval(smsTimer); smsTimer = null; }
            }
            updateSmsBtn();
        }, 1000);
    }

    function updateSmsBtn() {
        const btn = $('sendSmsBtn');
        if (!btn) return;
        if (smsCountdown > 0) {
            btn.disabled = true;
            btn.textContent = smsCountdown + 's 后重发';
        } else {
            btn.disabled = false;
            btn.textContent = '获取验证码';
        }
    }

    function logout() {
        state.user = null;
        saveUser();
        closeCart();
        closeCheckout();
        applyAuthState();
        toast('已退出登录');
    }

    /* ================================================================
       结算流程
       ================================================================ */
    function requestCheckout() {
        if (!state.cart.length) { toast('购物车是空的'); return; }
        if (!state.user) { applyAuthState(); return; }
        closeCart();
        openCheckout();
    }

    function openCheckout() {
        if (!state.cart.length) { toast('购物车是空的'); return; }
        co = {
            step: 1,
            address: { name: state.user ? state.user.name : '', phone: state.user ? (state.user.phone || '') : '', address: '' },
            shipping: 'standard',
            pay: 'alipay'
        };
        renderCheckout();
        openMask($('checkoutMask'));
    }
    function closeCheckout() { co = null; closeMask($('checkoutMask')); }

    function checkoutTotals() {
        const subtotal = cartSubtotal();
        const fee = STORE.shipping[co.shipping].price;
        return { subtotal: subtotal, fee: fee, total: subtotal + fee };
    }

    function stepsHtml() {
        const labels = ['收货信息', '配送方式', '支付方式'];
        let html = '<div class="steps">';
        labels.forEach((label, i) => {
            const n = i + 1;
            const cls = n === co.step ? 'active' : (n < co.step ? 'done' : '');
            html += '<div class="step-node ' + cls + '"><span class="step-num">' + (n < co.step ? '✓' : n) + '</span><span class="step-txt">' + label + '</span></div>';
            if (i < labels.length - 1) html += '<span class="step-line"></span>';
        });
        return html + '</div>';
    }

    function coStepBody() {
        if (co.step === 1) {
            return '<div class="field"><label>收件人</label><input id="coName" value="' + escapeHtml(co.address.name || '') + '" placeholder="请输入收货人姓名"></div>' +
                '<div class="field"><label>手机号</label><input id="coPhone" value="' + escapeHtml(co.address.phone || '') + '" placeholder="请输入手机号"></div>' +
                '<div class="field"><label>详细地址</label><textarea id="coAddr" rows="2" placeholder="省 / 市 / 区 街道门牌号">' + escapeHtml(co.address.address || '') + '</textarea></div>';
        }
        if (co.step === 2) {
            return '<div class="pay-options">' + Object.keys(STORE.shipping).map(k => {
                const s = STORE.shipping[k];
                return '<label class="pay-option ' + (co.shipping === s.id ? 'selected' : '') + '" data-ship="' + s.id + '">' +
                    '<input type="radio" name="ship" ' + (co.shipping === s.id ? 'checked' : '') + '>' +
                    '<span class="po-name">' + escapeHtml(s.name) + '</span>' +
                    '<span class="po-desc">' + escapeHtml(s.desc) + ' · ' + (s.price === 0 ? '免运费' : '¥' + s.price) + '</span>' +
                '</label>';
            }).join('') + '</div>';
        }
        const pays = [
            { id: 'alipay', name: '支付宝', desc: '安全快捷' },
            { id: 'wechat', name: '微信支付', desc: '扫码支付' },
            { id: 'card', name: '银行卡', desc: '信用卡 / 储蓄卡' }
        ];
        return '<div class="pay-options">' + pays.map(p =>
            '<label class="pay-option ' + (co.pay === p.id ? 'selected' : '') + '" data-pay="' + p.id + '">' +
                '<input type="radio" name="pay" ' + (co.pay === p.id ? 'checked' : '') + '>' +
                '<span class="po-name">' + p.name + '</span>' +
                '<span class="po-desc">' + p.desc + '</span>' +
            '</label>'
        ).join('') + '</div>' +
        '<div class="co-hint">点击下方「确认支付」将模拟完成付款，并生成可追踪的物流订单。</div>';
    }

    function coSummaryHtml() {
        const t = checkoutTotals();
        const items = state.cart.map(x => {
            const p = productById(x.id);
            return p ? '<div class="co-row"><span>' + escapeHtml(p.name) + ' × ' + x.qty + '</span><span>¥' + fmt(p.price * x.qty) + '</span></div>' : '';
        }).join('');
        return items +
            '<div class="co-row" style="margin-top:0.4rem;"><span>运费 · ' + escapeHtml(STORE.shipping[co.shipping].name) + '</span><span>' + (t.fee === 0 ? '免运费' : '¥' + t.fee) + '</span></div>' +
            '<div class="co-row total"><span>应付总额</span><b>¥' + fmt(t.total) + '</b></div>';
    }

    function coActionsHtml() {
        const t = checkoutTotals();
        return '<div class="co-actions">' +
            (co.step > 1 ? '<button class="btn btn-ghost" data-act="prev">上一步</button>' : '') +
            (co.step < 3
                ? '<button class="btn btn-primary" data-act="next">下一步</button>'
                : '<button class="btn btn-primary" data-act="pay">确认支付 ¥' + fmt(t.total) + '</button>') +
        '</div>';
    }

    function renderCheckout() {
        const m = $('checkoutModal');
        if (!m || !co) return;
        m.innerHTML =
            '<button class="modal-close" data-act="close">' + ICONS.close + '</button>' +
            '<div class="checkout-wrap">' +
                '<div class="checkout-main">' +
                    '<h3>确认订单</h3>' +
                    '<div class="co-sub">共 ' + cartCount() + ' 件商品 · 7 天无理由退换</div>' +
                    stepsHtml() +
                    '<div id="coStepBody">' + coStepBody() + '</div>' +
                '</div>' +
                '<div class="checkout-side">' +
                    '<div class="co-summary">' + coSummaryHtml() + '</div>' +
                    coActionsHtml() +
                '</div>' +
            '</div>';
    }

    function coNext() {
        if (co.step === 1) {
            const n = $('coName'), ph = $('coPhone'), ad = $('coAddr');
            const name = n ? n.value.trim() : '';
            const phone = ph ? ph.value.trim() : '';
            const addr = ad ? ad.value.trim() : '';
            if (!name || !phone || !addr) { toast('请填写完整的收货信息'); return; }
            if (!/^1\d{10}$/.test(phone)) { toast('请输入正确的 11 位手机号'); return; }
            co.address = { name: name, phone: phone, address: addr };
            co.step = 2;
            renderCheckout();
        } else if (co.step === 2) {
            co.step = 3;
            renderCheckout();
        }
    }
    function coPrev() {
        if (co && co.step > 1) { co.step -= 1; renderCheckout(); }
    }

    function coPlaceOrder() {
        if (!co || !state.cart.length) { toast('购物车是空的'); return; }
        if (!state.user) { applyAuthState(); return; }
        const t = checkoutTotals();
        const items = state.cart.map(x => {
            const p = productById(x.id);
            return { id: x.id, name: p ? p.name : x.id, qty: x.qty, price: p ? p.price : 0 };
        });
        const order = {
            id: 'AUR' + Date.now().toString().slice(-8),
            date: nowStr(),
            createdAt: Date.now(),
            items: items,
            subtotal: t.subtotal,
            fee: t.fee,
            total: t.total,
            address: co.address,
            shipping: co.shipping,
            pay: co.pay,
            statusIndex: 1
        };
        state.orders.unshift(order);
        saveOrders();
        state.cart = [];
        saveCart();
        renderCartBadge();
        renderCartDrawer();
        renderOrders();
        co = null;
        renderSuccess(order);
    }

    function renderSuccess(order) {
        const m = $('checkoutModal');
        if (!m) return;
        m.innerHTML =
            '<button class="modal-close" data-act="close">' + ICONS.close + '</button>' +
            '<div class="success-view">' +
                '<div class="success-icon">' + ICONS.check + '</div>' +
                '<h3>支付成功</h3>' +
                '<p>订单已生成，我们将尽快为你安排发货</p>' +
                '<div class="success-order"><span>订单编号</span>' + order.id + '</div>' +
                '<div class="success-actions">' +
                    '<button class="btn" data-act="success-orders">' + ICONS.truck + ' 查看物流</button>' +
                    '<button class="btn btn-primary" data-act="success-shop">继续选购</button>' +
                '</div>' +
            '</div>';
    }

    /* ================================================================
       订单 / 物流
       ================================================================ */
    function statusLabel(i) { return TRACK_STEPS[Math.max(0, Math.min(TRACK_STEPS.length - 1, i))] || ''; }

    function trackHtml(o) {
        const max = TRACK_STEPS.length - 1;
        const idx = o.statusIndex;
        const progress = (idx / max) * 100;
        let steps = '';
        TRACK_STEPS.forEach((label, i) => {
            const cls = i < idx ? 'done' : (i === idx ? 'current' : '');
            steps += '<div class="track-step ' + cls + '">' +
                '<span class="ts-dot">' + (i <= idx ? ICONS.check : ICONS.box) + '</span>' +
                '<span class="ts-label">' + label + '</span>' +
            '</div>';
        });
        return '<div class="track">' +
            '<div class="track-title">物流追踪 · ' + statusLabel(idx) + '</div>' +
            '<div class="track-steps">' +
                '<div class="track-progress" style="width:' + (progress * (TRACK_STEPS.length - 1) / TRACK_STEPS.length) + '%;"></div>' +
                steps +
            '</div>' +
        '</div>';
    }

    function orderCardHtml(o) {
        const items = o.items.map(it =>
            '<div class="order-item">' +
                '<div class="order-thumb">' + (productById(it.id) ? glyphSvg(productById(it.id).glyph) : '') + '</div>' +
                '<div class="order-item-info">' +
                    '<div class="oi-name">' + escapeHtml(it.name) + '</div>' +
                    '<div class="oi-meta">× ' + it.qty + ' · ¥' + fmt(it.price) + '</div>' +
                '</div>' +
            '</div>'
        ).join('');
        const advBtn = o.statusIndex < TRACK_STEPS.length - 1
            ? '<button class="btn btn-sm" data-advance="' + o.id + '">' + ICONS.truck + ' 模拟物流更新</button>'
            : '';
        return '<article class="order-card reveal">' +
            '<div class="order-head">' +
                '<div><span class="order-no">订单号 <b>' + o.id + '</b></span> <span class="order-date">' + o.date + '</span></div>' +
                '<span class="order-status"><span class="dot"></span>' + statusLabel(o.statusIndex) + '</span>' +
            '</div>' +
            '<div class="order-body">' +
                '<div class="order-items">' + items + '</div>' +
                '<div class="order-summary">' +
                    '<span class="oi-total">' + escapeHtml(o.address.name) + ' · ' + escapeHtml(o.address.address) + '</span>' +
                    '<span class="oi-total">实付 <b>¥' + fmt(o.total) + '</b></span>' +
                '</div>' +
                trackHtml(o) +
                '<div class="track-actions">' + advBtn + '</div>' +
            '</div>' +
        '</article>';
    }

    function renderOrders() {
        const host = $('ordersList');
        if (!host) return;
        if (!state.user) {
            host.innerHTML = '<div class="orders-empty">登录后即可查看你的订单与物流信息。<br><br><button class="btn" data-act="login">立即登录</button></div>';
            return;
        }
        if (!state.orders.length) {
            host.innerHTML = '<div class="orders-empty">你还没有订单。去 <b>全部臻品</b> 挑选心动之物吧。</div>';
            return;
        }
        host.innerHTML = state.orders.map(orderCardHtml).join('');
        observeReveals(host);
    }

    function advanceOrder(id) {
        const o = state.orders.find(x => x.id === id);
        if (!o || o.statusIndex >= TRACK_STEPS.length - 1) return;
        o.statusIndex += 1;
        saveOrders();
        renderOrders();
        toast('物流状态已更新为「' + statusLabel(o.statusIndex) + '」');
    }

    /* ================================================================
       购物车抽屉开关
       ================================================================ */
    function openCart() {
        renderCartDrawer();
        $('cartDrawer').classList.add('open');
        $('cartMask').classList.add('visible');
    }
    function closeCart() {
        $('cartDrawer').classList.remove('open');
        $('cartMask').classList.remove('visible');
    }

    /* ================================================================
       滚动入场
       ================================================================ */
    const revealIO = ('IntersectionObserver' in window)
        ? new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    en.target.classList.add('is-in');
                    revealIO.unobserve(en.target);
                }
            });
        }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 })
        : null;

    function observeReveals(root) {
        const list = Array.prototype.slice.call((root || document).querySelectorAll('.reveal'));
        list.forEach((el, i) => {
            if (el.classList.contains('is-in') || el.dataset.obs) return;
            el.dataset.obs = '1';
            el.style.transitionDelay = ((i % 6) * 0.06) + 's';
            if (revealIO) revealIO.observe(el);
            else el.classList.add('is-in');
        });
    }

    /* ================================================================
       事件绑定
       ================================================================ */
    function bindEvents() {
        /* 导航 / 抽屉 / 弹窗 */
        $('cartBtn').addEventListener('click', openCart);
        $('cartClose').addEventListener('click', closeCart);
        $('cartMask').addEventListener('click', closeCart);

        $('productMask').addEventListener('click', e => { if (e.target === $('productMask')) closeProduct(); });
        $('checkoutMask').addEventListener('click', e => { if (e.target === $('checkoutMask')) closeCheckout(); });

        /* 用户菜单 */
        $('userArea').addEventListener('click', e => {
            const menuBtn = e.target.closest('#userMenuBtn');
            if (menuBtn) toggleUserMenu();
        });

        /* 搜索 */
        const searchDrawer = $('searchDrawer');
        $('searchToggle').addEventListener('click', () => searchDrawer.classList.toggle('open'));
        $('searchClose').addEventListener('click', () => searchDrawer.classList.remove('open'));
        $('searchInput').addEventListener('input', e => {
            state.query = e.target.value.trim();
            renderProducts();
            if (state.query) document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        });

        /* 分类 */
        $('categoryChips').addEventListener('click', e => {
            const btn = e.target.closest('[data-cat]');
            if (!btn) return;
            state.category = btn.dataset.cat;
            renderCategories();
            renderProducts();
        });

        /* 排序 */
        $('sortSelect').addEventListener('change', e => {
            state.sort = e.target.value;
            renderProducts();
        });

        /* 商品网格 */
        $('productGrid').addEventListener('click', e => {
            const add = e.target.closest('[data-add]');
            if (add) {
                addToCart(add.dataset.add, 1);
                const span = add.querySelector('span');
                const old = span ? span.textContent : '';
                if (span) span.textContent = '已加入';
                add.classList.add('added');
                setTimeout(() => {
                    if (span) span.textContent = old;
                    add.classList.remove('added');
                }, 1200);
                return;
            }
            const card = e.target.closest('.product-card');
            if (card) openProduct(card.dataset.id);
        });

        /* 商品详情弹窗 */
        $('productModal').addEventListener('click', e => {
            const act = e.target.closest('[data-act]');
            if (act) {
                const a = act.dataset.act;
                if (a === 'close') { closeProduct(); return; }
                if (a === 'add') { addToCart(currentProduct.id, pmQty); toast('已加入购物车'); return; }
                if (a === 'buy') { addToCart(currentProduct.id, pmQty); closeProduct(); requestCheckout(); return; }
            }
            const q = e.target.closest('[data-q]');
            if (q && currentProduct) {
                pmQty = Math.max(1, Math.min(currentProduct.stock, pmQty + Number(q.dataset.q)));
                const v = $('pmQtyVal');
                if (v) v.textContent = pmQty;
            }
        });

        /* 购物车抽屉（数量 / 移除） */
        $('cartDrawer').addEventListener('click', e => {
            const q = e.target.closest('[data-q]');
            if (q) {
                const id = q.dataset.id;
                const item = state.cart.find(x => x.id === id);
                if (item) setQty(id, item.qty + Number(q.dataset.q));
                return;
            }
            const rm = e.target.closest('[data-remove]');
            if (rm) removeFromCart(rm.dataset.remove);
        });

        /* 登录 / 注册（整页） */
        $('authCard').addEventListener('click', e => {
            const roleBtn = e.target.closest('[data-role]');
            if (roleBtn) { authRole = roleBtn.dataset.role; authMode = 'login'; renderAuthForm(); return; }
            const tab = e.target.closest('[data-mode]');
            if (tab) { authMode = tab.dataset.mode; renderAuthForm(); return; }
            const smsBtn = e.target.closest('#sendSmsBtn');
            if (smsBtn) { sendSmsCode(); return; }
            const capBtn = e.target.closest('#captchaRefresh');
            if (capBtn) { drawCaptcha(); return; }
            const submit = e.target.closest('#authSubmit');
            if (submit) doAuth();
        });
        $('authCard').addEventListener('keydown', e => {
            if (e.key === 'Enter') doAuth();
        });
        $('authCard').addEventListener('input', e => {
            if (e.target && e.target.id === 'authName' && authRole === 'normal' && authMode === 'register') {
                const cleaned = e.target.value.replace(/[^A-Za-z_]/g, '');
                if (cleaned !== e.target.value) e.target.value = cleaned;
            }
        });
        $('authCard').addEventListener('change', e => {
            if (e.target && e.target.id === 'authDial') {
                const ph = $('authPhone');
                if (ph) {
                    if (e.target.value === '+86') { ph.placeholder = '11 位手机号'; ph.maxLength = 11; }
                    else { ph.placeholder = '手机号'; ph.maxLength = 15; }
                }
            }
        });

        $('plusEntry').addEventListener('click', () => {
            if (!state.user) { applyAuthState(); return; }
            if (state.user.role === 'member') { toast('您已是 PLUS+ 会员'); return; }
            state.user.role = 'member';
            saveUser();
            renderUser();
            toast('已开通 PLUS+ 会员');
        });

        /* 结算 */
        $('checkoutModal').addEventListener('click', e => {
            const act = e.target.closest('[data-act]');
            if (act) {
                const a = act.dataset.act;
                if (a === 'close' || a === 'success-shop') { closeCheckout(); return; }
                if (a === 'prev') { coPrev(); return; }
                if (a === 'next') { coNext(); return; }
                if (a === 'pay') { coPlaceOrder(); return; }
                if (a === 'success-orders') { closeCheckout(); $('orders').scrollIntoView({ behavior: 'smooth' }); return; }
            }
            const ship = e.target.closest('[data-ship]');
            if (ship) { co.shipping = ship.dataset.ship; renderCheckout(); return; }
            const pay = e.target.closest('[data-pay]');
            if (pay) { co.pay = pay.dataset.pay; renderCheckout(); return; }
        });

        /* 订单 */
        $('ordersList').addEventListener('click', e => {
            const adv = e.target.closest('[data-advance]');
            if (adv) { advanceOrder(adv.dataset.advance); return; }
            const login = e.target.closest('[data-act="login"]');
            if (login) { applyAuthState(); return; }
        });

        /* ESC 关闭 */
        document.addEventListener('keydown', e => {
            if (e.key !== 'Escape') return;
            if ($('checkoutMask').classList.contains('visible')) closeCheckout();
            else if ($('productMask').classList.contains('visible')) closeProduct();
            else if ($('cartDrawer').classList.contains('open')) closeCart();
            closeUserMenu();
        });
    }

    /* ================================================================
       用户下拉菜单
       ================================================================ */
    function ensureUserMenu() {
        let menu = $('userMenu');
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'userMenu';
            menu.className = 'user-menu';
            menu.innerHTML = '<button data-uact="orders">我的订单</button><button data-uact="logout">退出登录</button>';
            $('userArea').appendChild(menu);
            menu.addEventListener('click', e => {
                const b = e.target.closest('[data-uact]');
                if (!b) return;
                if (b.dataset.uact === 'orders') $('orders').scrollIntoView({ behavior: 'smooth' });
                if (b.dataset.uact === 'logout') logout();
                closeUserMenu();
            });
        }
        return menu;
    }
    function toggleUserMenu() {
        const menu = ensureUserMenu();
        menu.classList.toggle('show');
    }
    function closeUserMenu() {
        const menu = $('userMenu');
        if (menu) menu.classList.remove('show');
    }

    /* ================================================================
       静态区块入场
       ================================================================ */
    function initStaticReveal() {
        const groups = [
            document.querySelectorAll('.hero-copy > *'),
            document.querySelectorAll('.showcase-frame'),
            document.querySelectorAll('.section-head'),
            document.querySelectorAll('.editorial-inner > *'),
            document.querySelectorAll('.about-copy > *'),
            document.querySelectorAll('.value-card'),
            document.querySelectorAll('.footer-inner > *')
        ];
        groups.forEach(g => Array.prototype.forEach.call(g, el => el.classList.add('reveal')));
    }

    /* ================================================================
       启动
       ================================================================ */
    load();
    renderFeatured();
    renderCategories();
    renderProducts();
    renderCartBadge();
    renderUser();
    renderCartDrawer();
    renderOrders();
    bindEvents();
    initStaticReveal();
    observeReveals(document);
    applyAuthState();
})();
