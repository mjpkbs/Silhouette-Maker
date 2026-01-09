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
    
    let prompt = 'Professional studio portrait photograph, full color photography, vibrant colors, ';
    
    // CRITICAL: Upper body only - waist up
    prompt += 'UPPER BODY SHOT ONLY, torso shot, waist up, from behind, ';
    prompt += 'cropped at waist level, showing only upper body and head, ';
    prompt += 'NO full body, NO legs visible, NO feet visible, ';
    
    // CRITICAL: Enforce exact back view
    prompt += 'BACK VIEW ONLY, rear view, shot from directly behind the subject, ';
    prompt += 'camera positioned exactly at the back of the person, ';
    prompt += 'back of head perfectly centered in frame, ';
    prompt += 'person standing with their back to the camera, facing away, ';
    prompt += 'ZERO degrees rotation, completely straight back view, ';
    
    // Subject details - use Korean terms directly with emphasis
    prompt += `${age} years old, ${gender} person, `;
    prompt += `specifically ${ethnicity} ethnicity, `;
    
    // If Korean, add specific Korean features
    if (ethnicity.includes('한국') || ethnicity.toLowerCase().includes('korean')) {
        prompt += 'Korean person with typical Korean features, Korean hairstyle, Korean skin tone, ';
    }
    
    prompt += `wearing ${clothing}, `;
    prompt += 'standing upright with perfect posture, ';
    prompt += 'shoulders level, arms relaxed at sides, ';
    
    // Lighting and background
    if (withBackground) {
        prompt += 'dramatic studio lighting on pure black background, ';
        prompt += 'soft warm rim light highlighting shoulders and neck edges, ';
        prompt += 'golden backlight creating subtle glow on hair and upper body, ';
        prompt += 'deep black void background, cinematic low key lighting, ';
        prompt += 'professional commercial photography, ';
    } else {
        prompt += 'clean studio lighting on pure white background, ';
        prompt += 'soft even illumination, no harsh shadows, ';
        prompt += 'perfectly white backdrop for easy background removal, ';
    }
    
    // Quality and style parameters
    prompt += 'photorealistic, highly detailed, sharp focus, ';
    prompt += 'full color image, realistic skin tones, natural hair color, ';
    prompt += 'realistic clothing colors and textures, ';
    prompt += '8K quality, professional photography, ';
    prompt += 'detailed clothing texture, natural fabric wrinkles, ';
    prompt += 'realistic hair detail, symmetrical composition, ';
    prompt += 'simple composition, clean image, no graphics, no effects, no patterns, ';
    prompt += 'no abstract elements, no decorative elements, plain background only, ';
    
    // NEGATIVE: What to avoid
    prompt += 'NOT grayscale, NOT black and white, NOT monochrome, ';
    prompt += 'NOT full body, NOT legs, NOT feet, NOT lower body, ';
    prompt += 'NOT side view, NOT profile, NOT three-quarter angle, ';
    prompt += 'NOT face visible, NOT front view, NOT diagonal, ';
    prompt += 'NOT rainbow, NOT colorful graphics, NOT abstract art, NOT patterns, NOT decorations';
    
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
