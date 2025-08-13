// ====================
// PRELOADER LOGIC
// ====================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

// ======================================================
// DRAGGABLE NOTES LOGIC (MOBILE & DESKTOP - STACKED START)
// ======================================================
let highestZ = 1;

class Paper {
  holdingPaper = false;
  
  // Store the starting position of the mouse/touch
  initialX = 0;
  initialY = 0;

  // Store the starting position of the paper itself
  initialPaperX = 0;
  initialPaperY = 0;

  // Store the current position of the paper (starts at 0,0)
  currentPaperX = 0;
  currentPaperY = 0;

  // Each paper still gets a unique random rotation for a natural look
  rotation = Math.random() * 30 - 15;

  init(paper) {
    // Set the initial rotation, but NOT the position.
    // This makes them stacked but slightly askew.
    paper.style.transform = `rotateZ(${this.rotation}deg)`;

    // This function will be called by both mouse and touch events
    const startDrag = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;

      // Determine if it's a touch or mouse event and get coordinates
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      this.initialX = clientX;
      this.initialY = clientY;
      
      // Store the paper's current position when drag starts
      this.initialPaperX = this.currentPaperX;
      this.initialPaperY = this.currentPaperY;
      
      // Prevent default actions like text selection or page scrolling on touch
      e.preventDefault();
    };

    // This function moves the paper
    const moveDrag = (e) => {
      if (this.holdingPaper) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // Calculate the new position based on the initial positions
        this.currentPaperX = this.initialPaperX + (clientX - this.initialX);
        this.currentPaperY = this.initialPaperY + (clientY - this.initialY);

        // Apply the new transform
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // This function ends the drag
    const endDrag = () => {
      this.holdingPaper = false;
    };

    // --- Event Listeners ---
    // Mouse Events
    paper.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);

    // Touch Events (for mobile)
    paper.addEventListener('touchstart', startDrag);
    window.addEventListener('touchmove', moveDrag);
    window.addEventListener('touchend', endDrag);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
