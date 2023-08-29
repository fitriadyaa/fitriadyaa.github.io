import { Application } from "https://cdn.skypack.dev/@splinetool/runtime@0.9.416";


const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);

app
  .load("https://prod.spline.design/N3Y1dkgXzhyXm-eU/scene.splinecode")
  .then(() => {
    const keyboard = app.findObjectByName("keyboard");

    gsap.set(keyboard.scale, { x: 0.8, y: 0.8, z: 0.8 });
    gsap.set(keyboard.position, { x: 400, y: 50 });

    let rotateKeyboard = gsap.to(keyboard.rotation, {
      y: Math.PI * 2 + keyboard.rotation.y,
      x: 0,
      z: 0,
      duration: 10,
      repeat: -1,
      ease: "none"
    });

    let rotationProgress = 0;
    let interval;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#part1",
          start: "top 60%",
          end: "bottom bottom",
          scrub: true,
          onEnter: () => {
            rotationProgress = rotateKeyboard.progress();

            interval = setInterval(() => {
              app.emitEvent("keyDown", "keyboard");
            }, 1500);

            rotateKeyboard.pause();
            gsap.to(keyboard.rotation, {
              y: Math.PI / 12,
              duration: 1
            });
          },
          onLeaveBack: () => {
            const newProgress = keyboard.rotation.y / (Math.PI * 2);
            rotateKeyboard.progress(newProgress).resume();
            clearInterval(interval);
          }
        }
      })
      .to(keyboard.rotation, { x: -Math.PI / 14, z: Math.PI / 36 }, 0)
      .to(keyboard.position, { x: -500, y: 100 }, 0)
      .to(keyboard.scale, { x: 1, y: 1, z: 1}, 0);

    gsap
      .timeline({
        onComplete: () => {
          clearInterval(interval);
          app.emitEvent("mouseDown", "keyboard");
        },
        scrollTrigger: {
          trigger: "#part2",
          start: "top bottom",
          end: "center bottom",
          scrub: true
        }
      })
      .to(keyboard.rotation, { x: Math.PI / 36, y: -Math.PI / 10 }, 0)
      .to(keyboard.position, { x: 350, y: 10 }, 0)
      .to(keyboard.scale, { x: 1.1, y: 1.1, z: 1.1 }, 0);

      gsap
      .timeline({
        scrollTrigger: {
          trigger: "#part3",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true
        }
      })
      .to(keyboard.position, { x: 0, y: 30 }, 0)
      .to(keyboard.scale, { x: 0.5, y: 0.5, z: 0.5 }, 0);
  });



// background progress bar

function animateBar(triggerElement, onEnterWidth, onLeaveBackWidth) {
  gsap.to(".bar", {
    scrollTrigger: {
      trigger: triggerElement,
      start: "top center",
      end: "bottom bottom",
      scrub: true,
      onEnter: () => {
        gsap.to(".bar", {
          width: onEnterWidth,
          duration: 0.2,
          ease: "none"
        });
      },
      onLeaveBack: () => {
        gsap.to(".bar", {
          width: onLeaveBackWidth,
          duration: 0.2,
          ease: "none"
        });
      }
    }
  });
}

animateBar("#part1", "35%", "0%");
animateBar("#part2", "65%", "35%");
animateBar("#part3", "100%", "65%");



// keyboard text effect
const keys = document.querySelectorAll(".key");

function pressRandomKey() {
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  randomKey.style.animation = "pressDown 0.2s ease-in-out";

  randomKey.onanimationend = () => {
    randomKey.style.animation = "";
    setTimeout(pressRandomKey, 100 + Math.random() * 300);
  };
}

pressRandomKey();