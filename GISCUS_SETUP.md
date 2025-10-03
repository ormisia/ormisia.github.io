# 博客评论与访问统计配置指南

## 一、Giscus 评论系统配置（需要 GitHub 登录）

### 第一步：启用 GitHub Discussions

1. 访问仓库设置：https://github.com/ormisia/ormisia.github.io/settings
2. 向下滚动找到 **Features** 部分
3. 勾选 ✅ **Discussions** 选项
4. 点击 **Set up discussions**

### 第二步：安装 Giscus App

1. 访问 https://github.com/apps/giscus
2. 点击 **Install** 或 **Configure**
3. 选择 **Only select repositories**
4. 选择 `ormisia/ormisia.github.io`
5. 点击 **Install** 或 **Save**

### 第三步：获取配置信息

1. 访问 https://giscus.app/zh-CN
2. 在 **仓库** 输入框填入：`ormisia/ormisia.github.io`
3. 等待验证通过（显示 ✅ 绿色勾号）
4. **页面-讨论映射关系**：选择 `pathname`
5. **Discussion 分类**：推荐选择 `Announcements`（公告）
6. 向下滚动到页面底部，复制生成的配置代码中的：
   - `data-repo-id="R_xxxxx"`
   - `data-category-id="DIC_xxxxx"`

### 第四步：更新配置文件

编辑 `_config.butterfly.yml` 文件：

```yaml
giscus:
  repo: ormisia/ormisia.github.io
  repo_id: R_xxxxx  # 替换为你的 repo_id
  category_id: DIC_xxxxx  # 替换为你的 category_id
  light_theme: light
  dark_theme: dark
  mapping: pathname
```

### 第五步：重新部署

```bash
hexo clean
hexo generate
hexo deploy
```

## 二、访问统计配置（从 0 开始）

当前配置已启用 Waline pageview 统计，无需 Waline 服务器即可显示页面浏览次数（从 0 开始计数）。

如需完整统计功能，可以部署 Waline 服务器：
- 访问 https://waline.js.org/guide/get-started/
- 使用 Vercel 一键部署（免费）

## 三、GitHub Pages 源码隐藏说明

✅ **已自动隐藏源码**

- **源码分支**：`main` 分支（包含 Hexo 源文件）
- **部署分支**：`gh-pages` 分支（只有生成的 HTML/CSS/JS）
- GitHub Pages 只发布 `gh-pages` 分支
- 访客只能看到静态网页，看不到源码

**验证方法**：
访问 https://ormisia.github.io 只会看到网页，查看源代码只能看到编译后的 HTML，无法看到 Hexo 源文件。

## 四、配置检查清单

- [ ] GitHub Discussions 已启用
- [ ] Giscus App 已安装
- [ ] `repo_id` 和 `category_id` 已配置
- [ ] 重新部署博客
- [ ] 访问博客测试评论功能

## 五、常见问题

**Q: 评论不显示？**
- 检查 Discussions 是否启用
- 检查 Giscus App 是否正确安装
- 检查 repo_id 和 category_id 是否正确

**Q: 访问统计不准确？**
- Waline pageview 是客户端统计，刷新页面会增加
- 可部署 Waline 服务器获得更准确统计

**Q: 源码会被看到吗？**
- 不会，GitHub Pages 只部署 gh-pages 分支
- main 分支的源码不会被公开访问
