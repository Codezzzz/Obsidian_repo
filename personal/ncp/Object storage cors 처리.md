
# NCP 오브젝트 스토리지 설정 가이드 - CORS 처리

## 개요

본 가이드는 네이버 클라우드 플랫폼(NCP) 정부전용 오브젝트 스토리지를 AWS CLI와 s3cmd를 사용하여 설정하고 사용하는 방법을 다룹니다.  
  
  
ncp 오브젝트 스토리지의 경우, 버킷 상태 수정 web ui를 제공하지 않아 아래 내용을 참고해 cors 처리를 진행한다.

## 사전 요구사항

- NCP 액세스 키 및 시크릿 키
    
- Python 3 및 pip3 설치
    
- Homebrew (macOS 사용자의 경우)
    

## 방법 1: AWS CLI 설정

### 1. AWS CLI 설치

`pip3 install awscli`

### 2. AWS CLI 프로필 설정

`aws configure --profile ncp-gov`

프롬프트에 다음 정보를 입력하세요:

- **AWS Access Key ID**: [NCP 액세스 키]
    
- **AWS Secret Access Key**: [NCP 시크릿 키]
    
- **Default region name**: `kr`
    
- **Default output format**: `json`
    
### 3. 설정 테스트

`aws --profile ncp-gov --endpoint-url=https://kr.object.gov-ncloudstorage.com \ s3api get-bucket-cors --bucket gensunny-obst-document`

## 방법 2: s3cmd 설정

### 1. s3cmd 설치

`# macOS (Homebrew 사용) brew install s3cmd # 기타 시스템 (pip 사용) pip3 install s3cmd`

### 2. s3cmd 설정

`s3cmd --configure`

다음 설정 정보를 입력하세요:

|   |   |
|---|---|
|설정 항목|값|
|**Access Key**|[NCP 액세스 키]|
|**Secret Key**|[NCP 시크릿 키]|
|**Default Region**|`kr`|
|**S3 Endpoint**|`kr.object.gov-ncloudstorage.com`|
|**DNS-style bucket+hostname:port template**|`%(bucket)s.kr.object.gov-ncloudstorage.com`|
|**Encryption password**|Enter로 건너뛰기|
|**Path to GPG program**|Enter로 건너뛰기|
|**Use HTTPS protocol**|`Yes`|
|**HTTP Proxy server name**|Enter로 건너뛰기|

## CORS 설정

### 1. CORS 설정 파일 생성

`cors.xml` 파일을 생성하고 다음 내용을 입력하세요:

```xml

<CORSConfiguration>
    <CORSRule>
        <AllowedOrigin>{ORIGN_DO}</AllowedOrigin>

        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>HEAD</AllowedMethod>

        <AllowedHeader>*</AllowedHeader>
        <MaxAgeSeconds>600</MaxAgeSeconds>
    </CORSRule>
</CORSConfiguration>
```

### 2. CORS 설정 적용

`s3cmd setcors cors.xml s3://gensunny-obst-document`

## 주요 명령어

### AWS CLI 명령어

```
`
### s3cmd 명령어

`# 버킷 목록 조회 s3cmd ls # 버킷 내 객체 목록 조회 s3cmd ls s3://gensunny-obst-document # 파일 업로드 s3cmd put file.txt s3://gensunny-obst-document/ # 파일 다운로드 s3cmd get s3://gensunny-obst-document/file.txt # CORS 설정 조회 s3cmd getcors s3://gensunny-obst-document # CORS 설정 적용 s3cmd setcors cors.xml s3://gensunny-obst-document`

## 중요 사항

1. **엔드포인트 URL**: NCP 정부전용 클라우드에는 항상 `https://kr.object.gov-ncloudstorage.com`을 사용
    
2. **리전**: 기본 리전으로 `kr` 사용
    
3. **프로필**: 다른 AWS 설정과의 충돌을 피하기 위해 명명된 프로필(예: `ncp-gov`) 사용
    
4. **CORS**: 설정된 CORS는 특정 도메인에서 GET 및 HEAD 메소드만 허용