// Three.js Background Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(70);

// Create stars
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 15000;
const starsPosArray = new Float32Array(starsCount * 3);

for(let i = 0; i < starsCount * 3; i++) {
    starsPosArray[i] = (Math.random() - 0.5) * 300;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPosArray, 3));

const starsMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: '#ffffff',
    transparent: true,
    opacity: 0.8
});

const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starsMesh);

// Create solar system
const solarSystem = new THREE.Group();
scene.add(solarSystem);

// Sun with glow effect
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.9
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(30, 20, 0); // Move sun to the right and up
solarSystem.add(sun);

// Add sun glow
const sunGlowGeometry = new THREE.SphereGeometry(7, 32, 32);
const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.3
});
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
sunGlow.position.set(30, 20, 0); // Match sun position
solarSystem.add(sunGlow);

// Planets with rings and moons
const planets = [];
const planetColors = [0x4169E1, 0xCD853F, 0xDEB887, 0xFF4500];
const planetSizes = [1.2, 1.5, 1.3, 1];
const orbitRadii = [15, 25, 35, 45];

for(let i = 0; i < 4; i++) {
    const planetGroup = new THREE.Group();
    
    // Main planet
    const planetGeometry = new THREE.SphereGeometry(planetSizes[i], 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({
        color: planetColors[i],
        transparent: true,
        opacity: 0.9
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planetGroup.add(planet);

    // Planet glow
    const planetGlowGeometry = new THREE.SphereGeometry(planetSizes[i] * 1.2, 32, 32);
    const planetGlowMaterial = new THREE.MeshBasicMaterial({
        color: planetColors[i],
        transparent: true,
        opacity: 0.3
    });
    const planetGlow = new THREE.Mesh(planetGlowGeometry, planetGlowMaterial);
    planetGroup.add(planetGlow);

    // Add rings for some planets
    if (i === 1 || i === 2) {
        const ringGeometry = new THREE.TorusGeometry(planetSizes[i] * 2, 0.1, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planetGroup.add(ring);
    }

    // Add moons for some planets
    if (i === 0 || i === 1) {
        const moonGeometry = new THREE.SphereGeometry(planetSizes[i] * 0.3, 16, 16);
        const moonMaterial = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.8
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.x = planetSizes[i] * 2;
        planetGroup.add(moon);
    }

    planetGroup.position.x = orbitRadii[i];
    planets.push(planetGroup);
    solarSystem.add(planetGroup);
}

// Create orbit lines
const orbitLines = [];
for(let i = 0; i < 4; i++) {
    const orbitGeometry = new THREE.RingGeometry(orbitRadii[i] - 0.1, orbitRadii[i] + 0.1, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
    });
    const orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbitLine.rotation.x = Math.PI / 2;
    orbitLines.push(orbitLine);
    solarSystem.add(orbitLine);
}

// Animation
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.001;
    
    // Rotate stars
    starsMesh.rotation.y += 0.0001;
    
    // Rotate solar system
    solarSystem.rotation.y += 0.0005;
    
    // Animate sun glow
    sunGlow.scale.setScalar(1 + Math.sin(time) * 0.1);
    
    // Animate planets and their moons
    planets.forEach((planetGroup, index) => {
        const orbitSpeed = 0.2 / (index + 1);
        planetGroup.position.x = Math.cos(time * orbitSpeed) * orbitRadii[index];
        planetGroup.position.z = Math.sin(time * orbitSpeed) * orbitRadii[index];
        
        // Rotate planets
        planetGroup.children[0].rotation.y += 0.02;
        
        // Animate moons if they exist
        if (planetGroup.children.length > 2) {
            const moon = planetGroup.children[2];
            moon.position.x = Math.cos(time * 2) * planetSizes[index] * 2;
            moon.position.z = Math.sin(time * 2) * planetSizes[index] * 2;
        }
    });
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Calculator Functionality
class Calculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

const calculator = new Calculator();

// Event Listeners
document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

document.querySelector('.equals').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

document.querySelector('.clear').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('.delete').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
}); 