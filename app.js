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
    
    // Input fields
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
    
    // API key input
    document.getElementById('api-key-input').addEventListener('input', (e) => {
        saveApiKey(e.target.value);
    });
}

function buildPrompt(withBackground) {
    const age = appState.age || '30대';
    const gender = appState.gender || '남성';
    const ethnicity = appState.ethnicity || '한국인';
    const clothing = appState.clothing || '회색 정장';
    
    let ageNumber = age.replace(/[^0-9]/g, '');
    if (!ageNumber) ageNumber = '30';
    
    // Simplified prompt for img2img
    let prompt = 'Professional studio portrait photograph from behind, ';
    prompt += `${ageNumber} year old ${gender} person, ${ethnicity} ethnicity, `;
    prompt += `wearing ${clothing}, `;
    prompt += 'same exact camera angle and composition as reference, ';
    prompt += 'same dramatic lighting with golden rim light, ';
    
    if (withBackground) {
        prompt += 'keep the black background, ';
    } else {
        prompt += 'pure white background instead of black, ';
    }
    
    prompt += 'upper body shot, cropped at waist, ';
    prompt += 'photorealistic, high quality, professional photography, ';
    prompt += 'cinematic lighting, editorial style, ';
    prompt += 'no patterns, no graphics, no decorations, no text, ';
    prompt += 'clean and simple, professional, ';
    prompt += 'NOT side view, NOT face visible, exact back view only.';
    
    return prompt;
}

async function generateImage() {
    const apiKey = document.getElementById('api-key-input').value.trim();
    
    if (!apiKey || !apiKey.startsWith('r8_')) {
        showError('올바른 Replicate API 키를 입력하세요! (r8_로 시작)');
        return;
    }
    
    try {
        disableButtons();
        updateStatus('AI가 이미지를 생성하고 있습니다... (1/2)', true);
        
        // Generate image with background
        const prompt = buildPrompt(true);
        const imageWithBg = await callGenerateAPI(apiKey, prompt);
        appState.imageWithBg = imageWithBg;
        
        updateStatus('배경 제거 중... (2/2)', true);
        
        // Remove background
        const imageWithoutBg = await callRemoveBackgroundAPI(apiKey, imageWithBg);
        appState.imageWithoutBg = imageWithoutBg;
        
        updateStatus('완료!', false);
        showPreview();
        enableButtons();
        
    } catch (err) {
        console.error('Generation error:', err);
        showError('이미지 생성 중 오류가 발생했습니다: ' + err.message);
        enableButtons();
    }
}

async function callGenerateAPI(apiKey, prompt) {
    const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, prompt })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Image generation failed');
    }
    
    const data = await response.json();
    return data.imageUrl;
}

async function callRemoveBackgroundAPI(apiKey, imageUrl) {
    const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, imageUrl })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Background removal failed');
    }
    
    const data = await response.json();
    return data.imageUrl;
}

function showPreview() {
    document.getElementById('preview-placeholder').classList.add('hidden');
    document.getElementById('preview-image').classList.remove('hidden');
    document.getElementById('generated-image').src = appState.imageWithBg;
    document.getElementById('transparent-badge').classList.add('hidden');
    document.getElementById('image-info').textContent = `${appState.age} ${appState.gender} (${appState.ethnicity}), ${appState.clothing}`;
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

function disableButtons() {
    document.getElementById('btn-generate').disabled = true;
    document.getElementById('loading-spinner').classList.remove('hidden');
}

function enableButtons() {
    document.getElementById('btn-generate').disabled = false;
    document.getElementById('loading-spinner').classList.add('hidden');
}

function updateStatus(message, isLoading) {
    const statusText = document.getElementById('status-text');
    statusText.textContent = message;
    statusText.style.color = isLoading ? '#93c5fd' : '#86efac';
}

function showError(message) {
    const statusText = document.getElementById('status-text');
    statusText.textContent = '❌ ' + message;
    statusText.style.color = '#fca5a5';
    document.getElementById('loading-spinner').classList.add('hidden');
}

function saveApiKey(apiKey) {
    try {
        localStorage.setItem('replicate_api_key', apiKey);
    } catch (err) {
        console.error('Failed to save API key:', err);
    }
}

function loadApiKey() {
    try {
        const apiKey = localStorage.getItem('replicate_api_key');
        if (apiKey) {
            document.getElementById('api-key-input').value = apiKey;
        }
    } catch (err) {
        console.error('Failed to load API key:', err);
    }
}
