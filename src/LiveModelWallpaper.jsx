import React, { useEffect, useRef, useState } from 'react';

export default function LiveModelWallpaper() {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('sphere'); // 'sphere' | 'waves' | 'cube' | 'particles'
  const [showControls, setShowControls] = useState(false);

  // Keep refs for animation variables to avoid re-running useEffect
  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates and target for smooth interpolation (inertia)
    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2, active: false };

    // 3D rotation angles
    let angleX = 0.003;
    let angleY = 0.005;
    let currentRotationX = 0;
    let currentRotationY = 0;

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Handle Mouse
    const handleMouseMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // --- 3D MATH UTILS ---
    const focalLength = 400;

    const rotateX = (point, rad) => {
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const y = point.y * cos - point.z * sin;
      const z = point.y * sin + point.z * cos;
      return { ...point, y, z };
    };

    const rotateY = (point, rad) => {
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const x = point.x * cos + point.z * sin;
      const z = -point.x * sin + point.z * cos;
      return { ...point, x, z };
    };

    const rotateZ = (point, rad) => {
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const x = point.x * cos - point.y * sin;
      const y = point.x * sin + point.y * cos;
      return { ...point, x, y };
    };

    const project = (point) => {
      // Shift slightly in z so it doesn't clip behind camera
      const zOffset = point.z + 400;
      if (zOffset <= 0) return null;
      const scale = focalLength / zOffset;
      return {
        x: point.x * scale + width / 2,
        y: point.y * scale + height / 2,
        depth: scale,
      };
    };

    // --- GENERATE GEOMETRIES ---
    // 1. Sphere Points (Fibonacci distribution for even spacing)
    const generateSphere = (numPoints) => {
      const pts = [];
      const radius = 180;
      for (let i = 0; i < numPoints; i++) {
        const theta = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
        const phi = Math.acos(0) * 4 * 0.618033 * i; // Golden ratio angle
        pts.push({
          x: radius * Math.sin(theta) * Math.cos(phi),
          y: radius * Math.sin(theta) * Math.sin(phi),
          z: radius * Math.cos(theta),
          ox: 0, oy: 0, oz: 0 // Original coordinates (for reset/morph)
        });
      }
      return pts;
    };

    // 2. Wave Grid
    const generateWaveGrid = (cols, rows) => {
      const pts = [];
      const spacingX = 40;
      const spacingZ = 40;
      const startX = -((cols - 1) * spacingX) / 2;
      const startZ = -((rows - 1) * spacingZ) / 2;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          pts.push({
            x: startX + c * spacingX,
            y: 0,
            z: startZ + r * spacingZ,
            col: c,
            row: r,
          });
        }
      }
      return pts;
    };

    // 3. Hypercube (Tesseract: 16 vertices)
    const generateHypercube = () => {
      const pts = [];
      const size1 = 100;
      const size2 = 180;
      // Inner cube
      for (let x of [-1, 1]) {
        for (let y of [-1, 1]) {
          for (let z of [-1, 1]) {
            pts.push({ x: x * size1, y: y * size1, z: z * size1, group: 'inner' });
          }
        }
      }
      // Outer cube
      for (let x of [-1, 1]) {
        for (let y of [-1, 1]) {
          for (let z of [-1, 1]) {
            pts.push({ x: x * size2, y: y * size2, z: z * size2, group: 'outer' });
          }
        }
      }
      return pts;
    };

    // 4. Free Floating Star Particles
    const generateParticles = (num) => {
      const pts = [];
      for (let i = 0; i < num; i++) {
        pts.push({
          x: (Math.random() - 0.5) * 800,
          y: (Math.random() - 0.5) * 800,
          z: (Math.random() - 0.5) * 800,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: (Math.random() - 0.5) * 0.5,
        });
      }
      return pts;
    };

    const spherePts = generateSphere(140);
    const wavePts = generateWaveGrid(18, 18);
    const cubePts = generateHypercube();
    const particlePts = generateParticles(100);

    let time = 0;

    // --- ANIMATION LOOP ---
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const activeMode = modeRef.current;
      time += 0.01;

      // Mouse inertia / follow
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Adjust rotation speed depending on mouse offset from center
      const mouseOffsetX = (mouse.x - width / 2) / (width / 2);
      const mouseOffsetY = (mouse.y - height / 2) / (height / 2);

      let rx = angleX + mouseOffsetY * 0.01;
      let ry = angleY + mouseOffsetX * 0.01;

      currentRotationX += rx;
      currentRotationY += ry;

      // Draw Cursor Ambient Light Glow
      if (mouse.active) {
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          300
        );
        grad.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
        grad.addColorStop(0.5, 'rgba(236, 72, 153, 0.03)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // --- RENDER MODES ---
      if (activeMode === 'sphere') {
        // Project points and sort by depth for correct Z-ordering
        const projected = spherePts
          .map((pt) => {
            // Apply rotations
            let rotated = rotateX(pt, currentRotationX);
            rotated = rotateY(rotated, currentRotationY);
            
            // Add interaction: push away slightly from mouse
            if (mouse.active) {
              const projTemp = project(rotated);
              if (projTemp) {
                const dx = projTemp.x - mouse.x;
                const dy = projTemp.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                  const force = (200 - dist) * 0.15;
                  rotated.x += (dx / dist) * force;
                  rotated.y += (dy / dist) * force;
                }
              }
            }

            const proj = project(rotated);
            return proj ? { ...proj, originalZ: rotated.z } : null;
          })
          .filter(Boolean);

        // Sort: back points first
        projected.sort((a, b) => b.originalZ - a.originalZ);

        // Connect near neighbors
        ctx.lineWidth = 0.5;
        for (let i = 0; i < projected.length; i++) {
          const p1 = projected[i];
          for (let j = i + 1; j < projected.length; j++) {
            const p2 = projected[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Connect if close in 2D space and depth scale is similar
            if (dist < 85 && Math.abs(p1.depth - p2.depth) < 0.25) {
              const opacity = (1 - dist / 85) * 0.15 * p1.depth;
              ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        // Draw points
        projected.forEach((pt) => {
          const size = Math.max(1, pt.depth * 2.8);
          // Front points are pink/violet, back points are indigo/dim
          const colorVal = pt.originalZ > 0 
            ? `rgba(236, 72, 153, ${0.35 + pt.depth * 0.35})` 
            : `rgba(99, 102, 241, ${0.15 + pt.depth * 0.25})`;

          ctx.fillStyle = colorVal;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
          ctx.fill();

          // Highlight node with outer ring if close to cursor
          if (mouse.active) {
            const dx = pt.x - mouse.x;
            const dy = pt.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
              ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist / 80) * 0.6})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, size * 2.5, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        });

      } else if (activeMode === 'waves') {
        // Waves Grid Mode
        // We modify the Y coordinate of wave grid points based on time & sin curves
        const projected = wavePts
          .map((pt) => {
            // Compute animated height (Y)
            const dCenter = Math.sqrt(pt.x * pt.x + pt.z * pt.z);
            let yVal = Math.sin(dCenter * 0.015 - time * 2) * 45;

            // Add interaction: mouse depresses/elevates waves
            if (mouse.active) {
              // Create virtual 3D position of mouse on the plane
              const mx3d = mouse.x - width / 2;
              const mz3d = (mouse.y - height / 2) * 1.5;
              const dx = pt.x - mx3d;
              const dz = pt.z - mz3d;
              const dist2d = Math.sqrt(dx * dx + dz * dz);
              if (dist2d < 180) {
                const force = Math.cos((dist2d / 180) * Math.PI) * 40;
                yVal += force;
              }
            }

            let rotated = { x: pt.x, y: yVal - 50, z: pt.z }; // offset y up slightly for perspective
            
            // Rotate the whole grid tilted downwards slightly
            rotated = rotateX(rotated, 0.6 + mouseOffsetY * 0.15);
            rotated = rotateY(rotated, time * 0.05 + mouseOffsetX * 0.2);

            const proj = project(rotated);
            return proj ? { ...proj, col: pt.col, row: pt.row, originalY: yVal } : null;
          })
          .filter(Boolean);

        // Render grid lines connecting columns and rows
        ctx.lineWidth = 0.5;
        for (let i = 0; i < projected.length; i++) {
          const p1 = projected[i];

          // Find column neighbor
          const colNeighbor = projected.find(p => p.col === p1.col + 1 && p.row === p1.row);
          if (colNeighbor) {
            const opacity = 0.08 * p1.depth;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(colNeighbor.x, colNeighbor.y);
            ctx.stroke();
          }

          // Find row neighbor
          const rowNeighbor = projected.find(p => p.col === p1.col && p.row === p1.row + 1);
          if (rowNeighbor) {
            const opacity = 0.08 * p1.depth;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(rowNeighbor.x, rowNeighbor.y);
            ctx.stroke();
          }
        }

        // Draw node points
        projected.forEach((pt) => {
          const size = Math.max(0.8, pt.depth * 1.8);
          // Color based on height (originalY)
          const heightColor = pt.originalY > 0 
            ? `rgba(236, 72, 153, ${0.15 + pt.depth * 0.35})`
            : `rgba(99, 102, 241, ${0.15 + pt.depth * 0.35})`;

          ctx.fillStyle = heightColor;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
          ctx.fill();
        });

      } else if (activeMode === 'cube') {
        // Hypercube Wireframe (Inner & Outer Cube)
        const projected = cubePts.map((pt) => {
          let rotated = rotateX(pt, currentRotationX);
          rotated = rotateY(rotated, currentRotationY);
          rotated = rotateZ(rotated, currentRotationX * 0.5);

          const proj = project(rotated);
          return proj ? { ...proj, group: pt.group } : null;
        }).filter(Boolean);

        // Draw connections
        ctx.lineWidth = 0.8;
        const connectCube = (indicesOffset, strokeStyle) => {
          // A cube has 8 vertices. Connect edges.
          // Indices mapping for 1 cube:
          // 0: ---, 1: --+, 2: -+-, 3: -++, 4: +--, 5: +-+, 6: ++-, 7: +++
          const edges = [
            [0, 1], [0, 2], [0, 4],
            [1, 3], [1, 5],
            [2, 3], [2, 6],
            [3, 7],
            [4, 5], [4, 6],
            [5, 7],
            [6, 7]
          ];

          edges.forEach(([u, v]) => {
            const p1 = projected[u + indicesOffset];
            const p2 = projected[v + indicesOffset];
            if (p1 && p2) {
              ctx.strokeStyle = strokeStyle;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          });
        };

        // Draw Inner Cube
        connectCube(0, 'rgba(236, 72, 153, 0.25)');
        // Draw Outer Cube
        connectCube(8, 'rgba(99, 102, 241, 0.2)');

        // Draw Connecting lines between inner & outer cubes
        for (let i = 0; i < 8; i++) {
          const p1 = projected[i];
          const p2 = projected[i + 8];
          if (p1 && p2) {
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw Vertices
        projected.forEach((pt) => {
          const size = pt.group === 'inner' ? 4 : 5;
          const color = pt.group === 'inner' ? '#ec4899' : '#6366f1';
          ctx.fillStyle = color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, size * pt.depth, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        });

      } else if (activeMode === 'particles') {
        // Space Particle Flow
        particlePts.forEach((pt) => {
          // Update position
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.z += pt.vz;

          // Boundary wraps
          const limit = 400;
          if (pt.x > limit) pt.x = -limit;
          if (pt.x < -limit) pt.x = limit;
          if (pt.y > limit) pt.y = -limit;
          if (pt.y < -limit) pt.y = limit;
          if (pt.z > limit) pt.z = -limit;
          if (pt.z < -limit) pt.z = limit;

          // Slow rotation
          let rotated = rotateX(pt, currentRotationX * 0.2);
          rotated = rotateY(rotated, currentRotationY * 0.2);

          const proj = project(rotated);
          if (proj) {
            const size = Math.max(0.5, proj.depth * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + proj.depth * 0.4})`;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
            ctx.fill();

            // Connect particle to cursor if extremely close
            if (mouse.active) {
              const dx = proj.x - mouse.x;
              const dy = proj.y - mouse.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 120) {
                ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 120) * 0.2})`;
                ctx.beginPath();
                ctx.moveTo(proj.x, proj.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
              }
            }
          }
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      />
      {/* Control Widget for Premium Feel */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          fontFamily: "'Outfit', sans-serif",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
        }}
      >
        <button
          onClick={() => setShowControls(!showControls)}
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '99px',
            color: 'white',
            padding: '8px 16px',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: 'var(--glass-shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s ease',
          }}
          className="wallpaper-toggle-btn"
        >
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981',
            animation: 'pulse 1.5s infinite',
          }} />
          <style>{`
            @keyframes pulse {
              0% { transform: scale(0.9); opacity: 0.6; }
              50% { transform: scale(1.2); opacity: 1; }
              100% { transform: scale(0.9); opacity: 0.6; }
            }
            .wallpaper-toggle-btn:hover {
              background: rgba(255,255,255,0.08);
              border-color: rgba(255,255,255,0.2);
            }
          `}</style>
          Live Background: {mode.toUpperCase()}
        </button>

        {showControls && (
          <div
            style={{
              background: 'rgba(10, 10, 15, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '12px',
              boxShadow: 'var(--glass-shadow)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              animation: 'slideUp 0.2s ease-out',
            }}
          >
            <style>{`
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .mode-btn {
                background: transparent;
                border: none;
                color: var(--text-secondary);
                text-align: left;
                padding: 6px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.8rem;
                font-family: inherit;
                transition: all 0.2s ease;
              }
              .mode-btn.active {
                background: rgba(99, 102, 241, 0.15);
                color: white;
                border: 1px solid rgba(99, 102, 241, 0.3);
              }
              .mode-btn:hover:not(.active) {
                background: rgba(255, 255, 255, 0.05);
                color: white;
              }
            `}</style>
            <button
              className={`mode-btn ${mode === 'sphere' ? 'active' : ''}`}
              onClick={() => { setMode('sphere'); setShowControls(false); }}
            >
              🌐 Neural Sphere
            </button>
            <button
              className={`mode-btn ${mode === 'waves' ? 'active' : ''}`}
              onClick={() => { setMode('waves'); setShowControls(false); }}
            >
              🌊 Quantum Waves
            </button>
            <button
              className={`mode-btn ${mode === 'cube' ? 'active' : ''}`}
              onClick={() => { setMode('cube'); setShowControls(false); }}
            >
              🧊 Cyber Tesseract
            </button>
            <button
              className={`mode-btn ${mode === 'particles' ? 'active' : ''}`}
              onClick={() => { setMode('particles'); setShowControls(false); }}
            >
              ✨ Starfield Drift
            </button>
          </div>
        )}
      </div>
    </>
  );
}
