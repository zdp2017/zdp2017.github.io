# Hexo + GitHub Pages 搭建个人博客教程

> **本文定位**：只教一件事——用 Hexo 在 GitHub Pages 上搭建一个可以公开访问的个人博客。从装工具到上线，零基础照做即可。
> **实测环境**：Windows · Node.js v24.18（v18+ 均可）· npm 11（版本跟随 Node）· Git 2.55 · Hexo v8.1.2 · hexo-cli v4.3.2（2026-09 实测通过）
> **两条部署路线（先记住，后面不迷路）**：本教程主线推荐 **路线 B（GitHub Actions 自动部署）**——配置一次后，以后发文章只需 `git push`，全自动发布；**路线 A（hexo deploy 直推）**作为传统备选保留在第 10 节末尾。**做之前先决定走哪条，两条不要混用。**

---

## 目录

1. [搭建全流程总览](#1-搭建全流程总览)
2. [准备工作：装 2 个工具 + 注册 GitHub](#2-准备工作装-2-个工具--注册-github)
3. [安装 Hexo 并初始化博客](#3-安装-hexo-并初始化博客)
4. [博客目录结构与关键文件](#4-博客目录结构与关键文件)
5. [配置站点信息 `_config.yml`](#5-配置站点信息-configyml)
6. [写第一篇文章](#6-写第一篇文章)
7. [本地预览：先在自己电脑上看到博客](#7-本地预览先在自己电脑上看到博客)
8. [选择并安装主题（美化外观，可选）](#8-选择并安装主题美化外观可选)
9. [建 GitHub 仓库（决定你的网址）](#9-建-github-仓库决定你的网址)
10. [部署上线（推荐路线 B：GitHub Actions 自动部署）](#10-部署上线推荐路线-bgithub-actions-自动部署)
11. [日常内容管理：新增、修改、删除文章](#11-日常内容管理新增修改删除文章)
12. [常见问题排查（FAQ）](#12-常见问题排查faq)
13. [附录：命令速查 + 从零到上线最小闭环](#13-附录命令速查--从零到上线最小闭环)
14. [附录二：分支开发 → 合并 main → 自动部署](#14-附录二分支开发--合并-main--自动部署)

---

## 1. 搭建全流程总览

```
本机：写 Markdown 文章（source/_posts/） → 本地预览确认（hexo server）
                                      ↓
GitHub：push 源码到仓库 main 分支 →（路线B）GitHub Actions 自动编译并发布
                          →（路线A）本机 hexo generate + hexo deploy 直推
                                      ↓
线上：全世界访问 https://你的用户名.github.io
```

**四个环节**：
1. **本机环境**：装 Node.js + Git + 注册 GitHub
2. **本地建站**：`hexo init` 生成博客 → 写文章 → `hexo server` 预览
3. **源码入库**：把博客源码推送到 GitHub 仓库
4. **自动发布**：GitHub Actions 收到 push 后自动编译部署 → 生成公开网址

> **新手最常见的困惑**：hexo 的 `generate`（编译）和 `deploy`（推送）到底要不要自己敲？
> - **路线 B（本教程主线）**：编译和部署都由 GitHub 在云端完成，你只需要 `git push`，**不用敲 generate/deploy**。
> - **路线 A**：需要自己敲 `hexo generate && hexo deploy`。
> 本文默认你走 **路线 B**。第 11 节会给你路线 B 的日常命令；第 10.6 附路线 A 的完整做法，供对比选择。

---

## 2. 准备工作：装 2 个工具 + 注册 GitHub

### 2.1 安装 Node.js（Hexo 的运行环境，必须 ≥ 18）

1. 打开 <https://nodejs.org/>（国内慢可访问 <https://npmmirror.com/mirrors/node/>）。
2. 下载 **LTS（长期支持版）** Windows 安装包（.msi，64 位），一路默认安装。
3. **验证**——打开 PowerShell（Win 键搜 "PowerShell"），输入：

   ```powershell
   node -v
   npm -v
   ```

   **验证标准**：分别输出 `v18.x.x` 或 `v22.x.x` 或 `v24.x.x` 和 `10.x.x` 或 `11.x.x` 之类版本号即成功（**npm 版本号跟随 Node，装的新版 Node 配新版 npm，都正常**）。
   - `node` = 运行环境；`npm` = 包管理器（装 Node 时自带），用它装 Hexo。

### 2.2 安装 Git

1. 打开 <https://git-scm.com/download/win> 下载安装，全部默认选项。
2. **验证**：

   ```powershell
   git --version
   ```

   **验证标准**：输出 `git version 2.x.x.windows.x` 即成功。

3. 配置你的身份（Git 提交记录需要，写你自己的名字和邮箱）：

   ```powershell
   git config --global user.name "你的名字"
   git config --global user.email "你的邮箱@example.com"
   ```

### 2.3 注册 GitHub

1. 打开 <https://github.com/> 免费注册账号。**用户名建议用你名字的拼音/英文**——它决定你博客的网址，定了之后不好改。
2. 注册后先**验证邮箱**（GitHub 会发确认邮件，不点确认无法推送）。
3. 仓库**先不建**，第 9 节讲清楚该建什么名字。

> ⚠️ **关于网络**：GitHub 在国内可能不稳定。如果 push/clone 卡住，先看第 12 节 FAQ 的网络条目，有完整解法。

---

## 3. 安装 Hexo 并初始化博客

### 3.1 全局安装 hexo-cli（脚手架工具）

```powershell
npm install -g hexo-cli
```

**验证标准**：

```powershell
hexo version
```

输出包含 `hexo-cli: 4.3.2` 和 `hexo: 8.1.2` 之类即成功。

> 💡 如果 `npm install` 极慢或报错，先换成国内镜像源（一次性生效）：
> ```powershell
> npm config set registry https://registry.npmmirror.com
> ```

### 3.2 初始化博客目录

在你想放博客的父目录（如 `D:\`）下执行：

```powershell
cd D:\
hexo init myblog
cd myblog
npm install
```

**这条命令在做什么**：
1. `hexo init myblog`：从 GitHub 克隆"空白博客模板"到 `myblog`（含主题、配置、示例文章）；
2. `npm install`：下载 Hexo 引擎及插件（需几分钟，耐心等）。

> 💡 若 `hexo init` 卡在下载模板（国内访问 GitHub 不稳），手动克隆效果一样：
> ```powershell
> git clone https://github.com/hexojs/hexo-starter.git myblog
> cd myblog
> npm install
> ```

**验证标准**：`myblog` 目录下能看到 `_config.yml`、`package.json`、`source`、`themes`、`scaffolds`、`node_modules`，即初始化成功。

> ⚠️ **只用一个包管理器**：本文全程用 **npm**。如果你电脑上还装了 pnpm/yarn，**不要用它们在这个项目里装依赖**——npm 和 pnpm 混用会导致 `node_modules` 结构冲突，报莫名其妙的错（见 FAQ）。删掉 `node_modules` 用 npm 重装即可恢复。

---

## 4. 博客目录结构与关键文件

```
myblog/
├── _config.yml        ← 站点配置（博客名、作者……最重要的文件）
├── package.json       ← 依赖清单（一般不用动）
├── scaffolds/         ← 文章模板（hexo new 按模板生成新文件）
├── source/            ← ★ 你写文章的地方
│   └── _posts/        ←    所有博客文章（Markdown 放这里）
├── themes/            ← 主题文件夹
├── public/            ← 编译产物（hexo generate 生成，不用手动管）
├── node_modules/      ← 依赖包（不用管）
└── .gitignore         ← git 忽略规则（已自动排除 node_modules/ 和 public/，别删）
```

**你只需要关心 3 个位置**：
- `source/_posts/` —— 放文章（日常写作）
- `_config.yml` —— 改配置
- `themes/` —— 换外观

---

## 5. 配置站点信息 `_config.yml`

用文本编辑器（推荐 VS Code）打开根目录 `_config.yml`，改最上面几行：

```yaml
# Site 站点信息
title: 我的博客              # 博客标题（浏览器标签、首页标题）
subtitle:                     # 副标题（可选）
description:                  # 一句话描述（利于搜索引擎收录）
keywords:                     # 关键词（逗号分隔）
author: 你的名字              # 作者名
language: zh-CN              # 语言（默认 en，改成中文）
timezone: Asia/Shanghai      # 时区（中国时区，否则日期差 8 小时）
```

**⚠️ YAML 格式陷阱**（新手 90% 的报错源头）：
- **冒号后必须有空格**：`title: 我的博客` ✅，`title:我的博客` ❌
- 缩进用空格、不用 Tab
- 注释用 `#`

改完保存即可，第 7 节能看到效果。

---

## 6. 写第一篇文章

### 6.1 用命令创建文章

```powershell
hexo new "我的第一篇博客"
```

命令会在 `source/_posts/` 下生成 `我的第一篇博客.md`，头部按模板自动填充：

```markdown
---
title: 我的第一篇博客
date: 2026-09-03 11:30:00
tags:
---
```

这段被 `---` 包住的内容叫 **Front Matter（文章元信息）**。可以扩展：

```markdown
---
title: 我的第一篇博客    # 标题（默认取文件名）
date: 2026-09-03        # 发布时间
tags: [Hexo, 博客]       # 标签
categories: 教程         # 分类
---
```

### 6.2 正文就是普通 Markdown

在 Front Matter 下面直接写正文，语法与 Typora/语雀一致：

```markdown
---
title: 我的第一篇博客
date: 2026-09-03
tags: [Hexo]
---

# 标题

正文段落……

## 二级标题

```python
print("Hello Hexo!")
```
```

> ✍️ 建议：每篇文章固定打 `分类`（树状体系）+ `标签`（扁平关键词）——`categories: 教程` + `tags: [Hexo, Git]` 这种组合，文章多了靠它们检索。

---

## 7. 本地预览：先在自己电脑上看到博客

```powershell
hexo server
```

**验证标准**：浏览器打开 <http://localhost:4000>，能看到博客首页和《我的第一篇博客》——**本地全链路已通**。

`Ctrl + C` 停止服务。常用简写：`hexo server` = `hexo s`；`hexo generate` = `hexo g`。

> 提示：`hexo server` 运行中改文章会自动刷新；改 `_config.yml` 后需重启或先 `hexo clean`。

---

## 8. 选择并安装主题（美化外观，可选）

默认主题 Landscape 功能少、观感朴素。两个高人气选择（任选其一）：

| 主题 | 特点 | 官方地址 |
|------|------|---------|
| **Next** | 最流行、简洁文档风、教程多、新手首选 | <https://github.com/next-theme/hexo-theme-next> |
| **Fluid** | 中文社区活跃、颜值高、卡片风 | <https://github.com/fluid-dev/hexo-theme-fluid> |

### 以 Next 为例（在博客根目录执行）

```powershell
# 1. 下载主题到 themes/next
git clone https://github.com/next-theme/hexo-theme-next.git themes/next

# 2. 修改根目录 _config.yml：把 theme: landscape 改成 theme: next

# 3. 重新生成并预览（分两条命令执行）
hexo clean
hexo server
```

**验证标准**：刷新 <http://localhost:4000>，外观已变化。

> 主题自己的详细配置（导航栏/头像/评论）在 `themes/next/_config.yml`（Next）里，改完同样要 `hexo clean` 后再看效果。各主题配置方式略不同，以主题 README 为准。

---

## 9. 建 GitHub 仓库（决定你的网址）

### 9.1 仓库名决定网址（先看懂，别建错）

GitHub Pages 有两种形态：

| | 方式 A · 用户主页站点 ⭐ | 方式 B · 项目站点 |
|---|---|---|
| **仓库名** | **`你的用户名.github.io`**（必须与用户名完全一致） | 任意名（`blog` 等） |
| **最终网址** | `你的用户名.github.io`（最短、无子路径） | `你的用户名.github.io/仓库名` |
| **账号限制** | 一个账号只能建 1 个 | 无数个 |
| **用途** | **个人主博客** | 项目展示页 |

**做个人博客选方式 A**。操作：GitHub 右上角 **+ → New repository**：

| 配置项 | 填什么 |
|--------|--------|
| Repository name | **你的用户名.github.io**（必须与用户名完全一致） |
| Public / Private | **Public**（Pages 免费托管要求公开） |
| Add README | 不勾（保持空仓库，我们稍后推源码上去） |
| 其他 | 全部默认，点 Create repository |

### 9.2 给博客源码做 Git 初始化（本地）

在 `myblog` 目录执行（**只做一次**）：

```powershell
cd 你的myblog路径
git init -b main
git add -A
git commit -m "博客初版"
```

> `-b main` 表示主分支叫 main（GitHub 默认分支名，后面都要一致）。
> 提交时若提示配置 user.name/user.email，回到 2.2 第 3 步配置后再提交。

**验证标准**：`git log` 能看到一条 commit 记录。

---

## 10. 部署上线（推荐路线 B：GitHub Actions 自动部署）

> 路线 B 的目标：**源码推送到 GitHub → 云端自动编译发布**，之后发文章只需 `git push`。
> 本路线**不需要安装 hexo-deployer-git，不需要在 _config.yml 配 deploy 段**（那些是路线 A 的东西，别混）。

### 10.1 创建 Actions 工作流文件

在 `myblog` 目录下新建文件夹 `.github/workflows/`，在里面新建文件 `deploy.yml`，内容如下（**整体复制**，无需修改）：

```yaml
name: Deploy Hexo Blog to GitHub Pages

# 触发：推送代码到 main 分支时自动执行
on:
  push:
    branches:
      - main
  workflow_dispatch:   # 也允许在 GitHub 网页上手动触发

# 授权：允许写入 Pages
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

> 这段是 GitHub 官方 Pages + Actions 方案（`deploy-pages`），不是社区旧方案（`peaceiris` 推 gh-pages 分支）。两者别混用——本教程只教官方方案。

### 10.2 推送源码（触发第一次自动构建）

先确认远端地址（用 SSH 格式，比 HTTPS 在国内更稳，原因见 FAQ）：

```powershell
git remote add origin git@github.com:你的用户名/你的用户名.github.io.git
git branch -M main
git push -u origin main
```

> 首次 push 前需要身份验证——**Git for Windows 自带 Git Credential Manager**，第一次 push 会自动弹出 GitHub 登录窗口，登录一次即记住，无需额外安装工具。如果 HTTPS/SSH 连接报网络错误，看 FAQ 网络条目。

**推送成功后**，打开仓库网页 → **Actions** 标签页，能看到 `Deploy Hexo Blog to GitHub Pages` 正在运行，约 1-3 分钟变绿（成功）。

### 10.3 网页上开启 GitHub Pages（关键一步，很多人卡在这）

👉 打开：`https://github.com/你的用户名/你的用户名.github.io/settings/pages`

在 **Build and deployment** 区域：
1. **Source** 选 **GitHub Actions**（⚠️ 不是 "Deploy from a branch"——我们用的是官方 Actions 方案）
2. 保存

**判断成功**：Settings → Pages 页面顶部出现绿色横幅 "Your site is live at https://xxx.github.io"，等 1-3 分钟生效。

### 10.4 验证上线

浏览器打开 **https://你的用户名.github.io**，看到和本地一样的博客即上线成功。

> 若首次 404：刚构建完有延迟，等 1-3 分钟刷新；仍不行看 FAQ。

### 10.5 以后更新内容 = 只需 git push

路线 B 配好后，日常发布只有一条路（详见第 11 节）：本地改完 → `git add -A; git commit -m "说明"; git push` → 云端自动发布。

### 10.6 备选：路线 A（hexo deploy 直推）——不想用 Actions 时再看

> 如果你想保留"本机编译推送"的传统方式（不走云端构建），按下面做；**与路线 B 二选一，不要同时配置**。

1. 安装部署插件：

   ```powershell
   npm install hexo-deployer-git --save
   ```

2. 编辑 `_config.yml` 底部，配置部署地址：

   ```yaml
   # Deployment
   deploy:
     type: git
     repo: git@github.com:你的用户名/你的用户名.github.io.git
     branch: main
   ```

3. 发布命令（本机编译并推送）：

   ```powershell
   hexo clean
   hexo generate
   hexo deploy
   ```

4. 此路线的 Pages 设置不同：Settings → Pages → Source 选 **Deploy from a branch** → 分支 `main` / 目录 `/(root)`。

> 对比：路线 A 每次都要本机敲三条命令，且依赖本机环境；路线 B 配一次后任何电脑 push 即发。**推荐路线 B。**

---

## 11. 日常内容管理：新增、修改、删除文章

> 核心心法：**内容管理 = 管好 `source/_posts/` 里的 .md 文件**。增/删/改都只动文件，然后发布（路线 B 是 `git push`，云端自动编译）。

### 11.1 新增一篇文章

```powershell
hexo new "文章标题"        # ① 在 source/_posts/ 生成 文章标题.md
# ② 编辑该 .md 写正文（Front Matter + Markdown）
git add -A                 # ③ 记录改动
git commit -m "新增文章：文章标题"
git push                   # ④ 推送 → 云端自动发布
```

> 小技巧：
> - 文章文件名会变成网址的一部分，建议用英文或拼音：`hexo new "hello-world"` → 网址 `.../hello-world.html`。
> - 打草稿不发布：`hexo new draft "标题"` 建草稿 → 写好后 `hexo publish "标题"` 转正式文章（转正后同样走 git push）。
> - 新增"关于我"这类页面（非文章）：`hexo new page "about"`，生成在 `source/about/index.md`。

### 11.2 修改一篇文章（改标题/正文/标签）

```powershell
# ① 用编辑器打开 source/_posts/文章标题.md 修改
#    改正文：编辑 Front Matter 下方内容
#    改标题/日期/标签/分类：编辑文件头部 Front Matter 段
git add -A
git commit -m "修改文章：文章标题"
git push
```

> 💡 想先确认改完效果：`hexo server` 打开 localhost:4000 检查，满意再 push。

### 11.3 删除一篇文章

```powershell
# ① 删除文章文件（任选一种）：
#   方式 A：在文件管理器/编辑器中删除 source\_posts\文章标题.md
#   方式 B：命令行删除（把 文章标题 换成实际文件名）
Remove-Item "source\_posts\文章标题.md"

# ② 发布删除（关键：用 -A，普通 git add . 不一定会记录删除）
git add -A
git commit -m "删除文章：文章标题"
git push
```

**验证标准**：等 1-3 分钟后打开博客，该文章已不在列表。

> ⚠️ 删错想找回：`.md` 已提交过 Git 的话可版本回退找回（见 FAQ）；也可从回收站找回文件放回 `_posts/` 再 push。

### 11.4 三操作速记（路线 B）

| 操作 | 动什么 | 发布 |
|------|--------|------|
| 新增 | `hexo new` + 写 .md | `git add -A; git commit -m "..."; git push` |
| 修改 | 编辑 .md | 同上三连 |
| 删除 | 删除 .md（用 `git add -A`） | 同上三连 |

> 一句话：**改文件 → `git add -A` → `git commit` → `git push`**。云端自动完成编译发布。

---

## 12. 常见问题排查（FAQ）

### 安装 / 环境类

| 症状 | 原因与解决 |
|------|-----------|
| `hexo` 不是内部或外部命令 | hexo-cli 没装上或 PATH 未刷新。重跑 `npm install -g hexo-cli`，**关掉 PowerShell 重开**再试 |
| `hexo init` 卡住/失败 | GitHub 网络不稳。手动克隆：`git clone https://github.com/hexojs/hexo-starter.git myblog` 再 `npm install` |
| `npm install` 极慢或 ERR | 切镜像源：`npm config set registry https://registry.npmmirror.com` |
| `npm install` 报 `TypeError: Cannot read properties of null (reading 'matches')` | **npm 和 pnpm 混用**了：node_modules 是 pnpm 建的符号链接，npm 解析不了。解决：删除 `node_modules` + `pnpm-lock.yaml` + `pnpm-workspace.yaml`，用 `npm install` 重装。**教训：一个项目只用一种包管理器** |
| 执行带 `&&` 的命令报"&& 不是有效的分隔符" | 你在用 Windows PowerShell 5.1，它**不支持 `&&`**（那是 bash 语法）。分行执行，或用 `;` 分隔：`hexo clean; hexo generate` |
| `hexo server` 提示端口 4000 被占用 | 换端口：`hexo server -p 5000`，访问 localhost:5000 |
| 改了 `_config.yml` 不生效 | YAML 缩进/冒号后空格问题，或需要 `hexo clean` 后重启 server |

### 部署 / 网络类

| 症状 | 原因与解决 |
|------|-----------|
| push 报 `Repository not found` | 仓库名拼错；仓库是私有（必须 Public）；远端地址里用户名/仓库名不对 |
| push 报 `Permission denied (publickey)` | SSH 密钥没配（看下面"网络与认证"条） |
| push 报 `CONNECT tunnel failed, response 502` / 超时 / 连不上 github.com | **网络问题**：github.com 主站 HTTPS 可能被墙/代理拦。解法见下面"网络与认证" |
| 网址打开 404 | ① 仓库名不是 `用户名.github.io`；② **Pages 没开启**（Settings → Pages → Source 选对）③ 刚部署还在构建（等 1-3 分钟）；④ 看 Actions 标签页是否报错 |
| Actions 运行失败 | 点进失败的 run 看日志；常见：npm ci 失败（网络）、yml 格式错误（缩进必须 2 空格） |
| 内容推了但线上没变 | Actions 是否真的跑了（仓库 Actions 页）；跑成功但没变→浏览器缓存，强制刷新（Ctrl+F5） |

### 网络与认证（github.com 被墙时的标准解法）

**症状**：HTTPS push/clone 报 502/超时，但浏览器有时能打开 GitHub 网页（或完全打不开）。

**解法：让 Git 走 SSH 的 443 端口**（`ssh.github.com:443` 通常没被墙）：

**① 生成 SSH 密钥**（没有的话）：

```powershell
ssh-keygen -t ed25519 -C "你的邮箱"
# 一路回车即可，生成在 C:\Users\你\.ssh\id_ed25519
```

**② 把公钥添加到 GitHub**：打开 <https://github.com/settings/ssh/new>（登录），Title 随意，把 `C:\Users\你\.ssh\id_ed25519.pub` 的内容整段粘贴进 Key 框 → **Add SSH key**。

**③ 配置 SSH 走 443**：在 `C:\Users\你\.ssh\config` 文件里加（没有就新建，文件名无扩展名）：

```
Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
```

**④ 验证**：

```powershell
ssh -T git@github.com
```

看到 `Hi 你的用户名! You've successfully authenticated` 即成功。

**⑤ 之后所有 git 地址用 SSH 格式**：`git@github.com:用户名/仓库名.git`（教程 10.2 就是这么写的）。

---

## 13. 附录：命令速查 + 从零到上线最小闭环

### 13.1 Hexo 命令速查

| 命令 | 简写 | 作用 |
|------|------|------|
| `hexo init 目录名` | — | 初始化新博客 |
| `hexo new "标题"` | `hexo n` | 新建文章（放 `source/_posts/`） |
| `hexo new draft "标题"` | — | 新建草稿 |
| `hexo publish "标题"` | — | 草稿转正式文章 |
| `hexo generate` | `hexo g` | 本地编译（预览/检查用；路线 B 下线上由云端编译） |
| `hexo server` | `hexo s` | 本地预览（http://localhost:4000） |
| `hexo clean` | `hexo c` | 清除缓存（改配置不生效时先跑） |
| `hexo version` | — | 查看版本 |
| `hexo help` | — | 查看全部命令 |

### 13.2 Git 发布三连（路线 B 日常唯一要记的）

```powershell
git add -A
git commit -m "说明这次改了什么"
git push
```

### 13.3 从零到上线 · 最小闭环（复制即用，路线 B）

```powershell
# === 一次性准备（本机） ===
npm install -g hexo-cli
cd D:\
hexo init myblog
cd myblog
npm install

# === 在 github.com 网页建 Public 仓库：你的用户名.github.io（不勾 README） ===

# === 配置与写第一篇文章 ===
# 编辑 _config.yml：改 title/author/language: zh-CN/timezone
hexo new "Hello World"          # 编辑 source/_posts/Hello-World.md 写正文
hexo server                     # 本地预览 http://localhost:4000（确认后 Ctrl+C）

# === 建 .github/workflows/deploy.yml（复制第 10.1 节内容） ===

# === Git 提交源码并推送 ===
git init -b main
git add -A
git commit -m "博客初版"
git remote add origin git@github.com:你的用户名/你的用户名.github.io.git
git branch -M main
git push -u origin main          # 首次会弹 GitHub 登录窗口（GCM）

# === 网页开 Pages（关键） ===
# Settings → Pages → Source 选 GitHub Actions → Save

# === 验证 ===
# 等 1-3 分钟，浏览器打开 https://你的用户名.github.io
# 日常更新：改文章 → git add -A; git commit -m "..."; git push
```

---

## 14. 附录二：分支开发 → 合并 main → 自动部署

> 你的 workflow 触发条件是 `push 到 main`（见 10.1 的 `on.push.branches: [main]`）。这意味着：**只有 main 分支的更新才会触发自动部署**。利用这一点，可以形成安全的"分支开发"流程——先在分支上写文章、检查无误后再合并进 main，让线上只接收验证过的内容。

### 14.1 触发规则（先看懂）

| 动作 | 是否触发部署 | 说明 |
|------|:---:|------|
| 推送到 `main` | ✅ | 唯一自动触发条件 |
| 把分支 **合并** 进 `main` | ✅ | 合并 = 一次对 main 的 push |
| 推送到其他分支（如 `dev`） | ❌ | 不影响线上 |
| 网页点 **Run workflow** | ✅ | `workflow_dispatch` 手动触发 |

### 14.2 分支开发完整流程（每次发重要文章/大改动时用）

```powershell
# ① 基于 main 开一个新分支（以文章名命名，可读性好）
git checkout -b post-hello-agent

# ② 写文章 + 本地预览确认
hexo new "Hello Agent"
# …… 编辑 source/_posts/Hello-Agent.md 写正文 ……
hexo server                    # 打开 http://localhost:4000 检查效果，确认后 Ctrl+C

# ③ 把分支推到 GitHub（推分支本身不会触发部署，放心推）
git add -A
git commit -m "新文章：Hello Agent"
git push -u origin post-hello-agent

# ④ 网页上合并进 main（两种方式任选）
#   方式 A（推荐）：GitHub 仓库页会提示 "Compare & pull request" → 点开 → 检查改动 → Create pull request → Merge pull request
#   方式 B：命令行合并（先切回 main 拉取最新，再合并推送）
git checkout main
git pull origin main
git merge post-hello-agent
git push origin main           # ← 这次推送才触发自动部署

# ⑤ 验证线上，删掉已合并的分支（可选）
git branch -d post-hello-agent # 本地删除
git push origin --delete post-hello-agent   # 远端删除
```

### 14.3 什么时候用分支，什么时候直接推 main

| 场景 | 做法 |
|------|------|
| 小改动：改错别字、小修小补 | 直接推 main（快） |
| 新写一篇文章 | 直接推 main 即可（文章互不影响，风险低） |
| **大改动**：换主题、改站点配置、批量整理文章 | **开分支**先试，`hexo server` 预览确认，再合并 |
| 想练 Git 规范、或多人协作 | 一律走分支 + Pull Request |

> 原则一句话：**线上只跟 main 走，越大的改动越要先在分支验证**。文章本身没风险可直推；动主题/配置这类"可能搞坏全站"的改动，务必走分支。

---

*教程完 · 你已拥有一个可通过 https://你的用户名.github.io 访问、且发文章只需 git push 的全自动博客。更多配置细节见官方文档：<https://hexo.io/zh-cn/docs/>*
*文档生成时间：2026-09-03 · 版本信息基于当日实测（Hexo 8.1.2 / hexo-cli 4.3.2 / Node 24）*
