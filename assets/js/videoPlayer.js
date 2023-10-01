(() => {
  const e = document.querySelector("video"),
    t = document.getElementById("play"),
    n = t.querySelector("i"),
    d = document.getElementById("mute"),
    u = d.querySelector("i"),
    a = document.getElementById("volume"),
    l = document.getElementById("currentTime"),
    s = document.getElementById("totalTime"),
    o = document.getElementById("timeline"),
    i = document.getElementById("fullScreen"),
    m = i.querySelector("i"),
    r = document.getElementById("videoContainer"),
    c = document.getElementById("videoControls");
  let v = null,
    E = null,
    f = 0.5;
  e.volume = f;
  const y = (e) => new Date(1e3 * e).toISOString().substring(14, 19),
    L = () => c.classList.remove("showing");
  t.addEventListener("click", (t) => {
    e.paused ? e.play() : e.pause(),
      (n.classList = e.paused ? "fas fa-play" : "fas fa-pause");
  }),
    d.addEventListener("click", (t) => {
      e.muted ? (e.muted = !1) : (e.muted = !0),
        (u.classList = e.muted ? "fas fa-volume-mute" : "fas fa-volume-up"),
        (a.value = e.muted ? 0 : f);
    }),
    a.addEventListener("input", (t) => {
      const {
        target: { value: n }
      } = t;
      e.muted && ((e.muted = !1), (d.innerText = "Mute")),
        (f = n),
        (e.volume = n);
    }),
    e.addEventListener("loadeddata", () => {
      (s.innerText = y(Math.floor(e.duration))),
        (o.max = Math.floor(e.duration));
    }),
    e.addEventListener("timeupdate", () => {
      (l.innerText = y(Math.floor(e.currentTime))),
        (o.value = Math.floor(e.currentTime));
    }),
    e.addEventListener("ended", () => {
      const { id: e } = r.dataset;
      fetch(`/api/videos/${e}/view`, { method: "POST" });
    }),
    r.addEventListener("mousemove", () => {
      v && (clearTimeout(v), (v = null)),
        E && (clearTimeout(E), (E = null)),
        c.classList.add("showing"),
        (E = setTimeout(L, 3e3));
    }),
    r.addEventListener("mouseleave", () => {
      v = setTimeout(L, 3e3);
    }),
    o.addEventListener("input", (t) => {
      const {
        target: { value: n }
      } = t;
      e.currentTime = n;
    }),
    i.addEventListener("click", () => {
      document.fullscreenElement
        ? ((m.classList = "fas fa-expand"), document.exitFullscreen())
        : (r.requestFullscreen(), (m.classList = "fas fa-compress"));
    });
})();
