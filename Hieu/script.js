// Global Variables
let currentSection = 'home';
let currentChemicals = [];
let currentPH = 7.0;
let currentTemperature = 25;
let currentColor = 'transparent';
let isHeating = false;
let molAmount = 1.0;
let totalVolume = 0;

let currentSpecimen = null;
let currentMagnification = 10;
let brightness = 70;
let contrast = 100;
let focus = 50;
let currentStain = 'none';

// Chemical Properties Database
const chemicalDatabase = {
  'HCl': {
    name: 'Axit Hydrochloric',
    ph: 1.0,
    color: '#ffcccc',
    description: 'Axit mạnh, không màu, ăn mòn kim loại',
    reaction: 'Phân ly hoàn toàn trong nước: HCl → H⁺ + Cl⁻',
    molarMass: 36.5,
    hazard: 'danger'
  },
  'NaOH': {
    name: 'Natri Hydroxide',
    ph: 13.0,
    color: '#ccccff',
    description: 'Bazơ mạnh, không màu, ăn mòn da',
    reaction: 'Phân ly hoàn toàn trong nước: NaOH → Na⁺ + OH⁻',
    molarMass: 40.0,
    hazard: 'danger'
  },
  'H2SO4': {
    name: 'Axit Sulfuric',
    ph: 0.5,
    color: '#ffffcc',
    description: 'Axit mạnh, nhớt, tỏa nhiệt khi pha loãng',
    reaction: 'Phân ly từng bước: H₂SO₄ → H⁺ + HSO₄⁻',
    molarMass: 98.1,
    hazard: 'danger'
  },
  'CuSO4': {
    name: 'Đồng Sulfate',
    ph: 4.5,
    color: '#87ceeb',
    description: 'Dung dịch màu xanh lam, tạo kết tủa với bazơ',
    reaction: 'CuSO₄ → Cu²⁺ + SO₄²⁻',
    molarMass: 159.6,
    hazard: 'warning'
  },
  'FeCl3': {
    name: 'Sắt (III) Chloride',
    ph: 2.0,
    color: '#ffa500',
    description: 'Dung dịch màu vàng cam, có tính oxy hóa',
    reaction: 'FeCl₃ → Fe³⁺ + 3Cl⁻',
    molarMass: 162.2,
    hazard: 'warning'
  },
  'AgNO3': {
    name: 'Bạc Nitrate',
    ph: 5.5,
    color: '#c0c0c0',
    description: 'Không màu, tạo kết tủa trắng với Cl⁻',
    reaction: 'AgNO₃ → Ag⁺ + NO₃⁻',
    molarMass: 169.9,
    hazard: 'warning'
  },
  'KMnO4': {
    name: 'Kali Permanganate',
    ph: 8.0,
    color: '#800080',
    description: 'Dung dịch màu tím, chất oxy hóa mạnh',
    reaction: 'KMnO₄ → K⁺ + MnO₄⁻',
    molarMass: 158.0,
    hazard: 'warning'
  },
  'Ca(OH)2': {
    name: 'Canxi Hydroxide',
    ph: 12.5,
    color: '#e6f3ff',
    description: 'Nước vôi trong, bazơ yếu',
    reaction: 'Ca(OH)₂ → Ca²⁺ + 2OH⁻',
    molarMass: 74.1,
    hazard: 'normal'
  },
  'phenolphthalein': {
    name: 'Phenolphthalein',
    ph: 7.0,
    color: 'transparent',
    description: 'Chỉ thị pH, không màu trong môi trường axit',
    reaction: 'Đổi màu hồng trong môi trường bazơ (pH > 8.3)',
    molarMass: 318.3,
    hazard: 'normal'
  },
  'methylorange': {
    name: 'Methyl Orange',
    ph: 7.0,
    color: '#ffa500',
    description: 'Chỉ thị pH, đỏ trong axit, vàng trong bazơ',
    reaction: 'Đổi màu tại pH 3.1-4.4',
    molarMass: 327.3,
    hazard: 'normal'
  },
  'litmus': {
    name: 'Quỳ tím',
    ph: 7.0,
    color: '#9370db',
    description: 'Chỉ thị pH tự nhiên, đỏ trong axit, xanh trong bazơ',
    reaction: 'Đổi màu tại pH 6.8-8.1',
    molarMass: 0,
    hazard: 'normal'
  },
  'iodine': {
    name: 'Iod',
    ph: 6.0,
    color: '#8b4513',
    description: 'Dung dịch màu nâu, phát hiện tinh bột',
    reaction: 'I₂ + I⁻ → I₃⁻',
    molarMass: 253.8,
    hazard: 'warning'
  }
};

