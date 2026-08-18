// Data Models
const skills = [
  {
    iconPath: '<path d="m7 11 2-2-2-2"/><path d="M11 13h4"/><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>',
    title: 'Front-End Development',
    text: 'Next.js, React, Angular, TypeScript, Three.js (WebGL), shadcn, Tailwind CSS, Bootstrap, .NET MVC, Web Audio API'
  },
  {
    iconPath: '<line x1="22" x2="2" y1="6" y2="6"/><line x1="22" x2="2" y1="18" y2="18"/><line x1="6" x2="6" y1="2" y2="22"/><line x1="18" x2="18" y1="2" y2="22"/>',
    title: 'Design Systems',
    text: 'WCAG 2.2 Accessibility (A11y), Component Architecture, Design Tokens, Figma Design Systems, Brand Guidelines, Motion & 3D Design'
  },
  {
    iconPath: '<path d="M11 10.27 7 3.34"/><path d="m11 13.73-4 6.93"/><path d="M12 22v-2"/><path d="M12 2v2"/><path d="M14 12h8"/><path d="m17 20.66-1-1.73"/><path d="m17 3.34-1 1.73"/><path d="M2 12h2"/><path d="m20.66 17-1.73-1"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m3.34 7 1.73 1"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="8"/>',
    title: 'Tools & Platforms',
    text: 'Generative AI Workflow, Google Lighthouse, Vercel/Netlify, CI/CD Pipelines, Node.js, Azure, Shopify, Figma/Adobe CC'
  }
];

const projects = [
  {
    num: '001',
    title: 'Microsoft Developer',
    desc: 'Led front-end engineering for the Microsoft Developer homepage, building a component architecture to ensure design system alignment, accessibility compliance, and performance optimization.',
    url: 'https://developer.microsoft.com/en-us/',
    aria: 'Visit Microsoft Developer'
  },
  {
    num: '002',
    title: 'Microsoft Learn',
    desc: 'Led front-end development to migrate standalone marketing properties onto the Microsoft Learn platform, ensuring strict design system alignment, accessibility compliance, and platform security.',
    url: 'https://learn.microsoft.com/en-us/training/training-services-partners',
    aria: 'Visit Microsoft Learn'
  },
  {
    num: '003',
    title: 'M3 A11y',
    desc: 'Developed an interactive Material 3 accessibility workbench in Angular 19, delivering dynamic HCT tonal palette generation, real-time WCAG 2.2 contrast audits, and multi-format token export.',
    url: 'https://joshstruve.github.io/m3-a11y/',
    aria: 'Visit M3 A11y'
  },
  {
    num: '004',
    title: "Kessler-Voss Extractive",
    desc: 'Engineered a cinematic brand experience for a speculative lunar mining corporation, combining agentic AI workflows with a flawless 4x100 Lighthouse audit.',
    url: 'https://joshstruve.github.io/kessler-voss-extractive/',
    aria: "View Kessler-Voss Extractive"
  },
  {
    num: '005',
    title: "Tomorrow's Modern Agency",
    desc: 'Architected comprehensive UX/UI wireframes and cross-platform designs in Figma, delivering a dev-ready file structure with strict optimization for design-to-code workflows.',
    url: 'https://www.figma.com/design/psEpMAMM4mTMIwv6T4ZhT1/Tomorrow-s-Modern-Agency?node-id=7-1830&t=92J3RY9ozxDZ62ZA-1',
    aria: "View Tomorrow's Modern Agency Figma Docs"
  },
  {
    num: '006',
    title: "3D Saturn",
    desc: 'Engineered a cinematic WebGL visualization of Saturn using Three.js, featuring dynamic realtime lighting, automated camera choreography, and a multi-pass post-processing pipeline.',
    url: 'https://joshstruve.github.io/3D-Saturn/',
    aria: "View 3D Saturn"
  }
];

// Reusable SVG wrapper for consistency
const getIconSvg = (paths) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
    ${paths}
  </svg>
`;

const externalLinkSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link">
    <path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  </svg>
`;

// Render Functions
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  container.innerHTML = skills.map(skill => `
    <div class="col-12 col-lg-4">
      <div class="card h-100">
        <div class="card-body">
          <p>${getIconSvg(skill.iconPath)}</p>
          <h3 class="card-title">${skill.title}</h3>
          <p class="card-text">${skill.text}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function renderProjects() {
  const container = document.getElementById('work-container');
  if (!container) return;

  container.innerHTML = projects.map(project => `
    <div class="row py-5 d-flex align-items-center position-relative">
      <div class="col-12 col-md-8">
        <p style="font-family:var(--font-family-header);">${project.num}</p>
        <h3 class="mb-1">${project.title}</h3>
        <p class="mb-md-0">${project.desc}</p>
      </div>
      <div class="col-12 col-md-4 text-md-end">
        <a href="${project.url}" target="_blank" class="stretched-link" aria-label="${project.aria}">
          ${externalLinkSvg}
        </a>
      </div>
    </div>
    <hr class="my-0" style="border-color:var(--foreground-color); opacity: 1;">
  `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  renderProjects();
  
  // (Your existing Truchet Canvas initialization code should follow here)
});

(async function() {
    const canvas = document.getElementById('truchetCanvas');
    const gl = canvas.getContext('webgl');
    if (!gl) return;
  
    // Asynchronous resource router to fetch external files safely
    async function fetchShaderSource(path) {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load shader source: ${path}`);
      return await response.text();
    }
  
    function compileShader(src, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }
  
    try {
      // Gracefully resolve dependencies asynchronously
      const [vertexSrc, fragmentSrc] = await Promise.all([
        fetchShaderSource('shaders/truchet.vert'),
        fetchShaderSource('shaders/truchet.frag')
      ]);
  
      const vs = compileShader(vertexSrc, gl.VERTEX_SHADER);
      const fs = compileShader(fragmentSrc, gl.FRAGMENT_SHADER);
      if (!vs || !fs) return;
  
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
  
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return;
      }
  
      const posAttr = gl.getAttribLocation(program, 'position');
      const resUniform = gl.getUniformLocation(program, 'u_resolution');
      const timeUniform = gl.getUniformLocation(program, 'u_time');
      const colsUniform = gl.getUniformLocation(program, 'u_columns');
  
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,  1, -1, -1,  1,
        -1,  1,  1, -1,  1,  1
      ]), gl.STATIC_DRAW);
  
      let activeColumns = 24.0;
  
      function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
  
        if (rect.width < 768) {
          activeColumns = 12.0;
        } else {
          activeColumns = 24.0;
        }
      }
  
      window.addEventListener('resize', resize);
      resize();
  
      const epoch = performance.now();
      function loop(now) {
        gl.clearColor(0.043, 0.043, 0.047, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
  
        gl.useProgram(program);
        gl.enableVertexAttribArray(posAttr);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
  
        gl.uniform2f(resUniform, canvas.width, canvas.height);
        gl.uniform1f(timeUniform, (now - epoch) * 0.001);
        gl.uniform1f(colsUniform, activeColumns);
  
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
      
    } catch (error) {
      console.error("Pipeline breakdown initializing WebGL context:", error);
    }
  })();