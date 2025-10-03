# Ormisia's Blog

个人CTF学习博客，使用 Hexo + Butterfly 主题搭建。

## 功能特性

- ✨ 现代化的 Butterfly 主题
- 🎨 Live2D 看板娘
- 📝 文章分类与标签
- 🔍 本地搜索功能
- 📱 响应式设计
- 🚀 快速部署到 GitHub Pages

## 本地开发

### 安装依赖

```bash
npm install
```

### 本地预览

```bash
hexo clean
hexo generate
hexo server
```

访问 http://localhost:4000 查看效果

### 创建新文章

```bash
hexo new "文章标题"
```

### 部署到 GitHub Pages

```bash
hexo clean
hexo generate
hexo deploy
```

## 目录结构

```
.
├── _config.yml           # Hexo 主配置文件
├── _config.butterfly.yml # Butterfly 主题配置
├── source/              # 源文件目录
│   ├── _posts/         # 文章目录
│   ├── about/          # 关于页面
│   ├── categories/     # 分类页面
│   ├── tags/           # 标签页面
│   └── images/         # 图片资源
├── themes/             # 主题目录
│   └── butterfly/      # Butterfly 主题
└── public/             # 生成的静态文件
```

## 技术栈

- **框架**: Hexo 5.5.1
- **主题**: Butterfly
- **插件**:
  - hexo-generator-search (搜索功能)
  - hexo-wordcount (字数统计)
  - hexo-helper-live2d (Live2D)
  - hexo-deployer-git (Git 部署)

## License

MIT