// Specimen Database
const specimenDatabase = {
  'plant': {
    name: 'Tế bào thực vật',
    description: 'Tế bào thực vật có thành tế bào cứng, lục lạp và không bào lớn. Nhân tế bào nằm ở trung tâm hoặc bên cạnh do không bào đẩy.',
    structure: 'plant-cell',
    organelles: ['nucleus', 'chloroplast', 'vacuole', 'cell-wall']
  },
  'animal': {
    name: 'Tế bào động vật',
    description: 'Tế bào động vật không có thành tế bào, không có lục lạp. Nhân tế bào thường nằm ở trung tâm và có nhiều ti thể.',
    structure: 'animal-cell',
    organelles: ['nucleus', 'mitochondria', 'lysosome']
  },
  'nerve': {
    name: 'Tế bào thần kinh',
    description: 'Tế bào thần kinh có thân tế bào, sợi trục và các nhánh tế bào. Chuyên truyền tín hiệu điện.',
    structure: 'nerve-cell',
    organelles: ['nucleus', 'dendrites', 'axon']
  },
  'muscle': {
    name: 'Tế bào cơ',
    description: 'Tế bào cơ có dạng sợi dài, chứa nhiều protein actin và myosin để co bóp.',
    structure: 'muscle-cell',
    organelles: ['nucleus', 'myofibril', 'mitochondria']
  },
  'leaf': {
    name: 'Mô lá',
    description: 'Mô lá gồm lớp biểu bì, mô giậu và mô xốp chứa lục lạp để quang hợp.',
    structure: 'leaf-tissue',
    organelles: ['epidermis', 'palisade', 'spongy']
  },
  'root': {
    name: 'Mô rễ',
    description: 'Mô rễ có lớp biểu bì với lông hút, vỏ rễ và trụ dẫn để hấp thụ nước.',
    structure: 'root-tissue',
    organelles: ['epidermis', 'cortex', 'vascular']
  },
  'skin': {
    name: 'Mô da',
    description: 'Mô da gồm biểu bì, hạ bì và mô dưới da, có chức năng bảo vệ.',
    structure: 'skin-tissue',
    organelles: ['epidermis', 'dermis', 'subcutaneous']
  },
  'blood': {
    name: 'Máu',
    description: 'Máu gồm hồng cầu, bạch cầu và tiểu cầu trong huyết tương.',
    structure: 'blood-tissue',
    organelles: ['red-blood-cell', 'white-blood-cell', 'platelet']
  },
  'bacteria': {
    name: 'Vi khuẩn',
    description: 'Vi khuẩn là sinh vật đơn bào prokaryote, không có nhân thực sự. Vật chất di truyền nằm rải rác trong tế bào chất.',
    structure: 'bacteria-cell',
    organelles: ['nucleoid', 'plasmid', 'flagella']
  },
  'virus': {
    name: 'Virus',
    description: 'Virus là tiểu phần nhiễm trùng gồm vật chất di truyền và vỏ protein.',
    structure: 'virus-particle',
    organelles: ['capsid', 'genetic-material']
  },
  'yeast': {
    name: 'Nấm men',
    description: 'Nấm men là nấm đơn bào, có nhân thực sự và sinh sản bằng nảy chồi.',
    structure: 'yeast-cell',
    organelles: ['nucleus', 'bud', 'vacuole']
  },
  'protozoa': {
    name: 'Động vật nguyên sinh',
    description: 'Động vật nguyên sinh là sinh vật đơn bào có nhân, di chuyển bằng lông mao hoặc giả chân.',
    structure: 'protozoa-cell',
    organelles: ['nucleus', 'cilia', 'food-vacuole']
  }
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  setupChemistryExperiment();
  setupBiologyExperiment();
  setupExperimentCards();
  setupReagentTabs();
  setupSpecimenTabs();
  setupMolInput();
  setupStaining();
}

// Navigation System
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSection = this.getAttribute('data-section');
      switchSection(targetSection);

      // Update active nav link
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function switchSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  // Show target section
  document.getElementById(sectionName).classList.add('active');
  currentSection = sectionName;
}

