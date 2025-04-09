import { effectScope as G, isRef as W, toValue as J, ref as y, computed as I, onMounted as V, onBeforeUnmount as H, defineComponent as q, createElementBlock as z, createCommentVNode as Q, unref as U, openBlock as k, normalizeStyle as Y, Fragment as B, renderList as ee, createBlock as te, resolveDynamicComponent as ne, createVNode as re, render as F, markRaw as le } from "vue";
function oe(e) {
  let t = !1, n;
  const i = G(!0);
  return (...a) => (t || (n = i.run(() => e(...a)), t = !0), n);
}
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const N = () => {
};
function ie(e, t) {
  function n(...i) {
    return new Promise((a, l) => {
      Promise.resolve(e(() => t.apply(this, i), { fn: t, thisArg: this, args: i })).then(a).catch(l);
    });
  }
  return n;
}
function se(...e) {
  let t = 0, n, i = !0, a = N, l, s, d, v, h;
  !W(e[0]) && typeof e[0] == "object" ? { delay: s, trailing: d = !0, leading: v = !0, rejectOnCancel: h = !1 } = e[0] : [s, d = !0, v = !0, h = !1] = e;
  const u = () => {
    n && (clearTimeout(n), n = void 0, a(), a = N);
  };
  return (r) => {
    const o = J(s), f = Date.now() - t, p = () => l = r();
    return u(), o <= 0 ? (t = Date.now(), p()) : (f > o && (v || !i) ? (t = Date.now(), p()) : d && (l = new Promise((D, x) => {
      a = h ? x : D, n = setTimeout(() => {
        t = Date.now(), i = !0, D(p()), u();
      }, Math.max(0, o - f));
    })), !v && !n && (n = setTimeout(() => i = !0, o)), i = !1, l);
  };
}
function ae(e, t = 200, n = !1, i = !0, a = !1) {
  return ie(
    se(t, n, i, a),
    e
  );
}
const T = oe(() => {
  const e = y([]), t = I(() => e.value.length > 0), n = {
    component: y(null),
    ref: y(null)
  }, i = y([]), a = y([]), l = y([]), s = {
    zone: y(null),
    element: y(null)
  }, d = {
    current: y(null),
    start: y(null),
    offset: {
      percent: y(null),
      pixel: y(null)
    }
  };
  return {
    isDragging: t,
    activeContainer: n,
    elements: i,
    draggingElements: e,
    selectedElements: a,
    zones: l,
    hovered: s,
    pointerPosition: d
  };
}), ue = () => {
  const e = y(null), { draggingElements: t, pointerPosition: n, isDragging: i, activeContainer: a } = T();
  return V(() => {
    a.ref = e;
  }), H(() => {
    a.ref.value = null;
  }), {
    elementRef: e,
    draggingElements: t,
    pointerPosition: n,
    isDragging: i
  };
}, ce = ["innerHTML"], de = /* @__PURE__ */ q({
  __name: "DefaultOverlay",
  setup(e) {
    const { elementRef: t, pointerPosition: n, isDragging: i, draggingElements: a } = ue(), l = I(() => {
      var s, d, v, h;
      return {
        transform: `translate3d(${(((s = n.current.value) == null ? void 0 : s.x) ?? 0) - (((d = n.offset.pixel.value) == null ? void 0 : d.x) ?? 0)}px, ${(((v = n.current.value) == null ? void 0 : v.y) ?? 0) - (((h = n.offset.pixel.value) == null ? void 0 : h.y) ?? 0)}px, 0)`,
        zIndex: 1e3,
        position: "fixed",
        top: 0,
        left: 0,
        transition: "0.3s cubic-bezier(0.165, 0.84, 0.44, 1)"
      };
    });
    return (s, d) => U(i) ? (k(), z("div", {
      key: 0,
      ref_key: "elementRef",
      ref: t,
      style: Y(l.value)
    }, [
      (k(!0), z(B, null, ee(U(a), (v, h) => {
        var u, E;
        return k(), z("div", {
          key: h,
          innerHTML: v.initialHTML,
          style: Y({
            width: `${(u = v.initialRect) == null ? void 0 : u.width}px`,
            height: `${(E = v.initialRect) == null ? void 0 : E.height}px`
          })
        }, null, 12, ce);
      }), 128))
    ], 4)) : Q("", !0);
  }
}), Z = /* @__PURE__ */ q({
  __name: "DragOverlay",
  setup(e) {
    const { activeContainer: t } = T(), n = I(
      () => t.component.value ?? de
    );
    return (i, a) => (k(), te(ne(n.value)));
  }
}), Pe = {
  install(e) {
    e.component("DragOverlay", Z);
    const t = e.mount;
    e.mount = function(i) {
      const a = t.call(this, i), l = typeof i == "string" ? document.querySelector(i) : i;
      if (l && l instanceof Element && !l.querySelector("#vue-dnd-kit-overlay")) {
        const s = document.createElement("div");
        s.id = "vue-dnd-kit-overlay", s.style.pointerEvents = "none", l.appendChild(s);
        const d = re(Z);
        F(d, s), e.__VUE_DND_KIT_OVERLAY__ = {
          container: s,
          vnode: d
        };
      }
      return a;
    };
    const n = e.unmount;
    e.unmount = function() {
      return e.__VUE_DND_KIT_OVERLAY__ && (F(null, e.__VUE_DND_KIT_OVERLAY__.container), delete e.__VUE_DND_KIT_OVERLAY__), n.call(this);
    };
  }
}, b = "data-vue-dnd-kit-draggable", L = (e) => {
  e.preventDefault();
}, ve = (e) => {
  const {
    elements: t,
    draggingElements: n,
    hovered: i,
    selectedElements: a,
    isDragging: l
  } = T(), s = y(null), d = I(
    () => {
      var r;
      return ((r = i.element.value) == null ? void 0 : r.node) === s.value;
    }
  ), v = I(
    () => n.value.some((r) => r.node === s.value)
  ), h = I(() => {
    if (!s.value || !l.value) return !1;
    const r = t.value.find(
      (o) => o.node === s.value
    );
    return r != null && r.groups.length ? !n.value.some((o) => o.groups.length ? !o.groups.some(
      (f) => r.groups.includes(f)
    ) : !1) : !0;
  });
  return {
    elementRef: s,
    registerElement: () => {
      if (!s.value) throw new Error("ElementRef is not set");
      t.value.push({
        node: s.value,
        groups: (e == null ? void 0 : e.groups) ?? [],
        layer: (e == null ? void 0 : e.layer) ?? null,
        defaultLayer: (e == null ? void 0 : e.layer) ?? null,
        events: (e == null ? void 0 : e.events) ?? {},
        data: (e == null ? void 0 : e.data) ?? void 0
      }), s.value.addEventListener("dragstart", L), s.value.addEventListener("drag", L), s.value.setAttribute(b, "true"), s.value.setAttribute("draggable", "false"), s.value.style.touchAction = "none";
    },
    unregisterElement: () => {
      var f, p, D, x;
      const r = t.value.findIndex(
        (c) => c.node === s.value
      );
      r !== -1 && t.value.splice(r, 1);
      const o = a.value.findIndex(
        (c) => c.node === s.value
      );
      o !== -1 && a.value.splice(o, 1), (f = s.value) == null || f.removeEventListener("dragstart", L), (p = s.value) == null || p.removeEventListener("drag", L), (D = s.value) == null || D.removeAttribute(b), (x = s.value) == null || x.removeAttribute("draggable");
    },
    isDragging: v,
    isOvered: d,
    isAllowed: h
  };
}, ge = () => {
  let e = "", t = "", n = "";
  return {
    disableInteractions: () => {
      const l = document.body;
      e = l.style.userSelect, l.style.userSelect = "none", window.addEventListener("contextmenu", L), window.addEventListener("selectstart", L), window.addEventListener("touchstart", L), window.addEventListener("touchmove", L);
    },
    enableInteractions: () => {
      const l = document.body;
      l.style.userSelect = e, l.style.touchAction = t, l.style.overscrollBehavior = n, window.removeEventListener("contextmenu", L), window.removeEventListener("selectstart", L), window.removeEventListener("touchstart", L), window.removeEventListener("touchmove", L);
    }
  };
}, K = (e, t) => e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y, R = (e) => {
  if (!e)
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    };
  const t = e.getBoundingClientRect();
  return {
    bottom: t.bottom,
    left: t.left,
    right: t.right,
    top: t.top,
    x: t.x,
    y: t.y,
    width: t.width,
    height: t.height
  };
}, A = (e) => ({
  x: e.x + e.width / 2,
  y: e.y + e.height / 2
}), fe = (e, t) => {
  const n = R(e);
  return {
    pixel: {
      x: t.x - n.x,
      y: t.y - n.y
    },
    percent: {
      x: (t.x - n.x) / n.width * 100,
      y: (t.y - n.y) / n.height * 100
    }
  };
}, X = (e, t) => {
  const n = t.x - e.x, i = t.y - e.y;
  return Math.sqrt(n * n + i * i);
}, $ = (e, t) => {
  const n = Math.max(
    0,
    Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)
  ), i = Math.max(
    0,
    Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y)
  ), a = n * i, l = e.width * e.height, s = t.width * t.height;
  return (a / l * 100 + a / s * 100) / 2;
}, M = (e, t) => e ? t.contains(e) : !1, me = (e) => {
  var u, E;
  const t = R(e.activeContainer.ref.value), n = A(t), i = ((u = e.pointerPosition.current.value) == null ? void 0 : u.x) ?? 0, a = ((E = e.pointerPosition.current.value) == null ? void 0 : E.y) ?? 0, s = !(t && i >= t.x && i <= t.x + t.width && a >= t.y && a <= t.y + t.height), d = e.draggingElements.value.map((r) => r.node), v = e.elements.value.filter((r) => {
    if (!r.node || d.some(
      (f) => f && M(r.node, f)
    ))
      return !1;
    const o = R(r.node);
    return o && t && K(o, t);
  }).map((r) => {
    const o = R(r.node), f = A(o), p = i >= o.x && i <= o.x + o.width && a >= o.y && a <= o.y + o.height, D = $(o, t), x = X(n, f), c = e.elements.value.filter(
      (g) => g !== r && g.node && r.node && M(r.node, g.node)
    ).length;
    return {
      element: r,
      node: r.node,
      isPointerInElement: p,
      overlapPercent: D,
      depth: c,
      centerDistance: x
    };
  }).sort((r, o) => {
    if (!s) {
      if (r.isPointerInElement && o.isPointerInElement)
        return o.depth - r.depth;
      if (r.isPointerInElement !== o.isPointerInElement)
        return r.isPointerInElement ? -1 : 1;
    }
    return Math.abs(r.overlapPercent - o.overlapPercent) <= 1 ? r.centerDistance - o.centerDistance : o.overlapPercent - r.overlapPercent;
  }), h = e.zones.value.filter((r) => {
    if (!r.node || d.some(
      (f) => f && M(r.node, f)
    ))
      return !1;
    const o = R(r.node);
    return o && t && K(o, t);
  }).map((r) => {
    const o = R(r.node), f = A(o), p = i >= o.x && i <= o.x + o.width && a >= o.y && a <= o.y + o.height, D = $(o, t), x = X(n, f), c = e.zones.value.filter(
      (g) => g !== r && g.node && r.node && M(r.node, g.node)
    ).length;
    return {
      zone: r,
      node: r.node,
      isPointerInElement: p,
      overlapPercent: D,
      depth: c,
      centerDistance: x
    };
  }).sort((r, o) => {
    if (!s) {
      if (r.isPointerInElement && o.isPointerInElement)
        return o.depth - r.depth;
      if (r.isPointerInElement !== o.isPointerInElement)
        return r.isPointerInElement ? -1 : 1;
    }
    return Math.abs(r.overlapPercent - o.overlapPercent) <= 1 ? r.centerDistance - o.centerDistance : o.overlapPercent - r.overlapPercent;
  });
  return [
    ...v.map((r) => r.node),
    ...h.map((r) => r.node)
  ];
}, he = (e) => {
  const t = T();
  return {
    onPointerStart: (l) => {
      t.pointerPosition.start.value = { x: l.clientX, y: l.clientY }, t.pointerPosition.current.value = {
        x: l.clientX,
        y: l.clientY
      };
      const { pixel: s, percent: d } = fe(e.value, {
        x: l.clientX,
        y: l.clientY
      });
      t.pointerPosition.offset.pixel.value = s, t.pointerPosition.offset.percent.value = d;
    },
    onPointerMove: (l) => {
      t.pointerPosition.current.value = {
        x: l.clientX,
        y: l.clientY
      };
    },
    onPointerEnd: () => {
      t.pointerPosition.current.value = null, t.pointerPosition.start.value = null, t.pointerPosition.offset.pixel.value = null, t.pointerPosition.offset.percent.value = null;
    }
  };
}, Ee = (e, t) => {
  const n = T(), { onPointerStart: i, onPointerMove: a, onPointerEnd: l } = he(e);
  let s = null;
  const d = (c) => {
    var C, S;
    const g = n.selectedElements.value.some(
      (m) => m.node === c
    );
    if (n.selectedElements.value.length && g)
      return n.selectedElements.value.map((m) => {
        var _, w;
        return {
          ...m,
          initialHTML: ((_ = m.node) == null ? void 0 : _.outerHTML) ?? "",
          initialRect: (w = m.node) == null ? void 0 : w.getBoundingClientRect()
        };
      });
    n.selectedElements.value = [];
    const P = n.elements.value.find(
      (m) => m.node === c
    );
    return P ? [
      {
        ...P,
        initialHTML: ((C = P.node) == null ? void 0 : C.outerHTML) ?? "",
        initialRect: (S = P.node) == null ? void 0 : S.getBoundingClientRect()
      }
    ] : [];
  }, v = (c) => {
    if (!c)
      return { element: null, zone: null };
    const g = Array.isArray(c) ? c : [c], P = n.draggingElements.value.map(
      (m) => m.node
    ), [C] = g.map(
      (m) => n.elements.value.find((_) => _.node === m)
    ).filter((m) => m ? m.groups.length ? !n.draggingElements.value.some(
      (w) => w.groups.length ? !w.groups.some(
        (O) => m.groups.includes(O)
      ) : !1
    ) : !0 : !1), [S] = g.map((m) => {
      const _ = n.zones.value.find((w) => w.node === m);
      return !_ || P.some(
        (w) => w && M(m, w)
      ) || _.groups.length && !!n.draggingElements.value.some((O) => O.groups.length ? !O.groups.some((j) => _.groups.includes(j)) : !1) ? null : _;
    });
    return {
      element: C ?? null,
      zone: S ?? null
    };
  }, h = (t == null ? void 0 : t.sensor) || me, u = (c) => {
    var C, S, m, _, w, O;
    const g = n.hovered.element.value, P = n.hovered.zone.value;
    n.hovered.element.value = c.element, n.hovered.zone.value = c.zone, n.hovered.element.value !== g && ((C = g == null ? void 0 : g.events) != null && C.onLeave && g.events.onLeave(n), (m = (S = n.hovered.element.value) == null ? void 0 : S.events) != null && m.onHover && n.hovered.element.value.events.onHover(n)), n.hovered.zone.value !== P && ((_ = P == null ? void 0 : P.events) != null && _.onLeave && P.events.onLeave(n), (O = (w = n.hovered.zone.value) == null ? void 0 : w.events) != null && O.onHover && n.hovered.zone.value.events.onHover(n));
  }, E = ae(() => {
    const c = h(n), g = v(c);
    u(g);
  }, (t == null ? void 0 : t.throttle) ?? 0), r = () => {
    E(), s = requestAnimationFrame(r);
  }, o = () => r(), f = () => {
    s !== null && (cancelAnimationFrame(s), s = null);
  };
  return {
    activate: (c) => {
      n.draggingElements.value = d(e.value), i(c), o();
    },
    track: (c) => {
      a(c);
    },
    deactivate: () => {
      var c, g;
      l(), n.hovered.zone.value ? (g = (c = n.hovered.zone.value.events).onDrop) == null || g.call(c, n) : n.draggingElements.value.forEach(
        (P) => {
          var C, S;
          return (S = (C = P.events).onEnd) == null ? void 0 : S.call(C, n);
        }
      ), n.draggingElements.value = [], n.selectedElements.value = [], n.hovered.zone.value = null, n.hovered.element.value = null, f();
    }
  };
}, we = (e) => {
  const {
    elementRef: t,
    registerElement: n,
    unregisterElement: i,
    isDragging: a,
    isOvered: l,
    isAllowed: s
  } = ve(e), { disableInteractions: d, enableInteractions: v } = ge(), { activeContainer: h, pointerPosition: u } = T(), { activate: E, track: r, deactivate: o } = Ee(t, {
    throttle: e == null ? void 0 : e.throttle,
    sensor: e == null ? void 0 : e.sensor
  }), f = (c) => {
    e != null && e.container && (h.component.value = le(e.container)), d(), E(c), document.addEventListener("pointermove", p), document.addEventListener("pointerup", x), document.addEventListener("wheel", D);
  }, p = (c) => r(c), D = (c) => r(c), x = () => {
    h.component.value = null, v(), o(), document.removeEventListener("pointermove", p), document.removeEventListener("pointerup", x), document.removeEventListener("wheel", D);
  };
  return V(n), H(i), {
    pointerPosition: u,
    elementRef: t,
    isDragging: a,
    isOvered: l,
    isAllowed: s,
    handleDragStart: f
  };
}, ye = (e) => {
  const { zones: t, hovered: n, draggingElements: i, isDragging: a } = T(), l = y(null), s = I(() => {
    var u;
    return ((u = n.zone.value) == null ? void 0 : u.node) === l.value;
  }), d = I(() => {
    if (!l.value || !a.value) return !1;
    const u = t.value.find(
      (E) => E.node === l.value
    );
    return u != null && u.groups.length ? !i.value.some((E) => E.groups.length ? !E.groups.some(
      (r) => u.groups.includes(r)
    ) : !1) : !0;
  });
  return { elementRef: l, registerZone: () => {
    if (!l.value) throw new Error("elementRef is not set");
    t.value.push({
      node: l.value,
      groups: (e == null ? void 0 : e.groups) ?? [],
      events: (e == null ? void 0 : e.events) ?? {},
      data: (e == null ? void 0 : e.data) ?? void 0
    }), l.value.setAttribute("data-dnd-droppable", "true");
  }, unregisterZone: () => {
    if (!l.value) throw new Error("elementRef is not set");
    const u = t.value.findIndex(
      (E) => E.node === l.value
    );
    u !== -1 && t.value.splice(u, 1);
  }, isOvered: s, isAllowed: d };
}, De = (e) => {
  const { elementRef: t, registerZone: n, unregisterZone: i, isOvered: a, isAllowed: l } = ye(e);
  return V(n), H(i), { elementRef: t, isOvered: a, isAllowed: l };
}, _e = (e) => {
  const { selectedElements: t, elements: n } = T(), i = I(
    () => n.value.find((u) => u.node === e.value)
  ), a = I(
    () => t.value.some((u) => u.node === e.value)
  ), l = I(() => e.value ? t.value.some(
    (u) => u.node && M(
      u.node,
      e.value
    )
  ) : !1), s = I(() => e.value ? t.value.some(
    (u) => u.node && M(
      e.value,
      u.node
    )
  ) : !1), d = () => {
    i.value && (t.value = t.value.filter(
      (u) => u.node !== e.value
    ));
  }, v = () => {
    i.value && (l.value && (t.value = t.value.filter(
      (u) => u.node && !M(
        u.node,
        e.value
      )
    )), s.value && (t.value = t.value.filter(
      (u) => u.node && !M(
        e.value,
        u.node
      )
    )), t.value.push(i.value));
  };
  return {
    handleUnselect: d,
    handleSelect: v,
    handleToggleSelect: () => {
      i.value && (t.value.some((u) => u.node === e.value) ? d() : v());
    },
    isSelected: a,
    isParentOfSelected: l
  };
};
export {
  Pe as default,
  T as useDnDStore,
  we as useDraggable,
  De as useDroppable,
  _e as useSelection
};
