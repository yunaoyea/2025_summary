# GitHub Pages 设置指南

## 如何让别人访问你的项目

### 方式1：GitHub Pages（推荐 - 在线预览）

让别人可以直接在浏览器中查看项目效果，无需下载代码。

#### 设置步骤：

1. **访问仓库设置**
   - 打开 https://github.com/yuna-75/2025_summary
   - 点击右上角的 **Settings**（设置）

2. **启用 GitHub Pages**
   - 在左侧菜单中找到 **Pages** 选项
   - 在 **Source** 部分，选择：
     - Branch: `main`
     - Folder: `/ (root)`
   - 点击 **Save** 保存

3. **等待部署**
   - GitHub 会自动部署你的网站
   - 通常需要 1-2 分钟
   - 部署完成后，会显示访问地址：
     **https://yuna-75.github.io/2025_summary/**

4. **分享链接**
   - 将这个链接分享给其他人
   - 他们可以直接在浏览器中查看项目效果

### 方式2：GitHub 仓库（查看代码）

**仓库地址：** https://github.com/yuna-75/2025_summary

- 别人可以查看所有代码
- 可以下载或克隆项目
- 可以查看提交历史

### 方式3：本地运行

如果别人想本地运行项目：

```bash
# 克隆项目
git clone https://github.com/yuna-75/2025_summary.git

# 进入项目目录
cd 2025_summary

# 直接在浏览器中打开 index.html
open index.html
```

## 注意事项

- GitHub Pages 是免费的静态网站托管服务
- 每次推送代码后，GitHub Pages 会自动更新
- 如果修改了代码，记得推送到 GitHub，Pages 会自动重新部署