// Experiment Card Navigation
function setupExperimentCards() {
  const experimentCards = document.querySelectorAll('.experiment-card');
  const startButtons = document.querySelectorAll('.start-btn');

  experimentCards.forEach(card => {
    card.addEventListener('click', function () {
      const experiment = this.getAttribute('data-experiment');
      navigateToExperiment(experiment);
    });
  });

  startButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      const experiment = this.closest('.experiment-card').getAttribute('data-experiment');
      navigateToExperiment(experiment);
    });
  });
}

function navigateToExperiment(experiment) {
  switchSection(experiment);

  // Update navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === experiment) {
      link.classList.add('active');
    }
  });
}

// Chemistry Experiment
function setupChemistryExperiment() {
  const reagents = document.querySelectorAll('.reagent');
  const clearButton = document.getElementById('clearBeaker');
  const heatButton = document.getElementById('heatBeaker');

  reagents.forEach(reagent => {
    reagent.addEventListener('click', function () {
      const chemical = this.getAttribute('data-chemical');
      addChemical(chemical);

      // Visual feedback
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });

  clearButton.addEventListener('click', clearBeaker);
  heatButton.addEventListener('click', toggleHeating);
}

function addChemical(chemical) {
  const chemData = chemicalDatabase[chemical];
  if (!chemData) return;

  // Add chemical with mol information
  currentChemicals.push({
    name: chemical,
    mol: molAmount,
    mass: (molAmount * chemData.molarMass).toFixed(2)
  });

  totalVolume += molAmount * 0.1; // Assuming each mol adds 0.1L

  updateBeaker();
  updateReactionDisplay();
  updateProperties();
  checkSpecialReactions();

  // Add animation effect
  const liquid = document.getElementById('liquidLevel');
  liquid.classList.add('bubbling');
  setTimeout(() => {
    liquid.classList.remove('bubbling');
  }, 1000);

  // Show notification with mol info
  showNotification(`Đã thêm ${molAmount} mol ${chemData.name} (${(molAmount * chemData.molarMass).toFixed(1)}g)`, 'success');
}

function checkSpecialReactions() {
  const chemicalNames = currentChemicals.map(c => c.name);

  // Silver + Chloride = White precipitate
  if (chemicalNames.includes('AgNO3') && chemicalNames.includes('HCl')) {
    showNotification('Phản ứng: AgNO₃ + HCl → AgCl↓ + HNO₃ (kết tủa trắng)', 'info');
  }

  // Copper sulfate + base = Blue precipitate
  if (chemicalNames.includes('CuSO4') && (chemicalNames.includes('NaOH') || chemicalNames.includes('Ca(OH)2'))) {
    showNotification('Phản ứng: CuSO₄ + 2OH⁻ → Cu(OH)₂↓ + SO₄²⁻ (kết tủa xanh)', 'info');
  }

  // Iron(III) + Hydroxide = Brown precipitate
  if (chemicalNames.includes('FeCl3') && (chemicalNames.includes('NaOH') || chemicalNames.includes('Ca(OH)2'))) {
    showNotification('Phản ứng: Fe³⁺ + 3OH⁻ → Fe(OH)₃↓ (kết tủa nâu đỏ)', 'info');
  }

  // Permanganate reactions
  if (chemicalNames.includes('KMnO4')) {
    if (currentPH < 7) {
      showNotification('KMnO₄ trong môi trường axit: MnO₄⁻ → Mn²⁺ (không màu)', 'info');
    }
  }
}

function updateBeaker() {
  const liquid = document.getElementById('liquidLevel');
  const height = Math.min(totalVolume * 120, 120); // Max 120px height

  liquid.style.height = height + 'px';
  liquid.style.background = getCurrentMixColor();

  // Add volume markings
  const volumeDisplay = document.querySelector('.beaker-label');
  if (volumeDisplay) {
    volumeDisplay.textContent = `Cốc thí nghiệm (${totalVolume.toFixed(1)}L)`;
  }
}

function getCurrentMixColor() {
  if (currentChemicals.length === 0) return 'transparent';

  // Check for specific reactions
  const chemicalNames = currentChemicals.map(c => c.name);

  if (chemicalNames.includes('HCl') && chemicalNames.includes('NaOH')) {
    return 'linear-gradient(180deg, transparent 0%, #e8f5e8 100%)'; // Neutralization
  }

  if (chemicalNames.includes('phenolphthalein') && currentPH > 8.3) {
    return 'linear-gradient(180deg, transparent 0%, #ffb3d9 100%)'; // Pink in basic
  }

  if (chemicalNames.includes('methylorange')) {
    if (currentPH < 3.1) {
      return 'linear-gradient(180deg, transparent 0%, #ff6b6b 100%)'; // Red in acid
    } else if (currentPH > 4.4) {
      return 'linear-gradient(180deg, transparent 0%, #ffd93d 100%)'; // Yellow in base
    }
  }

  if (chemicalNames.includes('CuSO4') && (chemicalNames.includes('NaOH') || chemicalNames.includes('Ca(OH)2'))) {
    return 'linear-gradient(180deg, transparent 0%, #4fc3f7 100%)'; // Blue precipitate
  }

  if (chemicalNames.includes('AgNO3') && chemicalNames.includes('HCl')) {
    return 'linear-gradient(180deg, transparent 0%, #f5f5f5 100%)'; // White precipitate
  }

  if (chemicalNames.includes('FeCl3') && (chemicalNames.includes('NaOH') || chemicalNames.includes('Ca(OH)2'))) {
    return 'linear-gradient(180deg, transparent 0%, #8d6e63 100%)'; // Brown precipitate
  }

  // Default mixed color based on last added chemical
  const lastChemical = currentChemicals[currentChemicals.length - 1];
  const chemData = chemicalDatabase[lastChemical.name];
  return `linear-gradient(180deg, transparent 0%, ${chemData.color} 100%)`;
}

function updateReactionDisplay() {
  const display = document.getElementById('reactionDisplay');

  if (currentChemicals.length === 0) {
    display.innerHTML = '<p>Chọn hóa chất để bắt đầu thí nghiệm</p>';
    return;
  }

  let reactionText = '<h4>Phản ứng hiện tại:</h4>';

  // Show detailed chemical information
  reactionText += '<div class="chemical-summary">';
  currentChemicals.forEach(chemical => {
    const chemData = chemicalDatabase[chemical.name];
    reactionText += `
      <div class="chemical-item">
        <strong>${chemData.name}</strong><br>
        <small>Số mol: ${chemical.mol} | Khối lượng: ${chemical.mass}g</small><br>
        <small>${chemData.reaction}</small>
      </div>
    `;
  });
  reactionText += '</div>';

  // Check for neutralization
  const chemicalNames = currentChemicals.map(c => c.name);
  if (chemicalNames.includes('HCl') && chemicalNames.includes('NaOH')) {
    reactionText += '<div class="reaction-highlight">';
    reactionText += '<p><strong>Phản ứng trung hòa:</strong></p>';
    reactionText += '<p>HCl + NaOH → NaCl + H₂O</p>';
    reactionText += '<p>Tạo thành muối và nước, dung dịch trở nên trung tính.</p>';
    reactionText += '</div>';
  }

  display.innerHTML = reactionText;
}

function updateProperties() {
  // Calculate weighted average pH based on moles
  if (currentChemicals.length > 0) {
    let totalMoles = 0;
    let phSum = 0;

    currentChemicals.forEach(chemical => {
      const chemData = chemicalDatabase[chemical.name];
      totalMoles += chemical.mol;
      phSum += chemData.ph * chemical.mol;
    });

    currentPH = (phSum / totalMoles).toFixed(1);

    // Neutralization effect
    const chemicalNames = currentChemicals.map(c => c.name);
    if (chemicalNames.includes('HCl') && chemicalNames.includes('NaOH')) {
      currentPH = 7.0;
    }
  } else {
    currentPH = 7.0;
  }

  // Update display with safety warnings
  const phElement = document.getElementById('phValue');
  const tempElement = document.getElementById('temperature');
  const colorElement = document.getElementById('colorValue');

  phElement.textContent = currentPH;
  tempElement.textContent = currentTemperature + '°C';

  // Add safety class based on pH
  phElement.parentElement.className = 'property';
  if (currentPH < 3 || currentPH > 11) {
    phElement.parentElement.classList.add('danger');
  } else if (currentPH < 5 || currentPH > 9) {
    phElement.parentElement.classList.add('warning');
  }

  // Temperature warning
  tempElement.parentElement.className = 'property';
  if (currentTemperature > 60) {
    tempElement.parentElement.classList.add('warning');
  }
  if (currentTemperature > 80) {
    tempElement.parentElement.classList.add('danger');
  }

  // Determine color description
  let colorDesc = 'Trong suốt';
  const chemicalNames = currentChemicals.map(c => c.name);

  if (chemicalNames.includes('phenolphthalein') && currentPH > 8.3) {
    colorDesc = 'Hồng';
  } else if (chemicalNames.includes('methylorange')) {
    if (currentPH < 3.1) colorDesc = 'Đỏ';
    else if (currentPH > 4.4) colorDesc = 'Vàng';
    else colorDesc = 'Cam';
  } else if (chemicalNames.includes('CuSO4')) {
    colorDesc = 'Xanh lam';
  } else if (chemicalNames.includes('FeCl3')) {
    colorDesc = 'Vàng cam';
  } else if (chemicalNames.includes('KMnO4')) {
    colorDesc = 'Tím';
  } else if (currentChemicals.length > 0) {
    colorDesc = 'Có màu nhạt';
  }

  colorElement.textContent = colorDesc;
}

function clearBeaker() {
  currentChemicals = [];
  currentPH = 7.0;
  currentTemperature = 25;
  totalVolume = 0;
  isHeating = false;

  const liquid = document.getElementById('liquidLevel');
  liquid.style.height = '0px';
  liquid.style.background = 'transparent';
  liquid.classList.remove('heating');

  // Reset beaker label
  const volumeDisplay = document.querySelector('.beaker-label');
  if (volumeDisplay) {
    volumeDisplay.textContent = 'Cốc thí nghiệm';
  }

  updateReactionDisplay();
  updateProperties();

  // Update heat button
  const heatButton = document.getElementById('heatBeaker');
  heatButton.innerHTML = '<i class="fas fa-fire"></i> Đun Nóng';
  heatButton.style.background = '#34495e';

  showNotification('Đã làm sạch cốc thí nghiệm', 'success');
}

function toggleHeating() {
  const liquid = document.getElementById('liquidLevel');
  const heatButton = document.getElementById('heatBeaker');

  if (currentChemicals.length === 0) {
    alert('Hãy thêm hóa chất trước khi đun nóng!');
    return;
  }

  isHeating = !isHeating;

  if (isHeating) {
    currentTemperature = 85;
    liquid.classList.add('heating', 'bubbling');
    heatButton.innerHTML = '<i class="fas fa-snowflake"></i> Tắt Nhiệt';
    heatButton.style.background = '#e74c3c';
  } else {
    currentTemperature = 25;
    liquid.classList.remove('heating', 'bubbling');
    heatButton.innerHTML = '<i class="fas fa-fire"></i> Đun Nóng';
    heatButton.style.background = '#34495e';
  }

  updateProperties();
}

// Biology Experiment
function setupBiologyExperiment() {
  const specimens = document.querySelectorAll('.specimen');
  const objectives = document.querySelectorAll('.objective');
  const brightnessSlider = document.getElementById('brightness');
  const contrastSlider = document.getElementById('contrast');
  const focusSlider = document.getElementById('focus');

  specimens.forEach(specimen => {
    specimen.addEventListener('click', function () {
      const specimenType = this.getAttribute('data-specimen');
      selectSpecimen(specimenType);

      // Visual feedback
      specimens.forEach(s => s.style.background = 'white');
      this.style.background = '#e3f2fd';
    });
  });

  objectives.forEach(objective => {
    objective.addEventListener('click', function () {
      const magnification = parseInt(this.getAttribute('data-magnification'));
      setMagnification(magnification);

      objectives.forEach(o => o.classList.remove('active'));
      this.classList.add('active');
    });
  });

  brightnessSlider.addEventListener('input', function () {
    brightness = this.value;
    updateMicroscopeView();
  });

  contrastSlider.addEventListener('input', function () {
    contrast = this.value;
    updateMicroscopeView();
  });

  focusSlider.addEventListener('input', function () {
    focus = this.value;
    updateMicroscopeView();
  });
}

function selectSpecimen(specimenType) {
  currentSpecimen = specimenType;
  updateMicroscopeView();
  updateObservationPanel();
}

function setMagnification(magnification) {
  currentMagnification = magnification;
  document.getElementById('magnificationValue').textContent = magnification + 'x';
  updateMicroscopeView();
}

function updateMicroscopeView() {
  const cellDisplay = document.getElementById('cellDisplay');
  const viewArea = document.querySelector('.view-area');

  if (!currentSpecimen) {
    cellDisplay.innerHTML = '<p>Chọn mẫu vật để quan sát</p>';
    return;
  }

  // Apply visual filters
  viewArea.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

  // Focus effect
  const focusBlur = Math.abs(focus - 50) / 10;
  viewArea.style.filter += ` blur(${focusBlur}px)`;

  // Create cell structure based on specimen type
  cellDisplay.innerHTML = createCellStructure(currentSpecimen);
}

function createCellStructure(specimenType) {
  const stainClass = currentStain !== 'none' ? `stained-${currentStain}` : '';

  switch (specimenType) {
    case 'plant':
      return `
        <div class="cell-structure ${stainClass}" style="background: radial-gradient(circle, #e8f5e8 0%, #c8e6c9 50%, #a5d6a7 100%);">
          <div class="nucleus" style="background: #4caf50;"></div>
          <div class="chloroplast" style="top: 20%; left: 30%;"></div>
          <div class="chloroplast" style="top: 60%; right: 25%;"></div>
          <div class="chloroplast" style="bottom: 30%; left: 20%;"></div>
          <div class="vacuole" style="top: 30%; right: 20%;"></div>
          <div class="organelle" style="background: #66bb6a; top: 70%; left: 60%;"></div>
        </div>
      `;

    case 'animal':
      return `
        <div class="cell-structure ${stainClass}" style="background: radial-gradient(circle, #fce4ec 0%, #f8bbd9 50%, #f48fb1 100%);">
          <div class="nucleus" style="background: #e91e63;"></div>
          <div class="mitochondria" style="top: 25%; left: 20%;"></div>
          <div class="mitochondria" style="top: 40%; right: 25%;"></div>
          <div class="mitochondria" style="bottom: 30%; left: 30%;"></div>
          <div class="mitochondria" style="bottom: 20%; right: 35%;"></div>
          <div class="organelle" style="background: #ec407a; top: 60%; left: 65%;"></div>
        </div>
      `;

    case 'nerve':
      return `
        <div class="cell-structure ${stainClass}" style="background: radial-gradient(circle, #f3e5f5 0%, #e1bee7 50%, #ce93d8 100%); border-radius: 30%;">
          <div class="nucleus" style="background: #9c27b0; width: 25%; height: 25%;"></div>
          <div style="position: absolute; top: 10%; left: 50%; width: 2px; height: 40%; background: #7b1fa2; transform: translateX(-50%);"></div>
          <div style="position: absolute; bottom: 10%; left: 30%; width: 40%; height: 2px; background: #7b1fa2;"></div>
          <div style="position: absolute; bottom: 10%; right: 30%; width: 30%; height: 2px; background: #7b1fa2;"></div>
        </div>
      `;

    case 'muscle':
      return `
        <div class="cell-structure ${stainClass}" style="background: radial-gradient(circle, #fff3e0 0%, #ffe0b2 50%, #ffcc80 100%); border-radius: 20%;">
          <div class="nucleus" style="background: #ff9800; width: 20%; height: 30%; left: 20%;"></div>
          <div style="position: absolute; top: 20%; left: 50%; width: 2px; height: 60%; background: #f57c00;"></div>
          <div style="position: absolute; top: 20%; left: 60%; width: 2px; height: 60%; background: #f57c00;"></div>
          <div style="position: absolute; top: 20%; left: 70%; width: 2px; height: 60%; background: #f57c00;"></div>
        </div>
      `;

    case 'leaf':
      return `
        <div class="cell-structure ${stainClass}" style="background: linear-gradient(180deg, #c8e6c9 0%, #a5d6a7 40%, #81c784 100%);">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 20%; background: #4caf50; opacity: 0.7;"></div>
          <div style="position: absolute; top: 20%; left: 0; right: 0; height: 40%; background: radial-gradient(circle, #66bb6a 20%, transparent 20%); background-size: 20px 20px;"></div>
          <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 40%; background: #a5d6a7; opacity: 0.8;"></div>
        </div>
      `;

    case 'root':
      return `
        <div class="cell-structure ${stainClass}" style="background: linear-gradient(45deg, #d7ccc8 0%, #bcaaa4 50%, #a1887f 100%);">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 25%; background: #8d6e63; opacity: 0.6;"></div>
          <div style="position: absolute; top: 25%; left: 0; right: 0; height: 50%; background: #a1887f; opacity: 0.8;"></div>
          <div style="position: absolute; bottom: 0; left: 40%; right: 40%; height: 25%; background: #6d4c41; border-radius: 50%;"></div>
        </div>
      `;

    case 'skin':
      return `
        <div class="cell-structure ${stainClass}" style="background: linear-gradient(180deg, #ffccbc 0%, #ffab91 30%, #ff8a65 100%);">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 30%; background: #ff7043; opacity: 0.8;"></div>
          <div style="position: absolute; top: 30%; left: 0; right: 0; height: 40%; background: #ff5722; opacity: 0.6;"></div>
          <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 30%; background: #bf360c; opacity: 0.4;"></div>
        </div>
      `;

    case 'blood':
      return `
        <div class="cell-structure ${stainClass}" style="background: radial-gradient(circle, #ffebee 0%, #ffcdd2 50%, #ef5350 100%);">
          <div style="position: absolute; top: 20%; left: 20%; width: 25%; height: 25%; background: #d32f2f; border-radius: 50%;"></div>
          <div style="position: absolute; top: 40%; right: 25%; width: 20%; height: 20%; background: #1976d2; border-radius: 50%;"></div>
          <div style="position: absolute; bottom: 30%; left: 60%; width: 15%; height: 15%; background: #388e3c; border-radius: 50%;"></div>
          <div style="position: absolute; bottom: 20%; right: 40%; width: 10%; height: 10%; background: #f57c00; border-radius: 50%;"></div>
        </div>
      `;

    case 'bacteria':
      return `
        <div class="cell-structure ${stainClass}" style="background: radial-gradient(circle, #fff3e0 0%, #ffe0b2 50%, #ffcc80 100%); border-radius: 60%;">
          <div style="position: absolute; top: 30%; left: 40%; width: 20%; height: 20%; background: #ff9800; border-radius: 50%; opacity: 0.8;"></div>
          <div style="position: absolute; top: 50%; right: 30%; width: 15%; height: 15%; background: #f57c00; border-radius: 50%;"></div>
          <div style="position: absolute; top: 10%; left: 60%; width: 8%; height: 8%; background: #e65100; border-radius: 50%;"></div>
        </div>
      `;

    case 'virus':
      return `
        <div class="cell-structure ${stainClass}" style="background: radial-gradient(circle, #e8eaf6 0%, #c5cae9 50%, #9fa8da 100%); border-radius: 50%;">
          <div style="position: absolute; top: 40%; left: 40%; width: 20%; height: 20%; background: #3f51b5; border-radius: 50%;"></div>
          <div style="position: absolute; top: 20%; left: 20%; width: 8px; height: 8px; background: #303f9f; border-radius: 50%;"></div>
          <div style="position: absolute; top: 30%; right: 25%; width: 6px; height: 6px; background: #303f9f; border-radius: 50%;"></div>
          <div style="position: absolute; bottom: 25%; left: 30%; width: 6px; height: 6px; background: #303f9f; border-radius: 50%;"></div>
        </div>
      `;

    case 'yeast':
      return `
        <div class="cell-structure ${stainClass}" style="background: radial-gradient(circle, #f1f8e9 0%, #dcedc8 50%, #c5e1a5 100%); border-radius: 50%;">
          <div class="nucleus" style="background: #689f38; width: 30%; height: 30%;"></div>
          <div style="position: absolute; top: 10%; right: 20%; width: 25%; height: 25%; background: #8bc34a; border-radius: 50%; opacity: 0.7;"></div>
          <div class="vacuole" style="bottom: 20%; left: 20%; width: 20%; height: 20%;"></div>
        </div>
      `;

    case 'protozoa':
      return `
        <div class="cell-structure ${stainClass}" style="background: radial-gradient(circle, #e0f2f1 0%, #b2dfdb 50%, #80cbc4 100%); border-radius: 60%;">
          <div class="nucleus" style="background: #00695c; width: 25%; height: 25%;"></div>
          <div style="position: absolute; top: 15%; left: 15%; width: 4px; height: 20px; background: #004d40; border-radius: 2px; animation: wiggle 1s infinite;"></div>
          <div style="position: absolute; top: 20%; right: 20%; width: 4px; height: 15px; background: #004d40; border-radius: 2px; animation: wiggle 1.2s infinite;"></div>
          <div style="position: absolute; bottom: 30%; left: 30%; width: 15%; height: 15%; background: #26a69a; border-radius: 50%; opacity: 0.8;"></div>
        </div>
      `;

    default:
      return '<p>Mẫu vật không xác định</p>';
  }
}

// Add wiggle animation for protozoa cilia
const additionalStyles = `
  @keyframes wiggle {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }
`;

if (!document.querySelector('#additional-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'additional-styles';
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);
}

function updateObservationPanel() {
  if (!currentSpecimen) return;

  const specimenData = specimenDatabase[currentSpecimen];
  document.getElementById('specimenType').textContent = specimenData.name;
  document.getElementById('cellDescription').textContent = specimenData.description;
}

// Setup Reagent Tabs
function setupReagentTabs() {
  const reagentTabs = document.querySelectorAll('.reagent-tab');
  const reagentCategories = document.querySelectorAll('.reagent-category');

  reagentTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const category = this.getAttribute('data-category');

      // Update active tab
      reagentTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Show corresponding category
      reagentCategories.forEach(cat => {
        cat.classList.remove('active');
        if (cat.id === category + '-reagents') {
          cat.classList.add('active');
        }
      });

      // Re-setup reagent listeners for new category
      setupReagentListeners();
    });
  });

  setupReagentListeners();
}

