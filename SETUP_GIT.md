# Git 安全配置说明

## 当前配置
远程仓库已配置为使用 HTTPS 方式。

## 推荐的安全方式

### 方式1：使用 SSH 密钥（最推荐）

1. **生成 SSH 密钥**（如果还没有）：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. **将公钥添加到 GitHub**：
```bash
cat ~/.ssh/id_ed25519.pub
```
复制输出的内容，然后：
- 访问 https://github.com/settings/keys
- 点击 "New SSH key"
- 粘贴公钥内容并保存

3. **更改远程仓库为 SSH 方式**：
```bash
git remote set-url origin git@github.com:yuna-75/2025_summary.git
```

### 方式2：使用 GitHub CLI

1. **安装 GitHub CLI**：
```bash
brew install gh
```

2. **登录**：
```bash
gh auth login
```

3. **使用 GitHub CLI 推送**：
```bash
gh repo sync
```

### 方式3：使用 macOS Keychain（当前系统）

已配置使用 macOS Keychain 存储凭据。首次推送时会提示输入用户名和 token。

**注意**：Personal Access Token 应该保存在安全的地方，不要提交到代码仓库中。

