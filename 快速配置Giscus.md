# 快速配置 Giscus（已安装 App 到所有仓库）

既然你已经选择了 **All repositories**，Giscus App 已经安装好了 ✅

现在只需要 2 步：

## 第一步：启用 Discussions（必须！）

### 方法 1：直接访问设置页面

**点击这个链接，直接跳转到正确位置**：
```
https://github.com/ormisia/ormisia.github.io/settings
```

然后：
1. 向下滚动，找到 **Features** 区域（在页面中间）
2. 找到 **☐ Discussions** 选项
3. **勾选**它前面的复选框 ✅
4. 点击 **Set up discussions** 按钮（如果出现）

### 方法 2：通过仓库主页

1. 访问：https://github.com/ormisia/ormisia.github.io
2. 点击顶部的 **Settings** (齿轮图标)
3. 按照上面的步骤操作

### 验证 Discussions 是否启用成功

访问 https://github.com/ormisia/ormisia.github.io

看顶部导航栏，应该有这些标签：
```
Code | Issues | Pull requests | Discussions | Actions | Projects | ...
```

如果看到 **Discussions** 标签，说明成功启用 ✅

## 第二步：获取配置 ID

现在可以获取配置了！

1. **访问 Giscus 配置页面**
   ```
   https://giscus.app/zh-CN
   ```

2. **输入你的仓库**

   在"仓库"输入框中填写：
   ```
   ormisia/ormisia.github.io
   ```

   然后按 Enter 或等待几秒

3. **应该看到成功提示**
   ```
   ✅ 成功！此仓库满足所有条件。
   ```

4. **配置选项**

   往下滚动，设置：

   - **页面 ↔️ discussions 映射关系**
     - 选择：`pathname`（路径名）

   - **Discussion 分类**
     - 推荐选择：`Announcements`（公告）
     - 这个分类需要在启用 Discussions 后才会出现

5. **复制配置 ID**

   继续向下滚动到页面最底部，会看到类似这样的代码：

   ```html
   <script src="https://giscus.app/client.js"
           data-repo="ormisia/ormisia.github.io"
           data-repo-id="R_kgDOxxxxxxxx"           ← 复制这个
           data-category="Announcements"
           data-category-id="DIC_kwDOxxxxxxxx"     ← 复制这个
           data-mapping="pathname"
           ...
   </script>
   ```

6. **记录这两个值**
   - `data-repo-id` 的值（以 `R_` 开头）
   - `data-category-id` 的值（以 `DIC_` 开头）

## 第三步：更新配置并部署

1. **编辑 `_config.butterfly.yml`**

   找到 giscus 部分，填入你复制的 ID：

   ```yaml
   giscus:
     repo: ormisia/ormisia.github.io
     repo_id: R_kgDOxxxxxxxx        # 粘贴你的 repo_id
     category_id: DIC_kwDOxxxxxxxx  # 粘贴你的 category_id
     light_theme: light
     dark_theme: dark
     mapping: pathname
   ```

2. **提交并部署**

   ```bash
   # 提交配置更改
   git add _config.butterfly.yml
   git commit -m "更新 Giscus 配置 ID"
   git push origin master:main

   # 重新部署博客
   hexo clean
   hexo generate
   hexo deploy
   ```

## 完成！🎉

访问 https://ormisia.github.io，打开任意文章，滚动到底部应该能看到 Giscus 评论框。

点击"使用 GitHub 登录"即可评论！

---

## 如果仍然看不到 repo_id

### 可能的原因：

**原因 1：Discussions 未启用**
- 解决：按第一步启用 Discussions
- 验证：访问仓库首页，看是否有 Discussions 标签

**原因 2：Discussions 刚启用，还没生效**
- 解决：等待 1-2 分钟后刷新 giscus.app 页面

**原因 3：浏览器缓存问题**
- 解决：使用无痕模式/隐私模式重新访问 giscus.app

**原因 4：Discussion 分类未创建**
- 解决：
  1. 访问 https://github.com/ormisia/ormisia.github.io/discussions
  2. 点击右上角 ⚙️ 图标进入设置
  3. 确认有 "Announcements" 或 "General" 分类

---

## 当前状态检查

请确认以下几点：

- [ ] Giscus App 已安装（All repositories）✅
- [ ] Discussions 已启用（仓库首页能看到 Discussions 标签）
- [ ] 访问 giscus.app 输入仓库后看到 ✅ 成功提示
- [ ] 能看到 repo_id 和 category_id

**第一个未完成的步骤是什么？**
