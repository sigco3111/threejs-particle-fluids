import { WebGPURenderer } from 'three/webgpu';
import type { WebGPURendererParameters } from 'three/src/renderers/webgpu/WebGPURenderer.js';

/** Device limits the solver's scan and contact kernels need. */
const REQUIRED_LIMITS: Record<string, number> = {
  maxComputeInvocationsPerWorkgroup: 1024,
  maxComputeWorkgroupSizeX: 1024,
  maxStorageBuffersPerShaderStage: 10,
};

/**
 * Create and initialize a `WebGPURenderer` with the device limits the solver
 * needs. Throws if WebGPU is unavailable, because the simulation has no
 * WebGL fallback.
 */
export async function createParticleRenderer(
  options: Partial<WebGPURendererParameters> = {},
): Promise<WebGPURenderer> {
  const requiredLimits: Record<string, number> = { ...options.requiredLimits };
  for (const [name, value] of Object.entries(REQUIRED_LIMITS)) {
    requiredLimits[name] = Math.max(requiredLimits[name] ?? 0, value);
  }
  const renderer = new WebGPURenderer({ ...options, requiredLimits });
  await renderer.init();
  if ((renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend !== true) {
    renderer.dispose();
    throw new Error(
      'createParticleRenderer: WebGPU를 사용할 수 없으며 이 라이브러리는 WebGL 대체를 지원하지 않습니다. ' +
        'WebGPU가 활성화된 브라우저를 사용하세요(Linux Chromium에서는 --enable-unsafe-webgpu 전달).',
    );
  }
  return renderer;
}
