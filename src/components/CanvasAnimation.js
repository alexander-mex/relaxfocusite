import React, { useEffect, useRef } from 'react';
import '../styles/CanvasAnimation.css';

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

     const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    updateCanvasSize();
    
    const getCurrentTheme = () => {
      return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    };

    const lightThemeColors = {
      circleFill: 'rgba(100, 100, 100, 0.8)',
      circleGlow: 'rgba(0, 0, 0, 0.2)',
      lineColor: 'rgba(0, 0, 0, 0.2)'
    };

    const darkThemeColors = {
      circleFill: 'rgba(200, 200, 200, 0.55)',
      circleGlow: 'rgba(255, 255, 255, 0.1)',
      lineColor: 'rgba(255, 255, 255, 0.42)'
    };

    const getColors = () => {
      return getCurrentTheme() === 'dark' ? darkThemeColors : lightThemeColors;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    class Point {
      constructor(x, y) {
        this.originalX = x;
        this.originalY = y;
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = 3 + Math.random() * 5;
        this.color = getColors().circleFill;
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx + Math.sin(this.angle) * 0.1;
        this.y += this.vy + Math.cos(this.angle) * 0.1;
        this.angle += 0.02;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        this.vx *= 0.998;
        this.vy *= 0.998;

        const dx = this.x - this.originalX;
        const dy = this.y - this.originalY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 180) {
          const angle = Math.atan2(dy, dx);
          this.x = this.originalX + Math.cos(angle) * 180;
          this.y = this.originalY + Math.sin(angle) * 180;
        }
      }

      repel(mouseX, mouseY) {
        if (mouseX !== null && mouseY !== null) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const force = (100 - distance) / 100 * 0.03;
            this.vx += dx / distance * force;
            this.vy += dy / distance * force;
          }
        }
      }

      draw() {
        const colors = getColors();
        this.color = colors.circleFill;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = colors.circleGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const points = [];
    for (let i = 0; i < 100; i++) {
      points.push(new Point(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }

    function connectPoints() {
      const colors = getColors();
      ctx.strokeStyle = colors.lineColor;
      ctx.lineWidth = 1;

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
    }

    let mouseX = null;
    let mouseY = null;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseOut = () => {
      mouseX = null;
      mouseY = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);

    const observer = new MutationObserver(() => {
      points.forEach(point => point.draw());
      connectPoints();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      points.forEach(point => {
        point.update();
        point.repel(mouseX, mouseY);
        point.draw();
      });

      connectPoints();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseout', handleMouseOut);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="canvas-animation" />
    </div>
  );
};

export default CanvasAnimation;