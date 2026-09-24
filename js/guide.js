class Guide {
    constructor(ui) {
        this.ui = ui;
        this.id = null;
        this.opener = null;
        this.target = null;
        this.timer = null;
        this.stateKey = null;
        this.section = document.getElementById('guide');
        document.getElementById('guide-go').addEventListener('click', () => this.go());
        document.getElementById('guide-close').addEventListener('click', () => this.close());
        document.getElementById('guide-next').addEventListener('click', () => {
            const next = ProgressCore.summary(this.ui.progress).next;
            if (next) this.open(next, this.opener);
        });
        for (const event of ['input', 'change', 'click']) {
            document.addEventListener(event, () => queueMicrotask(() => this.render()));
        }
        window.addEventListener('languageChanged', () => this.render());
        document.addEventListener('keydown', event => {
            if (event.key !== 'Escape' || !this.id || event.defaultPrevented) return;
            if (!document.getElementById('help-modal').classList.contains('hidden')) return;
            event.preventDefault();
            this.close();
        }, true);
    }

    open(id, opener) {
        if (!ProgressCore.MISSIONS.some(mission => mission.id === id) || ProgressCore.isLocked(this.ui.progress, id)) return;
        this.clearTarget();
        this.id = id;
        this.opener = opener;
        this.stateKey = null;
        this.section.hidden = false;
        document.body.classList.add('guide-open');
        this.render();
        document.getElementById('guide-title').focus({ preventScroll: true });
    }

    close() {
        if (!this.id) return;
        this.clearTarget();
        this.id = null;
        this.section.hidden = true;
        document.body.classList.remove('guide-open');
        if (this.opener?.isConnected && this.opener.getClientRects().length) this.opener.focus();
        else document.getElementById('progress-toggle').focus();
    }

    clearTarget() {
        clearTimeout(this.timer);
        this.target?.classList.remove('guide-target');
        this.target = null;
    }

    render() {
        if (!this.id) return;
        const states = ProgressCore.stepStates(this.id, this.ui.getSnapshot());
        const current = states.indexOf('current');
        const complete = current < 0;
        const stateKey = this.id + ':' + current;
        if (this.stateKey !== stateKey) {
            this.clearTarget();
            this.stateKey = stateKey;
            this.fallback = false;
        }
        document.getElementById('guide-title').textContent = i18n.t('guide.title', {
            title: i18n.t(`mission.${this.id}.title`), n: complete ? states.length : current + 1, N: states.length
        });
        const list = document.getElementById('guide-steps');
        list.replaceChildren();
        states.forEach((state, index) => {
            const li = document.createElement('li');
            li.dataset.state = state;
            if (state === 'current') li.setAttribute('aria-current', 'step');
            const symbol = { done: '✅', current: '▶', todo: '○' }[state];
            li.textContent = symbol + ' ' + i18n.t(`guide.state.${state}`) + ': ' + i18n.t(`mission.${this.id}.step.${index + 1}`);
            list.appendChild(li);
        });
        const key = this.fallback ? 'guide.previous' : complete ? 'guide.complete' : 'guide.advanced';
        const message = i18n.t(key, { n: current + 1 });
        const status = document.getElementById('guide-status');
        if (status.textContent !== message) status.textContent = message;
        document.getElementById('guide-go').hidden = complete;
        document.getElementById('guide-next').hidden = !complete || !ProgressCore.summary(this.ui.progress).next;
    }

    go() {
        if (!this.id) return;
        const states = ProgressCore.stepStates(this.id, this.ui.getSnapshot());
        const current = states.indexOf('current');
        if (current < 0) return;
        const [id, tab] = ProgressCore.STEPS[this.id][current];
        if (tab) document.getElementById('tab-' + tab).click();
        else this.ui.openProgress();
        let target = document.getElementById(id);
        const unavailable = !target || !target.getClientRects().length || target.disabled;
        if (unavailable) {
            target = document.querySelector('#' + (tab || this.ui.currentTab) + ' h2');
            target.tabIndex = -1;
        }
        this.clearTarget();
        target.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        target.focus({ preventScroll: true });
        target.classList.add('guide-target');
        this.target = target;
        this.timer = setTimeout(() => this.clearTarget(), 8000);
        if (unavailable) {
            this.fallback = true;
            this.render();
        }
    }
}
