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
    
    // STRONG prompt for img2img - emphasize CHANGES
    let prompt = '';
    
    // 1. KEEP: Style and composition from reference
    prompt += 'KEEP: same camera angle, same back view composition, same studio lighting setup with golden rim light, same dramatic lighting style. ';
    
    // 2. CHANGE: Person attributes (STRONG emphasis)
    prompt += 'CHANGE THE PERSON: ';
    prompt += `Transform into a completely different person - ${ageNumber} year old ${gender}, ${ethnicity} ethnicity. `;
    
    // Age-specific details
    if (parseInt(ageNumber) < 20) {
        prompt += 'Young person, youthful appearance, smooth skin, young hairstyle. ';
    } else if (parseInt(ageNumber) < 40) {
        prompt += 'Adult person, mature appearance, professional look. ';
    } else if (parseInt(ageNumber) < 60) {
        prompt += 'Middle-aged person, some grey hair possible, mature features. ';
    } else {
        prompt += 'Elderly person, grey or white hair, aged features, wrinkles. ';
    }
    
    // Gender-specific details
    if (gender.includes('여성') || gender.toLowerCase().includes('female')) {
        prompt += 'Female body shape, feminine shoulders, female hairstyle, female proportions. ';
    } else {
        prompt += 'Male body shape, masculine shoulders, male hairstyle, male proportions. ';
    }
    
    // Ethnicity-specific details
    if (ethnicity.includes('한국') || ethnicity.toLowerCase().includes('korean')) {
        prompt += 'Korean person, East Asian features, Korean skin tone, typical Korean hair color and texture. ';
    } else if (ethnicity.includes('일본') || ethnicity.toLowerCase().includes('japanese')) {
        prompt += 'Japanese person, East Asian features, Japanese skin tone. ';
    } else if (ethnicity.includes('중국') || ethnicity.toLowerCase().includes('chinese')) {
        prompt += 'Chinese person, East Asian features, Chinese skin tone. ';
    } else if (ethnicity.includes('서양') || ethnicity.includes('미국') || ethnicity.toLowerCase().includes('caucasian') || ethnicity.toLowerCase().includes('american')) {
        prompt += 'Caucasian person, Western features, lighter skin tone, Western hair texture. ';
    } else if (ethnicity.includes('흑인') || ethnicity.toLowerCase().includes('african') || ethnicity.toLowerCase().includes('black')) {
        prompt += 'African person, dark skin tone, African features, curly or textured hair. ';
    } else {
        prompt += `${ethnicity} person with typical features of this ethnicity. `;
    }
    
    // 3. CHANGE: Clothing
    prompt += `CHANGE CLOTHING: wearing ${clothing}, different from reference image clothing. `;
    
    // 4. Background
    if (withBackground) {
        prompt += 'Same black background with golden rim lighting. ';
    } else {
        prompt += 'Change to pure white background. ';
    }
    
    // 5. Maintain quality and framing
    prompt += 'Upper body portrait, cropped at waist, professional photography, photorealistic, high detail, 8K quality. ';
    
    // 6. Strong negatives
    prompt += 'NOT: same person as reference, NOT: identical to reference, NOT: same age as reference, NOT: same gender as reference, NOT: same clothing as reference. ';
    prompt += 'NOT: side view, NOT: face visible, NOT: front view, back view only. ';
    
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
