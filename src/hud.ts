type HUDType = "good" | "warn" | "bad";
let toastTimer: number | undefined;

const markup = `
  <div id="hudToast" class="hud-toast" role="status" aria-live="polite"></div>

  <div id="hudOverlay" class="hud-overlay" aria-hidden="true">
    <div class="hud-modal" role="dialog" aria-modal="true" aria-labelledby="hudTitle">
      <div class="hud-title" id="hudTitle">Confirm</div>
      <div class="hud-message" id="hudMessage"></div>
      <div class="hud-actions">
        <button class="hud-btn hud-btn-ghost" id="hudCancelBtn" type="button">Cancel</button>
        <button class="hud-btn hud-btn-primary" id="hudOkBtn" type="button">OK</button>
      </div>
    </div>
  </div>
`;

export function mountHUD() {
  if (document.getElementById("hudToast")) return; // already mounted
  document.body.insertAdjacentHTML("beforeend", markup);
}

export function showHUD(message: string, type: HUDType = "good", ms = 1600) {
  mountHUD();
  const el = document.getElementById("hudToast");
  if (!el) return;

  el.className = `hud-toast show ${type}`;
  el.textContent = message;

  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove("show"), ms);
}

export function confirmHUD(opts?: {
  title?: string;
  message?: string;
  okText?: string;
  cancelText?: string;
}): Promise<boolean> {
  mountHUD();

  const overlay = document.getElementById("hudOverlay");
  const titleEl = document.getElementById("hudTitle");
  const msgEl = document.getElementById("hudMessage");
  const okBtn = document.getElementById("hudOkBtn") as HTMLButtonElement | null;
  const cancelBtn = document.getElementById("hudCancelBtn") as HTMLButtonElement | null;

  if (!overlay || !titleEl || !msgEl || !okBtn || !cancelBtn) return Promise.resolve(false);

  const { title = "Confirm", message = "Are you sure?", okText = "OK", cancelText = "Cancel" } = opts ?? {};

  titleEl.textContent = title;
  msgEl.textContent = message;
  okBtn.textContent = okText;
  cancelBtn.textContent = cancelText;

  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  okBtn.focus();

  return new Promise((resolve) => {
    const cleanup = () => {
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      overlay.removeEventListener("click", onOverlay);
      document.removeEventListener("keydown", onKey);
    };

    const onOk = () => { cleanup(); resolve(true); };
    const onCancel = () => { cleanup(); resolve(false); };
    const onOverlay = (e: MouseEvent) => { if (e.target === overlay) onCancel(); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onOk();
    };

    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
    overlay.addEventListener("click", onOverlay);
    document.addEventListener("keydown", onKey);
  });
}
