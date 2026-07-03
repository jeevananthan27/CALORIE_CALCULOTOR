import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroOrb() {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const width = el.clientWidth,
      height = el.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 6.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.PointLight(0xffe3b0, 1.4, 20);
    key.position.set(4, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x9bcb93, 0.7, 20);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, 3),
      new THREE.MeshStandardMaterial({
        color: 0xe08a2c,
        emissive: 0x7a3d05,
        emissiveIntensity: 0.35,
        roughness: 0.35,
        metalness: 0.1,
      })
    );
    scene.add(core);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.4, 1),
      new THREE.MeshBasicMaterial({ color: 0x1c2b1e, wireframe: true, transparent: true, opacity: 0.12 })
    );
    scene.add(shell);

    const satDefs = [
      { color: 0xa6334f, radius: 2.15, size: 0.34, speed: 0.62, tilt: 0.35 },
      { color: 0x3e6e8e, radius: 2.65, size: 0.30, speed: -0.46, tilt: -0.5 },
      { color: 0xe4c98b, radius: 3.05, size: 0.4, speed: 0.34, tilt: 0.15 },
      { color: 0x4c7a4a, radius: 3.45, size: 0.26, speed: -0.55, tilt: 0.7 },
    ];
    const group = new THREE.Group();
    scene.add(group);
    const satellites = satDefs.map((def) => {
      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.x = def.tilt;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(def.radius - 0.006, def.radius + 0.006, 128),
        new THREE.MeshBasicMaterial({ color: 0x1c2b1e, transparent: true, opacity: 0.1, side: THREE.DoubleSide })
      );
      ring.rotation.x = Math.PI / 2;
      orbitGroup.add(ring);
      const sat = new THREE.Mesh(
        new THREE.SphereGeometry(def.size, 32, 32),
        new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.4, metalness: 0.15 })
      );
      sat.position.set(def.radius, 0, 0);
      orbitGroup.add(sat);
      group.add(orbitGroup);
      return { orbitGroup, speed: def.speed };
    });

    let mx = 0,
      my = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    el.addEventListener("pointermove", onMove);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    const animate = (t) => {
      raf = requestAnimationFrame(animate);
      const time = t * 0.001;
      if (!reduced) {
        core.rotation.y = time * 0.15;
        core.rotation.x = time * 0.08;
        shell.rotation.y = -time * 0.06;
        satellites.forEach((s) => {
          s.orbitGroup.rotation.z = time * s.speed;
        });
      }
      group.rotation.y += (mx * 0.4 - group.rotation.y) * 0.04;
      group.rotation.x += (-my * 0.25 - group.rotation.x) * 0.04;
      renderer.render(scene, camera);
    };
    animate(0);

    const onResize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointermove", onMove);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mount} className="relative aspect-square w-full max-w-[440px] mx-auto" />;
}
