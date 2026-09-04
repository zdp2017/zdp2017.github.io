---
title: Hexo + GitHub Pages 搭建个人博客教程
date: 2026-09-03 18:00:00
categories:
  - 笔记
tags:
  - Hexo
  - GitHub Pages
---


> **定位**：只教一件事——用 Hexo 在 GitHub Pages 搭一个可公开访问的博客，全程自动部署。**配置一次后，发文章只需 `git push`。**
> **实测环境**：Windows · Node v24（v18+ 均可）· Git 2.55 · Hexo 8.1.2 · hexo-cli 4.3.2 · 默认主题 Landscape（2026-09 实测通过）

---

## 目录

1. [全流程总览](#1-全流程总览)
2. [准备工作：装 2 个工具 + 注册 GitHub](#2-准备工作装-2-个工具--注册-github)
3. [安装 Hexo 并初始化博客](#3-安装-hexo-并初始化博客)
4. [博客目录结构](#4-博客目录结构)
5. [配置站点信息 `_config.yml`](#5-配置站点信息-configyml)
6. [写第一篇文章](#6-写第一篇文章)
7. [本地预览](#7-本地预览)
8. [安装主题（可选）](#8-安装主题可选)
9. [建 GitHub 仓库 + 源码入库](#9-建-github-仓库--源码入库)
10. [部署上线（GitHub Actions 自动部署）](#10-部署上线github-actions-自动部署)
11. [日常内容管理：新增、修改、删除](#11-日常内容管理新增修改删除)
12. [让博客更好用（进阶）：板块文件夹与站内搜索](#12-让博客更好用进阶板块文件夹与站内搜索)
13. [常见问题排查（FAQ）](#13-常见问题排查faq)
14. [附录：命令速查 + 从零到上线最小闭环](#14-附录命令速查--从零到上线最小闭环)

---

## 1. 全流程总览

```
本机：写 Markdown 文章 → 本地预览确认（hexo server）
  ↓
GitHub：push 源码到仓库 main 分支 → Actions 云端自动编译并发布
  ↓
线上：https://你的用户名.github.io
```

只需记 4 件事：**装工具 → 本地建站 → 源码入库 → push 即发布**。编译、部署都在 GitHub 云端完成，**你永远不用敲这两个命令**。

---

## 2. 准备工作：装 2 个工具 + 注册 GitHub

### 2.1 安装 Node.js（≥ 18）

1. 打开 <https://nodejs.org/>（国内慢可访问 <https://npmmirror.com/mirrors/node/>），下载 **LTS** 版 Windows 安装包（.msi），一路默认。
2. 验证——打开 PowerShell（Win 键搜 "PowerShell"）：

   ```powershell
   node -v
   npm -v
   ```

   能输出版本号即成功（如 `v24.x` / `11.x`；npm 版本跟随 Node，10 或 11 都正常）。

### 2.2 安装 Git

1. 打开 <https://git-scm.com/download/win> 下载安装，全部默认。
2. 验证 + 配置身份：

   ```powershell
   git --version
   git config --global user.name "你的名字"
   git config --global user.email "你的邮箱@example.com"
   ```

### 2.3 注册 GitHub

1. 打开 <https://github.com/> 免费注册。**用户名建议用拼音/英文**——它决定博客网址，定了不好改。
2. 注册后先**点邮件确认邮箱**（不确认无法推送）。
3. 仓库先不建，第 9 节再建。

> 若 push 卡住或报网络错误，看第 13 章 FAQ「网络与认证」——国内访问 GitHub 的常见坑都在那里。

---

## 3. 安装 Hexo 并初始化博客

### 3.1 全局安装脚手架

```powershell
npm install -g hexo-cli
hexo version        # 输出 hexo-cli: 4.x 与 hexo: 8.x 即成功
```

> npm 太慢时先切国内镜像源：`npm config set registry https://registry.npmmirror.com`

### 3.2 初始化博客目录

在父目录（如 `D:\`）执行：

```powershell
cd D:\
hexo init myblog
cd myblog
npm install
```

- `hexo init` = 下载空白博客模板；`npm install` = 安装引擎（需几分钟）。
- `hexo init` 卡住（国内访问 GitHub 不稳）时，手动克隆效果一样：

  ```powershell
  git clone https://github.com/hexojs/hexo-starter.git myblog
  cd myblog
  npm install
  ```

**验证**：`myblog` 下能看到 `_config.yml`、`package.json`、`source`、`themes`、`scaffolds`、`node_modules`。

> ⚠️ **全程只用 npm**。若电脑还装了 pnpm/yarn，别在这个项目里混用——混用会破坏 `node_modules` 结构（见 FAQ）。删掉 `node_modules` 用 npm 重装即可。

---

## 4. 博客目录结构

```
myblog/
├── _config.yml        ← 站点配置（博客名、作者…最重要的文件）
├── package.json       ← 依赖清单（基本不用动）
├── scaffolds/         ← 文章模板（hexo new 按它生成新文件）
├── source/_posts/     ← ★ 你的文章都放这（日常写作只碰这里）
├── themes/            ← 主题（换外观）
├── public/            ← 编译产物（自动生成，不用管）
├── node_modules/      ← 依赖包（不用管）
└── .gitignore         ← 已自动排除 node_modules/ 和 public/（别删）
```

**日常只需关心 3 处**：`source/_posts/`（写文章）、`_config.yml`（改配置）、`themes/`（换主题）。

---

## 5. 配置站点信息 `_config.yml`

用 VS Code 打开根目录 `_config.yml`，改顶部几行：

```yaml
# Site
title: 我的博客            # 博客标题
subtitle:                 # 副标题（可选）
author: 你的名字           # 作者名
language: zh-CN          # 语言（默认 en，改成中文）
timezone: Asia/Shanghai  # 中国时区，否则日期差 8 小时
```

**YAML 格式陷阱**（90% 报错源头）：

- 冒号后必须有空格：`title: 我的博客` ✅，`title:我的博客` ❌
- 缩进用空格、不用 Tab；注释用 `#`

---

## 6. 写第一篇文章

### 6.1 创建文章

```powershell
hexo new "我的第一篇博客"
```

在 `source/_posts/` 生成 `我的第一篇博客.md`。打开它，顶部是 Front Matter（文章元信息），下面写正文：

````markdown
---
title: 我的第一篇博客
date: 2026-09-03 18:00:00
categories: 教程
tags: [Hexo, 博客]
---

正文就是普通 Markdown，语法和 Typora/语雀一致……

```python
print("Hello Hexo!")
```
````

- **`---` 必须是文件第一个字符**（从别处复制的文件要自己补这整段头，否则报错，见 FAQ）
- `categories`（分类，树状体系）+ `tags`（标签，扁平关键词）建议每篇都写，文章多了靠它们检索

---

## 7. 本地预览

```powershell
hexo server
```

浏览器打开 <http://localhost:4000>，能看到首页和《我的第一篇博客》即本地链路已通。`Ctrl + C` 停止。

> 运行中改文章会自动刷新；改 `_config.yml` 后需重启或先 `hexo clean`。
> 简写：`hexo s` = server；`hexo g` = generate；`hexo clean` 清缓存。

---

## 8. 安装主题（可选）

默认主题 Landscape 观感朴素。高人气选择：

| 主题 | 特点 | 地址 |
|------|------|------|
| **Next** | 最流行、简洁文档风、新手首选 | <https://github.com/next-theme/hexo-theme-next> |
| **Fluid** | 中文社区活跃、颜值高、卡片风 | <https://github.com/fluid-dev/hexo-theme-fluid> |

以 Next 为例（在博客根目录）：

```powershell
git clone https://github.com/next-theme/hexo-theme-next.git themes/next
# 然后编辑根目录 _config.yml：theme: landscape 改为 theme: next
hexo clean
hexo server        # 刷新 localhost:4000 验证
```

主题细节配置（导航/头像等）在 `themes/next/_config.yml`，改完同样 `hexo clean` 后生效。

---

## 9. 建 GitHub 仓库 + 源码入库

### 9.1 仓库名决定网址（别建错）

| | 用户主页站点 ⭐ | 项目站点 |
|---|---|---|
| **仓库名** | **`你的用户名.github.io`**（必须与用户名完全一致） | 任意名 |
| **网址** | `你的用户名.github.io`（无子路径，最短） | `你的用户名.github.io/仓库名` |
| **限制** | 一个账号只能建 1 个 | 无数个 |
| **用途** | **个人主博客（选这个）** | 项目展示页 |

GitHub 右上角 **+ → New repository**：Repository name 填 **`你的用户名.github.io`**，选 **Public**（Pages 免费托管要求公开），**不勾** Add README，Create。

### 9.2 源码入库（本地，只做一次）

```powershell
cd 你的myblog路径
git init -b main
git add -A
git commit -m "博客初版"
```

验证：`git log` 能看到一条 commit。远端地址等部署节再加。

---

## 10. 部署上线（GitHub Actions 自动部署）

> 原理：GitHub 收到你 push 到 main 的源码 → 云端自动编译 → 发布到 Pages。**配置一次，以后发文章只敲 `git push`**。

### 10.1 创建 Actions 工作流文件

在 `myblog` 下新建 `.github/workflows/deploy.yml`，内容整体复制（无需修改）：

```yaml
name: Deploy Hexo Blog to GitHub Pages

# 触发：推送代码到 main 分支时自动执行
on:
  push:
    branches:
      - main
  workflow_dispatch:   # 也允许在 GitHub 网页上手动触发

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 源码
        uses: actions/checkout@v4
      - name: 安装 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: 安装依赖
        run: npm ci
      - name: 生成静态网页
        run: npx hexo generate
      - name: 上传构建产物
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: 部署到 GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> 这是 GitHub 官方 Pages 方案（deploy-pages）。网上常见的 `peaceiris`（推 gh-pages 分支）是旧方案，别混用。

### 10.2 推送源码（触发第一次构建）

```powershell
git remote add origin git@github.com:你的用户名/你的用户名.github.io.git
git branch -M main
git push -u origin main
```

- 远端地址用 **SSH 格式**（`git@github.com:...`），国内比 HTTPS 稳定（原因见 FAQ「网络与认证」）。
- 首次 push 若报 `Permission denied (publickey)`，说明 SSH 密钥还没配——按 FAQ「网络与认证」第 1-2 步添加公钥后重试。
- push 成功后，打开仓库网页 → **Actions** 标签页，能看到工作流在运行，约 1-3 分钟变绿。

### 10.3 网页开启 GitHub Pages（关键，很多人卡这）

打开 `https://github.com/你的用户名/你的用户名.github.io/settings/pages`，在 **Build and deployment** 区：

1. **Source** 选 **GitHub Actions**（不是 "Deploy from a branch"）
2. Save

成功后页面顶部出现绿色横幅 "Your site is live at ..."。

### 10.4 验证上线

浏览器打开 **https://你的用户名.github.io**，看到和本地一样的博客即成功。首次可能 404——等 1-3 分钟刷新，仍不行看 FAQ。

---

## 11. 日常内容管理：新增、修改、删除

> 心法：**内容管理 = 管好 `source/_posts/` 里的 .md 文件**。改完文件 → `git add -A` → `git commit` → `git push`，云端自动发布。

### 新增

```powershell
hexo new "文章标题"        # ① 生成 source/_posts/文章标题.md
# ② 编辑该文件写正文
git add -A                 # ③ 记录改动
git commit -m "新增文章：文章标题"
git push                   # ④ 自动发布，等 1-3 分钟
```

> 文件名会变成网址一部分，建议用英文/拼音：`hexo new "hello-world"` → 网址 `.../hello-world.html`。
> 草稿：`hexo new draft "标题"` 建草稿，写好后 `hexo publish "标题"` 转正式（同样 git push）。
> 非文章页面（如"关于我"）：`hexo new page "about"`。

### 修改

打开 `source/_posts/文章标题.md` 编辑——正文改中间部分，标题/日期/标签改头部 Front Matter。然后 git 三连。想先看效果：`hexo server` 检查满意再 push。

### 删除

```powershell
Remove-Item "source\_posts\文章标题.md"   # ① 删文件
git add -A                                 # ② 关键：用 -A，git add . 不记录删除
git commit -m "删除文章：文章标题"
git push
```

> 删错找回：文件提交过 Git 可版本回退；或在回收站找回放回 `_posts/` 再 push。

### 大改动先开分支（进阶）

工作流只在 **push 到 main** 时触发。利用这点：大改动（换主题/改配置）先开分支，预览无误再合并进 main——**合并 = 一次对 main 的 push，同样自动部署**；推其他分支不影响线上。

```powershell
git checkout -b change-theme    # ① 开分支
# …… 改主题/配置，hexo server 预览确认 ……
git add -A
git commit -m "换主题"
git push -u origin change-theme # ② 推分支（不触发部署）
# ③ 网页上 Compare & pull request → Merge pull request（或命令行合并后 push main）
git checkout main
git pull origin main
git merge change-theme
git push origin main            # ← 这次才触发部署
git branch -d change-theme      # ④ 清理本地分支
```

---

## 12. 让博客更好用（进阶）：板块文件夹与站内搜索

> 两个能力均**实测于 Hexo 8.1.2 + 默认主题 Landscape**，照做即可。

### 12.1 板块文件夹组织（做成"廖雪峰式"分板块）

想让博客按主题分区（如 Python / AI 论文 / Agent / RAG…），用「**文件夹 + 分类**」组合：文件夹管文件与网址层级，分类管自动聚合页。

**① 文件夹 = 文件分区 + 网址层级**

直接在 `source/_posts/` 下建子文件夹，文章放进去即可：

```
source/_posts/
├── Python/          ← 板块文件夹
│   └── 01-快速入门.md
├── AI论文/
│   └── transformer.md
└── Agent开发/
    └── mcp-guide.md
```

Hexo 会把**子文件夹路径拼进网址**（在日期之后），实测生成：

```text
source/_posts/Python/01-快速入门.md
        ↓
https://你的用户名.github.io/2026/09/04/Python/01-快速入门/
```

注意：

- **Git 不追踪空文件夹**。结构先建好、文章后写时，每个文件夹放一个空占位文件（有真文章后删掉）：

  ```powershell
  New-Item -ItemType Directory -Path "source\_posts\Python"
  New-Item -ItemType File -Path "source\_posts\Python\.gitkeep"   # 占位
  ```

- **文件夹名建议用英文/拼音**，因为它是网址的一部分：中文名会变成 `%E9%98%85%E8%AF%BB` 这种编码（浏览器能正常打开，但链接分享出来难看）。
- 文件夹名**不能用 `/`**（路径分隔符），`+` 等符号也会被剔除。
- **移动文件夹 = 改网址 = 旧链接失效**：趁文章少定好结构，别频繁搬动。

**② 分类 = 自动聚合页 + 侧栏**

文章 Front Matter 写 `categories`，Hexo 自动生成分类页 `/categories/分类名/`，把散在各文件夹的同类文章聚合起来；Landscape 侧栏默认有「分类」组件：

```markdown
---
title: 01-快速入门
categories: Python
---
```

- 多分类：`categories: [Python, 教程]`
- 分类名含 `+`（如 `C++`）时，分类页会生成在 `/categories/C/`——页内标题仍正常显示「目录: C++」，不 404，只是 URL 不理想。想要干净 URL，分类名就用 `Cpp` 这类写法。

**③ 板块开场文**

每个板块放一篇「前言」文章（配合上面的分类），读者进板块第一眼就知道这板块学什么。我的写法：定位一句话 → 会放什么（列表）→ 怎么用 → 一句导读。

### 12.2 站内搜索（结果不出站）

Landscape 默认的搜索框会跳 Google（国内打不开）。本节改成**站内本地搜索**：构建时把文章内容生成索引文件 `search.xml`，网页端用 JavaScript 读取并本地过滤，输入即出结果。

**第 1 步 · 装索引生成插件**

```powershell
npm install hexo-generator-searchdb --save
```

**第 2 步 · 根目录 `_config.yml` 末尾加**

```yaml
# 站内搜索索引
search:
  path: search.xml
  field: all
  content: true
```

**第 3 步 · 主题改造 4 处**（以默认主题 Landscape 为例）

(1) `themes/landscape/layout/_partial/header.ejs`：把原来跳 Google 的搜索框整体换成下面这段。两个要点：输入框留在 `#search-form-wrap` 里（Landscape 的 script.js 靠给这个容器加 `.on` 来展开输入框）；**结果面板必须放在它外面**（原因见"两个关键坑"）：

```html
<div id="search-form-wrap">
  <input type="text" id="local-search-input" class="search-form-input" placeholder="搜索" autocomplete="off">
</div>
<!-- ★ 结果面板放在搜索框容器外面，别嵌进 #search-form-wrap -->
<div id="local-search-result"></div>
```

(2) `themes/landscape/layout/_partial/after-footer.ejs`：在 `<%- js('js/script') %>` 后加一行：

```html
<%- js('js/local-search') %>
```

(3) `themes/landscape/source/js/local-search.js`（新建，整段复制）：

```js
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
  // 输入框获得焦点时也确保面板可用
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
```

(4) `themes/landscape/source/css/_partial/header.styl` 末尾追加：

```styl
// ===== 站内搜索：结果面板（fixed 浮层） =====
#local-search-result
  position: fixed
  top: 56px
  right: 16px
  width: 340px
  max-height: 70vh
  overflow-y: auto
  background: #fff
  border: 1px solid #ddd
  border-radius: 3px
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2)
  display: none
  z-index: 9999
  text-align: left
  padding: 0
.local-search-item
  padding: 8px 12px
  border-bottom: 1px solid #eee
  &:last-child
    border-bottom: none
  a
    color: #258fb8
    font-size: 14px
    &:hover
      text-decoration: underline
  p
    margin: 4px 0 0
    font-size: 12px
    line-height: 1.5
    color: #666
    word-break: break-all
.local-search-empty
  padding: 10px 12px
  color: #999
  font-size: 13px
```

**第 4 步 · 提交推送**

```powershell
git add -A
git commit -m "新增站内搜索"
git push        # 等 1-3 分钟自动发布
```

**验证**：网页右上角点放大镜 → 输入关键词 → 出现白底浮层结果，点标题直达文章。本地可先 `hexo generate`，确认 `public/search.xml` 已生成（索引由插件在每次构建时自动生成，无需手动维护）。

**两个关键坑（都实测踩过，务必照做）**：

1. **结果面板必须 `position: fixed`，且放在搜索框容器外**。一开始我把面板嵌进 `#search-form-wrap`（默认只有 150×30px、藏在屏幕外且 `opacity: 0`）并设成 `position: absolute`，又被 `#header-inner` 的 `overflow: hidden` 裁剪——结果就是"只看到白色空框、没有文字"。改成 fixed + 移出容器后一切正常。
2. **`z-index` 要够大**（示例 9999），否则会被标题栏盖住。

---

## 13. 常见问题排查（FAQ）

### 安装 / 环境

| 症状 | 原因与解决 |
|------|-----------|
| `hexo` 不是内部或外部命令 | hexo-cli 没装或 PATH 未刷新。重跑 `npm install -g hexo-cli`，关 PowerShell 重开 |
| `hexo init` 卡住/失败 | GitHub 网络不稳，手动克隆模板（第 3.2 节） |
| `npm install` 极慢 | 切镜像源：`npm config set registry https://registry.npmmirror.com` |
| `npm install` 报 `Cannot read properties of null (reading 'matches')` | **npm 和 pnpm 混用**。删 `node_modules` + `pnpm-lock.yaml` + `pnpm-workspace.yaml`，用 npm 重装。一个项目只用一种包管理器 |
| 带 `&&` 的命令报"不是有效分隔符" | Windows PowerShell 5.1 不支持 `&&`。分行执行或用 `;`：`hexo clean; hexo generate` |
| `hexo server` 端口 4000 被占用 | `hexo server -p 5000`，访问 localhost:5000 |

### 写作 / 文章内容

| 症状 | 原因与解决 |
|------|-----------|
| `hexo generate` 报 `YAMLException: ... (1:1)`，指向文章第 1 行 | **文件第一行不是 `---`**。常见：从文档复制示例时把代码块边框（`` ```markdown ``）也带进来了。删掉第 1 行多余内容，确保 `---` 是文件第一个字符；文末孤立的 ` ``` ` 一并删 |
| `ERROR Process failed: _posts/xxx.md`（js-yaml），文章没生成，线上也没变化 | 文件**没有 YAML Front Matter**（顶部 `---` 块）。`hexo new` 建的自带；手写/复制的要自己补（格式见第 6 节） |
| 文章推了但线上没变（Actions 显示 success） | 多半是文章被上面两种 YAML 问题静默跳过。排查顺序：① 仓库 Actions 是否 success → ② 本地 `hexo generate` 看有没有 ERROR → ③ 定位文件查它的 Front Matter |

### 部署 / 网络

| 症状 | 原因与解决 |
|------|-----------|
| push 报 `Repository not found` | 仓库名拼错/是私有（必须 Public）/远端地址用户名或仓库名不对 |
| push 报 `Permission denied (publickey)` | SSH 密钥没配，看下面「网络与认证」 |
| push 报 `CONNECT tunnel failed, response 502` / 超时 | 网络问题，看下面「网络与认证」 |
| 网址 404 | ① 仓库名不是 `用户名.github.io`；② Pages 没开启（Settings → Pages → Source）；③ 刚部署在构建（等 1-3 分钟）；④ 看仓库 Actions 是否报错 |
| Actions 运行失败 | 点进失败的 run 看日志；常见 npm ci 失败（网络）或 yml 缩进错误（必须 2 空格） |

### 站内搜索（实现见第 12.2 节）

| 症状 | 原因与解决 |
|------|-----------|
| 点放大镜，输入框出不来 | Landscape 的 script.js 靠 `.nav-search-btn` 点击给 `#search-form-wrap` 加 `.on` 动画展开。检查图标类名与容器 id 是否被改坏，对照 12.2 第 3 步结构 |
| 只看到白框、没有文字 | 面板被裁剪/隐藏：按 12.2「两个关键坑」改（`position: fixed` + 面板放在搜索框容器外） |
| 结果面板被标题栏盖住 | `z-index` 不够大，改到 9999 |
| 搜不到内容 / search.xml 404 | 插件没装或 `_config.yml` 缺 `search:` 配置；确认改动已提交推送 |

### 网络与认证（github.com 被墙的标准解法）

HTTPS push 报 502/超时，但 SSH 的 443 端口（`ssh.github.com`）通常没被墙。解法：

1. 生成密钥：`ssh-keygen -t ed25519 -C "你的邮箱"`（一路回车）
2. 把 `C:\Users\你\.ssh\id_ed25519.pub` 内容整段添加到 <https://github.com/settings/ssh/new>（Title 随意）→ Add SSH key
3. 在 `C:\Users\你\.ssh\config`（没有就新建，无扩展名）写入：

   ```
   Host github.com
     HostName ssh.github.com
     Port 443
     User git
     IdentityFile ~/.ssh/id_ed25519
   ```

4. 验证：`ssh -T git@github.com`，看到 `Hi 你的用户名! You've successfully authenticated` 即成功
5. 之后 git 地址统一用 SSH 格式：`git@github.com:用户名/仓库名.git`

---

## 14. 附录：命令速查 + 从零到上线最小闭环

### 14.1 Hexo 命令速查

| 命令 | 简写 | 作用 |
|------|------|------|
| `hexo init 目录名` | — | 初始化新博客 |
| `hexo new "标题"` | `hexo n` | 新建文章（`source/_posts/`） |
| `hexo new draft "标题"` | — | 新建草稿 |
| `hexo publish "标题"` | — | 草稿转正式 |
| `hexo generate` | `hexo g` | 本地编译（检查用；线上由云端编译） |
| `hexo server` | `hexo s` | 本地预览 localhost:4000 |
| `hexo clean` | `hexo c` | 清缓存（改配置不生效时先跑） |

### 14.2 Git 发布三连（日常唯一要记的）

```powershell
git add -A
git commit -m "说明这次改了什么"
git push
```

### 14.3 从零到上线 · 最小闭环（复制即用）

```powershell
# === 一次性准备 ===
npm install -g hexo-cli
cd D:\
hexo init myblog
cd myblog
npm install

# === 网页建 Public 仓库：你的用户名.github.io（不勾 README）===

# === 配置与第一篇文章 ===
# 编辑 _config.yml：title/author/language: zh-CN/timezone: Asia/Shanghai
hexo new "Hello World"        # 编辑正文
hexo server                   # 预览 localhost:4000，确认后 Ctrl+C

# === 建 .github/workflows/deploy.yml（复制第 10.1 节内容）===

# === 提交并推送 ===
git init -b main
git add -A
git commit -m "博客初版"
git remote add origin git@github.com:你的用户名/你的用户名.github.io.git
git branch -M main
git push -u origin main        # 若报 Permission denied，先按 FAQ 配好 SSH 密钥

# === 网页开 Pages：Settings → Pages → Source 选 GitHub Actions → Save ===

# === 验证 ===
# 等 1-3 分钟打开 https://你的用户名.github.io
# 日常更新：改文章 → git add -A; git commit -m "..."; git push
```

---

*教程完 · 你已拥有一个发文章只需 git push 的全自动博客。官方文档：<https://hexo.io/zh-cn/docs/>*
*文档生成时间：2026-09-03 · 2026-09-04 增补第 12 章（板块文件夹 + 站内搜索），并全篇精简重构*
