---
title: Hexo + GitHub Pages 搭建个人博客教程
date: 2026-09-03 18:00:00
categories:
  - 笔记
tags:
  - Hexo
  - GitHub Pages
---

# Hexo + GitHub Pages 搭建个人博客教程

> **定位**：只教一件事——用 Hexo 在 GitHub Pages 搭一个可公开访问的博客，全程自动部署（配置一次后，发文章只需 `git push`）。
> **实测环境**：Windows · Node v24（v18+ 均可）· Git 2.55 · Hexo 8.1.2 · hexo-cli 4.3.2（2026-09 实测通过）

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
12. [常见问题排查（FAQ）](#12-常见问题排查faq)
13. [附录：命令速查 + 从零到上线最小闭环](#13-附录命令速查--从零到上线最小闭环)

---

## 1. 全流程总览

```
本机：写 Markdown 文章 → 本地预览确认（hexo server）
  ↓
GitHub：push 源码到仓库 main 分支 → Actions 云端自动编译并发布
  ↓
线上：https://你的用户名.github.io
```

只需要记 4 件事：**装工具 → 本地建站 → 源码入库 → push 即发布**。编译（generate）和部署（deploy）全程由 GitHub 云端完成，**你永远不用敲这两个命令**。

---

## 2. 准备工作：装 2 个工具 + 注册 GitHub

### 2.1 安装 Node.js（≥ 18）

1. 打开 <https://nodejs.org/>（国内慢可访问 <https://npmmirror.com/mirrors/node/>），下载 **LTS** 版 Windows 安装包（.msi），一路默认。
2. 验证——打开 PowerShell（Win 键搜 "PowerShell"）：

   ```powershell
   node -v
   npm -v
   ```

   能输出版本号即成功（如 `v24.x` / `11.x`；npm 版本跟随 Node，看到 10 或 11 都正常）。

### 2.2 安装 Git

1. 打开 <https://git-scm.com/download/win> 下载安装，全部默认。
2. 验证 + 配置身份：

   ```powershell
   git --version
   git config --global user.name "你的名字"
   git config --global user.email "你的邮箱@example.com"
   ```

### 2.3 注册 GitHub

1. 打开 <https://github.com/> 免费注册。**用户名建议用名字拼音/英文**——它决定博客网址，定了不好改。
2. 注册后先**点邮件确认邮箱**（不确认无法推送）。
3. 仓库先不建，第 9 节再建。

> 网络提醒：GitHub 在国内不稳定，若后面 push 卡住，看第 12 节 FAQ 的「网络与认证」。

---

## 3. 安装 Hexo 并初始化博客

### 3.1 全局安装脚手架

```powershell
npm install -g hexo-cli
hexo version        # 验证：输出 hexo-cli: 4.x 与 hexo: 8.x 即成功
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

> ⚠️ **全程只用 npm**。若电脑还装了 pnpm/yarn，别在这个项目用——混用会导致 `node_modules` 结构冲突报错（见 FAQ）。删掉 `node_modules` 用 npm 重装即可。

---

## 4. 博客目录结构

```
myblog/
├── _config.yml        ← 站点配置（博客名、作者…最重要的文件）
├── package.json       ← 依赖清单（不用动）
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

> 原理：GitHub 收到你 push 到 main 的源码 → 在云端自动编译 → 发布到 Pages。**配置一次，以后发文章只敲 `git push`**。

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

- 地址用 **SSH 格式**（`git@github.com:...`），比 HTTPS 在国内稳（原因见 FAQ）。
- 首次 push 会弹出 **Git Credential Manager** 登录窗口，登录一次即记住，无需装其他工具。
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
> 草稿：`hexo new draft "标题"` 建草稿，写好后 `hexo publish "标题"` 转正式（转正后同样 git push）。
> 非文章页面（如"关于我"）：`hexo new page "about"`。

### 修改

打开 `source/_posts/文章标题.md` 编辑——改正文改中间，改标题/日期/标签改头部 Front Matter。然后 git 三连。想先看效果：`hexo server` 检查满意再 push。

### 删除

```powershell
Remove-Item "source\_posts\文章标题.md"   # ① 删文件
git add -A                                 # ② 关键：用 -A，git add . 不记录删除
git commit -m "删除文章：文章标题"
git push
```

> 删错找回：文件提交过 Git 可版本回退；或在回收站找回放回 `_posts/` 再 push。

### 大改动先开分支（进阶）

workflow 只在 **push 到 main** 时触发。利用这点：大改动（换主题/改配置）先开分支，预览无误再合并进 main——**合并 = 一次对 main 的 push，同样自动部署**；推其他分支不影响线上。

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

## 12. 常见问题排查（FAQ）

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

## 13. 附录：命令速查 + 从零到上线最小闭环

### 13.1 Hexo 命令速查

| 命令 | 简写 | 作用 |
|------|------|------|
| `hexo init 目录名` | — | 初始化新博客 |
| `hexo new "标题"` | `hexo n` | 新建文章（`source/_posts/`） |
| `hexo new draft "标题"` | — | 新建草稿 |
| `hexo publish "标题"` | — | 草稿转正式 |
| `hexo generate` | `hexo g` | 本地编译（检查用；线上由云端编译） |
| `hexo server` | `hexo s` | 本地预览 localhost:4000 |
| `hexo clean` | `hexo c` | 清缓存（改配置不生效时先跑） |

### 13.2 Git 发布三连（日常唯一要记的）

```powershell
git add -A
git commit -m "说明这次改了什么"
git push
```

### 13.3 从零到上线 · 最小闭环（复制即用）

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
git push -u origin main        # 首次弹 GitHub 登录窗口

# === 网页开 Pages：Settings → Pages → Source 选 GitHub Actions → Save ===

# === 验证 ===
# 等 1-3 分钟打开 https://你的用户名.github.io
# 日常更新：改文章 → git add -A; git commit -m "..."; git push
```

---

*教程完 · 你已拥有一个发文章只需 git push 的全自动博客。官方文档：<https://hexo.io/zh-cn/docs/>*
*文档生成时间：2026-09-03 · 实测环境：Hexo 8.1.2 / hexo-cli 4.3.2 / Node 24*
