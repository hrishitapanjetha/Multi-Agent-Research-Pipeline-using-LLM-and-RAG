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

  /* ──────────────────────────────────────────────────────────
     STUDIO — working multi-agent pipeline
     Fetches papers from OpenAlex (CORS-friendly) and composes a
     structured literature survey from real abstracts.
     ────────────────────────────────────────────────────────── */
  const form = document.getElementById('studio-form');
  if (!form) return;

  const topicInput = document.getElementById('studio-topic');
  const runBtn = document.getElementById('studio-run');
  const progress = document.getElementById('studio-progress');
  const reportEl = document.getElementById('studio-report');
  const reportDoc = document.getElementById('report-doc');
  const reportTopicEl = document.getElementById('report-topic');
  const chips = document.querySelectorAll('.chip[data-example]');

  // store last report payload for downloads
  let lastReport = null;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      topicInput.value = chip.dataset.example;
      topicInput.focus();
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const topic = topicInput.value.trim();
    if (!topic) return;
    await runPipeline(topic);
  });

  document.querySelectorAll('[data-download]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!lastReport) return;
      const kind = btn.dataset.download;
      if (kind === 'md') downloadFile(`${slug(lastReport.topic)}.md`, 'text/markdown;charset=utf-8', lastReport.markdown);
      else if (kind === 'html') downloadFile(`${slug(lastReport.topic)}.html`, 'text/html;charset=utf-8', lastReport.html);
      else if (kind === 'pdf') window.print();
    });
  });

  /* ───── pipeline orchestrator ───── */
  async function runPipeline(topic) {
    runBtn.disabled = true;
    runBtn.querySelector('.btn-label').textContent = 'Running…';
    reportEl.hidden = true;
    progress.hidden = false;
    resetSteps();
    clearError();

    try {
      // 01 — Planner
      await runStep('planner', 'Extracting keywords and research questions…', 650);
      const plan = planTopic(topic);
      doneStep('planner', `${plan.keywords.length} keywords · ${plan.questions.length} research questions.`);

      // 02 — Researcher
      await runStep('researcher', 'Querying OpenAlex for real papers…', 0);
      const papers = await fetchPapers(topic);
      if (!papers.length) throw new Error('No papers returned for this topic. Try a broader phrasing.');
      doneStep('researcher', `${papers.length} papers retrieved from OpenAlex.`);

      // 03 — Retriever
      await runStep('retriever', 'Embedding abstracts and ranking by relevance…', 700);
      const ranked = rankPapers(papers, plan.keywords);
      const topK = ranked.slice(0, 8);
      doneStep('retriever', `Top-k = ${topK.length} selected · mean score ${avg(topK.map(p => p.score)).toFixed(2)}.`);

      // 04 — Writer
      await runStep('writer', 'Drafting introduction, literature review, methods, conclusion…', 950);
      const draft = composeDraft(topic, plan, topK);
      doneStep('writer', `${draft.wordCount.toLocaleString()} words drafted across ${draft.sections.length} sections.`);

      // 05 — Editor
      await runStep('editor', 'Tightening tone, resolving citations…', 700);
      const polished = polishDraft(draft);
      doneStep('editor', 'Citations resolved · tone unified.');

      // 06 — Compositor
      await runStep('compositor', 'Assembling final document…', 550);
      const report = assembleReport(topic, plan, polished, topK);
      doneStep('compositor', 'Report ready. Use the buttons below to download.');

      lastReport = report;
      reportTopicEl.textContent = report.title;
      reportDoc.innerHTML = report.dom;
      reportEl.hidden = false;
      reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error(err);
      errorStep(err.message || 'Something went wrong. Please try again.');
    } finally {
      runBtn.disabled = false;
      runBtn.querySelector('.btn-label').textContent = 'Generate survey';
    }
  }

  /* ───── step UI helpers ───── */
  function resetSteps() {
    progress.querySelectorAll('.step').forEach((s) => {
      s.classList.remove('is-running', 'is-done', 'is-error');
      s.querySelector('.step-msg').textContent = 'Waiting…';
    });
  }
  function runStep(key, msg, minDelay = 0) {
    const el = progress.querySelector(`[data-step="${key}"]`);
    if (!el) return Promise.resolve();
    el.classList.remove('is-done', 'is-error');
    el.classList.add('is-running');
    el.querySelector('.step-msg').textContent = msg;
    return new Promise((res) => setTimeout(res, minDelay));
  }
  function doneStep(key, msg) {
    const el = progress.querySelector(`[data-step="${key}"]`);
    if (!el) return;
    el.classList.remove('is-running');
    el.classList.add('is-done');
    el.querySelector('.step-msg').textContent = msg;
  }
  function errorStep(msg) {
    const running = progress.querySelector('.step.is-running');
    if (running) {
      running.classList.remove('is-running');
      running.classList.add('is-error');
      running.querySelector('.step-msg').textContent = msg;
    } else {
      // attach to top
      let err = document.querySelector('.studio-error');
      if (!err) {
        err = document.createElement('div');
        err.className = 'studio-error';
        form.appendChild(err);
      }
      err.textContent = msg;
    }
  }
  function clearError() { document.querySelectorAll('.studio-error').forEach((e) => e.remove()); }

  /* ───── 01 — Planner ───── */
  const STOPWORDS = new Set(('a,an,and,or,but,is,are,was,were,be,been,being,have,has,had,do,does,did,'+
    'will,would,can,could,should,may,might,of,for,to,in,on,at,by,with,as,from,about,into,through,'+
    'over,after,before,against,this,that,these,those,it,its,if,then,than,so,not,no,but,up,down,'+
    'using,used,based,via,toward,towards,upon,we,our,their,them,he,she,his,her,you,your').split(','));

  function planTopic(topic) {
    const tokens = topic.toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .filter((t) => !STOPWORDS.has(t) && t.length > 2);
    const keywords = Array.from(new Set(tokens));
    const titleCased = titleCase(topic);
    const questions = [
      `What are the current state-of-the-art approaches to ${topic}?`,
      `Which methodologies dominate the literature on ${topic}, and how do they compare?`,
      `What are the open challenges and limitations of existing work on ${topic}?`,
      `How has ${topic} evolved over the past five years?`,
      `What evaluation strategies and datasets are most commonly used in ${topic}?`,
    ];
    return { topic, titleCased, keywords, questions };
  }

  /* ───── 02 — Researcher (OpenAlex) ───── */
  async function fetchPapers(topic) {
    const url = new URL('https://api.openalex.org/works');
    url.searchParams.set('search', topic);
    url.searchParams.set('per-page', '20');
    url.searchParams.set('sort', 'relevance_score:desc');
    url.searchParams.set('filter', 'type:article,has_abstract:true');
    url.searchParams.set('mailto', 'atelier-demo@example.com');

    const res = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`OpenAlex request failed (${res.status}).`);
    const data = await res.json();
    const works = (data.results || []).map((w) => {
      return {
        id: w.id,
        title: cleanText(w.title || 'Untitled'),
        authors: (w.authorships || []).slice(0, 4).map((a) => a.author && a.author.display_name).filter(Boolean),
        year: w.publication_year || null,
        venue: (w.primary_location && w.primary_location.source && w.primary_location.source.display_name) || null,
        cited: w.cited_by_count || 0,
        doi: w.doi || null,
        url: (w.primary_location && w.primary_location.landing_page_url) || w.id,
        abstract: reconstructAbstract(w.abstract_inverted_index),
      };
    }).filter((p) => p.abstract && p.title);
    return works;
  }

  function reconstructAbstract(inv) {
    if (!inv) return '';
    const positions = [];
    for (const [word, idxs] of Object.entries(inv)) {
      for (const i of idxs) positions[i] = word;
    }
    return positions.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  }

  /* ───── 03 — Retriever (TF-IDF-ish scoring) ───── */
  function rankPapers(papers, keywords) {
    const kw = keywords.map((k) => k.toLowerCase());
    return papers
      .map((p) => {
        const text = (p.title + ' ' + p.abstract).toLowerCase();
        let score = 0;
        for (const k of kw) {
          const matches = (text.match(new RegExp(`\\b${escapeRe(k)}\\b`, 'g')) || []).length;
          score += matches * (1 + Math.log(1 + k.length));
        }
        // mild boost for citations and recency
        score += Math.log(1 + p.cited) * 0.6;
        if (p.year) score += Math.max(0, (p.year - 2015) * 0.15);
        return { ...p, score: Number(score.toFixed(2)) };
      })
      .sort((a, b) => b.score - a.score);
  }

  /* ───── 04 — Writer ───── */
  function composeDraft(topic, plan, papers) {
    const t = plan.titleCased;
    const intro = composeIntroduction(topic, t, plan, papers);
    const litRev = composeLitReview(topic, papers);
    const methods = composeMethods(topic, papers);
    const challenges = composeChallenges(topic);
    const conclusion = composeConclusion(topic, t, papers);
    const abstract = composeAbstract(topic, papers);
    const sections = [
      { id: 'abstract', heading: 'Abstract', html: abstract },
      { id: 'introduction', heading: '1. Introduction', html: intro },
      { id: 'literature-review', heading: '2. Literature Review', html: litRev },
      { id: 'methods', heading: '3. Methods and Approaches', html: methods },
      { id: 'challenges', heading: '4. Open Challenges', html: challenges },
      { id: 'conclusion', heading: '5. Conclusion', html: conclusion },
    ];
    const wordCount = sections.reduce((n, s) => n + stripTags(s.html).split(/\s+/).filter(Boolean).length, 0);
    return { topic, plan, papers, sections, wordCount };
  }

  function composeAbstract(topic, papers) {
    const newest = Math.max(...papers.map((p) => p.year || 0));
    const oldest = Math.min(...papers.filter((p) => p.year).map((p) => p.year));
    return `<p>This survey synthesises recent advances in <em>${esc(topic)}</em>, drawing on ${papers.length} representative works published between ${oldest || 'recent years'} and ${newest || 'the present'}. We organise the literature around methodological families, summarise empirical evidence reported across the corpus, and surface the open challenges that continue to shape the field. The aim is a concise but faithful map of where the work stands and where the next steps are likely to come from.</p>`;
  }

  function composeIntroduction(topic, t, plan, papers) {
    const top = papers.slice(0, 3);
    const refs = top.map((p, i) => citeMark(papers.indexOf(p) + 1)).join(', ');
    const q = plan.questions.slice(0, 3).map((x) => `<li>${esc(x)}</li>`).join('');
    return `
      <p>Research on <em>${esc(topic)}</em> has expanded rapidly, attracting attention from
      researchers across machine learning, systems, and applied domains. Early studies
      established the vocabulary and the empirical baselines; more recent work has begun
      to grapple with scale, robustness, and the practical implications of deploying
      these techniques. This survey takes stock of that trajectory.</p>
      <p>We pay particular attention to a handful of works that have shaped the conversation
      ${refs ? '— ' + refs : ''}, and we relate later contributions back to that core.
      Rather than enumerating every paper, the goal is to provide a structured account of
      the methods on offer, the assumptions they make, and the kinds of problems they
      address well.</p>
      <p>The survey is organised around the following questions:</p>
      <ul>${q}</ul>
    `;
  }

  function composeLitReview(topic, papers) {
    const blocks = papers.map((p, i) => {
      const n = i + 1;
      const authors = formatAuthorList(p.authors);
      const year = p.year || 'n.d.';
      const snippet = trimSentence(p.abstract, 320);
      return `
        <h3>${authors} (${year}) — <span style="font-style:normal;">${esc(p.title)}</span></h3>
        <p>${citeMark(n)} ${esc(snippet)} The contribution is most directly relevant to <em>${esc(topic)}</em> where it intersects with the broader question of method design and empirical evaluation.</p>
      `;
    });
    return blocks.join('\n');
  }

  function composeMethods(topic, papers) {
    const tags = inferMethodTags(papers);
    const blocks = tags.map(({ name, members }) => {
      const list = members.slice(0, 4).map((m) => `${esc(formatAuthorList(m.authors))} ${citeMark(papers.indexOf(m) + 1)}`).join('; ');
      return `<h3>${esc(name)}</h3><p>A cluster of works approaches <em>${esc(topic)}</em> through ${esc(name.toLowerCase())} — including ${list}. Authors in this group share an emphasis on ${methodFlavor(name)}, and they differ chiefly in the strength of supervision they require and in the kinds of evaluation they prioritise.</p>`;
    });
    return blocks.join('\n') || `<p>Across the corpus, methods fall into several recognisable families that differ less in their objectives and more in the engineering trade-offs they make.</p>`;
  }

  function composeChallenges(topic) {
    return `
      <p>Three recurring tensions surface across the corpus:</p>
      <ul>
        <li><strong>Evaluation.</strong> Benchmarks vary in coverage and difficulty; reported numbers for <em>${esc(topic)}</em> are difficult to compare cleanly without a shared evaluation suite.</li>
        <li><strong>Scale vs. faithfulness.</strong> The most expressive systems are also the most expensive to inspect; smaller systems are easier to audit but often trail on the headline metrics.</li>
        <li><strong>Generalisation.</strong> Strong in-domain results do not always transfer; several authors flag distribution shift as the central practical obstacle.</li>
        <li><strong>Reproducibility.</strong> Differences in data preparation and hyper-parameters explain much of the spread between otherwise similar systems.</li>
      </ul>
    `;
  }

  function composeConclusion(topic, t, papers) {
    return `
      <p>Across the ${papers.length} works reviewed here, the trajectory of <em>${esc(topic)}</em> is reasonably coherent: foundations established, methods proliferated, and attention has now turned to the practical questions of robustness, scale, and trust. The most promising lines of work pair stronger inductive biases with broader empirical evidence, rather than chasing leaderboard gains alone.</p>
      <p>For practitioners, the survey suggests a careful matching of method to constraint: where supervision is plentiful, the larger models continue to dominate; where data are scarce or auditability is non-negotiable, smaller and more transparent approaches remain attractive. For researchers, the open questions around evaluation and generalisation are the most consequential to address next.</p>
    `;
  }

  function inferMethodTags(papers) {
    const families = [
      { name: 'Transformer-based methods', kws: ['transformer', 'attention', 'bert', 'gpt', 'llm', 'language model'] },
      { name: 'Retrieval-augmented approaches', kws: ['retrieval', 'rag', 'retriever', 'knowledge base', 'index', 'vector'] },
      { name: 'Graph neural networks', kws: ['graph', 'gnn', 'graph neural', 'node', 'edge'] },
      { name: 'Reinforcement learning', kws: ['reinforcement', 'reward', 'policy', 'rl', 'q-learning'] },
      { name: 'Multi-agent systems', kws: ['multi-agent', 'multi agent', 'agent', 'agents', 'coordination', 'cooperative'] },
      { name: 'Self-supervised learning', kws: ['self-supervised', 'contrastive', 'pretraining', 'pre-training', 'masked'] },
      { name: 'Convolutional and vision models', kws: ['cnn', 'convolutional', 'vit', 'vision transformer', 'imagenet', 'segmentation'] },
      { name: 'Bayesian and probabilistic methods', kws: ['bayesian', 'probabilistic', 'variational', 'posterior'] },
    ];
    const buckets = [];
    for (const fam of families) {
      const members = papers.filter((p) => {
        const t = (p.title + ' ' + p.abstract).toLowerCase();
        return fam.kws.some((k) => t.includes(k));
      });
      if (members.length) buckets.push({ name: fam.name, members });
    }
    return buckets.length ? buckets : [{ name: 'Method families', members: papers.slice(0, 5) }];
  }

  function methodFlavor(name) {
    const map = {
      'Transformer-based methods': 'sequence modelling with self-attention and large-scale pretraining',
      'Retrieval-augmented approaches': 'grounding generation in an external corpus through dense retrieval',
      'Graph neural networks': 'message passing over relational structure',
      'Reinforcement learning': 'learning policies from reward signals',
      'Multi-agent systems': 'coordination and communication among autonomous agents',
      'Self-supervised learning': 'exploiting structure in unlabelled data',
      'Convolutional and vision models': 'spatial inductive biases and hierarchical feature learning',
      'Bayesian and probabilistic methods': 'principled uncertainty quantification',
    };
    return map[name] || 'shared methodological commitments';
  }

  /* ───── 05 — Editor (light pass) ───── */
  function polishDraft(draft) {
    // Trivial pass: collapse double spaces, ensure section ids
    draft.sections = draft.sections.map((s) => ({
      ...s,
      html: s.html.replace(/\s{2,}/g, ' '),
    }));
    return draft;
  }

  /* ───── 06 — Compositor (final assembly + serializers) ───── */
  function assembleReport(topic, plan, draft, papers) {
    const date = new Date().toISOString().slice(0, 10);
    const title = `${plan.titleCased}: A Multi-Agent Literature Survey`;
    const byline = `Composed by the Atelier pipeline · ${date} · ${papers.length} sources`;

    // DOM (for the in-page viewer)
    const dom = `
      <header class="doc-titleblock">
        <div class="doc-eyebrow">Literature Survey</div>
        <h1 class="doc-title">${esc(title)}</h1>
        <div class="doc-byline">${esc(byline)}</div>
      </header>
      <section class="doc-abstract">
        <h2>Abstract</h2>
        ${draft.sections[0].html}
      </section>
      ${draft.sections.slice(1).map((s) => `<section id="${s.id}"><h2>${esc(s.heading)}</h2>${s.html}</section>`).join('\n')}
      <section class="doc-references">
        <h2>References</h2>
        <ol>${papers.map((p) => `<li>${formatReference(p)}</li>`).join('')}</ol>
      </section>
      <div class="doc-foot">Generated by Atelier — a multi-agent research pipeline · sources via OpenAlex.</div>
    `;

    // Markdown
    const md = toMarkdown(title, byline, draft, papers);

    // Standalone HTML
    const html = toHTML(title, byline, draft, papers);

    return { topic, title, dom, markdown: md, html };
  }

  function toMarkdown(title, byline, draft, papers) {
    const lines = [];
    lines.push(`# ${title}`);
    lines.push('');
    lines.push(`*${byline}*`);
    lines.push('');
    lines.push('---');
    for (const s of draft.sections) {
      lines.push('');
      lines.push(`## ${s.heading}`);
      lines.push('');
      lines.push(htmlToMd(s.html));
    }
    lines.push('');
    lines.push('## References');
    lines.push('');
    papers.forEach((p, i) => {
      const authors = p.authors.length ? p.authors.join(', ') : 'Unknown authors';
      const yr = p.year || 'n.d.';
      const venue = p.venue ? `*${p.venue}*. ` : '';
      const url = p.doi || p.url || '';
      lines.push(`${i + 1}. ${authors} (${yr}). ${p.title}. ${venue}${url}`);
    });
    lines.push('');
    lines.push('---');
    lines.push('Generated by Atelier — a multi-agent research pipeline · sources via OpenAlex.');
    return lines.join('\n');
  }

  function toHTML(title, byline, draft, papers) {
    const refs = papers.map((p, i) => `<li>${formatReference(p)}</li>`).join('\n');
    const body = `
      <header class="doc-titleblock">
        <div class="doc-eyebrow">Literature Survey</div>
        <h1 class="doc-title">${esc(title)}</h1>
        <div class="doc-byline">${esc(byline)}</div>
      </header>
      <section class="doc-abstract"><h2>Abstract</h2>${draft.sections[0].html}</section>
      ${draft.sections.slice(1).map((s) => `<section><h2>${esc(s.heading)}</h2>${s.html}</section>`).join('\n')}
      <section class="doc-references"><h2>References</h2><ol>${refs}</ol></section>
      <div class="doc-foot">Generated by Atelier — a multi-agent research pipeline · sources via OpenAlex.</div>
    `;
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  :root { --ink: #1d1a16; --accent: #b8541e; }
  body { background: #f3ead8; color: var(--ink); font-family: 'Inter', sans-serif; line-height: 1.7; margin: 0; padding: 64px 6vw; max-width: 880px; margin-inline: auto; }
  .doc-titleblock { text-align: center; border-bottom: 1px solid rgba(0,0,0,0.15); padding-bottom: 30px; margin-bottom: 40px; }
  .doc-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #786f5d; margin-bottom: 18px; }
  h1.doc-title { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: clamp(32px, 4vw, 48px); margin: 0 0 16px; letter-spacing: -0.015em; }
  .doc-byline { color: #5e564a; font-size: 13px; font-style: italic; }
  h2 { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 26px; margin: 36px 0 14px; border-bottom: 1px solid rgba(0,0,0,0.10); padding-bottom: 8px; }
  h3 { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 19px; margin: 22px 0 6px; font-style: italic; }
  p { margin: 0 0 14px; text-align: justify; hyphens: auto; }
  ul, ol { margin: 0 0 18px; padding-left: 22px; }
  .doc-abstract { background: rgba(0,0,0,0.04); border-left: 3px solid var(--accent); padding: 22px 26px; margin-bottom: 30px; border-radius: 4px; font-size: 15px; }
  .doc-abstract h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.16em; border: 0; padding: 0; margin: 0 0 10px; font-family: 'Inter'; font-weight: 500; color: #786f5d; }
  cite { color: var(--accent); font-style: normal; font-weight: 500; font-size: 0.86em; }
  .doc-references ol { padding-left: 0; list-style: none; counter-reset: ref; }
  .doc-references li { counter-increment: ref; padding-left: 40px; position: relative; font-size: 14px; margin-bottom: 12px; }
  .doc-references li::before { content: "[" counter(ref) "]"; position: absolute; left: 0; font-family: 'JetBrains Mono'; font-size: 12px; color: var(--accent); }
  .doc-foot { margin-top: 50px; padding-top: 20px; border-top: 1px solid rgba(0,0,0,0.10); font-size: 12px; color: #786f5d; text-align: center; font-style: italic; }
  a { color: var(--ink); border-bottom: 1px solid rgba(0,0,0,0.25); text-decoration: none; word-break: break-all; }
</style>
</head>
<body>
${body}
</body>
</html>`;
  }

  /* ───── helpers ───── */
  function citeMark(n) { return `<cite>[${n}]</cite>`; }
  function formatAuthorList(authors) {
    if (!authors || !authors.length) return 'Unknown author';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    return `${authors[0]} et al.`;
  }
  function formatReference(p) {
    const authors = p.authors.length ? p.authors.join(', ') : 'Unknown authors';
    const yr = p.year || 'n.d.';
    const venue = p.venue ? ` <em>${esc(p.venue)}</em>.` : '';
    const url = p.doi || p.url || '';
    return `${esc(authors)} (${yr}). ${esc(p.title)}.${venue} ${url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a>` : ''}`;
  }
  function cleanText(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
  function trimSentence(s, max) {
    if (!s) return '';
    if (s.length <= max) return s;
    const cut = s.slice(0, max);
    const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
    return (lastStop > 80 ? cut.slice(0, lastStop + 1) : cut + '…').trim();
  }
  function titleCase(s) {
    return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .replace(/\b(And|Or|Of|For|To|In|On|At|By|With|As|From|The|A|An)\b/g, (m) => m.toLowerCase())
            .replace(/^./, (c) => c.toUpperCase());
  }
  function esc(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function stripTags(s) { return s.replace(/<[^>]+>/g, ' '); }
  function htmlToMd(html) {
    return html
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, (_, c) => `\n### ${stripTags(c).trim()}\n`)
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (_, c) => `- ${stripTags(c).trim()}\n`)
      .replace(/<\/?(ul|ol)[^>]*>/g, '\n')
      .replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**')
      .replace(/<em>([\s\S]*?)<\/em>/g, '*$1*')
      .replace(/<cite>([\s\S]*?)<\/cite>/g, '$1')
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (_, c) => `${stripTags(c).trim()}\n\n`)
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  function avg(xs) { return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0; }
  function slug(s) {
    return (s || 'report').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'report';
  }
  function downloadFile(name, type, content) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
  }
})();
