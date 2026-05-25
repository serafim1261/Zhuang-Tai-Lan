(function() {
  if (document.getElementById('gate-status-panel')) return;

  var STYLE = '\
#gate-status-panel{position:fixed;top:0;right:0;width:420px;height:100vh;z-index:10000;border:none;background:#080810;box-shadow:-4px 0 24px rgba(0,0,0,0.6);transition:transform 0.3s ease}\
#gate-status-panel.hidden{transform:translateX(390px)!important}\
#gate-toggle-btn{position:absolute;left:-30px;top:50%;transform:translateY(-50%);width:30px;height:64px;background:rgba(10,10,24,0.95);border:1px solid rgba(196,30,58,0.4);border-right:none;color:#c41e3a;cursor:pointer;border-radius:6px 0 0 6px;font-size:14px;z-index:10001;display:flex;align-items:center;justify-content:center}\
#gate-iframe{width:100%;height:100%;border:none}\
@media(max-width:768px){#gate-status-panel{width:100vw!important}#gate-status-panel.hidden{transform:translateX(100vw)!important}}\
';

  var style = document.createElement('style');
  style.textContent = STYLE;
  document.head.appendChild(style);

  var panel = document.createElement('div');
  panel.id = 'gate-status-panel';
  panel.innerHTML =
    '<button id="gate-toggle-btn" title="切换状态栏">門</button>' +
    '<iframe id="gate-iframe" src="https://cdn.jsdelivr.net/gh/serafim1261/Zhuang-Tai-Lan@main/dist/index.html"></iframe>';
  document.body.appendChild(panel);

  document.getElementById('gate-toggle-btn').addEventListener('click', function() {
    panel.classList.toggle('hidden');
  });
})();