function setupReagentListeners() {
  const reagents = document.querySelectorAll('.reagent');
  reagents.forEach(reagent => {
    // Remove existing listeners
    reagent.replaceWith(reagent.cloneNode(true));
  });

  // Add fresh listeners
  document.querySelectorAll('.reagent').forEach(reagent => {
    reagent.addEventListener('click', function () {
      const chemical = this.getAttribute('data-chemical');
      addChemical(chemical);

      // Visual feedback
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}

// Setup Specimen Tabs
function setupSpecimenTabs() {
  const specimenTabs = document.querySelectorAll('.specimen-tab');
  const specimenCategories = document.querySelectorAll('.specimen-category');

  specimenTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const category = this.getAttribute('data-category');

      // Update active tab
      specimenTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Show corresponding category
      specimenCategories.forEach(cat => {
        cat.classList.remove('active');
        if (cat.id === category + '-specimens') {
          cat.classList.add('active');
        }
      });

      // Re-setup specimen listeners
      setupSpecimenListeners();
    });
  });

  setupSpecimenListeners();
}

function setupSpecimenListeners() {
  const specimens = document.querySelectorAll('.specimen');
  specimens.forEach(specimen => {
    specimen.replaceWith(specimen.cloneNode(true));
  });

  document.querySelectorAll('.specimen').forEach(specimen => {
    specimen.addEventListener('click', function () {
      const specimenType = this.getAttribute('data-specimen');
      selectSpecimen(specimenType);

      // Visual feedback
      document.querySelectorAll('.specimen').forEach(s => s.style.background = 'white');
      this.style.background = '#e3f2fd';
    });
  });
}

