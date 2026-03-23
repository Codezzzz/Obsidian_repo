
```
# 1. 다운로드
curl -L -o /tmp/powershell.tar.gz https://github.com/PowerShell/PowerShell/releases/download/v7.6.0/powershell-7.6.0-osx-arm64.tar.gz

# 2. 설치 폴더 생성
sudo mkdir -p /usr/local/microsoft/powershell/7

# 3. 압축 해제
sudo tar zxf /tmp/powershell.tar.gz -C /usr/local/microsoft/powershell/7

# 4. 실행 권한 부여
sudo chmod +x /usr/local/microsoft/powershell/7/pwsh

# 5. 심볼릭 링크 생성
sudo ln -s /usr/local/microsoft/powershell/7/pwsh /usr/local/bin/pwsh
```