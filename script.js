
// variables
const imageContainer = document.getElementById("imageContainer");
const imageElement = document.getElementById("myImage");

let scene, camera, renderer, planeMesh;
let isHovered = false;
let hoverDuration = 0;

const ANIMATION_CONFIG = {
  updateFrequency: 0.1,
  glitchIntensityMod: 0.5
};

// shaders
const vertexShader = `
    varying vec2 vUv;
    void main() {
       vUv = uv;
       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }
`;

const fragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float glitchIntensity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 baseState = texture2D(tDiffuse, uv);

    if (glitchIntensity > 0.0) {
        float segment = floor(uv.y * 12.0); 
        float randomValue = fract(sin(segment * 12345.6789 + glitchIntensity) * 43758.5453); 
        vec2 offset = vec2(randomValue * 0.03, 0.0) * glitchIntensity;

        vec4 redGlitch = texture2D(tDiffuse, uv + offset);
        vec4 greenGlitch = texture2D(tDiffuse, uv - offset);
        vec4 blueGlitch = texture2D(tDiffuse, uv);

        if (mod(segment, 3.0) == 0.0) {
            gl_FragColor = vec4(redGlitch.r, greenGlitch.g, baseState.b, 1.0);
        } else if (mod(segment, 3.0) == 1.0) {
            gl_FragColor = vec4(baseState.r, greenGlitch.g, blueGlitch.b, 1.0);
        } else {
            gl_FragColor = vec4(redGlitch.r, baseState.g, blueGlitch.b, 1.0);
        }
    } else {
        gl_FragColor = baseState; 
    }
}

`;

function initializeScene(texture) {
  //   camera setup
  camera = new THREE.PerspectiveCamera(
    80,
    imageElement.offsetWidth / imageElement.offsetHeight,
    0.01,
    10
  );
  camera.position.z = 1;

  //   scene creation
  scene = new THREE.Scene();

  //   uniforms
  const shaderUniforms = {
    tDiffuse: { value: texture },
    glitchIntensity: { value: 0.0 }
  };

  //   creating a plane mesh with materials
  planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: shaderUniforms,
      vertexShader,
      fragmentShader
    })
  );

  //   add mesh to scene
  scene.add(planeMesh);

  //   render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(imageElement.offsetWidth, imageElement.offsetHeight);

  //   create a new canvas in imageContainer
  imageContainer.appendChild(renderer.domElement);

  //   if mouse is over the image, isHovered is true
  imageContainer.addEventListener("mouseover", function () {
    isHovered = true;
  });

  //   if mouse is out of the image, isHovered is false and glitchIntensity value is 0
  imageContainer.addEventListener("mouseout", function () {
    isHovered = false;
    shaderUniforms.glitchIntensity.value = 0;
  });
}

// use the existing image from html in the canvas
initializeScene(new THREE.TextureLoader().load(imageElement.src));

animateScene();

function animateScene() {
  requestAnimationFrame(animateScene);

  if (isHovered) {
    hoverDuration += ANIMATION_CONFIG.updateFrequency;

    if (hoverDuration >= 0.5) {
      hoverDuration = 0;
      planeMesh.material.uniforms.glitchIntensity.value = Math.random() * ANIMATION_CONFIG.glitchIntensityMod;
    }
  }

  renderer.render(scene, camera);
}

var button = document.getElementById("escape-button");
var proximity = 300;
var isButtonMoving = false;

function moveButton() {
  if (isButtonMoving) {
    return;
  }

  var viewportWidth = window.innerWidth;
  var viewportHeight = window.innerHeight;
  var buttonWidth = button.offsetWidth;
  var buttonHeight = button.offsetHeight;

  var currentX = parseInt(button.style.left) || 0;
  var currentY = parseInt(button.style.top) || 0;

  var randomX, randomY;
  var minDistance = proximity + 50;

  do {
    randomX = Math.floor(Math.random() * (viewportWidth - buttonWidth));
    randomY = Math.floor(Math.random() * (viewportHeight - buttonHeight));
  } while (calculateDistance(currentX, currentY, randomX, randomY) < minDistance);

  if (randomX + buttonWidth > viewportWidth) {
    randomX = viewportWidth - buttonWidth;
  }
  if (randomY + buttonHeight > viewportHeight) {
    randomY = viewportHeight - buttonHeight;
  }

  button.style.transition = "left 0.5s, top 0.5s";
  button.style.left = randomX + "px";
  button.style.top = randomY + "px";

  isButtonMoving = true;

  button.addEventListener("transitionend", function () {
    isButtonMoving = false;
    updateButtonText();
  }, { once: true });
}


function calculateDistance(mouseX, mouseY, buttonX, buttonY) {
  var dx = mouseX - buttonX;
  var dy = mouseY - buttonY;
  return Math.sqrt(dx * dx + dy * dy);
}

function updateButtonText() {
  var texts = [
    "Contact Me!",
    "C'mon, CLICK",
    "I can do this forever",
    "You're so close!",
    "CLICK ON ME",
    "Are you just bored?",
    "Just click...",
    "You do this everyday",
    "How hard can it be?",
    "I'm right HERE",
    "Click to WIN!!!",
    "Skill issue...",
    "Game Over bro~",
    "Catch me if you can",
    "It's just a button...",
    "CLICK ME GODDAMIT",
    "CLICKKKK",
    "I can't help you",
    "OVER HERE",
    "Contact me, it's FREE!",
    "WHAT are you doing?",
    "OMG 😂",
  ];
  var randomText = texts[Math.floor(Math.random() * texts.length)];
  button.innerHTML = randomText;
}

document.addEventListener("mousemove", function (event) {
  var mouseX = event.clientX;
  var mouseY = event.clientY;
  var buttonRect = button.getBoundingClientRect();
  var buttonX = buttonRect.left + button.offsetWidth / 2;
  var buttonY = buttonRect.top + button.offsetHeight / 2;
  var distance = calculateDistance(mouseX, mouseY, buttonX, buttonY);

  if (distance < proximity) {
    moveButton();
  }
});

