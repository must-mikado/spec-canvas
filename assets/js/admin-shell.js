/* admin-shell.js — Spec Canvas 공유 사이드바 (단일 출처) + 반응형 셸
   구조: 단일 메뉴 트리(MENU) + 하단 '공통' 섹션. 실제 프로젝트에 맞게 MENU·COMMON을 교체해서 쓴다.
   반응형: ≤1280px 사이드바 off-canvas 드로어(햄버거+백드롭), >1280px 고정 노출.
   사용법: <aside class="asb" id="adminShell" data-active="<key>"></aside> + <script src="../assets/js/admin-shell.js"></script> */
(function () {
  var MENU = [
    { group: '', items: [ { key: 'dashboard', label: '대시보드' } ]},
    { group: '섹션 1', items: [
      { key: 'item-1', label: '항목 1' },
      { key: 'item-2', label: '항목 2' },
    ]},
    { group: '섹션 2', items: [
      { key: 'item-3', label: '항목 3' },
      { key: 'item-4', label: '항목 4' },
    ]},
    { group: '섹션 3', items: [
      { key: 'main', label: '메인 관리' },
      { key: 'item-5', label: '항목 5' },
    ]},
  ];
  var COMMON = [
    { group: '공통', items: [
      { key: 'members',       label: '회원 관리' },
      { key: 'notifications', label: '알림 관리' },
      { key: 'notices',       label: '공지사항 관리' },
      { key: 'faq',           label: 'FAQ 관리' },
      { key: 'terms',         label: '약관 관리' },
    ]},
  ];

  var CSS = [
    '.alay{display:flex;min-height:100dvh;}',
    '.asb{width:236px;flex-shrink:0;background:#F8F9FC;border-right:1px solid var(--gray-200);display:flex;flex-direction:column;position:relative;transition:width .3s ease,min-width .3s ease;}',
    /* 사이드바 접기 토글 — 우측 가장자리 chevron (실제 sidebar 접기 버튼 재현, 데스크톱 전용) */
    '.asb-collapse{position:absolute;top:24px;right:-13px;width:13px;height:26px;display:none;align-items:center;justify-content:flex-end;padding:0;background:#fff;border:1px solid var(--gray-200);border-right-color:#fff;border-radius:8px 0 0 8px;box-shadow:0 1px 3px rgba(0,0,0,.1);cursor:pointer;z-index:50;}',
    '.asb-collapse svg{transition:transform .2s ease;}',
    '.asb.collapsed{width:0;min-width:0;border-right:0;}',
    '.asb.collapsed > :not(.asb-collapse){opacity:0;visibility:hidden;}',
    '.asb.collapsed .asb-collapse{right:auto;left:0;border-right:1px solid var(--gray-200);border-radius:0 8px 8px 0;}',
    '.asb.collapsed .asb-collapse svg{transform:rotate(180deg);}',
    '@media (min-width:1281px){.asb-collapse{display:flex;}}',
    '.asb-logo{height:48px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;}',
    '.asb-logo .b{color:var(--blue-500);}',
    '.asb-nav{flex:1;padding:6px 0;overflow-y:auto;}',
    '.asb-grp{padding:14px 20px 5px;font-size:11px;font-weight:700;color:var(--gray-500);letter-spacing:.04em;}',
    /* 공통 섹션 헤더 — 상단 메뉴와 구분선으로 분리 */
    '.asb-grp.common{margin-top:8px;padding-top:13px;border-top:1px solid var(--gray-200);}',
    '.asb-nav a{display:flex;align-items:center;gap:6px;padding:8px 20px 8px 28px;font-size:13px;color:var(--gray-700);text-decoration:none;cursor:pointer;border-left:3px solid transparent;}',
    '.asb-nav a:hover{background:#eef1f6;}',
    '.asb-nav a.active{background:var(--blue-100);color:var(--blue-700);font-weight:700;border-left-color:var(--blue-500);}',
    '.asb-nav a .lbl{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.asb-nav a .pk{flex-shrink:0;font-size:8.5px;font-weight:800;letter-spacing:.02em;color:#1d4ed8;background:#dbeafe;border-radius:4px;padding:1px 5px;}',
    '.asb-nav a.active .pk{background:#bfdbfe;}',
    '.asb-nav a.asb-sub{padding-left:46px;font-size:12.5px;color:var(--gray-600);}',
    '.asb-nav a.asb-sub::before{content:"ㄴ";margin-right:4px;color:var(--gray-400);font-size:11px;}',
    '.asb-logout{margin:6px 20px 4px;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px 0;background:transparent;border:0;border-top:1px solid var(--gray-200);font-size:13px;font-weight:700;color:var(--text-primary);cursor:pointer;}',
    '.asb-logout:hover{background:#eef1f6;}',
    '.asb-user{padding:16px 20px;border-top:1px solid var(--gray-200);font-size:12px;color:var(--gray-500);}',
    '.asb-user .nm{color:var(--text-primary);font-weight:600;font-size:13px;}',
    '.acon{flex:1;min-width:0;}',
    /* 반응형 — 테이블 가로스크롤 래퍼 (실제 min-w + overflow-x-auto 재현) */
    '.asb-tscroll{max-width:100%;overflow-x:auto;}',
    /* 반응형 — 모바일 드로어 토글(햄버거) + 백드롭 */
    '.asb-burger{position:fixed;left:16px;bottom:16px;z-index:42;width:46px;height:46px;border-radius:50%;border:1px solid var(--gray-200);background:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.16);}',
    '.asb-burger b{display:block;width:18px;height:2px;background:var(--gray-800);position:relative;border-radius:2px;}',
    '.asb-burger b::before,.asb-burger b::after{content:"";position:absolute;left:0;width:18px;height:2px;background:var(--gray-800);border-radius:2px;}',
    '.asb-burger b::before{top:-6px;}',
    '.asb-burger b::after{top:6px;}',
    '.asb-backdrop{position:fixed;inset:0;background:rgba(17,24,39,.34);z-index:40;display:none;}',
    '.asb-backdrop.show{display:block;}',
    /* ≤1280px: 사이드바 off-canvas 드로어 (실제 GNB matchMedia 1280 재현) */
    '@media (max-width:1280px){',
    '  .asb{position:fixed;top:0;left:0;height:100dvh;z-index:41;transform:translateX(-100%);transition:transform .22s ease;box-shadow:2px 0 16px rgba(0,0,0,.16);}',
    '  .asb.open{transform:translateX(0);}',
    '  .asb-burger{display:inline-flex;}',
    '}',
    /* ── 태블릿(≤1024px): 공통 패턴 축소 — 페이지 로컬 CSS보다 뒤에 주입되어 우선 적용 ── */
    '@media (max-width:1024px){',
    '  .abody{padding-left:22px !important;padding-right:22px !important;}',
    '  .kpis{grid-template-columns:repeat(3,1fr) !important;}',
    '  .bsum{grid-template-columns:1fr 1fr !important;}',
    '  .metrics{grid-template-columns:1fr 1fr !important;}',
    '  .tpls{grid-template-columns:1fr !important;}',
    '  .grid12 .col4,.grid12 .col8,.grid .col4,.grid .col8,.mgrid .col4,.mgrid .col8{grid-column:span 12 !important;}',
    '}',
    /* ── 모바일(≤640px): 1열 스택 + 여백 축소 (실제 main p-4 sm:p-6 재현) ── */
    '@media (max-width:640px){',
    '  .abody{padding-left:16px !important;padding-right:16px !important;}',
    '  .cmp-stage{padding-left:14px !important;padding-right:14px !important;}',
    '  .atop,.dh{flex-wrap:wrap;gap:10px;padding-left:16px;padding-right:16px;}',
    '  .atop h1{font-size:18px;}',
    '  .kpis{grid-template-columns:repeat(2,1fr) !important;}',
    '  .bsum,.metrics,.pricecmp,.sanc,.pol,.tpls{grid-template-columns:1fr !important;}',
    '  .refund-panel{display:block !important;}',
    '  .refund-panel>div+div{margin-top:16px;}',
    '  .row .lbl{width:100% !important;}',
    '  .fbar .search,.toolbar .fil[placeholder]{width:100% !important;}',
    '  .decbar{flex-wrap:wrap;gap:8px;position:static !important;}',
    '  .decbar .budget{flex-basis:100%;}',
    '  .od-actions{flex-direction:column;}',
    '}'
  ].join('\n');

  /* 사이드바 라벨 KO/EN — en/ 사본 페이지(경로에 /en/ 포함 또는 html[lang=en])에서 영어 렌더 */
  var EN_LABELS = {
    '대시보드': 'Dashboard',
    '섹션 1': 'Section 1', '항목 1': 'Item 1', '항목 2': 'Item 2',
    '섹션 2': 'Section 2', '항목 3': 'Item 3', '항목 4': 'Item 4',
    '섹션 3': 'Section 3', '메인 관리': 'Main', '항목 5': 'Item 5',
    '공통': 'Common', '회원 관리': 'Members', '알림 관리': 'Notifications',
    '공지사항 관리': 'Notices', 'FAQ 관리': 'FAQ', '약관 관리': 'Terms',
    '관리자': 'Administrator', '메뉴 열기': 'Open menu', '로그아웃': 'Logout', '사이드바 접기': 'Collapse sidebar'
  };
  var IS_EN = /\/en\//.test(location.pathname) || (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  function L(s){ return IS_EN ? (EN_LABELS[s] || s) : s; }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  // 그룹 리스트 → nav HTML (버티컬·공통 공용). headerCls로 '공통' 섹션 구분선 부여.
  function groupsHtml(groups, active, headerCls) {
    var html = '';
    groups.forEach(function (g) {
      if (g.group) html += '<div class="asb-grp' + (headerCls ? ' ' + headerCls : '') + '">' + esc(L(g.group)) + '</div>';
      g.items.forEach(function (it) {
        var cls = it.key === active ? ' class="active"' : '';
        html += '<a data-key="' + it.key + '"' + cls + '><span class="lbl">' + esc(L(it.label)) + '</span></a>';
        // 3rd-level 자식(예: 메인 관리 → 하위 1 / 하위 2)
        if (it.children) {
          it.children.forEach(function (ch) {
            var ccls = ch.key === active ? ' class="active asb-sub"' : ' class="asb-sub"';
            html += '<a data-key="' + ch.key + '"' + ccls + '><span class="lbl">' + esc(L(ch.label)) + '</span></a>';
          });
        }
      });
    });
    return html;
  }

  function render(mount) {
    var active = mount.getAttribute('data-active') || '';
    var nav = groupsHtml(MENU, active, '') + groupsHtml(COMMON, active, 'common');
    // 사이드바 접기 버튼 (우측 가장자리 chevron) — 데스크톱에서 사이드바 width 토글
    var collapseBtn = '<button type="button" class="asb-collapse" aria-label="' + esc(L('사이드바 접기')) + '"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711L10.4142 12L15.7071 17.2929C16.0976 17.6834 16.0976 18.3166 15.7071 18.7071C15.3166 19.0976 14.6834 19.0976 14.2929 18.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L14.2929 5.29289C14.6834 4.90237 15.3166 4.90237 15.7071 5.29289Z" fill="#9DA6BB"/></svg></button>';
    var html = collapseBtn + '<div class="asb-logo">Admin</div>' + '<nav class="asb-nav">' + nav;
    // 하단 로그아웃 버튼 — 실제 sidebar.tsx의 mt-auto 로그아웃 재현
    html += '</nav><button type="button" class="asb-logout"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.87868 3.87868C3.44129 3.31607 4.20435 3 5 3H12C12.7956 3 13.5587 3.31607 14.1213 3.87868C14.6839 4.44129 15 5.20435 15 6V8C15 8.55228 14.5523 9 14 9C13.4477 9 13 8.55228 13 8V6C13 5.73478 12.8946 5.48043 12.7071 5.29289C12.5196 5.10536 12.2652 5 12 5H5C4.73478 5 4.48043 5.10536 4.29289 5.29289C4.10536 5.48043 4 5.73478 4 6V18C4 18.2652 4.10536 18.5196 4.29289 18.7071C4.48043 18.8946 4.73478 19 5 19H12C12.2652 19 12.5196 18.8946 12.7071 18.7071C12.8946 18.5196 13 18.2652 13 18V16C13 15.4477 13.4477 15 14 15C14.5523 15 15 15.4477 15 16V18C15 18.7957 14.6839 19.5587 14.1213 20.1213C13.5587 20.6839 12.7957 21 12 21H5C4.20435 21 3.44129 20.6839 2.87868 20.1213C2.31607 19.5587 2 18.7956 2 18V6C2 5.20435 2.31607 4.44129 2.87868 3.87868ZM17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289L21.7071 11.2929C22.0976 11.6834 22.0976 12.3166 21.7071 12.7071L18.7071 15.7071C18.3166 16.0976 17.6834 16.0976 17.2929 15.7071C16.9024 15.3166 16.9024 14.6834 17.2929 14.2929L18.5858 13H7C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11H18.5858L17.2929 9.70711C16.9024 9.31658 16.9024 8.68342 17.2929 8.29289Z" fill="#17191E"/></svg><span>' + esc(L('로그아웃')) + '</span></button><div class="asb-user"><div class="nm">' + esc(L('관리자')) + '</div>user@example.com</div>';
    mount.innerHTML = html;
    // 접기 토글 — collapsed 클래스는 mount(aside)에 부여되어 재렌더 후에도 유지
    var cb = mount.querySelector('.asb-collapse');
    if (cb) cb.addEventListener('click', function () { mount.classList.toggle('collapsed'); });
  }

  // 반응형 셸: 드로어 토글 + 백드롭 + 테이블 가로스크롤 래핑 (실제 admin GNB 동작 재현)
  function responsive() {
    var sb = document.querySelector('#adminShell, .asb');
    if (sb && !document.getElementById('asb-burger')) {
      var backdrop = document.createElement('div');
      backdrop.className = 'asb-backdrop';
      var burger = document.createElement('button');
      burger.id = 'asb-burger';
      burger.className = 'asb-burger';
      burger.type = 'button';
      burger.setAttribute('aria-label', L('메뉴 열기'));
      burger.innerHTML = '<b></b>';
      document.body.appendChild(backdrop);
      document.body.appendChild(burger);

      var mq = window.matchMedia('(max-width:1280px)');
      function setOpen(o) {
        if (o) { sb.classList.add('open'); backdrop.classList.add('show'); }
        else { sb.classList.remove('open'); backdrop.classList.remove('show'); }
      }
      burger.addEventListener('click', function () { setOpen(!sb.classList.contains('open')); });
      backdrop.addEventListener('click', function () { setOpen(false); });
      // 모바일에서 메뉴 항목 클릭 시 드로어 닫기 (실제 동작)
      sb.addEventListener('click', function (e) {
        if (e.target.closest('a') && mq.matches) setOpen(false);
      });
      // 실제 GNB: matchMedia(1280) 변경 시 기본 닫힘 동기화
      function sync() { setOpen(false); }
      if (mq.addEventListener) mq.addEventListener('change', sync); else mq.addListener(sync);
      sync();
    }
    // 데이터 테이블 가로스크롤 래핑 (좁은 화면에서 실제처럼 가로스크롤)
    document.querySelectorAll('.acon table').forEach(function (t) {
      var p = t.parentElement;
      if (p && p.classList.contains('asb-tscroll')) return;
      var w = document.createElement('div');
      w.className = 'asb-tscroll';
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  // ── 필터 SelectBox 드롭다운 enabler (정적 하니스의 select 트리거를 클릭 가능하게) ──
  // 라벨 기준 기본 옵션. data-opts="A|B|C"가 있으면 그것을 우선 사용.
  var SEL_MAP = {
    '인증 여부':['전체','인증','미인증'], '유형':['전체','타입 A','타입 B'], '활성화 상태':['전체','활성화','비활성화'],
    '알림 유형':['전체','알림 A','알림 B','알림 C'], 'OS':['전체','iOS','Android'], '상태':['전체','성공','실패','대기'],
    'Verified':['All','Verified','Unverified'], 'Type':['All','Type A','Type B'], 'Active status':['All','Active','Inactive'],
    'Notification type':['All','Type A','Type B','Type C'], 'Status':['All','Success','Failed','Pending']
  };
  // 디자인시스템 Select(ui/select.tsx) 클래스 그대로 사용 (임의 스타일 금지)
  var SEL_CONTENT_CLS = 'relative z-50 overflow-y-auto overflow-x-hidden rounded-md border border-border-interactive-quaternary bg-background-primary text-popover-foreground shadow-md';
  var SEL_ITEM_CLS = 'relative hover:bg-background-quaternary flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground';
  var SEL_CHECK = '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  function _closeSel(){ var m = document.getElementById('_selMenu'); if (m) { if (m._owner) m._owner.removeAttribute('data-state'); m.parentNode.removeChild(m); } }
  function _selTrigger(el){ // 클릭 지점에서 가장 가까운 select 트리거 버튼 반환(아니면 null)
    var btn = el && el.closest ? el.closest('button') : null;
    if (!btn) return null;
    // 페이지가 자체 드롭다운(onclick=toggleDD·.ddwrap·인접 .ddmenu)을 가진 경우 위임 제외 → 이중 표시 방지
    if (btn.getAttribute('onclick') || (btn.closest && btn.closest('.ddwrap'))) return null;
    if (btn.parentNode && btn.parentNode.querySelector && btn.parentNode.querySelector('.ddmenu')) return null;
    if (btn.querySelector('span.single-line-text-2') && btn.innerHTML.indexOf('m6 9 6 6 6-6') >= 0) return btn;
    return null;
  }
  function _openSel(btn){
    var existing = document.getElementById('_selMenu'); var wasFor = existing && existing._owner === btn;
    _closeSel(); if (wasFor) return;
    var val = btn.querySelector('span.single-line-text-2');
    var lbl = (btn.querySelector('p.single-line-text-3') || {}).textContent || '';
    var dopt = btn.getAttribute('data-opts');
    var opts = dopt ? dopt.split('|') : (SEL_MAP[lbl.trim()] || [ (val && val.textContent.trim()) || '전체' ]);
    var cur = val && val.textContent.trim();
    var menu = document.createElement('div'); menu.id = '_selMenu'; menu._owner = btn;
    menu.className = SEL_CONTENT_CLS; // 디자인시스템 popover content
    var r = btn.getBoundingClientRect();
    // 위치만 인라인(시각 스타일은 전부 DS 클래스). open 시 트리거 하단과 테두리 병합.
    menu.style.cssText = 'position:absolute;z-index:60;left:'+(r.left + window.scrollX)+'px;top:'+(r.bottom + window.scrollY)+'px;width:'+r.width+'px;max-height:280px;border-top-left-radius:0;border-top-right-radius:0;border-top:0;';
    var pad = document.createElement('div'); pad.className = 'p-1';
    opts.forEach(function(o){
      var it = document.createElement('div'); it.className = SEL_ITEM_CLS; it.setAttribute('data-val', o);
      if (o === cur) it.setAttribute('data-state','checked');
      it.innerHTML = '<span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">' + (o === cur ? SEL_CHECK : '') + '</span>' + String(o).replace(/&/g,'&amp;').replace(/</g,'&lt;');
      pad.appendChild(it);
    });
    menu.appendChild(pad);
    document.body.appendChild(menu);
    btn.setAttribute('data-state','open'); // 트리거 open 스타일(border-b-0/rounded-b-none) 발동
  }
  // 이벤트 위임 — 버튼이 언제 생기든(탭 전환·재렌더) 동작. 한 번만 바인딩.
  function setupSelects(){
    if (window._selDeleg) return; window._selDeleg = true;
    document.addEventListener('click', function(e){
      var item = e.target.closest ? e.target.closest('#_selMenu [data-val]') : null;
      if (item){
        var menu = document.getElementById('_selMenu');
        var val = menu && menu._owner && menu._owner.querySelector('span.single-line-text-2');
        if (val) val.textContent = item.getAttribute('data-val');
        _closeSel(); return;
      }
      var trig = _selTrigger(e.target);
      if (trig){ e.preventDefault(); _openSel(trig); return; }
      _closeSel(); // 바깥 클릭 → 닫기
    });
    window.addEventListener('resize', _closeSel);
  }

  function init() {
    // viewport 메타 보강 — 없으면 반응형 미디어쿼리가 모바일에서 발동하지 않음
    if (!document.querySelector('meta[name="viewport"]')) {
      var vp = document.createElement('meta');
      vp.name = 'viewport';
      vp.content = 'width=device-width, initial-scale=1';
      document.head.appendChild(vp);
    }
    if (!document.getElementById('admin-shell-css')) {
      var st = document.createElement('style');
      st.id = 'admin-shell-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    // 임베드 모드(?embed=1): order-detail iframe 등에서 자식 화면을 사이드바 없이 표시.
    // ↗ 새 탭(embed 파라미터 없음)은 영향 없음 — 사이드바 정상 노출.
    var EMBED = /[?&]embed=1(?:&|$)/.test(location.search || '');
    if (EMBED && !document.getElementById('admin-shell-embed-css')) {
      var es = document.createElement('style');
      es.id = 'admin-shell-embed-css';
      es.textContent = '.asb,.asb-burger,.asb-backdrop,.pagehead{display:none!important}.alay{display:block!important;min-height:0!important}.sticky{position:static!important}main{padding:0!important}';
      document.head.appendChild(es);
    }
    var mounts = document.querySelectorAll('#adminShell, [data-admin-shell]');
    mounts.forEach(function (m) {
      if (!m.classList.contains('asb')) m.classList.add('asb');
      render(m);
      // 레이아웃 보정: .alay flex 래퍼가 없으면 aside+main을 감싸 사이드바를 옆에 붙임
      // (없으면 .asb static 블록이 본문 위로 쌓여 상단 빈공간 발생). .alay 보유 화면은 건너뜀.
      if (!(m.closest && m.closest('.alay'))) {
        var sib = m.nextElementSibling;
        if (sib && sib.tagName === 'MAIN' && m.parentNode) {
          var wrap = document.createElement('div');
          wrap.className = 'alay';
          m.parentNode.insertBefore(wrap, m);
          wrap.appendChild(m);
          wrap.appendChild(sib);
          if (!sib.classList.contains('acon')) sib.classList.add('acon');
        }
      }
    });
    responsive();
    setupSelects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
