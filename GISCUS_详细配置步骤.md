# Giscus 评论系统详细配置步骤

## 为什么看不到 repo_id 和 category_id？

需要按顺序完成以下 3 个前置步骤：
1. ✅ 仓库必须是 Public（公开）
2. ⚠️ 必须启用 GitHub Discussions
3. ⚠️ 必须安装 Giscus App

## 第一步：确认仓库是公开的

1. 访问：https://github.com/ormisia/ormisia.github.io
2. 检查仓库名称旁边是否显示 **Public**
3. 如果显示 **Private**，需要改为 Public：
   - 进入 Settings → Danger Zone → Change visibility → Make public

## 第二步：启用 GitHub Discussions（重要！）

### 方法一：通过仓库设置启用

1. 访问仓库设置页面：
   ```
   https://github.com/ormisia/ormisia.github.io/settings
   ```

2. 向下滚动到 **Features** 部分（在页面中间位置）

3. 找到 **Discussions** 选项，勾选它旁边的复选框 ☑️

4. 点击 **Set up discussions** 按钮

5. 会自动创建一个欢迎讨论帖

### 方法二：检查是否已启用

访问你的仓库首页，查看顶部标签栏：
```
Code  Issues  Pull requests  Discussions  Actions  ...
```

如果看到 **Discussions** 标签，说明已启用 ✅

**当前状态**：访问 https://github.com/ormisia/ormisia.github.io 检查是否有 Discussions 标签

## 第三步：安装 Giscus App

### 详细安装步骤：

1. **访问 Giscus App 页面**
   ```
   https://github.com/apps/giscus
   ```

2. **点击绿色按钮**
   - 如果从未安装过：点击 **Install** 按钮
   - 如果已安装过其他仓库：点击 **Configure** 按钮

3. **选择账户**
   - 选择你的个人账户：`ormisia`

4. **选择仓库**
   - 选择 **Only select repositories** (只选择特定仓库)
   - 在下拉菜单中选择或搜索：`ormisia/ormisia.github.io`
   - 点击选中这个仓库

5. **确认安装**
   - 点击 **Install** 或 **Save** 按钮
   - 可能需要输入 GitHub 密码确认

## 第四步：在 Giscus 网站获取配置

### 现在才能获取配置信息：

1. **访问 Giscus 配置页面**
   ```
   https://giscus.app/zh-CN
   ```

2. **输入仓库信息**
   - 在"仓库"输入框中填写：
     ```
     ormisia/ormisia.github.io
     ```
   - 按回车或等待几秒

3. **等待验证**
   - 如果前面步骤都正确，会显示：
     ```
     ✅ 成功！此仓库满足所有条件
     ```

   - 如果显示错误：
     - ❌ "仓库未找到" → 检查仓库是否 Public
     - ❌ "未启用 Discussions" → 回到第二步
     - ❌ "未安装 giscus app" → 回到第三步

4. **配置选项**

   **页面 ↔️ discussions 映射关系**
   - 选择：`pathname` (路径名)

   **Discussion 分类**
   - 推荐选择：`Announcements` (公告)
   - 或选择：`General` (常规)

5. **复制配置代码**

   向下滚动到页面底部，会看到生成的代码：

   ```html
   <script src="https://giscus.app/client.js"
           data-repo="ormisia/ormisia.github.io"
           data-repo-id="R_kgDOxxxxxxx"
           data-category="Announcements"
           data-category-id="DIC_kwDOxxxxxxx"
           data-mapping="pathname"
           data-strict="0"
           data-reactions-enabled="1"
           data-emit-metadata="0"
           data-input-position="bottom"
           data-theme="preferred_color_scheme"
           data-lang="zh-CN"
           crossorigin="anonymous"
           async>
   </script>
   ```

6. **记录关键信息**

   从上面的代码中，找到并复制：
   - `data-repo-id="R_kgDOxxxxxxx"` → 这就是你的 **repo_id**
   - `data-category-id="DIC_kwDOxxxxxxx"` → 这就是你的 **category_id**

## 第五步：更新博客配置

1. **编辑配置文件**

   打开 `_config.butterfly.yml`，找到 giscus 部分：

   ```yaml
   giscus:
     repo: ormisia/ormisia.github.io
     repo_id: R_kgDOxxxxxxx  # 粘贴你复制的 repo_id
     category_id: DIC_kwDOxxxxxxx  # 粘贴你复制的 category_id
     light_theme: light
     dark_theme: dark
     mapping: pathname
   ```

2. **重新部署博客**

   ```bash
   hexo clean
   hexo generate
   hexo deploy
   ```

3. **测试评论功能**

   - 访问 https://ormisia.github.io
   - 打开任意文章
   - 滚动到文章底部
   - 应该能看到 Giscus 评论框
   - 点击 "使用 GitHub 登录" 即可评论

## 常见问题排查

### Q1: Giscus 网站一直显示"验证中..."

**原因**：前置条件未满足

**解决方案**：
1. 确认仓库是 Public
2. 确认已启用 Discussions（访问仓库首页看是否有 Discussions 标签）
3. 确认已安装 Giscus App（访问 https://github.com/apps/giscus 检查）

### Q2: 显示"未启用 discussions"

**解决方案**：
```
访问：https://github.com/ormisia/ormisia.github.io/settings
找到 Features 部分
勾选 ✅ Discussions
点击 Set up discussions
```

### Q3: 显示"giscus 未安装"

**解决方案**：
```
访问：https://github.com/apps/giscus
点击 Install 或 Configure
选择 ormisia/ormisia.github.io
点击 Install/Save
```

### Q4: 博客评论框不显示

**可能原因**：
1. repo_id 或 category_id 配置错误
2. 浏览器缓存问题
3. 网络问题（Giscus 需要访问 GitHub）

**解决方案**：
1. 检查 `_config.butterfly.yml` 中的 ID 是否正确
2. 清除浏览器缓存或使用隐私模式访问
3. 检查浏览器控制台是否有错误信息

## 快速检查清单

完成配置前，请确认：

- [ ] 仓库是 Public 公开状态
- [ ] 访问仓库能看到 Discussions 标签
- [ ] Giscus App 已安装并授权
- [ ] 在 giscus.app 输入仓库后看到 ✅ 成功提示
- [ ] 已复制 repo_id 和 category_id
- [ ] 已更新 _config.butterfly.yml 配置
- [ ] 已重新部署博客
- [ ] 访问博客文章底部能看到评论框

## 需要帮助？

如果按照以上步骤仍然有问题，请检查：
1. GitHub 账户是否是 `ormisia`（而不是其他账户）
2. 是否有仓库的管理员权限
3. 网络是否能正常访问 GitHub
