/* ──────────────────────────────────────────────────────────
   Atelier — micro-interactions
   - cursor spotlight follower
   - scroll reveal via IntersectionObserver
   - stat counter
   - terminal typewriter
   ────────────────────────────────────────────────────────── */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── cursor spotlight ─── */
  const spotlight = document.getElementById('spotlight');
  if (spotlight && !reduceMotion) {
    let tx = window.innerWidth / 2, ty = window.innerHeight * 0.3;
    let x = tx, y = ty;
    window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      spotlight.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ─── scroll reveal ─── */
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in-view'));
  }

  /* ─── stat counters ─── */
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const statsIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(eased * target).toString();
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = target.toString();
        };
        requestAnimationFrame(step);
        statsIo.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => statsIo.observe(c));
  }

  /* ─── terminal typewriter ─── */
  const typer = document.getElementById('typer');
  if (typer) {
    const lines = [
      { t: '<span class="tok-prompt">$</span> <span class="tok-acc">atelier</span> run --topic <span class="tok-acc">"agentic memory architectures"</span>' },
      { t: '' },
      { t: '<span class="tok-dim">[planner]</span>   <span class="tok-agent">→</span> extracting keywords  <span class="tok-ok">✓</span>' },
      { t: '<span class="tok-dim">[planner]</span>   <span class="tok-agent">→</span> 5 research questions drafted' },
      { t: '<span class="tok-dim">[research]</span>  <span class="tok-agent">→</span> querying arxiv.org      <span class="tok-ok">✓</span>' },
      { t: '<span class="tok-dim">[research]</span>  <span class="tok-agent">→</span> 42 papers retrieved' },
      { t: '<span class="tok-dim">[retrieval]</span> <span class="tok-agent">→</span> embedding (384d, MiniLM-L6-v2)' },
      { t: '<span class="tok-dim">[retrieval]</span> <span class="tok-agent">→</span> FAISS index ready · top-k = 8' },
      { t: '<span class="tok-dim">[writer]</span>    <span class="tok-agent">→</span> drafting introduction…' },
      { t: '<span class="tok-dim">[writer]</span>    <span class="tok-agent">→</span> drafting literature review…' },
      { t: '<span class="tok-dim">[editor]</span>    <span class="tok-agent">→</span> tightening tone · resolving citations' },
      { t: '<span class="tok-dim">[compositor]</span><span class="tok-agent">→</span> assembling report.pdf  <span class="tok-ok">✓</span>' },
      { t: '' },
      { t: '<span class="tok-ok">→ saved</span> reports/agentic_memory_2026-05-16.pdf' },
    ];

    const speed = reduceMotion ? 0 : 14;
    const linePause = reduceMotion ? 0 : 180;
    let lineIdx = 0;
    let charIdx = 0;
    let active = '';
    let html = '';

    function nextChar() {
      if (reduceMotion) {
        typer.innerHTML = lines.map(l => l.t).join('\n');
        return;
      }
      if (lineIdx >= lines.length) {
        setTimeout(() => {
          html = ''; lineIdx = 0; charIdx = 0; active = '';
          typer.innerHTML = '';
          nextChar();
        }, 4500);
        return;
      }
      const current = lines[lineIdx].t;
      if (charIdx === 0) active = '';
      // Walk character-by-character respecting HTML tags
      if (charIdx < current.length) {
        if (current[charIdx] === '<') {
          const end = current.indexOf('>', charIdx);
          active += current.slice(charIdx, end + 1);
          charIdx = end + 1;
        } else {
          active += current[charIdx];
          charIdx++;
        }
        typer.innerHTML = html + active;
        setTimeout(nextChar, speed);
      } else {
        html += active + '\n';
        active = '';
        lineIdx++;
        charIdx = 0;
        typer.innerHTML = html;
        setTimeout(nextChar, linePause);
      }
    }

    // Defer start until terminal scrolls into view
    if ('IntersectionObserver' in window) {
      const tIo = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            nextChar();
            tIo.disconnect();
          }
        });
      }, { threshold: 0.25 });
      tIo.observe(typer);
    } else {
      nextChar();
    }
  }

  /* ─── parallax title (subtle) ─── */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !reduceMotion) {
    window.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 4;
      heroTitle.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, { passive: true });
  }
})();
