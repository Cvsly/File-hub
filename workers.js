// FWH Admin Lite — 部署到 Cloudflare Workers + KV
// 自定义网页图标：下方 href="" 填入你的图标链接
// 自定义管理员密码：在 Cloudflare Dashboard → Variables 设置 ADMIN_PASSWORD
var HTML = String.raw`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover,user-scalable=no">
<title>Widget Hub</title>
<link rel="icon" href="https://tu.100923.xyz/file/1774111909335_photo_2026-03-22_00-42-30.jpg" id="faviconLink">
<style>
:root{--bg:#F2F2F7;--card:#FFF;--accent:#007AFF;--text:#1C1C1E;--text2:#8E8E93;--text3:#C7C7CC;--sep:rgba(60,60,67,0.12);--red:#FF3B30;--green:#34C759;--radius:20px;--dock-bg:rgba(248,248,248,0.72)}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;-webkit-font-smoothing:antialiased}
.header{padding:16px 20px 4px;position:sticky;top:0;z-index:10;background:var(--bg)}
.header h1{font-size:34px;font-weight:700;letter-spacing:-0.5px}
.header p{font-size:14px;color:var(--text2);margin-top:2px}
.page{display:none;padding:8px 16px 160px}
.page.active{display:block}
.card{background:var(--card);border-radius:var(--radius);padding:18px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.row{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--sep)}
.row:last-child{border-bottom:none}
.ico-sq{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.info{flex:1;min-width:0}
.name{font-size:15px;font-weight:500;white-space:nowrap}
.sub{font-size:12px;color:var(--text3);margin-top:2px}
.badge{font-size:10px;font-weight:600;padding:2px 8px;border-radius:5px;flex-shrink:0}
.badge-blue{background:rgba(0,122,255,0.1);color:var(--accent)}
.ico-sq>div{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.menu-wrap{position:relative;flex-shrink:0}
.menu-drop{position:absolute;right:0;top:100%;margin-top:4px;background:var(--card);border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.12);padding:6px;min-width:150px;z-index:200;animation:fadeUp 0.15s ease}
.menu-drop button{display:block;width:100%;padding:10px 14px;border:none;background:transparent;font-size:14px;text-align:left;border-radius:10px;cursor:pointer;color:var(--text);font-family:inherit}
.menu-drop button:hover{background:var(--bg)}
.menu-drop button.danger{color:var(--red)}
.menu-drop button.danger:hover{background:rgba(255,59,48,0.08)}
.dark{--bg:#000;--card:#1C1C1E;--accent:#0A84FF;--text:#FFF;--text2:#98989D;--text3:#636366;--sep:rgba(84,84,88,0.65);--dock-bg:rgba(28,28,30,0.72)}
@media(prefers-color-scheme:dark){:root:not(.dark):not(.light){--bg:#000;--card:#1C1C1E;--accent:#0A84FF;--text:#FFF;--text2:#98989D;--text3:#636366;--sep:rgba(84,84,88,0.65);--dock-bg:rgba(28,28,30,0.72)}:root:not(.dark):not(.light) .modal-overlay{background:rgba(0,0,0,0.6)}:root:not(.dark):not(.light) .modal h3,:root:not(.dark):not(.light) .modal p{color:#fff}}
.btn-xs{width:32px;height:32px;border-radius:9px;border:none;background:transparent;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;color:var(--text2);flex-shrink:0}
.btn-xs:hover{background:rgba(0,0,0,0.05);color:var(--text)}
.btn-xs.danger:hover{background:rgba(255,59,48,0.1);color:var(--red)}
.btn{border:none;cursor:pointer;font-size:14px;font-weight:500;padding:8px 18px;border-radius:20px;font-family:inherit;background:var(--bg);color:var(--text)}
.dark .modal h3{color:#fff}
.dark .modal p{color:#fff}
.dark .modal-overlay{background:rgba(0,0,0,0.6)}
.dark .toast{background:#333;color:#fff}
.btn-primary{background:var(--accent);color:#fff}
.btn-ghost{background:transparent;color:var(--accent);font-size:12px;padding:4px 8px}
.btn-sm{font-size:12px;padding:6px 14px}
.empty{text-align:center;padding:64px 20px;color:var(--text3)}
.empty .ico{font-size:52px;margin-bottom:12px;opacity:0.6}
.empty p{font-size:14px}
.dock{position:fixed;bottom:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));left:16px;right:16px;display:flex;justify-content:space-evenly;align-items:center;padding:8px 6px;background:var(--dock-bg);backdrop-filter:blur(30px) saturate(180%);-webkit-backdrop-filter:blur(30px) saturate(180%);border-radius:28px;box-shadow:0 -0.5px 0 rgba(0,0,0,0.08),0 -8px 32px rgba(0,0,0,0.08);z-index:100;height:70px}
.dock-item{display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px 14px;border-radius:20px;cursor:pointer;border:none;background:none;font-family:inherit;transition:all 0.25s;min-width:60px;-webkit-tap-highlight-color:transparent}
.dock-item .d-icon{width:30px;height:30px;display:flex;align-items:center;justify-content:center}
.dock-item .d-icon svg{width:26px;height:26px}
.dock-item .d-label{font-size:10px;font-weight:500;color:var(--text2)}
.dock-item.active .d-label{color:var(--accent);font-weight:600}
.dock-item.active .d-icon svg{fill:var(--accent)}
.dock-item:not(.active) .d-icon svg{fill:var(--text3)}
.dock-item:active{transform:scale(0.92)}
.input{border:1.5px solid var(--sep);border-radius:14px;padding:12px 14px;font-size:15px;width:100%;outline:none;background:var(--card);color:var(--text);font-family:inherit}
.input:focus{border-color:var(--accent)}
.textarea{border:1.5px solid var(--sep);border-radius:14px;padding:12px 14px;font-size:14px;width:100%;outline:none;background:var(--card);color:var(--text);font-family:inherit;resize:vertical;min-height:60px}
.textarea:focus{border-color:var(--accent)}
.file-zone{border:2px dashed var(--sep);border-radius:14px;padding:24px;text-align:center;cursor:pointer;color:var(--text2);font-size:13px;transition:all 0.2s}
.file-zone:hover{border-color:var(--accent);background:rgba(0,122,255,0.04)}
.login-box{max-width:340px;margin:120px auto 0;text-align:center;padding:32px 20px}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:150;display:flex;align-items:flex-end;justify-content:center;padding:16px;padding-bottom:calc(24px + env(safe-area-inset-bottom,0px))}
.modal{background:var(--card);border-radius:24px;padding:24px 20px;width:100%;max-width:420px;max-height:80vh;overflow-y:auto;box-shadow:0 16px 48px rgba(0,0,0,0.2);margin-bottom:env(safe-area-inset-bottom,0px)}
.modal h3{font-size:18px;font-weight:700;margin-bottom:4px}
.modal .desc{font-size:13px;color:var(--text2);margin-bottom:16px}
.modal label{font-size:13px;font-weight:500;color:var(--text2);margin-bottom:4px;display:block;margin-top:12px}
.modal .btn-row{display:flex;gap:8px;margin-top:16px}
.modal .btn,.modal .btn-primary{background:var(--accent);color:#fff;flex:1}
.link-bar{display:flex;align-items:center;gap:8px;margin-top:12px;padding:10px 12px;background:var(--bg);border-radius:10px}
.link-bar code{flex:1;font-size:11px;color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'SF Mono',Menlo,monospace}
.toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#1C1C1E;color:#FFF;padding:10px 22px;border-radius:22px;font-size:13px;z-index:200;font-weight:500;opacity:0;transition:opacity 0.3s;pointer-events:none}
.toast.show{opacity:1}
.pick-list{max-height:200px;overflow-y:auto;border:1px solid var(--sep);border-radius:12px;margin-top:8px}
.pick-item{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--sep)}
.pick-item:last-child{border:none}
.pick-item.checked{background:rgba(0,122,255,0.06)}
.stat-box{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.stat{background:var(--bg);border-radius:16px;padding:16px;text-align:center}
.stat .num{font-size:32px;font-weight:700}
.stat .lbl{font-size:11px;color:var(--text2);margin-top:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.card{animation:fadeUp 0.3s ease}
</style>
</head>
<body>

<div id="loginGate" style="display:none;flex-direction:column;align-items:center;justify-content:center;min-height:80vh">
<div style="text-align:center"><div style="font-size:56px;margin-bottom:16px">&#x1f6e1;&#xfe0f;</div><h2 style="font-size:22px;font-weight:700">Widget Hub</h2><p style="color:#8E8E93;font-size:14px;margin:6px 0 24px">请输入管理密码</p><input type="password" id="pwInput" class="input" style="max-width:280px;text-align:center" placeholder="密码" onkeydown="if(event.key==='Enter')login()"><button class="btn btn-primary" style="width:100%;max-width:280px;margin-top:10px;padding:12px" onclick="login()">登录</button><p id="loginErr" style="color:#FF3B30;font-size:13px;margin-top:10px;display:none"></p></div></div>

<div id="appMain" style="display:none">
<div class="header"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="display:flex;align-items:center;gap:10px"><img src="" id="headerIcon" style="width:28px;height:28px;border-radius:7px;object-fit:cover;display:none" onerror="this.style.display='none'"><div><h1 id="pageTitle">模块</h1><p id="pageSub">独立模块管理</p></div></div><button class="btn-xs" id="btnThemeToggle" onclick="toggleTheme()" style="margin-top:4px;font-size:18px" title="切换主题">🌓</button></div></div>

<div id="page-modules" class="page">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span style="font-size:13px;color:var(--text2)" id="modCount">0 个模块</span><div style="display:flex;gap:6px"><label class="btn btn-primary btn-sm" style="position:relative;overflow:hidden;cursor:pointer">+ 上传模块<input type="file" multiple accept=".js,application/javascript,text/javascript" style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.01" onchange="doUploadMods(this)"></label><button class="btn btn-ghost btn-sm" onclick="showImportUrl()">🔗 链接添加</button></div></div>
<div id="modulesList"></div></div>

<div id="page-collections" class="page">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span id="colCount" style="font-size:13px;color:var(--text2)"></span><button class="btn btn-primary btn-sm" onclick="showAddCol()">+ 新建合集</button></div>
<div id="collectionsList"></div></div>

<div id="page-settings" class="page">
<div class="card"><div style="font-size:16px;font-weight:600;margin-bottom:4px">数据统计</div><div class="stat-box"><div class="stat"><div class="num" id="statCols">0</div><div class="lbl">合集</div></div><div class="stat"><div class="num" id="statMods">0</div><div class="lbl">模块</div></div><div class="stat-box" style="margin-top:10px"><div class="stat"><div class="num" id="statSize">0</div><div class="lbl">总大小</div></div></div></div>
<div class="card"><div style="font-size:16px;font-weight:600;margin-bottom:6px">工具</div><button class="btn" style="width:100%;margin-top:4px;text-align:left" onclick="exportData()">📦 备份（全部模块+合集）</button><button class="btn" style="width:100%;margin-top:4px;text-align:left" onclick="importBackup()">📥 恢复（上传备份文件）</button><button class="btn" style="width:100%;margin-top:4px;text-align:left;color:var(--red)" onclick="clearAllData()">🗑 清除所有数据</button></div>
<div class="card"><div style="font-size:16px;font-weight:600;margin-bottom:6px">密码</div><div style="display:flex;gap:8px;margin-top:4px"><input type="password" id="pwdNew" class="input" placeholder="新密码" style="flex:1"><button class="btn btn-primary" style="flex-shrink:0;padding:10px 14px" onclick="changePassword()">修改</button></div></div>
<div class="card"><div style="font-size:16px;font-weight:600;margin-bottom:6px">关于</div><p style="font-size:13px;color:var(--text2);line-height:1.6">FWH Admin Lite<br>Cloudflare Workers · KV</p></div></div></div>

<div class="dock">
<button class="dock-item active" data-tab="modules" onclick="switchTab('modules')"><span class="d-icon"><svg viewBox="0 0 28 28"><rect x="3" y="3" width="9" height="9" rx="3"/><rect x="16" y="3" width="9" height="9" rx="3"/><rect x="3" y="16" width="9" height="9" rx="3"/><rect x="16" y="16" width="9" height="9" rx="3"/></svg></span><span class="d-label">模块</span></button>
<button class="dock-item" data-tab="collections" onclick="switchTab('collections')"><span class="d-icon"><svg viewBox="0 0 28 28"><path d="M3 6a2 2 0 012-2h7l2 2h9a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"/></svg></span><span class="d-label">合集</span></button>
<button class="dock-item" data-tab="settings" onclick="switchTab('settings')"><span class="d-icon"><svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="4"/><path d="M14 1l2.5 5.5c.2.4.6.7 1.1.7h5.8l-4.6 3.4c-.4.3-.5.8-.4 1.2l1.8 5.7-4.7-3.4c-.4-.3-.9-.3-1.3 0l-4.7 3.4 1.8-5.7c.1-.4 0-.9-.4-1.2L5.6 7.2h5.8c.5 0 .9-.3 1.1-.7L14 1z"/></svg></span><span class="d-label">设置</span></button></div>

<div class="toast" id="toast"></div>
<input type="file" id="replaceFileInput" accept=".js,application/javascript,text/javascript" style="position:fixed;top:-100px;left:-100px;opacity:0.01;width:1px;height:1px" onchange="doReplaceMod(this)">

<script>
var state = { modules: [], collections: [], tab: 'modules', modReplaceId: null, isAuthed: false };

function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function fmt(b){ return b<1024?b+' B':(b/1024).toFixed(1)+' KB'; }
function org(){ return location.origin; }
function toast(m){ var t=document.getElementById('toast'); t.textContent=m; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(function(){ t.classList.remove('show'); },2000); }

async function api(path, opts){
  opts = opts || {};
  var fo = { method: opts.method || 'GET', headers: {} };
  if(opts.json){ fo.headers['Content-Type']='application/json'; fo.body=JSON.stringify(opts.json); }
  if(opts.body) fo.body = opts.body;
  var r = await fetch(path, fo);
  if(r.status===401){ state.isAuthed=false; showLogin(); return null; }
  if(r.status===204) return {ok:true};
  return r.json().catch(function(){ return null; });
}

function showLogin(){ document.getElementById('loginGate').style.display='flex'; document.getElementById('appMain').style.display='none'; state.isAuthed=false; }
function showApp(){ document.getElementById('loginGate').style.display='none'; document.getElementById('appMain').style.display='block'; loadAll(); }

async function checkAuth(){
  var r = await api('/api/admin/auth');
  if(!r){ showLogin(); return; }
  if(r.authenticated){ state.isAuthed=true; showApp(); } else showLogin();
}

async function login(){
  var pw = document.getElementById('pwInput').value;
  if(!pw) return;
  var r = await api('/api/admin/auth', {method:'POST',json:{password:pw}});
  if(r&&r.ok){ state.isAuthed=true; showApp(); document.getElementById('pwInput').value=''; }
  else { var e=document.getElementById('loginErr'); e.style.display='block'; e.textContent='密码错误'; }
}

async function loadAll(){
  var mr = await api('/api/admin/modules');
  if(mr && Array.isArray(mr)) state.modules = mr;
  var cr = await api('/api/admin/collections');
  if(cr && Array.isArray(cr)) state.collections = cr;
  switchTab(state.tab);
}

function switchTab(tab){
  state.tab=tab;
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  var pg = document.getElementById('page-'+tab); if(pg) pg.classList.add('active');
  document.querySelectorAll('.dock-item').forEach(function(el){ el.classList.toggle('active',el.dataset.tab===tab); });
  var titles={modules:['模块','独立模块管理'],collections:['合集','挑选模块组成订阅'],settings:['设置','系统信息']};
  document.getElementById('pageTitle').textContent=titles[tab][0];
  document.getElementById('pageSub').textContent=titles[tab][1];
  if(tab==='modules') renderMods();
  if(tab==='collections') renderCols();
  if(tab==='settings') renderSettings();
}

// ===== MODULES =====
function renderMods(){
  var ms = state.modules;
  document.getElementById('modCount').textContent = ms.length + ' 个模块';
  if(!ms.length){ document.getElementById('modulesList').innerHTML='<div class="empty"><div class="ico">&#x1F4E6;</div><p>暂无模块</p></div>'; return; }
  var h='<div class="card" style="padding-bottom:6px">';
  ms.forEach(function(m){
    var ib=m.is_encrypted?'rgba(255,149,0,0.1)':'rgba(0,122,255,0.06)';
    var ie=m.is_encrypted?'&#x1f512;':'&#x1f4c4;';
    h+='<div class="row"><div class="ico-sq" style="background:'+ib+'">'+ie+'</div><div class="info"><div class="name">'+esc(m.title||m.filename)+'</div><div class="sub">'+esc(m.filename)+' · '+fmt(m.file_size)+(m.note?'<br>'+esc(m.note):'')+'</div></div>'+
      (m.version?'<span class="badge badge-blue">'+esc(m.version)+'</span>':'')+
      '<div class="menu-wrap"><button class="btn-xs" onclick="toggleMenu(event,\''+m.id+'\')">⋯</button>'+
      '<div class="menu-drop" id="menu-'+m.id+'" style="display:none">'+
      '<button onclick="editMeta(\''+m.id+'\')">📝 编辑信息</button>'+
      '<button onclick="copyModLink(\''+m.id+'\')">📋 复制链接</button>'+
      '<button onclick="promptReplace(\''+m.id+'\')">📤 替换文件</button>'+
      (m.source_url?'<button onclick="refreshMod(\''+m.id+'\')">🔄 刷新</button>':'')+
      '<button onclick="promptDeleteMod(\''+m.id+'\',\''+esc(m.title||m.filename)+'\')" class="danger">🗑 删除</button></div></div></div>';
  });
  h+='</div>';
  document.getElementById('modulesList').innerHTML=h;
}

// upload handled by direct input overlay

async function doUploadMods(input){
  if(!input.files.length){ input.value=''; return; }
  var fd = new FormData();
  for(var i=0;i<input.files.length;i++) fd.append('files',input.files[i]);
  var r = await api('/api/admin/modules',{method:'POST',body:fd});
  if(r&&r.ok){ toast('已上传 '+(r.added?r.added.length:input.files.length)+' 个模块'); loadAll(); }
  else toast('上传失败');
  input.value='';
}

function copyModLink(id){ copyText(org()+'/api/modules/'+id+'/raw'); }
function toggleMenu(e, id) {
  e.stopPropagation();
  var d = document.getElementById('menu-' + id);
  var isOpen = d.style.display === 'block';
  document.querySelectorAll('.menu-drop').forEach(function(m) { m.style.display = 'none'; });
  if (!isOpen) d.style.display = 'block';
}
document.addEventListener('click', function() {
  document.querySelectorAll('.menu-drop').forEach(function(m) { m.style.display = 'none'; });
});
function copyText(t){ navigator.clipboard.writeText(t).then(function(){ toast('已复制'); }).catch(function(){ toast('复制失败'); }); }

function promptReplace(id){ state.modReplaceId=id; document.getElementById('replaceFileInput').click(); }
async function refreshMod(id){ var r=await api('/api/admin/modules/'+id+'/refresh',{method:'POST'}); if(r&&r.ok){ toast('已刷新'); loadAll(); } else toast(r?r.error:'刷新失败'); }
function editMeta(id){
  var m = state.modules.find(function(x){ return x.id===id; });
  if(!m) return;
  showModal('编辑模块信息 — '+esc(m.title||m.filename),
    '<label>标题</label><input class="input" id="metaTitle" value="'+esc(m.title||'')+'">'+
    '<label>版本</label><input class="input" id="metaVersion" value="'+esc(m.version||'')+'">'+
    '<label>作者</label><input class="input" id="metaAuthor" value="'+esc(m.author||'')+'">'+
    '<label>备注</label><textarea class="textarea" id="metaNote" rows="2">'+esc(m.note||'')+'</textarea>',
    async function(close){
      var title = document.getElementById('metaTitle').value.trim();
      var version = document.getElementById('metaVersion').value.trim();
      var author = document.getElementById('metaAuthor').value.trim();
      var note = document.getElementById('metaNote').value.trim();
      var r = await api('/api/admin/modules?id='+id, {method:'PATCH', json:{title:title, version:version, author:author, note:note}});
      if(r&&r.ok){ m.title=title; m.version=version; m.author=author; m.note=note; toast('已保存'); close(); renderMods(); } else toast('保存失败');
    });
}
async function doReplaceMod(input){
  var id=state.modReplaceId; state.modReplaceId=null;
  if(!input.files.length) return;
  var fd=new FormData(); fd.append('file',input.files[0]);
  var r=await api('/api/admin/modules?id='+id,{method:'PUT',body:fd});
  if(r&&r.ok){ toast('已替换'); loadAll(); } else toast('替换失败');
  input.value='';
}

function showImportUrl(){
  showModal('从链接导入模块',
    '<label>模块 URL</label><input class="input" id="importUrl" placeholder="https://.../widget.js">'+
    '<label>文件名 (可选)</label><input class="input" id="importFilename" placeholder="自动从 URL 提取">',
    async function(close){
      var url = document.getElementById('importUrl').value.trim();
      if(!url){ toast('请输入 URL'); return; }
      var filename = document.getElementById('importFilename').value.trim();
      var r = await api('/api/admin/modules/import', {method:'POST', json:{url:url, filename:filename}});
      if(r&&r.ok){ toast('已导入'); close(); loadAll(); } else toast(r?r.error:'导入失败');
    });
}

function promptDeleteMod(id, name){
  showConfirm('确定删除 "'+name+'"？', function(ok){
    if (!ok) return;
    api('/api/admin/modules?id='+id,{method:'DELETE'}).then(function(r){
      if(r&&r.ok){ toast('已删除'); loadAll(); } else toast('删除失败');
    });
  });
}

// ===== COLLECTIONS =====
function renderCols(){
  var cs = state.collections;
  document.getElementById('colCount').textContent='共 '+cs.length+' 个合集';
  if(!cs.length){ document.getElementById('collectionsList').innerHTML='<div class="empty"><div class="ico">&#x1F4C1;</div><p>暂无合集</p></div>'; return; }
  var h='';
  cs.forEach(function(c){
    var n = (c.moduleIds||[]).length;
    h+='<div class="card"><div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px"><div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0">';
    if(c.icon_url) h+='<img src="'+esc(c.icon_url)+'" style="width:40px;height:40px;border-radius:12px;object-fit:cover" onerror="this.remove()">';
    h+='<div style="min-width:0"><div style="font-size:16px;font-weight:600">'+esc(c.title)+'</div><div style="font-size:12px;color:var(--text2);margin-top:3px">'+n+' 个模块'+(c.description?' · '+esc(c.description):'')+'</div></div></div>'+
      '<div style="display:flex;gap:2px"><button class="btn-xs" onclick="copyText(\''+org()+'/api/collections/'+c.slug+'/fwd\')" title="复制订阅链接">&#x1f4cb;</button><button class="btn-xs" onclick="showEditCol(\''+c.id+'\')">&#x270f;</button><button class="btn-xs danger" onclick="promptDeleteCol(\''+c.id+'\',\''+esc(c.title)+'\')">&#x1f5d1;</button></div></div>'+
      '<div style="margin-top:10px"><button class="btn btn-ghost btn-sm" onclick="showPickMods(\''+c.id+'\')">+ 从模块池挑选</button></div></div>';
  });
  document.getElementById('collectionsList').innerHTML=h;
}

function showAddCol(){
  showModal('新建合集',
    '<label>标题</label><input class="input" id="colTitle" placeholder="合集名称">'+
    '<label>描述</label><input class="input" id="colDesc" placeholder="可选">'+
    '<label>图标 URL</label><input class="input" id="colIcon" placeholder="可选，https://...">',
    function(close){
      var title=document.getElementById('colTitle').value;
      if(!title.trim()){ toast('请输入标题'); return; }
      api('/api/admin/collections',{method:'POST',json:{title:title.trim(),description:document.getElementById('colDesc').value.trim(),icon_url:document.getElementById('colIcon').value.trim()}}).then(function(r){
        if(r&&r.ok){ state.collections.push({id:r.id,slug:r.slug,title:title.trim(),description:document.getElementById('colDesc').value.trim(),icon_url:document.getElementById('colIcon').value.trim(),moduleIds:[],created_at:Date.now(),updated_at:Date.now()}); toast('合集已创建'); close(); loadAll(); } else toast('创建失败');
      });
    });
}

function showEditCol(id){
  var col = state.collections.find(function(c){ return c.id===id; });
  if(!col) return;
  showModal('编辑合集',
    '<label>标题</label><input class="input" id="colTitle" value="'+esc(col.title)+'">'+
    '<label>描述</label><input class="input" id="colDesc" value="'+esc(col.description||'')+'">'+
    '<label>图标 URL</label><input class="input" id="colIcon" value="'+esc(col.icon_url||'')+'">',
    function(close){
      var title=document.getElementById('colTitle').value;
      if(!title.trim()){ toast('请输入标题'); return; }
      api('/api/admin/collections',{method:'PATCH',json:{id:id,title:title.trim(),description:document.getElementById('colDesc').value.trim(),icon_url:document.getElementById('colIcon').value.trim()}}).then(function(r){
        if(r&&r.ok){ toast('已更新'); close(); loadAll(); } else toast('更新失败');
      });
    });
}

function showPickMods(colId){
  var col = state.collections.find(function(c){ return c.id===colId; });
  if(!col) return;
  if(!state.modules.length){ toast('请先上传模块'); return; }
  var modIds = col.moduleIds || [];
  var body='<label>选择模块（勾选已有模块添加到合集）</label><div class="pick-list">';
  state.modules.forEach(function(m){
    var ck = modIds.indexOf(m.id)>=0 ? ' checked' : '';
    body+='<div class="pick-item'+ck+'" data-mid="'+m.id+'" onclick="togglePick(this)"><span style="flex:1">'+esc(m.title||m.filename)+'</span><span style="font-size:11px;color:var(--text3)">'+fmt(m.file_size)+'</span></div>';
  });
  body+='</div>';
  showModal('挑选模块 — '+esc(col.title), body, function(close){
    var picked = [];
    document.querySelectorAll('.pick-item.checked').forEach(function(el){ picked.push(el.dataset.mid); });
    api('/api/admin/collections',{method:'PATCH',json:{id:colId,moduleIds:picked}}).then(function(r){
      if(r&&r.ok){ col.moduleIds = picked; toast('已更新'); close(); loadAll(); } else toast('更新失败');
    });
  });
}

function togglePick(el){
  el.classList.toggle('checked');
}

function promptDeleteCol(id, name){
  showConfirm('确定删除合集 "'+name+'"？（模块文件不受影响）', function(ok){
    if (!ok) return;
    api('/api/admin/collections?id='+id,{method:'DELETE'}).then(function(r){
      if(r&&r.ok){ toast('已删除'); loadAll(); } else toast('删除失败');
    });
  });
}

// ===== SETTINGS =====
function renderSettings(){var tm=0,ts=0;state.modules.forEach(function(m){tm++;ts+=m.file_size||0;});
  document.getElementById('statCols').textContent=state.collections.length;
  document.getElementById('statMods').textContent=tm;
  document.getElementById('statSize').textContent=fmt(ts);
}

function toggleTheme(){
  var root = document.documentElement;
  if (root.classList.contains('dark')) {
    root.classList.remove('dark'); root.classList.add('light');
    localStorage.setItem('fwh_theme', 'light');
  } else if (root.classList.contains('light')) {
    root.classList.remove('light');
    localStorage.setItem('fwh_theme', 'auto');
  } else {
    root.classList.add('dark');
    localStorage.setItem('fwh_theme', 'dark');
  }
  updateThemeIcon();
}

function updateThemeIcon(){
  var btn = document.getElementById('btnThemeToggle');
  if (!btn) return;
  var root = document.documentElement;
  if (root.classList.contains('dark')) btn.textContent = '\u{1F319}';
  else if (root.classList.contains('light')) btn.textContent = '\u2600\uFE0F';
  else btn.textContent = '\u{1F313}';
}

function exportData(){
  showPrompt('导出备份', 'fwh-backup-' + new Date().toISOString().slice(0,10), function(filename) {
    if (!filename) return;
    function doExport() {
      var count = 0; var total = state.modules.length;
      var combined = { meta: { modules: state.modules, collections: state.collections, exportedAt: new Date().toISOString() }, files: {} };
      function downloadNext() {
    if (count >= state.modules.length) {
      // All done, save combined JSON
      var blob = new Blob([JSON.stringify(combined, null, 2)], {type:'application/json'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename + '.json';
      a.click();
      toast('已导出 ' + count + ' 个模块');
      return;
    }
    var m = state.modules[count];
    fetch(org() + '/api/modules/' + m.id).then(function(r) {
      return r.text();
    }).then(function(code) {
      combined.files[m.id] = { filename: m.filename, content: code };
      count++;
      downloadNext();
    }).catch(function() {
      combined.files[m.id] = { filename: m.filename, error: 'download failed' };
      count++;
      downloadNext();
    });
  }
      downloadNext();
    }
    if (state.modules.length > 20) {
      showConfirm('共 ' + state.modules.length + ' 个模块，逐个导出可能较慢。\n\n继续导出所有模块？', function(ok) { if(ok) doExport(); });
    } else { doExport(); }
  });
}

function importBackup(){
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async function() {
    if (!input.files.length) return;
    var file = input.files[0];
    try {
      var text = await file.text();
      var data = JSON.parse(text);
      if (!data.meta || !data.files) { toast('无效的备份文件'); return; }
      var modCount = Object.keys(data.files).length;
      if (!await showConfirmAsync('将导入 ' + modCount + ' 个模块及合集配置，已有同名模块将被覆盖。\n\n确认导入？')) return;
      var uploaded = 0;
      for (var fid in data.files) {
        var f = data.files[fid];
        var blob = new Blob([f.content], {type:'application/javascript'});
        var fd = new FormData();
        fd.append('files', blob, f.filename);
        var r = await api('/api/admin/modules', {method:'POST', body:fd});
        if (r && r.ok) uploaded++;
      }
      if (data.meta.collections && data.meta.collections.length) {
        for (var ci = 0; ci < data.meta.collections.length; ci++) {
          await api('/api/admin/collections', {method:'POST', json:data.meta.collections[ci]});
        }
      }
      toast('导入完成：' + uploaded + '/' + modCount + ' 个模块');
      loadAll();
    } catch(e) { toast('解析失败：' + e.message); }
  };
  input.click();
}

async function changePassword(){
  var pwd = document.getElementById('pwdNew').value.trim();
  if (!pwd) { toast('请输入密码'); return; }
  if (pwd.length < 4) { toast('密码至少 4 位'); return; }
  var r = await api('/api/admin/change-password', {method:'POST', json:{password:pwd}});
  if (r && r.ok) { toast('密码已修改，下次登录生效'); document.getElementById('pwdNew').value = ''; }
  else toast(r ? r.error : '修改失败');
}

function clearAllData(){
  showConfirm('确定清除所有模块和合集？此操作不可撤销！', function(ok){
    if (!ok) return;
    showConfirm('再次确认：将删除所有数据', function(ok2){
      if (!ok2) return;
      var promises = [];
      state.modules.forEach(function(m){ promises.push(api('/api/admin/modules?id='+m.id,{method:'DELETE'})); });
      state.collections.forEach(function(c){ promises.push(api('/api/admin/collections?id='+c.id,{method:'DELETE'})); });
      Promise.all(promises).then(function(){ toast('已清除'); loadAll(); });
    });
  });
}

// ===== MODAL =====
function showModal(t,b,oc){
  var o=document.createElement('div');o.className='modal-overlay';
  o.innerHTML='<div class="modal"><h3>'+t+'</h3><div class="desc"></div>'+b+'<div class="btn-row"><button class="btn" id="mc">取消</button><button class="btn btn-primary" id="mC">确认</button></div></div>';
  document.body.appendChild(o);
  function cl(){o.remove();}
  o.addEventListener('click',function(e){if(e.target===o)cl();});
  document.getElementById('mc').addEventListener('click',cl);
  document.getElementById('mC').addEventListener('click',function(){oc(cl);});
}

function showConfirm(msg, onOk) {
  var o=document.createElement('div');o.className='modal-overlay';
  o.innerHTML='<div class="modal"><h3>确认</h3><p style="margin:8px 0;line-height:1.5">'+msg+'</p><div class="btn-row"><button class="btn" id="mc">取消</button><button class="btn btn-primary" id="mC">确认</button></div></div>';
  document.body.appendChild(o);
  var done = false;
  function cl(r){ if(done)return; done=true; o.remove(); onOk(r); }
  o.addEventListener('click',function(e){if(e.target===o)cl(false);});
  document.getElementById('mc').addEventListener('click',function(){cl(false);});
  document.getElementById('mC').addEventListener('click',function(){cl(true);});
}
function showConfirmAsync(msg) {
  return new Promise(function(resolve) { showConfirm(msg, resolve); });
}

function showPrompt(title, def, cb) {
  var o=document.createElement('div');o.className='modal-overlay';
  o.innerHTML='<div class="modal"><h3>'+title+'</h3><input class="input" id="promptInput" value="'+esc(def)+'" style="margin:8px 0"><div class="btn-row"><button class="btn" id="mc">取消</button><button class="btn btn-primary" id="mC">确认</button></div></div>';
  document.body.appendChild(o);
  var done = false;
  function cl(v){ if(done)return; done=true; o.remove(); cb(v); }
  o.addEventListener('click',function(e){if(e.target===o)cl(null);});
  document.getElementById('mc').addEventListener('click',function(){cl(null);});
  document.getElementById('mC').addEventListener('click',function(){cl(document.getElementById('promptInput').value);});
}

(function(){var v=localStorage.getItem('fwh_theme');if(v==='dark')document.documentElement.classList.add('dark');else if(v==='light')document.documentElement.classList.add('light');else if(window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.classList.add('dark');})();

// Sync favicon to header
(function(){
  var link = document.getElementById('faviconLink');
  if (link && link.href) {
    var img = document.getElementById('headerIcon');
    if (img) { img.src = link.href; img.style.display = 'block'; }
  }
})();

checkAuth();
<\/script>
</body>
</html>`;
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Cookie',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    const ADMIN_HASH = await sha256(env.ADMIN_PASSWORD || '');
    function verifyAuth(r) {
      const c = (r.headers.get('Cookie')||'').match(/fwh_admin=([^;]+)/);
      return c && ADMIN_HASH && c[1] === ADMIN_HASH;
    }

    async function getModules() { const d = await env.KV.get('modules','json'); return d||[]; }
    async function saveModules(m) { await env.KV.put('modules',JSON.stringify(m)); }
    async function getCollections() { const d = await env.KV.get('collections','json'); return d||[]; }
    async function saveCollections(c) { await env.KV.put('collections',JSON.stringify(c)); }

    // Auth
    if (path === '/api/admin/auth') {
      if (method === 'GET') return json({ enabled: !!env.ADMIN_PASSWORD, authenticated: verifyAuth(request) });
      if (method === 'POST') {
        const { password } = await request.json().catch(()=>({}));
        if (!password || password !== env.ADMIN_PASSWORD) return json({ error: 'wrong password' }, 401);
        return json({ ok: true }, 200, { 'Set-Cookie': 'fwh_admin='+await sha256(password)+'; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400' });
      }
    }

    // Admin: import module from URL
    if (path === '/api/admin/modules/import') {
      if (!verifyAuth(request)) return json({ error: 'Unauthorized' }, 401);
      if (method !== 'POST') return json({ error: 'Method not allowed' }, 405);
      const body = await request.json().catch(() => ({}));
      if (!body.url) return json({ error: 'url required' }, 400);
      const mods = await getModules();
      const now = Date.now();
      let filename = body.filename || '';
      try {
        const remoteResp = await fetch(body.url);
        if (!remoteResp.ok) return json({ error: 'Failed to fetch URL: '+remoteResp.status }, 400);
        const buf = await remoteResp.arrayBuffer();
        if (!filename) {
          const u = new URL(body.url);
          filename = u.pathname.split('/').pop() || 'import.js';
        }
        const id = genId();
        const meta = parseMeta(filename, new Uint8Array(buf.slice(0, 2048)));
        const mod = {
          id, filename,
          widget_id: meta.id || id,
          title: meta.title || filename.replace(/\.js$/, ''),
          version: meta.version || '', author: meta.author || '',
          file_size: buf.byteLength,
          is_encrypted: isEncrypted(new Uint8Array(buf)),
          source_url: body.url,
          note: '',
          created_at: now, updated_at: now
        };
        mods.push(mod);
        await env.KV.put('file:' + id, buf);
        await saveModules(mods);
        return json({ ok: true, added: [mod] }, 201);
      } catch (e) {
        return json({ error: 'Failed to fetch: ' + e.message }, 400);
      }
    }

    // Admin: standalone modules CRUD
    if (path === '/api/admin/modules') {
      if (!verifyAuth(request)) return json({ error: 'Unauthorized' }, 401);
      const mods = await getModules();
      if (method === 'GET') return json(mods);
      if (method === 'POST') {
        const fd = await request.formData();
        const files = fd.getAll('files');
        const now = Date.now(); const added = [];
        for (const file of files) {
          if (!(file instanceof File) || !file.name) continue;
          const id = genId();
          const buf = await file.arrayBuffer();
          const meta = parseMeta(file.name, new Uint8Array(buf.slice(0,2048)));
          const mod = {
            id, filename: file.name,
            widget_id: meta.id || id,
            title: meta.title || file.name.replace(/\.js$/,''),
            version: meta.version || '', author: meta.author || '',
            file_size: buf.byteLength,
            is_encrypted: isEncrypted(new Uint8Array(buf)),
            note: '',
            created_at: now, updated_at: now
          };
          mods.push(mod);
          added.push(mod);
          await env.KV.put('file:'+id, buf);
        }
        if (added.length) { await saveModules(mods); return json({ ok: true, added }, 201); }
        return json({ error: 'no valid files' }, 400);
      }
      if (method === 'DELETE') {
        const id = url.searchParams.get('id');
        const idx = mods.findIndex(m => m.id === id);
        if (idx === -1) return json({ error: 'Not found' }, 404);
        await env.KV.delete('file:'+id);
        mods.splice(idx, 1);
        await saveModules(mods);
        const cols = await getCollections();
        let changed = false;
        cols.forEach(c => { if (c.moduleIds) { const before = c.moduleIds.length; c.moduleIds = c.moduleIds.filter(mid => mid !== id); if (before !== c.moduleIds.length) changed = true; } });
        if (changed) await saveCollections(cols);
        return json({ ok: true });
      }

    // Admin: refresh module from source URL
    const refreshMatch = path.match(/^\/api\/admin\/modules\/([^\/]+)\/refresh$/);
    if (refreshMatch && method === 'POST') {
      if (!verifyAuth(request)) return json({ error: 'Unauthorized' }, 401);
      const modId = refreshMatch[1];
      const mods = await getModules();
      const mod = mods.find(m => m.id === modId);
      if (!mod) return json({ error: 'Not found' }, 404);
      if (!mod.source_url) return json({ error: 'No source URL' }, 400);
      try {
        const remoteResp = await fetch(mod.source_url);
        if (!remoteResp.ok) return json({ error: 'Failed to fetch: '+remoteResp.status }, 400);
        const buf = await remoteResp.arrayBuffer();
        const meta = parseMeta(mod.filename, new Uint8Array(buf.slice(0, 2048)));
        mod.title = meta.title || mod.title;
        mod.version = meta.version || '';
        mod.author = meta.author || '';
        mod.file_size = buf.byteLength;
        mod.is_encrypted = isEncrypted(new Uint8Array(buf));
        mod.updated_at = Date.now();
        await env.KV.put('file:'+modId, buf);
        await saveModules(mods);
        return json({ ok: true });
      } catch (e) {
        return json({ error: 'Refresh failed: '+e.message }, 400);
      }
    }

    // Admin: change password
    if (path === '/api/admin/change-password' && method === 'POST') {
      if (!verifyAuth(request)) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      if (!body.password || body.password.length < 4) return json({ error: 'Password too short' }, 400);
      await env.KV.put('admin_password', body.password);
      return json({ ok: true });
    }

      if (method === 'PATCH') {
        const body = await request.json().catch(() => ({}));
        const id = url.searchParams.get('id');
        const mod = mods.find(m => m.id === id);
        if (!mod) return json({ error: 'Not found' }, 404);
        if (body.title !== undefined) mod.title = body.title;
        if (body.version !== undefined) mod.version = body.version;
        if (body.author !== undefined) mod.author = body.author;
        if (body.note !== undefined) mod.note = body.note;
        mod.updated_at = Date.now();
        await saveModules(mods);
        return json({ ok: true });
      }
      if (method === 'PUT') {
        const id = url.searchParams.get('id');
        const mod = mods.find(m => m.id === id);
        if (!mod) return json({ error: 'Not found' }, 404);
        const fd = await request.formData();
        const file = fd.get('file');
        if (!(file instanceof File)) return json({ error: 'No file' }, 400);
        const buf = await file.arrayBuffer();
        const meta = parseMeta(file.name, new Uint8Array(buf.slice(0,2048)));
        mod.filename = file.name;
        mod.widget_id = meta.id || mod.id;
        mod.title = meta.title || file.name.replace(/\.js$/,'');
        mod.version = meta.version || '';
        mod.author = meta.author || '';
        mod.file_size = buf.byteLength;
        mod.is_encrypted = isEncrypted(new Uint8Array(buf));
        mod.updated_at = Date.now();
        await env.KV.delete('file:'+id);
        await env.KV.put('file:'+id, buf);
        await saveModules(mods);
        return json({ ok: true });
      }
    }

    // Collections CRUD
    if (path === '/api/admin/collections') {
      if (!verifyAuth(request)) return json({ error: 'Unauthorized' }, 401);
      const cols = await getCollections();
      if (method === 'GET') return json(cols);
      if (method === 'POST') {
        const body = await request.json().catch(()=>({}));
        const title = body.title || '';
        if (!title.trim()) return json({ error: 'title required' }, 400);
        const now = Date.now();
        const slug = pinyinSlug(title) || 'col-'+now;
        const col = {
          id: genId(), slug, title: title.trim(),
          description: body.description || '', icon_url: body.icon_url || '',
          moduleIds: body.moduleIds || [],
          created_at: now, updated_at: now
        };
        cols.push(col);
        await saveCollections(cols);
        return json({ ok: true, id: col.id, slug: col.slug }, 201);
      }
      if (method === 'PATCH') {
        const body = await request.json().catch(()=>({}));
        const col = cols.find(c => c.id === body.id);
        if (!col) return json({ error: 'Not found' }, 404);
        if (body.title !== undefined) col.title = body.title;
        if (body.description !== undefined) col.description = body.description;
        if (body.icon_url !== undefined) col.icon_url = body.icon_url;
        if (body.moduleIds !== undefined) col.moduleIds = body.moduleIds;
        col.updated_at = Date.now();
        await saveCollections(cols);
        return json({ ok: true });
      }
      if (method === 'DELETE') {
        const id = url.searchParams.get('id');
        const idx = cols.findIndex(c => c.id === id);
        if (idx === -1) return json({ error: 'Not found' }, 404);
        cols.splice(idx, 1);
        await saveCollections(cols);
        return json({ ok: true });
      }
    }

    // Public: fwd subscription (exactly matches original format)
    const fwdMatch = path.match(/^\/api\/collections\/([^\/]+)(?:\/fwd)?$/);
    const fwdDotMatch = path.match(/^\/api\/collections\/(.+)\.fwd$/);
    if (fwdMatch || fwdDotMatch) {
      const cols = await getCollections();
      const slug = (fwdMatch ? fwdMatch[1] : fwdDotMatch[1]).replace(/\/fwd$/, '');
      const col = cols.find(c => c.slug === slug);
      if (!col) return json({ error: 'Not found' }, 404);
      const allMods = await getModules();
      const widgets = [];
      const colMods = col.moduleIds || [];
      if (colMods.length > 0) {
        for (const mid of colMods) {
          const m = allMods.find(x => x.id === mid);
          if (!m) continue;
          let wid = m.widget_id;
          if ((!wid || wid === m.id) && !m.is_encrypted) {
            try {
              const head = await env.KV.get('file:'+mid, 'arrayBuffer');
              if (head) {
                const meta = parseMeta(m.filename, new Uint8Array(head.slice(0, 2048)));
                wid = meta.id || mid;
              }
            } catch(e) { wid = mid; }
          }
          wid = wid || mid;
          widgets.push({
            id: wid,
            title: m.title || m.filename,
            description: m.note || '',
            requiredVersion: '0.0.1',
            version: m.version || '1.0.0',
            author: m.author || '',
            url: url.origin + '/api/modules/' + m.id + '/raw'
          });
        }
      } else if (col.modules && Array.isArray(col.modules)) {
        for (const m of col.modules) {
          const mid = m.id;
          let wid = m.widget_id || mid;
          if (!m.is_encrypted) {
            try {
              const head = await env.KV.get('file:'+mid, 'arrayBuffer');
              if (head) {
                const meta = parseMeta(m.filename, new Uint8Array(head.slice(0, 2048)));
                wid = meta.id || wid;
              }
            } catch(e) {}
          }
          widgets.push({
            id: wid,
            title: m.title || m.filename,
            description: m.note || '',
            requiredVersion: '0.0.1',
            version: m.version || '1.0.0',
            author: m.author || '',
            url: url.origin + '/api/modules/' + mid + '/raw'
          });
        }
      }
      return json({
        title: col.title, description: col.description || '',
        icon: col.icon_url || '',
        widgets: widgets
      });
    }

    // Public: module download (raw + plain)
    const rawMatch = path.match(/^\/api\/modules\/([^\/]+)\/raw$/) || path.match(/^\/api\/modules\/([^\/]+)$/);
    if (rawMatch) {
      const buf = await env.KV.get('file:'+rawMatch[1], 'arrayBuffer');
      if (!buf) return json({ error: 'File not found' }, 404);
      const mods = await getModules();
      const m = mods.find(x => x.id === rawMatch[1] || x.widget_id === rawMatch[1]);
      return new Response(buf, {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Serve HTML for non-API requests, handle /:id.js downloads, 404 for unknown API
    // Also support direct download from /{id}.js or /{id}
    const directMatch = path.match(/^\/([a-f0-9-]{36})(?:\.js)?$/);
    if (directMatch) {
      const buf = await env.KV.get('file:'+directMatch[1], 'arrayBuffer');
      if (buf) {
        return new Response(buf, {
          headers: {
            'Content-Type': 'application/javascript; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }
    if (path.startsWith('/api/')) {
      return new Response('Not found', { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
    return new Response(HTML.replace(/<\\\/script>/g, '</script>'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', ...extraHeaders } });
}
async function sha256(t) {
  const d = new TextEncoder().encode(t);
  const h = await crypto.subtle.digest('SHA-256', d);
  return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join('');
}
function genId() { return crypto.randomUUID(); }
function pinyinSlug(t) {
  return t.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g,'-').replace(/^-|-$/g,'').substring(0,60) || 'untitled';
}
function parseMeta(fn, head) {
  const t = new TextDecoder().decode(head);
  const meta = {};
  // Support both /* WidgetMetadata { ... } */ and WidgetMetadata = { ... }
  const m = t.match(/\/\*[\s\S]*?WidgetMetadata\s*\{/) || t.match(/WidgetMetadata\s*=\s*\{/);
  if (m) {
    // Find balanced braces to capture full WidgetMetadata content
    let depth = 1;
    let start = m.index + m[0].length;
    let i = start;
    while (i < t.length && depth > 0) {
      if (t[i] === '{') depth++;
      else if (t[i] === '}') depth--;
      i++;
    }
    const body = t.slice(start, i - 1);
    // Extract key-value pairs, preferring earlier (top-level) over nested
    const pairs = body.match(/(\w+)\s*:\s*"([^"]*)"/g);
    if (pairs) pairs.forEach(x => { const kv = x.match(/(\w+)\s*:\s*"([^"]*)"/); if (kv && !meta[kv[1]]) meta[kv[1]] = kv[2]; });
  }
  return meta;
}
function isEncrypted(buf) {
  for (let i = 0; i < Math.min(buf.length, 32); i++) {
    if (buf[i] === 0xAE || buf[i] === 0xFE) return 1;
  }
  return 0;
}