// Setup Mol Input
function setupMolInput() {
  const molInput = document.getElementById('molAmount');
  const concentrationDisplay = document.getElementById('concentrationValue');

  if (molInput) {
    molInput.addEventListener('input', function () {
      molAmount = parseFloat(this.value);
      updateConcentration();
    });
  }

  updateConcentration();
}

function updateConcentration() {
  const concentrationDisplay = document.getElementById('concentrationValue');
  if (concentrationDisplay) {
    // Assuming 1L solution for simplicity
    concentrationDisplay.textContent = molAmount.toFixed(1) + ' M';
  }
}

// Setup Staining
function setupStaining() {
  const stainButtons = document.querySelectorAll('.stain-btn');

  stainButtons.forEach(button => {
    button.addEventListener('click', function () {
      currentStain = this.getAttribute('data-stain');

      // Update active button
      stainButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Update microscope view with staining
      updateMicroscopeView();

      showNotification(`Đã áp dụng nhuộm: ${this.textContent}`, 'success');
    });
  });
}

// Utility Functions
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize help system
function initializeHelp() {
  // Add help tooltips for complex elements
  const helpElements = [
    { selector: '.reagent', text: 'Nhấp để thêm hóa chất vào cốc thí nghiệm' },
    { selector: '.objective', text: 'Chọn độ phóng đại khác nhau' },
    { selector: '.specimen', text: 'Chọn mẫu vật để quan sát' }
  ];

  helpElements.forEach(({ selector, text }) => {
    document.querySelectorAll(selector).forEach(element => {
      element.title = text;
    });
  });
}

// Call help initialization
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(initializeHelp, 1000);
});
