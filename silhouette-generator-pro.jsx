import React, { useState } from 'react';
import { Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function SilhouetteGeneratorPro() {
  const [formData, setFormData] = useState({
    age: '성인',
    gender: '남성',
    ethnicity: '동아시아',
    clothing: '정장'
  });
  
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const [includeBackground, setIncludeBackground] = useState(false);

  const ageOptions = ['어린이', '청소년', '청년', '성인', '중년', '노년'];
  const genderOptions = ['남성', '여성', '중성'];
  const ethnicityOptions = ['동아시아', '서양', '아프리카', '중동', '남아시아', '라틴'];
  
  const clothingPresets = [
    '정장',
    '캐주얼',
    '경찰관 제복',
    '판사 법복',
    '소방관 방화복',
    '의사 가운',
    '배낭을 멘 학생',
    '운동복',
    '작업복',
    '한복'
  ];

  const translateToEnglish = () => {
    const ageMap = {
      '어린이': 'child aged 6-12',
      '청소년': 'teenager aged 13-17',
      '청년': 'young adult aged 18-29',
      '성인': 'adult aged 30-45',
      '중년': 'middle-aged person aged 46-60',
      '노년': 'elderly person aged 60+'
    };
    
    const genderMap = {
      '남성': 'male',
      '여성': 'female',
      '중성': 'gender-neutral person'
    };
    
    const ethnicityMap = {
      '동아시아': 'East Asian',
      '서양': 'Caucasian',
      '아프리카': 'African',
      '중동': 'Middle Eastern',
      '남아시아': 'South Asian',
      '라틴': 'Latin American'
    };
    
    const clothingMap = {
      '정장': 'formal business suit',
      '캐주얼': 'casual clothing',
      '경찰관 제복': 'police officer uniform',
      '판사 법복': 'judge robe',
      '소방관 방화복': 'firefighter protective gear',
      '의사 가운': 'doctor white coat',
      '배낭을 멘 학생': 'student wearing backpack',
      '운동복': 'athletic sportswear',
      '작업복': 'work uniform',
      '한복': 'traditional Korean hanbok'
    };

    return {
      age: ageMap[formData.age] || formData.age,
      gender: genderMap[formData.gender] || formData.gender,
      ethnicity: ethnicityMap[formData.ethnicity] || formData.ethnicity,
      clothing: clothingMap[formData.clothing] || formData.clothing
    };
  };

  const generateWithReplicate = async (prompt) => {
    setProgress('Replicate API 호출 중...');
    
    // Replicate API 호출
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 1024,
        height: 1536
      })
    });
    
    if (!response.ok) {
      throw new Error('이미지 생성 실패');
    }
    
    const data = await response.json();
    return data.imageUrl;
  };

  const removeBackground = async (imageUrl) => {
    setProgress('배경 제거 중...');
    
    const response = await fetch('/api/remove-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl })
    });
    
    if (!response.ok) {
      throw new Error('배경 제거 실패');
    }
    
    const data = await response.json();
    return data.transparentImageUrl;
  };

  const generateImage = async (withBg) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setIncludeBackground(withBg);
    
    try {
      const translated = translateToEnglish();
      
      // 뒷모습 전용 프롬프트 구성
      let prompt = `Professional high-quality photograph, `;
      prompt += `REAR VIEW ONLY, back view, person facing away from camera, `;
      prompt += `back of head visible, no face visible, view from behind, `;
      prompt += `${translated.age} ${translated.ethnicity} ${translated.gender} person, `;
      prompt += `wearing ${translated.clothing}, `;
      prompt += `full body shot from behind, centered composition, `;
      
      if (withBg) {
        prompt += `elegant dark gradient background, studio lighting with subtle rim light, `;
        prompt += `professional photography, dramatic lighting, `;
      } else {
        prompt += `isolated on pure white background for easy background removal, `;
        prompt += `clean studio lighting, simple background, `;
      }
      
      prompt += `photorealistic, high resolution, professional quality, `;
      prompt += `detailed clothing texture, natural pose, standing upright`;
      
      // Negative prompt
      const negativePrompt = `face, frontal view, front view, looking at camera, facial features, eyes, nose, mouth, side view, profile, turned head, multiple people, distorted, blurry, low quality`;
      
      setProgress('이미지 생성 중...');
      
      // 실제 API 호출 (프로덕션 환경)
      // const imageUrl = await generateWithReplicate(prompt);
      
      // 데모 버전 - 캔버스로 시뮬레이션
      await simulateImageGeneration(withBg);
      
      // 투명 배경 버전 처리
      // if (!withBg) {
      //   setProgress('배경 제거 중...');
      //   const transparentUrl = await removeBackground(imageUrl);
      //   setGeneratedImage(transparentUrl);
      // } else {
      //   setGeneratedImage(imageUrl);
      // }
      
      setProgress('완료!');
      
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || '이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(''), 2000);
    }
  };

  // 데모용 시뮬레이션 함수
  const simulateImageGeneration = async (withBg) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1536;
        const ctx = canvas.getContext('2d');
        
        if (withBg) {
          // 그라데이션 배경
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, '#2d3748');
          gradient.addColorStop(0.5, '#1a202c');
          gradient.addColorStop(1, '#000000');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          // 체크무늬 배경 (투명도 표시용)
          const squareSize = 40;
          for (let y = 0; y < canvas.height; y += squareSize) {
            for (let x = 0; x < canvas.width; x += squareSize) {
              ctx.fillStyle = ((x / squareSize + y / squareSize) % 2) === 0 ? '#f0f0f0' : '#ffffff';
              ctx.fillRect(x, y, squareSize, squareSize);
            }
          }
        }
        
        // 실루엣 형태 그리기
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // 머리
        ctx.beginPath();
        ctx.fillStyle = withBg ? '#4a5568' : '#333333';
        ctx.ellipse(0, -550, 120, 140, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 목
        ctx.fillRect(-40, -420, 80, 80);
        
        // 몸통
        ctx.beginPath();
        ctx.moveTo(-180, -340);
        ctx.lineTo(-200, 100);
        ctx.lineTo(-150, 400);
        ctx.lineTo(150, 400);
        ctx.lineTo(200, 100);
        ctx.lineTo(180, -340);
        ctx.closePath();
        ctx.fill();
        
        // 팔
        ctx.fillRect(-300, -300, 110, 600);
        ctx.fillRect(190, -300, 110, 600);
        
        // 다리
        ctx.fillRect(-140, 400, 100, 300);
        ctx.fillRect(40, 400, 100, 300);
        
        ctx.restore();
        
        // 텍스트 오버레이
        ctx.fillStyle = withBg ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${formData.age} ${formData.gender}`, canvas.width / 2, 100);
        ctx.fillText(`${formData.ethnicity}`, canvas.width / 2, 150);
        ctx.fillText(`${formData.clothing}`, canvas.width / 2, 200);
        
        const imageUrl = canvas.toDataURL('image/png');
        setGeneratedImage(imageUrl);
        resolve();
      }, 2000);
    });
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    const filename = `silhouette-${formData.age}-${formData.gender}-${formData.ethnicity}-${Date.now()}.png`;
    link.download = filename;
    link.href = generatedImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
            <h1 className="text-5xl font-bold mb-3">실루엣 생성기</h1>
            <p className="text-xl text-white/90">AI 기반 뒷모습 인물 이미지 생성 도구</p>
            <div className="mt-4 flex gap-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">32-bit PNG</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">투명 배경 지원</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">고해상도</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 p-8">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  연령대
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ageOptions.map((age) => (
                    <button
                      key={age}
                      onClick={() => setFormData({ ...formData, age })}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        formData.age === age
                          ? 'bg-blue-600 text-white shadow-lg scale-105 ring-4 ring-blue-200'
                          : 'bg-white text-gray-700 hover:bg-blue-100 hover:scale-105'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  성별
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {genderOptions.map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setFormData({ ...formData, gender })}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        formData.gender === gender
                          ? 'bg-purple-600 text-white shadow-lg scale-105 ring-4 ring-purple-200'
                          : 'bg-white text-gray-700 hover:bg-purple-100 hover:scale-105'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-xl">
                <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  인종
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ethnicityOptions.map((ethnicity) => (
                    <button
                      key={ethnicity}
                      onClick={() => setFormData({ ...formData, ethnicity })}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        formData.ethnicity === ethnicity
                          ? 'bg-pink-600 text-white shadow-lg scale-105 ring-4 ring-pink-200'
                          : 'bg-white text-gray-700 hover:bg-pink-100 hover:scale-105'
                      }`}
                    >
                      {ethnicity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl">
                <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                  복장 / 직업
                </label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {clothingPresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setFormData({ ...formData, clothing: preset })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.clothing === preset
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-orange-100'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.clothing}
                  onChange={(e) => setFormData({ ...formData, clothing: e.target.value })}
                  placeholder="또는 직접 입력..."
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() => generateImage(false)}
                  disabled={isLoading}
                  className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-5 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105 flex flex-col items-center justify-center gap-2"
                >
                  {isLoading && !includeBackground ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span className="text-sm">생성 중...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">투명 배경</span>
                      <span className="text-xs opacity-80">PNG 32-bit</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => generateImage(true)}
                  disabled={isLoading}
                  className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-5 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105 flex flex-col items-center justify-center gap-2"
                >
                  {isLoading && includeBackground ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span className="text-sm">생성 중...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">배경 포함</span>
                      <span className="text-xs opacity-80">스튜디오 배경</span>
                    </>
                  )}
                </button>
              </div>

              {progress && (
                <div className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-3">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="font-medium">{progress}</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                  <AlertCircle size={20} />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 min-h-[700px] flex items-center justify-center relative overflow-hidden">
                {generatedImage ? (
                  <div className="relative w-full max-w-2xl">
                    <img
                      src={generatedImage}
                      alt="Generated silhouette"
                      className="w-full h-auto rounded-xl shadow-2xl"
                    />
                    {!includeBackground && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle size={16} />
                        투명 배경
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-xl">
                      <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold mb-2">옵션을 선택하고</p>
                    <p className="text-xl">버튼을 클릭하여 생성하세요</p>
                    <div className="mt-6 space-y-2 text-sm text-gray-500">
                      <p>✓ 뒷모습 전용 생성</p>
                      <p>✓ 고해상도 (1024x1536)</p>
                      <p>✓ 32-bit PNG 형식</p>
                    </div>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="space-y-3">
                  <button
                    onClick={downloadImage}
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-5 rounded-xl font-bold hover:from-gray-800 hover:to-black transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Download size={24} />
                    <span className="text-lg">이미지 다운로드</span>
                  </button>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">
                      <strong>생성된 이미지:</strong> {formData.age} {formData.gender} ({formData.ethnicity}), {formData.clothing}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      해상도: 1024x1536px | 포맷: PNG 32-bit | 배경: {includeBackground ? '포함' : '투명'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-3">프로덕션 배포 안내</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-2">✦ 현재 버전: 데모 (UI 테스트용)</p>
              <p className="text-white/70">실제 이미지 생성을 위해서는 AI API 통합이 필요합니다.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">✦ 추천 서비스</p>
              <p className="text-white/70">Replicate (Flux), Stability AI, Remove.bg</p>
            </div>
          </div>
          <p className="mt-4 text-white/60 text-xs">
            implementation-guide.md 파일에서 프로덕션 배포 가이드를 확인하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
