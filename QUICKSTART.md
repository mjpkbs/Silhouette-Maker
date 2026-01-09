# ⚡ 5분 만에 배포하기

## 🎯 목표
GitHub + Vercel로 실루엣 생성기를 배포합니다.

## 📝 체크리스트

### ✅ 준비 단계 (5분)
- [ ] Replicate 계정 생성 → API 키 발급
- [ ] GitHub 계정 확인
- [ ] Vercel 계정 생성 (GitHub로 가입)

### ✅ 배포 단계 (5분)
- [ ] GitHub에 새 저장소 생성
- [ ] 로컬 코드를 GitHub에 푸시
- [ ] Vercel에서 Import
- [ ] 환경 변수 설정
- [ ] 배포 완료!

---

## 🔥 단계별 명령어

### 1. Replicate API 키 발급
```
1. https://replicate.com 접속
2. 회원가입/로그인
3. Account Settings → API tokens
4. Create token 클릭
5. API 키 복사 (r8_xxxx...)
```

### 2. GitHub 저장소 생성
```
1. https://github.com/new 접속
2. 저장소 이름: silhouette-generator
3. Private 또는 Public 선택
4. Create repository 클릭
```

### 3. 코드 푸시
```bash
# 프로젝트 디렉토리에서
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/silhouette-generator.git
git push -u origin main
```

### 4. Vercel 배포
```
1. https://vercel.com 접속
2. Continue with GitHub
3. Add New... → Project
4. Import your GitHub repository
5. Environment Variables 추가:
   - Name: REPLICATE_API_KEY
   - Value: (복사한 API 키)
6. Deploy 클릭
```

### 5. 완료! 🎉
```
배포 완료 후 제공되는 URL로 접속
예: https://silhouette-generator-xxxxx.vercel.app
```

---

## 💡 중요 팁

### ⚠️ 반드시 해야 할 것
1. **API 키는 절대 GitHub에 푸시하지 마세요**
   - `.env.local` 파일은 자동으로 무시됩니다
   - Vercel 환경 변수에만 설정하세요

2. **환경 변수 이름을 정확히 입력하세요**
   - `REPLICATE_API_KEY` (대소문자 구분)

3. **로컬 테스트 먼저**
   - 배포 전에 `npm run dev`로 테스트

### 🚀 배포 후 확인사항
- [ ] 사이트가 정상적으로 로드되는지
- [ ] 이미지 생성이 작동하는지
- [ ] 다운로드가 되는지

---

## 🆘 문제 발생 시

### 문제: "API 키가 설정되지 않았습니다"
**해결책**:
1. Vercel → 프로젝트 → Settings → Environment Variables
2. `REPLICATE_API_KEY` 확인
3. Redeploy

### 문제: Git push 실패
**해결책**:
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### 문제: npm install 오류
**해결책**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 더 자세한 내용

- 전체 가이드: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 프로젝트 설명: [README.md](./README.md)

---

## ✅ 성공!

모든 단계를 완료하셨다면 축하드립니다! 🎉

이제 여러분의 실루엣 생성기가 전 세계에 배포되었습니다.

**다음 단계**:
- 친구들과 링크 공유
- 피드백 받기
- 커스터마이징하기
- 도메인 연결하기

---

**예상 소요 시간**: 10-15분
**난이도**: 초급 ⭐⭐☆☆☆
**비용**: Vercel 무료, Replicate ~$0.004/이미지
