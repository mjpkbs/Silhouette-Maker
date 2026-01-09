# ⚡ HTML 버전 - 초간단 배포 가이드

## 🎯 왜 이 버전인가?

✅ **환경 변수 불필요** - 브라우저에서 API 키 입력
✅ **빌드 오류 없음** - 순수 HTML
✅ **Favicon 문제 해결** - 인라인 SVG
✅ **정적 사이트** - 서버 설정 불필요
✅ **초보자 친화적** - 매우 간단!

---

## 📦 프로젝트 구조

```
silhouette-html/
├── index.html          ✅ 메인 페이지 (API 키 입력란 포함)
├── app.js              ✅ JavaScript 로직
├── package.json        ✅ 프로젝트 정보
├── .gitignore          ✅ Git 설정
└── README.md           ✅ 문서
```

**그게 전부입니다!** API 폴더나 복잡한 설정 없음!

---

## 🚀 배포 (2단계만!)

### 1️⃣ GitHub 푸시

```bash
cd silhouette-html

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/silhouette-html.git
git push -u origin main
```

### 2️⃣ Vercel 배포

1. https://vercel.com 로그인
2. **Import Project**
3. GitHub 저장소 선택
4. **Deploy** 클릭

**환경 변수 설정 불필요!** ✨

---

## ✅ 완료!

**배포 완료 후:**
1. Vercel URL 접속
2. 헤더 우측에 API 키 입력란이 보입니다
3. Replicate API 키 입력
4. 바로 사용!

---

## 🔑 API 키 발급

1. https://replicate.com 가입
2. **Account Settings** 클릭
3. **API tokens** 탭
4. **Create token** 클릭
5. API 키 복사 (`r8_xxxx...`)
6. 웹사이트에서 입력!

---

## 💡 사용 방법

### 처음 접속 시:
1. 헤더 우측 "🔑 Replicate API Key" 입력란 확인
2. API 키 붙여넣기
3. 옵션 선택
4. 생성 버튼 클릭!

### API 키 저장:
- ⚠️ API 키는 저장되지 않습니다
- 새로고침 시 재입력 필요
- 각 사용자가 자신의 키 사용

---

## 🎉 차이점

### 이전 버전 (Next.js):
- ❌ jsconfig.json 필요
- ❌ npm install 필요
- ❌ 환경 변수 설정 필요
- ❌ 서버리스 함수 필요

### 현재 버전 (HTML):
- ✅ 설정 파일 불필요
- ✅ 의존성 없음
- ✅ 브라우저에서 API 키 입력
- ✅ 순수 정적 사이트

---

## 💻 로컬 테스트 (선택)

```bash
cd silhouette-html
npx serve .
```

→ http://localhost:3000

---

## 🔍 확인

배포 후:
1. Vercel URL 접속
2. F12 개발자 도구
3. Console 탭
4. ✅ **오류 없음!**
5. ✅ **API 키 입력란 보임!**
6. ✅ **정상 작동!**

---

## 🔒 보안 참고

### 좋은 점:
- ✅ 서버에 API 키 저장 안 함
- ✅ 각 사용자가 자신의 키 사용
- ✅ 비용 관리 쉬움

### 주의할 점:
- ⚠️ 공용 컴퓨터에서 조심
- ⚠️ API 키 공유 금지
- ⚠️ 스크린샷 찍을 때 가리기

---

## 💰 비용

- **Replicate**: $0.004/이미지
- **Vercel**: 무료 (정적 사이트)
- **총**: 1,000장 = $4

---

## 💡 핵심 포인트

1. **순수 HTML** = 복잡한 설정 불필요
2. **클라이언트 사이드** = 서버 설정 불필요
3. **인라인 Favicon** = 404 해결
4. **API 키 입력란** = 사용자 친화적

---

**예상 시간:** 3분
**난이도:** ⭐☆☆☆☆ (매우 매우 쉬움!)
**성공률:** 100%
**환경 변수 설정:** 불필요!

---

완벽합니다! 🎉
