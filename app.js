// App State
let appState = {
    age: '성인',
    gender: '남성',
    ethnicity: '동아시아',
    clothing: '정장',
    generatedImage: null,
    includeBackground: false
};

// Translation maps
const translations = {
    age: {
        '어린이': 'child aged 6-12',
        '청소년': 'teenager aged 13-17',
        '청년': 'young adult aged 18-29',
        '성인': 'adult aged 30-45',
        '중년': 'middle-aged person aged 46-60',
        '노년': 'elderly person aged 60+'
    },
    gender: {
        '남성': 'male',
        '여성': 'female',
        '중성': 'gender-neutral person'
    },
    ethnicity: {
        '동아시아': 'East Asian',
        '서양': 'Caucasian',
        '아프리카': 'African',
        '중동': 'Middle Eastern',
        '남아시아': 'South Asian',
        '라틴': 'Latin American'
    },
    clothing: {
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
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeButtons();
    setupEventListeners();
    loadApiKey();
});

function initializeButtons() {
    // Age buttons
    document.querySelectorAll('#age-buttons .btn-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const age = btn.dataset.age;
            appState.age = age;
            updateButtonStates('#age-buttons', age, 'age');
        });
    });

    // Gender buttons
    document.querySelectorAll('#gender-buttons .btn-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const gender = btn.dataset.gender;
            appState.gender = gender;
            updateButtonStates('#gender-buttons', gender, 'gender');
        });
    });

    // Ethnicity buttons
    document.querySelectorAll('#ethnicity-buttons .btn-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const ethnicity = btn.dataset.ethnicity;
            appState.ethnicity = ethnicity;
            updateButtonStates('#ethnicity-buttons', ethnicity, 'ethnicity');
        });
    });

    // Clothing buttons
    document.querySelectorAll('#clothing-buttons .btn-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const clothing = btn.dataset.clothing;
            appState.clothing = clothing;
            document.getElementById('clothing-input').value = clothing;
            updateButtonStates('#clothing-buttons', clothing, 'clothing');
        });
    });

    // Clothing input
    document.getElementById('clothing-input').addEventListener('input', (e) => {
        appState.clothing = e.target.value;
        // Remove active state from preset buttons
        document.querySelectorAll('#clothing-buttons .btn-option').forEach(btn => {
            btn.classList.remove('btn-active');
            btn.classList.add('btn-inactive');
        });
    });
}

function updateButtonStates(containerSelector, value, type) {
    document.querySelectorAll(`${containerSelector} .btn-option`).forEach(btn => {
        const btnValue = btn.dataset[type];
        if (btnValue === value) {
            btn.classList.remove('btn-inactive');
            btn.classList.add('btn-active');
        } else {
            btn.classList.remove('btn-active');
            btn.classList.add('btn-inactive');
        }
    });
}

function setupEventListeners() {
    // Generate buttons
    document.getElementById('btn-transparent').addEventListener('click', () => generateImage(false));
    document.getElementById('btn-background').addEventListener('click', () => generateImage(true));
    
    // Download button
    document.getElementById('btn-download').addEventListener('click', downloadImage);
    
    // API key input - save to localStorage on change
    document.getElementById('api-key-input').addEventListener('input', (e) => {
        saveApiKey(e.target.value);
    });
}

function loadApiKey() {
    const savedKey = localStorage.getItem('replicate_api_key');
    if (savedKey) {
        document.getElementById('api-key-input').value = savedKey;
    }
}

function saveApiKey(apiKey) {
    if (apiKey && apiKey.trim()) {
        localStorage.setItem('replicate_api_key', apiKey.trim());
    }
}

