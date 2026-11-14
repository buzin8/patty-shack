import type { Ref } from 'react';

interface HeroFoodStageProps {
  canvasRef: Ref<HTMLCanvasElement>;
}

/** The single persistent burger visual. Never unmounted; frames are painted by the scroll loop. */
export default function HeroFoodStage({ canvasRef }: HeroFoodStageProps) {
  return (
    <div className="absolute inset-0 z-10" style={{ backgroundColor: '#000' }}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        role="img"
        aria-label="Patty Shack classic cheeseburger separating into layers, upgraded and reassembled"
      />
    </div>
  );
}
