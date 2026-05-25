(function () {
  if (document.getElementById('gate-status-panel')) return;

  var style = document.createElement('style');
  style.textContent =
    '#gate-status-panel{position:fixed;bottom:0;left:0;right:0;height:380px;z-index:10000;border:none;background:#080810;box-shadow:0 -4px 24px rgba(0,0,0,0.6);transition:transform 0.3s ease}' +
    '#gate-status-panel.collapsed{transform:translateY(370px)}' +
    '#gate-iframe{width:100%;height:100%;border:none}' +
    '#gate-toggle-btn{position:absolute;top:-30px;left:50%;transform:translateX(-50%);width:40px;height:30px;background:rgba(10,10,24,0.95);border:1px solid rgba(196,30,58,0.4);border-bottom:none;color:#c41e3a;cursor:pointer;border-radius:6px 6px 0 0;font-size:16px;z-index:10001;display:flex;align-items:center;justify-content:center}' +
    '@media(max-width:768px){#gate-status-panel{height:60%}}';

  document.head.appendChild(style);

  var panel = document.createElement('div');
  panel.id = 'gate-status-panel';
  panel.innerHTML =
    '<button id="gate-toggle-btn" onclick="document.getElementById(\'gate-status-panel\').classList.toggle(\'collapsed\')" title="切换状态栏">門</button>' +
    '<iframe id="gate-iframe" src="https://cdn.jsdelivr.net/gh/serafim1261/Zhuang-Tai-Lan@1.1.0/dist/index.html"></iframe>';
  document.body.appendChild(panel);
})();