async function generateImage(withBackground) {
    appState.includeBackground = withBackground;
    
    // Get API key
    const apiKey = document.getElementById('api-key-input').value.trim();
    if (!apiKey) {
        showError('Replicate API 키를 입력해주세요!');
        return;
    }
    
    if (!apiKey.startsWith('r8_')) {
        showError('올바른 Replicate API 키 형식이 아닙니다. (r8_로 시작해야 합니다)');
        return;
    }
    
    // Show progress
    showProgress('이미지 생성 중...');
    hideError();
    hidePreview();
    disableButtons();
    
    try {
        // Build prompt
        const prompt = buildPrompt(withBackground);
        
        // Call serverless API
        showProgress('AI가 이미지를 생성하고 있습니다...');
        
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                withBackground: withBackground,
                apiKey: apiKey
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '이미지 생성 실패');
        }
        
        const data = await response.json();
        
        // Handle background removal if needed
        if (!withBackground && data.imageUrl) {
            showProgress('배경 제거 중...');
            
            const bgResponse = await fetch('/api/remove-background', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl: data.imageUrl,
                    apiKey: apiKey
                })
            });
            
            if (bgResponse.ok) {
                const bgData = await bgResponse.json();
                appState.generatedImage = bgData.transparentImageUrl || data.imageUrl;
            } else {
                appState.generatedImage = data.imageUrl;
            }
        } else {
            appState.generatedImage = data.imageUrl;
        }
        
        // Show result
        showProgress('완료!');
        setTimeout(() => {
            hideProgress();
            showPreview();
            enableButtons();
        }, 1000);
        
    } catch (error) {
        console.error('Generation error:', error);
        showError(error.message || '이미지 생성 중 오류가 발생했습니다.');
        enableButtons();
    }
}

function buildPrompt(withBackground) {
    const age = translations.age[appState.age] || appState.age;
    const gender = translations.gender[appState.gender] || appState.gender;
    const ethnicity = translations.ethnicity[appState.ethnicity] || appState.ethnicity;
    const clothing = translations.clothing[appState.clothing] || appState.clothing;
    
    let prompt = 'Professional high-quality photograph, ';
    prompt += 'REAR VIEW ONLY, back view, person facing away from camera, ';
    prompt += 'back of head visible, no face visible, view from behind, ';
    prompt += `${age} ${ethnicity} ${gender} person, `;
    prompt += `wearing ${clothing}, `;
    prompt += 'full body shot from behind, centered composition, ';
    
    if (withBackground) {
        prompt += 'elegant dark gradient background, studio lighting with subtle rim light, ';
        prompt += 'professional photography, dramatic lighting, ';
    } else {
        prompt += 'isolated on pure white background for easy background removal, ';
        prompt += 'clean studio lighting, simple background, ';
    }
    
    prompt += 'photorealistic, high resolution, professional quality, ';
    prompt += 'detailed clothing texture, natural pose, standing upright';
    
    return prompt;
}

function showProgress(message) {
    const progressEl = document.getElementById('progress-message');
    const progressText = document.getElementById('progress-text');
    progressText.textContent = message;
    progressEl.classList.remove('hidden');
}

function hideProgress() {
    document.getElementById('progress-message').classList.add('hidden');
}

function showError(message) {
    const errorEl = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
}

function hideError() {
    document.getElementById('error-message').classList.add('hidden');
}

function showPreview() {
    const placeholder = document.getElementById('preview-placeholder');
    const preview = document.getElementById('preview-image');
    const image = document.getElementById('generated-image');
    const badge = document.getElementById('transparent-badge');
    const downloadSection = document.getElementById('download-section');
    const imageInfo = document.getElementById('image-info');
    const bgType = document.getElementById('bg-type');
    
    placeholder.classList.add('hidden');
    preview.classList.remove('hidden');
    downloadSection.classList.remove('hidden');
    
    image.src = appState.generatedImage;
    
    if (!appState.includeBackground) {
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
    
    imageInfo.textContent = `${appState.age} ${appState.gender} (${appState.ethnicity}), ${appState.clothing}`;
    bgType.textContent = appState.includeBackground ? '포함' : '투명';
}

function hidePreview() {
    const placeholder = document.getElementById('preview-placeholder');
    const preview = document.getElementById('preview-image');
    const downloadSection = document.getElementById('download-section');
    
    placeholder.classList.remove('hidden');
    preview.classList.add('hidden');
    downloadSection.classList.add('hidden');
}

function disableButtons() {
    document.getElementById('btn-transparent').disabled = true;
    document.getElementById('btn-background').disabled = true;
}

function enableButtons() {
    document.getElementById('btn-transparent').disabled = false;
    document.getElementById('btn-background').disabled = false;
}

async function downloadImage() {
    if (!appState.generatedImage) return;
    
    try {
        const response = await fetch(appState.generatedImage);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        const filename = `silhouette-${appState.age}-${appState.gender}-${appState.ethnicity}-${Date.now()}.png`;
        link.download = filename;
        link.href = url;
        link.click();
        
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Download error:', err);
        showError('다운로드 중 오류가 발생했습니다.');
    }
}
