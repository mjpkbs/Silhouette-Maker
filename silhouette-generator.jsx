import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export default function SilhouetteGenerator() {
  const [formData, setFormData] = useState({
    age: '성인',
    gender: '남성',
    ethnicity: '동아시아',
    clothing: ''
  });
  
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [includeBackground, setIncludeBackground] = useState(false);

  const ageOptions = ['어린이', '청소년', '청년', '성인', '중년', '노년'];
  const genderOptions = ['남성', '여성', '중성'];
  const ethnicityOptions = ['동아시아', '서양', '아프리카', '중동', '남아시아', '라틴'];

  const generateImage = async (withBg) => {
    setIsLoading(true);
    setError(null);
    setIncludeBackground(withBg);
    
    try {
      // Construct detailed prompt
      const ageMap = {
        '어린이': 'child',
        '청소년': 'teenager',
        '청년': 'young adult',
        '성인': 'adult',
        '중년': 'middle-aged',
        '노년': 'elderly'
      };
      
      const genderMap = {
        '남성': 'male',
        '여성': 'female',
        '중성': 'gender-neutral'
      };
      
      const ethnicityMap = {
        '동아시아': 'East Asian',
        '서양': 'Caucasian',
        '아프리카': 'African',
        '중동': 'Middle Eastern',
        '남아시아': 'South Asian',
        '라틴': 'Latin American'
      };

      const age = ageMap[formData.age] || 'adult';
      const gender = genderMap[formData.gender] || 'person';
      const ethnicity = ethnicityMap[formData.ethnicity] || 'person';
      const clothing = formData.clothing || 'casual clothing';

      let prompt = `Professional high-quality photograph of a ${age} ${ethnicity} ${gender} person viewed from behind, back view only, no face visible, rear view. `;
      prompt += `The person is wearing ${clothing}. `;
      prompt += `Clean, professional studio photography. `;
      prompt += `Full body shot from behind. `;
      prompt += `Professional lighting. `;
      
      if (withBg) {
        prompt += `Dark gradient background, studio setting. `;
      } else {
        prompt += `Transparent background, isolated subject, PNG format with alpha channel. `;
      }
      
      prompt += `High resolution, professional quality, photorealistic.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Generate a high-quality image based on this description: ${prompt}

Please create a professional photograph matching these exact specifications.`
            }
          ],
          tools: [
            {
              type: "custom",
              name: "image_generation",
              description: "Generate an image"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // For demo purposes, we'll create a placeholder
      // In production, you'd integrate with an actual image generation API
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1536;
      const ctx = canvas.getContext('2d');
      
      if (withBg) {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw placeholder text
      ctx.fillStyle = withBg ? '#ffffff' : '#333333';
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('실루엣 이미지', canvas.width / 2, canvas.height / 2 - 100);
      
      ctx.font = '32px sans-serif';
      ctx.fillText(`${formData.age} ${formData.gender}`, canvas.width / 2, canvas.height / 2);
      ctx.fillText(`${formData.ethnicity}`, canvas.width / 2, canvas.height / 2 + 50);
      ctx.fillText(`${clothing}`, canvas.width / 2, canvas.height / 2 + 100);
      ctx.fillText(withBg ? '배경 포함' : '투명 배경', canvas.width / 2, canvas.height / 2 + 150);
      
      const imageUrl = canvas.toDataURL('image/png');
      setGeneratedImage(imageUrl);
      
    } catch (err) {
      console.error('Generation error:', err);
      setError('이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = `silhouette-${formData.age}-${formData.gender}-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">실루엣 생성기</h1>
            <p className="text-blue-100">뒷모습 인물 이미지 생성 도구</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left Panel - Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  연령대
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ageOptions.map((age) => (
                    <button
                      key={age}
                      onClick={() => setFormData({ ...formData, age })}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        formData.age === age
                          ? 'bg-blue-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  성별
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {genderOptions.map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setFormData({ ...formData, gender })}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        formData.gender === gender
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  인종
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ethnicityOptions.map((ethnicity) => (
                    <button
                      key={ethnicity}
                      onClick={() => setFormData({ ...formData, ethnicity })}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        formData.ethnicity === ethnicity
                          ? 'bg-indigo-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {ethnicity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  복장 / 직업
                </label>
                <textarea
                  value={formData.clothing}
                  onChange={(e) => setFormData({ ...formData, clothing: e.target.value })}
                  placeholder="예: 경찰관, 판사, 소방관, 배낭을 멘 어린이, 정장, 캐주얼 등"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  rows="4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() => generateImage(false)}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isLoading && !includeBackground ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      생성 중...
                    </>
                  ) : (
                    '투명 배경'
                  )}
                </button>

                <button
                  onClick={() => generateImage(true)}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isLoading && includeBackground ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      생성 중...
                    </>
                  ) : (
                    '배경 포함'
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Right Panel - Preview */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 min-h-[600px] flex items-center justify-center">
                {generatedImage ? (
                  <div className="relative w-full">
                    <img
                      src={generatedImage}
                      alt="Generated silhouette"
                      className="w-full h-auto rounded-lg shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">옵션을 선택하고</p>
                    <p className="text-lg font-medium">버튼을 클릭하여 생성하세요</p>
                  </div>
                )}
              </div>

              {generatedImage && (
                <button
                  onClick={downloadImage}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-4 rounded-lg font-semibold hover:from-gray-800 hover:to-black transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  이미지 다운로드
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>※ 현재는 데모 버전입니다. 실제 AI 이미지 생성 API 연동 시 고품질 이미지가 생성됩니다.</p>
        </div>
      </div>
    </div>
  );
}
