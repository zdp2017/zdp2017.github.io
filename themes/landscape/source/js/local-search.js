/* 本地站内搜索：读取 search.xml，纯前端过滤，不跳转外部网站 */
(function(){
  var wrap = document.getElementById('search-form-wrap');
  var input = document.getElementById('local-search-input');
  var result = document.getElementById('local-search-result');
  if (!input || !result) return;

  var db = null;

  // 只加载一次索引
  function loadIndex(){
    if (db) return Promise.resolve(db);
    return fetch('/search.xml', {cache: 'no-cache'})
      .then(function(r){ return r.text(); })
      .then(function(xmlText){
        var xml = new DOMParser().parseFromString(xmlText, 'application/xml');
        var entries = xml.getElementsByTagName('entry');
        db = [];
        for (var i = 0; i < entries.length; i++){
          var get = function(tag){
            var n = entries[i].getElementsByTagName(tag)[0];
            return n ? (n.textContent || '') : '';
          };
          db.push({ title: get('title'), url: get('url'), content: get('content') });
        }
      })
      .catch(function(){ db = []; });
  }

  // 去掉正文 HTML 标签
  function strip(s){
    var d = document.createElement('div');
    d.innerHTML = s;
    return (d.textContent || '').replace(/\s+/g, ' ');
  }
  // 转义标题防止 XSS
  function esc(s){
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function onInput(){
    var q = (input.value || '').trim().toLowerCase();
    if (!q){
      result.style.display = 'none';
      result.innerHTML = '';
      return;
    }
    loadIndex().then(function(){
      var hits = db.filter(function(d){
        return d.title.toLowerCase().indexOf(q) >= 0 || d.content.toLowerCase().indexOf(q) >= 0;
      }).slice(0, 10);

      if (!hits.length){
        result.innerHTML = '<div class="local-search-empty">未找到匹配内容</div>';
      } else {
        result.innerHTML = hits.map(function(h){
          var plain = strip(h.content);
          var idx = plain.toLowerCase().indexOf(q);
          var snip = idx >= 0 ? plain.substr(Math.max(0, idx - 25), 90) : plain.substr(0, 90);
          if (snip.length >= 90) snip += '…';
          return '<div class="local-search-item"><a href="' + h.url + '">' + esc(h.title) + '</a><p>' + esc(snip) + '</p></div>';
        }).join('');
      }
      result.style.display = 'block';
    });
  }

  input.addEventListener('input', onInput);
  // 输入框获得焦点时也确保面板可用（防止被父级 opacity 影响）
  input.addEventListener('focus', function(){
    if ((input.value || '').trim()) onInput();
  });
  // 点击搜索框或结果面板以外的地方才关闭结果
  document.addEventListener('click', function(e){
    if (wrap && !wrap.contains(e.target) && !result.contains(e.target)){
      result.style.display = 'none';
    }
  });
})();
