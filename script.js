document.addEventListener('DOMContentLoaded', function () {
    const navLinks = Array.from(document.querySelectorAll('.nav-menu a[data-page]'));
    const content = document.getElementById('content');
    const footer = document.getElementById('footer');
    const scrollTopBtn = document.getElementById('scrollTop');
    const pages = navLinks.map(link => link.dataset.page);

    function currentPage() {
        const page = window.location.hash.substring(1);
        return pages.includes(page) ? page : pages[0];
    }

    async function loadPage(page) {
        navLinks.forEach(link => link.classList.toggle('is-active', link.dataset.page === page));

        try {
            const response = await fetch(`content/${page}.md`, { cache: 'no-cache' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const markdown = await response.text();

            // Ignore the result if the visitor has already clicked another tab
            if (page !== currentPage()) return;

            content.innerHTML = `<div class="markdown-content">${marked.parse(markdown, { gfm: true, breaks: true })}</div>`;

            // External links open in a new tab
            content.querySelectorAll('a[href^="http"]').forEach(link => {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            });

            const lastModified = response.headers.get('Last-Modified');
            footer.textContent = lastModified
                ? 'Last updated: ' + new Date(lastModified).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
                : '';

            if (window.MathJax && MathJax.typesetPromise) {
                MathJax.typesetPromise([content]).catch(err => console.error('MathJax error:', err));
            }
        } catch (error) {
            console.error(error);
            const hint = window.location.protocol === 'file:'
                ? 'Pages cannot be loaded when index.html is opened directly from disk. Run <code>serve.ps1</code> (see README) and open http://localhost:8000 instead.'
                : `Check that <code>content/${page}.md</code> exists.`;
            content.innerHTML = `<p class="status error">Could not load this page. ${hint}</p>`;
            footer.textContent = '';
        }
    }

    window.addEventListener('hashchange', function () {
        loadPage(currentPage());
        window.scrollTo({ top: 0 });
    });
    loadPage(currentPage());

    window.addEventListener('scroll', function () {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
