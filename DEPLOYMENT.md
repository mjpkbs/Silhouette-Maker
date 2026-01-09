# 🚀 GitHub + Vercel 배포 가이드

이 가이드는 실루엣 생성기를 GitHub에 푸시하고 Vercel로 배포하는 전체 과정을 설명합니다.

## 📋 준비 사항

### 1. 필수 계정
- [x] GitHub 계정
- [x] Vercel 계정 (https://vercel.com - GitHub로 가입 추천)
- [x] Replicate 계정 (https://replicate.com)

### 2. 필수 설치
- [x] Git (https://git-scm.com/downloads)
- [x] Node.js 18+ (https://nodejs.org)

## 🔑 Step 1: Replicate API 키 발급

1. https://replicate.com 접속 및 가입
2. 우측 상단 프로필 → **Account Settings**
3. 좌측 메뉴에서 **API tokens** 클릭
4. **Create token** 버튼 클릭
5. API 키 복사 (예: `r8_xxxxxxxxxxxx`)

⚠️ **중요**: 이 키는 다시 볼 수 없으니 안전한 곳에 저장하세요!

## 📁 Step 2: 로컬에서 프로젝트 설정

### 2.1 프로젝트 디렉토리로 이동
```bash
cd silhouette-app
```

### 2.2 의존성 설치
```bash
npm install
```

### 2.3 환경 변수 설정
```bash
# .env.local.example을 복사하여 .env.local 생성
cp .env.local.example .env.local

# .env.local 파일을 열어서 실제 API 키 입력
# REPLICATE_API_KEY=r8_your_actual_key_here
```

### 2.4 로컬 테스트
```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속하여 정상 작동 확인

## 🐙 Step 3: GitHub 저장소 생성 및 푸시

### 3.1 GitHub에서 새 저장소 생성
1. https://github.com/new 접속
2. Repository name: `silhouette-generator` (원하는 이름)
3. **Private** 또는 **Public** 선택
4. ⚠️ **Initialize this repository with:** 모두 체크 해제
5. **Create repository** 클릭

### 3.2 로컬에서 Git 초기화 및 푸시
```bash
# Git 초기화 (프로젝트 루트에서)
git init

# 모든 파일 스테이징
git add .

# 첫 커밋
git commit -m "Initial commit: Silhouette Generator"

# GitHub 저장소 연결
git remote add origin https://github.com/YOUR_USERNAME/silhouette-generator.git

# 브랜치 이름 변경 (필요시)
git branch -M main

# GitHub에 푸시
git push -u origin main
```

⚠️ **YOUR_USERNAME**을 실제 GitHub 사용자명으로 변경하세요!

### 3.3 푸시 확인
GitHub 저장소 페이지에서 파일들이 업로드되었는지 확인

## ☁️ Step 4: Vercel 배포

### 4.1 Vercel 로그인
1. https://vercel.com 접속
2. **Sign up** 또는 **Log in**
3. **Continue with GitHub** 클릭 (권장)

### 4.2 새 프로젝트 Import
1. Vercel 대시보드에서 **Add New...** → **Project** 클릭
2. **Import Git Repository** 섹션에서 GitHub 저장소 찾기
3. `silhouette-generator` 저장소 찾아서 **Import** 클릭

### 4.3 프로젝트 설정
**Configure Project** 화면에서:

#### Framework Preset
- 자동으로 **Next.js** 감지됨 (변경 불필요)

#### Root Directory
- `.` (기본값, 변경 불필요)

#### Build and Output Settings
- 기본값 유지

#### Environment Variables (중요!)
**Environment Variables** 섹션 확장 후:

1. **Name**: `REPLICATE_API_KEY`
2. **Value**: (Step 1에서 복사한 Replicate API 키 입력)
3. **Add** 버튼 클릭

```
Name:  REPLICATE_API_KEY
Value: r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.4 배포 시작
1. 모든 설정 확인 후 **Deploy** 버튼 클릭
2. 배포 진행 상황 확인 (약 1-2분 소요)

### 4.5 배포 완료
1. 🎉 **Congratulations!** 메시지 확인
2. **Visit** 버튼 클릭하여 사이트 접속
3. Vercel이 제공하는 URL 확인 (예: `https://silhouette-generator-xxxxx.vercel.app`)

## ✅ Step 5: 배포 확인 및 테스트

### 5.1 사이트 접속
Vercel이 제공한 URL로 접속

### 5.2 기능 테스트
1. 옵션 선택 (연령대, 성별, 인종, 복장)
2. "투명 배경" 또는 "배경 포함" 버튼 클릭
3. 이미지 생성 대기 (약 5-10초)
4. 생성된 이미지 확인
5. 다운로드 버튼 클릭하여 PNG 파일 저장

### 5.3 오류 발생 시
Vercel 대시보드에서 로그 확인:
1. 프로젝트 선택 → **Deployments** 탭
2. 최신 배포 클릭 → **Functions** 탭
3. `/api/generate-image` 함수 로그 확인

## 🔄 Step 6: 업데이트 배포

코드를 수정한 후 다시 배포하려면:

```bash
# 변경사항 커밋
git add .
git commit -m "Update: 설명"

# GitHub에 푸시
git push origin main
```

Vercel이 자동으로 새 배포를 시작합니다! (약 1분 소요)

## 🎯 커스텀 도메인 설정 (선택)

### 6.1 도메인 추가
1. Vercel 프로젝트 → **Settings** → **Domains**
2. 원하는 도메인 입력 (예: `silhouette.yourdomain.com`)
3. DNS 레코드 추가 안내에 따라 설정

### 6.2 도메인 제공업체 설정
도메인 제공업체 (예: Namecheap, GoDaddy)에서:
- **Type**: `CNAME`
- **Host**: `silhouette` (서브도메인 부분)
- **Value**: `cname.vercel-dns.com`
- **TTL**: `Automatic` 또는 `3600`

## 🔧 환경 변수 수정

### 배포 후 API 키 변경이 필요한 경우:
1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. `REPLICATE_API_KEY` 찾아서 **Edit** 클릭
3. 새 값 입력 후 **Save**
4. **Deployments** 탭에서 **Redeploy** 클릭

## 💰 비용 관리

### Vercel 무료 플랜 제한
- ✅ 100GB 대역폭/월
- ✅ 무제한 배포
- ✅ 자동 HTTPS
- ⚠️ 함수 실행 시간: 10초 (Pro: 60초)

### Replicate 비용
- 이미지 생성 (Flux Schnell): ~$0.003/장
- 배경 제거 (RMBG): ~$0.001/장
- **총 1장당**: ~$0.004

예상 비용:
- 100장 생성: ~$0.40
- 1,000장 생성: ~$4.00

### 비용 절감 팁
1. 생성된 이미지 캐싱
2. 사용자 일일 제한 설정
3. 프로덕션 환경에서만 API 호출

## 🐛 문제 해결

### 문제 1: 배포는 성공했지만 이미지 생성 안됨
**해결**: 
1. Vercel → Settings → Environment Variables
2. `REPLICATE_API_KEY` 확인
3. 값이 올바른지 확인 후 Redeploy

### 문제 2: "API 키가 설정되지 않았습니다" 오류
**해결**:
```bash
# 로컬: .env.local 파일 확인
cat .env.local

# Vercel: 환경 변수 다시 설정
```

### 문제 3: 이미지 생성 타임아웃
**해결**: 
- Vercel Pro 플랜 고려 (함수 실행 시간 60초)
- 또는 코드에서 maxAttempts 값 조정

### 문제 4: Git push 실패
**해결**:
```bash
# Git 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 다시 시도
git push origin main
```

### 문제 5: npm install 오류
**해결**:
```bash
# 캐시 정리
rm -rf node_modules package-lock.json
npm cache clean --force

# 재설치
npm install
```

## 📊 모니터링

### Vercel Analytics 활성화
1. 프로젝트 → **Analytics** 탭
2. **Enable Analytics** 클릭
3. 방문자, 성능, 지역 데이터 확인

### 로그 확인
1. 프로젝트 → **Deployments**
2. 최신 배포 클릭 → **Functions**
3. API 호출 로그 실시간 확인

## 🎓 추가 학습 자료

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 문서](https://nextjs.org/docs)
- [Replicate 문서](https://replicate.com/docs)
- [Git 기초](https://git-scm.com/book/ko/v2)

## 🆘 지원

문제가 계속되면:
1. GitHub Issues 생성
2. Vercel 커뮤니티 포럼
3. Replicate Discord

---

## ✨ 축하합니다!

이제 여러분의 실루엣 생성기가 전 세계에 배포되었습니다! 🎉

URL: `https://your-project-name.vercel.app`

친구들과 공유하고 피드백을 받아보세요!
