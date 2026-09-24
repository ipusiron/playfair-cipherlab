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
        cancelAnimationFrame(this.scrollFrame);
        this.target?.classList.remove('guide-target');
        this.target = null;
    }

    render() {
        if (!this.id) return;
        const snapshot = this.ui.getSnapshot();
        const states = ProgressCore.stepStates(this.id, snapshot);
        const current = states.indexOf('current');
        const complete = current < 0;
        const stateKey = this.id + ':' + current;
        if (this.stateKey !== stateKey) {
            this.clearTarget();
            this.stateKey = stateKey;
            this.statusKey = null;
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
            if (this.id === 'M3' && index === 2) this.appendRuleHints(li, snapshot);
            list.appendChild(li);
        });
        const key = this.statusKey || (complete ? 'guide.complete' : 'guide.advanced');
        const message = i18n.t(key, { n: current + 1 });
        const status = document.getElementById('guide-status');
        if (status.textContent !== message) status.textContent = message;
        document.getElementById('guide-go').hidden = complete;
        document.getElementById('guide-next').hidden = !complete || !ProgressCore.summary(this.ui.progress).next;
    }

    appendRuleHints(li, snapshot) {
        const remaining = ['row', 'column', 'rectangle'].filter(rule => !snapshot.rulesSeenNow.includes(rule));
        if (!remaining.length) return;
        const append = (key, rules) => {
            const line = document.createElement('p');
            const separator = i18n.currentLang === 'ja' ? String.fromCodePoint(0x30fb) : ', ';
            line.textContent = i18n.t(key, { rules: rules.map(rule => i18n.t(`rule.name.${rule}`)).join(separator) });
            li.appendChild(line);
        };
        append('guide.m3.remaining', remaining);
        if (snapshot.encryption) {
            const missing = remaining.filter(rule => !snapshot.encryption.rules.includes(rule));
            if (missing.length) append('guide.m3.missing', missing);
        }
    }

    keepTargetVisible(target, behavior) {
        let previousY = window.scrollY;
        let stable = 0;
        let frames = 0;
        const afterScroll = () => {
            if (this.target !== target) return;
            const y = window.scrollY;
            stable = Math.abs(y - previousY) < 0.5 ? stable + 1 : 0;
            previousY = y;
            frames += 1;
            if ((frames < 6 || stable < 3) && frames < 120) {
                this.scrollFrame = requestAnimationFrame(afterScroll);
                return;
            }
            const rect = target.getBoundingClientRect();
            const top = this.section.getBoundingClientRect().top;
            const delta = rect.height > top - 32 ? rect.top - 16 : rect.bottom > top ? rect.bottom - top + 16 : 0;
            if (delta) window.scrollBy({ top: delta, behavior });
        };
        this.scrollFrame = requestAnimationFrame(afterScroll);
    }

    go() {
        if (!this.id) return;
        const states = ProgressCore.stepStates(this.id, this.ui.getSnapshot());
        const current = states.indexOf('current');
        if (current < 0) return;
        const [id, tab, options] = ProgressCore.STEPS[this.id][current];
        if (tab) document.getElementById('tab-' + tab).click();
        else this.ui.openProgress();
        let target = document.getElementById(id);
        this.statusKey = null;
        if (!target || !target.getClientRects().length) {
            target = document.querySelector('#' + (tab || this.ui.currentTab) + ' h2');
            target.tabIndex = -1;
            this.statusKey = 'guide.previous';
        } else if (target.disabled) {
            const alternative = options?.disabledAlt && document.getElementById(options.disabledAlt);
            if (alternative && alternative.getClientRects().length && !alternative.disabled) {
                target = alternative;
                this.statusKey = options.disabledKey;
            } else this.statusKey = 'guide.disabled';
        }
        this.render();
        this.clearTarget();
        const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        target.scrollIntoView({ block: 'center', behavior });
        target.focus({ preventScroll: true });
        target.classList.add('guide-target');
        this.target = target;
        this.timer = setTimeout(() => this.clearTarget(), 8000);
        this.keepTargetVisible(target, behavior);
    }
}
