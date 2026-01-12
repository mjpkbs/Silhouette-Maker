// App State
let appState = {
    age: '30대',
    gender: '남성',
    ethnicity: '한국인',
    clothing: '회색 정장',
    imageWithBg: null,
    imageWithoutBg: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadApiKey();
});

function setupEventListeners() {
    // Generate button
    document.getElementById('btn-generate').addEventListener('click', generateImage);
    
    // Download buttons
    document.getElementById('btn-download-with-bg').addEventListener('click', () => downloadImage(true));
    document.getElementById('btn-download-no-bg').addEventListener('click', () => downloadImage(false));
    
    // Input fields - update state on change
    document.getElementById('age-input').addEventListener('input', (e) => {
        appState.age = e.target.value;
    });
    
    document.getElementById('gender-input').addEventListener('input', (e) => {
        appState.gender = e.target.value;
    });
    
    document.getElementById('ethnicity-input').addEventListener('input', (e) => {
        appState.ethnicity = e.target.value;
    });
    
    document.getElementById('clothing-input').addEventListener('input', (e) => {
        appState.clothing = e.target.value;
    });
    
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

async function generateImage() {
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
        // Build prompt for image with background
        const prompt = buildPrompt(true);
        
        // Step 1: Generate image with background
        showProgress('AI가 이미지를 생성하고 있습니다... (1/2)');
        
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                withBackground: true,
                apiKey: apiKey
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '이미지 생성 실패');
        }
        
        const data = await response.json();
        appState.imageWithBg = data.imageUrl;
        
        // Step 2: Remove background
        showProgress('배경 제거 중... (2/2)');
        
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
            appState.imageWithoutBg = bgData.transparentImageUrl || data.imageUrl;
        } else {
            // Fallback to original if background removal fails
            appState.imageWithoutBg = data.imageUrl;
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
    // Get values directly from inputs
    const age = appState.age || '30대';
    const gender = appState.gender || '남성';
    const ethnicity = appState.ethnicity || '한국인';
    const clothing = appState.clothing || '회색 정장';
    
    // Extract age number if possible
    let ageNumber = age.replace(/[^0-9]/g, '');
    if (!ageNumber) ageNumber = '30';
    
    // For img2img, we focus on what to CHANGE, not describe everything
    // The reference image already has the style, lighting, composition
    
    let prompt = 'Professional studio portrait photograph from behind, ';
    
    // Subject - what we want to change
    prompt += `${ageNumber} year old ${gender} person, ${ethnicity} ethnicity, `;
    prompt += `wearing ${clothing}, `;
    
    // Keep the reference style
    prompt += 'same exact camera angle and composition as reference, ';
    prompt += 'same dramatic lighting with golden rim light, ';
    
    // Background based on choice
    if (withBackground) {
        prompt += 'keep the black background, ';
    } else {
        prompt += 'pure white background instead of black, ';
    }
    
    // Framing
    prompt += 'upper body shot, cropped at waist, ';
    
    // Quality
    prompt += 'photorealistic, high quality, professional photography, ';
    prompt += 'cinematic lighting, editorial style, ';
    
    // What NOT to change/add
    prompt += 'no patterns, no graphics, no decorations, no text, ';
    prompt += 'clean and simple, professional, ';
    prompt += 'NOT side view, NOT face visible, exact back view only.';
    
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
    
    placeholder.classList.add('hidden');
    preview.classList.remove('hidden');
    downloadSection.classList.remove('hidden');
    
    // Show image with background by default
    image.src = appState.imageWithBg;
    badge.classList.add('hidden'); // Hide badge since we're showing with background
    
    imageInfo.textContent = `${appState.age} ${appState.gender} (${appState.ethnicity}), ${appState.clothing}`;
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
    document.getElementById('btn-generate').disabled = true;
}

function enableButtons() {
    document.getElementById('btn-generate').disabled = false;
}

async function downloadImage(withBg) {
    const imageUrl = withBg ? appState.imageWithBg : appState.imageWithoutBg;
    
    if (!imageUrl) return;
    
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        const bgType = withBg ? 'with-bg' : 'transparent';
        const safeAge = appState.age.replace(/[^a-zA-Z0-9가-힣]/g, '');
        const safeGender = appState.gender.replace(/[^a-zA-Z0-9가-힣]/g, '');
        const safeEthnicity = appState.ethnicity.replace(/[^a-zA-Z0-9가-힣]/g, '');
        const filename = `silhouette-${safeAge}-${safeGender}-${safeEthnicity}-${bgType}-${Date.now()}.png`;
        link.download = filename;
        link.href = url;
        link.click();
        
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Download error:', err);
        showError('다운로드 중 오류가 발생했습니다.');
    }
}
