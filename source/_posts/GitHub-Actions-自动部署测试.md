---
title: GitHub Actions 自动部署测试
date: 2026-09-03 15:34:32
tags:
  - Hexo
  - GitHub Pages
categories: 教程
---

# GitHub Actions 自动部署测试

这是一篇用于验证自动部署链路的测试文章。

如果这篇文章能通过浏览器访问到，说明以下链路全部打通：

1. 本地写文章 → `git push` 到 GitHub
2. GitHub Actions 自动触发构建（Hexo 编译）
3. 构建产物自动发布到 GitHub Pages
4. 全世界可以通过 `https://zdp2017.github.io` 访问

**验证要点**：hello-world.md 已删除，本文是新发布的内容——如果旧文章消失了、新文章出现了，说明整个自动部署链路工作正常。
