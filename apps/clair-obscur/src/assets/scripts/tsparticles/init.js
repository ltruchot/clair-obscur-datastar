window.tsParticlesReady = (async function() {
  if (typeof window.tsParticles === 'undefined') {
    console.error('tsParticles not loaded');
    return false;
  }

  try {
    await window.loadEmittersPlugin(window.tsParticles);
    await window.loadRotateUpdater(window.tsParticles);
    await window.loadTiltUpdater(window.tsParticles);
    await window.loadRollUpdater(window.tsParticles);
    await window.loadWobbleUpdater(window.tsParticles);
    console.log('tsParticles plugins loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading tsParticles plugins:', error);
    return false;
  }
})();
